<%-- 
    Document   : subdepartments
    Created on : 31.03.2011, 13:08:03
    Author     : glazov
--%>
<%@page import="com.mazars.management.web.vo.ConciseEmployee"%>
<%@page contentType="text/html" pageEncoding="UTF-8"
    import="java.util.*"
    import="com.mazars.management.db.domain.*"
    import="com.mazars.management.db.vo.*"
    import="com.mazars.management.web.forms.*"
    import="com.mazars.management.db.util.HibernateUtil"
    import="org.hibernate.Session"
    import="com.google.gson.Gson"
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
    ProjectCodeListFilter filter = ProjectCodeListFilter.getFromJson(request.getParameter("filter"));
       
    Client client = null;
    Group group = null;
    if(filter.getClientId() != null) {
        client = (Client)hs.get(Client.class, filter.getClientId());
        group = client.getGroup();
    } else if(filter.getGroupId() != null) {
        group = (Group)hs.get(Group.class, filter.getGroupId());      
    }   

    Activity activity = null;
    Subdepartment subdepartment = null;
    Department department = null;
    Office office = null;
    if(filter.getActivityId() != null) {
        activity = (Activity)hs.get(Activity.class, filter.getActivityId());
        subdepartment = activity.getSubdepartment();
        department = subdepartment.getDepartment();
        office = department.getOffice();
    } else if(filter.getSubdepartmentId() != null) {
        subdepartment = (Subdepartment)hs.get(Subdepartment.class, filter.getSubdepartmentId());
        department = subdepartment.getDepartment();
        office = department.getOffice();
    } else if(filter.getDepartmentId() != null) {
        department = (Department)hs.get(Department.class, filter.getDepartmentId());
        office = department.getOffice();       
    } else if(filter.getOfficeId() != null) {
        office = (Office)hs.get(Office.class, filter.getOfficeId());      
    }

    Country country = currentUser.getCountry();
    List<Group> groups = new LinkedList<Group>();
    List<Client> clients = new LinkedList<Client>();
    List<Office> offices = new LinkedList<Office>();
    List<Department> departments = new LinkedList<Department>();
    List<Subdepartment> subdepartments = new LinkedList<Subdepartment>();
    List<Activity> activities = new LinkedList<Activity>();

    if(Employee.Profile.COUNTRY_ADMINISTRATOR.equals(currentUser.getProfile())) {
       if(country != null) {
           offices = new LinkedList<Office>(country.getOffices());
       }
       if(office != null) {
           departments = new LinkedList<Department>(office.getDepartments());
       }
       if(department != null) {
           subdepartments = new LinkedList<Subdepartment>(department.getSubdepartments());
       }
       if(subdepartment != null) {
           activities = new LinkedList<Activity>(subdepartment.getActivities());
       }
    } else if(Employee.Profile.SUPER_USER.equals(currentUser.getProfile())) {
       if(country != null) {
           offices = new LinkedList<Office>(RightsItem.getOffices(currentUser, module, country));
       }
       if(office != null) {
           departments = new LinkedList<Department>(RightsItem.getDepartments(currentUser, module, office));
       }
       if(department != null) {
           subdepartments = new LinkedList<Subdepartment>(RightsItem.getSubdepartments(currentUser, module, department));
       }
       if(subdepartment != null) {
           activities = new LinkedList<Activity>(subdepartment.getActivities());;
       }
    }
    if(country != null) {
        groups = new LinkedList<Group>(country.getGroups());
    }
    if(group != null) {
        clients = new LinkedList<Client>(group.getClients());
    } else {
        clients = new LinkedList<Client>(country.getClients());
    }
    Collections.sort(groups, new GroupComparator());
    Collections.sort(clients, new ClientComparator());
    Collections.sort(offices, new OfficeComparator());
    Collections.sort(departments, new DepartmentComparator());
    Collections.sort(subdepartments, new SubdepartmentComparator());
    Collections.sort(activities, new ActivityComparator());
    List<GroupVO> groupVOs = GroupVO.getList(groups);
    List<ClientVO> clientVOs = ClientVO.getList(clients);
    List<OfficeVO> officeVOs = OfficeVO.getList(offices);
    List<DepartmentVO> departmentVOs = DepartmentVO.getList(departments);
    List<SubdepartmentVO> subdepartmentVOs = SubdepartmentVO.getList(subdepartments);
    List<ActivityVO> activityVOs = ActivityVO.getList(activities);

    ConciseEmployee inChargePersonVO = null;
    if(filter.getInChargePersonId() != null) {
       Employee inChargePerson = (Employee)hs.get(Employee.class, filter.getInChargePersonId());
       inChargePersonVO = new ConciseEmployee(inChargePerson);
    }
    ConciseEmployee inChargePartnerVO = null;
    if(filter.getInChargePartnerId() != null) {
       Employee inChargePartner = (Employee)hs.get(Employee.class, filter.getInChargePartnerId());
       inChargePartnerVO = new ConciseEmployee(inChargePartner);
    }
