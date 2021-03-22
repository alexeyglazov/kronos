<%-- 
    Document   : subdepartments
    Created on : 31.03.2011, 13:08:03
    Author     : glazov
--%>
<%@page import="com.mazars.management.web.comparators.ClientAndGroupComparator"%>
<%@page import="com.mazars.management.web.vo.ClientAndGroupVO"%>
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
    List<Client> clients = new LinkedList<Client>(country.getClients());   
    List<ClientAndGroupVO> clientAndGroupVOs = new LinkedList<ClientAndGroupVO>();
    for(Client client : clients) {
        ClientAndGroupVO clientAndGroupVO = new ClientAndGroupVO(client, client.getGroup());
        clientAndGroupVOs.add(clientAndGroupVO);
    }
    Collections.sort(clientAndGroupVOs, new ClientAndGroupComparator());
%>
{
"status": "OK",
"clients": <% gson.toJson(clientAndGroupVOs, out); %>
}
<%
} else if("save".equals(command)) {
    ColorMapperForm colorMapperForm = ColorMapperForm.getFromJson(request.getParameter("form"));
    for(Long id : colorMapperForm.getChangedClientColors().keySet()) {
        String color = colorMapperForm.getChangedClientColors().get(id);
        Client client = (Client)hs.get(Client.class, id);
        client.setColor(color);
        hs.save(client);
    }
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