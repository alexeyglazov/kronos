<%-- 
    Document   : subdepartments
    Created on : 31.03.2011, 13:08:03
    Author     : glazov
--%>
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
    import="com.mazars.management.reports.CRMClientPerDepartmentReport"
    import="com.mazars.management.reports.excel.CRMClientPerDepartmentReportExcelBuilder"
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
    CRMClientPerDepartmentReport crmClientPerDepartmentReport = new CRMClientPerDepartmentReport();
    crmClientPerDepartmentReport.build();
    CRMClientPerDepartmentReportVO crmClientPerDepartmentReportVO = new CRMClientPerDepartmentReportVO(crmClientPerDepartmentReport);
    %>
    {
    "status": "OK",
    "report": <% gson.toJson(crmClientPerDepartmentReportVO, out); %>
    }
    <%
} else if("generateXLSReport".equals(command)) {
    CRMClientPerDepartmentReport crmClientPerDepartmentReport = new CRMClientPerDepartmentReport();
    crmClientPerDepartmentReport.build();

    SimpleDateFormat dateFormatterShort = new SimpleDateFormat("ddMMyyyy");
    SimpleDateFormat dateFormatterLong = new SimpleDateFormat("ddMMyyyyHHmmss");
    String fileName = "CRMCPD_";
    fileName += dateFormatterLong.format(crmClientPerDepartmentReport.getCreatedAt());
    fileName += ".xls";

    response.setContentType("application/vnd.ms-excel");
    response.setHeader("content-disposition", "filename=" + fileName);
    CRMClientPerDepartmentReportExcelBuilder reb = new CRMClientPerDepartmentReportExcelBuilder(crmClientPerDepartmentReport, response.getOutputStream());
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
