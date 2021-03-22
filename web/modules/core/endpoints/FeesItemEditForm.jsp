<%-- 
    Document   : subdepartments
    Created on : 31.03.2011, 13:08:03
    Author     : glazov
--%>
<%@page import="java.io.PrintWriter"%>
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
    Subdepartment subdepartment = projectCode.getSubdepartment();
    Country country = subdepartment.getDepartment().getOffice().getCountry();
    Calendar date = new GregorianCalendar();
    CalendarUtil.truncateTime(date);
    if(projectCode.getFeesItem() != null) {
        date = projectCode.getFeesItem().getDate();
    }

    List<CurrencyVO> currencyVOs = new LinkedList<CurrencyVO>();
    StandardSellingRateBlockVO standardSellingRateBlockVO = new StandardSellingRateBlockVO();
    for(Currency currency : CountryCurrency.getCurrencies(country) ) {
        currencyVOs.add(new CurrencyVO(currency));
    }
    List<PositionWithStandardPositionVO> positionWithStandardPositionVOs = new LinkedList<PositionWithStandardPositionVO>();
    for(Position position : subdepartment.getPositions()) {
        positionWithStandardPositionVOs.add(new PositionWithStandardPositionVO(position));
    }
    Collections.sort(positionWithStandardPositionVOs, new PositionWithStandardPositionComparator());
    
    List<StandardSellingRateGroup> standardSellingRateGroups = StandardSellingRateGroup.get(subdepartment, date);
    if(standardSellingRateGroups.size() == 0) {
    } else if(standardSellingRateGroups.size() >1) {
    } else {
        standardSellingRateBlockVO = new StandardSellingRateBlockVO(standardSellingRateGroups.get(0));
    }
    %>
    {
        "status": "OK",
        "projectCode": <% gson.toJson(new ProjectCodeVO(projectCode), out); %>,
        "currencies": <% gson.toJson(currencyVOs, out); %>,
        "positions": <% gson.toJson(positionWithStandardPositionVOs, out); %>,
        "standardSellingRateBlock": <% gson.toJson(standardSellingRateBlockVO, out); %>
    }
    <%
} else if("saveFeesItem".equals(command)) {
    FeesItemEditForm feesItemEditForm = FeesItemEditForm.getFromJson(request.getParameter("feesItemEditForm"));
    if(FeesItemEditForm.Mode.CREATE.equals(feesItemEditForm.getMode())) {
        Calendar date = new GregorianCalendar();
        CalendarUtil.truncateTime(date);
        ProjectCode projectCode = (ProjectCode)hs.get(ProjectCode.class, new Long(feesItemEditForm.getProjectCodeId()));
        Currency advanceCurrency = (Currency)hs.get(Currency.class, new Long(feesItemEditForm.getFeesAdvanceCurrencyId()));
        Currency invoiceCurrency = (Currency)hs.get(Currency.class, new Long(feesItemEditForm.getFeesInvoiceCurrencyId()));
        Currency paymentCurrency = (Currency)hs.get(Currency.class, new Long(feesItemEditForm.getFeesPaymentCurrencyId()));
        Currency actCurrency = (Currency)hs.get(Currency.class, new Long(feesItemEditForm.getFeesActCurrencyId()));
        FeesItem feesItem = new FeesItem();
        feesItem.setDate(date);
        feesItem.setProjectCode(projectCode);
        feesItem.setType(feesItemEditForm.getType());
        feesItem.setFeesAdvanceCurrency(advanceCurrency);
        feesItem.setFeesInvoiceCurrency(invoiceCurrency);
        feesItem.setFeesPaymentCurrency(paymentCurrency);
        feesItem.setFeesActCurrency(actCurrency);
        if(FeesItem.Type.FLAT_FEE.equals(feesItemEditForm.getType()) || FeesItem.Type.TIMESPENT.equals(feesItemEditForm.getType())) {
            feesItem.setQuotationCurrencyRate(null);
            feesItem.setQuotationNegociated(null);
        } else if(FeesItem.Type.QUOTATION.equals(feesItemEditForm.getType())) {
            feesItem.setQuotationCurrencyRate(feesItemEditForm.getQuotationCurrencyRate());
            feesItem.setQuotationNegociated(feesItemEditForm.getQuotationNegociated());
        }
        feesItem.setVat(feesItemEditForm.getVat());
        feesItem.setComment(feesItemEditForm.getComment());

        hs.save(feesItem);

        if(FeesItem.Type.FLAT_FEE.equals(feesItemEditForm.getType()) || FeesItem.Type.TIMESPENT.equals(feesItemEditForm.getType())) {
            // nothing to do
        } else {
            for(FeesItemEditForm.PositionQuotation positionQuotationTmp : feesItemEditForm.getPositionQuotations()) {
                Position position = (Position)hs.get(Position.class, new Long(positionQuotationTmp.getPositionId()));
                PositionQuotation positionQuotation = new PositionQuotation();
                positionQuotation.setFeesItem(feesItem);
                positionQuotation.setPosition(position);
                positionQuotation.setTime(positionQuotationTmp.getTime());
                hs.save(positionQuotation);
            }
        }
    } else if(FeesItemEditForm.Mode.UPDATE.equals(feesItemEditForm.getMode())) {
        FeesItem feesItem = (FeesItem)hs.get(FeesItem.class, new Long(feesItemEditForm.getId()));
        Currency advanceCurrency = (Currency)hs.get(Currency.class, new Long(feesItemEditForm.getFeesAdvanceCurrencyId()));
        Currency invoiceCurrency = (Currency)hs.get(Currency.class, new Long(feesItemEditForm.getFeesInvoiceCurrencyId()));
        Currency paymentCurrency = (Currency)hs.get(Currency.class, new Long(feesItemEditForm.getFeesPaymentCurrencyId()));
        Currency actCurrency = (Currency)hs.get(Currency.class, new Long(feesItemEditForm.getFeesActCurrencyId()));
        feesItem.setType(feesItemEditForm.getType());
        feesItem.setFeesAdvanceCurrency(advanceCurrency);
        feesItem.setFeesInvoiceCurrency(invoiceCurrency);
        feesItem.setFeesPaymentCurrency(paymentCurrency);
        feesItem.setFeesActCurrency(actCurrency);

        if(FeesItem.Type.FLAT_FEE.equals(feesItemEditForm.getType()) || FeesItem.Type.TIMESPENT.equals(feesItemEditForm.getType())) {
            feesItem.setQuotationCurrencyRate(null);
            feesItem.setQuotationNegociated(null);
        } else {
            feesItem.setQuotationCurrencyRate(feesItemEditForm.getQuotationCurrencyRate());
            feesItem.setQuotationNegociated(feesItemEditForm.getQuotationNegociated());
        }
        feesItem.setVat(feesItemEditForm.getVat());
        feesItem.setComment(feesItemEditForm.getComment());
        hs.save(feesItem);

        for(PositionQuotation positionQuotation : feesItem.getPositionQuotations()) {
            hs.delete(positionQuotation);
        }
        
        if(FeesItem.Type.QUOTATION.equals(feesItemEditForm.getType())) {       
            for(FeesItemEditForm.PositionQuotation positionQuotationTmp : feesItemEditForm.getPositionQuotations()) {
                Position position = (Position)hs.get(Position.class, new Long(positionQuotationTmp.getPositionId()));
                PositionQuotation positionQuotation = new PositionQuotation();
                positionQuotation.setFeesItem(feesItem);
                positionQuotation.setPosition(position);
                positionQuotation.setTime(positionQuotationTmp.getTime());   
                hs.save(positionQuotation);
            }
        }
    }
    %>
    {
    "status": "OK"
    }
    <%
} else if("deleteFeesItem".equals(command)) {
    FeesItem feesItem = (FeesItem)hs.get(FeesItem.class, new Long(request.getParameter("id")));
    for(PositionQuotation positionQuotation : feesItem.getPositionQuotations()) {
        hs.delete(positionQuotation);
    }
    hs.delete(feesItem);
    %>
    {
    "status": "OK"
    }
    <%
} else if("checkFeesItemDependencies".equals(command)) {
    FeesItem feesItem = (FeesItem)hs.get(FeesItem.class, new Long(request.getParameter("id")));
    ProjectCode projectCode = feesItem.getProjectCode();
    %>
    {
    "status": "OK",
    "feesAdvances": <%=feesItem.getFeesAdvances().size() %>,
    "feesInvoices": <%=feesItem.getFeesInvoices().size() %>,
    "feesPayments": <%=feesItem.getFeesPayments().size() %>,
    "feesActs": <%=feesItem.getFeesActs().size() %>,
    "outOfPocketItem": <%=projectCode.getOutOfPocketItem() != null %>,
    "agreement": <%=projectCode.getAgreement() != null %>
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
    <% ex.printStackTrace(new PrintWriter(out) );
}
%>