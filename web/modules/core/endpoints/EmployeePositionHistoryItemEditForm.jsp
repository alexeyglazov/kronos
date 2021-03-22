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
Module module = Module.getByName("HR");

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

if("saveEmployeePositionHistoryItem".equals(command)) {
    EmployeePositionHistoryItemEditForm employeePositionHistoryItemEditForm = EmployeePositionHistoryItemEditForm.getFromJson(request.getParameter("employeePositionHistoryItemEditForm"));
    if(EmployeePositionHistoryItemEditForm.Mode.CREATE.equals(employeePositionHistoryItemEditForm.getMode()) ) {
          Employee employee = (Employee)hs.get(Employee.class, new Long(employeePositionHistoryItemEditForm.getEmployeeId()));
          Position position = (Position)hs.get(Position.class, new Long(employeePositionHistoryItemEditForm.getPositionId()));
          Calendar start = null;
          Calendar end = null;
          if(employeePositionHistoryItemEditForm.getStart() != null) {
                start = employeePositionHistoryItemEditForm.getStart().getCalendar();
          }
          if(employeePositionHistoryItemEditForm.getEnd() != null) {
                end = employeePositionHistoryItemEditForm.getEnd().getCalendar();
          }
          EmployeePositionHistoryItem employeePositionHistoryItem = new EmployeePositionHistoryItem();
          employeePositionHistoryItem.setPosition(position);
          employeePositionHistoryItem.setEmployee(employee);
          employeePositionHistoryItem.setStart(start);
          employeePositionHistoryItem.setEnd(end);
          hs.save(employeePositionHistoryItem);

          EmployeePositionHistoryItem employeePositionHistoryItemLatest = EmployeePositionHistoryItem.getLatestEmployeePositionHistoryItem(employee);
          if(! employeePositionHistoryItemLatest.getPosition().getId().equals(employee.getPosition().getId())) {
            employee.setPosition(employeePositionHistoryItemLatest.getPosition());
            hs.save(employee);
          }
         %>
         {
         "status": "OK"
         }
         <%
     } else if(EmployeePositionHistoryItemEditForm.Mode.UPDATE.equals(employeePositionHistoryItemEditForm.getMode())) {
          EmployeePositionHistoryItem employeePositionHistoryItem = (EmployeePositionHistoryItem)hs.get(EmployeePositionHistoryItem.class, new Long(employeePositionHistoryItemEditForm.getId()));
          Position position = (Position)hs.get(Position.class, new Long(employeePositionHistoryItemEditForm.getPositionId()));
          Employee employee = employeePositionHistoryItem.getEmployee();
          Calendar start = null;
          Calendar end = null;
          if(employeePositionHistoryItemEditForm.getStart() != null) {
                start = employeePositionHistoryItemEditForm.getStart().getCalendar();
          }
          if(employeePositionHistoryItemEditForm.getEnd() != null) {
                end = employeePositionHistoryItemEditForm.getEnd().getCalendar();
          }
          employeePositionHistoryItem.setPosition(position);
          employeePositionHistoryItem.setStart(start);
          employeePositionHistoryItem.setEnd(end);
          hs.save(employeePositionHistoryItem);
          EmployeePositionHistoryItem employeePositionHistoryItemPrevious = EmployeePositionHistoryItem.getLatestEmployeePositionHistoryItem(employee);
          if(! employeePositionHistoryItemPrevious.getPosition().getId().equals(employee.getPosition().getId())) {
            employee.setPosition(employeePositionHistoryItemPrevious.getPosition());
            hs.save(employee);
          }
         %>
         {
         "status": "OK"
         }
         <%
     }
} else if("checkEmployeePositionHistoryItemDependencies".equals(command)) {
    EmployeePositionHistoryItem employeePositionHistoryItem = (EmployeePositionHistoryItem)hs.get(EmployeePositionHistoryItem.class, new Long(request.getParameter("id")));
    Set<EmployeePositionHistoryItem> employeePositionHistoryItems = employeePositionHistoryItem.getEmployee().getEmployeePositionHistoryItems();
     %>
    {
    "status": "OK",
    "employeePositionHistoryItems": <%=employeePositionHistoryItems.size() %>
    }
    <%
} else if("deleteEmployeePositionHistoryItem".equals(command)) {
    EmployeePositionHistoryItem employeePositionHistoryItem = (EmployeePositionHistoryItem)hs.get(EmployeePositionHistoryItem.class, new Long(request.getParameter("id")));
    Employee employee = employeePositionHistoryItem.getEmployee();
    hs.delete(employeePositionHistoryItem);
    EmployeePositionHistoryItem employeePositionHistoryItemPrevious = EmployeePositionHistoryItem.getLatestEmployeePositionHistoryItem(employee);
    if(! employeePositionHistoryItemPrevious.getPosition().getId().equals(employee.getPosition().getId())) {
        employee.setPosition(employeePositionHistoryItemPrevious.getPosition());
        hs.save(employee);
    }
%>
{
"status": "OK"
}
<%
} else if("getPosition".equals(command)) {
    Position position = (Position)hs.get(Position.class, new Long(request.getParameter("positionId")));
    %>
    {
    "status": "OK",
    "position": <% gson.toJson(new PositionVO(position), out); %>
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