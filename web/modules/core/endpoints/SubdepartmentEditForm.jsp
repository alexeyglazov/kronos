<%-- 
    Document   : subdepartments
    Created on : 31.03.2011, 13:08:03
    Author     : glazov
--%><%@page import="java.io.PrintWriter"%>
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

if("saveSubdepartment".equals(command)) {
    SubdepartmentEditForm subdepartmentEditForm = SubdepartmentEditForm.getFromJson(request.getParameter("subdepartmentEditForm"));
    if(SubdepartmentEditForm.Mode.CREATE.equals(subdepartmentEditForm.getMode())) {
        Department department = (Department)hs.get(Department.class, new Long(subdepartmentEditForm.getDepartmentId()));
        Integer sameNameSubdepartmentsCount = Subdepartment.getByName(subdepartmentEditForm.getName(), department).size();
        Integer sameCodeNameSubdepartmentsCount = Subdepartment.getByCodeName(subdepartmentEditForm.getCodeName(), department).size();
        if(sameNameSubdepartmentsCount > 0) {
            %>{"status": "FAIL", "comment": "Subdepartment with the same Name already exists"}<%
        } else if(sameCodeNameSubdepartmentsCount > 0) {
            %>{"status": "FAIL", "comment": "Subdepartment with the same Code Name already exists"}<%
        } else {
            Subdepartment subdepartment = new Subdepartment();
            subdepartment.setDepartment(department);
            subdepartment.setName(subdepartmentEditForm.getName());
            subdepartment.setCodeName(subdepartmentEditForm.getCodeName());
            subdepartment.setDescription(subdepartmentEditForm.getDescription());
            subdepartment.setIsActive(subdepartmentEditForm.getIsActive());
            hs.save(subdepartment);
            %>
            {
            "status": "OK"
            }
            <%
        }
   } else if(SubdepartmentEditForm.Mode.UPDATE.equals(subdepartmentEditForm.getMode())) {
        Subdepartment subdepartment = (Subdepartment)hs.get(Subdepartment.class, new Long(subdepartmentEditForm.getId()));
        Integer sameNameSubdepartmentsCount = 0;
        Integer sameCodeNameSubdepartmentsCount = 0;
        for(Subdepartment subdepartmentTmp : Subdepartment.getByName(subdepartmentEditForm.getName(), subdepartment.getDepartment())) {
            if(subdepartmentTmp.getId() != subdepartment.getId()) {
                sameNameSubdepartmentsCount++;
            }
        }
        for(Subdepartment subdepartmentTmp : Subdepartment.getByCodeName(subdepartmentEditForm.getCodeName(), subdepartment.getDepartment())) {
            if(subdepartmentTmp.getId() != subdepartment.getId()) {
                sameCodeNameSubdepartmentsCount++;
            }
        }
        if(sameNameSubdepartmentsCount > 0) {
            %>{"status": "FAIL", "comment": "Subdepartment with the same Name already exists"}<%
        } else if(sameCodeNameSubdepartmentsCount > 0) {
            %>{"status": "FAIL", "comment": "Subdepartment with the same Code Name already exists"}<%
        } else {
            subdepartment.setName(subdepartmentEditForm.getName());
            subdepartment.setCodeName(subdepartmentEditForm.getCodeName());
            subdepartment.setDescription(subdepartmentEditForm.getDescription());
            subdepartment.setIsActive(subdepartmentEditForm.getIsActive());
            hs.save(subdepartment);
            %>
            {
            "status": "OK"
            }
            <%
        }
    }
} else if("deleteSubdepartment".equals(command)) {
    Subdepartment subdepartment = (Subdepartment)hs.get(Subdepartment.class, new Long(request.getParameter("id")));
    hs.delete(subdepartment);
    %>
    {
    "status": "OK"
    }
    <%
} else if("checkSubdepartmentDependencies".equals(command)) {
    Subdepartment subdepartment = (Subdepartment)hs.get(Subdepartment.class, new Long(request.getParameter("id")));
    %>{
    "status": "OK",
    "positions": <%=subdepartment.getPositions().size() %>,
    "activities": <%=subdepartment.getActivities().size() %>,
    "projectCodes": <%=subdepartment.getProjectCodes().size() %>,
    "taskTypes": <%=subdepartment.getTaskTypes().size() %>,
    "rightsItems": <%=subdepartment.getRightsItems().size() %>,
    "standardSellingRateGroups": <%=subdepartment.getStandardSellingRateGroups().size() %>,
    "standardCostGroups": <%=subdepartment.getStandardCostGroups().size() %>,
    "employeeSubdepartmentHistoryItems": <%=subdepartment.getEmployeeSubdepartmentHistoryItems().size() %>
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