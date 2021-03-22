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
        List<OfficeVO> officeVOs = new LinkedList<OfficeVO>();
        List<EmployeeWithoutPasswordVO> employeeVOs = new LinkedList<EmployeeWithoutPasswordVO>();
        Boolean active = Boolean.parseBoolean(request.getParameter("active"));
        List<Long> standardPositionIds = ListOfLong.getFromJson(request.getParameter("standardPositionIds")).getList();
        List<StandardPosition> standardPositions = new LinkedList<StandardPosition>();
        if(standardPositionIds == null) {
            standardPositions = StandardPosition.getAll();
        } else {
            standardPositions = StandardPosition.getByIds(standardPositionIds);
        }
        List<Subdepartment> subdepartments = Subdepartment.getAllowedSubdepartments(null, null, null, currentUser, module);
        List<Employee> employees = Employee.getEmployees(subdepartments, standardPositions);
        Country country = currentUser.getCountry();
        if(Employee.Profile.COUNTRY_ADMINISTRATOR.equals(currentUser.getProfile())) {
           List<Office> offices = new LinkedList<Office>(country.getOffices());
           Collections.sort(offices, new OfficeComparator());
           officeVOs = OfficeVO.getList(offices);
        } else if(Employee.Profile.SUPER_USER.equals(currentUser.getProfile())) {
           List<Office> offices = new LinkedList<Office>(RightsItem.getOffices(currentUser, module, country));
           Collections.sort(offices, new OfficeComparator());
           officeVOs = OfficeVO.getList(offices);
        }

        Collections.sort(employees, new EmployeeComparator(EmployeeComparator.Mode.FIRSTNAME_LASTNAME));
        if(active) {
            List<Employee> filteredEmployees = new LinkedList<Employee>();
            for(Employee employee : employees) {
                if(Boolean.TRUE.equals(employee.getIsActive())) {
                    filteredEmployees.add(employee);
                }
            }
            employeeVOs = EmployeeWithoutPasswordVO.getList(filteredEmployees);
        } else {
            employeeVOs = EmployeeWithoutPasswordVO.getList(employees);
        }
        List<StandardPosition> allStandardPositions = StandardPosition.getAll();
        Collections.sort(allStandardPositions, new StandardPositionComparator());
        List<StandardPositionVO> standardPositionVOs = StandardPositionVO.getList(allStandardPositions);
