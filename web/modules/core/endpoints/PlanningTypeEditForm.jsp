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
if("savePlanningType".equals(command)) {
    PlanningTypeEditForm planningTypeEditForm = PlanningTypeEditForm.getFromJson(request.getParameter("planningTypeEditForm"));
    if(PlanningTypeEditForm.Mode.CREATE.equals(planningTypeEditForm.getMode())) {
        Integer sameNamePlanningTypesCount;
        Subdepartment subdepartment = (Subdepartment)hs.get(Subdepartment.class, new Long(planningTypeEditForm.getSubdepartmentId()));
        sameNamePlanningTypesCount = PlanningType.getByName(planningTypeEditForm.getName(), subdepartment).size();
        if(sameNamePlanningTypesCount > 0) {
            %>{"status": "FAIL", "comment": "Planning Type with the same Name already exists"}<%
        } else {
            PlanningType planningType = new PlanningType();
            planningType.setSubdepartment(subdepartment);
            planningType.setName(planningTypeEditForm.getName());
            planningType.setIsActive(planningTypeEditForm.getIsActive());
            planningType.setIsInternal(planningTypeEditForm.getIsInternal());
            hs.save(planningType);
            %>
            {
            "status": "OK"
            }
            <%
        }
    } else if(PlanningTypeEditForm.Mode.UPDATE.equals(planningTypeEditForm.getMode())) {
        PlanningType planningType = (PlanningType)hs.get(PlanningType.class, new Long(planningTypeEditForm.getId()));
        Integer sameNamePlanningTypesCount = 0;
        Subdepartment subdepartment = (Subdepartment)hs.get(Subdepartment.class, new Long(planningTypeEditForm.getSubdepartmentId()));
        for(PlanningType planningTypeTmp : PlanningType.getByName(planningTypeEditForm.getName(), subdepartment)) {
            if(planningTypeTmp.getId() != planningType.getId()) {
                sameNamePlanningTypesCount++;
            }
        }
        if(sameNamePlanningTypesCount > 0) {
            %>{"status": "FAIL", "comment": "Task Type with the same Name already exists"}<%
        } else {
            planningType.setName(planningTypeEditForm.getName());
            planningType.setIsActive(planningTypeEditForm.getIsActive());
            planningType.setIsInternal(planningTypeEditForm.getIsInternal());
            planningType.setSubdepartment(subdepartment);
            hs.save(planningType);
            %>
            {
            "status": "OK"
            }
            <%
        }
    }
} else if("deletePlanningType".equals(command)) {
    PlanningType planningType = (PlanningType)hs.get(PlanningType.class, new Long(request.getParameter("id")));
    hs.delete(planningType);
    %>
    {
    "status": "OK"
    }
    <%
} else if("checkPlanningTypeDependencies".equals(command)) {
    PlanningType planningType = (PlanningType)hs.get(PlanningType.class, new Long(request.getParameter("id")));
    %>{
    "status": "OK",
    "planningGroups": <%=planningType.getPlanningGroups().size() %>
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