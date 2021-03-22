<%-- 
    Document   : subdepartments
    Created on : 31.03.2011, 13:08:03
    Author     : glazov
--%>
<%@page import="java.util.Date"%>
<%@page import="com.mazars.management.db.comparators.ActRequestComparator"%>
<%@page import="com.mazars.management.web.comparators.PositionWithStandardPositionComparator"%>
<%@page import="java.math.BigDecimal"%>
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
    InvoiceRequestPacket invoiceRequestPacket = (InvoiceRequestPacket)hs.get(InvoiceRequestPacket.class, new Long(request.getParameter("invoiceRequestPacketId")));
    ProjectCode projectCode = invoiceRequestPacket.getProjectCode();
    %>
    {
        "status": "OK",
        "projectCode": <% gson.toJson(new ProjectCodeVO(projectCode), out); %>
    }
    <%
} else if("saveTaxInvoiceRequest".equals(command)) {
    Date now = new Date();
    TaxInvoiceRequestEditForm taxInvoiceRequestEditForm = TaxInvoiceRequestEditForm.getFromJson(request.getParameter("taxInvoiceRequestEditForm"));
    taxInvoiceRequestEditForm.normalize();
    if(TaxInvoiceRequestEditForm.Mode.CREATE.equals(taxInvoiceRequestEditForm.getMode())) {
        InvoiceRequestPacket invoiceRequestPacket = (InvoiceRequestPacket)hs.get(InvoiceRequestPacket.class, new Long(taxInvoiceRequestEditForm.getInvoiceRequestPacketId()));
        if(InvoiceRequestPacket.Status.LOCKED.equals(invoiceRequestPacket.getStatus())) {
            throw new Exception("Tax Invoice request is not editable. Its status is " + invoiceRequestPacket.getStatus());
        }
        if(invoiceRequestPacket.getTaxInvoiceRequest() != null ) {
            throw new Exception("Invoice Request Packet has Tax Invoice Request");
        }
        if(invoiceRequestPacket.getActRequest() == null ) {
            throw new Exception("Invoice Request Packet has no Act Request");
        }
        TaxInvoiceRequest taxInvoiceRequest = new TaxInvoiceRequest();
        taxInvoiceRequest.setInvoiceRequestPacket(invoiceRequestPacket);
        taxInvoiceRequest.setIsCancelled(taxInvoiceRequestEditForm.getIsCancelled());
        taxInvoiceRequest.setIsExternallyCancelled(Boolean.FALSE);
        invoiceRequestPacket.setStatus(taxInvoiceRequestEditForm.getStatus());
        hs.save(invoiceRequestPacket);
        hs.save(taxInvoiceRequest);
        
        InvoiceRequestPacketHistoryItem invoiceRequestPacketHistoryItem = new InvoiceRequestPacketHistoryItem();
        invoiceRequestPacketHistoryItem.setInvoiceRequestPacket(invoiceRequestPacket);
        invoiceRequestPacketHistoryItem.setEmployee(currentUser);
        invoiceRequestPacketHistoryItem.setComment("Tax Invoice Request created (" + taxInvoiceRequest.getId() +")");
        invoiceRequestPacketHistoryItem.setStatus(invoiceRequestPacket.getStatus());
        invoiceRequestPacketHistoryItem.setTime(now);
        hs.save(invoiceRequestPacketHistoryItem);
    } else if(TaxInvoiceRequestEditForm.Mode.UPDATE.equals(taxInvoiceRequestEditForm.getMode())) {
        // recreate object if it was externally cancelled and not cancelled now (for 1c sake)
        TaxInvoiceRequest taxInvoiceRequest = (TaxInvoiceRequest)hs.get(TaxInvoiceRequest.class, new Long(taxInvoiceRequestEditForm.getId()));
        InvoiceRequestPacket invoiceRequestPacket = taxInvoiceRequest.getInvoiceRequestPacket();
        if(! InvoiceRequestPacket.getEditabilityStatuses().contains(invoiceRequestPacket.getStatus())) {
            throw new Exception("Tax Invoice request is not editable. Its status is " + invoiceRequestPacket.getStatus());
        }
        
        if(Boolean.TRUE.equals(taxInvoiceRequest.getIsExternallyCancelled()) && Boolean.FALSE.equals(taxInvoiceRequestEditForm.getIsCancelled())) {
            TaxInvoiceRequest taxInvoiceRequest2 = new TaxInvoiceRequest();
            taxInvoiceRequest2.setInvoiceRequestPacket(invoiceRequestPacket);
            taxInvoiceRequest2.setIsCancelled(taxInvoiceRequestEditForm.getIsCancelled());
            taxInvoiceRequest2.setIsExternallyCancelled(Boolean.FALSE);
            
            hs.delete(taxInvoiceRequest);
            hs.save(taxInvoiceRequest2);            
        } else {
            taxInvoiceRequest.setIsCancelled(taxInvoiceRequestEditForm.getIsCancelled());
            hs.save(taxInvoiceRequest);
        }
        
        invoiceRequestPacket.setStatus(taxInvoiceRequestEditForm.getStatus());
        hs.save(invoiceRequestPacket);
        
        InvoiceRequestPacketHistoryItem invoiceRequestPacketHistoryItem = new InvoiceRequestPacketHistoryItem();
        invoiceRequestPacketHistoryItem.setInvoiceRequestPacket(invoiceRequestPacket);
        invoiceRequestPacketHistoryItem.setEmployee(currentUser);
        invoiceRequestPacketHistoryItem.setComment("Tax Invoice Request updated (" + taxInvoiceRequest.getId() +")" + (taxInvoiceRequest.getIsCancelled() ? ", cancelled" : ""));
        invoiceRequestPacketHistoryItem.setStatus(invoiceRequestPacket.getStatus());
        invoiceRequestPacketHistoryItem.setTime(now);
        hs.save(invoiceRequestPacketHistoryItem);
    }
    %>
    {
    "status": "OK"
    }
    <%
} else if("deleteTaxInvoiceRequest".equals(command)) {
    Date now = new Date();
    TaxInvoiceRequest taxInvoiceRequest = (TaxInvoiceRequest)hs.get(TaxInvoiceRequest.class, new Long(request.getParameter("id")));
    InvoiceRequestPacket invoiceRequestPacket = taxInvoiceRequest.getInvoiceRequestPacket();
    String historyComment = "Tax Invoice Request deleted (" + taxInvoiceRequest.getId() +")";
    if(! InvoiceRequestPacket.getEditabilityStatuses().contains(invoiceRequestPacket.getStatus())) {
        throw new Exception("Tax Invoice request is not editable. Its status is " + invoiceRequestPacket.getStatus());
    }            
     
    hs.delete(taxInvoiceRequest);
    
    InvoiceRequestPacketHistoryItem invoiceRequestPacketHistoryItem = new InvoiceRequestPacketHistoryItem();
    invoiceRequestPacketHistoryItem.setInvoiceRequestPacket(invoiceRequestPacket);
    invoiceRequestPacketHistoryItem.setEmployee(currentUser);
    invoiceRequestPacketHistoryItem.setComment(historyComment);
    invoiceRequestPacketHistoryItem.setStatus(invoiceRequestPacket.getStatus());
    invoiceRequestPacketHistoryItem.setTime(now);
    hs.save(invoiceRequestPacketHistoryItem);  

    %>
    {
    "status": "OK"
    }
    <%
} else if("checkTaxInvoiceRequestDependencies".equals(command)) {
    TaxInvoiceRequest taxInvoiceRequest = (TaxInvoiceRequest)hs.get(TaxInvoiceRequest.class, new Long(request.getParameter("id")));
    InvoiceRequestPacket invoiceRequestPacket = taxInvoiceRequest.getInvoiceRequestPacket();
    %>
    {
    "status": "OK",
    "hasClosedStatusInHistory": <%=invoiceRequestPacket.hasStatusInHistory(InvoiceRequestPacket.Status.CLOSED) %>
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