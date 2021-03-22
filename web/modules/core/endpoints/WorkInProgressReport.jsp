<%--
    Document   : subdepartments
    Created on : 31.03.2011, 13:08:03
    Author     : glazov
--%>
<%@page import="java.io.PrintWriter"%>
<%@page import="java.io.PrintStream"%>
<%@page contentType="text/html" pageEncoding="UTF-8"
    import="java.util.List"
    import="java.util.LinkedList"
    import="java.util.Collections"
    import="java.util.Map"
    import="java.util.HashMap"
    import="java.math.BigDecimal"
    import="java.util.Locale"
    import="java.util.Calendar"
    import="com.mazars.management.db.domain.*"
    import="com.mazars.management.db.vo.*"
    import="com.mazars.management.web.forms.*"
    import="com.mazars.management.db.util.HibernateUtil"
    import="org.hibernate.Session"
    import="com.google.gson.Gson"
    import="com.mazars.management.reports.OwnTimeReport"
    import="com.mazars.management.reports.vo.*"
    import="java.text.SimpleDateFormat"
    import="com.mazars.management.reports.OwnTimeReport"
    import="com.mazars.management.reports.excel.*"
    import="com.mazars.management.web.security.AccessChecker"
    import="com.mazars.management.db.comparators.*"
    import="com.mazars.management.reports.WorkInProgressReport"
%><%
request.setCharacterEncoding("UTF-8");
Employee currentUser = (Employee)session.getAttribute("currentUser");
String command = request.getParameter("command");
Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
Gson gson = new Gson();
try {
hs.beginTransaction();
Module module = Module.getByName("Financial Information Report");

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

Employee employee = (Employee)hs.get(Employee.class, new Long(currentUser.getId()));
if("getInitialContent".equals(command)) {
       List<CurrencyVO> currencyVOs = new LinkedList<CurrencyVO>();
       Country country = employee.getCountry();
       Currency mainCurrency = CountryCurrency.getMainCurrency(country);
       List<Currency> currencies = CountryCurrency.getCurrencies(country);
       Collections.sort(currencies, new CurrencyComparator());
       for(Currency currency : currencies) {
            currencyVOs.add(new CurrencyVO(currency));
       }

       Integer projectCodeMinYear = ProjectCode.getMinYear();
%>
{
"status": "OK",
"mainCurrency": <% gson.toJson(new CurrencyVO(mainCurrency), out); %>,
"currencies": <% gson.toJson(currencyVOs, out); %>,
"projectCodeMinYear": <%=projectCodeMinYear %>
}
<%
} else if("generateReports".equals(command)) {
    WorkInProgressReportForm workInProgressReportForm = WorkInProgressReportForm.getFromJson(request.getParameter("workInProgressReportForm"));
    Calendar endDate = workInProgressReportForm.getEndDate().getCalendar();
    WorkInProgressReportFilter filter = workInProgressReportForm.getFilter();
    Map<Long, BigDecimal> currencyRates = workInProgressReportForm.getCurrencyRates();
    if(currentUser.getProfile().equals(Employee.Profile.SUPER_USER) || currentUser.getProfile().equals(Employee.Profile.COUNTRY_ADMINISTRATOR)) {
        List<Subdepartment> allowedSubdepartments = new LinkedList<Subdepartment>();
        if(currentUser.getProfile().equals(Employee.Profile.SUPER_USER)) {
            allowedSubdepartments.addAll(RightsItem.getSubdepartments(employee, module, currentUser.getCountry() ));
        } else if(currentUser.getProfile().equals(Employee.Profile.COUNTRY_ADMINISTRATOR)) {
            allowedSubdepartments.addAll(currentUser.getCountry().getSubdepartments());
        }
        WorkInProgressReport workInProgressReport = new WorkInProgressReport(endDate, currencyRates, filter, allowedSubdepartments);
        Country country = employee.getCountry();
        Currency mainCurrency = CountryCurrency.getMainCurrency(country);
        List<Currency> currencies = CountryCurrency.getCurrencies(country);
        workInProgressReport.setMainCurrency(mainCurrency);
        workInProgressReport.setCurrencies(currencies);
        workInProgressReport.build();
        WorkInProgressReportVO workInProgressReportVO = new WorkInProgressReportVO(workInProgressReport);
        %>
        {
        "status": "OK",
        "workInProgressReport": <% gson.toJson(workInProgressReportVO, out); %>
        }
        <%
    } else {
        %>
        {
        "status": "FAIL",
        "comment": "Only SUPER_USER and COUNTRY_ADMINISTRATOR can build this report"
        }
        <%
    }
} else if("generateXLSReports".equals(command)) {
    WorkInProgressReportForm workInProgressReportForm = WorkInProgressReportForm.getFromJson(request.getParameter("workInProgressReportForm"));
    Calendar endDate = workInProgressReportForm.getEndDate().getCalendar();
    WorkInProgressReportFilter filter = workInProgressReportForm.getFilter();
    Map<Long, BigDecimal> currencyRates = workInProgressReportForm.getCurrencyRates();
    if(currentUser.getProfile().equals(Employee.Profile.SUPER_USER) || currentUser.getProfile().equals(Employee.Profile.COUNTRY_ADMINISTRATOR)) {
        List<Subdepartment> allowedSubdepartments = new LinkedList<Subdepartment>();
        if(currentUser.getProfile().equals(Employee.Profile.SUPER_USER)) {
            allowedSubdepartments.addAll(RightsItem.getSubdepartments(employee, module, currentUser.getCountry() ));
        } else if(currentUser.getProfile().equals(Employee.Profile.COUNTRY_ADMINISTRATOR)) {
            allowedSubdepartments.addAll(currentUser.getCountry().getSubdepartments());
        }
        WorkInProgressReport workInProgressReport = new WorkInProgressReport(endDate, currencyRates, filter, allowedSubdepartments);
        Country country = employee.getCountry();
        Currency mainCurrency = CountryCurrency.getMainCurrency(country);
        List<Currency> currencies = CountryCurrency.getCurrencies(country);
        workInProgressReport.setMainCurrency(mainCurrency);
        workInProgressReport.setCurrencies(currencies);
        workInProgressReport.build();

        SimpleDateFormat dateFormatterShort = new SimpleDateFormat("ddMMyyyy");
        SimpleDateFormat dateFormatterLong = new SimpleDateFormat("ddMMyyyyHHmmss");
        String fileName = "WIP_";
        fileName += dateFormatterShort.format(workInProgressReportForm.getEndDate().getCalendar().getTime());
        fileName += "_";
        fileName += dateFormatterLong.format(workInProgressReport.getCreatedAt());
        fileName += ".xls";

        response.setContentType("application/vnd.ms-excel");
        response.setHeader("content-disposition", "filename=" + fileName);
        WorkInProgressReportExcelBuilder reb = new WorkInProgressReportExcelBuilder(workInProgressReport, response.getOutputStream());
        reb.createWorkbook();
        reb.fillWorkbook();
        reb.writeWorkbook();
    } else {
        %>"Only SUPER_USER and COUNTRY_ADMINISTRATOR can build this report"<%
    }
}
hs.getTransaction().commit();

} catch (Exception ex) {
    hs.getTransaction().rollback();
    %>
    {
        "status": "FAIL",
        "comment": <% gson.toJson(ex.toString(), out); %>
        <% ex.printStackTrace(new PrintWriter(out)); %>
    }
    <%
}
%>
