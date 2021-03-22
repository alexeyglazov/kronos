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
        <input type="hidden" name="command" value="positionReport">
        <input type="submit" value="positionReport">
    </form>  
    <form method="post">
        <input type="hidden" name="command" value="employeeReport">
        <input type="submit" value="employeeReport">
    </form>  
    <%
    } else if("positionReport".equals(command)) {
        
    List<Employee> employees = Employee.getAll();
    Collections.sort(employees, new EmployeeComparator(EmployeeComparator.Mode.FIRSTNAME_LASTNAME));
    SimpleDateFormat dateFormatterLong = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    SimpleDateFormat dateFormatter = new SimpleDateFormat("yyyy-MM-dd");
    Country country = currentUser.getCountry();
    List<OfficeDepartmentSubdepartment> describedSubdepartments = new LinkedList<OfficeDepartmentSubdepartment>();
    for(Subdepartment subdepartment : country.getSubdepartments()) {
        describedSubdepartments.add(new OfficeDepartmentSubdepartment(subdepartment));
    }
    Collections.sort(describedSubdepartments, new OfficeDepartmentSubdepartment.OfficeDepartmentSubdepartmentComparator());
    %><table border="1"><tr>
        <td>Office</td>
        <td>Department</td>
        <td>Subdepartment</td>
        <td>Position</td>
        <td>Contract type</td>
        <td>Start</td>
        <td>End</td>
        <td>Duration</td>
        </tr><%
    for(OfficeDepartmentSubdepartment describedSubdepartment : describedSubdepartments) {
        Subdepartment subdepartment = (Subdepartment)hs.get(Subdepartment.class, describedSubdepartment.getSubdepartmentId());
        List<Position> positions = new LinkedList<Position>(subdepartment.getPositions());
        for(Position position : positions) {
            List<AnnualPaidLeave> annualPaidLeaves = new LinkedList<AnnualPaidLeave>(position.getAnnualPaidLeaves());
            if(annualPaidLeaves.isEmpty()) {
            %><tr>
            <td><%=describedSubdepartment.getOfficeName() %></td>
            <td><%=describedSubdepartment.getDepartmentName() %></td>
            <td><%=describedSubdepartment.getSubdepartmentName() %></td>
            <td><%=position.getName() %></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            </tr><%
            } else {
                for(AnnualPaidLeave annualPaidLeave : annualPaidLeaves) {
                    %><tr>
                    <td><%=describedSubdepartment.getOfficeName() %></td>
                    <td><%=describedSubdepartment.getDepartmentName() %></td>
                    <td><%=describedSubdepartment.getSubdepartmentName() %></td>
                    <td><%=position.getName() %></td>
                    <td><%=annualPaidLeave.getContractType() %></td>
                    <td><%=annualPaidLeave.getStart() != null ? dateFormatter.format(annualPaidLeave.getStart().getTime() ) : "" %></td>
                    <td><%=annualPaidLeave.getEnd() != null ? dateFormatter.format(annualPaidLeave.getEnd().getTime()) : "" %></td>
                    <td><%=annualPaidLeave.getDuration() %></td>
                    </tr><%                    
                }
            }
        }
    }
    %></table><%
    } else if("employeeReport".equals(command)) {
        List<Employee> employees = Employee.getAll();
        Collections.sort(employees, new EmployeeComparator(EmployeeComparator.Mode.FIRSTNAME_LASTNAME));
        SimpleDateFormat dateFormatterLong = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        SimpleDateFormat dateFormatter = new SimpleDateFormat("yyyy-MM-dd");
        %><table border="1"><tr>
        <td>Office</td>
        <td>Department</td>
        <td>Subdepartment</td>
        <td>Position</td>
        <td>Employee</td>
        <td>Active</td>
        <td>Contract type</td>
        <td>Emp. pos. start</td>
        <td>Emp. pos. end</td>
        <td>Leave (for this position now)</td>
        <td>Leave. start</td>
        <td>Leave. end</td>
        </tr><%
        Calendar now = new GregorianCalendar();
        for(Employee employee : employees) {
            List<EmployeePositionHistoryItem> employeePositionHistoryItems = new LinkedList<EmployeePositionHistoryItem>(employee.getEmployeePositionHistoryItems());
            Collections.sort(employeePositionHistoryItems, new EmployeePositionHistoryItemComparator());
            EmployeePositionHistoryItem employeePositionHistoryItem = employeePositionHistoryItems.get(employeePositionHistoryItems.size() - 1);
            Position position = employeePositionHistoryItem.getPosition();
            Subdepartment subdepartment = position.getSubdepartment();
            Department department = subdepartment.getDepartment();
            Office office = department.getOffice();
            
            List<AnnualPaidLeave> annualPaidLeaves = new LinkedList<AnnualPaidLeave>(position.getAnnualPaidLeaves());
            AnnualPaidLeave annualPaidLeave = null;
            for(AnnualPaidLeave annualPaidLeaveTmp : annualPaidLeaves) {
                if(annualPaidLeaveTmp.getContractType().equals(employeePositionHistoryItem.getContractType()) ) {
                    if(annualPaidLeaveTmp.getStart().after(now) || (annualPaidLeaveTmp.getEnd() != null && annualPaidLeaveTmp.getEnd().before(now))) {
                        continue;
                    }
                    annualPaidLeave = annualPaidLeaveTmp;
                    break;
                }
            }
            %>
            <tr>
            <td><%=office.getName() %></td>
            <td><%=department.getName() %></td>
            <td><%=subdepartment.getName() %></td>
            <td><%=position.getName() %></td>
            <td><%=employee.getFullName() %></td>
            <td><%=employee.getIsActive() %></td>
            <td><%=employeePositionHistoryItem.getContractType() %></td>
            <td><%=employeePositionHistoryItem.getStart() != null ? dateFormatter.format(employeePositionHistoryItem.getStart().getTime()) : "" %></td>
            <td><%=employeePositionHistoryItem.getEnd() != null ? dateFormatter.format(employeePositionHistoryItem.getEnd().getTime()) : "" %></td>
            <td><%=annualPaidLeave != null ? annualPaidLeave.getDuration() : "" %></td>
            <td><%=(annualPaidLeave != null && annualPaidLeave.getStart() != null) ? dateFormatter.format(annualPaidLeave.getStart().getTime()) : "" %></td>
            <td><%=(annualPaidLeave != null && annualPaidLeave.getEnd() != null) ? dateFormatter.format(annualPaidLeave.getEnd().getTime()) : "" %></td>
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