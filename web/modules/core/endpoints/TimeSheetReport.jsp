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
    import="com.mazars.management.reports.TimeSheetReport"
    import="com.mazars.management.reports.vo.*"
    import="java.text.SimpleDateFormat"
    import="com.mazars.management.reports.excel.TimeSheetReportExcelBuilder"
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
Module module = Module.getByName("Timesheets Report");

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
       
       Boolean onlyActiveEmployees = "true".equalsIgnoreCase(request.getParameter("onlyActiveEmployees"));
       
       List<Office> offices = new LinkedList<Office>();
       List<Employee> employees = new LinkedList<Employee>();
       if(Employee.Profile.COUNTRY_ADMINISTRATOR.equals(currentUser.getProfile())) {
           Country country = currentUser.getCountry();
           offices.addAll(country.getOffices());
           employees = country.getEmployees();
       } else if(Employee.Profile.SUPER_USER.equals(currentUser.getProfile())) {
           offices.addAll(RightsItem.getOffices(currentUser, module));
           employees = RightsItem.getEmployees(currentUser, module);
       }
       Collections.sort(offices, new OfficeComparator());
       Collections.sort(employees, new EmployeeComparator(EmployeeComparator.Mode.LASTNAME));
       for(Office office : offices ) {
            officeVOs.add(new OfficeVO(office));
       }
       for(Employee employee : employees) {
           if(employee.getIsAdministrator() || (! employee.getIsActive() && onlyActiveEmployees)) {
            continue; // don't show administrator
           }
            employeeVOs.add(new EmployeeWithoutPasswordVO(employee));
       }
       Integer minYear = TimeSpentItem.getMinYear();
