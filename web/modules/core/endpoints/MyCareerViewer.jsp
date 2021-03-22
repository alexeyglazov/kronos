<%-- 
    Document   : subdepartments
    Created on : 31.03.2011, 13:08:03
    Author     : glazov
--%><%@page import="javax.mail.Transport"%>
<%@page import="javax.mail.internet.InternetAddress"%>
<%@page import="javax.mail.internet.MimeMessage"%>
<%@page import="javax.mail.Message"%>
<%@page import="com.mazars.management.service.ConfigUtils"%>
<%@page import="com.mazars.management.security.SecurityUtils"%>
<%@page import="com.mazars.management.db.comparators.LeavesItemComparator"%>
<%@page import="com.mazars.management.db.comparators.PositionComparator"%>
<%@page import="com.mazars.management.db.comparators.SubdepartmentComparator"%>
<%@page import="com.mazars.management.db.comparators.DepartmentComparator"%>
<%@page import="com.mazars.management.db.comparators.EmployeeComparator"%>
<%@page import="com.mazars.management.db.comparators.OfficeComparator"%>
<%@page import="javax.mail.Authenticator"%>
<%@page contentType="text/html" pageEncoding="UTF-8"
    import="java.util.*"
    import="com.mazars.management.db.domain.*"
    import="com.mazars.management.db.vo.*"
    import="com.mazars.management.web.forms.*"
    import="com.mazars.management.db.util.HibernateUtil"
    import="org.hibernate.Session"
    import="com.google.gson.Gson"
    import="com.mazars.management.security.PasswordUtil"
    import="com.mazars.management.web.security.AccessChecker"
    import="com.mazars.management.web.vo.*"
    import="com.mazars.management.db.comparators.EmployeePositionHistoryItemComparator"
%><%
request.setCharacterEncoding("UTF-8");
Employee currentUser = (Employee)session.getAttribute("currentUser");
String command = request.getParameter("command");
Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
Gson gson = new Gson();
try {
hs.beginTransaction();
Module module = Module.getByName("Timesheets");

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
    Employee employee = (Employee)hs.get(Employee.class, currentUser.getId());
    List<ExtendedEmployeePositionHistoryItemVO> employeePositionHistoryItemVOs = new LinkedList<ExtendedEmployeePositionHistoryItemVO>();
    List<LeavesItemVO> leavesItemVOs = new LinkedList<LeavesItemVO>();
    if(employee != null) {
        List<EmployeePositionHistoryItem> employeePositionHistoryItems = EmployeePositionHistoryItem.getEmployeePositionHistoryItems(employee);
        EmployeePositionHistoryItem.assignCareerStatuses(employeePositionHistoryItems);
        Collections.sort(employeePositionHistoryItems, new EmployeePositionHistoryItemComparator());
        for(EmployeePositionHistoryItem employeePositionHistoryItem : employeePositionHistoryItems) {
            employeePositionHistoryItemVOs.add(new ExtendedEmployeePositionHistoryItemVO(employeePositionHistoryItem));
        }
        List<LeavesItem> leavesItems = new LinkedList<LeavesItem>(employee.getLeavesItems());
        Collections.sort(leavesItems, new LeavesItemComparator());
        for(LeavesItem leavesItem : leavesItems) {
            leavesItemVOs.add(new LeavesItemVO(leavesItem));
        }
    }
    %>
    {
    "status": "OK",
    "employee": <% gson.toJson(new EmployeeWithoutPasswordVO(employee), out); %>,
    "employeePositionHistoryItems": <% gson.toJson(employeePositionHistoryItemVOs, out); %>,
    "leavesItems": <% gson.toJson(leavesItemVOs, out); %>
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