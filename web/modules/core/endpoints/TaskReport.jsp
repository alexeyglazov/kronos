<%-- 
    Document   : subdepartments
    Created on : 31.03.2011, 13:08:03
    Author     : glazov
--%>
<%@page import="java.io.PrintWriter"%>
<%@page import="com.mazars.management.db.util.CalendarUtil"%>
<%@page contentType="text/html" pageEncoding="UTF-8"
    import="java.util.*"
    import="com.mazars.management.db.domain.*"
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
       List<Office> offices = new LinkedList<Office>();
       if(Employee.Profile.COUNTRY_ADMINISTRATOR.equals(currentUser.getProfile())) {
           offices = new LinkedList<Office>(country.getOffices());
       } else if(Employee.Profile.SUPER_USER.equals(currentUser.getProfile())) {
           offices = RightsItem.getOffices(currentUser, module, country);
       }

       Collections.sort(offices, new OfficeComparator());
       for(Office office : offices) {
            officeVOs.add(new OfficeVO(office));
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
    List<TaskTypeVO> taskTypeVOs = new LinkedList<TaskTypeVO>();
       
    List<TaskType> taskTypes = new LinkedList<TaskType>(subdepartment.getTaskTypes() );
    Collections.sort(taskTypes, new TaskTypeComparator());
    for(TaskType taskType : taskTypes) {
        taskTypeVOs.add(new TaskTypeVO(taskType));
    }

%>
{
"status": "OK",
"taskTypes": <% gson.toJson(taskTypeVOs, out); %>
}
<%
} else if("getTaskTypeContent".equals(command)) {
    TaskType taskType = (TaskType)hs.get(TaskType.class, new Long(request.getParameter("taskTypeId")));
    List<TaskVO> taskVOs = new LinkedList<TaskVO>();
       
    List<Task> tasks = new LinkedList<Task>(taskType.getTasks() );
    Collections.sort(tasks, new TaskComparator());
    for(Task task : tasks) {
        taskVOs.add(new TaskVO(task));
    }

%>
{
"status": "OK",
"tasks": <% gson.toJson(taskVOs, out); %>
}
<%
} else if("generateReport".equals(command)) {
    TaskReportForm taskReportForm = TaskReportForm.getFromJson(request.getParameter("taskReportForm"));
    TaskReport taskReport = new TaskReport(taskReportForm, module, currentUser);
    taskReport.build();
    TaskReportVO taskReportVO = new TaskReportVO(taskReport);
    %>
    {
        "status": "OK",
        "report": <% gson.toJson(taskReportVO, out); %>
    }
    <%
} else if("generateXLSReport".equals(command)) {
    TaskReportForm taskReportForm = TaskReportForm.getFromJson(request.getParameter("taskReportForm"));
    String taskName = "";
    if(taskReportForm.getTaskId() != null) {
        Task task = (Task)hs.get(Task.class, new Long(taskReportForm.getTaskId()));
        taskName = task.getName().replaceAll("!\\w", "").replaceAll(" ", "");
    }

    TaskReport taskReport = new TaskReport(taskReportForm, module, currentUser);
    taskReport.build();

    SimpleDateFormat dateFormatterShort = new SimpleDateFormat("ddMMyyyy");
    SimpleDateFormat dateFormatterLong = new SimpleDateFormat("ddMMyyyyHHmmss");
    String fileName = "T_" + taskName + "_";
    if(taskReportForm.getStartDate() != null) {
        fileName += dateFormatterShort.format(taskReportForm.getStartDate().getCalendar().getTime());
    } else {
        fileName += "ALL";
    }
    fileName += "_";
    if(taskReportForm.getEndDate() != null) {
        fileName += dateFormatterShort.format(taskReportForm.getEndDate().getCalendar().getTime());
    } else {
        fileName += "ALL";
    }
    fileName += "_";
    fileName += dateFormatterLong.format(taskReport.getCreatedAt());
    fileName += ".xls";

    response.setContentType("application/vnd.ms-excel");
    response.setHeader("content-disposition", "filename=" + fileName);
    TaskReportExcelBuilder reb = new TaskReportExcelBuilder(taskReport);
    reb.createWorkbook(response.getOutputStream());
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
