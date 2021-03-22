<%-- 
    Document   : subdepartments
    Created on : 31.03.2011, 13:08:03
    Author     : glazov
--%><%@page import="com.mazars.management.db.vo.ProjectCodeVODetailed"%>
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
Module module = Module.getByName("Code");

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
    List<Long> projectCodeIds = ListOfLong.getFromJson(request.getParameter("projectCodeIds")).getList();
    List<ProjectCodeVODetailed> projectCodes = new LinkedList<ProjectCodeVODetailed>();
    for(Long projectCodeId : projectCodeIds) {
        ProjectCode projectCode = (ProjectCode)hs.get(ProjectCode.class, projectCodeId);
        projectCodes.add(new ProjectCodeVODetailed(projectCode));
    }
    %>
    {
    "status": "OK",
    "projectCodes": <% gson.toJson(projectCodes, out); %>
    }
    <%    
} else if("saveProjectCodes".equals(command)) {
    ProjectCodeBatchEditForm projectCodeBatchEditForm = ProjectCodeBatchEditForm.getFromJson(request.getParameter("projectCodeBatchEditForm"));
    projectCodeBatchEditForm.normalize();
    for(ProjectCodeBatchEditForm.Item item : projectCodeBatchEditForm.getItems()) {
        ProjectCode projectCode = (ProjectCode)hs.get(ProjectCode.class, new Long(item.getId()));
        Employee inChargePerson = null;
        if(item.getInChargePersonId() != null) {
            inChargePerson = (Employee)hs.get(Employee.class, new Long(item.getInChargePersonId()));
        }
        Employee inChargePartner = null;
        if(item.getInChargePartnerId() != null) {
            inChargePartner = (Employee)hs.get(Employee.class, new Long(item.getInChargePartnerId()));
        }
        projectCode.setFinancialYear(item.getFinancialYear());
        projectCode.setInChargePerson(inChargePerson);
        projectCode.setInChargePartner(inChargePartner);
        projectCode.setComment(item.getComment());
        projectCode.setDescription(item.getDescription());
        projectCode.setModifiedAt(new Date());
        hs.save(projectCode);
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