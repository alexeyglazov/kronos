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

if("saveFeesInvoice".equals(command)) {
    FeesInvoiceEditForm feesInvoiceEditForm = FeesInvoiceEditForm.getFromJson(request.getParameter("feesInvoiceEditForm"));
    FeesInvoice feesInvoice = null;
    if(FeesInvoiceEditForm.Mode.CREATE.equals(feesInvoiceEditForm.getMode())) {
        FeesItem feesItem = (FeesItem)hs.get(FeesItem.class, new Long(feesInvoiceEditForm.getFeesItemId()));
        feesInvoice = new FeesInvoice();
        feesInvoice.setFeesItem(feesItem);

    } else if(FeesInvoiceEditForm.Mode.UPDATE.equals(feesInvoiceEditForm.getMode())) {
        feesInvoice = (FeesInvoice)hs.get(FeesInvoice.class, new Long(feesInvoiceEditForm.getId()));
        hs.save(feesInvoice);
    }
    feesInvoice.setIsAdvance(feesInvoiceEditForm.getIsAdvance());
    feesInvoice.setAmount(feesInvoiceEditForm.getAmount());
    feesInvoice.setVatIncludedAmount(feesInvoiceEditForm.getVatIncludedAmount());
    feesInvoice.setDate(feesInvoiceEditForm.getDate().getCalendar());
    feesInvoice.setReference(feesInvoiceEditForm.getReference());
    hs.save(feesInvoice);    
    %>
    {
    "status": "OK"
    }
    <%
} else if("deleteFeesInvoice".equals(command)) {
    FeesInvoice feesInvoice = (FeesInvoice)hs.get(FeesInvoice.class, new Long(request.getParameter("id")));
    hs.delete(feesInvoice);
    %>
    {
    "status": "OK"
    }
    <%
} else if("checkFeesInvoiceDependencies".equals(command)) {
    FeesInvoice feesInvoice = (FeesInvoice)hs.get(FeesInvoice.class, new Long(request.getParameter("id")));
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