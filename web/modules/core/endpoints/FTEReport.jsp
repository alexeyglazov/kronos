<%-- 
    Document   : subdepartments
    Created on : 31.03.2011, 13:08:03
    Author     : glazov
--%><%@page contentType="text/html" pageEncoding="UTF-8"
    import="java.util.*"
    import="com.mazars.management.db.domain.*"
    import="com.mazars.management.db.vo.*"
    import="com.mazars.management.web.forms.*"
    import="com.mazars.management.db.util.HibernateUtil"
    import="org.hibernate.Session"
    import="com.google.gson.Gson"
    import="com.mazars.management.reports.OwnTimeReport"
    import="com.mazars.management.reports.vo.*"
    import="java.text.SimpleDateFormat"
    import="com.mazars.management.reports.FTEReport"
    import="com.mazars.management.reports.excel.*"
    import="com.mazars.management.web.security.AccessChecker"
    import="com.mazars.management.db.comparators.*"
    import="java.io.PrintWriter"
    import="java.io.PrintStream"
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
    FTEReportForm fteReportForm = FTEReportForm.getFromJson(request.getParameter("fteReportForm"));
    FTEReport fteReport = new FTEReport(fteReportForm, module, currentUser);
    fteReport.build();
    FTEReportVO fteReportVO = new FTEReportVO(fteReport);
    %>
    {
    "status": "OK",
    "report": <% gson.toJson(fteReportVO, out); %>
    }
    <%
} else if("generateXLSReport".equals(command)) {
    FTEReportForm fteReportForm = FTEReportForm.getFromJson(request.getParameter("fteReportForm"));
    FTEReport fteReport = new FTEReport(fteReportForm, module, currentUser);
    fteReport.build();
    SimpleDateFormat dateFormatterShort = new SimpleDateFormat("ddMMyyyy");
    SimpleDateFormat dateFormatterLong = new SimpleDateFormat("ddMMyyyyHHmmss");
    String fileName = "FTE_";
    fileName += dateFormatterShort.format(fteReport.getFormStartDate().getTime());
    fileName += "_";
    fileName += dateFormatterShort.format(fteReport.getFormEndDate().getTime());
    fileName += "_";
    fileName += dateFormatterLong.format(fteReport.getCreatedAt());
    fileName += ".xls";

    response.setContentType("application/vnd.ms-excel");
    response.setHeader("content-disposition", "filename=" + fileName);
    FTEReportExcelBuilder reb = new FTEReportExcelBuilder(fteReport, response.getOutputStream());
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
        "comment": <% gson.toJson(ex.toString(), out); %><% ex.printStackTrace(new PrintWriter(out)); %>
    }
<%
}
%>
