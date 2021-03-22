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
    ConciseEmployee employeeVO = null;
    if(request.getParameter("employeeId") != null && ! request.getParameter("employeeId").trim().equals("")) {
        Employee employee = (Employee)hs.get(Employee.class, new Long(request.getParameter("employeeId")));
        employeeVO = new ConciseEmployee(employee);
    }
    %>
    {
    "status": "OK",
    <% if(contactVO != null) { %>
    "contact": <% gson.toJson(contactVO, out); %>,
    <% } else { %>
    "contact": null,
    <% } %>
    <% if(employeeVO != null) { %>
    "employee": <% gson.toJson(employeeVO, out); %>
    <% } else { %>
    "employee": null
    <% } %>
    }
    <%    
} else if("saveEmployeeContactLink".equals(command)) {
    EmployeeContactLinkEditForm employeeContactLinkEditForm = EmployeeContactLinkEditForm.getFromJson(request.getParameter("employeeContactLinkEditForm"));
    
    Date now = new Date();
    Contact contact = (Contact)hs.get(Contact.class, employeeContactLinkEditForm.getContactId());
    Employee employee = (Employee)hs.get(Employee.class, employeeContactLinkEditForm.getEmployeeId());
    EmployeeContactLink employeeContactLink = null;
    String comment = null;
    boolean createContactHistoryItem = false;
    if(EmployeeContactLinkEditForm.Mode.CREATE.equals(employeeContactLinkEditForm.getMode())) {
        employeeContactLink = new EmployeeContactLink();
        comment = "Employee (" + employee.getFullName() + ") has been assigned to this contact (" + contact.getFirstName() + " " + contact.getLastName() + ")";
        createContactHistoryItem = true;
    } else if(EmployeeContactLinkEditForm.Mode.UPDATE.equals(employeeContactLinkEditForm.getMode())) {
        employeeContactLink = (EmployeeContactLink)hs.get(EmployeeContactLink.class, employeeContactLinkEditForm.getId());
        boolean employeeModified = false;
        boolean contactModified = false;
        if(! employeeContactLink.getEmployee().getId().equals(employee.getId())) {
            employeeModified = true;
        }
        if(! employeeContactLink.getContact().getId().equals(contact.getId())) {
            contactModified = true;
        }
        if(employeeModified || contactModified) {
            createContactHistoryItem = true;
            comment = "EmployeeContactLink has been modified. ";
            if(employeeModified) {
                comment += "Employee (" + employeeContactLink.getEmployee().getFullName() + ") changed to (" + employee.getFullName() + "). "; 
            }
            if(contactModified) {
                comment += "Contact (" + employeeContactLink.getContact().getFirstName() + " " + employeeContactLink.getContact().getLastName() + ") changed to (" + contact.getFirstName() + " " + contact.getLastName() + "). "; 
            }
        }
    }    
    employeeContactLink.setContact(contact);
    employeeContactLink.setEmployee(employee);
    employeeContactLink.setComment(employeeContactLinkEditForm.getComment());
    hs.save(employeeContactLink);

    if(createContactHistoryItem) {
        ContactHistoryItem contactHistoryItem = new ContactHistoryItem();
        contactHistoryItem.setContact(employeeContactLink.getContact());
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
} else if("deleteEmployeeContactLink".equals(command)) {
    EmployeeContactLink employeeContactLink = (EmployeeContactLink)hs.get(EmployeeContactLink.class, new Long(request.getParameter("id")));
    
    Date now = new Date();
    Employee employee = employeeContactLink.getEmployee();
    Contact contact = employeeContactLink.getContact();
    String comment = "Employee (" + employee.getFullName() + ") has been unassigned from this contact (" + contact.getFirstName() + " " + contact.getLastName() + ")";
    ContactHistoryItem contactHistoryItem = new ContactHistoryItem();
    contactHistoryItem.setContact(employeeContactLink.getContact());
    contactHistoryItem.setModifiedAt(now);
    contactHistoryItem.setModifiedBy(currentUser);
    contactHistoryItem.setStatus(ContactHistoryItem.Status.MODIFIED);
    contactHistoryItem.setComment(comment);
    hs.save(contactHistoryItem);
    
    hs.delete(employeeContactLink);
    %>
    {
    "status": "OK"
    }
    <%
} else if("checkEmployeeContactLinkDependencies".equals(command)) {
    EmployeeContactLink employeeContactLink = (EmployeeContactLink)hs.get(EmployeeContactLink.class, new Long(request.getParameter("id")));
    
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