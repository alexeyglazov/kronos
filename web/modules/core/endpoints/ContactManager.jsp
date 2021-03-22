<%--
    Document   : subdepartments
    Created on : 31.03.2011, 13:08:03
    Author     : glazov
--%>
<%@page import="com.mazars.management.web.vo.ContactClientLinkVO"%>
<%@page import="com.mazars.management.web.vo.EmployeeContactLinkVO"%>
<%@page import="com.mazars.management.web.vo.ConciseEmployee"%>
<%@page import="java.util.Date"%>
<%@page import="com.mazars.management.web.vo.ContactHistoryItemVO"%>
<%@page import="com.mazars.management.db.util.ContactUtil"%>
<%@page import="com.mazars.management.web.vo.ContactWithExtendedInfo"%>
<%@page import="java.io.PrintWriter"%>
<%@page import="com.mazars.management.reports.InvoicingReport"%>
<%@page contentType="text/html" pageEncoding="UTF-8"
    import="java.util.List"
    import="java.util.LinkedList"
    import="java.util.Collections"
    import="java.util.Map"
    import="java.util.HashMap"
    import="java.math.BigDecimal"
    import="java.util.Locale"
    import="java.util.Calendar"
    import="com.mazars.management.db.domain.*"
    import="com.mazars.management.db.vo.*"
    import="com.mazars.management.web.forms.*"
    import="com.mazars.management.db.util.HibernateUtil"
    import="org.hibernate.Session"
    import="com.google.gson.Gson"
    import="com.mazars.management.reports.OwnTimeReport"
    import="com.mazars.management.reports.vo.*"
    import="java.text.SimpleDateFormat"
    import="com.mazars.management.reports.OwnTimeReport"
    import="com.mazars.management.reports.excel.*"
    import="com.mazars.management.web.security.AccessChecker"
    import="com.mazars.management.db.comparators.*"
    import="com.mazars.management.reports.WorkInProgressReport"
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

