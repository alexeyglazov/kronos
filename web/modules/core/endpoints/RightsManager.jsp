<%-- 
    Document   : subdepartments
    Created on : 31.03.2011, 13:08:03
    Author     : glazov
--%>
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
Employee currentUser = (Employee)session.getAttribute("currentUser");
String command = request.getParameter("command");
Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
Gson gson = new Gson();
try {
hs.beginTransaction();
Module module = Module.getByName("Rights");

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
    List<ModuleVO> moduleVOs = new LinkedList<ModuleVO>();
    List<CountryVO> countryVOs = new LinkedList<CountryVO>();
    List<OfficeVO> officeVOs = new LinkedList<OfficeVO>();
    List<EmployeeWithoutPasswordVO> employeeVOs = new LinkedList<EmployeeWithoutPasswordVO>();

    for(Module moduleTmp : Module.getAll()) {
        moduleVOs.add(new ModuleVO(moduleTmp));
    }
    Country firstCountry = null;
    List<Country> countries = new LinkedList<Country>();
    if(Employee.Profile.COUNTRY_ADMINISTRATOR.equals(currentUser.getProfile())) {
        countries.add(currentUser.getCountry());
    } else if(Employee.Profile.SUPER_USER.equals(currentUser.getProfile())) {
        countries = RightsItem.getCountries(currentUser, module);
    }
    Collections.sort(countries, new CountryComparator());
    for(Country country : countries) {
        if(firstCountry == null) {
            firstCountry = country;
        }
        countryVOs.add(new CountryVO(country));
    }
    if(firstCountry != null) {
        List<Office> offices = new LinkedList<Office>();
        List<Employee> employees = new LinkedList<Employee>();
        if(Employee.Profile.COUNTRY_ADMINISTRATOR.equals(currentUser.getProfile())) {
            offices.addAll(firstCountry.getOffices());
            employees = firstCountry.getEmployees();
        } else if(Employee.Profile.SUPER_USER.equals(currentUser.getProfile())) {
            offices = RightsItem.getOffices(currentUser, module, firstCountry);
            employees = RightsItem.getEmployees(currentUser, module, firstCountry);
        }
        Collections.sort(offices, new OfficeComparator());
        for(Office office : offices) {
            officeVOs.add(new OfficeVO(office));
        }
        Collections.sort(employees, new EmployeeComparator());
        for(Employee employee : employees) {
            employeeVOs.add(new EmployeeWithoutPasswordVO(employee));
        }
    }
    %>
    {
        "status": "OK",
        "modules": <% gson.toJson(moduleVOs, out); %>,
        "countries": <% gson.toJson(countryVOs, out); %>,
        "offices": <% gson.toJson(officeVOs, out); %>,
        "employees": <% gson.toJson(employeeVOs, out); %>
    }
    <%
} else if("getOfficesEmployees".equals(command)) {
    Country country = (Country)hs.get(Country.class, new Long(request.getParameter("countryId")));
    List<OfficeVO> officeVOs = new LinkedList<OfficeVO>();
    List<EmployeeWithoutPasswordVO> employeeVOs = new LinkedList<EmployeeWithoutPasswordVO>();

   if(country != null) {
        List<Office> offices = new LinkedList<Office>();
        List<Employee> employees = new LinkedList<Employee>();
        if(Employee.Profile.COUNTRY_ADMINISTRATOR.equals(currentUser.getProfile())) {
            offices.addAll(country.getOffices());
            employees = country.getEmployees();
        } else if(Employee.Profile.SUPER_USER.equals(currentUser.getProfile())) {
            offices = RightsItem.getOffices(currentUser, module, country);
            employees = RightsItem.getEmployees(currentUser, module, country);
        }
        Collections.sort(offices, new OfficeComparator());
        for(Office office : offices) {
            officeVOs.add(new OfficeVO(office));
        }
        Collections.sort(employees, new EmployeeComparator());
        for(Employee employee : employees) {
            employeeVOs.add(new EmployeeWithoutPasswordVO(employee));
        }
    }
    %>
    {
        "status": "OK",
        "offices": <% gson.toJson(officeVOs, out); %>,
        "employees": <% gson.toJson(employeeVOs, out); %>
    }
    <%
} else if("getDepartmentsEmployees".equals(command)) {
    Office office = (Office)hs.get(Office.class, new Long(request.getParameter("officeId")));
    List<DepartmentVO> departmentVOs = new LinkedList<DepartmentVO>();
    List<EmployeeWithoutPasswordVO> employeeVOs = new LinkedList<EmployeeWithoutPasswordVO>();

    if(office != null) {
        List<Department> departments = new LinkedList<Department>();
        List<Employee> employees = new LinkedList<Employee>();
        if(Employee.Profile.COUNTRY_ADMINISTRATOR.equals(currentUser.getProfile())) {
            departments.addAll(office.getDepartments());
            employees = office.getEmployees();
        } else if(Employee.Profile.SUPER_USER.equals(currentUser.getProfile())) {
            departments = RightsItem.getDepartments(currentUser, module, office);
            employees = RightsItem.getEmployees(currentUser, module, office);
        }
        Collections.sort(departments, new DepartmentComparator());
        for(Department department : departments) {
            departmentVOs.add(new DepartmentVO(department));
        }
        Collections.sort(employees, new EmployeeComparator());
        for(Employee employee : employees) {
            employeeVOs.add(new EmployeeWithoutPasswordVO(employee));
        }
    }
    %>
    {
        "status": "OK",
        "departments": <% gson.toJson(departmentVOs, out); %>,
        "employees": <% gson.toJson(employeeVOs, out); %>
    }
    <%
} else if("getSubdepartmentsEmployees".equals(command)) {
    Department department = (Department)hs.get(Department.class, new Long(request.getParameter("departmentId")));
    List<SubdepartmentVO> subdepartmentVOs = new LinkedList<SubdepartmentVO>();
    List<EmployeeWithoutPasswordVO> employeeVOs = new LinkedList<EmployeeWithoutPasswordVO>();

    if(department != null) {
        List<Subdepartment> subdepartments = new LinkedList<Subdepartment>();
        List<Employee> employees = new LinkedList<Employee>();
        if(Employee.Profile.COUNTRY_ADMINISTRATOR.equals(currentUser.getProfile())) {
            subdepartments.addAll(department.getSubdepartments());
            employees = department.getEmployees();
        } else if(Employee.Profile.SUPER_USER.equals(currentUser.getProfile())) {
            subdepartments = RightsItem.getSubdepartments(currentUser, module, department);
            employees = RightsItem.getEmployees(currentUser, module, department);
        }
        Collections.sort(subdepartments, new SubdepartmentComparator());
        for(Subdepartment subdepartment : subdepartments) {
            subdepartmentVOs.add(new SubdepartmentVO(subdepartment));
        }
        Collections.sort(employees, new EmployeeComparator());
        for(Employee employee : employees) {
            employeeVOs.add(new EmployeeWithoutPasswordVO(employee));
        }
    }
    %>
    {
        "status": "OK",
        "subdepartments": <% gson.toJson(subdepartmentVOs, out); %>,
        "employees": <% gson.toJson(employeeVOs, out); %>
    }
    <%
} else if("getEmployees".equals(command)) {
    Subdepartment subdepartment = (Subdepartment)hs.get(Subdepartment.class, new Long(request.getParameter("subdepartmentId")));
    List<EmployeeWithoutPasswordVO> employeeVOs = new LinkedList<EmployeeWithoutPasswordVO>();

    if(subdepartment != null) {
        List<Employee> employees = new LinkedList<Employee>();
        if(Employee.Profile.COUNTRY_ADMINISTRATOR.equals(currentUser.getProfile())) {
            employees = subdepartment.getEmployees();
        } else if(Employee.Profile.SUPER_USER.equals(currentUser.getProfile())) {
            employees = RightsItem.getEmployees(currentUser, module, subdepartment);
        }
        Collections.sort(employees, new EmployeeComparator());
        for(Employee employee : employees) {
            employeeVOs.add(new EmployeeWithoutPasswordVO(employee));
        }
    }
    %>
    {
        "status": "OK",
        "employees": <% gson.toJson(employeeVOs, out); %>
    }
    <%
} else if("saveChangedProfiles".equals(command)) {
    Action action = new Action(currentUser);
    action.readHttpRequestDataWithParameters(request);
    action.saveWithActionParameters();

    Country userCountry = currentUser.getCountry();
    ProfilesManagementForm profilesManagementForm = ProfilesManagementForm.getFromJson(request.getParameter("profilesManagementForm"));
    for(ProfilesManagementForm.EmployeeProfile employeeProfile : profilesManagementForm.getEmployeeProfiles()) {
        Employee employee = (Employee)hs.get(Employee.class, employeeProfile.getId());
        if(! employee.getProfile().equals(employeeProfile.getProfile()) ) {
            Boolean isAllowed = false;
            if(Employee.Profile.COUNTRY_ADMINISTRATOR.equals(currentUser.getProfile())) {
                if(currentUser.getIsAdministrator()) {
                    isAllowed = true;
                }
                if(! Employee.Profile.COUNTRY_ADMINISTRATOR.equals(employeeProfile.getProfile()) && userCountry.getId().equals(employee.getPosition().getSubdepartment().getDepartment().getOffice().getCountry().getId())) {
                    isAllowed = true;
                }
            } else if(Employee.Profile.SUPER_USER.equals(currentUser.getProfile())) {
                if(RightsItem.isAvailable(employee, currentUser, module) ) {
                    isAllowed = true;
                }
            }
            if(isAllowed) {
                employee.setProfile(employeeProfile.getProfile());
                hs.save(employee);
                if(! Employee.Profile.SUPER_USER.equals(employee.getProfile())) {
                    for(RightsItem rightsItem : employee.getRightsItems()) {
                        hs.delete(rightsItem);
                    }
                }
            }
        }
    }
%>
{
"status": "OK"
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