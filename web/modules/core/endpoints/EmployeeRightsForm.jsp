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
    import="com.mazars.management.web.vo.ExtendedSubdepartmentVO"
    import="com.mazars.management.db.comparators.SubdepartmentComparator"
    import="com.mazars.management.db.comparators.DepartmentComparator"
    import="com.mazars.management.db.comparators.OfficeComparator"
%><%
request.setCharacterEncoding("UTF-8");
Employee currentUser = (Employee)session.getAttribute("currentUser");
String command = request.getParameter("command");
Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
Gson gson = new Gson();
try {
hs.beginTransaction();
hs.refresh(currentUser);
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

if("getInitialContent".equals(command)) {
    Employee employee = (Employee)hs.get(Employee.class, new Long(request.getParameter("employeeId")));
    Country country = currentUser.getCountry();
    List<ModuleVO> moduleVOs = new LinkedList<ModuleVO>();
    List<RightsItemVO> rightsItemVOs = new LinkedList<RightsItemVO>();
    List<ExtendedSubdepartmentVO> subdepartmentVOs = new LinkedList<ExtendedSubdepartmentVO>();

    for(Module moduleTmp : Module.getAll()) {
        moduleVOs.add(new ModuleVO(moduleTmp));
    }
    for(RightsItem rightsItem : RightsItem.getRightsItemsByEmployee(employee)) {
        rightsItemVOs.add(new RightsItemVOH(rightsItem));
    }
    for(Subdepartment subdepartment : country.getSubdepartments()) {
        subdepartmentVOs.add(new ExtendedSubdepartmentVO(subdepartment));
    }
    %>
    {
        "status": "OK",
        "modules": <% gson.toJson(moduleVOs, out); %>,
        "rightsItems": <% gson.toJson(rightsItemVOs, out); %>,
        "subdepartments": <% gson.toJson(subdepartmentVOs, out); %>
    }
    <%
} else if("saveRights".equals(command)) {
    EmployeeRightsForm employeeRightsForm = EmployeeRightsForm.getFromJson(request.getParameter("employeeRightsForm"));
    Employee employee = (Employee)hs.get(Employee.class, new Long(employeeRightsForm.getEmployeeId()));
    List<RightsItem> itemsToDelete = new LinkedList<RightsItem>();
    for(RightsItem rightsItem : employee.getRightsItems()) {
        boolean isExist = false;
        for(EmployeeRightsForm.RightsItem rightsItemTmp : employeeRightsForm.getRightsItems()) {
            if(rightsItem.getSubdepartment().getId().equals(rightsItemTmp.getSubdepartmentId()) && 
               rightsItem.getModule().getId().equals(rightsItemTmp.getModuleId())) {
                isExist = true;
                employeeRightsForm.getRightsItems().remove(rightsItemTmp);
                break;
            }
        }
        if(! isExist) {
            itemsToDelete.add(rightsItem);
        }
    }
    for(EmployeeRightsForm.RightsItem rightsItemTmp : employeeRightsForm.getRightsItems()) {
        Subdepartment subdepartment = (Subdepartment)hs.get(Subdepartment.class, rightsItemTmp.getSubdepartmentId());
        Module moduleTmp = (Module)hs.get(Module.class, rightsItemTmp.getModuleId());
        RightsItem rightsItem = new RightsItem();
        rightsItem.setSubdepartment(subdepartment);
        rightsItem.setModule(moduleTmp);
        rightsItem.setEmployee(employee);
        employee.getRightsItems().add(rightsItem);
        hs.save(rightsItem);
    }
    for(RightsItem rightsItem : itemsToDelete) {
        hs.delete(rightsItem);
    }
    hs.save(employee);
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