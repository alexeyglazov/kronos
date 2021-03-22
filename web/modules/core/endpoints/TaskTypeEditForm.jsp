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
if("saveTaskType".equals(command)) {
    TaskTypeEditForm taskTypeEditForm = TaskTypeEditForm.getFromJson(request.getParameter("taskTypeEditForm"));
    if(TaskTypeEditForm.Mode.CREATE.equals(taskTypeEditForm.getMode())) {
        Integer sameNameTaskTypesCount;
        Subdepartment subdepartment = null;
        if(TaskTypeEditForm.Kind.COMMON.equals(taskTypeEditForm.getKind())) {
            sameNameTaskTypesCount = TaskType.getByName(taskTypeEditForm.getName(), null).size();
        } else {
           subdepartment = (Subdepartment)hs.get(Subdepartment.class, new Long(taskTypeEditForm.getSubdepartmentId()));
           sameNameTaskTypesCount = TaskType.getByName(taskTypeEditForm.getName(), subdepartment).size();
        }
        if(sameNameTaskTypesCount > 0) {
            %>{"status": "FAIL", "comment": "Task Type with the same Name already exists"}<%
        } else {
            TaskType taskType = new TaskType();
            if(TaskTypeEditForm.Kind.COMMON.equals(taskTypeEditForm.getKind())) {
                taskType.setSubdepartment(null);
            } else {
                taskType.setSubdepartment(subdepartment);
            }
            taskType.setName(taskTypeEditForm.getName());
            taskType.setIsActive(taskTypeEditForm.getIsActive());
            taskType.setIsInternal(taskTypeEditForm.getIsInternal());
            hs.save(taskType);
            %>
            {
            "status": "OK"
            }
            <%
        }
    } else if(TaskTypeEditForm.Mode.UPDATE.equals(taskTypeEditForm.getMode())) {
        TaskType taskType = (TaskType)hs.get(TaskType.class, new Long(taskTypeEditForm.getId()));
        Integer sameNameTaskTypesCount = 0;
        for(TaskType taskTypeTmp : TaskType.getByName(taskTypeEditForm.getName(), taskType.getSubdepartment())) {
            if(taskTypeTmp.getId() != taskType.getId()) {
                sameNameTaskTypesCount++;
            }
        }
        if(sameNameTaskTypesCount > 0) {
            %>{"status": "FAIL", "comment": "Task Type with the same Name already exists"}<%
        } else {
            if(TaskTypeEditForm.Kind.COMMON.equals(taskTypeEditForm.getKind())) {
                taskType.setSubdepartment(null);
            } else {
            }
            taskType.setName(taskTypeEditForm.getName());
            taskType.setIsActive(taskTypeEditForm.getIsActive());
            taskType.setIsInternal(taskTypeEditForm.getIsInternal());
            hs.save(taskType);
            %>
            {
            "status": "OK"
            }
            <%
        }
    }
} else if("deleteTaskType".equals(command)) {
    TaskType taskType = (TaskType)hs.get(TaskType.class, new Long(request.getParameter("id")));
    hs.delete(taskType);
    %>
    {
    "status": "OK"
    }
    <%
} else if("checkTaskTypeDependencies".equals(command)) {
    TaskType taskType = (TaskType)hs.get(TaskType.class, new Long(request.getParameter("id")));
    %>{
    "status": "OK",
    "tasks": <%=taskType.getTasks().size() %>
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