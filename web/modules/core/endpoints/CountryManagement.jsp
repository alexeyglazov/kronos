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
    import="com.mazars.management.web.vo.*"
    import="com.mazars.management.web.comparators.PositionWithStandardPositionComparator"
    import="java.util.Collections"    
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

hs.refresh(currentUser);
if("getCurrentCountry".equals(command)) {
    Country country = currentUser.getCountry();
    %>
    {
    "status": "OK",
    "country": <% gson.toJson(new CountryVO(country), out); %>
    }
    <%
} else if("getCountries".equals(command)) {
    List<CountryVO> countryVOs = new LinkedList<CountryVO>();
    List<Country> countries = Country.getAll();
    Collections.sort(countries, new CountryComparator());
    for(Country country : countries) {
        countryVOs.add(new CountryVO(country));
    }
    %>
    {
    "status": "OK",
    "countries": <% gson.toJson(countryVOs, out); %>
    }
    <%
} else if("getGroups".equals(command)) {
    Country userCountry = currentUser.getCountry();
    List<GroupVO> groupVOs = new LinkedList<GroupVO>();
    List<Group> groups = new LinkedList<Group>(userCountry.getGroups());
    Collections.sort(groups, new GroupComparator());
    for(Group group : groups) {
        groupVOs.add(new GroupVO(group));
    }
    %>
    {
    "status": "OK",
    "groups": <% gson.toJson(groupVOs, out); %>
    }
    <%
} else if("getCommonTaskTypes".equals(command)) {
    List<TaskTypeVO> commonTaskTypeVOs = new LinkedList<TaskTypeVO>();
    List<TaskType> commonTaskTypes = TaskType.getCommonTaskTypes();
    Collections.sort(commonTaskTypes, new TaskTypeComparator());
    for(TaskType commonTaskType : commonTaskTypes) {
        commonTaskTypeVOs.add(new TaskTypeVO(commonTaskType));
    }
    %>
    {
    "status": "OK",
    "commonTaskTypes": <% gson.toJson(commonTaskTypeVOs, out); %>
    }
    <%
} else if("getStandardPositions".equals(command)) {
    List<StandardPositionVO> standardPositionVOs = new LinkedList<StandardPositionVO>();
    List<StandardPosition> standardPositions = StandardPosition.getAll();
    Collections.sort(standardPositions, new StandardPositionComparator());
    for(StandardPosition standardPosition : standardPositions) {
        standardPositionVOs.add(new StandardPositionVO(standardPosition));
    }
    %>{"standardPositions": <% gson.toJson(standardPositionVOs, out); %>}<%
} else if("getModules".equals(command)) {
    List<ModuleVO> moduleVOs = new LinkedList<ModuleVO>();
    List<Module> modules = Module.getAll();
    Collections.sort(modules, new ModuleComparator());
    for(Module moduleTmp : modules) {
        moduleVOs.add(new ModuleVO(moduleTmp));
    }
    %>
    {
    "status": "OK",
    "modules": <% gson.toJson(moduleVOs, out); %>
    }
    <%
} else if("getCountryInfo".equals(command)) {
    hs.refresh(currentUser);
    Country country = currentUser.getCountry();
    CountryVO countryVO = new CountryVO(country);   
    List<Office> offices = new LinkedList<Office>(country.getOffices());
    Collections.sort(offices, new OfficeComparator());
    List<OfficeVO> officeVOs = OfficeVO.getList(offices);
    %>
    {
        "status": "OK",
        "country": <% gson.toJson(countryVO, out); %>,
        "offices": <% gson.toJson(officeVOs, out); %>
    }<%
} else if("getOfficeInfo".equals(command)) {
    Office office = (Office)hs.createQuery("from Office where id=?").setLong(0, new Long(request.getParameter("id"))).uniqueResult();
    OfficeVO officeVO = new OfficeVO(office);
    List<DepartmentVO> departmentVOs = new LinkedList<DepartmentVO>();
    List<Department> departments = new LinkedList<Department>(office.getDepartments());
    Collections.sort(departments, new DepartmentComparator());
    for(Department department : departments) {
        departmentVOs.add(new DepartmentVO(department));
    }
    Country country = office.getCountry();
    %>
    {
        "status": "OK",
        "office": <% gson.toJson(officeVO, out); %>,
        "departments": <% gson.toJson(departmentVOs, out); %>,
        "path": {
            "country": <% gson.toJson(new CountryVO(country), out); %>
        }
    }<%
} else if("getDepartmentInfo".equals(command)) {
    Department department = (Department)hs.createQuery("from Department where id=?").setLong(0, new Long(request.getParameter("id"))).uniqueResult();
    DepartmentVO departmentVO = new DepartmentVO(department);
    List<SubdepartmentVO> subdepartmentVOs = new LinkedList<SubdepartmentVO>();
    List<Subdepartment> subdepartments = new LinkedList<Subdepartment>(department.getSubdepartments());
    Collections.sort(subdepartments, new SubdepartmentComparator());
    for(Subdepartment subdepartment : subdepartments) {
        subdepartmentVOs.add(new SubdepartmentVO(subdepartment));
    }
    Office office = department.getOffice();
    Country country = office.getCountry();
    %>
    {
        "status": "OK",
        "department": <% gson.toJson(departmentVO, out); %>,
        "subdepartments": <% gson.toJson(subdepartmentVOs, out); %>,
        "path": {
            "country": <% gson.toJson(new CountryVO(country), out); %>,
            "office": <% gson.toJson(new OfficeVO(office), out); %>
        }
    }<%
} else if("getSubdepartmentInfo".equals(command)) {
    Subdepartment subdepartment = (Subdepartment)hs.createQuery("from Subdepartment where id=?").setLong(0, new Long(request.getParameter("id"))).uniqueResult();
    SubdepartmentVO subdepartmentVO = new SubdepartmentVO(subdepartment);
    List<PositionWithStandardPositionVO> positionWithStandardPositionVOs = new LinkedList<PositionWithStandardPositionVO>();
    for(Position position : subdepartment.getPositions()) {
        positionWithStandardPositionVOs.add(new PositionWithStandardPositionVO(position, position.getStandardPosition()));
    }
    Collections.sort(positionWithStandardPositionVOs, new PositionWithStandardPositionComparator());
    List<TaskTypeVO> taskTypeVOs = new LinkedList<TaskTypeVO>();
    List<TaskType> taskTypes = new LinkedList<TaskType>(subdepartment.getTaskTypes());
    Collections.sort(taskTypes, new TaskTypeComparator());
    taskTypeVOs = TaskTypeVO.getList(taskTypes);
    List<ActivityVO> activityVOs = new LinkedList<ActivityVO>();
    List<Activity> activities = new LinkedList<Activity>(subdepartment.getActivities());
    Collections.sort(activities, new ActivityComparator());
    activityVOs = ActivityVO.getList(activities);
    List<PlanningTypeVO> planningTypeVOs = new LinkedList<PlanningTypeVO>();
    List<PlanningType> planningTypes = new LinkedList<PlanningType>(subdepartment.getPlanningTypes());
    Collections.sort(planningTypes, new PlanningTypeComparator());
    planningTypeVOs = PlanningTypeVO.getList(planningTypes);    
    List<ProjectCodeComment> projectCodeComments = new LinkedList<ProjectCodeComment>(subdepartment.getProjectCodeComments());
    Collections.sort(projectCodeComments, new ProjectCodeCommentComparator());
    List<ProjectCodeCommentVO> projectCodeCommentVOs = ProjectCodeCommentVO.getList(projectCodeComments);
    List<Subdepartment> checkedSubdepartments = SubdepartmentConflict.getCheckedSubdepartments(subdepartment);
    List<Subdepartment> checkingSubdepartments = SubdepartmentConflict.getCheckingSubdepartments(subdepartment);
    Set<SubdepartmentConflict> subdepartmentConflicts = new HashSet<SubdepartmentConflict>();
    subdepartmentConflicts.addAll(subdepartment.getCheckedSubdepartmentSubdepartmentConflicts());
    subdepartmentConflicts.addAll(subdepartment.getCheckingSubdepartmentSubdepartmentConflicts());
    List<OfficeDepartmentSubdepartment> checkedSubdepartmentVOs = OfficeDepartmentSubdepartment.getList(checkedSubdepartments);
    List<OfficeDepartmentSubdepartment> checkingSubdepartmentVOs = OfficeDepartmentSubdepartment.getList(checkingSubdepartments);
    List<SubdepartmentConflictVOH> subdepartmentConflictVOs = SubdepartmentConflictVOH.getList(new LinkedList<SubdepartmentConflict>(subdepartmentConflicts));
    
    Department department = subdepartment.getDepartment();
    Office office = department.getOffice();
    Country country = office.getCountry();
    %>
    {
        "status": "OK",
        "subdepartment": <% gson.toJson(subdepartmentVO, out); %>,
        "positions": <% gson.toJson(positionWithStandardPositionVOs, out); %>,
        "taskTypes": <% gson.toJson(taskTypeVOs, out); %>,
        "activities": <% gson.toJson(activityVOs, out); %>,
        "planningTypes": <% gson.toJson(planningTypeVOs, out); %>,
        "projectCodeComments": <% gson.toJson(projectCodeCommentVOs, out); %>,
        "checkedSubdepartments": <% gson.toJson(checkedSubdepartmentVOs, out); %>,
        "checkingSubdepartments": <% gson.toJson(checkingSubdepartmentVOs, out); %>,
        "subdepartmentConflicts": <% gson.toJson(subdepartmentConflictVOs, out); %>,
        "path": {
            "country": <% gson.toJson(new CountryVO(country), out); %>,
            "office": <% gson.toJson(new OfficeVO(office), out); %>,
            "department": <% gson.toJson(new DepartmentVO(department), out); %>
        }
    }<%
} else if("getActivityInfo".equals(command)) {
    Activity activity = (Activity)hs.createQuery("from Activity where id=?").setLong(0, new Long(request.getParameter("id"))).uniqueResult();
    ActivityVO activityVO = new ActivityVO(activity);
    List<ProjectCodeVO> projectCodeVOs = new LinkedList<ProjectCodeVO>();
    List<ProjectCode> projectCodes = new LinkedList<ProjectCode>(activity.getProjectCodes());
    Collections.sort(projectCodes, new ProjectCodeComparator());
    for(ProjectCode projectCode : projectCodes) {
        projectCodeVOs.add(new ProjectCodeVO(projectCode));
    }
    Subdepartment subdepartment = activity.getSubdepartment();
    Department department = subdepartment.getDepartment();
    Office office = department.getOffice();
    Country country = office.getCountry();
    %>
    {
        "status": "OK",
        "activity": <% gson.toJson(activityVO, out); %>,
        "projectCodes": <% gson.toJson(projectCodeVOs, out); %>,
        "path": {
            "country": <% gson.toJson(new CountryVO(country), out); %>,
            "office": <% gson.toJson(new OfficeVO(office), out); %>,
            "department": <% gson.toJson(new DepartmentVO(department), out); %>,
            "subdepartment": <% gson.toJson(new SubdepartmentVO(subdepartment), out); %>
        }
    }<%
} else if("getProjectCodeInfo".equals(command)) {
    ProjectCode projectCode = (ProjectCode)hs.get(ProjectCode.class, new Long(request.getParameter("id")));
    ProjectCodeVO projectCodeVO = new ProjectCodeVO(projectCode);
    Activity activity = projectCode.getActivity();
    Subdepartment subdepartment = activity.getSubdepartment();
    Department department = subdepartment.getDepartment();
    Office office = department.getOffice();
    Country country = office.getCountry();
    %>
    {
        "status": "OK",
        "projectCode": <% gson.toJson(projectCodeVO, out); %>,
        "path": {
            "country": <% gson.toJson(new CountryVO(country), out); %>,
            "office": <% gson.toJson(new OfficeVO(office), out); %>,
            "department": <% gson.toJson(new DepartmentVO(department), out); %>,
            "subdepartment": <% gson.toJson(new SubdepartmentVO(subdepartment), out); %>,
            "activity": <% gson.toJson(new ActivityVO(activity), out); %>
        }
    }<%
} else if("getTaskTypeInfo".equals(command)) {
    TaskType taskType = (TaskType)hs.get(TaskType.class, new Long(request.getParameter("id")));
    TaskTypeVOH taskTypeVO = new TaskTypeVOH(taskType);
    List<TaskVO> taskVOs = new LinkedList<TaskVO>();
    List<Task> tasks = new LinkedList<Task>(taskType.getTasks());
    Collections.sort(tasks, new TaskComparator());
    for(Task task : tasks) {
        taskVOs.add(new TaskVO(task));
    }
    Subdepartment subdepartment = taskType.getSubdepartment();
    if(subdepartment != null) {
        Department department = subdepartment.getDepartment();
        Office office = department.getOffice();
        Country country = office.getCountry();
        %>
        {
            "status": "OK",
            "taskType": <% gson.toJson(taskTypeVO, out); %>,
            "tasks": <% gson.toJson(taskVOs, out); %>,
            "path": {
                "country": <% gson.toJson(new CountryVO(country), out); %>,
                "office": <% gson.toJson(new OfficeVO(office), out); %>,
                "department": <% gson.toJson(new DepartmentVO(department), out); %>,
                "subdepartment": <% gson.toJson(new SubdepartmentVO(subdepartment), out); %>
            }
        }<%
    } else {
        %>
        {
            "status": "OK",
            "taskType": <% gson.toJson(taskTypeVO, out); %>,
            "tasks": <% gson.toJson(taskVOs, out); %>,
            "path": null
        }<%
    }
} else if("getTaskInfo".equals(command)) {
    Task task = (Task)hs.get(Task.class, new Long(request.getParameter("id")));
    TaskVO taskVO = new TaskVO(task);
    TaskType taskType = task.getTaskType();
    Subdepartment subdepartment = taskType.getSubdepartment();
    if(subdepartment != null) {
        Department department = subdepartment.getDepartment();
        Office office = department.getOffice();
        Country country = office.getCountry();
        %>
        {
            "status": "OK",
            "task": <% gson.toJson(taskVO, out); %>,
            "path": {
                "country": <% gson.toJson(new CountryVO(country), out); %>,
                "office": <% gson.toJson(new OfficeVO(office), out); %>,
                "department": <% gson.toJson(new DepartmentVO(department), out); %>,
                "subdepartment": <% gson.toJson(new SubdepartmentVO(subdepartment), out); %>,
                "taskType": <% gson.toJson(new TaskTypeVO(taskType), out); %>
            }
        }<%
    } else {
        %>
        {
            "status": "OK",
            "task": <% gson.toJson(taskVO, out); %>,
            "path": null
        }<%
    }
} else if("getPositionInfo".equals(command)) {
    Position position = (Position)hs.get(Position.class, new Long(request.getParameter("id")));
    PositionVOH positionVO = new PositionVOH(position);
    List<EmployeeWithoutPasswordVO> employeeVOs = new LinkedList<EmployeeWithoutPasswordVO>();
    List<Employee> employees = new LinkedList<Employee>(position.getEmployees());
    Collections.sort(employees, new EmployeeComparator());
    for(Employee employee : employees) {
        employeeVOs.add(new EmployeeWithoutPasswordVO(employee));
    }
    Subdepartment subdepartment = position.getSubdepartment();
    Department department = subdepartment.getDepartment();
    Office office = department.getOffice();
    Country country = office.getCountry();
    %>
    {
        "status": "OK",
        "position": <% gson.toJson(positionVO, out); %>,
        "employees": <% gson.toJson(employeeVOs, out); %>,
        "path": {
            "country": <% gson.toJson(new CountryVO(country), out); %>,
            "office": <% gson.toJson(new OfficeVO(office), out); %>,
            "department": <% gson.toJson(new DepartmentVO(department), out); %>,
            "subdepartment": <% gson.toJson(new SubdepartmentVO(subdepartment), out); %>
        }
    }<%
} else if("getPlanningTypeInfo".equals(command)) {
    PlanningType planningType = (PlanningType)hs.get(PlanningType.class, new Long(request.getParameter("id")));
    PlanningTypeVOH planningTypeVO = new PlanningTypeVOH(planningType);
    Subdepartment subdepartment = planningType.getSubdepartment();
    Department department = subdepartment.getDepartment();
    Office office = department.getOffice();
    Country country = office.getCountry();
    %>
    {
        "status": "OK",
        "planningType": <% gson.toJson(planningTypeVO, out); %>,
        "path": {
            "country": <% gson.toJson(new CountryVO(country), out); %>,
            "office": <% gson.toJson(new OfficeVO(office), out); %>,
            "department": <% gson.toJson(new DepartmentVO(department), out); %>,
            "subdepartment": <% gson.toJson(new SubdepartmentVO(subdepartment), out); %>
        }
    }<%
} else if("saveSortedPositions".equals(command)) {
    List<Long> positionIds = ListOfLong.getFromJson(request.getParameter("positionIds")).getList();
    Integer sortValue = 0;
    for(Long id : positionIds) {
        Position position = (Position)hs.get(Position.class, id);
        position.setSortValue(sortValue);
        hs.save(position);
        sortValue++;
    }
    %>
    {
        "status": "OK"
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