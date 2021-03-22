<%-- 
    Document   : subdepartments
    Created on : 31.03.2011, 13:08:03
    Author     : glazov
--%><%@page contentType="text/html" pageEncoding="UTF-8"
    import="com.mazars.management.service.ConfigUtils"
    import="com.mazars.management.security.SecurityUtils"
    import="com.mazars.management.db.comparators.LeavesItemComparator"
    import="com.mazars.management.db.comparators.PositionComparator"
    import="com.mazars.management.db.comparators.SubdepartmentComparator"
    import="com.mazars.management.db.comparators.DepartmentComparator"
    import="com.mazars.management.db.comparators.EmployeeComparator"
    import="com.mazars.management.db.comparators.OfficeComparator"
    import="com.mazars.management.db.domain.*"
    import="com.mazars.management.db.vo.*"
    import="com.mazars.management.db.util.HibernateUtil"
    import="com.mazars.management.security.PasswordUtil"
    import="com.mazars.management.web.security.AccessChecker"
    import="com.mazars.management.web.vo.*"
    import="com.mazars.management.db.comparators.EmployeePositionHistoryItemComparator"
    import="com.mazars.management.charts.vo.*"
    import="com.mazars.management.charts.data.*"
    import="com.mazars.management.web.forms.ProjectAndInternalTimeSpentItemsForm"
    import="java.util.*"
    import="org.hibernate.Session"
    import="com.google.gson.Gson"
%><%
request.setCharacterEncoding("UTF-8");
Employee currentUser = (Employee)session.getAttribute("currentUser");
String command = request.getParameter("command");
Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
Gson gson = new Gson();
try {
hs.beginTransaction();
Module module = Module.getByName("Timesheets");

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

if("getContent".equals(command)) {
        ProjectAndInternalTimeSpentItemsForm projectAndInternalTimeSpentItemsForm = ProjectAndInternalTimeSpentItemsForm.getFromJson(request.getParameter("projectAndInternalTimeSpentItemsForm")); 
        ProjectAndInternalTimeSpentItems projectAndInternalTimeSpentItems = new ProjectAndInternalTimeSpentItems();
        projectAndInternalTimeSpentItems.setEmployee(currentUser);
        projectAndInternalTimeSpentItems.setStartDate(projectAndInternalTimeSpentItemsForm.getStartDate().getCalendar());
        projectAndInternalTimeSpentItems.setEndDate(projectAndInternalTimeSpentItemsForm.getEndDate().getCalendar());
        projectAndInternalTimeSpentItems.setView(projectAndInternalTimeSpentItemsForm.getView());
        projectAndInternalTimeSpentItems.build();
%>
{
"status": "OK",
"projectAndInternalTimeSpentItems": <% gson.toJson(new ProjectAndInternalTimeSpentItemsVO(projectAndInternalTimeSpentItems), out); %>
}
<%
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