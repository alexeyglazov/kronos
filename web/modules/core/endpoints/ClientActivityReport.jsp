<%-- 
    Document   : subdepartments
    Created on : 31.03.2011, 13:08:03
    Author     : glazov
--%>
<%@page import="com.mazars.management.reports.excel.ClientActivityReportExcelBuilder"%>
<%@page import="java.text.SimpleDateFormat"%>
<%@page import="com.mazars.management.reports.vo.ClientActivityReportVO"%>
<%@page import="com.mazars.management.reports.ClientActivityReport"%>
<%@page import="com.mazars.management.web.vo.EmployeeContactLinkVO"%>
<%@page import="com.mazars.management.web.comparators.DescribedClientComparator"%>
<%@page import="com.mazars.management.web.vo.DescribedClient"%>
<%@page import="com.mazars.management.db.util.ClientListUtil"%>
<%@page import="com.mazars.management.db.util.CalendarUtil"%>
<%@page import="com.mazars.management.web.vo.ConciseEmployee"%>
<%@page import="com.mazars.management.web.vo.OfficeDepartmentSubdepartment"%>
<%@page import="com.mazars.management.db.comparators.ActivitySectorComparator"%>
<%@page import="java.io.PrintWriter"%>
<%@page import="com.mazars.management.db.comparators.ContactComparator"%>
<%@page contentType="text/html" pageEncoding="UTF-8"
    import="java.util.*"
    import="com.mazars.management.db.domain.*"
    import="com.mazars.management.db.vo.*"
    import="com.mazars.management.web.forms.*"
    import="com.mazars.management.db.util.HibernateUtil"
    import="org.hibernate.Session"
    import="com.google.gson.Gson"
    import="com.mazars.management.db.comparators.GroupComparator"
    import="com.mazars.management.db.comparators.ClientComparator"
    import="com.mazars.management.db.comparators.ClientHistoryItemComparator"
    import="com.mazars.management.web.vo.ClientHistoryItemWithGroupAndCreatedByVO"
    import="com.mazars.management.web.security.AccessChecker"
%><%
request.setCharacterEncoding("UTF-8");
Employee currentUser = (Employee)session.getAttribute("currentUser");
String command = request.getParameter("command");
Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
Gson gson = new Gson();
try {
hs.beginTransaction();
Module module = Module.getByName("Clients");

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
    ClientActivityReportForm clientActivityReportForm = ClientActivityReportForm.getFromJson(request.getParameter("clientActivityReportForm"));
    
    ClientActivityReport clientActivityReport = new ClientActivityReport(clientActivityReportForm, module, currentUser);
    clientActivityReport.build();
    ClientActivityReportVO clientActivityReportVO = new ClientActivityReportVO(clientActivityReport);    
    %>
    {
        "status": "OK",
        "report": <% gson.toJson(clientActivityReportVO, out); %>
    }
    <%
} else if("generateXLSReport".equals(command)) {
    ClientActivityReportForm clientActivityReportForm = ClientActivityReportForm.getFromJson(request.getParameter("clientActivityReportForm"));
    
    ClientActivityReport clientActivityReport = new ClientActivityReport(clientActivityReportForm, module, currentUser);
    clientActivityReport.build();

    SimpleDateFormat dateFormatterShort = new SimpleDateFormat("ddMMyyyy");
    SimpleDateFormat dateFormatterLong = new SimpleDateFormat("ddMMyyyyHHmmss");
    String fileName = "ClientActivity_";
    fileName += dateFormatterLong.format(clientActivityReport.getCreatedAt());
    fileName += ".xls";

    response.setContentType("application/vnd.ms-excel");
    response.setHeader("content-disposition", "filename=" + fileName);
    ClientActivityReportExcelBuilder reb = new ClientActivityReportExcelBuilder(clientActivityReport, response.getOutputStream());
    reb.createWorkbook();
    reb.fillWorkbook();
    reb.writeWorkbook();
}
hs.getTransaction().commit();

} catch (Exception ex) {
    %><% ex.printStackTrace(new PrintWriter(out)); %><%
    hs.getTransaction().rollback();
    %>
    {
        "status": "FAIL",
        "comment": <% gson.toJson(ex.toString(), out); %>
        }
    <%
}
%>