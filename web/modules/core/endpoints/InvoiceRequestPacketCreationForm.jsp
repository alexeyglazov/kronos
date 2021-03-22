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
    ProjectCode projectCode = (ProjectCode)hs.get(ProjectCode.class, new Long(request.getParameter("projectCodeId")));
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
} else if("saveInvoiceRequestPacket".equals(command)) {
    Date now = new Date();
    InvoiceRequestPacketCreationForm invoiceRequestPacketCreationForm = InvoiceRequestPacketCreationForm.getFromJson(request.getParameter("invoiceRequestPacketCreationForm"));
    invoiceRequestPacketCreationForm.normalize();
    ProjectCode projectCode = (ProjectCode)hs.get(ProjectCode.class, new Long(invoiceRequestPacketCreationForm.getProjectCodeId()));
    Client client = (Client)hs.get(Client.class, new Long(invoiceRequestPacketCreationForm.getClientId()));
    Currency invoiceCurrency = (Currency)hs.get(Currency.class, new Long(invoiceRequestPacketCreationForm.getInvoiceCurrencyId()));
    Currency paymentCurrency = (Currency)hs.get(Currency.class, new Long(invoiceRequestPacketCreationForm.getPaymentCurrencyId()));
    
    InvoiceRequestPacket invoiceRequestPacket = new InvoiceRequestPacket();
    invoiceRequestPacket.setProjectCode(projectCode);
    invoiceRequestPacket.setStatus(invoiceRequestPacketCreationForm.getStatus());
    invoiceRequestPacket.setWithVAT(invoiceRequestPacketCreationForm.getWithVAT());
    invoiceRequestPacket.setComment(invoiceRequestPacketCreationForm.getComment());
    hs.save(invoiceRequestPacket);
            
    InvoiceRequest invoiceRequest = new InvoiceRequest();
    invoiceRequest.setInvoiceRequestPacket(invoiceRequestPacket);
    invoiceRequest.setClient(client);
    invoiceRequest.setInvoiceCurrency(invoiceCurrency);
    invoiceRequest.setPaymentCurrency(paymentCurrency);
    invoiceRequest.setDescription(invoiceRequestPacketCreationForm.getDescription());
    invoiceRequest.setIsCancelled(Boolean.FALSE);
    invoiceRequest.setIsExternallyCancelled(Boolean.FALSE);
    if(invoiceRequestPacketCreationForm.getDate() != null) {
        invoiceRequest.setDate(invoiceRequestPacketCreationForm.getDate().getCalendar());
    }
    hs.save(invoiceRequest);
    for(InvoiceRequestItem invoiceRequestItem : invoiceRequest.getInvoiceRequestItems()) {
        hs.save(invoiceRequestItem);
    }
    for(InvoiceRequestPacketCreationForm.InvoiceRequestItem invoiceRequestItemTmp : invoiceRequestPacketCreationForm.getInvoiceRequestItems()) {
        InvoiceRequestItem invoiceRequestItem = new InvoiceRequestItem();
        invoiceRequestItem.setInvoiceRequest(invoiceRequest);
        invoiceRequestItem.setName(invoiceRequestItemTmp.getName());
        invoiceRequestItem.setAmount(invoiceRequestItemTmp.getAmount());
        invoiceRequest.getInvoiceRequestItems().add(invoiceRequestItem);
        hs.save(invoiceRequestItem);
    }
    String historyItemComment = "Request Packet created.";
    historyItemComment += " Invoice request (" + invoiceRequest.getId() + ").";
    
    if(invoiceRequestPacketCreationForm.getCreateActRequest()) {
        ActRequest actRequest = new ActRequest(invoiceRequest);
        //actRequest.setInvoiceRequestPacket(invoiceRequestPacket);
        //actRequest.setIsExternallyCancelled(Boolean.FALSE);
        //actRequest.setIsCancelled(Boolean.FALSE);
        hs.save(actRequest);
        for(ActRequestItem actRequestItem : actRequest.getActRequestItems()) {
            hs.save(actRequestItem);
        }
        historyItemComment += " Act request (" + actRequest.getId() + ")";
        
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
                outOfPocketRequest.setDescription(invoiceRequestPacketCreationForm.getDescription());
                
                outOfPocketRequestHistoryItemComment = "Out of pocket request was created automatically when Act request was created";
            } else {
                outOfPocketRequestHistoryItemComment = "Out of pocket request was checked when Act request was created";
            }
            outOfPocketRequest.setStatus(invoiceRequestPacketCreationForm.getStatus());
            hs.save(outOfPocketRequest);
            
            OutOfPocketRequestHistoryItem outOfPocketRequestHistoryItem = new OutOfPocketRequestHistoryItem();
            outOfPocketRequestHistoryItem.setOutOfPocketRequest(outOfPocketRequest);
            outOfPocketRequestHistoryItem.setEmployee(currentUser);
            outOfPocketRequestHistoryItem.setComment(outOfPocketRequestHistoryItemComment);
            outOfPocketRequestHistoryItem.setStatus(outOfPocketRequest.getStatus());
            outOfPocketRequestHistoryItem.setTime(now);
            hs.save(outOfPocketRequestHistoryItem);
        }
    }

    if(invoiceRequestPacketCreationForm.getCreateTaxInvoiceRequest()) {
        TaxInvoiceRequest taxInvoiceRequest = new TaxInvoiceRequest();
        taxInvoiceRequest.setInvoiceRequestPacket(invoiceRequestPacket);
        taxInvoiceRequest.setIsCancelled(Boolean.FALSE);
        taxInvoiceRequest.setIsExternallyCancelled(Boolean.FALSE);
        hs.save(taxInvoiceRequest);
        historyItemComment += " Tax Invoice request (" + taxInvoiceRequest.getId() + ")";
    }
    
    InvoiceRequestPacketHistoryItem invoiceRequestPacketHistoryItem = new InvoiceRequestPacketHistoryItem();
    invoiceRequestPacketHistoryItem.setInvoiceRequestPacket(invoiceRequestPacket);
    invoiceRequestPacketHistoryItem.setEmployee(currentUser);
    invoiceRequestPacketHistoryItem.setComment(historyItemComment);
    invoiceRequestPacketHistoryItem.setStatus(invoiceRequestPacket.getStatus());
    invoiceRequestPacketHistoryItem.setTime(now);
    hs.save(invoiceRequestPacketHistoryItem);

    %>
    {
    "status": "OK"
    }
    <%
} else if("saveEditedInvoiceRequestPacket".equals(command)) {
    Date now = new Date();
    InvoiceRequestPacketEditForm invoiceRequestPacketEditForm = InvoiceRequestPacketEditForm.getFromJson(request.getParameter("invoiceRequestPacketEditForm"));
    invoiceRequestPacketEditForm.normalize();
    InvoiceRequestPacket invoiceRequestPacket = (InvoiceRequestPacket)hs.get(InvoiceRequestPacket.class, invoiceRequestPacketEditForm.getId());
    invoiceRequestPacket.setStatus(invoiceRequestPacketEditForm.getStatus());
    invoiceRequestPacket.setComment(invoiceRequestPacketEditForm.getComment());
    invoiceRequestPacket.setWithVAT(invoiceRequestPacketEditForm.getWithVAT());
    hs.save(invoiceRequestPacket);
    
    InvoiceRequestPacketHistoryItem invoiceRequestPacketHistoryItem = new InvoiceRequestPacketHistoryItem();
    invoiceRequestPacketHistoryItem.setInvoiceRequestPacket(invoiceRequestPacket);
    invoiceRequestPacketHistoryItem.setEmployee(currentUser);
    invoiceRequestPacketHistoryItem.setComment("Invoice request packet updated");
    invoiceRequestPacketHistoryItem.setStatus(invoiceRequestPacket.getStatus());
    invoiceRequestPacketHistoryItem.setTime(now);
    hs.save(invoiceRequestPacketHistoryItem);    
    %>
    {
    "status": "OK"
    }
    <%    
} else if("deleteInvoiceRequestPacket".equals(command)) {
    InvoiceRequestPacket invoiceRequestPacket = (InvoiceRequestPacket)hs.get(InvoiceRequestPacket.class, new Long(request.getParameter("id")));

    if(! InvoiceRequestPacket.getEditabilityStatuses().contains(invoiceRequestPacket.getStatus())) {
        throw new Exception("Invoice request packet is not editable. Its status is " + invoiceRequestPacket.getStatus());
    }    

    for(InvoiceRequest invoiceRequest : invoiceRequestPacket.getInvoiceRequests()) {
        for(InvoiceRequestItem invoiceRequestItem : invoiceRequest.getInvoiceRequestItems()) {
            hs.delete(invoiceRequestItem);
        }
        hs.delete(invoiceRequest);
    }
    if(invoiceRequestPacket.getActRequest() != null) {
        ActRequest actRequest = invoiceRequestPacket.getActRequest();
        for(ActRequestItem actRequestItem : actRequest.getActRequestItems()) {
            hs.delete(actRequestItem);
        }
        hs.delete(actRequest);    
    }
    if(invoiceRequestPacket.getTaxInvoiceRequest() != null) {
        TaxInvoiceRequest taxInvoiceRequest = invoiceRequestPacket.getTaxInvoiceRequest();
        hs.delete(taxInvoiceRequest);    
    }
    for(InvoiceRequestPacketHistoryItem invoiceRequestPacketHistoryItem : invoiceRequestPacket.getInvoiceRequestPacketHistoryItems()) {
        hs.delete(invoiceRequestPacketHistoryItem);
    }
    hs.delete(invoiceRequestPacket);
    %>
    {
    "status": "OK"
    }
    <%
} else if("checkInvoiceRequestPacketDependencies".equals(command)) {
    InvoiceRequestPacket invoiceRequestPacket = (InvoiceRequestPacket)hs.get(InvoiceRequestPacket.class, new Long(request.getParameter("id")));
    %>
    {
    "status": "OK",
    "hasClosedStatusInHistory": <%=invoiceRequestPacket.hasStatusInHistory(InvoiceRequestPacket.Status.CLOSED) %>
    }
    <%
}
hs.getTransaction().commit();

} catch (Exception ex) {
    ex.printStackTrace(new PrintWriter(out));
    hs.getTransaction().rollback();
    %>
    {
        "status": "FAIL",
        "comment": <% gson.toJson(ex.toString(), out); %>
    }
    <%
}
%>