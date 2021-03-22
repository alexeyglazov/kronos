<%-- 
    Document   : subdepartments
    Created on : 31.03.2011, 13:08:03
    Author     : glazov
--%>
<%@page import="java.io.PrintWriter"%>
<%@page import="com.mazars.management.service.MailUtils"%>
<%@page import="java.util.ArrayList"%>
<%@page import="com.mazars.management.db.util.CalendarUtil"%>
<%@page import="java.util.Calendar"%>
<%@page import="com.mazars.management.db.util.ProjectCodeConflictUtil"%>
<%@page import="java.util.HashSet"%>
<%@page import="java.util.Set"%>
<%@page import="com.mazars.management.web.vo.ProjectCodeDeterminant"%>
<%@page import="com.mazars.management.web.vo.Period"%>
<%@page import="java.util.Collections"%>
<%@page import="java.util.List"%>
<%@page import="java.util.LinkedList"%>
<%@page import="java.util.Map"%>
<%@page import="java.util.HashMap"%>
<%@page import="com.mazars.management.web.utils.ProjectCodeUtils"%>
<%@page contentType="text/html" pageEncoding="UTF-8"
    import="com.mazars.management.db.domain.*"
    import="com.mazars.management.db.vo.*"
    import="com.mazars.management.web.forms.*"
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
Module module = Module.getByName("Code");


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
    Country userCountry = currentUser.getCountry();
    List<Currency> currencies = CountryCurrency.getCurrencies(userCountry);
    Collections.sort(currencies, new CurrencyComparator());
    List<CurrencyVO> currencyVOs = CurrencyVO.getList(currencies);
        
    List<StandardPosition> standardPositions = StandardPosition.getAll();
    Collections.sort(standardPositions, new StandardPositionComparator());
    List<StandardPositionVO> standardPositionVOs = StandardPositionVO.getList(standardPositions);        
