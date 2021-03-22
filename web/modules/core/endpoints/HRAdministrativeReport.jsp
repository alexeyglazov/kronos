<%-- 
    Document   : subdepartments
    Created on : 31.03.2011, 13:08:03
    Author     : glazov
--%>
<%@page import="com.mazars.management.reports.HRAdministrativeReport"%>
<%@page contentType="text/html" pageEncoding="UTF-8"
    import="java.util.List"
    import="java.util.LinkedList"
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
    import="com.mazars.management.reports.SalaryReport"
    import="com.mazars.management.reports.excel.*"
    import="com.mazars.management.web.security.AccessChecker"
    import="com.mazars.management.db.comparators.*"
    import="java.util.Map"
    import="java.util.HashMap"
%><%
request.setCharacterEncoding("UTF-8");
Employee currentUser = (Employee)session.getAttribute("currentUser");
String command = request.getParameter("command");
Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
Gson gson = new Gson();
try {
hs.beginTransaction();
Module module = Module.getByName("HR Report");

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
if("generateReport".equals(command)) {
    HRAdministrativeReportForm hrAdministrativeReportForm = HRAdministrativeReportForm.getFromJson(request.getParameter("hrAdministrativeReportForm"));
    HRAdministrativeReport hrAdministrativeReport = new HRAdministrativeReport(hrAdministrativeReportForm, module, currentUser);
    hrAdministrativeReport.build();
    HRAdministrativeReportVO hrAdministrativeReportVO = new HRAdministrativeReportVO(hrAdministrativeReport);
    %>
    {
    "status": "OK",
    "report": <% gson.toJson(hrAdministrativeReportVO, out); %>
    }
    <%
} else if("generateXLSReport".equals(command)) {
    HRAdministrativeReportForm hrAdministrativeReportForm = HRAdministrativeReportForm.getFromJson(request.getParameter("hrAdministrativeReportForm"));
    HRAdministrativeReport hrAdministrativeReport = new HRAdministrativeReport(hrAdministrativeReportForm, module, currentUser);
    hrAdministrativeReport.build();

    SimpleDateFormat dateFormatterShort = new SimpleDateFormat("ddMMyyyy");
    SimpleDateFormat dateFormatterLong = new SimpleDateFormat("ddMMyyyyHHmmss");
    String fileName = "HRAdministrative_";
    fileName += dateFormatterShort.format(hrAdministrativeReport.getFormStartDate().getTime());
    fileName += "_";
    fileName += dateFormatterShort.format(hrAdministrativeReport.getFormEndDate().getTime());
    fileName += "_";
    fileName += dateFormatterLong.format(hrAdministrativeReport.getCreatedAt());
    fileName += ".xls";

    response.setContentType("application/vnd.ms-excel");
    response.setHeader("content-disposition", "filename=" + fileName);
    HRAdministrativeReportExcelBuilder reb = new HRAdministrativeReportExcelBuilder(hrAdministrativeReport, response.getOutputStream());
    reb.createWorkbook();
    reb.fillWorkbook();
    reb.writeWorkbook();
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
