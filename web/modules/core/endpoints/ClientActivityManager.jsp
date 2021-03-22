<%-- 
    Document   : subdepartments
    Created on : 31.03.2011, 13:08:03
    Author     : glazov
--%>
<%@page import="com.mazars.management.web.vo.DescribedClientWithProjectAndFinancialActivityInfoItemVO"%>
<%@page import="com.mazars.management.web.vo.EmployeeContactLinkVO"%>
<%@page import="com.mazars.management.web.comparators.DescribedClientComparator"%>
<%@page import="com.mazars.management.web.vo.DescribedClient"%>
<%@page import="com.mazars.management.db.util.ClientListUtil"%>
<%@page import="com.mazars.management.db.util.CalendarUtil"%>
<%@page import="com.mazars.management.web.vo.ConciseEmployee"%>
<%@page import="com.mazars.management.web.vo.OfficeDepartmentSubdepartment"%>
<%@page import="com.mazars.management.db.comparators.ActivitySectorComparator"%>
<%@page import="java.io.PrintWriter"%>
<%@page import="com.mazars.management.db.comparators.ContactComparator"%>
<%@page contentType="text/html" pageEncoding="UTF-8"
    import="java.util.*"
    import="com.mazars.management.db.domain.*"
    import="com.mazars.management.db.vo.*"
    import="com.mazars.management.web.forms.*"
    import="com.mazars.management.db.util.HibernateUtil"
    import="org.hibernate.Session"
    import="com.google.gson.Gson"
    import="com.mazars.management.db.comparators.GroupComparator"
    import="com.mazars.management.db.comparators.ClientComparator"
    import="com.mazars.management.db.comparators.ClientHistoryItemComparator"
    import="com.mazars.management.web.vo.ClientHistoryItemWithGroupAndCreatedByVO"
    import="com.mazars.management.web.security.AccessChecker"
