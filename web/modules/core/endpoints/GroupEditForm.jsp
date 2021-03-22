<%-- 
    Document   : subdepartments
    Created on : 31.03.2011, 13:08:03
    Author     : glazov
--%><%@page contentType="text/html" pageEncoding="UTF-8"
    import="java.util.*"
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

if("getCountries".equals(command)) {
    List<ISOCountryVO> countryVOs = new LinkedList<ISOCountryVO>();
    for(ISOCountry country : ISOCountry.getAll()) {
        countryVOs.add(new ISOCountryVO(country));
    }
    %>
    {
    "status": "OK",
    "countries": <% gson.toJson(countryVOs, out); %>
    }
    <%
} else if("saveGroup".equals(command)) {
    GroupEditForm groupEditForm = GroupEditForm.getFromJson(request.getParameter("groupEditForm"));
    if(GroupEditForm.Mode.CREATE.equals(groupEditForm.getMode())) {
        Country workCountry = currentUser.getCountry();
        Integer sameNameGroupsCount = Group.getByName(groupEditForm.getName(), workCountry).size();
        if(sameNameGroupsCount > 0) {
            %>{"status": "FAIL", "comment": "Group with the same Name already exists"}<%
        } else {
            ISOCountry country = (ISOCountry)hs.get(ISOCountry.class, groupEditForm.getCountryId());
            Group group = new Group();
            group.setWorkCountry(workCountry);
            group.setName(groupEditForm.getName());
            group.setAlias(groupEditForm.getAlias());
            group.setCountry(country);
            group.setIsListed(groupEditForm.getIsListed());
            group.setIsReferred(groupEditForm.getIsReferred());
            group.setIsMazarsAudit(groupEditForm.getIsMazarsAudit());            
            if(groupEditForm.getIsListed()) {
                ISOCountry listingCountry = (ISOCountry)hs.get(ISOCountry.class, groupEditForm.getListingCountryId());
                group.setListingCountry(listingCountry);
            } else {
                group.setListingCountry(null);
            }
            hs.save(group);
            
            GroupHistoryItem groupHistoryItem = new GroupHistoryItem();
            groupHistoryItem.setName(group.getName());
            groupHistoryItem.setCountryName(country.getName());
            groupHistoryItem.setCreatedAt(new Date());
            groupHistoryItem.setCreatedBy(currentUser);
            groupHistoryItem.setGroup(group);
            hs.save(groupHistoryItem);            
            %>
            {
            "status": "OK"
            }
            <%
        }
    } else if(GroupEditForm.Mode.UPDATE.equals(groupEditForm.getMode())) {
        Group group = (Group)hs.get(Group.class, new Long(groupEditForm.getId()));
        Integer sameNameGroupsCount = 0;
        for(Group groupTmp : Group.getByName(groupEditForm.getName(), group.getWorkCountry())) {
            if(groupTmp.getId() != group.getId()) {
                sameNameGroupsCount++;
            }
        }
        if(sameNameGroupsCount > 0) {
            %>{"status": "FAIL", "comment": "Group with the same Name already exists"}<%
        } else {
            ISOCountry country = (ISOCountry)hs.get(ISOCountry.class, groupEditForm.getCountryId());
            
            Boolean nameOrCountryChanged = false;
            if(! group.getName().equals(groupEditForm.getName()) || ! group.getCountry().equals(country) ) {
                nameOrCountryChanged = true;
            }
            Boolean countryOrIsReferredChanged = false;
            if(! group.getCountry().equals(country) || group.getIsReferred() == null || (! group.getIsReferred().equals(groupEditForm.getIsReferred()))) {
                countryOrIsReferredChanged = true;
            }

            group.setName(groupEditForm.getName());
            group.setAlias(groupEditForm.getAlias());
            group.setCountry(country);
            group.setIsListed(groupEditForm.getIsListed());
            group.setIsReferred(groupEditForm.getIsReferred());
            group.setIsMazarsAudit(groupEditForm.getIsMazarsAudit());            
            if(Boolean.TRUE.equals(groupEditForm.getIsListed())) {
                ISOCountry listingCountry = (ISOCountry)hs.get(ISOCountry.class, groupEditForm.getListingCountryId());
                group.setListingCountry(listingCountry);
            } else {
                group.setListingCountry(null);
            }
            hs.save(group);
            
            if(nameOrCountryChanged) {             
                GroupHistoryItem groupHistoryItem = new GroupHistoryItem();
                groupHistoryItem.setName(group.getName());
                groupHistoryItem.setCountryName(country.getName());
                groupHistoryItem.setCreatedAt(new Date());
                groupHistoryItem.setCreatedBy(currentUser);
                groupHistoryItem.setGroup(group);
                hs.save(groupHistoryItem);                      
            }
            if(countryOrIsReferredChanged) {
                for(Client client : group.getClients()) {
                    client.setCountry(country);
                    client.setIsReferred(groupEditForm.getIsReferred());
                    hs.save(client);
                }
            }
            %>
            {
            "status": "OK"
            }
            <%
        }
    }
} else if("deleteGroup".equals(command)) {
    Group group = (Group)hs.get(Group.class, new Long(request.getParameter("id")));
    hs.delete(group);
    %>
    {
    "status": "OK"
    }
    <%
} else if("checkGroupDependencies".equals(command)) {
    Group group = (Group)hs.get(Group.class, new Long(request.getParameter("id")));
    %>
    {
    "status": "OK",
    "clients": <%=group.getClients().size() %>
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