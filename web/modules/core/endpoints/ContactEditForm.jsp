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

if("getInitialContent".equals(command)) {
    ClientVO clientVO = null;
    if(request.getParameter("clientId") != null && ! request.getParameter("clientId").trim().equals("")) {
        Client client = (Client)hs.get(Client.class, new Long(request.getParameter("clientId")));
        clientVO = new ClientVO(client);
    }
    List<ISOCountryVO> countryVOs = new LinkedList<ISOCountryVO>();
    List<LanguageVO> languageVOs = new LinkedList<LanguageVO>();
    for(ISOCountry country : ISOCountry.getAll()) {
        countryVOs.add(new ISOCountryVO(country));
    }
    for(Language language : Language.getAll()) {
        languageVOs.add(new LanguageVO(language));
    }
    %>
    {
    "status": "OK",
    <% if(clientVO != null) { %>
    "client": <% gson.toJson(clientVO, out); %>,
    <% } %>
    "countries": <% gson.toJson(countryVOs, out); %>,
    "languages": <% gson.toJson(languageVOs, out); %>
    }
    <%
} else if("saveContact".equals(command)) {
    ContactEditForm contactEditForm = ContactEditForm.getFromJson(request.getParameter("contactEditForm"));
    
    Contact contact = null;
    ContactClientLink contactClientLink = new ContactClientLink();
    if(ContactEditForm.Mode.CREATE.equals(contactEditForm.getMode())) {
        contact = new Contact();
        Client client = (Client)hs.get(Client.class, new Long(contactEditForm.getClientId()));
        contactClientLink.setContact(contact);
        contactClientLink.setClient(client);
    } else if(ContactEditForm.Mode.UPDATE.equals(contactEditForm.getMode())) {
        contact = (Contact)hs.get(Contact.class, new Long(contactEditForm.getId()));
    }    
    
    ISOCountry residencialCountry = null;
    if(contactEditForm.getResidencialCountryId() != null) {
        residencialCountry = (ISOCountry)hs.get(ISOCountry.class, contactEditForm.getResidencialCountryId());
    }

    ContactHistoryItem.Status activeStatus = null;
    if(Boolean.TRUE.equals(contactEditForm.getIsActive()) && ! Boolean.TRUE.equals(contact.getIsActive())) {
        activeStatus = ContactHistoryItem.Status.SET_ACTIVE;
    } else if(Boolean.FALSE.equals(contactEditForm.getIsActive()) && ! Boolean.FALSE.equals(contact.getIsActive())) {
        activeStatus = ContactHistoryItem.Status.SET_INACTIVE;
    }
    contact.setGender(contactEditForm.getGender());
    contact.setFirstName(contactEditForm.getFirstName());
    contact.setLastName(contactEditForm.getLastName());
    contact.setFirstNameLocalLanguage(contactEditForm.getFirstNameLocalLanguage());
    contact.setLastNameLocalLanguage(contactEditForm.getLastNameLocalLanguage());
    contact.setNormalPosition(contactEditForm.getNormalPosition());
    if(Contact.NormalPosition.OTHER.equals(contactEditForm.getNormalPosition())) {
        contact.setOtherNormalPosition(contactEditForm.getOtherNormalPosition());
    } else {
        contact.setOtherNormalPosition(null);
    }
    contact.setComment(contactEditForm.getComment());
    contact.setDirectPhone(contactEditForm.getDirectPhone());
    contact.setMobilePhone(contactEditForm.getMobilePhone());
    contact.setEmail(contactEditForm.getEmail());
    contact.setLanguage(contactEditForm.getLanguage());
    if(Boolean.FALSE.equals(contactEditForm.getIsClientsAddressUsed())) {
        ISOCountry country = null;
        if(contactEditForm.getCountryId() != null) {
            country = (ISOCountry)hs.get(ISOCountry.class, contactEditForm.getCountryId());
        }
        contact.setIsClientsAddressUsed(false);
        contact.setStreet(contactEditForm.getStreet());
        contact.setZipCode(contactEditForm.getZipCode());
        contact.setCity(contactEditForm.getCity());
        contact.setCountry(country);
    } else {
        contact.setIsClientsAddressUsed(true);
        contact.setStreet(null);
        contact.setZipCode(null);
        contact.setCity(null);
        contact.setCountry(null);        
    }         
    contact.setResidencialCountry(residencialCountry);
    contact.setIsNewsletters(contactEditForm.getIsNewsletters());
    contact.setIsReminder(contactEditForm.getIsReminder());
    contact.setPresentType(contactEditForm.getPresentType());
    contact.setIsActive(contactEditForm.getIsActive());
    hs.save(contact);

    if(ContactEditForm.Mode.CREATE.equals(contactEditForm.getMode())) {
        hs.save(contactClientLink);
    }
    
    Date now = new Date();
    if(ContactEditForm.Mode.CREATE.equals(contactEditForm.getMode())) {
        ContactHistoryItem contactHistoryItem = new ContactHistoryItem();
        contactHistoryItem.setContact(contact);
        contactHistoryItem.setComment("Contact created");
        contactHistoryItem.setModifiedAt(now);
        contactHistoryItem.setModifiedBy(currentUser);
        contactHistoryItem.setStatus(ContactHistoryItem.Status.CREATED);
        hs.save(contactHistoryItem);
    } else if(ContactEditForm.Mode.UPDATE.equals(contactEditForm.getMode())) {
        ContactHistoryItem contactHistoryItem = new ContactHistoryItem();
        contactHistoryItem.setContact(contact);
        contactHistoryItem.setComment("Contact modified");
        contactHistoryItem.setModifiedAt(now);
        contactHistoryItem.setModifiedBy(currentUser);
        contactHistoryItem.setStatus(ContactHistoryItem.Status.MODIFIED);
        hs.save(contactHistoryItem);

        if(activeStatus != null) {
            ContactHistoryItem contactHistoryItem2 = new ContactHistoryItem();
            contactHistoryItem2.setContact(contact);
            contactHistoryItem2.setComment(contactEditForm.getReason());
            contactHistoryItem2.setModifiedAt(now);
            contactHistoryItem2.setModifiedBy(currentUser);
            contactHistoryItem2.setStatus(activeStatus);
            hs.save(contactHistoryItem2);
        }
    }
    %>   
    {
    "status": "OK"
    }
    <%
} else if("deleteContact".equals(command)) {
    Contact contact = (Contact)hs.get(Contact.class, new Long(request.getParameter("id")));
    for(ContactHistoryItem contactHistoryItem : contact.getContactHistoryItems()) {
        hs.delete(contactHistoryItem);
    }
    for(EmployeeContactLink employeeContactLink : contact.getEmployeeContactLinks()) {
        hs.delete(employeeContactLink);
    }            
    for(ContactClientLink contactClientLink : contact.getContactClientLinks()) {
        hs.delete(contactClientLink);
    }
    for(MailoutRecipient mailoutRecipient : contact.getMailoutRecipients()) {
        mailoutRecipient.setContact(null);
        mailoutRecipient.setSource(MailoutRecipient.Source.FREE);
        hs.save(mailoutRecipient);
    }
    hs.delete(contact);
    %>
    {
    "status": "OK"
    }
    <%
} else if("checkContactDependencies".equals(command)) {
    Contact contact = (Contact)hs.get(Contact.class, new Long(request.getParameter("id")));
    Set<EmployeeContactLink> employeeContacts = contact.getEmployeeContactLinks();
    %>
    {
    "status": "OK",
    "employeeContacts": <%=employeeContacts.size() %>
    }
    <%
} else if("setContactInactive".equals(command)) {
    ContactSetInactiveForm contactSetInactiveForm = ContactSetInactiveForm.getFromJson(request.getParameter("contactSetInactiveForm"));
    Date now = new Date();
    Contact contact = (Contact)hs.get(Contact.class, new Long(contactSetInactiveForm.getId()));
    if(! Boolean.TRUE.equals(contact.getIsActive())) {
        throw new Exception("Contact is already inactive");
    }
    contact.setIsActive(Boolean.FALSE);
    hs.save(contact);
    ContactHistoryItem contactHistoryItem = new ContactHistoryItem();
    contactHistoryItem.setStatus(ContactHistoryItem.Status.SET_INACTIVE);
    contactHistoryItem.setModifiedAt(now);
    contactHistoryItem.setModifiedBy(currentUser);
    contactHistoryItem.setComment(contactSetInactiveForm.getReason());
    contactHistoryItem.setContact(contact);
    hs.save(contactHistoryItem);
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