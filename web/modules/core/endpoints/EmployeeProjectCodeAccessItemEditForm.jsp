<%-- 
    Document   : subdepartments
    Created on : 31.03.2011, 13:08:03
    Author     : glazov
--%>
<%@page import="java.io.PrintWriter"%>
<%@page import="com.mazars.management.web.vo.ConciseEmployee"%>
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

if("getInitialContent".equals(command)) {
    ConciseEmployee employeeVO = null;
    if(request.getParameter("employeeId") != null && ! request.getParameter("employeeId").trim().equals("")) {
        Employee employee = (Employee)hs.get(Employee.class, new Long(request.getParameter("employeeId")));
        employeeVO = new ConciseEmployee(employee);
    }
    ProjectCodeVO projectCodeVO = null;
    if(request.getParameter("projectCodeId") != null && ! request.getParameter("projectCodeId").trim().equals("")) {
        ProjectCode projectCode = (ProjectCode)hs.get(ProjectCode.class, new Long(request.getParameter("projectCodeId")));
        projectCodeVO = new ProjectCodeVO(projectCode);
    }
    %>
    {
    "status": "OK",
    <% if(projectCodeVO != null) { %>
    "projectCode": <% gson.toJson(projectCodeVO, out); %>,
    <% } else { %>
    "projectCode": null,
    <% } %>
    <% if(employeeVO != null) { %>
    "employee": <% gson.toJson(employeeVO, out); %>
    <% } else { %>
    "employee": null
    <% } %>
    }
    <%    
} else if("getEmployeeContent".equals(command)) {
    ConciseEmployee employeeVO = null;
    Employee employee = (Employee)hs.get(Employee.class, new Long(request.getParameter("employeeId")));
    employeeVO = new ConciseEmployee(employee);
    %>
    {
    "status": "OK",
    "employee": <% gson.toJson(employeeVO, out); %>
    }
    <%    
} else if("getProjectCodeContent".equals(command)) {
    ProjectCodeVO projectCodeVO = null;
    ProjectCode projectCode = (ProjectCode)hs.get(ProjectCode.class, new Long(request.getParameter("projectCodeId")));
    projectCodeVO = new ProjectCodeVO(projectCode);
    %>
    {
    "status": "OK",
    "projectCode": <% gson.toJson(projectCodeVO, out); %>
    }
    <%    
} else if("saveEmployeeProjectCodeAccessItem".equals(command)) {
    EmployeeProjectCodeAccessItemEditForm employeeProjectCodeAccessItemEditForm = EmployeeProjectCodeAccessItemEditForm.getFromJson(request.getParameter("employeeProjectCodeAccessItemEditForm"));
    
    Employee employee = (Employee)hs.get(Employee.class, employeeProjectCodeAccessItemEditForm.getEmployeeId());
    ProjectCode projectCode = (ProjectCode)hs.get(ProjectCode.class, employeeProjectCodeAccessItemEditForm.getProjectCodeId());
    EmployeeProjectCodeAccessItem employeeProjectCodeAccessItem = null;
    if(EmployeeProjectCodeAccessItemEditForm.Mode.CREATE.equals(employeeProjectCodeAccessItemEditForm.getMode())) {
        employeeProjectCodeAccessItem = new EmployeeProjectCodeAccessItem();
    } else if(EmployeeProjectCodeAccessItemEditForm.Mode.UPDATE.equals(employeeProjectCodeAccessItemEditForm.getMode())) {
        employeeProjectCodeAccessItem = (EmployeeProjectCodeAccessItem)hs.get(EmployeeProjectCodeAccessItem.class, employeeProjectCodeAccessItemEditForm.getId());
    }    
    employeeProjectCodeAccessItem.setProjectCode(projectCode);
    employeeProjectCodeAccessItem.setEmployee(employee);
    hs.save(employeeProjectCodeAccessItem);
    %>
    {
    "status": "OK"
    }
    <%
} else if("deleteEmployeeProjectCodeAccessItem".equals(command)) {
    EmployeeProjectCodeAccessItem employeeProjectCodeAccessItem = (EmployeeProjectCodeAccessItem)hs.get(EmployeeProjectCodeAccessItem.class, new Long(request.getParameter("id")));
      
    hs.delete(employeeProjectCodeAccessItem);
    %>
    {
    "status": "OK"
    }
    <%
} else if("checkEmployeeProjectCodeAccessItem".equals(command)) {
    EmployeeProjectCodeAccessItem employeeProjectCodeAccessItem = (EmployeeProjectCodeAccessItem)hs.get(EmployeeProjectCodeAccessItem.class, new Long(request.getParameter("id")));
    
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