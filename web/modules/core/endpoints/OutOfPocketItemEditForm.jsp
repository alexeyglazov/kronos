<%-- 
    Document   : subdepartments
    Created on : 31.03.2011, 13:08:03
    Author     : glazov
--%>
<%@page import="java.util.Map"%>
<%@page import="com.mazars.management.db.util.CalendarUtil"%>
<%@page contentType="text/html" pageEncoding="UTF-8"
    import="java.util.Collections"
    import="java.util.List"
    import="java.util.LinkedList"
    import="java.util.Locale"
    import="com.mazars.management.db.domain.*"
    import="com.mazars.management.db.vo.*"
    import="com.mazars.management.web.forms.*"
    import="com.mazars.management.db.util.HibernateUtil"
    import="com.mazars.management.web.vo.*"
    import="org.hibernate.Session"
    import="com.google.gson.Gson"
    import="com.mazars.management.web.security.AccessChecker"
    import="java.util.Collection"
    import="com.mazars.management.db.comparators.StandardPositionComparator"
    import="java.util.GregorianCalendar"
    import="java.util.Calendar"
    import="java.util.HashMap"
%><%
request.setCharacterEncoding("UTF-8");
Employee currentUser = (Employee)session.getAttribute("currentUser");
String command = request.getParameter("command");
Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
Gson gson = new Gson();
try {
hs.beginTransaction();
Module module = Module.getByName("Financial Information");


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
    ProjectCode projectCode = (ProjectCode)hs.get(ProjectCode.class, new Long(request.getParameter("projectCodeId")));
    Subdepartment subdepartment = projectCode.getSubdepartment();
    Country country = projectCode.getSubdepartment().getDepartment().getOffice().getCountry();
    Calendar date = new GregorianCalendar();
    CalendarUtil.truncateTime(date);

    List<CurrencyVO> currencyVOs = new LinkedList<CurrencyVO>();
    for(Currency currency : CountryCurrency.getCurrencies(country) ) {
        currencyVOs.add(new CurrencyVO(currency));
    }
    %>
    {
        "status": "OK",
        "projectCode": <% gson.toJson(new ProjectCodeVO(projectCode), out); %>,
        "currencies": <% gson.toJson(currencyVOs, out); %>
    }
    <%
} else if("saveOutOfPocketItem".equals(command)) {
    OutOfPocketItemEditForm outOfPocketItemEditForm = OutOfPocketItemEditForm.getFromJson(request.getParameter("outOfPocketItemEditForm"));
    OutOfPocketItem outOfPocketItem = new OutOfPocketItem();
    if(OutOfPocketItemEditForm.Mode.CREATE.equals(outOfPocketItemEditForm.getMode())) {
        ProjectCode projectCode = (ProjectCode)hs.get(ProjectCode.class, new Long(outOfPocketItemEditForm.getProjectCodeId()));
        outOfPocketItem.setProjectCode(projectCode);
    } else if(OutOfPocketItemEditForm.Mode.UPDATE.equals(outOfPocketItemEditForm.getMode())) {
        outOfPocketItem = (OutOfPocketItem)hs.get(OutOfPocketItem.class, new Long(outOfPocketItemEditForm.getId()));
    }
    Country country = outOfPocketItem.getProjectCode().getSubdepartment().getDepartment().getOffice().getCountry();
    Currency mainCurrency = CountryCurrency.getMainCurrency(country);
    Currency invoiceCurrency = mainCurrency;
    if(outOfPocketItemEditForm.getOutOfPocketInvoiceCurrencyId() != null) {
        invoiceCurrency = (Currency)hs.get(Currency.class, new Long(outOfPocketItemEditForm.getOutOfPocketInvoiceCurrencyId()));
    }
    Currency paymentCurrency = mainCurrency;
    if(outOfPocketItemEditForm.getOutOfPocketPaymentCurrencyId() != null) {
        paymentCurrency = (Currency)hs.get(Currency.class, new Long(outOfPocketItemEditForm.getOutOfPocketPaymentCurrencyId()));
    }
    Currency actCurrency = mainCurrency;
    if(outOfPocketItemEditForm.getOutOfPocketActCurrencyId() != null) {
        actCurrency = (Currency)hs.get(Currency.class, new Long(outOfPocketItemEditForm.getOutOfPocketActCurrencyId()));
    }
    
    outOfPocketItem.setType(outOfPocketItemEditForm.getType());
    outOfPocketItem.setOutOfPocketInvoiceCurrency(invoiceCurrency);
    outOfPocketItem.setOutOfPocketPaymentCurrency(paymentCurrency);
    outOfPocketItem.setOutOfPocketActCurrency(actCurrency);

    if(OutOfPocketItem.Type.FULL.equals(outOfPocketItem.getType()) || OutOfPocketItem.Type.NO.equals(outOfPocketItem.getType())) {
        outOfPocketItem.setAmount(null);
    } else {
        Currency currency = (Currency)hs.get(Currency.class, outOfPocketItemEditForm.getCurrencyId());
        outOfPocketItem.setCurrency(currency);
        outOfPocketItem.setAmount(outOfPocketItemEditForm.getAmount());
    }   
    hs.save(outOfPocketItem);
    %>
    {
    "status": "OK"
    }
    <%
} else if("deleteOutOfPocketItem".equals(command)) {
    OutOfPocketItem outOfPocketItem = (OutOfPocketItem)hs.get(OutOfPocketItem.class, new Long(request.getParameter("id")));
    hs.delete(outOfPocketItem);
    %>
    {
    "status": "OK"
    }
    <%
} else if("checkOutOfPocketItemDependencies".equals(command)) {
    OutOfPocketItem outOfPocketItem = (OutOfPocketItem)hs.get(OutOfPocketItem.class, new Long(request.getParameter("id")));
    %>
    {
    "status": "OK",
    "outOfPocketInvoices": <%=outOfPocketItem.getOutOfPocketInvoices().size() %>,
    "outOfPocketPayments": <%=outOfPocketItem.getOutOfPocketPayments().size() %>,
    "outOfPocketActs": <%=outOfPocketItem.getOutOfPocketActs().size() %>
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