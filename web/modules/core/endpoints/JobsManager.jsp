<%-- 
    Document   : subdepartments
    Created on : 31.03.2011, 13:08:03
    Author     : glazov
--%><%@page import="java.io.OutputStream"%><%@page import="java.io.ByteArrayInputStream"%><%@page import="com.mazars.management.jobs.Job"%><%@page import="com.mazars.management.jobs.JobManager"%><%@page import="com.mazars.management.web.vo.JobWithEmployeeVO"%><%@page import="com.mazars.management.web.vo.JobResultWithEmployeeVO"%><%@page contentType="text/html" pageEncoding="UTF-8"
    import="java.util.*"
    import="com.mazars.management.db.domain.*"
    import="com.mazars.management.db.vo.*"
    import="com.mazars.management.web.forms.*"
    import="com.mazars.management.db.util.HibernateUtil"
    import="org.hibernate.Session"
    import="com.google.gson.Gson"
    import="com.mazars.management.web.security.AccessChecker"
    
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
    List<JobWithEmployeeVO> runningJobs = new LinkedList<JobWithEmployeeVO>();
    List<JobResultWithEmployeeVO> jobResults = new LinkedList<JobResultWithEmployeeVO>();

    String employeeIdStr = request.getParameter("employeeId");
    Employee employee = null;
    if(employeeIdStr != null) {
        employee = (Employee)hs.get(Employee.class, new Long(employeeIdStr));
        if(employee == null) {
            throw new Exception("Wrong employee id");
        }
    }
    String jobName = request.getParameter("jobName");

    if(Employee.Profile.COUNTRY_ADMINISTRATOR.equals(currentUser.getProfile())) {

    } else if(Employee.Profile.SUPER_USER.equals(currentUser.getProfile())) {
        if(! currentUser.getId().equals(employee.getId())) {
            throw new Exception("Wrong employee");
        }
    } else {
        throw new Exception("Wrong profile");
    }
          
    for(Job job : JobManager.getInstance().getJobs(jobName, employee)) {
        runningJobs.add(new JobWithEmployeeVO(job));
    }
    for(JobResult jobResult : JobResult.getAll(jobName, employee)) {
        jobResults.add(new JobResultWithEmployeeVO(jobResult));
    }
%>
    {
    "status": "OK",
    "jobResults": <% gson.toJson(jobResults, out); %>,
    "runningJobs": <% gson.toJson(runningJobs, out); %>
    }
    <%
} else if("deleteJobResult".equals(command)) {
    Long jobResultId = Long.parseLong(request.getParameter("jobResultId"));
    JobResult jobResult = (JobResult)hs.get(JobResult.class, jobResultId);
    if(Employee.Profile.COUNTRY_ADMINISTRATOR.equals(currentUser.getProfile())) {
        hs.delete(jobResult);
    }
    %>
    {
    "status": "OK"
    }
    <%
} else if("loadJobResult".equals(command)) {
    Long jobResultId = Long.parseLong(request.getParameter("jobResultId"));
    JobResult jobResult = (JobResult)hs.get(JobResult.class, jobResultId);
    if(jobResult == null) {
        %>Job result does not exist<%
        return;
    }
    if(
        Employee.Profile.COUNTRY_ADMINISTRATOR.equals(currentUser.getProfile()) ||
        jobResult.getEmployee().getId().equals(currentUser.getId())
    ) {
        response.setContentType("application/vnd.ms-excel");
        response.setHeader("content-disposition", "filename=" + jobResult.getFileName());
        OutputStream o = response.getOutputStream();
        o.write(jobResult.getData());
    }
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