%>
{
"status": "OK",
"currencies" : <% gson.toJson(currencyVOs, out); %>,
"standardPositions": <% gson.toJson(standardPositionVOs, out); %>
}
<%
} else if("getProjectCodeComments".equals(command)) {
    List<Long> activityIds = ListOfLong.getFromJson(request.getParameter("activityIds")).getList();
    List<Subdepartment> subdepartments = new LinkedList<Subdepartment>();
    for(Long activityId : activityIds) {
        Activity activity = (Activity)hs.get(Activity.class, activityId);
        Subdepartment subdepartment = activity.getSubdepartment();
        boolean found = false;
        for(Subdepartment tmpSubdepartment : subdepartments) {
            if(tmpSubdepartment.getId().equals(subdepartment.getId())) {
                found = true;
                break;
            }
        }
        if(! found) {
            subdepartments.add(subdepartment);
        }
    }
    List<ProjectCodeCommentVO> projectCodeCommentVOs = new LinkedList<ProjectCodeCommentVO>();
    for(Subdepartment subdepartment : subdepartments) {
        List<ProjectCodeComment> projectCodeComments = new LinkedList<ProjectCodeComment>(subdepartment.getProjectCodeComments());
        Collections.sort(projectCodeComments, new ProjectCodeCommentComparator());
        projectCodeCommentVOs.addAll(ProjectCodeCommentVO.getList(projectCodeComments));
    }
%>
{
"status": "OK",
"projectCodeComments": <% gson.toJson(projectCodeCommentVOs, out); %>
}
<%    
} else if("getPreviewInfo".equals(command)) {
    ProjectCodeBatchCreationPreviewForm projectCodeBatchCreationPreviewForm = ProjectCodeBatchCreationPreviewForm.getFromJson(request.getParameter("projectCodeBatchCreationPreviewForm"));
    List<String> projectCodeCodes = new LinkedList<String>();
    Map<Long, Client> clients = new HashMap<Long, Client>();
    Map<Long, Activity> activities = new HashMap<Long, Activity>();
    Map<String, Integer> counters = new HashMap<String, Integer>();
    for(Long clientId : projectCodeBatchCreationPreviewForm.getClientIds()) {
        Client client = clients.get(clientId);
        if(client == null) {
            client = (Client)hs.get(Client.class, clientId);
            clients.put(clientId, client);
        }
        for(Long activityId : projectCodeBatchCreationPreviewForm.getActivityIds()) {
            Activity activity = activities.get(activityId);
            if(activity == null) {
                activity = (Activity)hs.get(Activity.class, activityId);
                activities.put(activityId, activity);
            }        
            for(Period period : projectCodeBatchCreationPreviewForm.getPeriods()) {
                if(ProjectCode.PeriodType.COUNTER.equals(period.getType())) {
                    String key = "" + clientId + "_" + activityId + "_" + projectCodeBatchCreationPreviewForm.getYear();
                    Integer counter = counters.get(key);
                    if(counter == null) {
                        counter = ProjectCode.getMaxPeriodCounter(projectCodeBatchCreationPreviewForm.getYear(), client, activity);
                    }
                    if(counter == null) {
                        counter = 1;
                    } else {
                        counter++;
                    }
                    counters.put(key, counter);
                    period.setCounter(counter);
                }
                
                ProjectCode projectCode = new ProjectCode();
                projectCode.setActivity(activity);
                projectCode.setSubdepartment(activity.getSubdepartment());
                projectCode.setClient(client);
                projectCode.setYear(projectCodeBatchCreationPreviewForm.getYear());
                projectCode.setPeriodType(period.getType());
                if(ProjectCode.PeriodType.QUARTER.equals(period.getType())) {
                    projectCode.setPeriodQuarter(period.getQuarter());
                } else if(ProjectCode.PeriodType.MONTH.equals(period.getType())) {
                    projectCode.setPeriodMonth(period.getMonth());
                } else if(ProjectCode.PeriodType.DATE.equals(period.getType())) {
                    projectCode.setPeriodDate(period.getDate());
                } else if(ProjectCode.PeriodType.COUNTER.equals(period.getType())) {
                    projectCode.setPeriodCounter(period.getCounter());
                }
                projectCode.generateCode();
                projectCodeCodes.add(projectCode.getCode());
            }
        }
    }
    %>
    {
    "status": "OK",
    "projectCodeCodes" : <% gson.toJson(projectCodeCodes, out); %>
    }
    <%    
} else if("getMaxPeriodCounter".equals(command)) {
    ProjectCodeCounterForm projectCodeCounterForm = ProjectCodeCounterForm.getFromJson(request.getParameter("projectCodeCounterForm"));
    Subdepartment subdepartment = (Subdepartment)hs.get(Subdepartment.class, projectCodeCounterForm.getSubdepartmentId());
    Integer year = projectCodeCounterForm.getYear();
    Client client = (Client)hs.get(Client.class, projectCodeCounterForm.getClientId());
    Activity activity = (Activity)hs.get(Activity.class, projectCodeCounterForm.getActivityId());
    Integer counter = ProjectCode.getMaxPeriodCounter(year, client, activity);
    %>
    {
    "status": "OK",
    "counter" : <%=counter %>
    }
    <%
} else if("saveProjectCodes".equals(command)) {
    ProjectCodeBatchCreationForm projectCodeBatchCreationForm = ProjectCodeBatchCreationForm.getFromJson(request.getParameter("projectCodeBatchCreationForm"));
    projectCodeBatchCreationForm.normalize();
    List<ProjectCode> projectCodes = ProjectCodeUtils.getProjectCodes(projectCodeBatchCreationForm, currentUser);
    Map<Client, Set<Subdepartment>> subdepartmentsItems = new HashMap<Client, Set<Subdepartment>>();
    for(ProjectCode projectCode : projectCodes) {
        ProjectCode sameProjectCode = ProjectCode.getByCode(projectCode.getCode());
        if(sameProjectCode != null) {
            throw new Exception("Code " + sameProjectCode.getCode() + " already exists");
        }
        
        List<Subdepartment> checkingSubdepartments = ProjectCodeConflictUtil.detectConflicts(projectCode);
        List<ProjectCodeConflict> projectCodeConflicts = new LinkedList<ProjectCodeConflict>();
        if(! checkingSubdepartments.isEmpty()) {
            projectCodeConflicts = ProjectCodeConflictUtil.createProjectCodeConflicts(projectCode, checkingSubdepartments, null);
            projectCode.setConflictStatus(ProjectCodeConflict.Status.DETECTED);
        }
        hs.save(projectCode);
        for(ProjectCodeConflict projectCodeConflict : projectCodeConflicts) {
            hs.save(projectCodeConflict);
            ProjectCodeConflictHistoryItem projectCodeConflictHistoryItem = ProjectCodeConflictHistoryItem.getInitialProjectCodeConflictHistoryItem(projectCodeConflict);
            hs.save(projectCodeConflictHistoryItem);
        }
        
        FeesItem feesItem = projectCode.getFeesItem();
        if(feesItem != null) {
            hs.save(feesItem);
            for(FeesAdvance feesAdvance : feesItem.getFeesAdvances()) {
                 hs.save(feesAdvance);
            }
        }
        Client client = projectCode.getClient();
        Subdepartment subdepartment = projectCode.getSubdepartment();
        Set<Subdepartment> subdepartmentsItem = subdepartmentsItems.get(client);
        if(subdepartmentsItem == null) {
            subdepartmentsItem = new HashSet<Subdepartment>();
        }
        subdepartmentsItem.add(subdepartment);
        subdepartmentsItems.put(projectCode.getClient(), subdepartmentsItem);
        
        try {
            Calendar today = CalendarUtil.getToday();
            for(ProjectCodeConflict projectCodeConflict : projectCodeConflicts) {
                List<Subdepartment> tmpCheckingSubdepartments = new ArrayList<Subdepartment>();
                tmpCheckingSubdepartments.add(projectCodeConflict.getCheckingSubdepartment());

                List<Employee> employees = EmployeeSubdepartmentHistoryItem.getEmployees(null, tmpCheckingSubdepartments, EmployeeSubdepartmentHistoryItem.Type.PROJECT_CODE_CONFLICT_NOTIFICATION, today, today);

                for(Employee employee : employees) {
                    javax.mail.Session mailSession = MailUtils.getSession();
                    String mailContent = MailUtils.getProjectCodeConflictCheckNotificationMailContent(employee, projectCodeConflict);
                    MailUtils.sendProjectCodeConflictCheckNotificationMessage(mailSession, mailContent, employee.getEmail());
                }
            }
        } catch (Exception mailException) {
            mailException.printStackTrace(new PrintWriter(System.out));
        }
        
    }
    for(Client client : subdepartmentsItems.keySet()) {
        if(! Boolean.TRUE.equals(client.getIsActive())) {
            client.setIsActive(true);
            hs.save(client);
        }
        Set<Subdepartment> subdepartments = subdepartmentsItems.get(client);
        Set<Subdepartment> oldSubdepartments = SubdepartmentClientLink.getSubdepartments(client);
        Set<Subdepartment> toBindSubdepartments = new HashSet<Subdepartment>(subdepartments);
        toBindSubdepartments.removeAll(oldSubdepartments);
        Set<Subdepartment> allSubdepartments = new HashSet<Subdepartment>(oldSubdepartments);
        allSubdepartments.addAll(subdepartments);
        SubdepartmentClientLink.linkClientSubdepartments(client, toBindSubdepartments);
        if(! toBindSubdepartments.isEmpty()) {
            try {
                Calendar today = CalendarUtil.getToday();
                for(Subdepartment subdepartment : allSubdepartments) {
                    List<Subdepartment> tmpSubdepartments = new ArrayList<Subdepartment>();
                    tmpSubdepartments.add(subdepartment);
                    List<Employee> employees = EmployeeSubdepartmentHistoryItem.getEmployees(null, tmpSubdepartments, EmployeeSubdepartmentHistoryItem.Type.CLIENT_CONFLICT_NOTIFICATION, today, today);
                    for(Employee employee : employees) {
                        javax.mail.Session mailSession = MailUtils.getSession();
                        String mailContent = MailUtils.getSubdepartmentBoundToClientNotificationMailContent(employee, toBindSubdepartments, client);
                        MailUtils.sendSubdepartmentBoundToClientNotificationMessage(mailSession, mailContent, employee.getEmail());
                    }
                }
            } catch (Exception mailException) {
                mailException.printStackTrace(new PrintWriter(System.out));
            }
        }        
        
    }
    %>
    {
    "status": "OK",
    "count": <%=projectCodes.size() %>
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