<%-- 
    Document   : subdepartments
    Created on : 31.03.2011, 13:08:03
    Author     : glazov
--%><%@page import="com.mazars.management.web.vo.OfficeDepartmentSubdepartment"%>
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
if("getInitialContent".equals(command)) {
    List<Subdepartment> subdepartments = currentUser.getCountry().getSubdepartments();
    List<OfficeDepartmentSubdepartment> officeDepartmentSubdepartments = OfficeDepartmentSubdepartment.getList(subdepartments);
    Collections.sort(officeDepartmentSubdepartments, new OfficeDepartmentSubdepartment.OfficeDepartmentSubdepartmentComparator());
    %>
    {
    "status": "OK",
    "subdepartments": <% gson.toJson(officeDepartmentSubdepartments, out); %>
    }
    <%    
} else if("saveSubdepartmentConflict".equals(command)) {
    SubdepartmentConflictEditForm subdepartmentConflictEditForm = SubdepartmentConflictEditForm.getFromJson(request.getParameter("subdepartmentConflictEditForm"));
    SubdepartmentConflict subdepartmentConflict = new SubdepartmentConflict();
    if(SubdepartmentConflictEditForm.Mode.CREATE.equals(subdepartmentConflictEditForm.getMode())) {
        subdepartmentConflict = new SubdepartmentConflict();
    } else if(SubdepartmentConflictEditForm.Mode.UPDATE.equals(subdepartmentConflictEditForm.getMode())) {
        subdepartmentConflict = (SubdepartmentConflict)hs.get(SubdepartmentConflict.class, new Long(subdepartmentConflictEditForm.getId()));
    }
    Subdepartment checkingSubdepartment = (Subdepartment)hs.get(Subdepartment.class, new Long(subdepartmentConflictEditForm.getCheckingSubdepartmentId()));
    Subdepartment checkedSubdepartment = (Subdepartment)hs.get(Subdepartment.class, new Long(subdepartmentConflictEditForm.getCheckedSubdepartmentId()));
    subdepartmentConflict.setCheckedSubdepartment(checkedSubdepartment);
    subdepartmentConflict.setCheckingSubdepartment(checkingSubdepartment);
    hs.save(subdepartmentConflict);   
    %>
    {
        "status": "OK"
    }
    <%        
} else if("deleteSubdepartmentConflict".equals(command)) {
    SubdepartmentConflict subdepartmentConflict = (SubdepartmentConflict)hs.get(SubdepartmentConflict.class, new Long(request.getParameter("id")));
    hs.delete(subdepartmentConflict);
    %>
    {
    "status": "OK"
    }
    <%
} else if("checkSubdepartmentConflict".equals(command)) {
    SubdepartmentConflict subdepartmentConflict = (SubdepartmentConflict)hs.get(SubdepartmentConflict.class, new Long(request.getParameter("id")));
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