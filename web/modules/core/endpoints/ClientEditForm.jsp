<%-- 
    Document   : subdepartments
    Created on : 31.03.2011, 13:08:03
    Author     : glazov
--%>
<%@page import="com.mazars.management.web.vo.OfficeDepartmentSubdepartment"%>
<%@page import="com.mazars.management.db.comparators.SubdepartmentComparator"%>
<%@page import="com.mazars.management.db.comparators.ISOCountryComparator"%>
<%@page import="com.mazars.management.db.comparators.ActivitySectorComparator"%>
<%@page contentType="text/html" pageEncoding="UTF-8"
    import="java.util.*"
    import="com.mazars.management.db.domain.*"
    import="com.mazars.management.db.vo.*"
    import="com.mazars.management.web.forms.*"
    import="com.mazars.management.db.util.HibernateUtil"
    import="org.hibernate.Session"
    import="com.google.gson.Gson"
    import="com.mazars.management.web.security.AccessChecker"
    import="com.mazars.management.db.comparators.GroupComparator"
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
    GroupVOH groupVO = null;
    if(request.getParameter("groupId") != null) {
        Group group = (Group)hs.get(Group.class, new Long(request.getParameter("groupId")));
        groupVO = new GroupVOH(group);
    }
    List<ISOCountry> countries = ISOCountry.getAll();
    Collections.sort(countries, new ISOCountryComparator());
    List<ISOCountryVO> countryVOs = ISOCountryVO.getList(countries);

    Country userCountry = currentUser.getCountry();
    List<ActivitySector> activitySectors = ActivitySector.getAll();
    Collections.sort(activitySectors, new ActivitySectorComparator());
    List<ActivitySectorVO> activitySectorVOs = ActivitySectorVO.getList(activitySectors);

    List<Subdepartment> subdepartments = userCountry.getSubdepartments();
    List<OfficeDepartmentSubdepartment> describedSubdepartments = new LinkedList<OfficeDepartmentSubdepartment>();
    for(Subdepartment subdepartment : subdepartments) {
        describedSubdepartments.add(new OfficeDepartmentSubdepartment(subdepartment));
    }
    Collections.sort(describedSubdepartments, new OfficeDepartmentSubdepartment.OfficeDepartmentSubdepartmentComparator());


    %>
    {
    "status": "OK",
    "countries": <% gson.toJson(countryVOs, out); %>,
    <% if(groupVO != null) { %>
    "group": <% gson.toJson(groupVO, out); %>,
    <% } else { %>
    "group": null,
    <% } %>
    "activitySectors": <% gson.toJson(activitySectorVOs, out); %>,
    "subdepartments": <% gson.toJson(describedSubdepartments, out); %>
    }
    <%
} else if("getGroupContent".equals(command)) {
    GroupVOH groupVO = null;
    if(request.getParameter("groupId") != null) {
        Group group = (Group)hs.get(Group.class, new Long(request.getParameter("groupId")));
        groupVO = new GroupVOH(group);
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
} else if("saveClient".equals(command)) {
    ClientEditForm clientEditForm = ClientEditForm.getFromJson(request.getParameter("clientEditForm"));
    Country workCountry = currentUser.getCountry();
    Client client = null;
    if(ClientEditForm.Mode.CREATE.equals(clientEditForm.getMode())) {
        Group group = null;
        if(clientEditForm.getGroupId() != null) {
            group = (Group)hs.get(Group.class, new Long(clientEditForm.getGroupId()));
        }
        ISOCountry listingCountry = null;
        if(clientEditForm.getIsListed() && clientEditForm.getListingCountryId() != null) {
            listingCountry = (ISOCountry)hs.get(ISOCountry.class, new Long(clientEditForm.getListingCountryId()));
        }
        Integer sameNameClientsCount = Client.getByName(clientEditForm.getName(), group).size();
        Integer sameCodeNameClientsCount = Client.getByCodeName(clientEditForm.getCodeName(), group).size();
        if(sameNameClientsCount > 0) {
            throw new Exception("Client with the same Name already exists");
        } else if(sameCodeNameClientsCount > 0) {
            throw new Exception("Client with the same Code Name already exists");
        } else {
            ISOCountry country = null;
            if(clientEditForm.getCountryId() != null) {
                country = (ISOCountry)hs.get(ISOCountry.class, clientEditForm.getCountryId());
            }
            client = new Client();
            client.setWorkCountry(workCountry);
            client.setGroup(group);
            client.setClientGroup(clientEditForm.getClientGroup());
            client.setName(clientEditForm.getName());
            client.setAlias(clientEditForm.getAlias());
            client.setCodeName(clientEditForm.getCodeName());

            ISOCountry postalCountry = null;
            if(clientEditForm.getPostalCountryId() != null) {
                postalCountry = (ISOCountry)hs.get(ISOCountry.class, clientEditForm.getPostalCountryId());
            }            
            client.setPostalStreet(clientEditForm.getPostalStreet());
            client.setPostalZipCode(clientEditForm.getPostalZipCode());
            client.setPostalCity(clientEditForm.getPostalCity());
            client.setPostalCountry(postalCountry);            
            
            if(! Boolean.TRUE.equals(clientEditForm.getIsPostalAddressEqualToLegal())) {
                ISOCountry legalCountry = null;
                if(clientEditForm.getLegalCountryId() != null) {
                    legalCountry = (ISOCountry)hs.get(ISOCountry.class, clientEditForm.getLegalCountryId());
                }

                client.setLegalStreet(clientEditForm.getLegalStreet());
                client.setLegalZipCode(clientEditForm.getLegalZipCode());
                client.setLegalCity(clientEditForm.getLegalCity());
                client.setLegalCountry(legalCountry);
                
                client.setIsPostalAddressEqualToLegal(Boolean.FALSE);
            } else {
                client.setIsPostalAddressEqualToLegal(Boolean.TRUE);
            }
            client.setPhone(clientEditForm.getPhone());
            client.setEmail(clientEditForm.getEmail());
            client.setTaxNumber(clientEditForm.getTaxNumber());
            client.setIsListed(clientEditForm.getIsListed());
            client.setListingCountry(listingCountry);
            client.setIsReferred(clientEditForm.getIsReferred());
            client.setCustomerType(clientEditForm.getCustomerType());
            client.setChannelType(clientEditForm.getChannelType());
            
            client.setIsActive(clientEditForm.getIsActive());
            client.setIsFuture(clientEditForm.getIsFuture());
            client.setIsExternal(clientEditForm.getIsExternal());
            client.setIsTransnational(clientEditForm.getIsTransnational());
            client.setCountry(country);
            client.setListingCountry(listingCountry);
            ClientHistoryItem clientHistoryItem = new ClientHistoryItem();
            client.getClientHistoryItems().add(clientHistoryItem);
            clientHistoryItem.setClient(client);
            clientHistoryItem.setName(clientEditForm.getName());
            clientHistoryItem.setCodeName(clientEditForm.getCodeName());
            clientHistoryItem.setCreatedAt(new Date());
            clientHistoryItem.setCreatedBy(currentUser);
            clientHistoryItem.setGroup(group);
            hs.save(client);
            hs.save(clientHistoryItem);
        }
    } else if(ClientEditForm.Mode.UPDATE.equals(clientEditForm.getMode())) {
        client = (Client)hs.get(Client.class, new Long(clientEditForm.getId()));
        Group group = null;
        if(clientEditForm.getGroupId() != null) {
            group = (Group)hs.get(Group.class, new Long(clientEditForm.getGroupId()));
        }
        ISOCountry listingCountry = null;
        if(clientEditForm.getIsListed() && clientEditForm.getListingCountryId() != null) {
            listingCountry = (ISOCountry)hs.get(ISOCountry.class, new Long(clientEditForm.getListingCountryId()));
        }
        Integer sameNameClientsCount = 0;
        Integer sameCodeNameClientsCount = 0;
        for(Client clientTmp : Client.getByName(clientEditForm.getName(), group)) {
            if(clientTmp.getId() != client.getId()) {
                sameNameClientsCount++;
            }
        }
        for(Client clientTmp : Client.getByCodeName(clientEditForm.getCodeName(), group)) {
            if(clientTmp.getId() != client.getId()) {
                sameCodeNameClientsCount++;
            }
        }
        if(sameNameClientsCount > 0) {
            throw new Exception("Client with the same Name already exists");
        } else if(sameCodeNameClientsCount > 0) {
            throw new Exception("Client with the same Code Name already exists");
        } else {
            ISOCountry country = null;
            if(clientEditForm.getCountryId() != null) {
                country = (ISOCountry)hs.get(ISOCountry.class, clientEditForm.getCountryId());
            }
            ISOCountry postalCountry = null;
            if(clientEditForm.getPostalCountryId() != null) {
                postalCountry = (ISOCountry)hs.get(ISOCountry.class, clientEditForm.getPostalCountryId());
            }            
           
            Boolean nameOrCodeOrGroupChanged = false;
            if(! (client.getName().equals(clientEditForm.getName()) && client.getCodeName().equals(clientEditForm.getCodeName()) && ((client.getGroup() == null && group == null) || (client.getGroup() != null && group != null && client.getGroup().getId().equals(clientEditForm.getGroupId()))) )) {
                nameOrCodeOrGroupChanged = true;
            }
            client.setWorkCountry(workCountry);
            client.setGroup(group);
            client.setClientGroup(clientEditForm.getClientGroup());
            client.setName(clientEditForm.getName());
            client.setAlias(clientEditForm.getAlias());
            client.setCodeName(clientEditForm.getCodeName());

            client.setPostalStreet(clientEditForm.getPostalStreet());
            client.setPostalZipCode(clientEditForm.getPostalZipCode());
            client.setPostalCity(clientEditForm.getPostalCity());
            client.setPostalCountry(postalCountry);
            if(! Boolean.TRUE.equals(clientEditForm.getIsPostalAddressEqualToLegal())) {
                ISOCountry legalCountry = null;
                if(clientEditForm.getLegalCountryId() != null) {
                    legalCountry = (ISOCountry)hs.get(ISOCountry.class, clientEditForm.getLegalCountryId());
                }
                
                client.setIsPostalAddressEqualToLegal(Boolean.FALSE);
                client.setLegalStreet(clientEditForm.getLegalStreet());
                client.setLegalZipCode(clientEditForm.getLegalZipCode());
                client.setLegalCity(clientEditForm.getLegalCity());
                client.setLegalCountry(legalCountry);                
            } else {
                client.setIsPostalAddressEqualToLegal(Boolean.TRUE);
                client.setLegalStreet(null);
                client.setLegalZipCode(null);
                client.setLegalCity(null);
                client.setLegalCountry(null);             
            }           
            client.setPhone(clientEditForm.getPhone());
            client.setEmail(clientEditForm.getEmail());
            client.setTaxNumber(clientEditForm.getTaxNumber());
            client.setIsListed(clientEditForm.getIsListed());
            client.setListingCountry(listingCountry);
            client.setIsReferred(clientEditForm.getIsReferred());
            client.setCustomerType(clientEditForm.getCustomerType());
            client.setChannelType(clientEditForm.getChannelType());
                       
            client.setIsActive(clientEditForm.getIsActive());
            client.setIsFuture(clientEditForm.getIsFuture());
            client.setIsExternal(clientEditForm.getIsExternal());
            client.setIsTransnational(clientEditForm.getIsTransnational());
            client.setCountry(country);

            if(nameOrCodeOrGroupChanged) {
                ClientHistoryItem clientHistoryItem = new ClientHistoryItem();
                client.getClientHistoryItems().add(clientHistoryItem);
                clientHistoryItem.setClient(client);
                clientHistoryItem.setName(clientEditForm.getName());
                clientHistoryItem.setCodeName(clientEditForm.getCodeName());
                clientHistoryItem.setCreatedAt(new Date());
                clientHistoryItem.setCreatedBy(currentUser);
                clientHistoryItem.setGroup(group);
                hs.save(clientHistoryItem);
            }
            hs.save(client);
        }
    }
    List<Long> activitySectorIds = new LinkedList<Long>();
    if(clientEditForm.getActivitySector1Id() != null) {
        activitySectorIds.add(clientEditForm.getActivitySector1Id());
    }
    if(clientEditForm.getActivitySector2Id() != null) {
        activitySectorIds.add(clientEditForm.getActivitySector2Id());
    }
    if(clientEditForm.getActivitySector3Id() != null) {
        activitySectorIds.add(clientEditForm.getActivitySector3Id());
    }
    if(clientEditForm.getActivitySector4Id() != null) {
        activitySectorIds.add(clientEditForm.getActivitySector4Id());
    }
    if(clientEditForm.getActivitySector5Id() != null) {
        activitySectorIds.add(clientEditForm.getActivitySector5Id());
    }    
    for(ClientActivitySectorLink clientActivitySectorLink : client.getClientActivitySectorLinks()) {
        hs.delete(clientActivitySectorLink);
    }
    int i = 0;
    for(Long activitySectorId : activitySectorIds) {
        ClientActivitySectorLink clientActivitySectorLink = new ClientActivitySectorLink();
        clientActivitySectorLink.setClient(client);
        ActivitySector activitySector = (ActivitySector)hs.get(ActivitySector.class, activitySectorId);
        clientActivitySectorLink.setActivitySector(activitySector);
        clientActivitySectorLink.setSortValue(i);
        hs.save(clientActivitySectorLink);
        i++;
    }
    %>
    {
    "status": "OK"
    }
    <%
} else if("deleteClient".equals(command)) {
    Client client = (Client)hs.get(Client.class, new Long(request.getParameter("id")));
    for(ClientHistoryItem clientHistoryItem : client.getClientHistoryItems()) {
        hs.delete(clientHistoryItem);
    }
    for(ClientActivitySectorLink clientActivitySectorLink : client.getClientActivitySectorLinks()) {
        hs.delete(clientActivitySectorLink);
    }
    for(SubdepartmentClientLink subdepartmentClientLink : client.getSubdepartmentClientLinks()) {
        hs.delete(subdepartmentClientLink);
    }
    hs.delete(client);
    %>
    {
    "status": "OK"
    }
    <%
} else if("checkClientDependencies".equals(command)) {
    Client client = (Client)hs.get(Client.class, new Long(request.getParameter("id")));
    %>
    {
    "status": "OK",
    "projectCodes": <%=client.getProjectCodes().size() %>,
    "contacts": <%=client.getContactClientLinks().size() %>,
    "actRequests": <%=client.getActRequests().size() %>,
    "invoiceRequests": <%=client.getInvoiceRequests().size() %>,
    "planningGroups": <%=client.getPlanningGroups().size() %>
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