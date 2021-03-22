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

if("saveModule".equals(command)) {
    ModuleEditForm moduleEditForm = ModuleEditForm.getFromJson(request.getParameter("moduleEditForm"));
        if(ModuleEditForm.Mode.CREATE.equals(moduleEditForm.getMode())) {
            Integer sameNameModulesCount = Module.getByName(moduleEditForm.getName()) != null ? 1 : 0;
            if(sameNameModulesCount > 0) {
                %>{"status": "FAIL", "comment": "Module with the same name already exists"}<%
            } else {
                Module tmpModule = new Module();
                tmpModule.setName(moduleEditForm.getName());
                tmpModule.setIsReport(moduleEditForm.getIsReport());
                tmpModule.setDescription(moduleEditForm.getDescription());
                hs.save(tmpModule);
                %>
                {
                "status": "OK"
                }
                <%
            }
        } else if(ModuleEditForm.Mode.UPDATE.equals(moduleEditForm.getMode())) {
            Module tmpModule = (Module)hs.get(Module.class, new Long(moduleEditForm.getId()));
            Integer sameNameModulesCount = 0;
            Module moduleTmp = Module.getByName(moduleEditForm.getName());
            if(moduleTmp != null && moduleTmp.getId() != tmpModule.getId()) {
                sameNameModulesCount++;
            }
            if(sameNameModulesCount > 0) {
                %>{"status": "FAIL", "comment": "Module with the same Name already exists"}<%
            } else {
                tmpModule.setName(moduleEditForm.getName());
                tmpModule.setIsReport(moduleEditForm.getIsReport());
                tmpModule.setDescription(moduleEditForm.getDescription());
                hs.save(tmpModule);
                %>
                {
                "status": "OK"
                }
                <%
            }
        }
} else if("deleteModule".equals(command)) {
    Module tmpModule = (Module)hs.get(Module.class, new Long(request.getParameter("id")));
    hs.delete(tmpModule);
    %>
    {
    "status": "OK"
    }
    <%
} else if("checkModuleDependencies".equals(command)) {
    Module tmpModule = (Module)hs.get(Module.class, new Long(request.getParameter("id")));
    %>{
    "status": "OK",
    "rightsItems": <%=tmpModule.getRightsItems().size() %>
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