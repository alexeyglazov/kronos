<%-- 
    Document   : subdepartments
    Created on : 31.03.2011, 13:08:03
    Author     : glazov
--%>
<%@page import="com.mazars.management.db.util.ProjectCodeListUtil"%>
<%@page contentType="text/html" pageEncoding="UTF-8"
    import="java.util.*"
    import="com.mazars.management.db.domain.*"
    import="com.mazars.management.db.vo.*"
    import="com.mazars.management.web.forms.*"
    import="com.mazars.management.db.util.HibernateUtil"
    import="org.hibernate.Session"
    import="com.google.gson.Gson"
    import="com.mazars.management.web.security.AccessChecker"
    import="com.mazars.management.db.comparators.*"
%><%
request.setCharacterEncoding("UTF-8");
Employee currentUser = (Employee)session.getAttribute("currentUser");
String command = request.getParameter("command");
Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
Gson gson = new Gson();
try {
hs.beginTransaction();
Module module = Module.getByName(request.getParameter("moduleName"));

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
if("getProjectCodesList".equals(command)) {
    ProjectCodeListFilter filter = ProjectCodeListFilter.getFromJson(request.getParameter("filter"));
    InvoiceRequestsFilter invoiceRequestsFilter = new InvoiceRequestsFilter();
    ProjectCodeListSorter sorter = ProjectCodeListSorter.getFromJson(request.getParameter("sorter"));
    ProjectCodeListLimiter limiter = ProjectCodeListLimiter.getFromJson(request.getParameter("limiter"));

    List<Subdepartment> allowedSubdepartments = Subdepartment.getAllowedSubdepartments(null, null, null, currentUser, module);
    Long count = ProjectCodeListUtil.getCountOfProjectCodeFilteredList(filter, invoiceRequestsFilter, sorter, limiter, allowedSubdepartments);
    List<ProjectCode> projectCodes = ProjectCodeListUtil.getProjectCodeFilteredList(filter, invoiceRequestsFilter, sorter, limiter, allowedSubdepartments);

    List<ProjectCodeVODetailed> projectCodeVOs = new LinkedList<ProjectCodeVODetailed>();
    for(ProjectCode projectCode : projectCodes) {
        projectCodeVOs.add(new ProjectCodeVODetailed(projectCode));
    }
    %>{
    "status": "OK",
    "count": <%=count %>,
    "projectCodes": <% gson.toJson(projectCodeVOs, out); %>
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