<%-- 
    Document   : subdepartments
    Created on : 31.03.2011, 13:08:03
    Author     : glazov
--%>
<%@page import="com.mazars.management.web.vo.InvoiceRequestPacketWithDataVO"%>
<%@page import="com.mazars.management.web.vo.InvoiceRequestPacketWithDataVO"%>
<%@page import="com.mazars.management.web.vo.StandardSellingRateBlockVO"%>
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
    import="com.mazars.management.db.vo.*"
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
if("getProjectCodeList".equals(command)) {
    ProjectCodeListFilter filter = ProjectCodeListFilter.getFromJson(request.getParameter("filter"));
    InvoiceRequestsFilter invoiceRequestsFilter = InvoiceRequestsFilter.getFromJson(request.getParameter("invoiceRequestsFilter"));
    ProjectCodeListSorter sorter = ProjectCodeListSorter.getFromJson(request.getParameter("sorter"));
    ProjectCodeListLimiter limiter = ProjectCodeListLimiter.getFromJson(request.getParameter("limiter"));

    List<Subdepartment> allowedSubdepartments = Subdepartment.getAllowedSubdepartments(null, null, null, currentUser, module);

    Long count = ProjectCodeListUtil.getCountOfProjectCodeFilteredList(filter, invoiceRequestsFilter, sorter, limiter, allowedSubdepartments);
    List<ProjectCode> projectCodes = ProjectCodeListUtil.getProjectCodeFilteredList(filter, invoiceRequestsFilter, sorter, limiter, allowedSubdepartments);

    List<ProjectCodeVODetailed> projectCodeVOs = new LinkedList<ProjectCodeVODetailed>();
    for(ProjectCode projectCode : projectCodes) {
        projectCodeVOs.add(new ProjectCodeVODetailed(projectCode));
    }
    %>{
    "status": "OK",
    "count": <%=count %>,
    "projectCodes": <% gson.toJson(projectCodeVOs, out); %>
    }<%
} else if("getBudgetInfo".equals(command)) {
       ProjectCode projectCode = (ProjectCode)hs.get(ProjectCode.class, new Long(request.getParameter("projectCodeId")));
       Subdepartment subdepartment = projectCode.getSubdepartment();
       List<PositionQuotationVO> positionQuotationVOs = new LinkedList<PositionQuotationVO>();
       StandardSellingRateBlockVO standardSellingRateBlockVO = null;
       List<FeesAdvanceVO> feesAdvanceVOs = new LinkedList<FeesAdvanceVO>();
       List<FeesInvoiceVO> feesInvoiceVOs = new LinkedList<FeesInvoiceVO>();
       List<FeesPaymentVO> feesPaymentVOs = new LinkedList<FeesPaymentVO>();
       List<FeesActVO> feesActVOs = new LinkedList<FeesActVO>();
       List<OutOfPocketInvoiceVO> outOfPocketInvoiceVOs = new LinkedList<OutOfPocketInvoiceVO>();
       List<OutOfPocketPaymentVO> outOfPocketPaymentVOs = new LinkedList<OutOfPocketPaymentVO>();
       List<OutOfPocketActVO> outOfPocketActVOs = new LinkedList<OutOfPocketActVO>();
       List<InvoiceRequestPacketWithDataVO> invoiceRequestPacketWithDataVOs = new LinkedList<InvoiceRequestPacketWithDataVO>();
       List<CurrencyVO> currencyVOs = new LinkedList<CurrencyVO>();
       CurrencyVO mainCurrencyVO = null;
       
       FeesItem feesItem = projectCode.getFeesItem();
       OutOfPocketItem outOfPocketItem = projectCode.getOutOfPocketItem();
       Agreement agreement = projectCode.getAgreement();
       if(feesItem != null) {
            List<PositionQuotation> positionQuotations = new LinkedList(feesItem.getPositionQuotations());
            Collections.sort(positionQuotations, new PositionQuotationComparator());
            for(PositionQuotation positionQuotation : positionQuotations) {
                positionQuotationVOs.add(new PositionQuotationVOH(positionQuotation));
            }

            if(FeesItem.Type.QUOTATION.equals(feesItem.getType())) {
                List<StandardSellingRateGroup> standardSellingRateGroups = StandardSellingRateGroup.get(subdepartment, feesItem.getDate());
                if(standardSellingRateGroups.size() == 0) {
                } else if(standardSellingRateGroups.size() >1) {
                } else {
                    standardSellingRateBlockVO = new StandardSellingRateBlockVO(standardSellingRateGroups.get(0));
                }
            }
            
            List<FeesAdvance> feesAdvances = new LinkedList(feesItem.getFeesAdvances());
            Collections.sort(feesAdvances, new FeesAdvanceComparator());
            for(FeesAdvance feesAdvance : feesAdvances) {
                feesAdvanceVOs.add(new FeesAdvanceVO(feesAdvance));
            }
            List<FeesInvoice> feesInvoices = new LinkedList(feesItem.getFeesInvoices());
            Collections.sort(feesInvoices, new FeesInvoiceComparator());
            for(FeesInvoice feesInvoice : feesInvoices) {
                feesInvoiceVOs.add(new FeesInvoiceVO(feesInvoice));
            }
            List<FeesPayment> feesPayments = new LinkedList(feesItem.getFeesPayments());
            Collections.sort(feesPayments, new FeesPaymentComparator());
            for(FeesPayment feesPayment : feesPayments) {
                feesPaymentVOs.add(new FeesPaymentVO(feesPayment));
            }
            List<FeesAct> feesActs = new LinkedList(feesItem.getFeesActs());
            Collections.sort(feesActs, new FeesActComparator());
            for(FeesAct feesAct : feesActs) {
                feesActVOs.add(new FeesActVO(feesAct));
            }
       }
       if(outOfPocketItem != null) {
            List<OutOfPocketInvoice> outOfPocketInvoices = new LinkedList(outOfPocketItem.getOutOfPocketInvoices());
            Collections.sort(outOfPocketInvoices, new OutOfPocketInvoiceComparator());
            for(OutOfPocketInvoice outOfPocketInvoice : outOfPocketInvoices) {
                outOfPocketInvoiceVOs.add(new OutOfPocketInvoiceVO(outOfPocketInvoice));
            }
            List<OutOfPocketPayment> outOfPocketPayments = new LinkedList(outOfPocketItem.getOutOfPocketPayments());
            Collections.sort(outOfPocketPayments, new OutOfPocketPaymentComparator());
            for(OutOfPocketPayment outOfPocketPayment : outOfPocketPayments) {
                outOfPocketPaymentVOs.add(new OutOfPocketPaymentVO(outOfPocketPayment));
            }
            List<OutOfPocketAct> outOfPocketActs = new LinkedList(outOfPocketItem.getOutOfPocketActs());
            Collections.sort(outOfPocketActs, new OutOfPocketActComparator());
            for(OutOfPocketAct outOfPocketAct : outOfPocketActs) {
                outOfPocketActVOs.add(new OutOfPocketActVO(outOfPocketAct));
            }
       }
       List<InvoiceRequestPacket> invoiceRequestPackets = new LinkedList<InvoiceRequestPacket>(projectCode.getInvoiceRequestPackets());
       for(InvoiceRequestPacket invoiceRequestPacket : invoiceRequestPackets) {
           invoiceRequestPacketWithDataVOs.add(new InvoiceRequestPacketWithDataVO(invoiceRequestPacket));
       }
       OutOfPocketRequest outOfPocketRequest = projectCode.getOutOfPocketRequest();
       OutOfPocketRequestVO outOfPocketRequestVO = null;
       if(outOfPocketRequest != null) {
           outOfPocketRequestVO = new OutOfPocketRequestVO(outOfPocketRequest);
       }

       List<Currency> currencies = new LinkedList(CountryCurrency.getCurrencies(projectCode.getSubdepartment().getDepartment().getOffice().getCountry()));
       Collections.sort(currencies, new CurrencyComparator());
       for(Currency currency : currencies) {
           currencyVOs.add(new CurrencyVO(currency));
       }

       List<PositionWithStandardPositionVO> positionWithStandardPositionVOs = new LinkedList<PositionWithStandardPositionVO>();
       for(Position position : subdepartment.getPositions()) {
           positionWithStandardPositionVOs.add(new PositionWithStandardPositionVO(position));
       }
       Collections.sort(positionWithStandardPositionVOs, new PositionWithStandardPositionComparator());
       
       Currency mainCurrency =  CountryCurrency.getMainCurrency(projectCode.getSubdepartment().getDepartment().getOffice().getCountry());
%>
{
"status": "OK",
"projectCode": <% gson.toJson(new ProjectCodeVO(projectCode), out); %>,
<% if(feesItem != null) { %>
    "feesItem": <% gson.toJson(new FeesItemVOH(feesItem), out); %>,
<% } else { %>
    "feesItem": null,
<% } %>

<% if(outOfPocketItem != null) { %>
    "outOfPocketItem": <% gson.toJson(new OutOfPocketItemVOH(outOfPocketItem), out); %>,
<% } else { %>
    "outOfPocketItem": null,
<% } %>

<% if(agreement != null) { %>
    "agreement": <% gson.toJson(new AgreementVO(agreement), out); %>,
<% } else { %>
    "agreement": null,
<% } %>

"positionQuotations": <% gson.toJson(positionQuotationVOs, out); %>,
<% if(standardSellingRateBlockVO != null) { %>
    "standardSellingRateBlock": <% gson.toJson(standardSellingRateBlockVO, out); %>,
<% } else { %>
    "standardSellingRateBlock": null,
<% } %>
"feesAdvances": <% gson.toJson(feesAdvanceVOs, out); %>,
"feesInvoices": <% gson.toJson(feesInvoiceVOs, out); %>,
"feesPayments": <% gson.toJson(feesPaymentVOs, out); %>,
"feesActs": <% gson.toJson(feesActVOs, out); %>,
"outOfPocketInvoices": <% gson.toJson(outOfPocketInvoiceVOs, out); %>,
"outOfPocketPayments": <% gson.toJson(outOfPocketPaymentVOs, out); %>,
"outOfPocketActs": <% gson.toJson(outOfPocketActVOs, out); %>,
"invoiceRequestPackets": <% gson.toJson(invoiceRequestPacketWithDataVOs, out); %>,
<% if(outOfPocketRequestVO != null) { %>
    "outOfPocketRequest": <% gson.toJson(outOfPocketRequestVO, out); %>,
<% } else {%>
    "outOfPocketRequest": null,
<% } %>
"currencies": <% gson.toJson(currencyVOs, out); %>,
"mainCurrency": <% gson.toJson(new CurrencyVO(mainCurrency), out); %>,
"positions": <% gson.toJson(positionWithStandardPositionVOs, out); %>
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