%>
{
"status": "OK",
<% if(inChargePersonVO != null) {%>
    "inChargePerson": <% gson.toJson(inChargePersonVO, out); %>,
<% } else  { %>
    "inChargePerson": null,
<% } %>
<% if(inChargePartnerVO != null) {%>
    "inChargePartner": <% gson.toJson(inChargePartnerVO, out); %>,
<% } else  { %>
    "inChargePartner": null,
<% } %>
"groups": <% gson.toJson(groupVOs, out); %>,
"clients": <% gson.toJson(clientVOs, out); %>,
"offices": <% gson.toJson(officeVOs, out); %>,
"departments": <% gson.toJson(departmentVOs, out); %>,
"subdepartments": <% gson.toJson(subdepartmentVOs, out); %>,
"activities": <% gson.toJson(activityVOs, out); %>,
"groupId": <%=group != null ? group.getId() : null %>,
"clientId": <%=client != null ? client.getId() : null %>,
"officeId": <%=office != null ? office.getId() : null %>,
"departmentId": <%=department != null ? department.getId() : null %>,
"subdepartmentId": <%=subdepartment != null ? subdepartment.getId() : null %>,
"activityId": <%=activity != null ? activity.getId() : null %>
}
<%
} else if("getGroupContent".equals(command)) {
    Group group = null;
    if(request.getParameter("groupId") != null) {
        group = (Group)hs.get(Group.class, new Long(request.getParameter("groupId")));
    }
    Country country = currentUser.getCountry();
    List<Client> clients = new LinkedList<Client>();
    if(group != null) {
        clients = new LinkedList<Client>(group.getClients());
    } else {
        clients = new LinkedList<Client>(country.getClients());
    }
    Collections.sort(clients, new ClientComparator());
    List<ClientVO> clientVOs = ClientVO.getList(clients);
%>
{
"status": "OK",
"clients": <% gson.toJson(clientVOs, out); %>
}
<%    
} else if("getOfficeContent".equals(command)) {
       List<DepartmentVO> departmentVOs = new LinkedList<DepartmentVO>();
       Office office = (Office)hs.get(Office.class, new Long(request.getParameter("officeId")));
       List<Department> departments = new LinkedList<Department>();
       if(Employee.Profile.COUNTRY_ADMINISTRATOR.equals(currentUser.getProfile())) {
           departments = new LinkedList<Department>(office.getDepartments());
       } else if(Employee.Profile.SUPER_USER.equals(currentUser.getProfile())) {
           departments = new LinkedList<Department>(RightsItem.getDepartments(currentUser, module, office));
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
    List<SubdepartmentVO> subdepartmentVOs = new LinkedList<SubdepartmentVO>();
    Department department = (Department)hs.get(Department.class, new Long(request.getParameter("departmentId")));
    List<Subdepartment> subdepartments = new LinkedList<Subdepartment>();
    if(Employee.Profile.COUNTRY_ADMINISTRATOR.equals(currentUser.getProfile())) {
        subdepartments = new LinkedList<Subdepartment>(department.getSubdepartments());
    } else if(Employee.Profile.SUPER_USER.equals(currentUser.getProfile())) {
        subdepartments = new LinkedList<Subdepartment>(RightsItem.getSubdepartments(currentUser, module, department));
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
    List<ActivityVO> activityVOs = new LinkedList<ActivityVO>();
    Subdepartment subdepartment = (Subdepartment)hs.get(Subdepartment.class, new Long(request.getParameter("subdepartmentId")));
    List<Activity> activities = new LinkedList<Activity>();
    if(Employee.Profile.COUNTRY_ADMINISTRATOR.equals(currentUser.getProfile())) {
        if(subdepartment.getDepartment().getOffice().getCountry().getId().equals(currentUser.getCountry().getId())) {
            activities = new LinkedList<Activity>(subdepartment.getActivities());
        }
    } else if(Employee.Profile.SUPER_USER.equals(currentUser.getProfile())) {
        if(RightsItem.isAvailable(subdepartment, currentUser, module)) {
            activities = new LinkedList<Activity>(subdepartment.getActivities());
        }
    }
    Collections.sort(activities, new ActivityComparator());
    for(Activity activity : activities) {
        activityVOs.add(new ActivityVO(activity));
    }
%>
{
"status": "OK",
"activities": <% gson.toJson(activityVOs, out); %>
}
<%
} else if("searchSubdepartments".equals(command)) {
    String subdepartmentName = request.getParameter("subdepartmentName").toLowerCase();
    Set<String> tmpSubdepartments = new HashSet<String>();
    for(Subdepartment subdepartment : Subdepartment.getAllowedSubdepartments(null, null, null, currentUser, module)) {
        if(subdepartment.getName().toLowerCase().contains(subdepartmentName)) {
            tmpSubdepartments.add(subdepartment.getName());
        }
    }
    List<String> subdepartments = new ArrayList<String>(tmpSubdepartments);
    Collections.sort(subdepartments);
%>
{
"status": "OK",
"subdepartments": <% gson.toJson(subdepartments, out); %>
}
<%    
} else if("searchActivities".equals(command)) {
    String activityName = request.getParameter("activityName").toLowerCase();
    Set<String> tmpActivities = new HashSet<String>();
    List<Subdepartment> subdepartments = Subdepartment.getAllowedSubdepartments(null, null, null, currentUser, module);
    for(Activity activity : Activity.getAll(subdepartments)) {
        if(activity.getName().toLowerCase().contains(activityName)) {
            tmpActivities.add(activity.getName());
        }
    }
    List<String> activities = new ArrayList<String>(tmpActivities);
    Collections.sort(activities);
%>
{
"status": "OK",
"activities": <% gson.toJson(activities, out); %>
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