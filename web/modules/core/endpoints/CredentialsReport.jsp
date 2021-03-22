<%-- 
    Document   : subdepartments
    Created on : 31.03.2011, 13:08:03
    Author     : glazov
--%><%@page import="java.io.PrintWriter"%>
<%@page import="com.mazars.management.reports.excel.CredentialsReportExcelBuilder"%>
<%@page import="com.mazars.management.reports.CredentialsReport"%>
<%@page contentType="text/html" pageEncoding="UTF-8"
    import="java.util.*"
    import="com.mazars.management.db.domain.*"
    import="com.mazars.management.db.vo.*"
    import="com.mazars.management.web.forms.*"
    import="com.mazars.management.db.util.HibernateUtil"
    import="org.hibernate.Session"
    import="com.google.gson.Gson"
    import="com.mazars.management.reports.TimeSheetReport"
    import="com.mazars.management.reports.vo.*"
    import="java.text.SimpleDateFormat"
    import="com.mazars.management.reports.excel.TimeSheetReportExcelBuilder"
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
Module module = Module.getByName("Clients Report");

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
       List<Office> offices = new LinkedList<Office>();
       List<ActivitySectorGroup> activitySectorGroups = new LinkedList<ActivitySectorGroup>();
       List<Group> groups = new LinkedList<Group>();
       List<Client> clients = new LinkedList<Client>();
       List<ISOCountry> countries = new LinkedList<ISOCountry>();
       
       Country country = currentUser.getCountry();
       if(Employee.Profile.COUNTRY_ADMINISTRATOR.equals(currentUser.getProfile())) {
           offices.addAll(country.getOffices());
       } else if(Employee.Profile.SUPER_USER.equals(currentUser.getProfile())) {
           offices.addAll(RightsItem.getOffices(currentUser, module, country));
       }
       groups.addAll(country.getGroups());
       clients.addAll(country.getClients());
       activitySectorGroups = ActivitySectorGroup.getAll();
       countries = ISOCountry.getAll();
       Collections.sort(offices, new OfficeComparator());
       Collections.sort(groups, new GroupComparator());
       Collections.sort(clients, new ClientComparator());
       Collections.sort(activitySectorGroups, new ActivitySectorGroupComparator());
       Collections.sort(countries, new ISOCountryComparator());
       
       List<OfficeVO> officeVOs = OfficeVO.getList(offices);
       List<GroupVO> groupVOs = GroupVO.getList(groups);
       List<ClientVO> clientVOs = ClientVO.getList(clients);
       List<ActivitySectorGroupVO> activitySectorGroupVOs = ActivitySectorGroupVO.getList(activitySectorGroups);
       List<ISOCountryVO> countryVOs = ISOCountryVO.getList(countries);