%><%
request.setCharacterEncoding("UTF-8");
Employee currentUser = (Employee)session.getAttribute("currentUser");
String command = request.getParameter("command");
Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
Gson gson = new Gson();
try {
hs.beginTransaction();
Module module = Module.getByName("Clients");

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
    ClientListFilter clientFilter = ClientListFilter.getFromJson(request.getParameter("clientFilter"));
    ClientActivityFilter clientActivityFilter = ClientActivityFilter.getFromJson(request.getParameter("clientActivityFilter"));
    ClientListSorter sorter = ClientListSorter.getFromJson(request.getParameter("sorter"));
    ProjectCodeListLimiter limiter = ProjectCodeListLimiter.getFromJson(request.getParameter("limiter"));
    Country userCountry = currentUser.getCountry();
    
    List<Client> clients = ClientListUtil.getClientFilteredList(clientFilter, clientActivityFilter, sorter, limiter, currentUser, module);
    Calendar startDate = null;
    if(clientActivityFilter.getStartDate() != null) {
        startDate = clientActivityFilter.getStartDate().getCalendar();
    }
    Calendar endDate = null;
    if(clientActivityFilter.getEndDate() != null) {
        endDate = clientActivityFilter.getEndDate().getCalendar();
    }
    List<ClientListUtil.DescribedClientWithProjectAndFinancialActivityInfoItem> describedClientWithProjectAndFinancialActivityInfoItems = new LinkedList<ClientListUtil.DescribedClientWithProjectAndFinancialActivityInfoItem>();
    ClientListUtil.mergeWithDescribedClients(describedClientWithProjectAndFinancialActivityInfoItems, ClientListUtil.getDescribedClients(clients));
    ClientListUtil.joinProjectActivityInfoItems(describedClientWithProjectAndFinancialActivityInfoItems, ClientListUtil.getClientProjectActivityInfoItems(clients, startDate, endDate) );
    List<DescribedClientWithProjectAndFinancialActivityInfoItemVO> clientActivityInfoItemVOs = DescribedClientWithProjectAndFinancialActivityInfoItemVO.getList(describedClientWithProjectAndFinancialActivityInfoItems);
    
    Long totalClientsCount = new Long(userCountry.getClients().size());
    Long foundClientsCount = ClientListUtil.getCountOfClientFilteredList(clientFilter, clientActivityFilter, sorter, limiter, currentUser, module);
   
    List<OfficeDepartmentSubdepartment> describedSubdepartments = new LinkedList<OfficeDepartmentSubdepartment>();
    for(Subdepartment subdepartment : userCountry.getSubdepartments()) {
        describedSubdepartments.add(new OfficeDepartmentSubdepartment(subdepartment));
    }
    Collections.sort(describedSubdepartments, new OfficeDepartmentSubdepartment.OfficeDepartmentSubdepartmentComparator());
    %>
    {
        "status": "OK",
        "clientActivityInfoItems": <% gson.toJson(clientActivityInfoItemVOs, out); %>,
        "totalClientsCount": <%=totalClientsCount %>,
        "foundClientsCount": <%=foundClientsCount %>,
        "subdepartments": <% gson.toJson(describedSubdepartments, out); %>
    }
    <%
} else if("getClients".equals(command)) {
    ClientListFilter clientFilter = ClientListFilter.getFromJson(request.getParameter("clientFilter"));
    ClientActivityFilter clientActivityFilter = ClientActivityFilter.getFromJson(request.getParameter("clientActivityFilter"));
    ClientListSorter sorter = ClientListSorter.getFromJson(request.getParameter("sorter"));
    ProjectCodeListLimiter limiter = ProjectCodeListLimiter.getFromJson(request.getParameter("limiter"));
    
    Country userCountry = currentUser.getCountry();
    List<Client> clients = ClientListUtil.getClientFilteredList(clientFilter, clientActivityFilter, sorter, limiter, currentUser, module);
    Calendar startDate = null;
    if(clientActivityFilter.getStartDate() != null) {
        startDate = clientActivityFilter.getStartDate().getCalendar();
    }
    Calendar endDate = null;
    if(clientActivityFilter.getEndDate() != null) {
        endDate = clientActivityFilter.getEndDate().getCalendar();
    }
    List<ClientListUtil.DescribedClientWithProjectAndFinancialActivityInfoItem> describedClientWithProjectAndFinancialActivityInfoItems = new LinkedList<ClientListUtil.DescribedClientWithProjectAndFinancialActivityInfoItem>();
    ClientListUtil.mergeWithDescribedClients(describedClientWithProjectAndFinancialActivityInfoItems, ClientListUtil.getDescribedClients(clients));
    ClientListUtil.joinProjectActivityInfoItems(describedClientWithProjectAndFinancialActivityInfoItems, ClientListUtil.getClientProjectActivityInfoItems(clients, startDate, endDate) );
    List<DescribedClientWithProjectAndFinancialActivityInfoItemVO> clientActivityInfoItemVOs = DescribedClientWithProjectAndFinancialActivityInfoItemVO.getList(describedClientWithProjectAndFinancialActivityInfoItems);

    Long totalClientsCount = new Long(userCountry.getClients().size());
    Long foundClientsCount = ClientListUtil.getCountOfClientFilteredList(clientFilter, clientActivityFilter, sorter, limiter, currentUser, module);
    %>
    {
        "status": "OK",
        "clientActivityInfoItems": <% gson.toJson(clientActivityInfoItemVOs, out); %>,
        "totalClientsCount": <%=totalClientsCount %>,
        "foundClientsCount": <%=foundClientsCount %>
    }
    <%
} else if("setActive".equals(command)) {
    List<Long> clientIds = ListOfLong.getFromJson(request.getParameter("clientIds")).getList();
    Boolean isActive = Boolean.parseBoolean(request.getParameter("isActive"));
    for(Long clientId : clientIds) {
        Client client = (Client)hs.get(Client.class, clientId);
        client.setIsActive(isActive);
        hs.save(client);
    }
    %>
    {
        "status": "OK"
    }<%    
} else if("getContentForClient".equals(command)) {
    Client client = (Client)hs.get(Client.class, new Long(request.getParameter("clientId")));
    ClientVOH clientVO = new ClientVOH(client);
    GroupVOH groupVO = null;
    if(client.getGroup() != null) {
        groupVO = new GroupVOH(client.getGroup());
    }
    List<ClientHistoryItemWithGroupAndCreatedByVO> clientHistoryItemVOs = new LinkedList<ClientHistoryItemWithGroupAndCreatedByVO>();
    List<ClientHistoryItem> clientHistoryItems = new LinkedList<ClientHistoryItem>(client.getClientHistoryItems());
    Collections.sort(clientHistoryItems, new ClientHistoryItemComparator());
    Collections.reverse(clientHistoryItems);
    for(ClientHistoryItem clientHistoryItem : clientHistoryItems) {
        clientHistoryItemVOs.add(new ClientHistoryItemWithGroupAndCreatedByVO(clientHistoryItem));
    }   
    List<SubdepartmentClientLinkVO> subdepartmentClientLinkVOs = SubdepartmentClientLinkVO.getList(new LinkedList<SubdepartmentClientLink>(client.getSubdepartmentClientLinks()));
    %>
    
    {
        "status": "OK",
        <% if(groupVO != null) { %>
        "group": <% gson.toJson(groupVO, out); %>,
        <% } else { %>
        "group": null,
        <% } %>
        "client": <% gson.toJson(clientVO, out); %>,
        "subdepartmentClientLinks": <% gson.toJson(subdepartmentClientLinkVOs, out); %>,
        "clientHistoryItems": <% gson.toJson(clientHistoryItemVOs, out); %>
    }
    <%
}
hs.getTransaction().commit();

} catch (Exception ex) {
    %><% ex.printStackTrace(new PrintWriter(out)); %><%
    hs.getTransaction().rollback();
    %>
    {
        "status": "FAIL",
        "comment": <% gson.toJson(ex.toString(), out); %>
        }
    <%
}
%>