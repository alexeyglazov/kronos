<%-- 
    Document   : subdepartments
    Created on : 31.03.2011, 13:08:03
    Author     : glazov
--%>
<%@page import="java.io.PrintWriter"%>
<%@page import="java.io.PrintStream"%>
<%@page import="java.io.Writer"%>
<%@page import="com.mazars.management.reports.CRMClientReport"%>
<%@page import="com.mazars.management.db.comparators.ProjectCodeComparator"%>
<%@page import="com.mazars.management.db.comparators.ClientComparator"%>
<%@page contentType="text/html" pageEncoding="UTF-8"
    import="java.util.*"
    import="com.mazars.management.db.domain.*"
    import="com.mazars.management.db.vo.*"
    import="com.mazars.management.web.forms.*"
    import="com.mazars.management.db.util.HibernateUtil"
    import="org.hibernate.Session"
    import="com.google.gson.Gson"
    import="com.mazars.management.reports.vo.*"
    import="java.text.SimpleDateFormat"
    import="com.mazars.management.reports.CRMClientReport"
    import="com.mazars.management.reports.excel.CRMClientReportExcelBuilder"
    import="com.mazars.management.web.security.AccessChecker"
%><%
request.setCharacterEncoding("UTF-8");
Employee currentUser = (Employee)session.getAttribute("currentUser");
String command = request.getParameter("command");
Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
Gson gson = new Gson();
try {
hs.beginTransaction();
Module module = Module.getByName("Clients Report");


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
    
} else if("generateReport".equals(command)) {
    CRMClientReport crmClientReport = new CRMClientReport();
    crmClientReport.build();
    CRMClientReportVO crmClientReportVO = new CRMClientReportVO(crmClientReport);
    %>
    {
    "status": "OK",
    "report": <% gson.toJson(crmClientReportVO, out); %>
    }
    <%
} else if("generateXLSReport".equals(command)) {
    CRMClientReport crmClientReport = new CRMClientReport();
    crmClientReport.build();

    SimpleDateFormat dateFormatterShort = new SimpleDateFormat("ddMMyyyy");
    SimpleDateFormat dateFormatterLong = new SimpleDateFormat("ddMMyyyyHHmmss");
    String fileName = "CRMC_";
    fileName += dateFormatterLong.format(crmClientReport.getCreatedAt());
    fileName += ".xls";

    response.setContentType("application/vnd.ms-excel");
    response.setHeader("content-disposition", "filename=" + fileName);
    CRMClientReportExcelBuilder reb = new CRMClientReportExcelBuilder(crmClientReport, response.getOutputStream());
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
    <% ex.printStackTrace(new PrintWriter(out));
}
%>
