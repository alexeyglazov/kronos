<%-- 
    Document   : subdepartments
    Created on : 31.03.2011, 13:08:03
    Author     : glazov
--%>
<%@page import="java.io.PrintWriter"%>
<%@page import="java.io.PrintStream"%>
<%@page import="com.mazars.management.db.util.BusinessTripItemUtil"%>
<%@page import="com.mazars.management.db.util.TimeSpentItemUtil"%>
<%@page import="com.mazars.management.db.util.CalendarUtil"%>
<%@page contentType="text/html" pageEncoding="UTF-8"
    import="java.util.*"
    import="com.mazars.management.db.domain.*"
    import="com.mazars.management.db.vo.*"
    import="com.mazars.management.web.forms.*"
    import="com.mazars.management.web.vo.*"
    import="com.mazars.management.db.util.HibernateUtil"
    import="org.hibernate.Session"
    import="com.google.gson.Gson"
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
Module module = Module.getByName("Timesheets");

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
if("getMinYear".equals(command)) {
    Integer minYear = TimeSpentItem.getMinYear();
    %>
    {
    "status": "OK",
    "minYear": <%=minYear %>
    }
    <%
} else if("getInfo".equals(command)) {
    int year = Integer.parseInt(request.getParameter("year"));
    int month = Integer.parseInt(request.getParameter("month"));

    List<TimeSpentItemUtil.DescribedTimeSpentItem> describedTimeSpentItems = TimeSpentItemUtil.getDescribedTimeSpentItems(currentUser, year, month);
    DescribedTimeSpentItemsInfo describedTimeSpentItemsInfo = new DescribedTimeSpentItemsInfo(describedTimeSpentItems);
    
    List<BusinessTripItemUtil.DescribedBusinessTripItem> describedBusinessTripItems = BusinessTripItemUtil.getDescribedBusinessTripItems(currentUser, year, month);
    DescribedBusinessTripItemsInfo describedBusinessTripItemsInfo = new DescribedBusinessTripItemsInfo(describedBusinessTripItems);
    
    Integer minYear = TimeSpentItem.getMinYear(); 
    Boolean isBusinessTrippable = currentUser.getDepartment().getIsBusinessTrippable();
    Country country = currentUser.getCountry();           
    boolean isMonthClosed = ClosedMonth.isMonthClosed(country, year, month);
    List<YearMonthDate> freedays = new LinkedList<YearMonthDate>();
    for(Freeday freeday : Freeday.getAllByCountryYearMonth(country, year, month)) {
        freedays.add(new YearMonthDate(freeday.getDate()));
    }
    
    YearMonthDateRange reportRange = new YearMonthDateRange(new YearMonthDate(CalendarUtil.getBeginDateForYearMonth(year, month)), new YearMonthDate(CalendarUtil.getEndDateForYearMonth(year, month)));
    List<YearMonthDateRange> emptyCareerRanges = EmployeePositionHistoryItem.getEmptyRanges(currentUser, reportRange);
%>
    {
    "status": "OK",
    "timeSpentItemsInfo": <% gson.toJson(describedTimeSpentItemsInfo, out);%>,
    "businessTripItemsInfo": <% gson.toJson(describedBusinessTripItemsInfo, out);%>,
    "isBusinessTrippable": <%=isBusinessTrippable %>,
    "isMonthClosed": <%=isMonthClosed %>,
    "freedays": <% gson.toJson(freedays, out); %>,
    "emptyCareerRanges": <% gson.toJson(emptyCareerRanges, out); %>
    }
    <%   
} else if("saveTimeSpentItems".equals(command)) {
    TimeSpentItemsForm timeSpentItemsForm = TimeSpentItemsForm.getFromJson(request.getParameter("timeSpentItemsForm"));
    Country country = currentUser.getCountry();           
    if(ClosedMonth.isMonthClosed(country, timeSpentItemsForm.getYear(), timeSpentItemsForm.getMonth())) {
        throw new Exception("This month is closed");
    } 
    if("update".equals(timeSpentItemsForm.getMode())) {
    }
    Task task = (Task)hs.get(Task.class, new Long(timeSpentItemsForm.getTaskId()));
    TaskType taskType = task.getTaskType();
    ProjectCode projectCode = null;
    if(! taskType.getIsInternal()) {
        projectCode = (ProjectCode)hs.get(ProjectCode.class, new Long(timeSpentItemsForm.getProjectCodeId()));
    }
    for(Integer dayOfMonth : timeSpentItemsForm.getDays()) {
        YearMonthDate yearMonthDate = new YearMonthDate(timeSpentItemsForm.getYear(), timeSpentItemsForm.getMonth(), dayOfMonth);
        Calendar day = yearMonthDate.getCalendar();
        if("update".equals(timeSpentItemsForm.getMode())) {
            for(TimeSpentItem timeSpentItem : TimeSpentItem.getAll(currentUser, task, projectCode, day)) {
                hs.delete(timeSpentItem);
            }
        }
        for(TimeSpentItemsForm.Item item : timeSpentItemsForm.getItems()) {
            if(item.getTimeSpent() > 0) {
                TimeSpentItem timeSpentItem = new TimeSpentItem();
                timeSpentItem.setEmployee(currentUser);
                timeSpentItem.setProjectCode(projectCode);
                timeSpentItem.setTask(task);
                timeSpentItem.setDescription(item.getDescription());
                timeSpentItem.setTimeSpent(item.getTimeSpent());
                timeSpentItem.setDay(day);
                timeSpentItem.setModifiedAt(new Date());
                hs.save(timeSpentItem);
            }
        }
        List<TimeSpentItem> timeSpentItems = TimeSpentItem.getAll(currentUser, projectCode, day);
        if(timeSpentItems.isEmpty()) {
            BusinessTripItem businessTripItem = BusinessTripItem.get(currentUser, projectCode, day);
            if(businessTripItem != null) {
                hs.delete(businessTripItem);
            }
        }
    }
    Calendar minDay = TimeSpentItem.getMinDay(projectCode);
    Calendar maxDay = TimeSpentItem.getMaxDay(projectCode);
    if((minDay != null && ! minDay.equals(projectCode.getStartDate())) || (maxDay != null && ! maxDay.equals(projectCode.getEndDate()))) {
        projectCode.setStartDate(minDay);
        projectCode.setEndDate(maxDay);
        hs.save(projectCode);
    }
    %>
    {
    "status" : "OK"
    }
    <%
} else if("getInitialContentToCreate".equals(command)) {
       List<OfficeVO> taskOfficeVOs = new LinkedList<OfficeVO>();
       List<DepartmentVO> taskDepartmentVOs = new LinkedList<DepartmentVO>();
       List<SubdepartmentVO> taskSubdepartmentVOs = new LinkedList<SubdepartmentVO>();

       List<OfficeVO> projectCodeOfficeVOs = new LinkedList<OfficeVO>();
       List<DepartmentVO> projectCodeDepartmentVOs = new LinkedList<DepartmentVO>();
       List<SubdepartmentVO> projectCodeSubdepartmentVOs = new LinkedList<SubdepartmentVO>();

       List<TaskTypeVO> taskTypeVOs = new LinkedList<TaskTypeVO>();
       List<ClientVO> clientVOs = new LinkedList<ClientVO>();

       Subdepartment currentSubdepartment = currentUser.getSubdepartment();
       Department currentDepartment = currentSubdepartment.getDepartment();
       Office currentOffice = currentDepartment.getOffice();

       List<Subdepartment> taskSubdepartments = new LinkedList<Subdepartment>();
       List<Department> taskDepartments = new LinkedList<Department>();
       List<Office> taskOffices = new LinkedList<Office>();
       List<Subdepartment> projectCodeSubdepartments = new LinkedList<Subdepartment>();
       List<Department> projectCodeDepartments = new LinkedList<Department>();
       List<Office> projectCodeOffices = new LinkedList<Office>();
       List<TaskType> taskTypes = new LinkedList<TaskType>();
       List<Client> clients = new LinkedList<Client>();

      
       Set<Office> tmpTaskOffices = new HashSet<Office>();
       tmpTaskOffices.addAll(EmployeeSubdepartmentHistoryItem.getCurrentOffices(currentUser, EmployeeSubdepartmentHistoryItem.Type.TASK_AND_PROJECT_ACCESS));
       tmpTaskOffices.add(currentOffice);
       //tmpTaskOffices.addAll(EmployeeProjectCodeAccessItem.getCurrentOffices(currentUser));
       taskOffices.addAll(tmpTaskOffices);
       Collections.sort(taskOffices, new OfficeComparator());
       taskOfficeVOs = OfficeVO.getList(taskOffices);

       if(taskOffices.size() == 1) {
           Set<Department> tmpTaskDepartments = new HashSet<Department>();
           tmpTaskDepartments.addAll(EmployeeSubdepartmentHistoryItem.getCurrentDepartments(currentUser, EmployeeSubdepartmentHistoryItem.Type.TASK_AND_PROJECT_ACCESS, taskOffices.get(0)));
            if(taskOffices.get(0).equals(currentOffice)) {
                tmpTaskDepartments.add(currentDepartment);
                //tmpTaskDepartments.addAll(EmployeeProjectCodeAccessItem.getCurrentDepartments(currentUser, currentOffice));
            }
            taskDepartments.addAll(tmpTaskDepartments);
            Collections.sort(taskDepartments, new DepartmentComparator());
            taskDepartmentVOs = DepartmentVO.getList(taskDepartments);
       }

        if(taskDepartments.size() == 1) {
           Set<Subdepartment> tmpTaskSubdepartments = new HashSet<Subdepartment>();
            tmpTaskSubdepartments.addAll(EmployeeSubdepartmentHistoryItem.getCurrentSubdepartments(currentUser, EmployeeSubdepartmentHistoryItem.Type.TASK_AND_PROJECT_ACCESS, taskDepartments.get(0)));
            if(taskDepartments.get(0).equals(currentDepartment)) {
                tmpTaskSubdepartments.add(currentSubdepartment);
                //tmpTaskSubdepartments.addAll(EmployeeProjectCodeAccessItem.getCurrentDepartments(currentUser, currentDepartment));
            }
            taskSubdepartments.addAll(tmpTaskSubdepartments);
            Collections.sort(taskSubdepartments, new SubdepartmentComparator());
            taskSubdepartmentVOs = SubdepartmentVO.getList(taskSubdepartments);
        }



        Set<Office> tmpProjectCodeOffices = new HashSet<Office>();
        tmpProjectCodeOffices.addAll(EmployeeSubdepartmentHistoryItem.getCurrentOffices(currentUser));
        tmpProjectCodeOffices.add(currentOffice);
        tmpProjectCodeOffices.addAll(EmployeeProjectCodeAccessItem.getCurrentOffices(currentUser));
        projectCodeOffices.addAll(tmpProjectCodeOffices);
        Collections.sort(projectCodeOffices, new OfficeComparator());
        projectCodeOfficeVOs = OfficeVO.getList(projectCodeOffices);

       if(projectCodeOffices.size() == 1) {
           Set<Department> tmpProjectCodeDepartments = new HashSet<Department>();
           tmpProjectCodeDepartments.addAll(EmployeeSubdepartmentHistoryItem.getCurrentDepartments(currentUser, projectCodeOffices.get(0)));
           tmpProjectCodeDepartments.addAll(EmployeeProjectCodeAccessItem.getCurrentDepartments(currentUser, projectCodeOffices.get(0)));
           if(projectCodeOffices.get(0).equals(currentOffice)) {
                tmpProjectCodeDepartments.add(currentDepartment);
           }
           projectCodeDepartments.addAll(tmpProjectCodeDepartments);
           Collections.sort(projectCodeDepartments, new DepartmentComparator());
           projectCodeDepartmentVOs = DepartmentVO.getList(projectCodeDepartments);
       }

        if(projectCodeDepartments.size() == 1) {
            Set<Subdepartment> tmpProjectCodeSubdepartments = new HashSet<Subdepartment>();
            tmpProjectCodeSubdepartments.addAll(EmployeeSubdepartmentHistoryItem.getCurrentSubdepartments(currentUser, projectCodeDepartments.get(0)));
            tmpProjectCodeSubdepartments.addAll(EmployeeProjectCodeAccessItem.getCurrentSubdepartments(currentUser, projectCodeDepartments.get(0)));
            if(projectCodeDepartments.get(0).equals(currentDepartment)) {
                tmpProjectCodeSubdepartments.add(currentSubdepartment);
            }
            projectCodeSubdepartments.addAll(tmpProjectCodeSubdepartments);
            Collections.sort(projectCodeSubdepartments, new SubdepartmentComparator());
            projectCodeSubdepartmentVOs = SubdepartmentVO.getList(projectCodeSubdepartments);
        }


        List<TaskType> tmpTaskTypes = new LinkedList<TaskType>();
        tmpTaskTypes.addAll(TaskType.getCommonTaskTypes());
        if(taskSubdepartments.size() == 1) {
            tmpTaskTypes.addAll(taskSubdepartments.get(0).getTaskTypes());
            //tmpTaskTypes.addAll(EmployeeProjectCodeAccessItem.getCurrentTaskTypesForOpenProjectCodes(currentUser, taskSubdepartments.get(0)) );
        }
        taskTypes.addAll(tmpTaskTypes);
        Collections.sort(taskTypes, new TaskTypeComparator());
        for(TaskType taskType : taskTypes) {
            if(Boolean.TRUE.equals(taskType.getIsActive())) {
             taskTypeVOs.add(new TaskTypeVO(taskType));
            }
        }

        Set<Client> tmpClients = new HashSet<Client>();
        if(projectCodeSubdepartments.size() == 1) {
            tmpClients.addAll(ProjectCode.getClientsForOpenProjectCodes(projectCodeSubdepartments.get(0)));
            tmpClients.addAll(EmployeeProjectCodeAccessItem.getCurrentClientsForOpenProjectCodes(currentUser, projectCodeSubdepartments.get(0)));
        }
        clients.addAll(tmpClients);
        Collections.sort(clients, new ClientComparator());
        clientVOs = ClientVO.getList(clients);
       %>
       {
       "status": "OK",
       "taskOffices":<% gson.toJson(taskOfficeVOs, out); %>,
       "taskDepartments":<% gson.toJson(taskDepartmentVOs, out); %>,
       "taskSubdepartments":<% gson.toJson(taskSubdepartmentVOs, out); %>,
       "taskTypes":<% gson.toJson(taskTypeVOs, out); %>,
       "projectCodeOffices":<% gson.toJson(projectCodeOfficeVOs, out); %>,
       "projectCodeDepartments":<% gson.toJson(projectCodeDepartmentVOs, out); %>,
       "projectCodeSubdepartments":<% gson.toJson(projectCodeSubdepartmentVOs, out); %>,
       "clients":<% gson.toJson(clientVOs, out); %>
       }
       <%
} else if("getInitialContentToUpdate".equals(command)) {
        Task task = (Task)hs.get(Task.class, new Long(request.getParameter("taskId")));
        TaskType taskType = task.getTaskType();
        Subdepartment taskSubdepartment = taskType.getSubdepartment();
        Integer year = Integer.parseInt(request.getParameter("year"));
        Integer month = Integer.parseInt(request.getParameter("month"));
        Integer dayOfMonth = Integer.parseInt(request.getParameter("dayOfMonth"));
        Calendar day = new YearMonthDate(year, month, dayOfMonth).getCalendar();
        Country country = currentUser.getCountry();
        boolean isMonthClosed = ClosedMonth.isMonthClosed(country, year, month);
        if(! taskType.getIsInternal()) {
            Department taskDepartment = taskSubdepartment.getDepartment();
            Office taskOffice = taskDepartment.getOffice();
            ProjectCode projectCode = (ProjectCode)hs.get(ProjectCode.class, new Long(request.getParameter("projectCodeId")));
            Client client = projectCode.getClient();
            Subdepartment projectCodeSubdepartment = projectCode.getSubdepartment();
            Department projectCodeDepartment = projectCodeSubdepartment.getDepartment();
            Office projectCodeOffice = projectCodeDepartment.getOffice();
            List<TimeSpentItem> timeSpentItems = TimeSpentItem.getAll(currentUser, task, projectCode, day);
            List<TimeSpentItemVO> timeSpentItemVOs = new LinkedList<TimeSpentItemVO>();
            for(TimeSpentItem timeSpentItem : timeSpentItems) {
                timeSpentItemVOs.add(new TimeSpentItemVO(timeSpentItem));
            }
           %>
           {
           "status": "OK",
           "client": <% gson.toJson(new ClientVO(client), out); %>,
           "projectCode": <% gson.toJson(new ProjectCodeVO(projectCode), out); %>,
           "taskSubdepartment":<% gson.toJson(new SubdepartmentVO(taskSubdepartment), out); %>,
           "taskDepartment":<% gson.toJson(new DepartmentVO(taskDepartment), out); %>,
           "taskOffice":<% gson.toJson(new OfficeVO(taskOffice), out); %>,
           "projectCodeSubdepartment":<% gson.toJson(new SubdepartmentVO(projectCodeSubdepartment), out); %>,
           "projectCodeDepartment":<% gson.toJson(new DepartmentVO(projectCodeDepartment), out); %>,
           "projectCodeOffice":<% gson.toJson(new OfficeVO(projectCodeOffice), out); %>,
           "taskType":<% gson.toJson(new TaskTypeVO(taskType), out); %>,
           "task":<% gson.toJson(new TaskVO(task), out); %>,
           "timeSpentItems": <% gson.toJson(timeSpentItemVOs, out); %>,
           "isMonthClosed": <%=isMonthClosed %>
           }
           <%
        } else {
            List<TimeSpentItem> timeSpentItems = TimeSpentItem.getAll(currentUser, task, null, day);
            List<TimeSpentItemVO> timeSpentItemVOs = new LinkedList<TimeSpentItemVO>();
            for(TimeSpentItem timeSpentItem : timeSpentItems) {
                timeSpentItemVOs.add(new TimeSpentItemVO(timeSpentItem));
            }
           %>
           {
           "status": "OK",
           <%
           if(taskSubdepartment != null) {
                Department taskDepartment = taskSubdepartment.getDepartment();
                Office taskOffice = taskDepartment.getOffice();
           %>
           "taskSubdepartment": <% gson.toJson(new SubdepartmentVO(taskSubdepartment), out); %>,
           "taskDepartment":<% gson.toJson(new DepartmentVO(taskDepartment), out); %>,
           "taskOffice":<% gson.toJson(new OfficeVO(taskOffice), out); %>,
           <% } else { %>
           "taskSubdepartment": null,
           "taskDepartment": null,
           "taskOffice": null,
           <% } %>
           "projectCodeSubdepartment": null,
           "taskType":<% gson.toJson(new TaskTypeVO(taskType), out); %>,
           "task":<% gson.toJson(new TaskVO(task), out); %>,
           "timeSpentItems": <% gson.toJson(timeSpentItemVOs, out); %>,
           "isMonthClosed": <%=isMonthClosed %>
           }
           <%
        }
} else if("getTaskOfficeContent".equals(command)) {
   Office office = (Office)hs.get(Office.class, new Long(request.getParameter("taskOfficeId")));
   List<DepartmentVO> taskDepartmentVOs = new LinkedList<DepartmentVO>();
   List<SubdepartmentVO> taskSubdepartmentVOs = new LinkedList<SubdepartmentVO>();
   List<TaskTypeVO> taskTypeVOs = new LinkedList<TaskTypeVO>();

   Subdepartment currentSubdepartment = currentUser.getSubdepartment();
   Department currentDepartment = currentSubdepartment.getDepartment();
   Office currentOffice = currentDepartment.getOffice();

   List<Subdepartment> taskSubdepartments = new LinkedList<Subdepartment>();
   List<Department> taskDepartments = new LinkedList<Department>();
   List<TaskType> taskTypes = new LinkedList<TaskType>();

    Set<Department> tmpTaskDepartments = new HashSet<Department>();
    tmpTaskDepartments.addAll(EmployeeSubdepartmentHistoryItem.getCurrentDepartments(currentUser, EmployeeSubdepartmentHistoryItem.Type.TASK_AND_PROJECT_ACCESS, office));
    if(office.equals(currentOffice)) {
         tmpTaskDepartments.add(currentDepartment);
    }
    taskDepartments.addAll(tmpTaskDepartments);
    Collections.sort(taskDepartments, new DepartmentComparator());
    taskDepartmentVOs = DepartmentVO.getList(taskDepartments);


    if(taskDepartments.size() == 1) {
        Set<Subdepartment> tmpTaskSubdepartments = new HashSet<Subdepartment>();
        tmpTaskSubdepartments.addAll(EmployeeSubdepartmentHistoryItem.getCurrentSubdepartments(currentUser, EmployeeSubdepartmentHistoryItem.Type.TASK_AND_PROJECT_ACCESS, taskDepartments.get(0)));
        if(taskDepartments.get(0).equals(currentDepartment)) {
             tmpTaskSubdepartments.add(currentSubdepartment);
        }
        taskSubdepartments.addAll(tmpTaskSubdepartments);
        Collections.sort(taskSubdepartments, new SubdepartmentComparator());
        taskSubdepartmentVOs = SubdepartmentVO.getList(taskSubdepartments);
    }
    
    Set<TaskType> tmpTaskTypes = new HashSet<TaskType>();
    tmpTaskTypes.addAll(TaskType.getCommonTaskTypes());
    if(taskSubdepartments.size() == 1) {
        tmpTaskTypes.addAll(taskSubdepartments.get(0).getTaskTypes());
    }
    taskTypes.addAll(tmpTaskTypes);
    Collections.sort(taskTypes, new TaskTypeComparator());
    for(TaskType taskType : taskTypes) {
        if(Boolean.TRUE.equals(taskType.getIsActive())) {
         taskTypeVOs.add(new TaskTypeVO(taskType));
        }
    }
   %>
   {
   "status": "OK",
   "taskDepartments":<% gson.toJson(taskDepartmentVOs, out); %>,
   "taskSubdepartments":<% gson.toJson(taskSubdepartmentVOs, out); %>,
   "taskTypes":<% gson.toJson(taskTypeVOs, out); %>
   }
   <%
} else if("getTaskDepartmentContent".equals(command)) {
   Department department = (Department)hs.get(Department.class, new Long(request.getParameter("taskDepartmentId")));
   List<SubdepartmentVO> taskSubdepartmentVOs = new LinkedList<SubdepartmentVO>();
   List<TaskTypeVO> taskTypeVOs = new LinkedList<TaskTypeVO>();

   Subdepartment currentSubdepartment = currentUser.getSubdepartment();
   Department currentDepartment = currentSubdepartment.getDepartment();

   List<Subdepartment> taskSubdepartments = new LinkedList<Subdepartment>();

   Set<Subdepartment> tmpTaskSubdepartments = new HashSet<Subdepartment>();
   tmpTaskSubdepartments.addAll(EmployeeSubdepartmentHistoryItem.getCurrentSubdepartments(currentUser, EmployeeSubdepartmentHistoryItem.Type.TASK_AND_PROJECT_ACCESS, department));
   if(department.equals(currentDepartment)) {
           tmpTaskSubdepartments.add(currentSubdepartment);
   }
   taskSubdepartments.addAll(tmpTaskSubdepartments);
   Collections.sort(taskSubdepartments, new SubdepartmentComparator());
    taskSubdepartmentVOs = SubdepartmentVO.getList(taskSubdepartments);

   List<TaskType> taskTypes = new LinkedList<TaskType>();
   Set<TaskType> tmpTaskTypes = new HashSet<TaskType>();
   tmpTaskTypes.addAll(TaskType.getCommonTaskTypes());
   if(taskSubdepartments.size() == 1) {
        tmpTaskTypes.addAll(taskSubdepartments.get(0).getTaskTypes());
   }
   taskTypes.addAll(tmpTaskTypes);
   Collections.sort(taskTypes, new TaskTypeComparator());
   for(TaskType taskType : taskTypes) {
       if(Boolean.TRUE.equals(taskType.getIsActive())) {
        taskTypeVOs.add(new TaskTypeVO(taskType));
       }
   }

   %>
   {
   "status": "OK",
   "taskSubdepartments":<% gson.toJson(taskSubdepartmentVOs, out); %>,
   "taskTypes":<% gson.toJson(taskTypeVOs, out); %>
   }
   <%
} else if("getTaskSubdepartmentContent".equals(command)) {
       Subdepartment subdepartment = (Subdepartment)hs.get(Subdepartment.class, new Long(request.getParameter("taskSubdepartmentId")));
       List<TaskTypeVO> taskTypeVOs = new LinkedList<TaskTypeVO>();

       List<TaskType> taskTypes = new LinkedList<TaskType>();
       Set<TaskType> tmpTaskTypes = new HashSet<TaskType>();
       tmpTaskTypes.addAll(subdepartment.getTaskTypes());
       tmpTaskTypes.addAll(TaskType.getCommonTaskTypes());
       taskTypes.addAll(tmpTaskTypes);
       Collections.sort(taskTypes, new TaskTypeComparator());
       for(TaskType taskType : taskTypes) {
           if(Boolean.TRUE.equals(taskType.getIsActive())) {
            taskTypeVOs.add(new TaskTypeVO(taskType));
           }
       }
       %>
       {
       "status": "OK",
       "taskTypes":<% gson.toJson(taskTypeVOs, out); %>
       }
       <%
} else if("getNullTaskSubdepartmentContent".equals(command)) {
       List<TaskTypeVO> taskTypeVOs = new LinkedList<TaskTypeVO>();
       List<TaskType> taskTypes = new LinkedList<TaskType>();
       Set<TaskType> tmpTaskTypes = new HashSet<TaskType>();
       tmpTaskTypes.addAll(TaskType.getCommonTaskTypes());
       taskTypes.addAll(tmpTaskTypes);
       Collections.sort(taskTypes, new TaskTypeComparator());
       for(TaskType taskType : taskTypes) {
           if(Boolean.TRUE.equals(taskType.getIsActive())) {
            taskTypeVOs.add(new TaskTypeVO(taskType));
           }
       }
       %>
       {
       "status": "OK",
       "taskTypes":<% gson.toJson(taskTypeVOs, out); %>
       }
       <%
} else if("getProjectCodeOfficeContent".equals(command)) {
   Office office = (Office)hs.get(Office.class, new Long(request.getParameter("projectCodeOfficeId")));
   List<DepartmentVO> projectCodeDepartmentVOs = new LinkedList<DepartmentVO>();
   List<SubdepartmentVO> projectCodeSubdepartmentVOs = new LinkedList<SubdepartmentVO>();
   List<ClientVO> clientVOs = new LinkedList<ClientVO>();

   Subdepartment currentSubdepartment = currentUser.getSubdepartment();
   Department currentDepartment = currentSubdepartment.getDepartment();
   Office currentOffice = currentDepartment.getOffice();

   List<Subdepartment> projectCodeSubdepartments = new LinkedList<Subdepartment>();
   List<Department> projectCodeDepartments = new LinkedList<Department>();

    Set<Department> tmpProjectCodeDepartments = new HashSet<Department>();
    tmpProjectCodeDepartments.addAll(EmployeeSubdepartmentHistoryItem.getCurrentDepartments(currentUser, office));
    tmpProjectCodeDepartments.addAll(EmployeeProjectCodeAccessItem.getCurrentDepartments(currentUser, office));
    if(office.equals(currentOffice)) {
        tmpProjectCodeDepartments.add(currentDepartment);
    }
    projectCodeDepartments.addAll(tmpProjectCodeDepartments);
    Collections.sort(projectCodeDepartments, new DepartmentComparator());
    projectCodeDepartmentVOs = DepartmentVO.getList(projectCodeDepartments);

    if(projectCodeDepartments.size() == 1) {
        Set<Subdepartment> tmpProjectCodeSubdepartments = new HashSet<Subdepartment>();
        tmpProjectCodeSubdepartments.addAll(EmployeeSubdepartmentHistoryItem.getCurrentSubdepartments(currentUser, projectCodeDepartments.get(0)));
        tmpProjectCodeSubdepartments.addAll(EmployeeProjectCodeAccessItem.getCurrentSubdepartments(currentUser, projectCodeDepartments.get(0)));
        if(projectCodeDepartments.get(0).equals(currentDepartment)) {
            tmpProjectCodeSubdepartments.add(currentSubdepartment);
        }
        projectCodeSubdepartments.addAll(tmpProjectCodeSubdepartments);
        Collections.sort(projectCodeSubdepartments, new SubdepartmentComparator());
        projectCodeSubdepartmentVOs = SubdepartmentVO.getList(projectCodeSubdepartments);
    }

    List<Client> clients = new LinkedList<Client>();
    Set<Client> tmpClients = new HashSet<Client>();
    if(projectCodeSubdepartments.size() == 1) {
        tmpClients.addAll(ProjectCode.getClientsForOpenProjectCodes(projectCodeSubdepartments.get(0)));
        tmpClients.addAll(EmployeeProjectCodeAccessItem.getCurrentClientsForOpenProjectCodes(currentUser, projectCodeSubdepartments.get(0)));
    }
    clients.addAll(tmpClients);
    Collections.sort(clients, new ClientComparator());
    clientVOs = ClientVO.getList(clients);

   %>
   {
   "status": "OK",
   "projectCodeDepartments":<% gson.toJson(projectCodeDepartmentVOs, out); %>,
   "projectCodeSubdepartments":<% gson.toJson(projectCodeSubdepartmentVOs, out); %>,
   "clients":<% gson.toJson(clientVOs, out); %>
   }
   <%
} else if("getProjectCodeDepartmentContent".equals(command)) {
   Department department = (Department)hs.get(Department.class, new Long(request.getParameter("projectCodeDepartmentId")));
   List<SubdepartmentVO> projectCodeSubdepartmentVOs = new LinkedList<SubdepartmentVO>();
   List<ClientVO> clientVOs = new LinkedList<ClientVO>();

   Subdepartment currentSubdepartment = currentUser.getSubdepartment();
   Department currentDepartment = currentSubdepartment.getDepartment();

   List<Subdepartment> projectCodeSubdepartments = new LinkedList<Subdepartment>();
   List<Client> clients = new LinkedList<Client>();

    Set<Subdepartment> tmpProjectCodeSubdepartments = new HashSet<Subdepartment>();
    tmpProjectCodeSubdepartments.addAll(EmployeeSubdepartmentHistoryItem.getCurrentSubdepartments(currentUser, department));
    tmpProjectCodeSubdepartments.addAll(EmployeeProjectCodeAccessItem.getCurrentSubdepartments(currentUser, department));
    if(department.getId().equals(currentDepartment.getId())) {
        tmpProjectCodeSubdepartments.add(currentSubdepartment);
    }
    projectCodeSubdepartments.addAll(tmpProjectCodeSubdepartments);
    Collections.sort(projectCodeSubdepartments, new SubdepartmentComparator());
    projectCodeSubdepartmentVOs = SubdepartmentVO.getList(projectCodeSubdepartments);

    Set<Client> tmpClients = new HashSet<Client>();
    if(projectCodeSubdepartments.size() == 1) {
        tmpClients.addAll(ProjectCode.getClientsForOpenProjectCodes(projectCodeSubdepartments.get(0)));
        tmpClients.addAll(EmployeeProjectCodeAccessItem.getCurrentClientsForOpenProjectCodes(currentUser, projectCodeSubdepartments.get(0)));        
    }
    clients.addAll(tmpClients);
    Collections.sort(clients, new ClientComparator());
    clientVOs = ClientVO.getList(clients);

   %>
   {
   "status": "OK",
   "projectCodeSubdepartments":<% gson.toJson(projectCodeSubdepartmentVOs, out); %>,
   "clients":<% gson.toJson(clientVOs, out); %>
   }
   <%
} else if("getProjectCodeSubdepartmentContent".equals(command)) {
        Subdepartment subdepartment = (Subdepartment)hs.get(Subdepartment.class, new Long(request.getParameter("projectCodeSubdepartmentId")));

        List<Client> clients = new LinkedList<Client>();
        Set<Client> tmpClients = new HashSet<Client>();
        tmpClients.addAll(ProjectCode.getClientsForOpenProjectCodes(subdepartment));
        tmpClients.addAll(EmployeeProjectCodeAccessItem.getCurrentClientsForOpenProjectCodes(currentUser, subdepartment));
        clients.addAll(tmpClients);
        Collections.sort(clients, new ClientComparator());
        List<ClientVO> clientVOs = ClientVO.getList(clients);
        %>
       {
       "status": "OK",
       "clients":<% gson.toJson(clientVOs, out); %>
       }
       <%
} else if("getTaskTypeContent".equals(command)) {
       TaskType taskType = (TaskType)hs.get(TaskType.class, new Long(request.getParameter("taskTypeId")));
       List<TaskVO> taskVOs = new LinkedList<TaskVO>();

        if(taskType != null) {
            List<Task> tasks = new LinkedList<Task>();
            Set<Task> tmpTasks = new HashSet<Task>();
            tmpTasks.addAll(taskType.getTasks());
            tasks.addAll(tmpTasks);
            Collections.sort(tasks, new TaskComparator());
            for(Task task : tasks) {
                if(Boolean.TRUE.equals(task.getIsActive())) {
                    taskVOs.add(new TaskVO(task));
                }
            }
        }
       %>
       {
       "status": "OK",
       "tasks":<% gson.toJson(taskVOs, out); %>
       }
       <%
} else if("getClientContent".equals(command)) {
        Client client = (Client)hs.get(Client.class, new Long(request.getParameter("clientId")));
        Subdepartment subdepartment = (Subdepartment)hs.get(Subdepartment.class, new Long(request.getParameter("projectCodeSubdepartmentId")));
        List<ProjectCode> projectCodes = new LinkedList<ProjectCode>();
        Set<ProjectCode> tmpProjectCodes = new HashSet<ProjectCode>();
        for(ProjectCode projectCode : ProjectCode.getOpenProjectCodes(subdepartment, client)) {
            if(! Boolean.TRUE.equals(projectCode.getIsHidden())) {
                tmpProjectCodes.add(projectCode);
            }
        }
        tmpProjectCodes.addAll(EmployeeProjectCodeAccessItem.getCurrentOpenProjectCodes(currentUser, client, subdepartment));
        projectCodes.addAll(tmpProjectCodes);
        Collections.sort(projectCodes, new ProjectCodeComparator());
        List<ProjectCodeVO> projectCodeVOs = ProjectCodeVO.getList(projectCodes);
        %>
       {
       "status": "OK",
       "projectCodes": <% gson.toJson(projectCodeVOs, out); %>
       }
       <%
} else if("checkMonthIsClosed".equals(command)) {
    Integer year = Integer.parseInt(request.getParameter("year"));
    Integer month = Integer.parseInt(request.getParameter("month"));
    Country country = currentUser.getCountry();
    boolean isMonthClosed = ClosedMonth.isMonthClosed(country, year, month);
    %>
       {
        "status": "OK",
        "isMonthClosed":<%=isMonthClosed %>
       }
    <%
} else if("getProjectCodeConflictsContent".equals(command)) {
    ProjectCode projectCode = (ProjectCode)hs.get(ProjectCode.class, new Long(request.getParameter("projectCodeId")));
    ConflictCheckBlock conflictCheckBlock = new ConflictCheckBlock(projectCode);
%>
{
"status": "OK",
"conflictCheckBlock": <% gson.toJson(conflictCheckBlock, out); %>
}
<%
}
hs.getTransaction().commit();

} catch (Exception ex) {
    hs.getTransaction().rollback();
    %>
    {
        "status": "FAIL",
        "comment": <% gson.toJson(ex.toString(), out); %><% ex.printStackTrace(new PrintWriter(out) ); %>
    }
    <%
}
%>