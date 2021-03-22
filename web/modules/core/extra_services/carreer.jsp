<%--
    Document   : subdepartments
    Created on : 31.03.2011, 13:08:03
    Author     : glazov
--%>
<%@page import="com.mazars.management.web.content.ContentManager"%>
<%@page import="com.mazars.management.web.vo.OfficeDepartmentSubdepartment"%>
<%@page import="com.mazars.management.web.vo.LeavesBalanceCalculatorResult"%>
<%@page import="com.mazars.management.db.util.EmployeePositionHistoryItemUtils"%>
<%@page import="com.mazars.management.service.LeavesBalanceCalculator"%>
<%@page import="com.mazars.management.reports.InvoiceRequestReport"%>
<%@page import="com.mazars.management.db.util.CalendarUtil"%>
<%@page import="com.mazars.management.reports.jobs.ProfitabilityReportJob"%>
<%@page import="com.mazars.management.jobs.JobManager"%>
<%@page import="com.mazars.management.jobs.Job"%>
<%@page import="com.mazars.management.service.ObjectUtils"%>
<%@page import="java.io.ObjectOutputStream"%>
<%@page import="java.io.ObjectOutput"%>
<%@page import="java.io.ByteArrayOutputStream"%>
<%@page import="javax.crypto.SecretKey"%>
<%@page import="com.mazars.management.security.SecurityUtils"%>
<%@page import="java.net.URI"%>
<%@page import="com.mazars.management.reports.ProfitabilityReport"%>
<%@page import="java.io.PrintWriter"%>
<%@page import="java.io.PrintStream"%>
<%@page import="jxl.write.WritableSheet"%>
<%@page import="jxl.write.Label"%>
<%@page import="jxl.Sheet"%>
<%@page import="jxl.write.WritableWorkbook"%>
<%@page import="java.io.File"%>
<%@page import="jxl.Workbook"%>
<%@page import="com.mazars.management.service.ConfigUtils"%>
<%@page import="java.text.SimpleDateFormat"%>
<%@page import="java.math.BigDecimal"%>
<%@page import="org.hibernate.Query"%>
<%@page contentType="text/html" pageEncoding="UTF-8"
    import="java.util.*"
    import="com.mazars.management.db.domain.*"
    import="com.mazars.management.db.vo.*"
    import="com.mazars.management.web.forms.*"
    import="com.mazars.management.db.util.HibernateUtil"
    import="org.hibernate.Session"
    import="com.google.gson.Gson"
    import="com.mazars.management.web.security.AccessChecker"
    import="com.mazars.management.db.comparators.*"
%><%
request.setCharacterEncoding("UTF-8");
Gson gson = new Gson();
Employee currentUser = (Employee)session.getAttribute("currentUser");
Locale locale = new Locale("en");
Session hs = HibernateUtil.getSessionFactory().getCurrentSession();


try {
    hs.beginTransaction();
%>    
<%-- start of access.jsp --%>
<%
AccessChecker.Status status = null;

Module module = Module.getByName("HR");
AccessChecker accessChecker = new AccessChecker();
status = accessChecker.check(currentUser, module);
    
if(AccessChecker.Status.NOT_LOGGED_IN.equals(status)) {
    response.sendRedirect(ContentManager.link("/pages/" + locale + "/login.jsp?status=" + status));
} else if(AccessChecker.Status.NOT_AUTHORIZED.equals(status)) {
    response.sendRedirect(ContentManager.link("/pages/" + locale + "/login.jsp?status=" + status));
} else if(AccessChecker.Status.NOT_AUTHORIZED_TO_MODULE.equals(status)) {
    response.sendRedirect(ContentManager.link("/pages/" + locale + "/login.jsp?status=" + status));
} else if(AccessChecker.Status.PASSWORD_MUST_BE_CHANGED.equals(status)) {
    response.sendRedirect(ContentManager.link("/pages/" + locale + "/changePassword.jsp?status=" + status));
}
if(! AccessChecker.Status.VALID.equals(status)) {
    hs.getTransaction().commit();
    return;
}
%>
<%-- end of access.jsp --%>
<%
    String command = request.getParameter("command");
    if(command == null) {
        command = "start";
    }
    if("start".equals(command)) {
    %>
    <form method="post">
        <input type="hidden" name="command" value="carreerReport">
        <input type="submit" value="carreerReport">
    </form>    
    <%
    } else if("carreerReport".equals(command)) {
        
    String query = "select e, ephi, p, s, d, o, sp from Employee as e ";
    query += "inner join e.employeePositionHistoryItems as ephi ";
    query += "inner join ephi.position as p ";
    query += "inner join p.subdepartment as s ";
    query += "inner join s.department as d ";
    query += "inner join d.office as o ";
    query += "inner join p.standardPosition as sp ";
    query += "order by e.lastName ASC, ephi.start ";
    org.hibernate.Query hq = hs.createQuery(query);
    List<Object[]> selection = hq.list();
    SimpleDateFormat dateFormatterShort = new SimpleDateFormat("yyyy-MM-dd");
    %><table border="1">
        <tr>
        <td>ID</td>
        <td>First name</td>
        <td>Last name</td>
        <td>Active</td>
        <td>Start</td>
        <td>End</td>
        <td>Contract type</td>
        <td>Standard Position</td>
        <td>Position</td>
        <td>Office</td>
        <td>Department</td>
        <td>Subdepartment</td>
        </tr><%
    for(Object[] tuple : selection) {
        Employee employee = (Employee)tuple[0];
        EmployeePositionHistoryItem employeePositionHistoryItem = (EmployeePositionHistoryItem)tuple[1];
        Position position = (Position)tuple[2];
        Subdepartment subdepartment = (Subdepartment)tuple[3];
        Department department = (Department)tuple[4];
        Office office = (Office)tuple[5];
        StandardPosition standardPosition = (StandardPosition)tuple[6];
        %>
    <tr>
        <td><%=employee.getId() %></td>
        <td><%=employee.getFirstName() %></td>
        <td><%=employee.getLastName() %></td>
        <td><%=employee.getIsActive() %></td>
        <td><%=employeePositionHistoryItem.getStart() != null ? dateFormatterShort.format(employeePositionHistoryItem.getStart().getTime()) : "" %></td>
        <td><%=employeePositionHistoryItem.getEnd() != null ? dateFormatterShort.format(employeePositionHistoryItem.getEnd().getTime()) : "" %></td>
        <td><%=employeePositionHistoryItem.getContractType() != null ? employeePositionHistoryItem.getContractType() : "" %><%=EmployeePositionHistoryItem.ContractType.PART_TIME.equals(employeePositionHistoryItem.getContractType()) ? "/" + employeePositionHistoryItem.getPartTimePercentage() : "" %></td>
        <td><%=standardPosition.getName() %></td>
        <td><%=position.getName() %></td>
        <td><%=office.getName() %></td>
        <td><%=department.getName() %></td>
        <td><%=subdepartment.getName() %></td>
        </tr>
        <%
    }
    %></table><%
    }
    
    
    hs.getTransaction().commit();
} catch (Exception ex) {
    hs.getTransaction().rollback();
    %>
    {
        "status": "FAIL",
        "comment": <% ex.printStackTrace(new PrintWriter(out)); %>
    }
    <%
}
%>