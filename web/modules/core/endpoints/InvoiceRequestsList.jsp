<%-- 
    Document   : subdepartments
    Created on : 31.03.2011, 13:08:03
    Author     : glazov
--%>
<%@page import="com.mazars.management.db.comparators.InvoiceRequestPacketComparator"%>
<%@page import="com.mazars.management.db.comparators.OutOfPocketRequestHistoryItemComparator"%>
<%@page import="com.mazars.management.web.vo.OutOfPocketRequestHistoryItemVO"%>
<%@page import="com.mazars.management.web.vo.InvoiceRequestPacketHistoryItemVO"%>
<%@page import="com.mazars.management.web.vo.InvoiceRequestPacketWithDataVO"%>
<%@page import="com.mazars.management.db.comparators.InvoiceRequestPacketHistoryItemComparator"%>
<%@page import="com.mazars.management.db.comparators.ActRequestComparator"%>
<%@page import="com.mazars.management.web.vo.ActRequestWithItemsVO"%>
<%@page import="com.mazars.management.web.vo.InvoiceRequestWithItemsVO"%>
<%@page import="com.mazars.management.db.comparators.InvoiceRequestComparator"%>
<%@page import="com.mazars.management.web.vo.InvoiceRequestWithItemsVO"%>
<%@page import="com.mazars.management.db.util.ProjectCodeListUtil"%>
<%@page import="com.mazars.management.db.comparators.PositionQuotationComparator"%>
<%@page import="com.mazars.management.web.comparators.PositionWithStandardPositionComparator"%>
<%@page import="com.mazars.management.web.vo.PositionWithStandardPositionVO"%>
<%@page import="com.mazars.management.db.comparators.OutOfPocketActComparator"%>
<%@page import="com.mazars.management.db.comparators.FeesActComparator"%>
<%@page import="java.util.Map"%>
<%@page contentType="text/html" pageEncoding="UTF-8"
    import="java.util.List"
    import="java.util.LinkedList"
    import="java.util.Collections"
    import="java.util.Locale"
    import="java.util.HashMap"
    import="com.mazars.management.db.domain.*"
    import="com.mazars.management.web.forms.*"
    import="com.mazars.management.db.util.HibernateUtil"
    import="org.hibernate.Session"
    import="com.google.gson.Gson"
    import="com.mazars.management.db.vo.*"
    import="com.mazars.management.web.security.AccessChecker"
    import="com.mazars.management.db.comparators.ClientComparator"
    import="com.mazars.management.db.comparators.ProjectCodeComparator"
    import="com.mazars.management.db.comparators.StandardPositionComparator"
    import="com.mazars.management.db.comparators.CurrencyComparator"
    import="com.mazars.management.db.comparators.OutOfPocketPaymentComparator"
    import="com.mazars.management.db.comparators.OutOfPocketInvoiceComparator"
    import="com.mazars.management.db.comparators.FeesPaymentComparator"
    import="com.mazars.management.db.comparators.FeesInvoiceComparator"
    import="com.mazars.management.db.comparators.FeesAdvanceComparator" 
%>
<%
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

