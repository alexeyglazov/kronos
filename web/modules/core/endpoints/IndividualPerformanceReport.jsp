<%-- 
    Document   : subdepartments
    Created on : 31.03.2011, 13:08:03
    Author     : glazov
--%>
<%@page import="com.mazars.management.db.util.CalendarUtil"%>
<%@page contentType="text/html" pageEncoding="UTF-8"
    import="java.util.*"
    import="com.mazars.management.db.domain.Currency"
    import="com.mazars.management.db.domain.Employee"
    import="com.mazars.management.db.domain.Subdepartment"
    import="com.mazars.management.db.domain.Module"
    import="com.mazars.management.db.domain.Client"
    import="com.mazars.management.db.domain.Office"
    import="com.mazars.management.db.domain.Department"
    import="com.mazars.management.db.domain.Group"
    import="com.mazars.management.db.domain.Country"
    import="com.mazars.management.db.domain.RightsItem"
    import="com.mazars.management.db.domain.CountryCurrency"

    import="com.mazars.management.db.vo.*"
    import="com.mazars.management.web.forms.*"
    import="com.mazars.management.db.util.HibernateUtil"
    import="org.hibernate.Session"
    import="com.google.gson.Gson"
    import="com.mazars.management.reports.*"
    import="com.mazars.management.reports.vo.*"
    import="com.mazars.management.reports.excel.*"
    import="java.text.SimpleDateFormat"
    import="com.mazars.management.db.comparators.*"
    import="com.mazars.management.web.security.AccessChecker"
    import="java.util.zip.*"
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

       Country country = currentUser.getCountry();
       if(Employee.Profile.COUNTRY_ADMINISTRATOR.equals(currentUser.getProfile())) {
           List<Office> offices = new LinkedList<Office>(country.getOffices());
           Collections.sort(offices, new OfficeComparator());
           for(Office office : offices) {
               officeVOs.add(new OfficeVO(office));
           }
       } else if(Employee.Profile.SUPER_USER.equals(currentUser.getProfile())) {
           List<Office> offices = RightsItem.getOffices(currentUser, module);
           Collections.sort(offices, new OfficeComparator());
           for(Office office : offices) {
               officeVOs.add(new OfficeVO(office));
           }
       }

