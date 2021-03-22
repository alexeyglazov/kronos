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
    
%><%
request.setCharacterEncoding("UTF-8");
Employee currentUser = (Employee)session.getAttribute("currentUser");
String command = request.getParameter("command");
Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
Gson gson = new Gson();
try {
hs.beginTransaction();
Module module = Module.getByName("Admin");

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

if("saveTask".equals(command)) {
    TaskEditForm taskEditForm = TaskEditForm.getFromJson(request.getParameter("taskEditForm"));
    if(TaskEditForm.Mode.CREATE.equals(taskEditForm.getMode())) {
        TaskType taskType = (TaskType)hs.get(TaskType.class, new Long(taskEditForm.getTaskTypeId()));
        Integer sameNameTasksCount = Task.getByName(taskEditForm.getName(), taskType).size();
        if(sameNameTasksCount > 0) {
            %>{"status": "FAIL", "comment": "Task with the same Name already exists"}<%
        } else {
            Task task = new Task();
            task.setTaskType(taskType);
            task.setName(taskEditForm.getName());
            task.setIsActive(taskEditForm.getIsActive());
            task.setIsIdle(taskEditForm.getIsIdle());
            task.setIsTraining(taskEditForm.getIsTraining());
            task.setDescription(taskEditForm.getDescription());
            hs.save(task);
            %>
            {
            "status": "OK"
            }
            <%
        }
    } else if(TaskEditForm.Mode.UPDATE.equals(taskEditForm.getMode())) {
        Task task = (Task)hs.get(Task.class, new Long(taskEditForm.getId()));
        Integer sameNameTasksCount = 0;
        for(Task taskTmp : Task.getByName(taskEditForm.getName(), task.getTaskType())) {
            if(taskTmp.getId() != task.getId()) {
                sameNameTasksCount++;
            }
        }
        if(sameNameTasksCount > 0) {
            %>{"status": "FAIL", "comment": "Task with the same Name already exists"}<%
        } else {
            task.setName(taskEditForm.getName());
            task.setIsIdle(taskEditForm.getIsIdle());
            task.setIsActive(taskEditForm.getIsActive());
            task.setIsTraining(taskEditForm.getIsTraining());
            task.setDescription(taskEditForm.getDescription());
            hs.save(task);
            %>
            {
            "status": "OK"
            }
            <%
        }
   }
} else if("deleteTask".equals(command)) {
    Task task = (Task)hs.get(Task.class, new Long(request.getParameter("id")));
    hs.delete(task);
    %>
    {
    "status": "OK"
    }
    <%
} else if("checkTaskDependencies".equals(command)) {
    Task task = (Task)hs.get(Task.class, new Long(request.getParameter("id")));
    %>
    {
    "status": "OK",
    "timeSpentItems": <%=task.getTimeSpentItems().size() %>
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