hs.refresh(currentUser);
if("getInvoiceRequestPackets".equals(command)) {
       ProjectCode projectCode = (ProjectCode)hs.get(ProjectCode.class, new Long(request.getParameter("projectCodeId")));
       List<InvoiceRequestWithItemsVO> invoiceRequestVOs = new LinkedList<InvoiceRequestWithItemsVO>();
       List<ActRequestWithItemsVO> actRequestVOs = new LinkedList<ActRequestWithItemsVO>();
       List<InvoiceRequestPacketWithDataVO> invoiceRequestPacketWithDataVOs = new LinkedList<InvoiceRequestPacketWithDataVO>();
       
       List<InvoiceRequestPacket> invoiceRequestPackets = new LinkedList<InvoiceRequestPacket>(projectCode.getInvoiceRequestPackets());
       Collections.sort(invoiceRequestPackets, new InvoiceRequestPacketComparator());
       for(InvoiceRequestPacket invoiceRequestPacket : invoiceRequestPackets) {
           invoiceRequestPacketWithDataVOs.add(new InvoiceRequestPacketWithDataVO(invoiceRequestPacket));
       }
       
       OutOfPocketRequest outOfPocketRequest = projectCode.getOutOfPocketRequest();
       com.mazars.management.web.vo.OutOfPocketRequestVO outOfPocketRequestVO = null;
       if(outOfPocketRequest != null) {
           outOfPocketRequestVO = new com.mazars.management.web.vo.OutOfPocketRequestVO(outOfPocketRequest);
       }       
%>
{
"status": "OK",
"invoiceRequestPackets": <% gson.toJson(invoiceRequestPacketWithDataVOs, out); %>,
<% if(outOfPocketRequestVO != null) { %>
    "outOfPocketRequest": <% gson.toJson(outOfPocketRequestVO, out); %>
<% } else {%>
    "outOfPocketRequest": null
<% } %>
}
<%
} else if("getInvoiceRequestPacketHistoryItems".equals(command)) {
    InvoiceRequestPacket invoiceRequestPacket = (InvoiceRequestPacket)hs.get(InvoiceRequestPacket.class, new Long(request.getParameter("invoiceRequestPacketId")));
    List<InvoiceRequestPacketHistoryItemVO> invoiceRequestPacketHistoryItemVOs = new LinkedList<InvoiceRequestPacketHistoryItemVO>();
    List<InvoiceRequestPacketHistoryItem> invoiceRequestPacketHistoryItems = new LinkedList<InvoiceRequestPacketHistoryItem>(invoiceRequestPacket.getInvoiceRequestPacketHistoryItems());
    Collections.sort(invoiceRequestPacketHistoryItems, new InvoiceRequestPacketHistoryItemComparator());
    for(InvoiceRequestPacketHistoryItem invoiceRequestPacketHistoryItem : invoiceRequestPacketHistoryItems) {
        invoiceRequestPacketHistoryItemVOs.add(new InvoiceRequestPacketHistoryItemVO(invoiceRequestPacketHistoryItem));
    }
%>
{
"status": "OK",
"invoiceRequestPacketHistoryItems": <% gson.toJson(invoiceRequestPacketHistoryItemVOs, out); %>
}
<% 
}  else if("getInvoiceRequestPacketSummary".equals(command)) {
    InvoiceRequestPacket invoiceRequestPacket = (InvoiceRequestPacket)hs.get(InvoiceRequestPacket.class, new Long(request.getParameter("invoiceRequestPacketId")));
    ProjectCode projectCode = invoiceRequestPacket.getProjectCode();
    Long timeSpent = TimeSpentItem.getTimeSpent(projectCode);
%>
{
"status": "OK",
"projectCode": <% gson.toJson(new ProjectCodeVO(projectCode), out); %>,
"timeSpent": <%=timeSpent %>
}
<% 
} else if("getOutOfPocketRequestHistoryItems".equals(command)) {
    OutOfPocketRequest outOfPocketRequest = (OutOfPocketRequest)hs.get(OutOfPocketRequest.class, new Long(request.getParameter("outOfPocketRequestId")));
    List<OutOfPocketRequestHistoryItemVO> outOfPocketRequestHistoryItemVOs = new LinkedList<OutOfPocketRequestHistoryItemVO>();
    List<OutOfPocketRequestHistoryItem> outOfPocketRequestHistoryItems = new LinkedList<OutOfPocketRequestHistoryItem>(outOfPocketRequest.getOutOfPocketRequestHistoryItems());
    Collections.sort(outOfPocketRequestHistoryItems, new OutOfPocketRequestHistoryItemComparator());
    for(OutOfPocketRequestHistoryItem outOfPocketRequestHistoryItem : outOfPocketRequestHistoryItems) {
        outOfPocketRequestHistoryItemVOs.add(new OutOfPocketRequestHistoryItemVO(outOfPocketRequestHistoryItem));
    }
%>
{
"status": "OK",
"outOfPocketRequestHistoryItems": <% gson.toJson(outOfPocketRequestHistoryItemVOs, out); %>
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
