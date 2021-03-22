<%--
    Document   : subdepartments
    Created on : 31.03.2011, 13:08:03
    Author     : glazov
--%>
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

       Country country = employee.getCountry();    
       List<Group> groups = new LinkedList<Group>();
       List<Client> clients = new LinkedList<Client>();
       List<Employee> employees = new LinkedList<Employee>();
       List<Subdepartment> subdepartments = new LinkedList<Subdepartment>();
       groups.addAll(country.getGroups());
       if(contactManagerFilterForm.getGroupId() != null) {
           Group group = (Group)hs.get(Group.class, contactManagerFilterForm.getGroupId());
            clients.addAll(group.getClients());
       } else {
           clients.addAll(country.getClients());
       }
        for(Long employeeId : contactManagerFilterForm.getEmployeeIds()) {
            Employee tmpEmployee = (Employee)hs.get(Employee.class, employeeId);
            employees.add(tmpEmployee);
        }     
        for(Long subdepartmentId : contactManagerFilterForm.getSubdepartmentIds()) {
            Subdepartment tmpSubdepartment = (Subdepartment)hs.get(Subdepartment.class, subdepartmentId);
            subdepartments.add(tmpSubdepartment);
        }     
       Collections.sort(groups, new GroupComparator());
       Collections.sort(clients, new ClientComparator());
       Collections.sort(employees, new EmployeeComparator());
       Collections.sort(subdepartments, new SubdepartmentComparator());
       List<GroupVO> groupVOs = GroupVO.getList(groups);
       List<ClientVO> clientVOs = ClientVO.getList(clients);
       List<EmployeeWithoutPasswordVO> employeeVOs = EmployeeWithoutPasswordVO.getList(employees);
       List<SubdepartmentVO> subdepartmentVOs = SubdepartmentVO.getList(subdepartments);
%>
{
"status": "OK",
"groups": <% gson.toJson(groupVOs, out); %>,
"clients": <% gson.toJson(clientVOs, out); %>,
"employees": <% gson.toJson(employeeVOs, out); %>,
"subdepartments": <% gson.toJson(subdepartmentVOs, out); %>
}
<%
} else if("getGroupContent".equals(command)) {
    List<Client> clients = new LinkedList<Client>();
    if(request.getParameter("groupId") != null) {
        Group group = (Group)hs.get(Group.class, new Long(request.getParameter("groupId")));
        clients.addAll(group.getClients());
    } else {
        Country country = employee.getCountry();
        clients.addAll(country.getClients());
    }
    Collections.sort(clients, new ClientComparator());
    List<ClientVO> clientVOs = ClientVO.getList(clients);
%>
{
"status": "OK",
"clients": <% gson.toJson(clientVOs, out); %>
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