%>
{
"status": "OK",
"offices": <% gson.toJson(officeVOs, out); %>
}
<%
} else if("getOfficeContent".equals(command)) {
   Office office = (Office)hs.get(Office.class, new Long(request.getParameter("officeId")));
   List<DepartmentVO> departmentVOs = new LinkedList<DepartmentVO>();
   List<Department> departments = new LinkedList<Department>();
   if(Employee.Profile.COUNTRY_ADMINISTRATOR.equals(currentUser.getProfile())) {
       departments.addAll(office.getDepartments());
   } else if(Employee.Profile.SUPER_USER.equals(currentUser.getProfile())) {
       departments = RightsItem.getDepartments(currentUser, module, office);
   }
   Collections.sort(departments, new DepartmentComparator());
   for(Department department : departments) {
       departmentVOs.add(new DepartmentVO(department));
   }
%>
{
"status": "OK",
"departments": <% gson.toJson(departmentVOs, out); %>
}
<%
} else if("getDepartmentContent".equals(command)) {
   Department department = (Department)hs.get(Department.class, new Long(request.getParameter("departmentId")));
   List<SubdepartmentVO> subdepartmentVOs = new LinkedList<SubdepartmentVO>();
   List<Subdepartment> subdepartments = new LinkedList<Subdepartment>();
   if(Employee.Profile.COUNTRY_ADMINISTRATOR.equals(currentUser.getProfile())) {
       subdepartments.addAll(department.getSubdepartments());
   } else if(Employee.Profile.SUPER_USER.equals(currentUser.getProfile())) {
       subdepartments = RightsItem.getSubdepartments(currentUser, module, department);
   }
   Collections.sort(subdepartments, new SubdepartmentComparator());
   for(Subdepartment subdepartment : subdepartments) {
       subdepartmentVOs.add(new SubdepartmentVO(subdepartment));
   }
%>
{
"status": "OK",
"subdepartments": <% gson.toJson(subdepartmentVOs, out); %>
}
<%
} else if("getSubdepartmentContent".equals(command)) {
   Subdepartment subdepartment = (Subdepartment)hs.get(Subdepartment.class, new Long(request.getParameter("subdepartmentId")));
   List<EmployeeWithoutPasswordVO> employeeVOs = new LinkedList<EmployeeWithoutPasswordVO>();
   List<Employee> employees = new LinkedList<Employee>();
   if(Employee.Profile.COUNTRY_ADMINISTRATOR.equals(currentUser.getProfile())) {
       employees.addAll(subdepartment.getEmployees());
   } else if(Employee.Profile.SUPER_USER.equals(currentUser.getProfile())) {
       if(RightsItem.isAvailable(subdepartment, currentUser, module)) {
        employees.addAll(subdepartment.getEmployees());
       }
   }
   Collections.sort(employees, new EmployeeComparator());
   for(Employee employee : employees) {
       if(employee.getIsAdministrator()) {
           continue;
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
    IndividualPerformanceReportForm individualPerformanceReportForm = IndividualPerformanceReportForm.getFromJson(request.getParameter("individualPerformanceReportForm"));
    IndividualPerformanceReport individualPerformanceReport = new IndividualPerformanceReport(individualPerformanceReportForm, module, currentUser);
    
    individualPerformanceReport.build();
    IndividualPerformanceReportVO individualPerformanceReportVO = new IndividualPerformanceReportVO(individualPerformanceReport);
    %>
    {
        "status": "OK",
        "report": <% gson.toJson(individualPerformanceReportVO, out); %>
    }
    <%
} else if("generateXLSReport".equals(command)) {
    IndividualPerformanceReportForm individualPerformanceReportForm = IndividualPerformanceReportForm.getFromJson(request.getParameter("individualPerformanceReportForm"));
    IndividualPerformanceReport individualPerformanceReport = new IndividualPerformanceReport(individualPerformanceReportForm, module, currentUser);

    individualPerformanceReport.build();
    SimpleDateFormat dateFormatterShort = new SimpleDateFormat("ddMMyyyy");
    SimpleDateFormat dateFormatterLong = new SimpleDateFormat("ddMMyyyyHHmmss");

    String formOfficeCodeName = "ALL";
    String formDepartmentCodeName = "ALL";
    String formSubdepartmentCodeName = "ALL";
    String formEmployeeUserName = "ALL";
    String formStartDate = dateFormatterShort.format(individualPerformanceReportForm.getStartDate().getCalendar().getTime());
    String formEndDate = dateFormatterShort.format(individualPerformanceReportForm.getEndDate().getCalendar().getTime());

    if(individualPerformanceReport.getFormOffice() != null) {
        formOfficeCodeName = individualPerformanceReport.getFormOffice().getCodeName();
    }
    if(individualPerformanceReport.getFormDepartment() != null) {
        formDepartmentCodeName = individualPerformanceReport.getFormDepartment().getCodeName();
    }
    if(individualPerformanceReport.getFormSubdepartment() != null) {
        formSubdepartmentCodeName = individualPerformanceReport.getFormSubdepartment().getCodeName();
    }
    if(individualPerformanceReport.getFormEmployee() != null) {
        formEmployeeUserName = individualPerformanceReport.getFormEmployee().getUserName();
    }


    String fileName = "IP_" + formOfficeCodeName + "_" + formDepartmentCodeName + "_" + formSubdepartmentCodeName + "_"+ formEmployeeUserName + "_";
    fileName += formStartDate + "_";
    fileName += formEndDate + "_";
    fileName += dateFormatterLong.format(individualPerformanceReport.getCreatedAt());
    fileName += ".xls";

    response.setContentType("application/vnd.ms-excel");
    response.setHeader("content-disposition", "filename=" + fileName);
    IndividualPerformanceReportExcelBuilder reb = new IndividualPerformanceReportExcelBuilder(individualPerformanceReport);
    reb.createStandardReport(response.getOutputStream());
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
