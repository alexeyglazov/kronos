<%-- 
    Document   : subdepartments
    Created on : 31.03.2011, 13:08:03
    Author     : glazov
--%>
<%@page import="java.io.PrintWriter"%>
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
    Client client = null;
    if(request.getParameter("clientId") != null) {
        client = (Client)hs.get(Client.class, new Long(request.getParameter("clientId")));
    } else {
        client = projectCode.getClient();
    }
    List<CurrencyVO> currencyVOs = new LinkedList<CurrencyVO>();
    for(Currency currency : CountryCurrency.getCurrencies(currentUser.getCountry()) ) {
        currencyVOs.add(new CurrencyVO(currency));
    }
   
    FeesItem feesItem = projectCode.getFeesItem();
    List<FeesAdvanceVO> feesAdvanceVOs = new LinkedList<FeesAdvanceVO>();
    if(feesItem != null) {
        List<FeesAdvance> feesAdvances = new LinkedList<FeesAdvance>(feesItem.getFeesAdvances());
        for(FeesAdvance feesAdvance : feesAdvances) {
            feesAdvanceVOs.add(new FeesAdvanceVO(feesAdvance));
        }
    }
    %>
    {
        "status": "OK",
        "projectCode": <% gson.toJson(new ProjectCodeVO(projectCode), out); %>,
        "currencies": <% gson.toJson(currencyVOs, out); %>,
        "client": <% gson.toJson(new ClientVO(client), out); %>,
        <% if(feesItem != null) { %>
        "feesItem": <% gson.toJson(new FeesItemVOH(feesItem), out); %>,
        <% } else { %>
        "feesItem": null,
        <% } %>
        "feesAdvances": <% gson.toJson(feesAdvanceVOs, out); %>
    }
    <%
} else if("saveInvoiceRequest".equals(command)) {
    Date now = new Date();
    InvoiceRequestEditForm invoiceRequestEditForm = InvoiceRequestEditForm.getFromJson(request.getParameter("invoiceRequestEditForm"));
    invoiceRequestEditForm.normalize();
    if(InvoiceRequestEditForm.Mode.CREATE.equals(invoiceRequestEditForm.getMode())) {
        InvoiceRequestPacket invoiceRequestPacket = (InvoiceRequestPacket)hs.get(InvoiceRequestPacket.class, new Long(invoiceRequestEditForm.getInvoiceRequestPacketId()));
        Client client = (Client)hs.get(Client.class, new Long(invoiceRequestEditForm.getClientId()));
        Currency invoiceCurrency = (Currency)hs.get(Currency.class, new Long(invoiceRequestEditForm.getInvoiceCurrencyId()));
        Currency paymentCurrency = (Currency)hs.get(Currency.class, new Long(invoiceRequestEditForm.getPaymentCurrencyId()));
        InvoiceRequest invoiceRequest = new InvoiceRequest();
        invoiceRequest.setInvoiceRequestPacket(invoiceRequestPacket);
        invoiceRequest.setClient(client);
        invoiceRequest.setInvoiceCurrency(invoiceCurrency);
        invoiceRequest.setPaymentCurrency(paymentCurrency);
        invoiceRequest.setDescription(invoiceRequestEditForm.getDescription());
        invoiceRequest.setIsCancelled(invoiceRequestEditForm.getIsCancelled());
        invoiceRequest.setIsExternallyCancelled(Boolean.FALSE);
        if(invoiceRequestEditForm.getDate() != null) {
            invoiceRequest.setDate(invoiceRequestEditForm.getDate().getCalendar());
        }
        invoiceRequestPacket.setStatus(invoiceRequestEditForm.getStatus());

        for(InvoiceRequestEditForm.InvoiceRequestItem invoiceRequestItemTmp : invoiceRequestEditForm.getInvoiceRequestItems()) {
            InvoiceRequestItem invoiceRequestItem = new InvoiceRequestItem();
            invoiceRequestItem.setInvoiceRequest(invoiceRequest);
            invoiceRequestItem.setName(invoiceRequestItemTmp.getName());
            invoiceRequestItem.setAmount(invoiceRequestItemTmp.getAmount());
            invoiceRequest.getInvoiceRequestItems().add(invoiceRequestItem);
        }
        hs.save(invoiceRequestPacket);
        hs.save(invoiceRequest);
        for(InvoiceRequestItem invoiceRequestItem : invoiceRequest.getInvoiceRequestItems()) {
            hs.save(invoiceRequestItem);
        }
        
        InvoiceRequestPacketHistoryItem invoiceRequestPacketHistoryItem = new InvoiceRequestPacketHistoryItem();
        invoiceRequestPacketHistoryItem.setInvoiceRequestPacket(invoiceRequestPacket);
        invoiceRequestPacketHistoryItem.setEmployee(currentUser);
        invoiceRequestPacketHistoryItem.setComment("Invoice Request created (" + invoiceRequest.getId() +")");
        invoiceRequestPacketHistoryItem.setStatus(invoiceRequestPacket.getStatus());
        invoiceRequestPacketHistoryItem.setTime(now);
        hs.save(invoiceRequestPacketHistoryItem);
    } else if(InvoiceRequestEditForm.Mode.UPDATE.equals(invoiceRequestEditForm.getMode())) {
        // recreate object if it was externally cancelled and not cancelled now (for 1c sake)
        InvoiceRequest invoiceRequest = (InvoiceRequest)hs.get(InvoiceRequest.class, new Long(invoiceRequestEditForm.getId()));
        InvoiceRequestPacket invoiceRequestPacket = invoiceRequest.getInvoiceRequestPacket();
        if(! InvoiceRequestPacket.getEditabilityStatuses().contains(invoiceRequestPacket.getStatus())) {
            throw new Exception("Invoice request packet is not editable. Its status is " + invoiceRequestPacket.getStatus());
        }
        Client client = (Client)hs.get(Client.class, new Long(invoiceRequestEditForm.getClientId()));
        Currency invoiceCurrency = (Currency)hs.get(Currency.class, new Long(invoiceRequestEditForm.getInvoiceCurrencyId()));
        Currency paymentCurrency = (Currency)hs.get(Currency.class, new Long(invoiceRequestEditForm.getPaymentCurrencyId()));
        Calendar date = null;
        if(invoiceRequestEditForm.getDate() != null) {
            date = invoiceRequestEditForm.getDate().getCalendar();
        }
        if(Boolean.TRUE.equals(invoiceRequest.getIsExternallyCancelled()) && Boolean.FALSE.equals(invoiceRequestEditForm.getIsCancelled())) {
            InvoiceRequest invoiceRequest2 = new InvoiceRequest();
            invoiceRequest2.setInvoiceRequestPacket(invoiceRequestPacket);
            invoiceRequest2.setClient(client);
            invoiceRequest2.setInvoiceCurrency(invoiceCurrency);
            invoiceRequest2.setPaymentCurrency(paymentCurrency);
            invoiceRequest2.setDescription(invoiceRequestEditForm.getDescription());
            invoiceRequest2.setIsCancelled(invoiceRequestEditForm.getIsCancelled());
            invoiceRequest2.setIsExternallyCancelled(Boolean.FALSE);
            invoiceRequest2.setDate(date);  
            
            for(InvoiceRequestItem invoiceRequestItem : invoiceRequest.getInvoiceRequestItems()) {
                hs.delete(invoiceRequestItem);
            }
            hs.delete(invoiceRequest);
            hs.save(invoiceRequest2);

            for(InvoiceRequestEditForm.InvoiceRequestItem invoiceRequestItemTmp : invoiceRequestEditForm.getInvoiceRequestItems()) {
                InvoiceRequestItem invoiceRequestItem = new InvoiceRequestItem();
                invoiceRequestItem.setInvoiceRequest(invoiceRequest2);
                invoiceRequestItem.setName(invoiceRequestItemTmp.getName());
                invoiceRequestItem.setAmount(invoiceRequestItemTmp.getAmount());
                hs.save(invoiceRequestItem);
            }                        
        } else {
            invoiceRequest.setClient(client);
            invoiceRequest.setInvoiceCurrency(invoiceCurrency);
            invoiceRequest.setPaymentCurrency(paymentCurrency);
            invoiceRequest.setDescription(invoiceRequestEditForm.getDescription());
            invoiceRequest.setIsCancelled(invoiceRequestEditForm.getIsCancelled());
            invoiceRequest.setDate(date);
            hs.save(invoiceRequest);
            
            for(InvoiceRequestItem invoiceRequestItem : invoiceRequest.getInvoiceRequestItems()) {
                hs.delete(invoiceRequestItem);
            }
            for(InvoiceRequestEditForm.InvoiceRequestItem invoiceRequestItemTmp : invoiceRequestEditForm.getInvoiceRequestItems()) {
                InvoiceRequestItem invoiceRequestItem = new InvoiceRequestItem();
                invoiceRequestItem.setInvoiceRequest(invoiceRequest);
                invoiceRequestItem.setName(invoiceRequestItemTmp.getName());
                invoiceRequestItem.setAmount(invoiceRequestItemTmp.getAmount());
                hs.save(invoiceRequestItem);
            }            
        }

        invoiceRequestPacket.setStatus(invoiceRequestEditForm.getStatus());
        hs.save(invoiceRequestPacket);
              
        InvoiceRequestPacketHistoryItem invoiceRequestPacketHistoryItem = new InvoiceRequestPacketHistoryItem();
        invoiceRequestPacketHistoryItem.setInvoiceRequestPacket(invoiceRequestPacket);
        invoiceRequestPacketHistoryItem.setEmployee(currentUser);
        invoiceRequestPacketHistoryItem.setComment("Invoice Request updated (" + invoiceRequest.getId() +")" + (invoiceRequest.getIsCancelled() ? ", cancelled" : ""));
        invoiceRequestPacketHistoryItem.setStatus(invoiceRequestPacket.getStatus());
        invoiceRequestPacketHistoryItem.setTime(now);
        hs.save(invoiceRequestPacketHistoryItem);        
    }
    %>
    {
    "status": "OK"
    }
    <%
} else if("deleteInvoiceRequest".equals(command)) {
    Date now = new Date();
    InvoiceRequest invoiceRequest = (InvoiceRequest)hs.get(InvoiceRequest.class, new Long(request.getParameter("id")));
    InvoiceRequestPacket invoiceRequestPacket = invoiceRequest.getInvoiceRequestPacket();
    String historyComment = "Invoice Request deleted (" + invoiceRequest.getId() +")";
    
    if(! InvoiceRequestPacket.getEditabilityStatuses().contains(invoiceRequestPacket.getStatus())) {
        throw new Exception("Invoice request is not editable. Its status is " + invoiceRequestPacket.getStatus());
    }    
    if(invoiceRequestPacket.getInvoiceRequests().size() < 2 ) {
        throw new Exception("Invoice Request Packet should have at least one Invoice Request");
    }
    
    for(InvoiceRequestItem invoiceRequestItem : invoiceRequest.getInvoiceRequestItems()) {
        hs.delete(invoiceRequestItem);
    }
    hs.delete(invoiceRequest);
    
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
} else if("checkInvoiceRequestDependencies".equals(command)) {
    InvoiceRequest invoiceRequest = (InvoiceRequest)hs.get(InvoiceRequest.class, new Long(request.getParameter("id")));
    InvoiceRequestPacket invoiceRequestPacket = invoiceRequest.getInvoiceRequestPacket();
    %>
    {
    "status": "OK",
    "hasClosedStatusInHistory": <%=invoiceRequestPacket.hasStatusInHistory(InvoiceRequestPacket.Status.CLOSED) %>,
    "invoiceRequestsCount": <%=invoiceRequestPacket.getInvoiceRequests().size() %>
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