<%-- 
    Document   : subdepartments
    Created on : 31.03.2011, 13:08:03
    Author     : glazov
--%><%@page contentType="text/html" pageEncoding="UTF-8"
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
Employee currentUser = (Employee)session.getAttribute("currentUser");
String command = request.getParameter("command");
Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
Gson gson = new Gson();
try {
hs.beginTransaction();
Module module = Module.getByName(request.getParameter("moduleName"));

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
       OfficeVO officeVO = null;
       DepartmentVO departmentVO = null;
       SubdepartmentVO subdepartmentVO = null;
       List<PositionVO> positionVOs = new LinkedList<PositionVO>();
       List<EmployeeWithoutPasswordVO> employeeVOs = new LinkedList<EmployeeWithoutPasswordVO>();
       Calendar startDate = null;
       Calendar endDate = null;
       if(request.getParameter("startDate") != null) {
            startDate = YearMonthDateForm.getFromJson(request.getParameter("startDate")).getYearMonthDate().getCalendar();
       }
       if(request.getParameter("endDate") != null) {
            endDate = YearMonthDateForm.getFromJson(request.getParameter("endDate")).getYearMonthDate().getCalendar();
       }       
       Subdepartment subdepartment = (Subdepartment)hs.get(Subdepartment.class, new Long(request.getParameter("subdepartmentId")));
       Department department = subdepartment.getDepartment();
       Office office = department.getOffice();
       List<Employee> employees = new LinkedList<Employee>();
       
        List<Position> positions = new LinkedList<Position>(subdepartment.getPositions());
        Collections.sort(positions, new PositionComparator());
        for(Position position : positions) {
           positionVOs.add(new PositionVO(position));
        }
        if(Employee.Profile.COUNTRY_ADMINISTRATOR.equals(currentUser.getProfile())) {
           employees = new LinkedList<Employee>(subdepartment.getEmployeesWithCarreers(startDate, endDate));
        } else if(Employee.Profile.SUPER_USER.equals(currentUser.getProfile())) {
           employees = new LinkedList<Employee>(RightsItem.getEmployees(currentUser, module, subdepartment));
        }

        Collections.sort(employees, new EmployeeComparator(EmployeeComparator.Mode.FIRSTNAME_LASTNAME));
        employeeVOs = EmployeeWithoutPasswordVO.getList(employees);
%>
{
"status": "OK",
"office": <% gson.toJson(new OfficeVO(office), out); %>,
"department": <% gson.toJson(new DepartmentVO(department), out); %>,
"subdepartment": <% gson.toJson(new SubdepartmentVO(subdepartment), out); %>,
"positions": <% gson.toJson(positionVOs, out); %>,
"employees": <% gson.toJson(employeeVOs, out); %>
}
<%
} else if("getPositionContent".equals(command)) {
       List<EmployeeWithoutPasswordVO> employeeVOs = new LinkedList<EmployeeWithoutPasswordVO>();
       Calendar startDate = null;
       Calendar endDate = null;
       if(request.getParameter("startDate") != null) {
            startDate = YearMonthDateForm.getFromJson(request.getParameter("startDate")).getYearMonthDate().getCalendar();
       }
       if(request.getParameter("endDate") != null) {
            endDate = YearMonthDateForm.getFromJson(request.getParameter("endDate")).getYearMonthDate().getCalendar();
       }       
       Position position = (Position)hs.get(Position.class, new Long(request.getParameter("positionId")));
       List<Employee> employees = new LinkedList<Employee>(position.getEmployeesWithCarreers(startDate, endDate));
       Collections.sort(employees, new EmployeeComparator(EmployeeComparator.Mode.FIRSTNAME_LASTNAME));
        employeeVOs = EmployeeWithoutPasswordVO.getList(employees);
%>
{
"status": "OK",
"employees": <% gson.toJson(employeeVOs, out); %>
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