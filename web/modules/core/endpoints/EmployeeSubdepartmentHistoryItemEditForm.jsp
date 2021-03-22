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
Module module = Module.getByName("Rights");

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

if("saveEmployeeSubdepartmentHistoryItem".equals(command)) {
    EmployeeSubdepartmentHistoryItemEditForm employeeSubdepartmentHistoryItemEditForm = EmployeeSubdepartmentHistoryItemEditForm.getFromJson(request.getParameter("employeeSubdepartmentHistoryItemEditForm"));
    if(EmployeeSubdepartmentHistoryItemEditForm.Mode.CREATE.equals(employeeSubdepartmentHistoryItemEditForm.getMode()) ) {
          Employee employee = (Employee)hs.get(Employee.class, new Long(employeeSubdepartmentHistoryItemEditForm.getEmployeeId()));
          Subdepartment subdepartment = (Subdepartment)hs.get(Subdepartment.class, new Long(employeeSubdepartmentHistoryItemEditForm.getSubdepartmentId()));
          EmployeeSubdepartmentHistoryItem employeeSubdepartmentHistoryItem = new EmployeeSubdepartmentHistoryItem();
          employeeSubdepartmentHistoryItem.setSubdepartment(subdepartment);
          employeeSubdepartmentHistoryItem.setEmployee(employee);
          employeeSubdepartmentHistoryItem.setType(employeeSubdepartmentHistoryItemEditForm.getType());
          if(employeeSubdepartmentHistoryItemEditForm.getStart() != null) {
            employeeSubdepartmentHistoryItem.setStart(employeeSubdepartmentHistoryItemEditForm.getStart().getCalendar());
          }
          if(employeeSubdepartmentHistoryItemEditForm.getEnd() != null) {
            employeeSubdepartmentHistoryItem.setEnd(employeeSubdepartmentHistoryItemEditForm.getEnd().getCalendar() );
          } else {
            employeeSubdepartmentHistoryItem.setEnd(null);
          }
          employee.getEmployeeSubdepartmentHistoryItems().add(employeeSubdepartmentHistoryItem);
          hs.save(employeeSubdepartmentHistoryItem);
         %>
         {
         "status": "OK"
         }
         <%
     } else if(EmployeeSubdepartmentHistoryItemEditForm.Mode.UPDATE.equals(employeeSubdepartmentHistoryItemEditForm.getMode())) {
          EmployeeSubdepartmentHistoryItem employeeSubdepartmentHistoryItem = (EmployeeSubdepartmentHistoryItem)hs.get(EmployeeSubdepartmentHistoryItem.class, new Long(employeeSubdepartmentHistoryItemEditForm.getId()));
          //Subdepartment subdepartment = (Subdepartment)hs.get(Subdepartment.class, new Long(employeeSubdepartmentHistoryItemEditForm.getSubdepartmentId()));
          //employeeSubdepartmentHistoryItem.setSubdepartment(subdepartment);
          employeeSubdepartmentHistoryItem.setType(employeeSubdepartmentHistoryItemEditForm.getType());
          if(employeeSubdepartmentHistoryItemEditForm.getStart() != null) {
            employeeSubdepartmentHistoryItem.setStart(employeeSubdepartmentHistoryItemEditForm.getStart().getCalendar());
          }
          if(employeeSubdepartmentHistoryItemEditForm.getEnd() != null) {
            employeeSubdepartmentHistoryItem.setEnd(employeeSubdepartmentHistoryItemEditForm.getEnd().getCalendar() );
          } else {
            employeeSubdepartmentHistoryItem.setEnd(null);
          }
          hs.save(employeeSubdepartmentHistoryItem);
         %>
         {
         "status": "OK"
         }
         <%
     }
} else if("checkEmployeeSubdepartmentHistoryItemDependencies".equals(command)) {
    %>
    {
    "status": "OK"
    }
    <%
} else if("deleteEmployeeSubdepartmentHistoryItem".equals(command)) {
    EmployeeSubdepartmentHistoryItem employeeSubdepartmentHistoryItem = (EmployeeSubdepartmentHistoryItem)hs.get(EmployeeSubdepartmentHistoryItem.class, new Long(request.getParameter("id")));
    hs.delete(employeeSubdepartmentHistoryItem);
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