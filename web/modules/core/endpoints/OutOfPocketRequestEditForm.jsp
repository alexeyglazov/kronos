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
    Country country = currentUser.getCountry();
    List<CurrencyVO> currencyVOs = new LinkedList<CurrencyVO>();
    for(Currency currency : CountryCurrency.getCurrencies(country) ) {
        currencyVOs.add(new CurrencyVO(currency));
    }
    %>
    {
        "status": "OK",
        "currencies": <% gson.toJson(currencyVOs, out); %>
    }
    <%
} else if("saveOutOfPocketRequest".equals(command)) {
    Date now = new Date();
    OutOfPocketRequestEditForm outOfPocketRequestEditForm = OutOfPocketRequestEditForm.getFromJson(request.getParameter("outOfPocketRequestEditForm"));
    OutOfPocketRequest outOfPocketRequest = null;
    String historyItemComment = null;
    if(OutOfPocketRequestEditForm.Mode.CREATE.equals(outOfPocketRequestEditForm.getMode()) ) {
        ProjectCode projectCode = (ProjectCode)hs.get(ProjectCode.class, new Long(outOfPocketRequestEditForm.getProjectCodeId()));
        outOfPocketRequest = new OutOfPocketRequest();
        outOfPocketRequest.setType(outOfPocketRequestEditForm.getType());
        outOfPocketRequest.setDescription(outOfPocketRequestEditForm.getDescription());
        if(OutOfPocketItem.Type.FULL.equals(outOfPocketRequest.getType()) || OutOfPocketItem.Type.NO.equals(outOfPocketRequest.getType())) {
            outOfPocketRequest.setAmount(null);
            outOfPocketRequest.setCurrency(null);
        } else {
            Currency currency = (Currency)hs.get(Currency.class, outOfPocketRequestEditForm.getCurrencyId());
            outOfPocketRequest.setCurrency(currency);
            outOfPocketRequest.setAmount(outOfPocketRequestEditForm.getAmount());
        }
        outOfPocketRequest.setProjectCode(projectCode);
        outOfPocketRequest.setStatus(outOfPocketRequestEditForm.getStatus());
        historyItemComment = "Out of pocket request created";
    } else if(OutOfPocketRequestEditForm.Mode.UPDATE.equals(outOfPocketRequestEditForm.getMode()) ) {
        outOfPocketRequest = (OutOfPocketRequest)hs.get(OutOfPocketRequest.class, outOfPocketRequestEditForm.getId());
        outOfPocketRequest.setType(outOfPocketRequestEditForm.getType());
        outOfPocketRequest.setDescription(outOfPocketRequestEditForm.getDescription());
        if(OutOfPocketItem.Type.FULL.equals(outOfPocketRequest.getType()) || OutOfPocketItem.Type.NO.equals(outOfPocketRequest.getType())) {
            outOfPocketRequest.setAmount(null);
            outOfPocketRequest.setCurrency(null);
        } else {
            Currency currency = (Currency)hs.get(Currency.class, outOfPocketRequestEditForm.getCurrencyId());
            outOfPocketRequest.setCurrency(currency);
            outOfPocketRequest.setAmount(outOfPocketRequestEditForm.getAmount());
        }
        outOfPocketRequest.setStatus(outOfPocketRequestEditForm.getStatus());        
        historyItemComment = "Out of pocket request updated";
    }
    hs.save(outOfPocketRequest);
  
    OutOfPocketRequestHistoryItem outOfPocketRequestHistoryItem = new OutOfPocketRequestHistoryItem();
    outOfPocketRequestHistoryItem.setOutOfPocketRequest(outOfPocketRequest);
    outOfPocketRequestHistoryItem.setEmployee(currentUser);
    outOfPocketRequestHistoryItem.setComment(historyItemComment);
    outOfPocketRequestHistoryItem.setStatus(outOfPocketRequest.getStatus());
    outOfPocketRequestHistoryItem.setTime(now);
    hs.save(outOfPocketRequestHistoryItem);

    %>
    {
    "status": "OK"
    }
    <%
} else if("deleteOutOfPocketRequest".equals(command)) {
    OutOfPocketRequest outOfPocketRequest = (OutOfPocketRequest)hs.get(OutOfPocketRequest.class, new Long(request.getParameter("id")));

    if(! InvoiceRequestPacket.getEditabilityStatuses().contains(outOfPocketRequest.getStatus())) {
        throw new Exception("Out of pocket request is not editable. Its status is " + outOfPocketRequest.getStatus());
    }    
    for(OutOfPocketRequestHistoryItem outOfPocketRequestHistoryItem : outOfPocketRequest.getOutOfPocketRequestHistoryItems()) {
        hs.delete(outOfPocketRequestHistoryItem);
    }
    hs.delete(outOfPocketRequest);
    %>
    {
    "status": "OK"
    }
    <%
} else if("checkOutOfPocketRequestDependencies".equals(command)) {
    OutOfPocketRequest outOfPocketRequest = (OutOfPocketRequest)hs.get(OutOfPocketRequest.class, new Long(request.getParameter("id")));
    %>
    {
    "status": "OK",
    "hasClosedStatusInHistory": <%=outOfPocketRequest.hasStatusInHistory(InvoiceRequestPacket.Status.CLOSED) %>
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