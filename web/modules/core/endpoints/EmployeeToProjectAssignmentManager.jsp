<%-- 
    Document   : subdepartments
    Created on : 31.03.2011, 13:08:03
    Author     : glazov
--%><%@page import="com.mazars.management.db.util.ProjectCodeListUtil"%>
<%@page import="com.mazars.management.db.util.EmployeeUtil"%>
<%@page import="java.io.PrintWriter"%>
<%@page import="com.mazars.management.db.util.EmployeeProjectCodeAccessItemUtil"%>
<%@page import="com.mazars.management.db.complex.EmployeeSubdepartmentHistoryItemWithEmployeeAndSubdepartment"%>
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
   
    ProjectCodeListFilter projectCodeFilter = ProjectCodeListFilter.getFromJson(request.getParameter("projectCodeFilter"));
    EmployeeFilter employeeFilter = EmployeeFilter.getFromJson(request.getParameter("employeeFilter"));
    ProjectCodeListSorter sorter = ProjectCodeListSorter.getFromJson(request.getParameter("sorter"));
    ProjectCodeListLimiter limiter = ProjectCodeListLimiter.getFromJson(request.getParameter("limiter"));
    
    List<Subdepartment> allowedSubdepartments = Subdepartment.getAllowedSubdepartments(null, null, null, currentUser, module);

    InvoiceRequestsFilter tmpInvoiceRequestsFilter = new InvoiceRequestsFilter();
    ProjectCodeListSorter tmpProjectCodeSorter = new ProjectCodeListSorter();
    ProjectCodeListLimiter tmpProjectCodeLimiter = new ProjectCodeListLimiter();
    EmployeeSorter tmpEmployeeSorter = new EmployeeSorter();
    ProjectCodeListLimiter tmpEmployeeLimiter = new ProjectCodeListLimiter();
    List<Employee> employees = null;
    List<ProjectCode> projectCodes = null;        
    if(projectCodeFilter.isUsed()) {
        projectCodes = ProjectCodeListUtil.getProjectCodeFilteredList(projectCodeFilter, tmpInvoiceRequestsFilter, tmpProjectCodeSorter, tmpProjectCodeLimiter, allowedSubdepartments);
    }
    if(employeeFilter.isUsed() ) {
        employees = EmployeeUtil.getEmployeeFilteredList(employeeFilter, tmpEmployeeSorter, tmpEmployeeLimiter, allowedSubdepartments);
    }


    List<EmployeeProjectCodeAccessItem> employeeProjectCodeAccessItems = EmployeeProjectCodeAccessItemUtil.getEmployeeProjectCodeAccessItems(projectCodes, employees, sorter, limiter, allowedSubdepartments);
    List<EmployeeProjectCodeAccessItemUtil.DescribedEmployeeProjectCodeAccessItem> describedEmployeeProjectCodeAccessItems = EmployeeProjectCodeAccessItemUtil.getDescribedEmployeeProjectCodeAccessItems(employeeProjectCodeAccessItems);
    List<EmployeeProjectCodeAccessItemVO> employeeProjectCodeAccessItemVOs = EmployeeProjectCodeAccessItemVO.getList(describedEmployeeProjectCodeAccessItems);
    Long count = EmployeeProjectCodeAccessItemUtil.getCountOfEmployeeProjectCodeAccessItems(projectCodes, employees, sorter, limiter, allowedSubdepartments);
   %>
   {
    "status": "OK",
    "employeeOffices": <% gson.toJson(officeVOs, out); %>,
    "count": <%=count %>,
    "employeeProjectCodeAccessItems": <% gson.toJson(employeeProjectCodeAccessItemVOs, out); %>
   }
   <%
} else if("getEmployeeOfficeContent".equals(command)) {
    Office office = (Office)hs.get(Office.class, new Long(request.getParameter("employeeOfficeId")));
    List<Department> departments = new LinkedList<Department>();
    if(Employee.Profile.COUNTRY_ADMINISTRATOR.equals(currentUser.getProfile())) {
        departments.addAll(office.getDepartments());
    } else if(Employee.Profile.SUPER_USER.equals(currentUser.getProfile())) {
        departments = RightsItem.getDepartments(currentUser, module, office);
    }    
    Collections.sort(departments, new DepartmentComparator());
    List<DepartmentVO> employeeDepartmentVOs = DepartmentVO.getList(departments);
    
    ProjectCodeListFilter projectCodeFilter = ProjectCodeListFilter.getFromJson(request.getParameter("projectCodeFilter"));
    EmployeeFilter employeeFilter = EmployeeFilter.getFromJson(request.getParameter("employeeFilter"));
    ProjectCodeListSorter sorter = ProjectCodeListSorter.getFromJson(request.getParameter("sorter"));
    ProjectCodeListLimiter limiter = ProjectCodeListLimiter.getFromJson(request.getParameter("limiter"));
    
    List<Subdepartment> allowedSubdepartments = Subdepartment.getAllowedSubdepartments(null, null, null, currentUser, module);
    InvoiceRequestsFilter tmpInvoiceRequestsFilter = new InvoiceRequestsFilter();
    ProjectCodeListSorter tmpProjectCodeSorter = new ProjectCodeListSorter();
    ProjectCodeListLimiter tmpProjectCodeLimiter = new ProjectCodeListLimiter();
    EmployeeSorter tmpEmployeeSorter = new EmployeeSorter();
    ProjectCodeListLimiter tmpEmployeeLimiter = new ProjectCodeListLimiter();
    List<Employee> employees = null;
    List<ProjectCode> projectCodes = null;        
    if(projectCodeFilter.isUsed()) {
        projectCodes = ProjectCodeListUtil.getProjectCodeFilteredList(projectCodeFilter, tmpInvoiceRequestsFilter, tmpProjectCodeSorter, tmpProjectCodeLimiter, allowedSubdepartments);
    }
    if(employeeFilter.isUsed() ) {
        employees = EmployeeUtil.getEmployeeFilteredList(employeeFilter, tmpEmployeeSorter, tmpEmployeeLimiter, allowedSubdepartments);
    }

    List<EmployeeProjectCodeAccessItem> employeeProjectCodeAccessItems = EmployeeProjectCodeAccessItemUtil.getEmployeeProjectCodeAccessItems(projectCodes, employees, sorter, limiter, allowedSubdepartments);
    List<EmployeeProjectCodeAccessItemUtil.DescribedEmployeeProjectCodeAccessItem> describedEmployeeProjectCodeAccessItems = EmployeeProjectCodeAccessItemUtil.getDescribedEmployeeProjectCodeAccessItems(employeeProjectCodeAccessItems);
    List<EmployeeProjectCodeAccessItemVO> employeeProjectCodeAccessItemVOs = EmployeeProjectCodeAccessItemVO.getList(describedEmployeeProjectCodeAccessItems);
    Long count = EmployeeProjectCodeAccessItemUtil.getCountOfEmployeeProjectCodeAccessItems(projectCodes, employees, sorter, limiter, allowedSubdepartments);
   
    %>
    {
        "status": "OK",
        "employeeDepartments": <% gson.toJson(employeeDepartmentVOs, out); %>,
        "count": <%=count %>,
        "employeeProjectCodeAccessItems": <% gson.toJson(employeeProjectCodeAccessItemVOs, out); %>
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
    List<SubdepartmentVO> employeeSubdepartmentVOs = SubdepartmentVO.getList(subdepartments);
    
    ProjectCodeListFilter projectCodeFilter = ProjectCodeListFilter.getFromJson(request.getParameter("projectCodeFilter"));
    EmployeeFilter employeeFilter = EmployeeFilter.getFromJson(request.getParameter("employeeFilter"));
    ProjectCodeListSorter sorter = ProjectCodeListSorter.getFromJson(request.getParameter("sorter"));
    ProjectCodeListLimiter limiter = ProjectCodeListLimiter.getFromJson(request.getParameter("limiter"));
    
    List<Subdepartment> allowedSubdepartments = Subdepartment.getAllowedSubdepartments(null, null, null, currentUser, module);
    InvoiceRequestsFilter tmpInvoiceRequestsFilter = new InvoiceRequestsFilter();
    ProjectCodeListSorter tmpProjectCodeSorter = new ProjectCodeListSorter();
    ProjectCodeListLimiter tmpProjectCodeLimiter = new ProjectCodeListLimiter();
    EmployeeSorter tmpEmployeeSorter = new EmployeeSorter();
    ProjectCodeListLimiter tmpEmployeeLimiter = new ProjectCodeListLimiter();
    List<Employee> employees = null;
    List<ProjectCode> projectCodes = null;        
    if(projectCodeFilter.isUsed()) {
        projectCodes = ProjectCodeListUtil.getProjectCodeFilteredList(projectCodeFilter, tmpInvoiceRequestsFilter, tmpProjectCodeSorter, tmpProjectCodeLimiter, allowedSubdepartments);
    }
    if(employeeFilter.isUsed() ) {
        employees = EmployeeUtil.getEmployeeFilteredList(employeeFilter, tmpEmployeeSorter, tmpEmployeeLimiter, allowedSubdepartments);
    }

    List<EmployeeProjectCodeAccessItem> employeeProjectCodeAccessItems = EmployeeProjectCodeAccessItemUtil.getEmployeeProjectCodeAccessItems(projectCodes, employees, sorter, limiter, allowedSubdepartments);
    List<EmployeeProjectCodeAccessItemUtil.DescribedEmployeeProjectCodeAccessItem> describedEmployeeProjectCodeAccessItems = EmployeeProjectCodeAccessItemUtil.getDescribedEmployeeProjectCodeAccessItems(employeeProjectCodeAccessItems);
    List<EmployeeProjectCodeAccessItemVO> employeeProjectCodeAccessItemVOs = EmployeeProjectCodeAccessItemVO.getList(describedEmployeeProjectCodeAccessItems);
    Long count = EmployeeProjectCodeAccessItemUtil.getCountOfEmployeeProjectCodeAccessItems(projectCodes, employees, sorter, limiter, allowedSubdepartments);
    
    %>
    {
        "status": "OK",
        "employeeSubdepartments": <% gson.toJson(employeeSubdepartmentVOs, out); %>,
        "count": <%=count %>,
        "employeeProjectCodeAccessItems": <% gson.toJson(employeeProjectCodeAccessItemVOs, out); %>
    }<%   
} else if("getEmployeeSubdepartmentContent".equals(command)) {
    Subdepartment subdepartment = (Subdepartment)hs.get(Subdepartment.class, new Long(request.getParameter("employeeSubdepartmentId")));
    List<Employee> filterEmployees = new LinkedList<Employee>();
    if(Employee.Profile.COUNTRY_ADMINISTRATOR.equals(currentUser.getProfile())) {
        filterEmployees.addAll(subdepartment.getEmployees());
    } else if(Employee.Profile.SUPER_USER.equals(currentUser.getProfile())) {
        if(RightsItem.isAvailable(subdepartment, currentUser, module)) {
            filterEmployees.addAll(subdepartment.getEmployees());
        }
    }    
    Collections.sort(filterEmployees, new EmployeeComparator());
    List<EmployeeWithoutPasswordVO> employeeVOs = EmployeeWithoutPasswordVO.getList(filterEmployees);
    
    ProjectCodeListFilter projectCodeFilter = ProjectCodeListFilter.getFromJson(request.getParameter("projectCodeFilter"));
    EmployeeFilter employeeFilter = EmployeeFilter.getFromJson(request.getParameter("employeeFilter"));
    ProjectCodeListSorter sorter = ProjectCodeListSorter.getFromJson(request.getParameter("sorter"));
    ProjectCodeListLimiter limiter = ProjectCodeListLimiter.getFromJson(request.getParameter("limiter"));
    
    List<Subdepartment> allowedSubdepartments = Subdepartment.getAllowedSubdepartments(null, null, null, currentUser, module);
    InvoiceRequestsFilter tmpInvoiceRequestsFilter = new InvoiceRequestsFilter();
    ProjectCodeListSorter tmpProjectCodeSorter = new ProjectCodeListSorter();
    ProjectCodeListLimiter tmpProjectCodeLimiter = new ProjectCodeListLimiter();
    EmployeeSorter tmpEmployeeSorter = new EmployeeSorter();
    ProjectCodeListLimiter tmpEmployeeLimiter = new ProjectCodeListLimiter();
    List<Employee> employees = null;
    List<ProjectCode> projectCodes = null;        
    if(projectCodeFilter.isUsed()) {
        projectCodes = ProjectCodeListUtil.getProjectCodeFilteredList(projectCodeFilter, tmpInvoiceRequestsFilter, tmpProjectCodeSorter, tmpProjectCodeLimiter, allowedSubdepartments);
    }
    if(employeeFilter.isUsed() ) {
        employees = EmployeeUtil.getEmployeeFilteredList(employeeFilter, tmpEmployeeSorter, tmpEmployeeLimiter, allowedSubdepartments);
    }

    List<EmployeeProjectCodeAccessItem> employeeProjectCodeAccessItems = EmployeeProjectCodeAccessItemUtil.getEmployeeProjectCodeAccessItems(projectCodes, employees, sorter, limiter, allowedSubdepartments);
    List<EmployeeProjectCodeAccessItemUtil.DescribedEmployeeProjectCodeAccessItem> describedEmployeeProjectCodeAccessItems = EmployeeProjectCodeAccessItemUtil.getDescribedEmployeeProjectCodeAccessItems(employeeProjectCodeAccessItems);
    List<EmployeeProjectCodeAccessItemVO> employeeProjectCodeAccessItemVOs = EmployeeProjectCodeAccessItemVO.getList(describedEmployeeProjectCodeAccessItems);
    Long count = EmployeeProjectCodeAccessItemUtil.getCountOfEmployeeProjectCodeAccessItems(projectCodes, employees, sorter, limiter, allowedSubdepartments);
    
    %>
    {
        "status": "OK",
        "employees": <% gson.toJson(employeeVOs, out); %>,
        "count": <%=count %>,
        "employeeProjectCodeAccessItems": <% gson.toJson(employeeProjectCodeAccessItemVOs, out); %>
    }<%   
} else if("getEmployeeProjectCodeAccessItems".equals(command)) {
    ProjectCodeListFilter projectCodeFilter = ProjectCodeListFilter.getFromJson(request.getParameter("projectCodeFilter"));
    EmployeeFilter employeeFilter = EmployeeFilter.getFromJson(request.getParameter("employeeFilter"));
    ProjectCodeListSorter sorter = ProjectCodeListSorter.getFromJson(request.getParameter("sorter"));
    ProjectCodeListLimiter limiter = ProjectCodeListLimiter.getFromJson(request.getParameter("limiter"));
    List<Subdepartment> allowedSubdepartments = Subdepartment.getAllowedSubdepartments(null, null, null, currentUser, module);
    InvoiceRequestsFilter tmpInvoiceRequestsFilter = new InvoiceRequestsFilter();
    ProjectCodeListSorter tmpProjectCodeSorter = new ProjectCodeListSorter();
    ProjectCodeListLimiter tmpProjectCodeLimiter = new ProjectCodeListLimiter();
    EmployeeSorter tmpEmployeeSorter = new EmployeeSorter();
    ProjectCodeListLimiter tmpEmployeeLimiter = new ProjectCodeListLimiter();
    List<Employee> employees = null;
    List<ProjectCode> projectCodes = null;        
    if(projectCodeFilter.isUsed()) {
        projectCodes = ProjectCodeListUtil.getProjectCodeFilteredList(projectCodeFilter, tmpInvoiceRequestsFilter, tmpProjectCodeSorter, tmpProjectCodeLimiter, allowedSubdepartments);
    }
    if(employeeFilter.isUsed() ) {
        employees = EmployeeUtil.getEmployeeFilteredList(employeeFilter, tmpEmployeeSorter, tmpEmployeeLimiter, allowedSubdepartments);
    }

    List<EmployeeProjectCodeAccessItem> employeeProjectCodeAccessItems = EmployeeProjectCodeAccessItemUtil.getEmployeeProjectCodeAccessItems(projectCodes, employees, sorter, limiter, allowedSubdepartments);
    List<EmployeeProjectCodeAccessItemUtil.DescribedEmployeeProjectCodeAccessItem> describedEmployeeProjectCodeAccessItems = EmployeeProjectCodeAccessItemUtil.getDescribedEmployeeProjectCodeAccessItems(employeeProjectCodeAccessItems);
    List<EmployeeProjectCodeAccessItemVO> employeeProjectCodeAccessItemVOs = EmployeeProjectCodeAccessItemVO.getList(describedEmployeeProjectCodeAccessItems);
    Long count = EmployeeProjectCodeAccessItemUtil.getCountOfEmployeeProjectCodeAccessItems(projectCodes, employees, sorter, limiter, allowedSubdepartments);
    
    %>
    {
        "status": "OK",
        "count": <%=count %>,
        "employeeProjectCodeAccessItems": <% gson.toJson(employeeProjectCodeAccessItemVOs, out); %>
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