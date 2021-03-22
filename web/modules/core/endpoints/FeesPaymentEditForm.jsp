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
    FeesItem feesItem = null;
    if("CREATE".equals(request.getParameter("mode"))) {
        feesItem = (FeesItem)hs.get(FeesItem.class, new Long(request.getParameter("feesItemId")));
    } else if("UPDATE".equals(request.getParameter("mode"))) {
        feesItem = ((FeesPayment)hs.get(FeesPayment.class, new Long(request.getParameter("id")))).getFeesItem();
    }
    Currency mainCurrency = CountryCurrency.getMainCurrency(feesItem.getProjectCode().getSubdepartment().getDepartment().getOffice().getCountry());
    %>
    {
    "status": "OK",
    "feesItem": <% gson.toJson(new FeesItemVOH(feesItem), out); %>,
    "mainCurrency": <% gson.toJson(new CurrencyVO(mainCurrency), out); %>
    }
    <%
} else if("saveFeesPayment".equals(command)) {
    FeesPaymentEditForm feesPaymentEditForm = FeesPaymentEditForm.getFromJson(request.getParameter("feesPaymentEditForm"));
    if(FeesPaymentEditForm.Mode.CREATE.equals(feesPaymentEditForm.getMode())) {
        FeesItem feesItem = (FeesItem)hs.get(FeesItem.class, new Long(feesPaymentEditForm.getFeesItemId()));
        Currency mainCurrency = CountryCurrency.getMainCurrency(feesItem.getProjectCode().getSubdepartment().getDepartment().getOffice().getCountry());
        FeesPayment feesPayment = new FeesPayment();
        feesPayment.setFeesItem(feesItem);
        feesPayment.setAmount(feesPaymentEditForm.getAmount());
        if(! mainCurrency.getId().equals(feesItem.getFeesInvoiceCurrency().getId())) {
            feesPayment.setCvAmount(feesPaymentEditForm.getCvAmount());
        }
        if(feesPaymentEditForm.getDate() != null) {
            feesPayment.setDate(feesPaymentEditForm.getDate().getCalendar());
        } else {
            feesPayment.setDate(null);
        }
        feesPayment.setInvoiceReference(feesPaymentEditForm.getInvoiceReference());
        feesPayment.setReference(feesPaymentEditForm.getReference());
        hs.save(feesPayment);
    } else if(FeesPaymentEditForm.Mode.UPDATE.equals(feesPaymentEditForm.getMode())) {
        FeesPayment feesPayment = (FeesPayment)hs.get(FeesPayment.class, new Long(feesPaymentEditForm.getId()));
        FeesItem feesItem = feesPayment.getFeesItem();
        Currency mainCurrency = CountryCurrency.getMainCurrency(feesItem.getProjectCode().getSubdepartment().getDepartment().getOffice().getCountry());
        feesPayment.setAmount(feesPaymentEditForm.getAmount());
        if(! mainCurrency.getId().equals(feesItem.getFeesInvoiceCurrency().getId())) {
            feesPayment.setCvAmount(feesPaymentEditForm.getCvAmount());
        }
        if(feesPaymentEditForm.getDate() != null) {
            feesPayment.setDate(feesPaymentEditForm.getDate().getCalendar());
        } else {
            feesPayment.setDate(null);
        }
        feesPayment.setInvoiceReference(feesPaymentEditForm.getInvoiceReference());
        feesPayment.setReference(feesPaymentEditForm.getReference());
        hs.save(feesPayment);
    }
    %>
    {
    "status": "OK"
    }
    <%
} else if("deleteFeesPayment".equals(command)) {
    FeesPayment feesPayment = (FeesPayment)hs.get(FeesPayment.class, new Long(request.getParameter("id")));
    hs.delete(feesPayment);
    %>
    {
    "status": "OK"
    }
    <%
} else if("checkFeesPaymentDependencies".equals(command)) {
    FeesPayment feesPayment = (FeesPayment)hs.get(FeesPayment.class, new Long(request.getParameter("id")));
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