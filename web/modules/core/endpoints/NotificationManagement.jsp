<%-- 
    Document   : subdepartments
    Created on : 31.03.2011, 13:08:03
    Author     : glazov
--%><%@page import="com.mazars.management.db.comparators.EmployeeComparator"%>
<%@page contentType="text/html" pageEncoding="UTF-8"
    import="java.util.*"
    import="com.mazars.management.db.domain.*"
    import="com.mazars.management.db.vo.*"
    import="com.mazars.management.web.forms.*"
    import="com.mazars.management.db.util.HibernateUtil"
    import="org.hibernate.Session"
    import="com.google.gson.Gson"
    import="com.mazars.management.web.vo.*"
    import="com.mazars.management.web.comparators.PositionWithStandardPositionComparator"
    import="java.util.Collections"    
    import="com.mazars.management.web.security.AccessChecker"
%><%
request.setCharacterEncoding("UTF-8");
Employee currentUser = (Employee)session.getAttribute("currentUser");
String command = request.getParameter("command");
Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
Gson gson = new Gson();
try {
hs.beginTransaction();
Module module = Module.getByName("Admin");

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
    Country country = currentUser.getCountry();
    List<NotificationItemVOH> notificationItemVOs = new LinkedList<NotificationItemVOH>();
    List<EmployeeWithoutPasswordVO > employeeVOs = new LinkedList<EmployeeWithoutPasswordVO>();
    for(NotificationItem notificationItem : NotificationItem.get(country)) {
        notificationItemVOs.add(new NotificationItemVOH(notificationItem));
    }
    List<Employee> employees = NotificationItem.getEmployees(country);
    Collections.sort(employees, new EmployeeComparator());
    for(Employee employee : employees) {
        employeeVOs.add(new EmployeeWithoutPasswordVO(employee));
    }
    %>
    {
    "status": "OK",
    "employees": <% gson.toJson(employeeVOs, out); %>,
    "notificationItems": <% gson.toJson(notificationItemVOs, out); %>
    }
    <%
} else if("saveNotificationItems".equals(command)) {
    NotificationItemsForm notificationItemsForm = NotificationItemsForm.getFromJson(request.getParameter("notificationItemsForm"));
    Country country = currentUser.getCountry();

    for(NotificationItem notificationItem : NotificationItem.get(country)) {
        boolean toBeDeleted = true;
        for(NotificationItemsForm.Item item : notificationItemsForm.getItems()) {
            if(notificationItem.getId().equals(item.getId())) {
                toBeDeleted = false;
                break;
            }
        }
        if(toBeDeleted) {
            hs.delete(notificationItem);
        }
    }
    for(NotificationItemsForm.Item item : notificationItemsForm.getItems()) {
        if(item.getId() == null) {
            NotificationItem notificationItem = new NotificationItem();
            Employee employee = (Employee)hs.get(Employee.class, item.getEmployeeId());
            notificationItem.setEmployee(employee);
            notificationItem.setEvent(item.getEvent());
            hs.save(notificationItem);
        }
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