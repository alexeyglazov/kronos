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
    import="com.mazars.management.reports.OwnTimeReport"
    import="com.mazars.management.reports.vo.*"
    import="java.text.SimpleDateFormat"
    import="com.mazars.management.reports.OwnTimeReport"
    import="com.mazars.management.reports.excel.*"
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
       List<Office> offices = new LinkedList<Office>();
       if(currentUser.getProfile().equals(Employee.Profile.SUPER_USER)) {
            offices = RightsItem.getOffices(currentUser, module);
       } else if(currentUser.getProfile().equals(Employee.Profile.COUNTRY_ADMINISTRATOR)) {
            offices = new LinkedList(currentUser.getCountry().getOffices());
       }
       Collections.sort(offices, new OfficeComparator());
       List<OfficeVO> officeVOs = OfficeVO.getList(offices);
       List<Task> tasks = new LinkedList<Task>(TaskType.getCommonInternalTasks());
       Collections.sort(tasks, new TaskComparator());
       List<TaskVO> internalTaskVOs = TaskVO.getList(tasks);
%>
{
"status": "OK",
"offices": <% gson.toJson(officeVOs, out); %>,
"internalTasks": <% gson.toJson(internalTaskVOs, out); %>
}
<%
} else if("getOfficeContent".equals(command)) {
       Office office = (Office)hs.get(Office.class, new Long(request.getParameter("officeId")));
       List<Department> departments = new LinkedList<Department>();
       if(currentUser.getProfile().equals(Employee.Profile.SUPER_USER)) {
            departments = RightsItem.getDepartments(currentUser, module, office);
       } else if(currentUser.getProfile().equals(Employee.Profile.COUNTRY_ADMINISTRATOR)) {
            departments.addAll(office.getDepartments());
       }
       Collections.sort(departments, new DepartmentComparator());
       List<DepartmentVO> departmentVOs = DepartmentVO.getList(departments);
%>
{
"status": "OK",
"departments": <% gson.toJson(departmentVOs, out); %>
}
<%
} else if("getDepartmentContent".equals(command)) {
       Department department = (Department)hs.get(Department.class, new Long(request.getParameter("departmentId")));
       List<Subdepartment> subdepartments = new LinkedList<Subdepartment>();
       if(currentUser.getProfile().equals(Employee.Profile.SUPER_USER)) {
            subdepartments = RightsItem.getSubdepartments(currentUser, module);
       } else if(currentUser.getProfile().equals(Employee.Profile.COUNTRY_ADMINISTRATOR)) {
            subdepartments.addAll(department.getSubdepartments());
       }
       Collections.sort(subdepartments, new SubdepartmentComparator());
       List<SubdepartmentVO> subdepartmentVOs = SubdepartmentVO.getList(subdepartments);
%>
{
"status": "OK",
"subdepartments": <% gson.toJson(subdepartmentVOs, out); %>
}
<%
} else if("generateReports".equals(command)) {
    OwnTimeReportForm ownTimeReportForm = OwnTimeReportForm.getFromJson(request.getParameter("ownTimeReportForm"));
    OwnTimeReport ownTimeReport = new OwnTimeReport(ownTimeReportForm, module, currentUser);
    ownTimeReport.build();
    OwnTimeReportVO ownTimeReportVO = new OwnTimeReportVO(ownTimeReport);
    %>
    {
    "status": "OK",
    "report": <% gson.toJson(ownTimeReportVO, out); %>
    }
    <%
} else if("generateXLSReports".equals(command)) {
    OwnTimeReportForm ownTimeReportForm = OwnTimeReportForm.getFromJson(request.getParameter("ownTimeReportForm"));
    OwnTimeReport ownTimeReport = new OwnTimeReport(ownTimeReportForm, module, currentUser);
    ownTimeReport.build();
        
    SimpleDateFormat dateFormatterShort = new SimpleDateFormat("ddMMyyyy");
    SimpleDateFormat dateFormatterLong = new SimpleDateFormat("ddMMyyyyHHmmss");
    String formOfficeCodeName = "ALL";
    String formDepartmentCodeName = "ALL";
    String formSubdepartmentCodeName = "ALL";
    String formStartDate = dateFormatterShort.format(ownTimeReportForm.getStartDate().getCalendar().getTime());
    String formEndDate = dateFormatterShort.format(ownTimeReportForm.getEndDate().getCalendar().getTime());

    if(ownTimeReport.getFormOffice() != null) {
        formOfficeCodeName = ownTimeReport.getFormOffice().getCodeName();
    }
    if(ownTimeReport.getFormDepartment() != null) {
        formDepartmentCodeName = ownTimeReport.getFormDepartment().getCodeName();
    }
    if(ownTimeReport.getFormSubdepartment() != null) {
        formSubdepartmentCodeName = ownTimeReport.getFormSubdepartment().getCodeName();
    }
    String fileName = "OT_" + formOfficeCodeName + "_" + formDepartmentCodeName + "_" + formSubdepartmentCodeName + "_";
    fileName += dateFormatterShort.format(ownTimeReportForm.getStartDate().getCalendar().getTime());
    fileName += "_";
    fileName += dateFormatterShort.format(ownTimeReportForm.getEndDate().getCalendar().getTime());
    fileName += "_";
    fileName += dateFormatterLong.format(ownTimeReport.getCreatedAt());
    fileName += ".xls";

    response.setContentType("application/vnd.ms-excel");
    response.setHeader("content-disposition", "filename=" + fileName);
    OwnTimeReportExcelBuilder reb = new OwnTimeReportExcelBuilder(ownTimeReport, response.getOutputStream());
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