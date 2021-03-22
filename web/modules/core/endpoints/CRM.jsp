<%-- 
    Document   : subdepartments
    Created on : 31.03.2011, 13:08:03
    Author     : glazov
--%>
<%@page import="com.mazars.management.web.vo.GroupHistoryItemWithCreatedByVO"%>
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
    
    ClientListFilter filter = ClientListFilter.getFromJson(request.getParameter("filter"));
    ClientListSorter sorter = ClientListSorter.getFromJson(request.getParameter("sorter"));
    ProjectCodeListLimiter limiter = ProjectCodeListLimiter.getFromJson(request.getParameter("limiter"));
    
    Country userCountry = currentUser.getCountry();
    List<GroupVO> groupVOs = new LinkedList<GroupVO>();
    List<DescribedClient> clientVOs = new LinkedList<DescribedClient>();
    List<ISOCountryVO> countryVOs = new LinkedList<ISOCountryVO>();
    List<LanguageVO> languageVOs = new LinkedList<LanguageVO>();
    List<ActivitySectorVO> activitySectorVOs = new LinkedList<ActivitySectorVO>();
    for(Language language : Language.getAll()) {
        languageVOs.add(new LanguageVO(language));
    }
    List<Group> groups = new LinkedList<Group>();
    groups.addAll(userCountry.getGroups());
    Collections.sort(groups, new GroupComparator());
    for(Group group : groups) {
        groupVOs.add(new GroupVO(group));
    }
    List<Client> clients = ClientListUtil.getClientFilteredList(filter, sorter, limiter, currentUser, module);
    for(ClientListUtil.DescribedClient describedClient : ClientListUtil.getDescribedClients(clients)) {
        clientVOs.add(new DescribedClient(describedClient));
    }
    Collections.sort(clientVOs, new DescribedClientComparator());
    Long totalClientsCount = new Long(userCountry.getClients().size());
    Long foundClientsCount = ClientListUtil.getCountOfClientFilteredList(filter, sorter, limiter, currentUser, module);
    for(ISOCountry country : ISOCountry.getAll()) {
        countryVOs.add(new ISOCountryVO(country));
    }
    
    List<OfficeDepartmentSubdepartment> describedSubdepartments = new LinkedList<OfficeDepartmentSubdepartment>();
    for(Subdepartment subdepartment : userCountry.getSubdepartments()) {
        describedSubdepartments.add(new OfficeDepartmentSubdepartment(subdepartment));
    }
    Collections.sort(describedSubdepartments, new OfficeDepartmentSubdepartment.OfficeDepartmentSubdepartmentComparator());
    
    List<ActivitySector> activitySectors = ActivitySector.getAll();
    Collections.sort(activitySectors, new ActivitySectorComparator());
    activitySectorVOs = ActivitySectorVO.getList(activitySectors);
    %>
    {
        "status": "OK",
        "languages": <% gson.toJson(languageVOs, out); %>,
        "countries": <% gson.toJson(countryVOs, out); %>,
        "groups": <% gson.toJson(groupVOs, out); %>,
        "clients": <% gson.toJson(clientVOs, out); %>,
        "totalClientsCount": <%=totalClientsCount %>,
        "foundClientsCount": <%=foundClientsCount %>,
        "subdepartments": <% gson.toJson(describedSubdepartments, out); %>,
        "activitySectors": <% gson.toJson(activitySectorVOs, out); %>
    }
    <%
} else if("getClients".equals(command)) {
    ClientListFilter filter = ClientListFilter.getFromJson(request.getParameter("filter"));
    ClientListSorter sorter = ClientListSorter.getFromJson(request.getParameter("sorter"));
    ProjectCodeListLimiter limiter = ProjectCodeListLimiter.getFromJson(request.getParameter("limiter"));
    
    Country userCountry = currentUser.getCountry();
    List<DescribedClient> clientVOs = new LinkedList<DescribedClient>();
    List<Client> clients = ClientListUtil.getClientFilteredList(filter, sorter, limiter, currentUser, module);
    for(ClientListUtil.DescribedClient describedClient : ClientListUtil.getDescribedClients(clients)) {
        clientVOs.add(new DescribedClient(describedClient));
    }
    Collections.sort(clientVOs, new DescribedClientComparator());
    Long totalClientsCount = new Long(userCountry.getClients().size());
    Long foundClientsCount = ClientListUtil.getCountOfClientFilteredList(filter, sorter, limiter, currentUser, module);
    %>
    {
        "status": "OK",
        "clients": <% gson.toJson(clientVOs, out); %>,
        "totalClientsCount": <%=totalClientsCount %>,
        "foundClientsCount": <%=foundClientsCount %>
    }
    <%
} else if("getContentForGroup".equals(command)) {
    ClientListFilter filter = ClientListFilter.getFromJson(request.getParameter("filter"));
    ClientListSorter sorter = ClientListSorter.getFromJson(request.getParameter("sorter"));
    ProjectCodeListLimiter limiter = ProjectCodeListLimiter.getFromJson(request.getParameter("limiter"));
    
    Group group = (Group)hs.get(Group.class, new Long(request.getParameter("groupId")));
    Country userCountry = currentUser.getCountry();
    GroupVOH groupVO = new GroupVOH(group);
    List<GroupHistoryItemWithCreatedByVO> groupHistoryItemVOs = new LinkedList<GroupHistoryItemWithCreatedByVO>();
    for(GroupHistoryItem groupHistoryItem : group.getGroupHistoryItems()) {
        groupHistoryItemVOs.add(new GroupHistoryItemWithCreatedByVO(groupHistoryItem));
    }

    List<DescribedClient> clientVOs = new LinkedList<DescribedClient>();
    List<Client> clients = ClientListUtil.getClientFilteredList(filter, sorter, limiter, currentUser, module);
    for(ClientListUtil.DescribedClient describedClient : ClientListUtil.getDescribedClients(clients)) {
        clientVOs.add(new DescribedClient(describedClient));
    }
    Collections.sort(clientVOs, new DescribedClientComparator());

    Long totalClientsCount = new Long(userCountry.getClients().size());
    Long foundClientsCount = ClientListUtil.getCountOfClientFilteredList(filter, sorter, limiter, currentUser, module);    
    %>
    {
        "status": "OK",
        "group": <% gson.toJson(groupVO, out); %>,
        "groupHistoryItems": <% gson.toJson(groupHistoryItemVOs, out); %>,
        "clients": <% gson.toJson(clientVOs, out); %>,
        "totalClientsCount": <%=totalClientsCount %>,
        "foundClientsCount": <%=foundClientsCount %>
    }
    <%
} else if("getContentForClient".equals(command)) {
    Client client = (Client)hs.get(Client.class, new Long(request.getParameter("clientId")));
    ClientVOH clientVO = new ClientVOH(client);
    GroupVOH groupVO = null;
    List<GroupHistoryItemWithCreatedByVO> groupHistoryItemVOs = new LinkedList<GroupHistoryItemWithCreatedByVO>();
    if(client.getGroup() != null) {
        groupVO = new GroupVOH(client.getGroup());
        for(GroupHistoryItem groupHistoryItem : client.getGroup().getGroupHistoryItems()) {
            groupHistoryItemVOs.add(new GroupHistoryItemWithCreatedByVO(groupHistoryItem));
        }        
    }
    List<ClientHistoryItemWithGroupAndCreatedByVO> clientHistoryItemVOs = new LinkedList<ClientHistoryItemWithGroupAndCreatedByVO>();
    List<ClientHistoryItem> clientHistoryItems = new LinkedList<ClientHistoryItem>(client.getClientHistoryItems());
    Collections.sort(clientHistoryItems, new ClientHistoryItemComparator());
    Collections.reverse(clientHistoryItems);
    for(ClientHistoryItem clientHistoryItem : clientHistoryItems) {
        clientHistoryItemVOs.add(new ClientHistoryItemWithGroupAndCreatedByVO(clientHistoryItem));
    }
    List<Contact> contacts = new LinkedList<Contact>(client.getContacts());
    Collections.sort(contacts, new ContactComparator());
    List<ContactVO> contactVOs = ContactVO.getList(contacts);
    
    List<SubdepartmentClientLinkVO> subdepartmentClientLinkVOs = SubdepartmentClientLinkVO.getList(new LinkedList<SubdepartmentClientLink>(client.getSubdepartmentClientLinks()));
            
    Calendar end = CalendarUtil.getToday();
    Calendar start = CalendarUtil.getToday();
    start.add(Calendar.DATE, -183);
    Map<Subdepartment, Long> projectCodeCounts = client.getProjectCodeCountsForSubdepartments(start, end);
    YearMonthDate startDate = new YearMonthDate(start);
    YearMonthDate endDate = new YearMonthDate(end);
    Map<Long, Long> projectCodeCountsVO = new HashMap<Long, Long>();
    for(Subdepartment subdepartment : projectCodeCounts.keySet()) {
        projectCodeCountsVO.put(subdepartment.getId(), projectCodeCounts.get(subdepartment));
    }
    List<OfficeDepartmentSubdepartment> projectCodeSubdepartmentVOs = new LinkedList<OfficeDepartmentSubdepartment>();
    for(Subdepartment subdepartment : projectCodeCounts.keySet()) {
        projectCodeSubdepartmentVOs.add(new OfficeDepartmentSubdepartment(subdepartment));
    }
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
        "groupHistoryItems": <% gson.toJson(groupHistoryItemVOs, out); %>,
        "clientHistoryItems": <% gson.toJson(clientHistoryItemVOs, out); %>,
        "contacts": <% gson.toJson(contactVOs, out); %>,
        "projectCodeCounts": <% gson.toJson(projectCodeCountsVO, out); %>,
        "projectCodeSubdepartments": <% gson.toJson(projectCodeSubdepartmentVOs, out); %>,
        "projectCodeCountsStart": <% gson.toJson(startDate, out); %>,
        "projectCodeCountsEnd": <% gson.toJson(endDate, out); %>
    }
    <%
} else if("getContact".equals(command)) {
    Contact contact = (Contact)hs.get(Contact.class, new Long(request.getParameter("contactId")));
    ContactVOH contactVO = new ContactVOH(contact);
    List<EmployeeContactLink> employeeContactLinks = new LinkedList<EmployeeContactLink>(contact.getEmployeeContactLinks());
    List<EmployeeContactLinkVO> employeeContactLinkVOs = EmployeeContactLinkVO.getList(employeeContactLinks);
    %>
    {
        "status": "OK",
        "contact": <% gson.toJson(contactVO, out); %>,
        "employeeContactLinks": <% gson.toJson(employeeContactLinkVOs, out); %>
    }
    <%
} else if("getProjectCodes".equals(command)) {
    Client client = (Client)hs.get(Client.class, new Long(request.getParameter("clientId")));
    Calendar end = CalendarUtil.getToday();
    Calendar start = CalendarUtil.getToday();
    start.add(Calendar.DATE, -183);
    List<ProjectCode> projectCodes = client.getProjectCodes(start, end);
    List<ProjectCodeVODetailed> projectCodeVOs = new LinkedList<ProjectCodeVODetailed>();
    for(ProjectCode projectCode : projectCodes) {
        projectCodeVOs.add(new ProjectCodeVODetailed(projectCode));
    }
    %>
    {
        "status": "OK",
        "projectCodes": <% gson.toJson(projectCodeVOs, out); %>
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