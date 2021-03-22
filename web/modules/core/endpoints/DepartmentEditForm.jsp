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

if("saveDepartment".equals(command)) {
    DepartmentEditForm departmentEditForm = DepartmentEditForm.getFromJson(request.getParameter("departmentEditForm"));
    if(DepartmentEditForm.Mode.CREATE.equals(departmentEditForm.getMode())) {
        Office office = (Office)hs.get(Office.class, new Long(departmentEditForm.getOfficeId()));
        Integer sameNameDepartmentsCount = Department.getByName(departmentEditForm.getName(), office).size();
        Integer sameCodeNameDepartmentsCount = Department.getByCodeName(departmentEditForm.getCodeName(), office).size();
        if(sameNameDepartmentsCount > 0) {
            %>{"status": "FAIL", "comment": "Department with the same Name already exists"}<%
        } else if(sameCodeNameDepartmentsCount > 0) {
            %>{"status": "FAIL", "comment": "Department with the same Code Name already exists"}<%
        } else {
            Department department = new Department();
            department.setOffice(office);
            department.setName(departmentEditForm.getName());
            department.setCodeName(departmentEditForm.getCodeName());
            department.setDescription(departmentEditForm.getDescription());
            department.setIsActive(departmentEditForm.getIsActive());
            department.setIsBusinessTrippable(departmentEditForm.getIsBusinessTrippable());
            hs.save(department);
            %>
            {
            "status": "OK"
            }
            <%
        }
    } else if(DepartmentEditForm.Mode.UPDATE.equals(departmentEditForm.getMode())) {
        Department department = (Department)hs.get(Department.class, new Long(departmentEditForm.getId()));
        Integer sameNameDepartmentsCount = 0;
        Integer sameCodeNameDepartmentsCount = 0;
        for(Department departmentTmp : Department.getByName(departmentEditForm.getName(), department.getOffice())) {
            if(departmentTmp.getId() != department.getId()) {
                sameNameDepartmentsCount++;
            }
        }
        for(Department departmentTmp : Department.getByCodeName(departmentEditForm.getCodeName(), department.getOffice())) {
            if(departmentTmp.getId() != department.getId()) {
                sameCodeNameDepartmentsCount++;
            }
        }
        if(sameNameDepartmentsCount > 0) {
            %>{"status": "FAIL", "comment": "Department with the same Name already exists"}<%
        } else if(sameCodeNameDepartmentsCount > 0) {
            %>{"status": "FAIL", "comment": "Department with the same Code Name already exists"}<%
        } else {
            department.setName(departmentEditForm.getName());
            department.setCodeName(departmentEditForm.getCodeName());
            department.setDescription(departmentEditForm.getDescription());
            department.setIsActive(departmentEditForm.getIsActive());
            department.setIsBusinessTrippable(departmentEditForm.getIsBusinessTrippable());
            hs.save(department);
            %>
            {
            "status": "OK"
            }
            <%
        }
    }
} else if("deleteDepartment".equals(command)) {
    Department department = (Department)hs.get(Department.class, new Long(request.getParameter("id")));
    hs.delete(department);
    %>
    {
    "status": "OK"
    }
    <%
} else if("checkDepartmentDependencies".equals(command)) {
    Department department = (Department)hs.get(Department.class, new Long(request.getParameter("id")));
    %>{
    "status": "OK",
    "subdepartments": <%=department.getSubdepartments().size() %>
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