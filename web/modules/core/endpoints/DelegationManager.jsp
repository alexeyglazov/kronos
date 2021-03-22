<%-- 
    Document   : subdepartments
    Created on : 31.03.2011, 13:08:03
    Author     : glazov
--%><%@page import="com.mazars.management.db.complex.EmployeeSubdepartmentHistoryItemWithEmployeeAndSubdepartment"%>
<%@page import="com.mazars.management.db.comparators.EmployeeComparator"%>
<%@page import="com.mazars.management.db.comparators.SubdepartmentComparator"%>
<%@page import="com.mazars.management.db.comparators.DepartmentComparator"%>
<%@page import="com.mazars.management.db.comparators.OfficeComparator"%>
<%@page import="com.mazars.management.db.comparators.CountryComparator"%>
<%@page contentType="text/html" pageEncoding="UTF-8"
    import="java.util.*"
    import="com.mazars.management.db.domain.*"
    import="com.mazars.management.db.vo.*"
    import="com.mazars.management.web.forms.*"
    import="com.mazars.management.db.util.HibernateUtil"
    import="org.hibernate.Session"
    import="com.google.gson.Gson"
    import="com.mazars.management.web.vo.*"
    import="com.mazars.management.web.comparators.*"
    import="com.mazars.management.web.security.AccessChecker"
    