%>
{
"status": "OK",
"offices": <% gson.toJson(officeVOs, out); %>,
"groups": <% gson.toJson(groupVOs, out); %>,
"clients": <% gson.toJson(clientVOs, out); %>,
"activitySectorGroups": <% gson.toJson(activitySectorGroupVOs, out); %>,
"countries": <% gson.toJson(countryVOs, out); %>
}
<%
} else if("getOfficeContent".equals(command)) {
       Office office = (Office)hs.get(Office.class, new Long(request.getParameter("officeId")));

       List<Department> departments = new LinkedList<Department>();
       if(Employee.Profile.COUNTRY_ADMINISTRATOR.equals(currentUser.getProfile())) {
           Country country = currentUser.getCountry();
           departments.addAll(office.getDepartments());
       } else if(Employee.Profile.SUPER_USER.equals(currentUser.getProfile())) {
           departments.addAll(RightsItem.getDepartments(currentUser, module, office));
       }
       Collections.sort(departments, new DepartmentComparator());
       List<DepartmentVO> departmentVOs = DepartmentVO.getList(departments);
%>
{
"status": "OK",
"departments": <% gson.toJson(departmentVOs, out); %>
}
<%
} else if("getDepartmentContent".equals(command)) {
       Department department = (Department)hs.get(Department.class, new Long(request.getParameter("departmentId")));

       List<Subdepartment> subdepartments = new LinkedList<Subdepartment>();
       if(Employee.Profile.COUNTRY_ADMINISTRATOR.equals(currentUser.getProfile())) {
           Country country = currentUser.getCountry();
           subdepartments.addAll(department.getSubdepartments());
       } else if(Employee.Profile.SUPER_USER.equals(currentUser.getProfile())) {
           subdepartments.addAll(RightsItem.getSubdepartments(currentUser, module, department));
       }
       Collections.sort(subdepartments, new SubdepartmentComparator());
       List<SubdepartmentVO> subdepartmentVOs = SubdepartmentVO.getList(subdepartments);
%>
{
"status": "OK",
"subdepartments": <% gson.toJson(subdepartmentVOs, out); %>
}
<%
} else if("getSubdepartmentContent".equals(command)) {
    Subdepartment subdepartment = (Subdepartment)hs.get(Subdepartment.class, new Long(request.getParameter("subdepartmentId")));

    List<Activity> activities = new LinkedList<Activity>();
    if(Employee.Profile.COUNTRY_ADMINISTRATOR.equals(currentUser.getProfile())) {
        if(currentUser.getCountry().getId().equals(subdepartment.getDepartment().getOffice().getCountry().getId())) {
            activities.addAll(subdepartment.getActivities());
        }
    } else if(Employee.Profile.SUPER_USER.equals(currentUser.getProfile())) {
        if(RightsItem.isAvailable(subdepartment, currentUser, module)) {
           activities.addAll(subdepartment.getActivities());
        }   
    }
    Collections.sort(activities, new ActivityComparator());
    List<ActivityVO> activityVOs = ActivityVO.getList(activities);
%>
{
"status": "OK",
"activities": <% gson.toJson(activityVOs, out); %>
}
<%
}  else if("getGroupContent".equals(command)) {
    Group group = (Group)hs.get(Group.class, new Long(request.getParameter("groupId")));

    List<Client> clients = new LinkedList<Client>();
    clients.addAll(group.getClients());

    Collections.sort(clients, new ClientComparator());
    List<ClientVO> clientVOs = ClientVO.getList(clients);
%>
{
"status": "OK",
"clients": <% gson.toJson(clientVOs, out); %>
}
<%
}  else if("getNullGroupContent".equals(command)) {
    Country country = currentUser.getCountry();
    List<Client> clients = new LinkedList<Client>();
    clients.addAll(country.getClients());
    Collections.sort(clients, new ClientComparator());
    List<ClientVO> clientVOs = ClientVO.getList(clients);
%>
{
"status": "OK",
"clients": <% gson.toJson(clientVOs, out); %>
}
<%
}  else if("getActivitySectorGroupContent".equals(command)) {
    ActivitySectorGroup activitySectorGroup = (ActivitySectorGroup)hs.get(ActivitySectorGroup.class, new Long(request.getParameter("activitySectorGroupId")));

    List<ActivitySector> activitySectors = new LinkedList<ActivitySector>();
    activitySectors.addAll(activitySectorGroup.getActivitySectors());

    Collections.sort(activitySectors, new ActivitySectorComparator());
    List<ActivitySectorVO> activitySectorVOs = ActivitySectorVO.getList(activitySectors);
%>
{
"status": "OK",
"activitySectors": <% gson.toJson(activitySectorVOs, out); %>
}
<%
} else if("generateReport".equals(command)) {
    CredentialsReportForm credentialsReportForm = CredentialsReportForm.getFromJson(request.getParameter("credentialsReportForm"));
    CredentialsReport credentialsReport = new CredentialsReport(credentialsReportForm, module, currentUser);
    credentialsReport.build();
    CredentialsReportVO credentialsReportVO = new CredentialsReportVO(credentialsReport);
    %>
    {
    "status": "OK",
    "report": <% gson.toJson(credentialsReportVO, out); %>
    }
    <%
} else if("generateXLSReport".equals(command)) {
    CredentialsReportForm credentialsReportForm = CredentialsReportForm.getFromJson(request.getParameter("credentialsReportForm"));
    CredentialsReport credentialsReport = new CredentialsReport(credentialsReportForm, module, currentUser);
    credentialsReport.build();

    SimpleDateFormat dateFormatterShort = new SimpleDateFormat("ddMMyyyy");
    SimpleDateFormat dateFormatterLong = new SimpleDateFormat("ddMMyyyyHHmmss");
    String office = "ALL";
    String department = "ALL";
    String subdepartment = "ALL";
    String activity = "ALL";
    String group = "ALL";
    String client = "ALL";
    String activitySector = "ALL";
    String activitySectorGroup = "ALL";
    if(credentialsReportForm.getOfficeId() != null) {
        office = "" + credentialsReportForm.getOfficeId();
    }
    if(credentialsReportForm.getDepartmentId() != null) {
        department = "" + credentialsReportForm.getDepartmentId();
    }
    if(credentialsReportForm.getSubdepartmentId() != null) {
        subdepartment = "" + credentialsReportForm.getSubdepartmentId();
    }
    if(credentialsReportForm.getActivityId() != null) {
        activity = "" + credentialsReportForm.getActivityId();
    }
    if(credentialsReportForm.getGroupId() != null) {
        group = "" + credentialsReportForm.getGroupId();
    }
    if(credentialsReportForm.getClientId() != null) {
        client = "" + credentialsReportForm.getClientId();
    }
    if(credentialsReportForm.getActivitySectorId() != null) {
        activitySector = "" + credentialsReportForm.getActivitySectorId();
    }
    if(credentialsReportForm.getActivitySectorGroupId() != null) {
        activitySectorGroup = "" + credentialsReportForm.getActivitySectorGroupId();
    }
    
    String fileName = "CREDENTIALS_" + office + "_" + department + "_" + subdepartment + "_" + activity + "_" + group + "_" + client + "_" + activitySectorGroup + "_" + activitySector + "_";
    fileName += dateFormatterLong.format(credentialsReport.getCreatedAt());
    fileName += ".xls";

    response.setContentType("application/vnd.ms-excel");
    response.setHeader("content-disposition", "filename=" + fileName);
    CredentialsReportExcelBuilder reb = new CredentialsReportExcelBuilder(credentialsReport, response.getOutputStream());
    reb.createStandardReport(response.getOutputStream());
}
hs.getTransaction().commit();

} catch (Exception ex) {
    hs.getTransaction().rollback();
    %>
    {
        "status": "FAIL",
        "comment": <% gson.toJson(ex.toString(), out); %>
    }
    <% ex.printStackTrace(new PrintWriter(out));
}
%>