Employee employee = (Employee)hs.get(Employee.class, new Long(currentUser.getId()));
if("getInitialContent".equals(command)) {
    ContactManagerFilterForm contactManagerFilterForm = ContactManagerFilterForm.getFromJson(request.getParameter("contactManagerFilterForm"));
    List<ContactUtil.DescribedContact> describedContacts = ContactUtil.getDescribedContacts(contactManagerFilterForm, currentUser, module);
    Collections.sort(describedContacts, new ContactUtil.DescribedContactComparator());
    List<ContactWithExtendedInfo> contactVOs = new LinkedList<ContactWithExtendedInfo>();
    for(ContactUtil.DescribedContact describedContact : describedContacts) {
        ContactWithExtendedInfo contactVO = new ContactWithExtendedInfo(
            describedContact.getContact(),
            describedContact.getClient(),
            describedContact.getGroup(),
            describedContact.getClientLegalCountry(),
            describedContact.getClientPostalCountry(),
            describedContact.getCountry(),
            describedContact.getResidencialCountry()
        );
        contactVOs.add(contactVO);
    }
    
    Country userCountry = currentUser.getCountry();
    List<ISOCountryVO> countryVOs = new LinkedList<ISOCountryVO>();
    List<LanguageVO> languageVOs = new LinkedList<LanguageVO>();
    for(Language language : Language.getAll()) {
        languageVOs.add(new LanguageVO(language));
    }
    for(ISOCountry country : ISOCountry.getAll()) {
        countryVOs.add(new ISOCountryVO(country));
    }
    %>
    {
        "status": "OK",
        "languages": <% gson.toJson(languageVOs, out); %>,
        "countries": <% gson.toJson(countryVOs, out); %>,
        "contacts": <% gson.toJson(contactVOs, out); %>
    }
    <%
} else if("getContactInfo".equals(command)) {
    ContactManagerFilterForm contactManagerFilterForm = ContactManagerFilterForm.getFromJson(request.getParameter("contactManagerFilterForm"));
    List<ContactUtil.DescribedContact> describedContacts = ContactUtil.getDescribedContacts(contactManagerFilterForm, currentUser, module);
    Collections.sort(describedContacts, new ContactUtil.DescribedContactComparator());
    List<ContactWithExtendedInfo> contactVOs = new LinkedList<ContactWithExtendedInfo>();
    for(ContactUtil.DescribedContact describedContact : describedContacts) {
        ContactWithExtendedInfo contactVO = new ContactWithExtendedInfo(describedContact.getContact(),
                describedContact.getClient(),
                describedContact.getGroup(),
                describedContact.getClientLegalCountry(),
                describedContact.getClientPostalCountry(),
                describedContact.getCountry(),
                describedContact.getResidencialCountry()
        );
        contactVOs.add(contactVO);
    }
%>
{
"status": "OK",
"contacts": <% gson.toJson(contactVOs, out); %>
}
<%
} else if("doBatchUpdate".equals(command)) {
    Date now = new Date();
    ContactBatchUpdate contactBatchUpdate = ContactBatchUpdate.getFromJson(request.getParameter("batch"));
    for(Long contactId : contactBatchUpdate.getContactIds()) {
        Contact contact = (Contact)hs.get(Contact.class, contactId);
        ContactHistoryItem contactHistoryItem = new ContactHistoryItem();
        contactHistoryItem.setContact(contact);
        contactHistoryItem.setModifiedAt(now);
        contactHistoryItem.setModifiedBy(currentUser);
        contactHistoryItem.setStatus(ContactHistoryItem.Status.MODIFIED);

        if(ContactBatchUpdate.Action.SET_NEWSLETTERS.equals(contactBatchUpdate.getAction()) && ! contact.getIsNewsletters()) {
            contact.setIsNewsletters(Boolean.TRUE);
            hs.save(contact);
            contactHistoryItem.setComment("Contact modified in batch update (set newsletters)");
            hs.save(contactHistoryItem);            
        } else if(ContactBatchUpdate.Action.UNSET_NEWSLETTERS.equals(contactBatchUpdate.getAction()) && contact.getIsNewsletters()) {
            contact.setIsNewsletters(Boolean.FALSE);
            hs.save(contact);
            contactHistoryItem.setComment("Contact modified in batch update (unset newsletters)");
            hs.save(contactHistoryItem);            
        } else if(ContactBatchUpdate.Action.SET_REMINDER.equals(contactBatchUpdate.getAction()) && ! contact.getIsReminder()) {
            contact.setIsReminder(Boolean.TRUE);
            hs.save(contact);
            contactHistoryItem.setComment("Contact modified in batch update (set reminder)");
            hs.save(contactHistoryItem);            
        } else if(ContactBatchUpdate.Action.UNSET_REMINDER.equals(contactBatchUpdate.getAction()) && contact.getIsReminder()) {
            contact.setIsReminder(Boolean.FALSE);
            hs.save(contact);
            contactHistoryItem.setComment("Contact modified in batch update (unset reminder)");
            hs.save(contactHistoryItem);            
        }
    }
    %>
    {
    "status": "OK"
    }
    <%
} else if("getContact".equals(command)) {
    Contact contact = (Contact)hs.get(Contact.class, new Long(request.getParameter("contactId")));
    ContactVOH contactVO = new ContactVOH(contact);

    List<ContactClientLink> contactClientLinks = new LinkedList(contact.getContactClientLinks());
    List<ContactClientLinkVO> clientVOs = ContactClientLinkVO.getList(contactClientLinks);
    
    List<EmployeeContactLink> employeeContactLinks = new LinkedList<EmployeeContactLink>(contact.getEmployeeContactLinks());
    List<EmployeeContactLinkVO> employeeContactLinkVOs = EmployeeContactLinkVO.getList(employeeContactLinks);

    List<Employee> inChargePersons = contact.getProjectCodeInChargePersons();
    Collections.sort(inChargePersons, new EmployeeComparator(EmployeeComparator.Mode.FIRSTNAME_LASTNAME));
    List<ConciseEmployee> inChargePersonVOs = ConciseEmployee.getList(inChargePersons);
    %>
    {
        "status": "OK",
        "contact": <% gson.toJson(contactVO, out); %>,
        "contactClientLinks": <% gson.toJson(clientVOs, out); %>,
        "employeeContactLinks": <% gson.toJson(employeeContactLinkVOs, out); %>,
        "inChargePersons": <% gson.toJson(inChargePersonVOs, out); %>
    }
    <%
} else if("getContactHistoryItems".equals(command)) {
    Contact contact = (Contact)hs.get(Contact.class, new Long(request.getParameter("contactId")));
    List<ContactHistoryItem> contactHistoryItems = new LinkedList<ContactHistoryItem>(contact.getContactHistoryItems());
    Collections.sort(contactHistoryItems, new ContactHistoryItemComparator());
    List<ContactHistoryItemVO> contactHistoryItemVOs = new LinkedList<ContactHistoryItemVO>();
    for(ContactHistoryItem contactHistoryItem : contactHistoryItems) {
        contactHistoryItemVOs.add(new ContactHistoryItemVO(contactHistoryItem));
    }
    %>
    {
        "status": "OK",
        "contactHistoryItems": <% gson.toJson(contactHistoryItemVOs, out); %>
    }
    <%
} else if("confirmContact".equals(command)) {
    Contact contact = (Contact)hs.get(Contact.class, new Long(request.getParameter("contactId")));
    Date now = new Date();
    List<ContactHistoryItem> contactHistoryItems =  ContactHistoryItem.getList(contact, ContactHistoryItem.Status.CONFIRMED);
    if(! contactHistoryItems.isEmpty()) {
        Collections.sort(contactHistoryItems, new ContactHistoryItemComparator());
        ContactHistoryItem lastContactHistoryItem = contactHistoryItems.get(contactHistoryItems.size() - 1);
        if((now.getTime() - lastContactHistoryItem.getModifiedAt().getTime()) < (1000 * 60 * 60 * 24)) {
            throw new Exception("This contact was confirmed today.");
        }
    }
    ContactHistoryItem contactHistoryItem = new ContactHistoryItem();
    contactHistoryItem.setContact(contact);
    contactHistoryItem.setComment("Contact confirmed");
    contactHistoryItem.setModifiedAt(now);
    contactHistoryItem.setModifiedBy(currentUser);
    contactHistoryItem.setStatus(ContactHistoryItem.Status.CONFIRMED);
    hs.save(contactHistoryItem);
    %>
    {
        "status": "OK"
    }
    <%
} else if("generateXLS".equals(command)) {
    ContactManagerFilterForm contactManagerFilterForm = ContactManagerFilterForm.getFromJson(request.getParameter("contactManagerFilterForm"));
    List<ContactUtil.DescribedContact> describedContacts = ContactUtil.getDescribedContacts(contactManagerFilterForm, currentUser, module);
    Collections.sort(describedContacts, new ContactUtil.DescribedContactComparator());
    SimpleDateFormat dateFormatterShort = new SimpleDateFormat("ddMMyyyy");
    SimpleDateFormat dateFormatterLong = new SimpleDateFormat("ddMMyyyyHHmmss");
    
    Date now = new Date();
    String fileName = "CONTACTS_";
    fileName += dateFormatterLong.format(now);
    fileName += ".xls";

    response.setContentType("application/vnd.ms-excel");
    response.setHeader("content-disposition", "filename=" + fileName);
    ContactsListExcelBuilder reb = new ContactsListExcelBuilder(describedContacts, response.getOutputStream());
    reb.createStandardReport(response.getOutputStream());
}


hs.getTransaction().commit();

} catch (Exception ex) {
    hs.getTransaction().rollback();
    %>
    {
        "status": "FAIL",
        "comment": <% gson.toJson(ex.toString(), out); %>
        <% ex.printStackTrace(new PrintWriter(out)); %>
        }
    <%
}
%>