%>
{
"status": "OK",
"offices": <% gson.toJson(officeVOs, out); %>,
"employees": <% gson.toJson(employeeVOs, out); %>,
"minYear": <%=minYear %>
}
<%
} else if("getOfficeContent".equals(command)) {
       List<DepartmentVO> departmentVOs = new LinkedList<DepartmentVO>();
       List<EmployeeWithoutPasswordVO> employeeVOs = new LinkedList<EmployeeWithoutPasswordVO>();

       Office office = (Office)hs.get(Office.class, new Long(request.getParameter("officeId")));
       Boolean onlyActiveEmployees = "true".equalsIgnoreCase(request.getParameter("onlyActiveEmployees"));

       List<Department> departments = new LinkedList<Department>();
       List<Employee> employees = new LinkedList<Employee>();
       if(Employee.Profile.COUNTRY_ADMINISTRATOR.equals(currentUser.getProfile())) {
           Country country = currentUser.getCountry();
           departments.addAll(office.getDepartments());
           employees = country.getEmployees();
       } else if(Employee.Profile.SUPER_USER.equals(currentUser.getProfile())) {
           departments.addAll(RightsItem.getDepartments(currentUser, module));
           employees = RightsItem.getEmployees(currentUser, module);
       }
       Collections.sort(departments, new DepartmentComparator());
       Collections.sort(employees, new EmployeeComparator(EmployeeComparator.Mode.LASTNAME));
       for(Department department : departments ) {
            departmentVOs.add(new DepartmentVO(department));
       }
       for(Employee employee : employees) {
           if(employee.getIsAdministrator() || (! employee.getIsActive() && onlyActiveEmployees)) {
            continue; // don't show administrator
           }
            employeeVOs.add(new EmployeeWithoutPasswordVO(employee));
       }
       Integer minYear = TimeSpentItem.getMinYear();
%>
{
"status": "OK",
"departments": <% gson.toJson(departmentVOs, out); %>,
"employees": <% gson.toJson(employeeVOs, out); %>,
"minYear": <%=minYear %>
}
<%
} else if("getDepartmentContent".equals(command)) {
       List<SubdepartmentVO> subdepartmentVOs = new LinkedList<SubdepartmentVO>();
       List<EmployeeWithoutPasswordVO> employeeVOs = new LinkedList<EmployeeWithoutPasswordVO>();

       Department department = (Department)hs.get(Department.class, new Long(request.getParameter("departmentId")));
       Boolean onlyActiveEmployees = "true".equalsIgnoreCase(request.getParameter("onlyActiveEmployees"));

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
       Collections.sort(employees, new EmployeeComparator(EmployeeComparator.Mode.LASTNAME));
       for(Subdepartment subdepartment : subdepartments) {
            subdepartmentVOs.add(new SubdepartmentVO(subdepartment));
       }
       for(Employee employee : employees) {
           if(employee.getIsAdministrator() || (! employee.getIsActive() && onlyActiveEmployees)) {
            continue; // don't show administrator
           }
           employeeVOs.add(new EmployeeWithoutPasswordVO(employee));
       }
%>
{
"status": "OK",
"subdepartments": <% gson.toJson(subdepartmentVOs, out); %>,
"employees": <% gson.toJson(employeeVOs, out); %>
}
<%
} else if("getSubdepartmentContent".equals(command)) {
       List<EmployeeWithoutPasswordVO> employeeVOs = new LinkedList<EmployeeWithoutPasswordVO>();

       Subdepartment subdepartment = (Subdepartment)hs.get(Subdepartment.class, new Long(request.getParameter("subdepartmentId")));
       Boolean onlyActiveEmployees = "true".equalsIgnoreCase(request.getParameter("onlyActiveEmployees"));

       List<Employee> employees = new LinkedList<Employee>(subdepartment.getEmployees());
       Collections.sort(employees, new EmployeeComparator(EmployeeComparator.Mode.LASTNAME));
       for(Employee employee : employees) {
           if(employee.getIsAdministrator() || (! employee.getIsActive() && onlyActiveEmployees)) {
            continue; // don't show administrator
           }
           employeeVOs.add(new EmployeeWithoutPasswordVO(employee));
       }
%>
{
"status": "OK",
"employees": <% gson.toJson(employeeVOs, out); %>
}
<%
} else if("generateReport".equals(command)) {
    TimeSheetReportForm timeSheetReportForm = TimeSheetReportForm.getFromJson(request.getParameter("timeSheetReportForm"));
    TimeSheetReport timeSheetReport = new TimeSheetReport(timeSheetReportForm, module, currentUser);
    timeSheetReport.build();
    TimeSheetReportVO timeSheetReportVO = new TimeSheetReportVO(timeSheetReport);
    %>
    {
    "status": "OK",
    "report": <% gson.toJson(timeSheetReportVO, out); %>
    }
    <%
} else if("generateXLSReport".equals(command)) {
    TimeSheetReportForm timeSheetReportForm = TimeSheetReportForm.getFromJson(request.getParameter("timeSheetReportForm"));
    TimeSheetReport timeSheetReport = new TimeSheetReport(timeSheetReportForm, module, currentUser);
    timeSheetReport.build();

    SimpleDateFormat dateFormatterShort = new SimpleDateFormat("ddMMyyyy");
    SimpleDateFormat dateFormatterLong = new SimpleDateFormat("ddMMyyyyHHmmss");

    String fileName = "TS_" + timeSheetReport.getFormEmployee().getUserName() + "_" + dateFormatterShort.format(timeSheetReport.getFormStartDate().getTime()) + "_" + dateFormatterShort.format(timeSheetReport.getFormEndDate().getTime()) + "_";
    fileName += dateFormatterLong.format(timeSheetReport.getCreatedAt());
    fileName += ".xls";

    response.setContentType("application/vnd.ms-excel");
    response.setHeader("content-disposition", "filename=" + fileName);
    TimeSheetReportExcelBuilder reb = new TimeSheetReportExcelBuilder(timeSheetReport, response.getOutputStream());
    reb.createWorkbook();
    reb.fillWorkbook();
    reb.writeWorkbook();
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
