<%-- 
    Document   : subdepartments
    Created on : 31.03.2011, 13:08:03
    Author     : glazov
--%><%@page import="java.util.Map"%>
<%@page import="java.util.HashMap"%>
<%@page contentType="text/html" pageEncoding="UTF-8"
    import="java.util.List"
    import="java.util.LinkedList"
    import="java.util.Locale"
    import="com.mazars.management.db.domain.*"
    import="com.mazars.management.db.vo.*"
    import="com.mazars.management.web.forms.*"
    import="com.mazars.management.db.util.HibernateUtil"
    import="org.hibernate.Session"
    import="com.google.gson.Gson"
    import="com.mazars.management.web.security.AccessChecker"
%><%
request.setCharacterEncoding("UTF-8");
Employee currentUser = (Employee)session.getAttribute("currentUser");
String command = request.getParameter("command");
Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
Gson gson = new Gson();
try {
hs.beginTransaction();
Module module = Module.getByName("Admin");

AccessChecker accessChecker = new AccessChecker();
AccessChecker.Status status = accessChecker.check(currentUser, module);
if(! AccessChecker.Status.VALID.equals(status)) {
    Map<AccessChecker.Status, String> statusComments = new HashMap<AccessChecker.Status, String>();
    statusComments.put(AccessChecker.Status.NOT_LOGGED_IN, "User is not logged in");
    statusComments.put(AccessChecker.Status.NOT_AUTHORIZED, "User is not authorized");
    statusComments.put(AccessChecker.Status.NOT_AUTHORIZED_TO_MODULE, "User is not authorized to this module");
    statusComments.put(AccessChecker.Status.PASSWORD_MUST_BE_CHANGED, "User must change the password");
    %>{"status": "<%=status %>", "comment": "<%=statusComments.get(status) %>"}<%
    hs.getTransaction().commit();
    return;
}

if("getInitialContent".equals(command)) {
    List<CurrencyVO> currencyVOs = new LinkedList<CurrencyVO>();
    for(Currency currency : Currency.getAll()) {
        currencyVOs.add(new CurrencyVO(currency));
    }
    %>
    {
    "status": "OK",
    "currencies": <% gson.toJson(currencyVOs, out); %>
    }
    <%
} else if("bindCurrency".equals(command)) {
    CurrencyBindForm currencyBindForm = CurrencyBindForm.getFromJson(request.getParameter("currencyBindForm"));
    Currency currency = (Currency)hs.get(Currency.class, new Long(currencyBindForm.getCurrencyId()));
    Country country = (Country)hs.get(Country.class, new Long(currencyBindForm.getCountryId()));
    CountryCurrency countryCurrencyTmp = CountryCurrency.getCountryCurrency(country, currency);
    if(countryCurrencyTmp == null) {
        CountryCurrency countryCurrency = new CountryCurrency();
        countryCurrency.setCountry(country);
        countryCurrency.setCurrency(currency);
        if(CountryCurrency.getCurrencies(country).isEmpty()) {
            countryCurrency.setIsMain(true);
        } else {
            countryCurrency.setIsMain(false);
        }
        hs.save(countryCurrency);
        %>
        {
        "status": "OK"
        }
        <%
    } else {
        %>{"status": "FAIL", "comment": "This Currency is already bound to this Country"}<%
    }
} else if("checkCurrencyDependencies".equals(command)) {
    CountryCurrency countryCurrency = (CountryCurrency)hs.get(CountryCurrency.class, new Long(request.getParameter("id")));
    %>
    {
        "status": "OK",
        "isMain": <%=countryCurrency.getIsMain() %>
    }
    <%
} else if("unbindCurrency".equals(command)) {
    CountryCurrency countryCurrency = (CountryCurrency)hs.get(CountryCurrency.class, new Long(request.getParameter("id")));
    hs.delete(countryCurrency);
    %>
    {
        "status": "OK"
    }
    <%
} else if("setMainCountryCurrency".equals(command)) {
    CountryCurrency countryCurrency = (CountryCurrency)hs.get(CountryCurrency.class, new Long(request.getParameter("mainCountryCurrencyId")));
    Country country = countryCurrency.getCountry();
    for(CountryCurrency countryCurrencyTmp : country.getCountryCurrencies()) {
        if(! countryCurrencyTmp.getId().equals(countryCurrency.getId())) {
            countryCurrencyTmp.setIsMain(false);
        } else {
            countryCurrencyTmp.setIsMain(true);
        }
        hs.save(countryCurrencyTmp);
    }
    %>
    {
        "status": "OK"
    }
    <%
}
hs.getTransaction().commit();

} catch (Exception ex) {
    hs.getTransaction().rollback();
    %>
    {
        "status": "FAIL",
        "comment": <% gson.toJson(ex.toString(), out); %>
    }
    <%
}
%>