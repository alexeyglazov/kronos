<%-- 
    Document   : subdepartments
    Created on : 31.03.2011, 13:08:03
    Author     : glazov
--%><%@page import="java.io.PrintWriter"%>
<%@page contentType="text/html" pageEncoding="UTF-8"
    import="java.util.*"
    import="com.mazars.management.db.domain.*"
    import="com.mazars.management.db.vo.*"
    import="com.mazars.management.web.forms.*"
    import="com.mazars.management.db.util.HibernateUtil"
    import="org.hibernate.Session"
    import="com.google.gson.Gson"
    import="com.mazars.management.reports.EmployeesForProjectsReport"
    import="com.mazars.management.reports.vo.*"
    import="java.text.SimpleDateFormat"
    import="com.mazars.management.reports.excel.EmployeesForProjectsReportExcelBuilder"
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
    Integer minYear = TimeSpentItem.getMinYear();
    List<Office> offices = new LinkedList<Office>();
    if(currentUser.getProfile().equals(Employee.Profile.SUPER_USER)) {
         offices = RightsItem.getOffices(currentUser, module);
    } else if(currentUser.getProfile().equals(Employee.Profile.COUNTRY_ADMINISTRATOR)) {
         offices = new LinkedList(currentUser.getCountry().getOffices());
    }
    Collections.sort(offices, new OfficeComparator());
    officeVOs = OfficeVO.getList(offices);   
%>
{
"status": "OK",
"offices": <% gson.toJson(officeVOs, out); %>,
"minYear": <%=minYear %>
}
<%
} else if("getOfficeContent".equals(command)) {
    Office office = (Office)hs.get(Office.class, new Long(request.getParameter("officeId")));
    List<DepartmentVO> departmentVOs = new LinkedList<DepartmentVO>();
    List<Department> departments = new LinkedList<Department>();
    if(currentUser.getProfile().equals(Employee.Profile.SUPER_USER)) {
         departments = RightsItem.getDepartments(currentUser, module, office);
    } else if(currentUser.getProfile().equals(Employee.Profile.COUNTRY_ADMINISTRATOR)) {
         departments.addAll(office.getDepartments());
    }
    Collections.sort(departments, new DepartmentComparator());
    departmentVOs = DepartmentVO.getList(departments);  
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
    if(currentUser.getProfile().equals(Employee.Profile.SUPER_USER)) {
        subdepartments = RightsItem.getSubdepartments(currentUser, module, department);
    } else if(currentUser.getProfile().equals(Employee.Profile.COUNTRY_ADMINISTRATOR)) {
        subdepartments.addAll(department.getSubdepartments());
    }
    Collections.sort(subdepartments, new SubdepartmentComparator());
    subdepartmentVOs = SubdepartmentVO.getList(subdepartments);  
%>
{
"status": "OK",
"subdepartments": <% gson.toJson(subdepartmentVOs, out); %>
}
<% 
} else if("generateReport".equals(command)) {
    EmployeesForProjectsReportForm employeesForProjetsReportForm = EmployeesForProjectsReportForm.getFromJson(request.getParameter("employeesForProjectsReportForm"));
    EmployeesForProjectsReport employeesForProjectsReport = new EmployeesForProjectsReport(employeesForProjetsReportForm, module, currentUser);
    employeesForProjectsReport.build();
    EmployeesForProjectsReportVO employeesForProjectsReportVO = new EmployeesForProjectsReportVO(employeesForProjectsReport);
    %>
    {
    "status": "OK",
    "report": <% gson.toJson(employeesForProjectsReportVO, out); %>
    }
    <%
} else if("generateXLSReport".equals(command)) {
    EmployeesForProjectsReportForm employeesForProjectsReportForm = EmployeesForProjectsReportForm.getFromJson(request.getParameter("employeesForProjectsReportForm"));
    EmployeesForProjectsReport employeesForProjectsReport = new EmployeesForProjectsReport(employeesForProjectsReportForm, module, currentUser);
    employeesForProjectsReport.build();
    SimpleDateFormat dateFormatterShort = new SimpleDateFormat("ddMMyyyy");
    SimpleDateFormat dateFormatterLong = new SimpleDateFormat("ddMMyyyyHHmmss");
    String[] months = {"January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"};
    String codeName = "";
    if(employeesForProjectsReport.getFormOffice() != null) {
        codeName += employeesForProjectsReport.getFormOffice().getCodeName() + "_";
    } else {
        codeName += "ALL" + "_";
    }
    if(employeesForProjectsReport.getFormDepartment() != null) {
        codeName += employeesForProjectsReport.getFormDepartment().getCodeName() + "_";
    } else {
        codeName += "ALL" + "_";
    }        
    if(employeesForProjectsReport.getFormSubdepartment() != null) {
        codeName += employeesForProjectsReport.getFormSubdepartment().getCodeName();
    } else {
        codeName += "ALL" + "_";
    }
    String fileName = "EP_" + employeesForProjectsReportForm.getYear() + "_" + months[employeesForProjectsReportForm.getMonth()] + "_" + codeName + "_";
    fileName += dateFormatterLong.format(employeesForProjectsReport.getCreatedAt());
    fileName += ".xls";

    response.setContentType("application/vnd.ms-excel");
    response.setHeader("content-disposition", "filename=" + fileName);
    EmployeesForProjectsReportExcelBuilder reb = new EmployeesForProjectsReportExcelBuilder(employeesForProjectsReport, response.getOutputStream());
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
        "comment": <% gson.toJson(ex.toString(), out); %><% ex.printStackTrace(new PrintWriter(out)); %>
    }
    <%
}
%>
