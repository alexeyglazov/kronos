<%-- 
    Document   : subdepartments
    Created on : 31.03.2011, 13:08:03
    Author     : glazov
--%>
<%@page import="com.mazars.management.db.util.CalendarUtil"%>
<%@page contentType="text/html" pageEncoding="UTF-8"
    import="java.util.*"
    import="com.mazars.management.db.domain.Currency"
    import="com.mazars.management.db.domain.Employee"
    import="com.mazars.management.db.domain.Subdepartment"
    import="com.mazars.management.db.domain.Module"
    import="com.mazars.management.db.domain.Client"
    import="com.mazars.management.db.domain.Office"
    import="com.mazars.management.db.domain.Department"
    import="com.mazars.management.db.domain.Group"
    import="com.mazars.management.db.domain.Country"
    import="com.mazars.management.db.domain.RightsItem"
    import="com.mazars.management.db.domain.CountryCurrency"

    import="com.mazars.management.db.vo.*"
    import="com.mazars.management.web.forms.*"
    import="com.mazars.management.db.util.HibernateUtil"
    import="org.hibernate.Session"
    import="com.google.gson.Gson"
    import="com.mazars.management.reports.*"
    import="com.mazars.management.reports.vo.*"
    import="com.mazars.management.reports.excel.*"
    import="java.text.SimpleDateFormat"
    import="com.mazars.management.db.comparators.*"
    import="com.mazars.management.web.security.AccessChecker"
    import="java.util.zip.*"
%><%
request.setCharacterEncoding("UTF-8");
Employee currentUser = (Employee)session.getAttribute("currentUser");
String command = request.getParameter("command");
Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
Gson gson = new Gson();
try {
hs.beginTransaction();
Module module = Module.getByName("Code Report");

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
if("getInitialContent".equals(command)) {
} else if("generateReport".equals(command)) {
    CodeListReportForm codeListReportForm = CodeListReportForm.getFromJson(request.getParameter("codeListReportForm"));
    CodeListReport codeListReport = new CodeListReport(codeListReportForm, module, currentUser);
    
    codeListReport.build();
    CodeListReportVO codeListReportVO = new CodeListReportVO(codeListReport);
    %>
    {
        "status": "OK",
        "report": <% gson.toJson(codeListReportVO, out); %>
    }
    <%
} else if("generateXLSReport".equals(command)) {
    CodeListReportForm codeListReportForm = CodeListReportForm.getFromJson(request.getParameter("codeListReportForm"));
    CodeListReport codeListReport = new CodeListReport(codeListReportForm, module, currentUser);

    codeListReport.build();
    SimpleDateFormat dateFormatterShort = new SimpleDateFormat("ddMMyyyy");
    SimpleDateFormat dateFormatterLong = new SimpleDateFormat("ddMMyyyyHHmmss");

    String fileName = "CL_";
    fileName += dateFormatterLong.format(codeListReport.getCreatedAt());
    fileName += ".xls";

    response.setContentType("application/vnd.ms-excel");
    response.setHeader("content-disposition", "filename=" + fileName);
    CodeListReportExcelBuilder reb = new CodeListReportExcelBuilder(codeListReport);
    reb.createStandardReport(response.getOutputStream());
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