%><%
request.setCharacterEncoding("UTF-8");
Employee currentUser = (Employee)session.getAttribute("currentUser");
String command = request.getParameter("command");
Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
Gson gson = new Gson();
try {
hs.beginTransaction();
Module module = Module.getByName("HR");

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
   List<Office> offices = new LinkedList<Office>();
   Country country = currentUser.getCountry();
   if(Employee.Profile.COUNTRY_ADMINISTRATOR.equals(currentUser.getProfile())) {
       offices.addAll(country.getOffices());
   } else if(Employee.Profile.SUPER_USER.equals(currentUser.getProfile())) {
       offices = RightsItem.getOffices(currentUser, module);
   }
   Collections.sort(offices, new OfficeComparator());
   for(Office office : offices) {
       officeVOs.add(new OfficeVO(office));
   }
   %>
   {
    "status": "OK",
    "subdepartmentOffices": <% gson.toJson(officeVOs, out); %>,
    "employeeOffices": <% gson.toJson(officeVOs, out); %>
   }
   <%
} else if("getSubdepartmentOfficeContent".equals(command)) {
    Office office = (Office)hs.get(Office.class, new Long(request.getParameter("subdepartmentOfficeId")));
    List<Department> departments = new LinkedList<Department>();
    if(Employee.Profile.COUNTRY_ADMINISTRATOR.equals(currentUser.getProfile())) {
        departments.addAll(office.getDepartments());
    } else if(Employee.Profile.SUPER_USER.equals(currentUser.getProfile())) {
        departments = RightsItem.getDepartments(currentUser, module, office);
    }    
    Collections.sort(departments, new DepartmentComparator());
    List<DepartmentVO> subdepartmentDepartmentVOs = new LinkedList<DepartmentVO>();
    for(Department department : departments) {
        subdepartmentDepartmentVOs.add(new DepartmentVO(department));
    }
    %>
    {
        "status": "OK",
        "subdepartmentDepartments": <% gson.toJson(subdepartmentDepartmentVOs, out); %>
    }<%   
} else if("getSubdepartmentDepartmentContent".equals(command)) {
    Department department = (Department)hs.get(Department.class, new Long(request.getParameter("subdepartmentDepartmentId")));
    List<Subdepartment> subdepartments = new LinkedList<Subdepartment>();
    if(Employee.Profile.COUNTRY_ADMINISTRATOR.equals(currentUser.getProfile())) {
        subdepartments.addAll(department.getSubdepartments());
    } else if(Employee.Profile.SUPER_USER.equals(currentUser.getProfile())) {
        subdepartments = RightsItem.getSubdepartments(currentUser, module, department);
    }    
    Collections.sort(subdepartments, new SubdepartmentComparator());
    List<SubdepartmentVO> subdepartmentVOs = new LinkedList<SubdepartmentVO>();
    for(Subdepartment subdepartment : subdepartments) {
        subdepartmentVOs.add(new SubdepartmentVO(subdepartment));
    }
    %>
    {
        "status": "OK",
        "subdepartments": <% gson.toJson(subdepartmentVOs, out); %>
    }<%   
} else if("getEmployeeOfficeContent".equals(command)) {
    Office office = (Office)hs.get(Office.class, new Long(request.getParameter("employeeOfficeId")));
    List<Department> departments = new LinkedList<Department>();
    if(Employee.Profile.COUNTRY_ADMINISTRATOR.equals(currentUser.getProfile())) {
        departments.addAll(office.getDepartments());
    } else if(Employee.Profile.SUPER_USER.equals(currentUser.getProfile())) {
        departments = RightsItem.getDepartments(currentUser, module, office);
    }    
    Collections.sort(departments, new DepartmentComparator());
    List<DepartmentVO> employeeDepartmentVOs = new LinkedList<DepartmentVO>();
    for(Department department : departments) {
        employeeDepartmentVOs.add(new DepartmentVO(department));
    }
    %>
    {
        "status": "OK",
        "employeeDepartments": <% gson.toJson(employeeDepartmentVOs, out); %>
    }<%   
} else if("getEmployeeDepartmentContent".equals(command)) {
    Department department = (Department)hs.get(Department.class, new Long(request.getParameter("employeeDepartmentId")));
    List<Subdepartment> subdepartments = new LinkedList<Subdepartment>();
    if(Employee.Profile.COUNTRY_ADMINISTRATOR.equals(currentUser.getProfile())) {
        subdepartments.addAll(department.getSubdepartments());
    } else if(Employee.Profile.SUPER_USER.equals(currentUser.getProfile())) {
        subdepartments = RightsItem.getSubdepartments(currentUser, module, department);
    }    
    Collections.sort(subdepartments, new SubdepartmentComparator());
    List<SubdepartmentVO> employeeSubdepartmentVOs = new LinkedList<SubdepartmentVO>();
    for(Subdepartment subdepartment : subdepartments) {
        employeeSubdepartmentVOs.add(new SubdepartmentVO(subdepartment));
    }
    %>
    {
        "status": "OK",
        "employeeSubdepartments": <% gson.toJson(employeeSubdepartmentVOs, out); %>
    }<%   
} else if("getEmployeeSubdepartmentContent".equals(command)) {
    Subdepartment subdepartment = (Subdepartment)hs.get(Subdepartment.class, new Long(request.getParameter("employeeSubdepartmentId")));
    List<Employee> employees = new LinkedList<Employee>();
    if(Employee.Profile.COUNTRY_ADMINISTRATOR.equals(currentUser.getProfile())) {
        employees.addAll(subdepartment.getEmployees());
    } else if(Employee.Profile.SUPER_USER.equals(currentUser.getProfile())) {
        if(RightsItem.isAvailable(subdepartment, currentUser, module)) {
            employees.addAll(subdepartment.getEmployees());
        }
    }    
    Collections.sort(employees, new EmployeeComparator());
    List<EmployeeWithoutPasswordVO> employeeVOs = new LinkedList<EmployeeWithoutPasswordVO>();
    for(Employee employee : employees) {
        employeeVOs.add(new EmployeeWithoutPasswordVO(employee));
    }
    %>
    {
        "status": "OK",
        "employees": <% gson.toJson(employeeVOs, out); %>
    }<%   
} else if("getEmployeeSubdepartmentHistoryItemWithEmployeeAndSubdepartmentInfo".equals(command)) {
    DelegationManagerFilterForm delegationManagerFilterForm = DelegationManagerFilterForm.getFromJson(request.getParameter("delegationManagerFilterForm"));
    Office subdepartmentOffice = null;
    Department subdepartmentDepartment = null;
    Subdepartment subdepartment = null;
    Office employeeOffice = null;
    Department employeeDepartment = null;
    Subdepartment employeeSubdepartment = null;
    Employee employee = null;
    Calendar startDate = null;
    Calendar endDate = null;
    if(delegationManagerFilterForm.getSubdepartmentOfficeId() != null) {
        subdepartmentOffice = (Office)hs.get(Office.class, new Long(delegationManagerFilterForm.getSubdepartmentOfficeId()));
    }
    if(delegationManagerFilterForm.getSubdepartmentDepartmentId() != null) {
        subdepartmentDepartment = (Department)hs.get(Department.class, new Long(delegationManagerFilterForm.getSubdepartmentDepartmentId()));
    }
    if(delegationManagerFilterForm.getSubdepartmentId() != null) {
        subdepartment = (Subdepartment)hs.get(Subdepartment.class, new Long(delegationManagerFilterForm.getSubdepartmentId()));
    }
    if(delegationManagerFilterForm.getEmployeeOfficeId() != null) {
        employeeOffice = (Office)hs.get(Office.class, new Long(delegationManagerFilterForm.getEmployeeOfficeId()));
    }
    if(delegationManagerFilterForm.getEmployeeDepartmentId() != null) {
        employeeDepartment = (Department)hs.get(Department.class, new Long(delegationManagerFilterForm.getEmployeeDepartmentId()));
    }
    if(delegationManagerFilterForm.getEmployeeSubdepartmentId() != null) {
        employeeSubdepartment = (Subdepartment)hs.get(Subdepartment.class, new Long(delegationManagerFilterForm.getEmployeeSubdepartmentId()));
    }
    if(delegationManagerFilterForm.getEmployeeId() != null) {
        employee = (Employee)hs.get(Employee.class, new Long(delegationManagerFilterForm.getEmployeeId()));
    }
    if(delegationManagerFilterForm.getStartDate() != null) {
        startDate = delegationManagerFilterForm.getStartDate().getCalendar();
    }
    if(delegationManagerFilterForm.getEndDate() != null) {
        endDate = delegationManagerFilterForm.getEndDate().getCalendar();
    }
    List<EmployeeSubdepartmentHistoryItemWithEmployeeAndSubdepartment> employeeSubdepartmentHistoryItemWithEmployeeAndSubdepartmentInfo = EmployeeSubdepartmentHistoryItem.getEmployeeSubdepartmentHistoryItemWithEmployeeAndSubdepartmentInfo(
            subdepartmentOffice,
            subdepartmentDepartment,
            subdepartment,
            employeeOffice,
            employeeDepartment,
            employeeSubdepartment,
            employee,
            startDate,
            endDate
            );
    List<EmployeeSubdepartmentHistoryItemWithEmployeeAndSubdepartmentVO> employeeSubdepartmentHistoryItemWithEmployeeAndSubdepartmentVOs = new LinkedList<EmployeeSubdepartmentHistoryItemWithEmployeeAndSubdepartmentVO>();
    for(EmployeeSubdepartmentHistoryItemWithEmployeeAndSubdepartment employeeSubdepartmentHistoryItemWithEmployeeAndSubdepartment : employeeSubdepartmentHistoryItemWithEmployeeAndSubdepartmentInfo) {
        employeeSubdepartmentHistoryItemWithEmployeeAndSubdepartmentVOs.add(new EmployeeSubdepartmentHistoryItemWithEmployeeAndSubdepartmentVO(employeeSubdepartmentHistoryItemWithEmployeeAndSubdepartment));
    }
    %>
    {
        "status": "OK",
        "employeeSubdepartmentHistoryItemWithEmployeeAndSubdepartmentInfo": <% gson.toJson(employeeSubdepartmentHistoryItemWithEmployeeAndSubdepartmentVOs, out); %>
    }<%     
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