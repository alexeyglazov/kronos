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


if("saveProjectCodeComment".equals(command)) {
    ProjectCodeCommentEditForm projectCodeCommentEditForm = ProjectCodeCommentEditForm.getFromJson(request.getParameter("projectCodeCommentEditForm"));
    projectCodeCommentEditForm.normalize();
    Subdepartment subdepartment = (Subdepartment)hs.get(Subdepartment.class, new Long(projectCodeCommentEditForm.getSubdepartmentId()));
    ProjectCodeComment projectCodeComment = null;
    if(ProjectCodeCommentEditForm.Mode.CREATE.equals(projectCodeCommentEditForm.getMode())) {
        projectCodeComment = new ProjectCodeComment();
    } else if(ProjectCodeCommentEditForm.Mode.UPDATE.equals(projectCodeCommentEditForm.getMode())) {
        projectCodeComment = (ProjectCodeComment)hs.get(ProjectCodeComment.class, new Long(projectCodeCommentEditForm.getId()));
    }
    projectCodeComment.setSubdepartment(subdepartment);
    projectCodeComment.setContent(projectCodeCommentEditForm.getContent());
    hs.save(projectCodeComment);
    %>
    {
    "status": "OK"
    }
    <%
} else if("deleteProjectCodeComment".equals(command)) {
    ProjectCodeComment projectCodeComment = (ProjectCodeComment)hs.get(ProjectCodeComment.class, new Long(request.getParameter("id")));
    hs.delete(projectCodeComment);
    %>
    {
    "status": "OK"
    }
    <%
} else if("checkProjectCodeCommentDependencies".equals(command)) {
    ProjectCodeComment projectCodeComment = (ProjectCodeComment)hs.get(ProjectCodeComment.class, new Long(request.getParameter("id")));
    %>{
    "status": "OK"
    }<%
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