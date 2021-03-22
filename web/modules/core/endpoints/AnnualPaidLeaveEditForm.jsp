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


if("save".equals(command)) {
    AnnualPaidLeaveEditForm annualPaidLeaveEditForm = AnnualPaidLeaveEditForm.getFromJson(request.getParameter("form"));
    if(AnnualPaidLeaveEditForm.Mode.CREATE.equals(annualPaidLeaveEditForm.getMode()) ) {
          Position position = (Position)hs.get(Position.class, new Long(annualPaidLeaveEditForm.getPositionId()));
          AnnualPaidLeave annualPaidLeave = new AnnualPaidLeave();
          annualPaidLeave.setContractType(annualPaidLeaveEditForm.getContractType());
          annualPaidLeave.setPosition(position);
          Calendar start = null;
          Calendar end = null;
          if(annualPaidLeaveEditForm.getStart() != null) {
                start = annualPaidLeaveEditForm.getStart().getCalendar();
          }
          if(annualPaidLeaveEditForm.getEnd() != null) {
                end = annualPaidLeaveEditForm.getEnd().getCalendar();
          }
          annualPaidLeave.setStart(start);
          annualPaidLeave.setEnd(end);
          annualPaidLeave.setDuration(annualPaidLeaveEditForm.getDuration());
          hs.save(annualPaidLeave);
         %>
         {
         "status": "OK"
         }
         <%
     } else if(AnnualPaidLeaveEditForm.Mode.UPDATE.equals(annualPaidLeaveEditForm.getMode())) {
          AnnualPaidLeave annualPaidLeave = (AnnualPaidLeave)hs.get(AnnualPaidLeave.class, new Long(annualPaidLeaveEditForm.getId()));
          annualPaidLeave.setContractType(annualPaidLeaveEditForm.getContractType());
          Calendar start = null;
          Calendar end = null;
          if(annualPaidLeaveEditForm.getStart() != null) {
                start = annualPaidLeaveEditForm.getStart().getCalendar();
          }
          if(annualPaidLeaveEditForm.getEnd() != null) {
                end = annualPaidLeaveEditForm.getEnd().getCalendar();
          }
          annualPaidLeave.setStart(start);
          annualPaidLeave.setEnd(end);
          annualPaidLeave.setDuration(annualPaidLeaveEditForm.getDuration());
          hs.save(annualPaidLeave);
         %>
         {
         "status": "OK"
         }
         <%
     }
} else if("checkDependencies".equals(command)) {
    AnnualPaidLeave annualPaidLeave = (AnnualPaidLeave)hs.get(AnnualPaidLeave.class, new Long(request.getParameter("id")));
    %>{
    "status": "OK"
    }<%    
} else if("delete".equals(command)) {
    AnnualPaidLeave annualPaidLeave = (AnnualPaidLeave)hs.get(AnnualPaidLeave.class, new Long(request.getParameter("id")));
    hs.delete(annualPaidLeave);
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