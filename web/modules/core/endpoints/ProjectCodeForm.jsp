<%-- 
    Document   : subdepartments
    Created on : 31.03.2011, 13:08:03
    Author     : glazov
--%>
<%@page import="java.io.PrintWriter"%>
<%@page import="java.util.ArrayList"%>
<%@page import="com.mazars.management.db.util.CalendarUtil"%>
<%@page import="java.util.Calendar"%>
<%@page import="com.mazars.management.service.MailUtils"%>
<%@page import="com.mazars.management.db.util.ProjectCodeConflictUtil"%>
<%@page import="java.util.HashSet"%>
<%@page import="java.util.Set"%>
<%@page import="java.util.Map"%>
<%@page import="java.util.HashMap"%>
<%@page import="java.util.LinkedList"%>
<%@page import="java.util.Collections"%>
<%@page import="java.util.List"%>
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
       List<OfficeVO> officeVOs = new LinkedList<OfficeVO>();
       List<GroupVO> groupVOs = new LinkedList<GroupVO>();
       List<ClientVO> clientVOs = new LinkedList<ClientVO>();

       if(Employee.Profile.COUNTRY_ADMINISTRATOR.equals(currentUser.getProfile())) {
           Country country = currentUser.getCountry();
           List<Office> offices = new LinkedList<Office>(country.getOffices());
           Collections.sort(offices, new OfficeComparator());
           for(Office office : offices) {
              officeVOs.add(new OfficeVO(office));
           }
       } else if(Employee.Profile.SUPER_USER.equals(currentUser.getProfile())) {
           List<Office> offices = new LinkedList<Office>(RightsItem.getOffices(currentUser, module));
           Collections.sort(offices, new OfficeComparator());
           for(Office office : offices) {
               officeVOs.add(new OfficeVO(office));
           }
       }
       Country userCountry = currentUser.getCountry();
       List<Group> groups = new LinkedList<Group>(userCountry.getGroups());
       Collections.sort(groups, new GroupComparator());
       for(Group group : groups) {
            groupVOs.add(new GroupVO(group));
       }
       List<Client> clients = new LinkedList<Client>(userCountry.getClients());
       Collections.sort(clients, new ClientComparator());
       for(Client client : clients) {
            clientVOs.add(new ClientVO(client));
       }
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
"offices": <% gson.toJson(officeVOs, out); %>,
"groups": <% gson.toJson(groupVOs, out); %>,
"clients": <% gson.toJson(clientVOs, out); %>,
"standardPositions": <% gson.toJson(standardPositionVOs, out); %>
}
<%
} else if("getDepartments".equals(command)) {
       Office office = (Office)hs.get(Office.class, new Long(request.getParameter("officeId")));

       List<DepartmentVO> departmentVOs = new LinkedList<DepartmentVO>();

       if(Employee.Profile.COUNTRY_ADMINISTRATOR.equals(currentUser.getProfile())) {
           if(office != null) {
               List<Department> departments = new LinkedList<Department>(office.getDepartments());
               Collections.sort(departments, new DepartmentComparator());
               for(Department department : departments) {
                  departmentVOs.add(new DepartmentVO(department));
               }
           }
       } else if(Employee.Profile.SUPER_USER.equals(currentUser.getProfile())) {
           List<Department> departments = new LinkedList<Department>(RightsItem.getDepartments(currentUser, module, office));
           Collections.sort(departments, new DepartmentComparator());
           for(Department department : departments) {
              departmentVOs.add(new DepartmentVO(department));
           }
       }
%>
{
"status": "OK",
"departments": <% gson.toJson(departmentVOs, out); %>
}
<%
} else if("getSubdepartments".equals(command)) {
       Department department = (Department)hs.get(Department.class, new Long(request.getParameter("departmentId")));

       List<SubdepartmentVO> subdepartmentVOs = new LinkedList<SubdepartmentVO>();

       if(department != null) {
           if(Employee.Profile.COUNTRY_ADMINISTRATOR.equals(currentUser.getProfile())) {
               List<Subdepartment> subdepartments = new LinkedList<Subdepartment>(department.getSubdepartments());
               Collections.sort(subdepartments, new SubdepartmentComparator());
               for(Subdepartment subdepartment : subdepartments) {
                  subdepartmentVOs.add(new SubdepartmentVO(subdepartment));
               }
           } else if(Employee.Profile.SUPER_USER.equals(currentUser.getProfile())) {
               List<Subdepartment> subdepartments = new LinkedList<Subdepartment>(RightsItem.getSubdepartments(currentUser, module, department));
               Collections.sort(subdepartments, new SubdepartmentComparator());
               for(Subdepartment subdepartment : subdepartments) {
                  subdepartmentVOs.add(new SubdepartmentVO(subdepartment));
               }
           }
       }
%>
{
"status": "OK",
"subdepartments": <% gson.toJson(subdepartmentVOs, out); %>
}
<%
} else if("getActivities".equals(command)) {
    Subdepartment subdepartment = (Subdepartment)hs.get(Subdepartment.class, new Long(request.getParameter("subdepartmentId")));

    List<Activity> activities = new LinkedList<Activity>(subdepartment.getActivities());
    Collections.sort(activities, new ActivityComparator());
    List<ActivityVO> activityVOs = new ArrayList<ActivityVO>();
    for(Activity activity : activities) {
        if(activity.getIsActive()) {
            activityVOs.add(new ActivityVO(activity));
        }
    }

    List<ProjectCodeComment> projectCodeComments = new LinkedList<ProjectCodeComment>(subdepartment.getProjectCodeComments());
    Collections.sort(projectCodeComments, new ProjectCodeCommentComparator());
    List<ProjectCodeCommentVO> projectCodeCommentVOs = ProjectCodeCommentVO.getList(projectCodeComments);
%>
{
"status": "OK",
"activities": <% gson.toJson(activityVOs, out); %>,
"projectCodeComments": <% gson.toJson(projectCodeCommentVOs, out); %>
}
<%
} else if("getClients".equals(command)) {
      Group group = (Group)hs.get(Group.class, new Long(request.getParameter("groupId")));
      List<ClientVO> clientVOs = new LinkedList<ClientVO>();
       List<Client> clients = new LinkedList<Client>(group.getClients());
       Collections.sort(clients, new ClientComparator());
      for(Client client : clients) {
            clientVOs.add(new ClientVO(client));
      }
%>
{
"status": "OK",
"clients": <% gson.toJson(clientVOs, out); %>
}
<%
} else if("getAllClients".equals(command)) {
       List<ClientVO> clientVOs = new LinkedList<ClientVO>();

       Country userCountry = currentUser.getCountry();
       List<Client> clients = new LinkedList<Client>(userCountry.getClients());
       Collections.sort(clients, new ClientComparator());
       for(Client client : clients) {
            clientVOs.add(new ClientVO(client));
       }
%>
{
"status": "OK",
"clients": <% gson.toJson(clientVOs, out); %>
}
<%
} else if("getMaxPeriodCounter".equals(command)) {
    ProjectCodeCounterForm projectCodeCounterForm = ProjectCodeCounterForm.getFromJson(request.getParameter("projectCodeCounterForm"));
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
} else if("saveProjectCode".equals(command)) {
    ProjectCodeForm projectCodeForm = ProjectCodeForm.getFromJson(request.getParameter("projectCodeForm"));
    projectCodeForm.normalize();
    ProjectCode projectCode = ProjectCodeUtils.getProjectCode(projectCodeForm, currentUser);
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
    Set<Subdepartment> subdepartments = new HashSet<Subdepartment>();
    subdepartments.add(projectCode.getSubdepartment());
    if(! Boolean.TRUE.equals(client.getIsActive())) {
        client.setIsActive(true);
        hs.save(client);
    }
    
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
    
    %>
    {
        "status": "OK",
        "createdCode": "<%=projectCode.getCode() %>"
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