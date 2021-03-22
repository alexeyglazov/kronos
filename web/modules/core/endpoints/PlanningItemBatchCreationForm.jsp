<%-- 
    Document   : subdepartments
    Created on : 31.03.2011, 13:08:03
    Author     : glazov
--%><%@page import="java.util.Set"%>
<%@page import="java.io.PrintWriter"%>
<%@page import="com.mazars.management.db.comparators.TaskComparator"%>
<%@page import="com.mazars.management.db.comparators.TaskTypeComparator"%>
<%@page import="java.util.Collections"%>
<%@page import="com.mazars.management.db.comparators.PlanningTypeComparator"%>
<%@page import="com.mazars.management.web.vo.PlanningToolInfo"%>
<%@page import="com.mazars.management.db.util.PlanningItemUtil"%>
<%@page import="com.mazars.management.service.PlanningLockSubdepartmentManager"%>
<%@page import="java.util.Map"%>
<%@page import="java.util.HashMap"%>
<%@page contentType="text/html" pageEncoding="UTF-8"
    import="java.util.List"
    import="java.util.LinkedList"
    import="java.util.Locale"
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
Module module = Module.getByName("Planning Write");

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
if("getInitialContent".equals(command)) {
    if(request.getParameter("subdepartmentId") != null) {
        Subdepartment subdepartment = (Subdepartment)hs.get(Subdepartment.class, new Long(request.getParameter("subdepartmentId")));
        List<PlanningType> planningTypes = new LinkedList<PlanningType>(subdepartment.getPlanningTypes());
        Collections.sort(planningTypes, new PlanningTypeComparator());
        List<PlanningTypeVO> planningTypeVOs = PlanningTypeVO.getList(planningTypes);
        List<TaskType> taskTypes = new LinkedList<TaskType>();
        taskTypes.addAll(TaskType.getCommonTaskTypes());
        for(TaskType taskType : subdepartment.getTaskTypes()) {
            if(taskType.getIsInternal()) {
                taskTypes.add(taskType);
            }
        }
        Collections.sort(taskTypes, new TaskTypeComparator());
        List<TaskTypeVO> taskTypeVOs = TaskTypeVO.getList(taskTypes); 
        %>
        {
        "status": "OK",
        "planningTypes": <% gson.toJson(planningTypeVOs, out); %>,
        "taskTypes": <% gson.toJson(taskTypeVOs, out); %>
        }
        <%
    } else {
        PlanningGroup planningGroup = (PlanningGroup)hs.get(PlanningGroup.class, new Long(request.getParameter("planningGroupId")));
        Subdepartment subdepartment = planningGroup.getTargetSubdepartment();
        List<PlanningType> planningTypes = new LinkedList<PlanningType>(subdepartment.getPlanningTypes());
        Collections.sort(planningTypes, new PlanningTypeComparator());
        List<PlanningTypeVO> planningTypeVOs = PlanningTypeVO.getList(planningTypes);
        List<TaskType> taskTypes = new LinkedList<TaskType>();
        taskTypes.addAll(TaskType.getCommonTaskTypes());
        for(TaskType taskType : subdepartment.getTaskTypes()) {
            if(taskType.getIsInternal()) {
                taskTypes.add(taskType);
            }
        }
        Collections.sort(taskTypes, new TaskTypeComparator());
        List<TaskTypeVO> taskTypeVOs = TaskTypeVO.getList(taskTypes);
        Long taskTypeId = null;
        List<TaskVO> taskVOs = new LinkedList<TaskVO>();
        if(planningGroup.getTask() != null) {
            TaskType taskType = planningGroup.getTask().getTaskType();
            taskTypeId = taskType.getId();
            List<Task> tasks = new LinkedList<Task>(taskType.getTasks());
            Collections.sort(tasks, new TaskComparator());
            taskVOs = TaskVO.getList(tasks);
        }        
        %>
        {
        "status": "OK",
        "planningTypes": <% gson.toJson(planningTypeVOs, out); %>,
        "taskTypes": <% gson.toJson(taskTypeVOs, out); %>,
        "taskTypeId": <%=taskTypeId %>,
        "tasks": <% gson.toJson(taskVOs, out); %>
        }
        <%         
    }    
} else if("getTargetSubdepartmentContent".equals(command)) {
    Subdepartment subdepartment = (Subdepartment)hs.get(Subdepartment.class, new Long(request.getParameter("subdepartmentId")));
    List<PlanningType> planningTypes = new LinkedList<PlanningType>(subdepartment.getPlanningTypes());
    Collections.sort(planningTypes, new PlanningTypeComparator());
    List<PlanningTypeVO> planningTypeVOs = PlanningTypeVO.getList(planningTypes);
    List<TaskType> taskTypes = new LinkedList<TaskType>();
    taskTypes.addAll(TaskType.getCommonTaskTypes());
    for(TaskType taskType : subdepartment.getTaskTypes()) {
        if(taskType.getIsInternal()) {
            taskTypes.add(taskType);
        }
    }
    Collections.sort(taskTypes, new TaskTypeComparator());
    List<TaskTypeVO> taskTypeVOs = TaskTypeVO.getList(taskTypes);    
    %>
    {
    "status": "OK",
    "planningTypes": <% gson.toJson(planningTypeVOs, out); %>,
    "taskTypes": <% gson.toJson(taskTypeVOs, out); %>
    }
    <%    
} else if("getTaskTypeContent".equals(command)) {
    TaskType taskType = (TaskType)hs.get(TaskType.class, new Long(request.getParameter("taskTypeId")));
    List<Task> tasks = new LinkedList<Task>(taskType.getTasks());
    Collections.sort(tasks, new TaskComparator());
    List<TaskVO> taskVOs = TaskVO.getList(tasks);  
    %>
    {
    "status": "OK",
    "tasks": <% gson.toJson(taskVOs, out); %>
    }
    <%    
} else if("savePlanningItemBatch".equals(command)) {
    PlanningItemsBatchCreationForm planningItemsBatchCreationForm = PlanningItemsBatchCreationForm.getFromJson(request.getParameter("planningItemsBatchCreationForm"));

    Subdepartment targetSubdepartment = null;
    if(planningItemsBatchCreationForm.getTargetSubdepartmentId() != null) {
        targetSubdepartment = (Subdepartment)hs.get(Subdepartment.class, planningItemsBatchCreationForm.getTargetSubdepartmentId());
    }   
    PlanningLockSubdepartmentManager planningLockSubdepartmentManager = PlanningLockSubdepartmentManager.getInstance();
    PlanningLockSubdepartmentManager.Item lockItem = planningLockSubdepartmentManager.findItem(targetSubdepartment);
    if(lockItem == null || ! lockItem.getEmployee().getId().equals(currentUser.getId())) {
        throw (new Exception("Subdepartment " + targetSubdepartment.getName() + " is not locked"));
    }
    PlanningGroup planningGroup = null;
    if(PlanningItemsBatchCreationForm.Mode.CREATE.equals(planningItemsBatchCreationForm.getMode())) {
        planningGroup = new PlanningGroup();
    } else if(PlanningItemsBatchCreationForm.Mode.UPDATE.equals(planningItemsBatchCreationForm.getMode())) {
        planningGroup = (PlanningGroup)hs.get(PlanningGroup.class, planningItemsBatchCreationForm.getId());
    }
    Client client = null;
    Task task = null;
    Employee inChargePerson = null;
    PlanningType planningType = (PlanningType)hs.get(PlanningType.class, planningItemsBatchCreationForm.getPlanningTypeId());
    if(planningType.getIsInternal()) {
        if(planningItemsBatchCreationForm.getTaskId() != null) {
            task = (Task)hs.get(Task.class, planningItemsBatchCreationForm.getTaskId());
        }    
    } else {
        if(planningItemsBatchCreationForm.getClientId() != null) {
            client = (Client)hs.get(Client.class, planningItemsBatchCreationForm.getClientId());
        }
    }
    Boolean isApproved = false;
    if(Boolean.TRUE.equals(planningItemsBatchCreationForm.getIsApproved() ) ) {
        isApproved = true;
    }        
    if(planningItemsBatchCreationForm.getInChargePersonId() != null) {
        inChargePerson = (Employee)hs.get(Employee.class, planningItemsBatchCreationForm.getInChargePersonId());
    }        
    planningGroup.setPlanningType(planningType);
    planningGroup.setDescription(planningItemsBatchCreationForm.getDescription());
    planningGroup.setIsApproved(isApproved);
    planningGroup.setTargetSubdepartment(targetSubdepartment);
    planningGroup.setClient(client);
    planningGroup.setInChargePerson(inChargePerson);
    planningGroup.setTask(task);
    hs.save(planningGroup);
    
    if(PlanningItemsBatchCreationForm.Mode.UPDATE.equals(planningItemsBatchCreationForm.getMode())) {
        for(PlanningItem planningItem : planningGroup.getPlanningItems()) {
            boolean found = false;
            for(PlanningItemsBatchCreationForm.Item item : planningItemsBatchCreationForm.getItems()) {
                if(planningItem.getId().equals(item.getId()) ) {
                    found = true;
                    break;
                }
            }
            if(! found) {
                hs.delete(planningItem);
            }
        }
    }
    
    for(PlanningItemsBatchCreationForm.Item item : planningItemsBatchCreationForm.getItems()) {
        Employee employee = null;
        Subdepartment sourceSubdepartment = null;

        if(item.getEmployeeId() != null) {
            employee = (Employee)hs.get(Employee.class, item.getEmployeeId());
        }
        if(item.getSourceSubdepartmentId() != null) {
            sourceSubdepartment = (Subdepartment)hs.get(Subdepartment.class, item.getSourceSubdepartmentId());
        }
        PlanningItem planningItem = new PlanningItem();
        if(PlanningItemsBatchCreationForm.Mode.UPDATE.equals(planningItemsBatchCreationForm.getMode()) && item.getId() != null) {
            planningItem = (PlanningItem)hs.get(PlanningItem.class, item.getId());
        }
        planningItem.setPlanningGroup(planningGroup);
        planningItem.setEmployee(employee);
        planningItem.setTargetSubdepartment(targetSubdepartment);
        planningItem.setSourceSubdepartment(sourceSubdepartment);
        planningItem.setPlanningGroup(planningGroup);
        planningItem.setDescription(item.getDescription());
        planningItem.setLocation(item.getLocation());
        planningItem.setStartDate(item.getStartDate().getCalendar());
        planningItem.setEndDate(item.getEndDate().getCalendar());  
        hs.save(planningItem);
    }    
    
    if(Boolean.TRUE.equals(planningType.getIsInternal())) {
        for(PlanningGroupToProjectCodeLink planningGroupToProjectCodeLink : planningGroup.getPlanningGroupToProjectCodeLinks()) {
            hs.delete(planningGroupToProjectCodeLink);
        }        
    } else {
        if(PlanningItemsBatchCreationForm.Mode.UPDATE.equals(planningItemsBatchCreationForm.getMode())) {
            for(PlanningGroupToProjectCodeLink planningGroupToProjectCodeLink : planningGroup.getPlanningGroupToProjectCodeLinks()) {
                boolean found = false;
                for(Long projectCodeId : planningItemsBatchCreationForm.getProjectCodeIds()) {
                    if(planningGroupToProjectCodeLink.getProjectCode().getId().equals(projectCodeId) ) {
                        found = true;
                        break;
                    }
                }
                if(! found) {
                    hs.delete(planningGroupToProjectCodeLink);
                }
            }
        }
        for(Long projectCodeId : planningItemsBatchCreationForm.getProjectCodeIds()) {
            boolean found = false;
            for(PlanningGroupToProjectCodeLink planningGroupToProjectCodeLink : planningGroup.getPlanningGroupToProjectCodeLinks()) {
                if(planningGroupToProjectCodeLink.getProjectCode().getId().equals(projectCodeId) ) {
                    found = true;
                    break;
                }
            }
            if(! found) {
                ProjectCode projectCode = (ProjectCode)hs.get(ProjectCode.class, projectCodeId);
                PlanningGroupToProjectCodeLink planningGroupToProjectCodeLink = new PlanningGroupToProjectCodeLink();
                planningGroupToProjectCodeLink.setPlanningGroup(planningGroup);
                planningGroupToProjectCodeLink.setProjectCode(projectCode);
                hs.save(planningGroupToProjectCodeLink);
            }
        }    
    }
    
    List<PlanningItemUtil.DescribedPlanningItem> describedPlanningItems = PlanningItemUtil.getDescribedPlanningItemsByPlanningGroup(planningGroup);
    PlanningToolInfo planningToolInfo = new PlanningToolInfo();
    planningToolInfo.addDescribedPlanningItems(describedPlanningItems);    
    %>
    {
    "status": "OK",
    "planningToolInfo": <% gson.toJson(planningToolInfo, out); %>
    }
    <%
} else if("checkPlanningGroupDependencies".equals(command)) {
    PlanningGroup planningGroup = (PlanningGroup)hs.get(PlanningGroup.class, new Long(request.getParameter("id")));
    Set<PlanningItem> planningItems = planningGroup.getPlanningItems();
    %>
    {
    "status": "OK",
    "planningItemsCount": <%=planningItems.size() %>
    }
    <%
} else if("deletePlanningGroup".equals(command)) {
    PlanningGroup planningGroup = (PlanningGroup)hs.get(PlanningGroup.class, new Long(request.getParameter("id")));
    List<PlanningItem> planningItems = new LinkedList<PlanningItem>(planningGroup.getPlanningItems());
    for(PlanningItem planningItem : planningItems) {
        hs.delete(planningItem);
    }
    hs.delete(planningGroup);
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