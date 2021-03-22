<%-- 
    Document   : subdepartments
    Created on : 31.03.2011, 13:08:03
    Author     : glazov
--%>
<%@page import="com.mazars.management.reports.PlanningProjectsReport"%>
<%@page import="java.io.PrintWriter"%>
<%@page import="java.io.PrintStream"%>
<%@page import="com.mazars.management.service.ConfigUtils"%>
<%@page import="com.mazars.management.reports.PlanningUsersReport"%>
<%@page contentType="text/html" pageEncoding="UTF-8"
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
    import="com.mazars.management.reports.OwnTimeReport"
    import="com.mazars.management.reports.excel.*"
    import="com.mazars.management.web.security.AccessChecker"
    import="com.mazars.management.db.comparators.*"
%><%
request.setCharacterEncoding("UTF-8");
Employee currentUser = (Employee)session.getAttribute("currentUser");
String command = request.getParameter("command");
Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
Gson gson = new Gson();
try {
hs.beginTransaction();

%><%--
Module module = Module.getByName("Timesheets Report");

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
--%><%

if(command  == null) {
    command = "showForm";
}
if("showForm".equals(command)) {
%>
    <form method="post" action="Planning.jsp">
        <table>
        <tr><td>UserName</td><td><input type="text" name="userName"></td></tr>
        <tr><td>Password</td><td><input type="password" name="password"></td></tr>
        <tr><td>Action</td><td><select name="command"><option value="generateUsersReport">Users</option><option value="generateProjectsReport">Projects</option></select></td></tr>
        <tr><td></td><td><input type="submit" value="Submit"></td></tr>
        </table>
    </form>    
<%    
} else if("generateUsersReport".equals(command)) {
    String userName = request.getParameter("userName");
    String password = request.getParameter("password");
    if(
       ConfigUtils.getProperties().get("retain.user.userName").equals(userName) &&
       ConfigUtils.getProperties().get("retain.user.password").equals(password)
       ) {
        PlanningUsersReport planningUsersReport = new PlanningUsersReport();
        planningUsersReport.build();

        String fileName = "PlanningUsers.xls";

        response.setContentType("application/vnd.ms-excel");
        response.setHeader("content-disposition", "filename=" + fileName);
        PlanningUsersReportExcelBuilder reb = new PlanningUsersReportExcelBuilder(planningUsersReport, response.getOutputStream());
        reb.createReport();
    } else {
        %>
        <h3>userName or password is incorrect.</h3>
        Usage: ?command=generateUsersReport&userName=SOMEUSERNAME&password=SOMEPASSWORD<br />
        or: ?command=generateProjectsReport&userName=SOMEUSERNAME&password=SOMEPASSWORD<br />
        Or use this <a href="?command=showForm">link</a> for manual input
        <%
    }
} else if("generateProjectsReport".equals(command)) {
    String userName = request.getParameter("userName");
    String password = request.getParameter("password");
    if(
       ConfigUtils.getProperties().get("retain.user.userName").equals(userName) &&
       ConfigUtils.getProperties().get("retain.user.password").equals(password)
       ) {
        PlanningProjectsReport planningProjectsReport = new PlanningProjectsReport();
        planningProjectsReport.build();

        String fileName = "PlanningProjects.xls";

        response.setContentType("application/vnd.ms-excel");
        response.setHeader("content-disposition", "filename=" + fileName);
        PlanningProjectsReportExcelBuilder reb = new PlanningProjectsReportExcelBuilder(planningProjectsReport, response.getOutputStream());
        reb.createReport();
    } else {
        %>
        <h3>userName or password is incorrect.</h3>
        Usage: ?command=generateUsersReport&userName=SOMEUSERNAME&password=SOMEPASSWORD<br />
        or: ?command=generateProjectsReport&userName=SOMEUSERNAME&password=SOMEPASSWORD<br />
        Or use this <a href="?command=showForm">link</a> for manual input
        <%
    }
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
    ex.printStackTrace(new PrintWriter(out));
}
%>
