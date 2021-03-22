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
       List<GroupVO> groupVOs = new LinkedList<GroupVO>();
       List<Group> groups = new LinkedList<Group>();
       List<ClientVO> clientVOs = new LinkedList<ClientVO>();
       List<Client> clients = new LinkedList<Client>();
       if(Employee.Profile.COUNTRY_ADMINISTRATOR.equals(currentUser.getProfile())) {
           groups = new LinkedList<Group>(currentUser.getCountry().getGroups());
           clients = new LinkedList<Client>(currentUser.getCountry().getClients());
       } else if(Employee.Profile.SUPER_USER.equals(currentUser.getProfile())) {
           groups = new LinkedList<Group>(currentUser.getCountry().getGroups());
           clients = new LinkedList<Client>(currentUser.getCountry().getClients());
       }
        Collections.sort(groups, new GroupComparator());
        for(Group group : groups) {
            groupVOs.add(new GroupVO(group));
        }
        Collections.sort(clients, new ClientComparator());
        for(Client client : clients) {
            clientVOs.add(new ClientVO(client));
        }

%>
{
"status": "OK",
"groups": <% gson.toJson(groupVOs, out); %>,
"clients": <% gson.toJson(clientVOs, out); %>
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
} else if("getGroup".equals(command)) {       
    Client client = (Client)hs.get(Client.class, new Long(request.getParameter("clientId")));
    GroupVO groupVO = null;
    if(client.getGroup() != null) {
        groupVO = new GroupVO(client.getGroup());
    }
%>
{
"status": "OK",
<% if(groupVO != null) { %>
"group": <% gson.toJson(groupVO, out); %>
<% } else { %>
"group": null
<% } %>
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