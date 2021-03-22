<%--
    Document   : subdepartments
    Created on : 31.03.2011, 13:08:03
    Author     : glazov
--%>
<%@page import="com.mazars.management.web.content.ContentManager"%>
<%@page import="java.util.Locale"%>
<%@page import="java.util.LinkedList"%>
<%@page import="java.util.Collections"%>
<%@page import="java.util.List"%>
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
    import="com.mazars.management.db.domain.*"
    import="com.mazars.management.db.vo.*"
    import="com.mazars.management.web.forms.*"
    import="com.mazars.management.db.util.HibernateUtil"
    import="org.hibernate.Session"
    import="com.google.gson.Gson"
    import="com.mazars.management.web.security.AccessChecker"
    import="com.mazars.management.db.comparators.*"
%><%
Employee currentUser = (Employee)session.getAttribute("currentUser");
Locale locale = new Locale("en");
Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
try {
    hs.beginTransaction();
    
%>
<%-- start of access.jsp --%>
<%
AccessChecker.Status status = null;

Module module = Module.getByName("CRM");
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
    
    List<Employee> employees = Employee.getAll();
    Collections.sort(employees, new EmployeeComparator(EmployeeComparator.Mode.FIRSTNAME_LASTNAME));
    SimpleDateFormat dateFormatterLong = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    %><table border="1"><tr>
        <td>Full name</td>
        <td>Username</td>
        <td>Total leaves</td>
        <td>Problematic leaves</td>
        </tr><%
    for(Employee employee : employees) {
        List<LeavesItem> leavesItems = new LinkedList<LeavesItem>(employee.getLeavesItems());
        List<YearMonthDateRange> problematicLeaves = new LinkedList<YearMonthDateRange>();
        List<LeavesItem> leavesItems2 = new LinkedList<LeavesItem>();
        for(LeavesItem leavesItem : leavesItems) {
            leavesItems2.add(leavesItem);
        }
        for(LeavesItem leavesItem1 : leavesItems) {
            for(LeavesItem leavesItem2 : leavesItems2) {
                if(leavesItem1.getId().equals(leavesItem2.getId())) {
                    continue;
                }
                YearMonthDateRange range1 = new YearMonthDateRange(leavesItem1.getStart(), leavesItem1.getEnd());
                YearMonthDateRange range2 = new YearMonthDateRange(leavesItem2.getStart(), leavesItem2.getEnd());
                if(range1.isIntersected(range2)) {
                    problematicLeaves.add(range1);
                }
            }
        }
        %><tr>
        <td><%=employee.getFullName() %></td>
        <td><%=employee.getUserName() %></td>
        <td><%=leavesItems.size() %></td>
        <td><%
        for(YearMonthDateRange range : problematicLeaves) {
            %><%=range %><br /><%
        }
        %></td>
        </tr><%
    }
    %></table><%
    
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