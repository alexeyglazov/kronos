<%-- 
    Document   : subdepartments
    Created on : 31.03.2011, 13:08:03
    Author     : glazov
--%>
<%@page import="java.util.Date"%>
<%@page import="com.mazars.management.db.comparators.InvoiceRequestComparator"%>
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
    List<InvoiceRequestWithItemsVO > invoiceRequestVOs = new LinkedList<InvoiceRequestWithItemsVO>();
    List<InvoiceRequest> invoiceRequests = new LinkedList<InvoiceRequest>(invoiceRequestPacket.getInvoiceRequests());
    Collections.sort(invoiceRequests, new InvoiceRequestComparator());
    for(InvoiceRequest invoiceRequest : invoiceRequests) {
        invoiceRequestVOs.add(new InvoiceRequestWithItemsVO(invoiceRequest));
    }    
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
    %>
    {
        "status": "OK",
        "projectCode": <% gson.toJson(new ProjectCodeVO(projectCode), out); %>,
        "currencies": <% gson.toJson(currencyVOs, out); %>,
        "client": <% gson.toJson(new ClientVO(client), out); %>,
        "invoiceRequests": <% gson.toJson(invoiceRequestVOs, out); %>
    }
    <%
} else if("saveActRequest".equals(command)) {
    Date now = new Date();
    ActRequestEditForm actRequestEditForm = ActRequestEditForm.getFromJson(request.getParameter("actRequestEditForm"));
    actRequestEditForm.normalize();

    Client client = (Client)hs.get(Client.class, new Long(actRequestEditForm.getClientId()));
    Currency invoiceCurrency = (Currency)hs.get(Currency.class, new Long(actRequestEditForm.getInvoiceCurrencyId()));
    Currency paymentCurrency = (Currency)hs.get(Currency.class, new Long(actRequestEditForm.getPaymentCurrencyId()));
    Calendar date = null;
    if(actRequestEditForm.getDate() != null) {
        date = actRequestEditForm.getDate().getCalendar();
    }
    ProjectCode projectCode = null;

    if(ActRequestEditForm.Mode.CREATE.equals(actRequestEditForm.getMode())) {
        InvoiceRequestPacket invoiceRequestPacket = (InvoiceRequestPacket)hs.get(InvoiceRequestPacket.class, new Long(actRequestEditForm.getInvoiceRequestPacketId()));
        projectCode = invoiceRequestPacket.getProjectCode();
        if(InvoiceRequestPacket.Status.LOCKED.equals(invoiceRequestPacket.getStatus())) {
            throw new Exception("Act request is not editable. Its status is " + invoiceRequestPacket.getStatus());
        }
        if(invoiceRequestPacket.getActRequest() != null ) {
            throw new Exception("Invoice Request Packet has Act Request");
        }        
        ActRequest actRequest = new ActRequest();
        actRequest.setInvoiceRequestPacket(invoiceRequestPacket);
        actRequest.setClient(client);
        actRequest.setInvoiceCurrency(invoiceCurrency);
        actRequest.setPaymentCurrency(paymentCurrency);
        actRequest.setDescription(actRequestEditForm.getDescription());
        actRequest.setIsCancelled(actRequestEditForm.getIsCancelled());
        actRequest.setIsExternallyCancelled(Boolean.FALSE);
        actRequest.setDate(date);

        invoiceRequestPacket.setStatus(actRequestEditForm.getStatus());
        hs.save(invoiceRequestPacket);
        hs.save(actRequest);

        for(ActRequestEditForm.ActRequestItem actRequestItemTmp : actRequestEditForm.getActRequestItems()) {
            ActRequestItem actRequestItem = new ActRequestItem();
            actRequestItem.setActRequest(actRequest);
            actRequestItem.setName(actRequestItemTmp.getName());
            actRequestItem.setAmount(actRequestItemTmp.getAmount());
            hs.save(actRequestItem);
        }
        for(ActRequestItem actRequestItem : actRequest.getActRequestItems()) {
            hs.save(actRequestItem);
        }

        InvoiceRequestPacketHistoryItem invoiceRequestPacketHistoryItem = new InvoiceRequestPacketHistoryItem();
        invoiceRequestPacketHistoryItem.setInvoiceRequestPacket(invoiceRequestPacket);
        invoiceRequestPacketHistoryItem.setEmployee(currentUser);
        invoiceRequestPacketHistoryItem.setComment("Act Request created (" + actRequest.getId() +")");
        invoiceRequestPacketHistoryItem.setStatus(invoiceRequestPacket.getStatus());
        invoiceRequestPacketHistoryItem.setTime(now);
        hs.save(invoiceRequestPacketHistoryItem);
    } else if(ActRequestEditForm.Mode.UPDATE.equals(actRequestEditForm.getMode())) {
        // recreate object if it was externally cancelled and not cancelled now (for 1c sake)
        ActRequest actRequest = (ActRequest)hs.get(ActRequest.class, new Long(actRequestEditForm.getId()));
        InvoiceRequestPacket invoiceRequestPacket = actRequest.getInvoiceRequestPacket();
        projectCode = invoiceRequestPacket.getProjectCode();
        if(! InvoiceRequestPacket.getEditabilityStatuses().contains(invoiceRequestPacket.getStatus())) {
            throw new Exception("Act request is not editable. Its status is " + invoiceRequestPacket.getStatus());
        }    
        
        if(Boolean.TRUE.equals(actRequest.getIsExternallyCancelled()) && Boolean.FALSE.equals(actRequestEditForm.getIsCancelled())) {
            ActRequest actRequest2 = new ActRequest();
            actRequest2.setInvoiceRequestPacket(invoiceRequestPacket);
            actRequest2.setClient(client);
            actRequest2.setInvoiceCurrency(invoiceCurrency);
            actRequest2.setPaymentCurrency(paymentCurrency);
            actRequest2.setDescription(actRequestEditForm.getDescription());
            actRequest2.setIsCancelled(actRequestEditForm.getIsCancelled());
            actRequest2.setIsExternallyCancelled(Boolean.FALSE);
            actRequest2.setDate(date);
            
            for(ActRequestItem actRequestItem : actRequest.getActRequestItems()) {
                hs.delete(actRequestItem);
            }
            hs.delete(actRequest);
            hs.save(actRequest2);
            
            for(ActRequestEditForm.ActRequestItem actRequestItemTmp : actRequestEditForm.getActRequestItems()) {
                ActRequestItem actRequestItem = new ActRequestItem();
                actRequestItem.setActRequest(actRequest2);
                actRequestItem.setName(actRequestItemTmp.getName());
                actRequestItem.setAmount(actRequestItemTmp.getAmount());
                hs.save(actRequestItem);
            }
        } else {
            actRequest.setClient(client);
            actRequest.setInvoiceCurrency(invoiceCurrency);
            actRequest.setPaymentCurrency(paymentCurrency);
            actRequest.setDescription(actRequestEditForm.getDescription());
            actRequest.setIsCancelled(actRequestEditForm.getIsCancelled());
            actRequest.setDate(date);
            hs.save(actRequest);
            
            for(ActRequestItem actRequestItem : actRequest.getActRequestItems()) {
                hs.delete(actRequestItem);
            }
            for(ActRequestEditForm.ActRequestItem actRequestItemTmp : actRequestEditForm.getActRequestItems()) {
                ActRequestItem actRequestItem = new ActRequestItem();
                actRequestItem.setActRequest(actRequest);
                actRequestItem.setName(actRequestItemTmp.getName());
                actRequestItem.setAmount(actRequestItemTmp.getAmount());
                hs.save(actRequestItem);
            }            
        }
        
        invoiceRequestPacket.setStatus(actRequestEditForm.getStatus());
        hs.save(invoiceRequestPacket);
                
        InvoiceRequestPacketHistoryItem invoiceRequestPacketHistoryItem = new InvoiceRequestPacketHistoryItem();
        invoiceRequestPacketHistoryItem.setInvoiceRequestPacket(invoiceRequestPacket);
        invoiceRequestPacketHistoryItem.setEmployee(currentUser);
        invoiceRequestPacketHistoryItem.setComment("Act Request updated (" + actRequest.getId() +")" + (actRequest.getIsCancelled() ? ", cancelled" : ""));
        invoiceRequestPacketHistoryItem.setStatus(invoiceRequestPacket.getStatus());
        invoiceRequestPacketHistoryItem.setTime(now);
        hs.save(invoiceRequestPacketHistoryItem);       
    }
    
    boolean isOutsourcing = projectCode.getSubdepartment().getName().equalsIgnoreCase("outsourcing");
    if(! isOutsourcing) {
        OutOfPocketRequest outOfPocketRequest = projectCode.getOutOfPocketRequest();
        String outOfPocketRequestHistoryItemComment = "";
        if(outOfPocketRequest == null) {
            OutOfPocketItem outOfPocketItem = projectCode.getOutOfPocketItem();
            outOfPocketRequest = new OutOfPocketRequest();
            outOfPocketRequest.setProjectCode(projectCode);
            if(outOfPocketItem == null) {
                outOfPocketRequest.setType(OutOfPocketItem.Type.FULL);
                outOfPocketRequest.setAmount(null);
                outOfPocketRequest.setCurrency(null);
            } else {
                outOfPocketRequest.setType(outOfPocketItem.getType());
                outOfPocketRequest.setAmount(outOfPocketItem.getAmount());
                outOfPocketRequest.setCurrency(outOfPocketItem.getOutOfPocketInvoiceCurrency());                    
            }
            outOfPocketRequest.setDescription(actRequestEditForm.getDescription());
            if(ActRequestEditForm.Mode.CREATE.equals(actRequestEditForm.getMode())) {
                outOfPocketRequestHistoryItemComment = "Out of pocket request was created automatically when Act request was created";
            } else if(ActRequestEditForm.Mode.UPDATE.equals(actRequestEditForm.getMode())) {
                outOfPocketRequestHistoryItemComment = "Out of pocket request was created automatically when Act request was updated";
            }
        } else {
            if(ActRequestEditForm.Mode.CREATE.equals(actRequestEditForm.getMode())) {
                outOfPocketRequestHistoryItemComment = "Out of pocket request was checked when Act request was created";
            } else if(ActRequestEditForm.Mode.UPDATE.equals(actRequestEditForm.getMode())) {
                outOfPocketRequestHistoryItemComment = "Out of pocket request was checked automatically when Act request was updated";
            }
        }
        outOfPocketRequest.setStatus(actRequestEditForm.getStatus());
        hs.save(outOfPocketRequest);

        OutOfPocketRequestHistoryItem outOfPocketRequestHistoryItem = new OutOfPocketRequestHistoryItem();
        outOfPocketRequestHistoryItem.setOutOfPocketRequest(outOfPocketRequest);
        outOfPocketRequestHistoryItem.setEmployee(currentUser);
        outOfPocketRequestHistoryItem.setComment(outOfPocketRequestHistoryItemComment);
        outOfPocketRequestHistoryItem.setStatus(outOfPocketRequest.getStatus());
        outOfPocketRequestHistoryItem.setTime(now);
        hs.save(outOfPocketRequestHistoryItem);
    }    
    %>
    {
    "status": "OK"
    }
    <%
} else if("deleteActRequest".equals(command)) {
    Date now = new Date();
    ActRequest actRequest = (ActRequest)hs.get(ActRequest.class, new Long(request.getParameter("id")));
    InvoiceRequestPacket invoiceRequestPacket = actRequest.getInvoiceRequestPacket();
    String historyComment = "Act Request deleted (" + actRequest.getId() +")";
    
    if(! InvoiceRequestPacket.getEditabilityStatuses().contains(invoiceRequestPacket.getStatus())) {
        throw new Exception("Act request is not editable. Its status is " + invoiceRequestPacket.getStatus());
    }    
    if(invoiceRequestPacket.getTaxInvoiceRequest() != null ) {
        throw new Exception("Invoice Request Packet has Tax Invoice Request");
    }
    
    for(ActRequestItem actRequestItem : actRequest.getActRequestItems()) {
        hs.delete(actRequestItem);
    }
    hs.delete(actRequest);
    
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
} else if("checkActRequestDependencies".equals(command)) {
    ActRequest actRequest = (ActRequest)hs.get(ActRequest.class, new Long(request.getParameter("id")));
    InvoiceRequestPacket invoiceRequestPacket = actRequest.getInvoiceRequestPacket();
    %>
    {
    "status": "OK",
    "hasClosedStatusInHistory": <%=invoiceRequestPacket.hasStatusInHistory(InvoiceRequestPacket.Status.CLOSED) %>,
    "taxInvoiceRequest": <%=actRequest.getInvoiceRequestPacket().getTaxInvoiceRequest() != null %>
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