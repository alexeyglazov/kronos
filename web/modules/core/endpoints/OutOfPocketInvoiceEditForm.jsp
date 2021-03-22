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

if("saveOutOfPocketInvoice".equals(command)) {
    OutOfPocketInvoiceEditForm outOfPocketInvoiceEditForm = OutOfPocketInvoiceEditForm.getFromJson(request.getParameter("outOfPocketInvoiceEditForm"));
    OutOfPocketInvoice outOfPocketInvoice = null;
    if(OutOfPocketInvoiceEditForm.Mode.CREATE.equals(outOfPocketInvoiceEditForm.getMode())) {
        OutOfPocketItem outOfPocketItem = (OutOfPocketItem)hs.get(OutOfPocketItem.class, new Long(outOfPocketInvoiceEditForm.getOutOfPocketItemId()));
        outOfPocketInvoice = new OutOfPocketInvoice();
        outOfPocketInvoice.setOutOfPocketItem(outOfPocketItem);
    } else if(OutOfPocketInvoiceEditForm.Mode.UPDATE.equals(outOfPocketInvoiceEditForm.getMode())) {
        outOfPocketInvoice = (OutOfPocketInvoice)hs.get(OutOfPocketInvoice.class, new Long(outOfPocketInvoiceEditForm.getId()));
    }
    outOfPocketInvoice.setAmount(outOfPocketInvoiceEditForm.getAmount());
    outOfPocketInvoice.setVatIncludedAmount(outOfPocketInvoiceEditForm.getVatIncludedAmount());
    if(outOfPocketInvoiceEditForm.getDate() != null) {
        outOfPocketInvoice.setDate(outOfPocketInvoiceEditForm.getDate().getCalendar());
    } else {
        outOfPocketInvoice.setDate(null);
    }
    outOfPocketInvoice.setReference(outOfPocketInvoiceEditForm.getReference());
    hs.save(outOfPocketInvoice);
    
    %>
    {
    "status": "OK"
    }
    <%
} else if("deleteOutOfPocketInvoice".equals(command)) {
    OutOfPocketInvoice outOfPocketInvoice = (OutOfPocketInvoice)hs.get(OutOfPocketInvoice.class, new Long(request.getParameter("id")));
    hs.delete(outOfPocketInvoice);
    %>
    {
    "status": "OK"
    }
    <%
} else if("checkOutOfPocketInvoiceDependencies".equals(command)) {
    OutOfPocketInvoice outOfPocketInvoice = (OutOfPocketInvoice)hs.get(OutOfPocketInvoice.class, new Long(request.getParameter("id")));
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