%>
{
"status": "OK",
"offices": <% gson.toJson(officeVOs, out); %>,
"employees": <% gson.toJson(employeeVOs, out); %>,
"standardPositions": <% gson.toJson(standardPositionVOs, out); %>
}
<%
} else if("getNullOfficeContent".equals(command)) {
        List<EmployeeWithoutPasswordVO> employeeVOs = new LinkedList<EmployeeWithoutPasswordVO>();
        Boolean active = Boolean.parseBoolean(request.getParameter("active"));
        List<Long> standardPositionIds = ListOfLong.getFromJson(request.getParameter("standardPositionIds")).getList();
        List<StandardPosition> standardPositions = StandardPosition.getByIds(standardPositionIds);
        List<Subdepartment> subdepartments = Subdepartment.getAllowedSubdepartments(null, null, null, currentUser, module);
        List<Employee> employees = Employee.getEmployees(subdepartments, standardPositions);
        Collections.sort(employees, new EmployeeComparator(EmployeeComparator.Mode.FIRSTNAME_LASTNAME));
        if(active) {
            List<Employee> filteredEmployees = new LinkedList<Employee>();
            for(Employee employee : employees) {
                if(Boolean.TRUE.equals(employee.getIsActive())) {
                    filteredEmployees.add(employee);
                }
            }
            employeeVOs = EmployeeWithoutPasswordVO.getList(filteredEmployees);
        } else {
            employeeVOs = EmployeeWithoutPasswordVO.getList(employees);
        }
%>
{
"status": "OK",
"employees": <% gson.toJson(employeeVOs, out); %>
}
<%
} else if("getOfficeContent".equals(command)) {
        List<DepartmentVO> departmentVOs = new LinkedList<DepartmentVO>();
        List<EmployeeWithoutPasswordVO> employeeVOs = new LinkedList<EmployeeWithoutPasswordVO>();
        Boolean active = Boolean.parseBoolean(request.getParameter("active"));
        Office office = (Office)hs.get(Office.class, new Long(request.getParameter("officeId")));
        List<Long> standardPositionIds = ListOfLong.getFromJson(request.getParameter("standardPositionIds")).getList();
        List<StandardPosition> standardPositions = StandardPosition.getByIds(standardPositionIds);
        List<Subdepartment> subdepartments = Subdepartment.getAllowedSubdepartments(office, null, null, currentUser, module);
        List<Employee> employees = Employee.getEmployees(subdepartments, standardPositions);
        if(Employee.Profile.COUNTRY_ADMINISTRATOR.equals(currentUser.getProfile())) {
           List<Department> departments = new LinkedList<Department>(office.getDepartments());
           Collections.sort(departments, new DepartmentComparator());
           departmentVOs = DepartmentVO.getList(departments);
        } else if(Employee.Profile.SUPER_USER.equals(currentUser.getProfile())) {
            List<Department> departments = new LinkedList<Department>(RightsItem.getDepartments(currentUser, module, office));
            Collections.sort(departments, new DepartmentComparator());
            departmentVOs = DepartmentVO.getList(departments);
        }
        Collections.sort(employees, new EmployeeComparator(EmployeeComparator.Mode.FIRSTNAME_LASTNAME));
        if(active) {
            List<Employee> filteredEmployees = new LinkedList<Employee>();
            for(Employee employee : employees) {
                if(Boolean.TRUE.equals(employee.getIsActive())) {
                    filteredEmployees.add(employee);
                }
            }
            employeeVOs = EmployeeWithoutPasswordVO.getList(filteredEmployees);
        } else {
            employeeVOs = EmployeeWithoutPasswordVO.getList(employees);
        }
%>
{
"status": "OK",
"departments": <% gson.toJson(departmentVOs, out); %>,
"employees": <% gson.toJson(employeeVOs, out); %>
}
<%
} else if("getDepartmentContent".equals(command)) {
       List<SubdepartmentVO> subdepartmentVOs = new LinkedList<SubdepartmentVO>();
       List<EmployeeWithoutPasswordVO> employeeVOs = new LinkedList<EmployeeWithoutPasswordVO>();
       Boolean active = Boolean.parseBoolean(request.getParameter("active"));
       Department department = (Department)hs.get(Department.class, new Long(request.getParameter("departmentId")));
       List<Long> standardPositionIds = ListOfLong.getFromJson(request.getParameter("standardPositionIds")).getList();
        List<StandardPosition> standardPositions = StandardPosition.getByIds(standardPositionIds);
        List<Subdepartment> subdepartments = Subdepartment.getAllowedSubdepartments(department.getOffice(), department, null, currentUser, module);
        List<Employee> employees = Employee.getEmployees(subdepartments, standardPositions);
        Collections.sort(subdepartments, new SubdepartmentComparator());
        subdepartmentVOs = SubdepartmentVO.getList(subdepartments);
        Collections.sort(employees, new EmployeeComparator(EmployeeComparator.Mode.FIRSTNAME_LASTNAME));
        if(active) {
            List<Employee> filteredEmployees = new LinkedList<Employee>();
            for(Employee employee : employees) {
                if(Boolean.TRUE.equals(employee.getIsActive())) {
                    filteredEmployees.add(employee);
                }
            }
            employeeVOs = EmployeeWithoutPasswordVO.getList(filteredEmployees);
        } else {
            employeeVOs = EmployeeWithoutPasswordVO.getList(employees);
        }       
%>
{
"status": "OK",
"subdepartments": <% gson.toJson(subdepartmentVOs, out); %>,
"employees": <% gson.toJson(employeeVOs, out); %>
}
<%
} else if("getSubdepartmentContent".equals(command)) {
        List<PositionVO> positionVOs = new LinkedList<PositionVO>();
        List<EmployeeWithoutPasswordVO> employeeVOs = new LinkedList<EmployeeWithoutPasswordVO>();
        Boolean active = Boolean.parseBoolean(request.getParameter("active"));
        Subdepartment subdepartment = (Subdepartment)hs.get(Subdepartment.class, new Long(request.getParameter("subdepartmentId")));
        List<Long> standardPositionIds = ListOfLong.getFromJson(request.getParameter("standardPositionIds")).getList();
        List<StandardPosition> standardPositions = StandardPosition.getByIds(standardPositionIds);
        List<Subdepartment> subdepartments = new LinkedList<Subdepartment>();
        subdepartments.add(subdepartment);
        List<Employee> employees = Employee.getEmployees(subdepartments, standardPositions);
        Collections.sort(employees, new EmployeeComparator(EmployeeComparator.Mode.FIRSTNAME_LASTNAME));
        if(active) {
            List<Employee> filteredEmployees = new LinkedList<Employee>();
            for(Employee employee : employees) {
                if(Boolean.TRUE.equals(employee.getIsActive())) {
                    filteredEmployees.add(employee);
                }
            }
            employeeVOs = EmployeeWithoutPasswordVO.getList(filteredEmployees);
        } else {
            employeeVOs = EmployeeWithoutPasswordVO.getList(employees);
        }
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