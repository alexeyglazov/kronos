<%-- 
    Document   : subdepartments
    Created on : 31.03.2011, 13:08:03
    Author     : glazov
--%><%@page import="com.mazars.management.db.comparators.ClientComparator"%>
<%@page import="com.mazars.management.db.comparators.GroupComparator"%>
<%@page import="com.mazars.management.reports.vo.ClientPlanningReportVO"%>
<%@page import="com.mazars.management.reports.ClientPlanningReport"%>
<%@page import="java.io.PrintStream"%>
<%@page import="java.io.PrintWriter"%>
<%@page import="java.util.HashSet"%>
<%@page import="java.util.Set"%>
<%@page import="java.util.Collections"%>
<%@page import="java.util.LinkedList"%>
<%@page import="java.util.List"%>
<%@page import="java.util.Calendar"%>
<%@page import="java.util.Date"%>
<%@page import="java.util.Map"%>
<%@page import="java.util.HashMap"%>
<%@page import="com.mazars.management.web.vo.PlanningToolInfo"%>
<%@page import="com.mazars.management.service.PlanningLockSubdepartmentManager"%>
<%@page import="com.mazars.management.web.vo.ShortEmployee"%>
<%@page import="com.mazars.management.web.vo.OfficeDepartmentSubdepartment"%>
<%@page import="com.mazars.management.db.util.PlanningItemUtil"%>
<%@page import="com.mazars.management.web.vo.DescribedCarreersInfo"%>
<%@page import="com.mazars.management.db.util.EmployeePositionHistoryItemUtils"%>
<%@page import="java.io.OutputStream"%><%@page contentType="text/html" pageEncoding="UTF-8"
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
Module module = Module.getByName("Planning Read");

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
    
    Country country = currentUser.getCountry();
    List<Subdepartment> subdepartments = new LinkedList<Subdepartment>();
    List<Group> groups = new LinkedList<Group>();
    List<Client> clients = new LinkedList<Client>();
    if(currentUser.getProfile().equals(Employee.Profile.SUPER_USER)) {
         subdepartments = RightsItem.getSubdepartments(currentUser, module, country);
    } else if(currentUser.getProfile().equals(Employee.Profile.COUNTRY_ADMINISTRATOR)) {
         subdepartments.addAll(country.getSubdepartments());
    }
    groups.addAll(country.getGroups());
    Collections.sort(groups, new GroupComparator());
    List<GroupVO> groupVOs = GroupVO.getList(groups);
      
    boolean setCorrectGroupId = false;
    if(request.getParameter("groupId") != null) {
        Group group = (Group)hs.get(Group.class, new Long(request.getParameter("groupId")));
        if(group.getWorkCountry().getId().equals(country.getId())) {
            clients.addAll(group.getClients());
            setCorrectGroupId = true;
        }
    }
    if(! setCorrectGroupId) {
        clients.addAll(country.getClients());
    }
    Collections.sort(clients, new ClientComparator());  
    List<ClientVO> clientVOs = ClientVO.getList(clients);

    List<OfficeDepartmentSubdepartment> subdepartmentVOs = new LinkedList<OfficeDepartmentSubdepartment>();
    for(Subdepartment subdepartment : subdepartments) {
        subdepartmentVOs.add(new OfficeDepartmentSubdepartment(subdepartment));
    }
    Collections.sort(subdepartmentVOs, new OfficeDepartmentSubdepartment.OfficeDepartmentSubdepartmentComparator());
    %>
    {
    "status": "OK",
    "groups": <% gson.toJson(groupVOs, out); %>,
    "clients": <% gson.toJson(clientVOs, out); %>,
    "subdepartments": <% gson.toJson(subdepartmentVOs, out); %>
    }
    <%    
} else if("getGroupContent".equals(command)) {
       List<ClientVO> clientVOs = new LinkedList<ClientVO>();
       Group group = (Group)hs.get(Group.class, new Long(request.getParameter("groupId")));
       List<Client> clients = new LinkedList<Client>();
       if(Employee.Profile.COUNTRY_ADMINISTRATOR.equals(currentUser.getProfile())) {
           clients = new LinkedList<Client>(group.getClients());
       } else if(Employee.Profile.SUPER_USER.equals(currentUser.getProfile())) {
           clients = new LinkedList<Client>(group.getClients());
       }
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
} else if("getNoGroupContent".equals(command)) {
       List<ClientVO> clientVOs = new LinkedList<ClientVO>();
       List<Client> clients = new LinkedList<Client>();
       if(Employee.Profile.COUNTRY_ADMINISTRATOR.equals(currentUser.getProfile())) {
           clients = new LinkedList<Client>(currentUser.getCountry().getClients());
       } else if(Employee.Profile.SUPER_USER.equals(currentUser.getProfile())) {
           clients = new LinkedList<Client>(currentUser.getCountry().getClients());
       }
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
} else if("getPlanningInfo".equals(command)) {
    ClientPlanningReportForm clientPlanningReportForm = ClientPlanningReportForm.getFromJson(request.getParameter("clientPlanningViewerForm"));
    ClientPlanningReport clientPlanningReport = new ClientPlanningReport(clientPlanningReportForm, module, currentUser);
    clientPlanningReport.build();
    ClientPlanningReportVO clientPlanningReportVO = new ClientPlanningReportVO(clientPlanningReport);       
%>
    {
    "status": "OK",
    "clientPlanningReport": <% gson.toJson(clientPlanningReportVO, out); %>
    }
    <%
}
hs.getTransaction().commit();

} catch (Exception ex) {
    hs.getTransaction().rollback();
    %>
    { <% ex.printStackTrace(new PrintWriter(out)); %>
        "status": "FAIL",
        "comment": <% gson.toJson(ex.toString(), out); %>
    }
<%
}
%>