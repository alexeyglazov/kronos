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


if("saveLeavesItem".equals(command)) {
    LeavesItemEditForm leavesItemEditForm = LeavesItemEditForm.getFromJson(request.getParameter("leavesItemEditForm"));
    if(LeavesItemEditForm.Mode.CREATE.equals(leavesItemEditForm.getMode()) ) {
          Employee employee = (Employee)hs.get(Employee.class, new Long(leavesItemEditForm.getEmployeeId()));
          LeavesItem leavesItem = new LeavesItem();
          leavesItem.setType(leavesItemEditForm.getType());
          leavesItem.setEmployee(employee);
          Calendar start = null;
          Calendar end = null;
          if(leavesItemEditForm.getStart() != null) {
                start = leavesItemEditForm.getStart().getCalendar();
          }
          if(leavesItemEditForm.getEnd() != null) {
                end = leavesItemEditForm.getEnd().getCalendar();
          }
          leavesItem.setStart(start);
          leavesItem.setEnd(end);
          hs.save(leavesItem);
         %>
         {
         "status": "OK"
         }
         <%
     } else if(LeavesItemEditForm.Mode.UPDATE.equals(leavesItemEditForm.getMode())) {
          LeavesItem leavesItem = (LeavesItem)hs.get(LeavesItem.class, new Long(leavesItemEditForm.getId()));
          leavesItem.setType(leavesItemEditForm.getType());
          Calendar start = null;
          Calendar end = null;
          if(leavesItemEditForm.getStart() != null) {
                start = leavesItemEditForm.getStart().getCalendar();
          }
          if(leavesItemEditForm.getEnd() != null) {
                end = leavesItemEditForm.getEnd().getCalendar();
          }
          leavesItem.setStart(start);
          leavesItem.setEnd(end);
          hs.save(leavesItem);
         %>
         {
         "status": "OK"
         }
         <%
     }
} else if("deleteLeavesItem".equals(command)) {
    LeavesItem leavesItem = (LeavesItem)hs.get(LeavesItem.class, new Long(request.getParameter("id")));
    hs.delete(leavesItem);
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