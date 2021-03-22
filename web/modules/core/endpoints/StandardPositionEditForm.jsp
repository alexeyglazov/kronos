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

if("saveStandardPosition".equals(command)) {
    StandardPositionEditForm standardPositionEditForm = StandardPositionEditForm.getFromJson(request.getParameter("standardPositionEditForm"));

        if(StandardPositionEditForm.Mode.CREATE.equals(standardPositionEditForm.getMode())) {
            if(StandardPosition.getByName(standardPositionEditForm.getName()) != null) {
                %>{"status": "FAIL", "comment": "StandardPosition with the same name already exists"}<%
            } else {
                StandardPosition standardPosition = new StandardPosition();
                standardPosition.setName(standardPositionEditForm.getName());
                standardPosition.setSortValue(standardPositionEditForm.getSortValue());
                hs.save(standardPosition);
                %>
                {
                "status": "OK"
                }
                <%
            }
        } else if(StandardPositionEditForm.Mode.UPDATE.equals(standardPositionEditForm.getMode())) {
            StandardPosition standardPosition = (StandardPosition)hs.get(StandardPosition.class, new Long(standardPositionEditForm.getId()));
            Integer sameNameStandardPositionsCount = 0;
            StandardPosition standardPositionTmp = StandardPosition.getByName(standardPositionEditForm.getName());
            if(standardPositionTmp != null && standardPositionTmp.getId() != standardPosition.getId()) {
                sameNameStandardPositionsCount++;
            }
            if(sameNameStandardPositionsCount > 0) {
                %>{"status": "FAIL", "comment": "StandardPosition with the same Name already exists"}<%
            } else {
                standardPosition.setName(standardPositionEditForm.getName());
                standardPosition.setSortValue(standardPositionEditForm.getSortValue());
                hs.save(standardPosition);
                %>
                {
                "status": "OK"
                }
                <%
            }
        }
} else if("deleteStandardPosition".equals(command)) {
    StandardPosition standardPosition = (StandardPosition)hs.get(StandardPosition.class, new Long(request.getParameter("id")));
    hs.delete(standardPosition);
    %>
    {
    "status": "OK"
    }
    <%
} else if("checkStandardPositionDependencies".equals(command)) {
    StandardPosition standardPosition = (StandardPosition)hs.get(StandardPosition.class, new Long(request.getParameter("id")));
    %>{
    "status": "OK",
    "positions": <%=standardPosition.getPositions().size() %>
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