<%-- 
    Document   : subdepartments
    Created on : 31.03.2011, 13:08:03
    Author     : glazov
--%>
<%@page import="com.mazars.management.service.MailUtils"%>
<%@page import="com.mazars.management.db.util.CalendarUtil"%>
<%@page import="java.io.PrintWriter"%>
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
    Country userCountry = currentUser.getCountry();
    List<Subdepartment> subdepartments = userCountry.getSubdepartments();
    List<OfficeDepartmentSubdepartment> describedSubdepartments = new LinkedList<OfficeDepartmentSubdepartment>();
    for(Subdepartment subdepartment : subdepartments) {
        describedSubdepartments.add(new OfficeDepartmentSubdepartment(subdepartment));
    }
    Collections.sort(describedSubdepartments, new OfficeDepartmentSubdepartment.OfficeDepartmentSubdepartmentComparator());
    %>
    {
    "status": "OK",
    "subdepartments": <% gson.toJson(describedSubdepartments, out); %>
    }
    <%
} else if("saveSubdepartmentClientLinks".equals(command)) {
    SubdepartmentClientLinksEditForm subdepartmentClientLinksEditForm = SubdepartmentClientLinksEditForm.getFromJson(request.getParameter("subdepartmentClientLinksEditForm"));
    Client client = (Client)hs.get(Client.class, new Long(subdepartmentClientLinksEditForm.getClientId()));

    Set<Subdepartment> oldSubdepartments = SubdepartmentClientLink.getSubdepartments(client);;
    Set<Subdepartment> newSubdepartments = new HashSet<Subdepartment>();
    for(SubdepartmentClientLinksEditForm.SubdepartmentClientLink tmpSubdepartmentClientLink : subdepartmentClientLinksEditForm.getSubdepartmentClientLinks()) {
        newSubdepartments.add((Subdepartment)hs.get(Subdepartment.class, tmpSubdepartmentClientLink.getSubdepartmentId()));
    }
    Set<Subdepartment> toUnbindSubdepartments = new HashSet<Subdepartment>(oldSubdepartments);
    Set<Subdepartment> toBindSubdepartments = new HashSet<Subdepartment>(newSubdepartments);
    toUnbindSubdepartments.removeAll(newSubdepartments);
    toBindSubdepartments.removeAll(oldSubdepartments);
    SubdepartmentClientLink.unlinkClientSubdepartments(client, toUnbindSubdepartments);
    SubdepartmentClientLink.linkClientSubdepartments(client, toBindSubdepartments);

    try {
        Calendar today = CalendarUtil.getToday();
        for(Subdepartment subdepartment : toUnbindSubdepartments) {
            List<Subdepartment> tmpSubdepartments = new ArrayList<Subdepartment>();
            tmpSubdepartments.add(subdepartment);
            List<Employee> employees = EmployeeSubdepartmentHistoryItem.getEmployees(null, tmpSubdepartments, EmployeeSubdepartmentHistoryItem.Type.CLIENT_CONFLICT_NOTIFICATION, today, today);
            for(Employee employee : employees) {
                javax.mail.Session mailSession = MailUtils.getSession();
                String mailContent = MailUtils.getSubdepartmentUnboundFromClientNotificationMailContent(employee, subdepartment, client);
                MailUtils.sendSubdepartmentUnboundFromClientNotificationMessage(mailSession, mailContent, employee.getEmail());
            }
        }
        if(! toBindSubdepartments.isEmpty()) {
            for(Subdepartment subdepartment : newSubdepartments) {
                List<Subdepartment> tmpSubdepartments = new ArrayList<Subdepartment>();
                tmpSubdepartments.add(subdepartment);
                List<Employee> employees = EmployeeSubdepartmentHistoryItem.getEmployees(null, tmpSubdepartments, EmployeeSubdepartmentHistoryItem.Type.CLIENT_CONFLICT_NOTIFICATION, today, today);
                for(Employee employee : employees) {
                    javax.mail.Session mailSession = MailUtils.getSession();
                    String mailContent = MailUtils.getSubdepartmentBoundToClientNotificationMailContent(employee, toBindSubdepartments, client);
                    MailUtils.sendSubdepartmentBoundToClientNotificationMessage(mailSession, mailContent, employee.getEmail());
                }
            }
        }
    } catch (Exception mailException) {
        mailException.printStackTrace(new PrintWriter(System.out));
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