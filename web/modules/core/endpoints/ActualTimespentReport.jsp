<%-- 
    Document   : subdepartments
    Created on : 31.03.2011, 13:08:03
    Author     : glazov
--%>
<%@page import="java.io.PrintWriter"%>
<%@page import="com.mazars.management.db.util.CalendarUtil"%>
<%@page contentType="text/html" pageEncoding="UTF-8"
    import="java.util.*"
    import="com.mazars.management.db.domain.*"
    import="com.mazars.management.db.vo.*"
    import="com.mazars.management.web.forms.*"
    import="com.mazars.management.db.util.HibernateUtil"
    import="org.hibernate.Session"
    import="com.google.gson.Gson"
    import="com.mazars.management.reports.*"
    import="com.mazars.management.reports.vo.*"
    import="com.mazars.management.reports.excel.*"
    import="java.text.SimpleDateFormat"
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
Module module = Module.getByName("Timesheets Report");

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
       List<Group> groups = new LinkedList<Group>();
       List<Client> clients = new LinkedList<Client>();
       
       Country country = currentUser.getCountry();
       groups.addAll(country.getGroups());
       clients.addAll(country.getClients());
       Collections.sort(groups, new GroupComparator());
       Collections.sort(clients, new ClientComparator());
       
       List<GroupVO> groupVOs = GroupVO.getList(groups);
       List<ClientVO> clientVOs = ClientVO.getList(clients);
       
       Integer minYear = ProjectCode.getMinYear();
%>
{
"status": "OK",
"groups": <% gson.toJson(groupVOs, out); %>,
"clients": <% gson.toJson(clientVOs, out); %>,
"minYear": <%=minYear %>
}
<%
} else if("getNullGroupContent".equals(command)) {
       List<Client> clients = new LinkedList<Client>();
       
       Country country = currentUser.getCountry();
       clients.addAll(country.getClients());
       Collections.sort(clients, new ClientComparator());
       
       List<ClientVO> clientVOs = ClientVO.getList(clients);
%>
{
"status": "OK",
"clients": <% gson.toJson(clientVOs, out); %>
}
<%
} else if("getGroupContent".equals(command)) {
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
} else if("getClientContent".equals(command)) {
       Client client = (Client)hs.get(Client.class, new Long(request.getParameter("clientId")));
       List<ProjectCode> projectCodes = new LinkedList<ProjectCode>();
       if(Employee.Profile.COUNTRY_ADMINISTRATOR.equals(currentUser.getProfile())) {
           projectCodes = ProjectCode.getProjectCodes(currentUser.getCountry(), client);
       } else if(Employee.Profile.SUPER_USER.equals(currentUser.getProfile())) {
           projectCodes = RightsItem.getProjectCodes(currentUser, module, client);
       }
       Collections.sort(projectCodes, new ProjectCodeComparator());
       List<ProjectCodeVO> projectCodeVOs = ProjectCodeVO.getList(projectCodes);
%>
{
"status": "OK",
"projectCodes": <% gson.toJson(projectCodeVOs, out); %>
}
<%
} else if("generateReport".equals(command)) {
    ActualTimespentReportForm actualTimespentReportForm = ActualTimespentReportForm.getFromJson(request.getParameter("actualTimespentReportForm"));
    ActualTimespentReport actualTimespentReport = new ActualTimespentReport(actualTimespentReportForm, module, currentUser);
    actualTimespentReport.build();
    ActualTimespentReportVO actualTimespentReportVO = new ActualTimespentReportVO(actualTimespentReport);
    %>
    {
        "status": "OK",
        "report": <% gson.toJson(actualTimespentReportVO, out); %>
    }
    <%
} else if("generateXLSReport".equals(command)) {
    ActualTimespentReportForm actualTimespentReportForm = ActualTimespentReportForm.getFromJson(request.getParameter("actualTimespentReportForm"));
    String groupName = "ALL";
    String clientCodeName = "ALL";
    String projectCodeCode = "ALL";
    String year = "ALL";
    if(actualTimespentReportForm.getGroupId() != null) {
        Group group = (Group)hs.get(Group.class, new Long(actualTimespentReportForm.getGroupId()));
        groupName = group.getName().replaceAll("!\\w", "").replaceAll(" ", "");
        if(groupName.length() > 30) {
            groupName = groupName.substring(0, 30);
        }
    }
    if(actualTimespentReportForm.getClientId() != null) {
        Client client = (Client)hs.get(Client.class, new Long(actualTimespentReportForm.getClientId()));
        clientCodeName = client.getCodeName().replaceAll("!\\w", "").replaceAll(" ", "");
        if(clientCodeName.length() > 30) {
            clientCodeName = clientCodeName.substring(0, 30);
        }
    }
    if(actualTimespentReportForm.getProjectCodeId() != null) {
        ProjectCode projectCode = (ProjectCode)hs.get(ProjectCode.class, new Long(actualTimespentReportForm.getProjectCodeId()));
        projectCodeCode = projectCode.getCode();
    }
    year = "" + actualTimespentReportForm.getYear();

    ActualTimespentReport actualTimespentReport = new ActualTimespentReport(actualTimespentReportForm, module, currentUser);
    actualTimespentReport.build();

    SimpleDateFormat dateFormatterShort = new SimpleDateFormat("ddMMyyyy");
    SimpleDateFormat dateFormatterLong = new SimpleDateFormat("ddMMyyyyHHmmss");
    String fileName = "AT_" + groupName + "_" + clientCodeName + "_" + projectCodeCode + "_" + year;
    fileName += "_";
    fileName += dateFormatterLong.format(actualTimespentReport.getCreatedAt());
    fileName += ".xls";

    response.setContentType("application/vnd.ms-excel");
    response.setHeader("content-disposition", "filename=" + fileName);
    ActualTimespentReportExcelBuilder reb = new ActualTimespentReportExcelBuilder(actualTimespentReport);
    reb.createWorkbook(response.getOutputStream());
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
