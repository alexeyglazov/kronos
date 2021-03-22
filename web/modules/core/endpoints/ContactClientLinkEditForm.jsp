<%-- 
    Document   : subdepartments
    Created on : 31.03.2011, 13:08:03
    Author     : glazov
--%><%@page import="com.mazars.management.web.vo.ConciseEmployee"%>
<%@page contentType="text/html" pageEncoding="UTF-8"
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

if("getInitialContent".equals(command)) {
    ContactVO contactVO = null;
    if(request.getParameter("contactId") != null && ! request.getParameter("contactId").trim().equals("")) {
        Contact contact = (Contact)hs.get(Contact.class, new Long(request.getParameter("contactId")));
        contactVO = new ContactVO(contact);
    }
    ClientVO clientVO = null;
    if(request.getParameter("clientId") != null && ! request.getParameter("clientId").trim().equals("")) {
        Client client = (Client)hs.get(Client.class, new Long(request.getParameter("clientId")));
        clientVO = new ClientVO(client);
    }
    %>
    {
    "status": "OK",
    <% if(contactVO != null) { %>
    "contact": <% gson.toJson(contactVO, out); %>,
    <% } else { %>
    "contact": null,
    <% } %>
    <% if(clientVO != null) { %>
    "client": <% gson.toJson(clientVO, out); %>
    <% } else { %>
    "client": null
    <% } %>
    }
    <%    
} else if("getContactContent".equals(command)) {
    ContactVO contactVO = null;
    if(request.getParameter("contactId") != null && ! request.getParameter("contactId").trim().equals("")) {
        Contact contact = (Contact)hs.get(Contact.class, new Long(request.getParameter("contactId")));
        contactVO = new ContactVO(contact);
    }
    %>
    {
    "status": "OK",
    <% if(contactVO != null) { %>
    "contact": <% gson.toJson(contactVO, out); %>
    <% } else { %>
    "contact": null
    <% } %>
    }
    <%    
} else if("saveContactClientLink".equals(command)) {
    ContactClientLinkEditForm contactClientLinkEditForm = ContactClientLinkEditForm.getFromJson(request.getParameter("contactClientLinkEditForm"));
    
    Date now = new Date();
    Contact contact = (Contact)hs.get(Contact.class, contactClientLinkEditForm.getContactId());
    Client client = (Client)hs.get(Client.class, contactClientLinkEditForm.getClientId());
    for(ContactClientLink contactClientLink : contact.getContactClientLinks()) {
        if(contactClientLink.getClient().getId().equals(client.getId())) {
            throw new Exception("This link already exists.");
        }
    }
    ContactClientLink contactClientLink = null;
    String comment = null;
    boolean createContactHistoryItem = false;
    if(ContactClientLinkEditForm.Mode.CREATE.equals(contactClientLinkEditForm.getMode())) {
        contactClientLink = new ContactClientLink();
        comment = "Client (" + client.getName() + ") has been assigned to this contact (" + contact.getFirstName() + " " + contact.getLastName() + ")";
        createContactHistoryItem = true;
    } else if(ContactClientLinkEditForm.Mode.UPDATE.equals(contactClientLinkEditForm.getMode())) {
        contactClientLink = (ContactClientLink)hs.get(ContactClientLink.class, contactClientLinkEditForm.getId());
        boolean clientModified = false;
        boolean contactModified = false;
        if(! contactClientLink.getClient().getId().equals(client.getId())) {
            clientModified = true;
        }
        if(! contactClientLink.getContact().getId().equals(contact.getId())) {
            contactModified = true;
        }
        if(clientModified || contactModified) {
            createContactHistoryItem = true;
            comment = "Contact-Client Link has been modified. ";
            if(clientModified) {
                comment += "Client (" + contactClientLink.getClient().getName() + ") changed to (" + client.getName() + "). "; 
            }
            if(contactModified) {
                comment += "Contact (" + contactClientLink.getContact().getFirstName() + " " + contactClientLink.getContact().getLastName() + ") changed to (" + contact.getFirstName() + " " + contact.getLastName() + "). "; 
            }
        }
    }    
    contactClientLink.setContact(contact);
    contactClientLink.setClient(client);
    hs.save(contactClientLink);

    if(createContactHistoryItem) {
        ContactHistoryItem contactHistoryItem = new ContactHistoryItem();
        contactHistoryItem.setContact(contactClientLink.getContact());
        contactHistoryItem.setModifiedAt(now);
        contactHistoryItem.setModifiedBy(currentUser);
        contactHistoryItem.setStatus(ContactHistoryItem.Status.MODIFIED);
        contactHistoryItem.setComment(comment);
        hs.save(contactHistoryItem);
    }
    %>
    {
    "status": "OK"
    }
    <%
} else if("deleteContactClientLink".equals(command)) {
    ContactClientLink contactClientLink = (ContactClientLink)hs.get(ContactClientLink.class, new Long(request.getParameter("id")));
    
    Client client = contactClientLink.getClient();
    Contact contact = contactClientLink.getContact();
    if(contact.getContactClientLinks().size() < 2) {
        throw new Exception("Contact should be assigned to one client at least");
    }
    Date now = new Date();
    String comment = "Client (" + client.getName() + ") has been unassigned from this contact (" + contact.getFirstName() + " " + contact.getLastName() + ")";
    ContactHistoryItem contactHistoryItem = new ContactHistoryItem();
    contactHistoryItem.setContact(contactClientLink.getContact());
    contactHistoryItem.setModifiedAt(now);
    contactHistoryItem.setModifiedBy(currentUser);
    contactHistoryItem.setStatus(ContactHistoryItem.Status.MODIFIED);
    contactHistoryItem.setComment(comment);
    hs.save(contactHistoryItem);
    
    hs.delete(contactClientLink);
    %>
    {
    "status": "OK"
    }
    <%
} else if("checkEmployeeContactLinkDependencies".equals(command)) {
    ContactClientLink contactClientLink = (ContactClientLink)hs.get(ContactClientLink.class, new Long(request.getParameter("id")));
    
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