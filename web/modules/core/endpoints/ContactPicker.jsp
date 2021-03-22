<%-- 
    Document   : subdepartments
    Created on : 31.03.2011, 13:08:03
    Author     : glazov
--%>
<%@page import="com.mazars.management.web.vo.ContactWithExtendedInfo"%>
<%@page import="com.mazars.management.db.util.ContactUtil"%>
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