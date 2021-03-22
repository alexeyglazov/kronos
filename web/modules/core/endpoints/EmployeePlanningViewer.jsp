<%-- 
    Document   : subdepartments
    Created on : 31.03.2011, 13:08:03
    Author     : glazov
--%><%@page import="java.io.PrintStream"%>
<%@page import="java.io.PrintWriter"%>
<%@page import="java.util.HashSet"%>
<%@page import="java.util.Set"%>
<%@page import="java.util.Collections"%>
<%@page import="java.util.LinkedList"%>
<%@page import="java.util.List"%>
<%@page import="java.util.Calendar"%>
<%@page import="java.util.Date"%>
<%@page import="java.util.Map"%>
<%@page import="java.util.HashMap"%>
<%@page import="com.mazars.management.web.vo.PlanningToolInfo"%>
<%@page import="com.mazars.management.service.PlanningLockSubdepartmentManager"%>
<%@page import="com.mazars.management.web.vo.ShortEmployee"%>
<%@page import="com.mazars.management.web.vo.OfficeDepartmentSubdepartment"%>
<%@page import="com.mazars.management.db.util.PlanningItemUtil"%>
<%@page import="com.mazars.management.web.vo.DescribedCarreersInfo"%>
<%@page import="com.mazars.management.db.util.EmployeePositionHistoryItemUtils"%>
<%@page import="java.io.OutputStream"%><%@page contentType="text/html" pageEncoding="UTF-8"
    import="com.mazars.management.db.domain.*"
    import="com.mazars.management.db.vo.*"
    import="com.mazars.management.web.forms.*"
    import="com.mazars.management.db.util.HibernateUtil"
    import="org.hibernate.Session"
    import="com.google.gson.Gson"
    import="com.mazars.management.web.security.AccessChecker"
    
%><%

request.setCharacterEncoding("UTF-8");
Employee currentUser = (Employee)session.getAttribute("currentUser");
String command = request.getParameter("command");
Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
Gson gson = new Gson();
try {
hs.beginTransaction();
Module module = Module.getByName("Planning Read");

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
if("getEmployeeInfo".equals(command)) {
    Employee employee = (Employee)hs.get(Employee.class, new Long(request.getParameter("employeeId")));
    EmployeeWithoutPasswordVO employeeVO = new EmployeeWithoutPasswordVO(employee);
    %>
    {
    "status": "OK",
    "employee": <% gson.toJson(employeeVO, out); %>
    }
    <%    
} else if("getPlanningInfo".equals(command)) {
    EmployeePlanningViewerForm employeePlanningViewerForm = EmployeePlanningViewerForm.getFromJson(request.getParameter("employeePlanningViewerForm"));
    Country country = currentUser.getCountry(); 
    Calendar start = employeePlanningViewerForm.getStartDate().getCalendar();
    Calendar end = employeePlanningViewerForm.getEndDate().getCalendar();
    Employee employee = (Employee)hs.get(Employee.class, employeePlanningViewerForm.getEmployeeId());
    List<Long> employeeIds = new LinkedList<Long>();
    employeeIds.add(employee.getId());
    
    List<PlanningItemUtil.DescribedPlanningItem> describedPlanningItems = PlanningItemUtil.getDescribedPlanningItems(employee, start, end);   
    List<EmployeePositionHistoryItemUtils.DescribedCarreerItem> describedCarreerItems = EmployeePositionHistoryItemUtils.getDescribedCarreerItemsWithCarreer(employeeIds, start, end);
    PlanningToolInfo planningToolInfo = new PlanningToolInfo(describedCarreerItems, describedPlanningItems, start, end);
    
    List<YearMonthDate> freedays = new LinkedList<YearMonthDate>();
    for(Freeday freeday : Freeday.getAllByCountryAndRange(country, start, end)) {
        freedays.add(new YearMonthDate(freeday.getDate()));
    }    
%>
    {
    "status": "OK",
    "planningToolInfo": <% gson.toJson(planningToolInfo, out); %>,
    "freedays": <% gson.toJson(freedays, out); %>
    }
    <%
} else if("getPlanningGroupInfo".equals(command)) {
    PlanningGroup planningGroup = (PlanningGroup)hs.get(PlanningGroup.class, new Long(request.getParameter("planningGroupId")));
    List<PlanningItemUtil.DescribedPlanningItem> describedPlanningItems = PlanningItemUtil.getDescribedPlanningItemsByPlanningGroup(planningGroup);   
    PlanningToolInfo planningToolInfo = new PlanningToolInfo();
    planningToolInfo.addDescribedPlanningItems(describedPlanningItems);
%>
    {
    "status": "OK",
    "planningToolInfo": <% gson.toJson(planningToolInfo, out); %>
    }
<%     
}
hs.getTransaction().commit();

} catch (Exception ex) {
    hs.getTransaction().rollback();
    %>
    { <% ex.printStackTrace(new PrintWriter(out)); %>
        "status": "FAIL",
        "comment": <% gson.toJson(ex.toString(), out); %>
    }
<%
}
%>