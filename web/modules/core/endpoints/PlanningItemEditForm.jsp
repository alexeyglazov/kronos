<%-- 
    Document   : subdepartments
    Created on : 31.03.2011, 13:08:03
    Author     : glazov
--%><%@page import="com.mazars.management.db.comparators.ActivityComparator"%>
<%@page import="com.mazars.management.db.comparators.TaskTypeComparator"%>
<%@page import="com.mazars.management.db.comparators.TaskComparator"%>
<%@page import="com.mazars.management.db.comparators.PlanningTypeComparator"%>
<%@page import="java.util.Collections"%>
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
    Subdepartment subdepartment = (Subdepartment)hs.get(Subdepartment.class, new Long(request.getParameter("subdepartmentId")));
    List<PlanningType> planningTypes = new LinkedList<PlanningType>(subdepartment.getPlanningTypes());
    Collections.sort(planningTypes, new PlanningTypeComparator());
    List<PlanningTypeVO> planningTypeVOs = PlanningTypeVO.getList(planningTypes);
    List<Activity> activities = new LinkedList<Activity>(subdepartment.getActivities());
    Collections.sort(activities, new ActivityComparator());
    List<ActivityVO> activityVOs = ActivityVO.getList(activities);
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
    "activities": <% gson.toJson(activityVOs, out); %>,
    "taskTypes": <% gson.toJson(taskTypeVOs, out); %>
    }
    <%    
} else if("getTargetSubdepartmentContent".equals(command)) {
    Subdepartment subdepartment = (Subdepartment)hs.get(Subdepartment.class, new Long(request.getParameter("subdepartmentId")));
    List<PlanningType> planningTypes = new LinkedList<PlanningType>(subdepartment.getPlanningTypes());
    Collections.sort(planningTypes, new PlanningTypeComparator());
    List<PlanningTypeVO> planningTypeVOs = PlanningTypeVO.getList(planningTypes);
    List<Activity> activities = new LinkedList<Activity>(subdepartment.getActivities());
    Collections.sort(activities, new ActivityComparator());
    List<ActivityVO> activityVOs = ActivityVO.getList(activities);
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
    "activities": <% gson.toJson(activityVOs, out); %>,
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
} else if("savePlanningItem".equals(command)) {
    PlanningItemEditForm planningItemEditForm = PlanningItemEditForm.getFromJson(request.getParameter("planningItemEditForm"));
    Employee employee = null;
    Subdepartment targetSubdepartment = null;
    Subdepartment sourceSubdepartment = null;

    if(planningItemEditForm.getEmployeeId() != null) {
        employee = (Employee)hs.get(Employee.class, planningItemEditForm.getEmployeeId());
    }
    if(planningItemEditForm.getTargetSubdepartmentId() != null) {
        targetSubdepartment = (Subdepartment)hs.get(Subdepartment.class, planningItemEditForm.getTargetSubdepartmentId());
    }
    if(planningItemEditForm.getSourceSubdepartmentId() != null) {
        sourceSubdepartment = (Subdepartment)hs.get(Subdepartment.class, planningItemEditForm.getSourceSubdepartmentId());
    }

    PlanningLockSubdepartmentManager planningLockSubdepartmentManager = PlanningLockSubdepartmentManager.getInstance();
    PlanningLockSubdepartmentManager.Item item = planningLockSubdepartmentManager.findItem(targetSubdepartment);
    if(item == null || ! item.getEmployee().getId().equals(currentUser.getId())) {
        throw (new Exception("Subdepartment " + targetSubdepartment.getName() + " is not locked"));
    }

    
    PlanningGroup planningGroup = null;
    if(PlanningItemEditForm.Type.CREATE.equals(planningItemEditForm.getPlanningGroupCreationType()) ) {
        Client client = null;
        Activity activity = null;
        Task task = null;
        Employee inChargePerson = null;
        PlanningType planningType = (PlanningType)hs.get(PlanningType.class, planningItemEditForm.getPlanningTypeId());
        if(! planningType.getIsInternal()) {
            if(planningItemEditForm.getClientId() != null) {
                client = (Client)hs.get(Client.class, planningItemEditForm.getClientId());
            }
            if(planningItemEditForm.getActivityId() != null) {
                activity = (Activity)hs.get(Activity.class, planningItemEditForm.getActivityId());
            }
        } else {
            if(planningItemEditForm.getTaskId() != null) {
                task = (Task)hs.get(Task.class, planningItemEditForm.getTaskId());
            }        
        }
        Boolean isApproved = false;
        if(Boolean.TRUE.equals(planningItemEditForm.getIsApproved() ) ) {
            isApproved = true;
        }        
        if(planningItemEditForm.getInChargePersonId() != null) {
            inChargePerson = (Employee)hs.get(Employee.class, planningItemEditForm.getInChargePersonId());
        } 
        planningGroup = new PlanningGroup();
        planningGroup.setPlanningType(planningType);
        planningGroup.setDescription(planningItemEditForm.getPlanningGroupDescription());
        planningGroup.setIsApproved(isApproved);
        planningGroup.setTargetSubdepartment(targetSubdepartment);
        planningGroup.setClient(client);
        planningGroup.setInChargePerson(inChargePerson);
        //planningGroup.setActivity(activity);
        planningGroup.setTask(task);
        hs.save(planningGroup);
    } else if(PlanningItemEditForm.Type.EXISTING.equals(planningItemEditForm.getPlanningGroupCreationType()) ) {
        planningGroup = (PlanningGroup)hs.get(PlanningGroup.class, planningItemEditForm.getPlanningGroupId());
    }    
    PlanningItem planningItem = null;
    if(PlanningItemEditForm.Mode.CREATE.equals(planningItemEditForm.getMode())) {
        planningItem = new PlanningItem();
    } else if(PlanningItemEditForm.Mode.UPDATE.equals(planningItemEditForm.getMode())) {
        planningItem = (PlanningItem)hs.get(PlanningItem.class, new Long(planningItemEditForm.getId()));
    }
    planningItem.setEmployee(employee);
    planningItem.setTargetSubdepartment(targetSubdepartment);
    planningItem.setSourceSubdepartment(sourceSubdepartment);
    planningItem.setPlanningGroup(planningGroup);
    planningItem.setDescription(planningItemEditForm.getDescription());
    planningItem.setLocation(planningItemEditForm.getLocation());
    planningItem.setStartDate(planningItemEditForm.getStartDate().getCalendar());
    planningItem.setEndDate(planningItemEditForm.getEndDate().getCalendar());    
    hs.save(planningItem);
    
    List<Long> planningItemIds = new LinkedList<Long>();
    planningItemIds.add(planningItem.getId());
    List<PlanningItemUtil.DescribedPlanningItem> describedPlanningItems = null;
    describedPlanningItems = PlanningItemUtil.getDescribedPlanningItemsByIds(planningItemIds);   

    PlanningToolInfo planningToolInfo = new PlanningToolInfo();
    planningToolInfo.addDescribedPlanningItems(describedPlanningItems);    

    %>
    {
    "status": "OK",
    "planningToolInfo": <% gson.toJson(planningToolInfo, out); %>
    }
    <%
} else if("checkPlanningItemDependencies".equals(command)) {
    PlanningItem planningItem = (PlanningItem)hs.get(PlanningItem.class, new Long(request.getParameter("id")));
    %>
    {
    "status": "OK"
    }
    <%
} else if("deletePlanningItem".equals(command)) {
    PlanningItem planningItem = (PlanningItem)hs.get(PlanningItem.class, new Long(request.getParameter("id")));
    hs.delete(planningItem);
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