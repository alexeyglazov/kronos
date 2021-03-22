<%-- 
    Document   : subdepartments
    Created on : 31.03.2011, 13:08:03
    Author     : glazov
--%><%@page import="java.util.HashMap"%>
<%@page import="java.util.Map"%>
<%@page contentType="text/html" pageEncoding="UTF-8"
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

if("saveCurrency".equals(command)) {
    CurrencyEditForm currencyEditForm = CurrencyEditForm.getFromJson(request.getParameter("currencyEditForm"));

    if(CurrencyEditForm.Mode.CREATE.equals(currencyEditForm.getMode())) {
        if(Currency.getByName(currencyEditForm.getName()) != null) {
            %>{"status": "FAIL", "comment": "Currency with the same name already exists"}<%
        } else {
            Currency currency = new Currency();
            currency.setName(currencyEditForm.getName());
            currency.setCode(currencyEditForm.getCode());
            hs.save(currency);
            %>
            {
            "status": "OK"
            }
            <%
        }
    } else if(CurrencyEditForm.Mode.UPDATE.equals(currencyEditForm.getMode())) {
        Currency currency = (Currency)hs.get(Currency.class, new Long(currencyEditForm.getId()));
        Integer sameNameCurrencysCount = 0;
        Currency currencyTmp = Currency.getByName(currencyEditForm.getName());
        if(currencyTmp != null && currencyTmp.getId() != currency.getId()) {
            sameNameCurrencysCount++;
        }
        if(sameNameCurrencysCount > 0) {
            %>{"status": "FAIL", "comment": "Currency with the same Name already exists"}<%
        } else {
            currency.setName(currencyEditForm.getName());
            currency.setCode(currencyEditForm.getCode());
            hs.save(currency);
            %>
            {
            "status": "OK"
            }
            <%
        }
    }
} else if("deleteCurrency".equals(command)) {
    Currency currency = (Currency)hs.get(Currency.class, new Long(request.getParameter("id")));
    hs.delete(currency);
    %>
    {
    "status": "OK"
    }
    <%
} else if("checkCurrencyDependencies".equals(command)) {
    Currency currency = (Currency)hs.get(Currency.class, new Long(request.getParameter("id")));
    %>{
    "status": "OK",
    "countries": <%=CountryCurrency.getCountries(currency).size() %>
    }<%
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