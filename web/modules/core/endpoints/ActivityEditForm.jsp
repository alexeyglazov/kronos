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

if("saveActivity".equals(command)) {
    ActivityEditForm activityEditForm = ActivityEditForm.getFromJson(request.getParameter("activityEditForm"));
        if(ActivityEditForm.Mode.CREATE.equals(activityEditForm.getMode())) {
            Subdepartment subdepartment = (Subdepartment)hs.get(Subdepartment.class, new Long(activityEditForm.getSubdepartmentId()));
            Integer sameNameActivitiesCount = Activity.getByName(activityEditForm.getName(), subdepartment).size();
            Integer sameCodeNameActivitiesCount = Activity.getByCodeName(activityEditForm.getCodeName(), subdepartment).size();
            if(sameNameActivitiesCount > 0) {
                %>{"status": "FAIL", "comment": "Activity with the same Name already exists"}<%
            } else if(sameCodeNameActivitiesCount > 0) {
                %>{"status": "FAIL", "comment": "Activity with the same Code Name already exists"}<%
            } else {
                Activity activity = new Activity();
                activity.setSubdepartment(subdepartment);
                activity.setName(activityEditForm.getName());
                activity.setCodeName(activityEditForm.getCodeName());
                activity.setIsActive(activityEditForm.getIsActive());
                activity.setIsConflictCheck(activityEditForm.getIsConflictCheck());
                hs.save(activity);
                %>
                {
                "status": "OK"
                }
                <%
            }
        } else if(ActivityEditForm.Mode.UPDATE.equals(activityEditForm.getMode())) {
            Activity activity = (Activity)hs.get(Activity.class, new Long(activityEditForm.getId()));
            Integer sameNameActivitiesCount = 0;
            Integer sameCodeNameActivitiesCount = 0;
            for(Activity activityTmp : Activity.getByName(activityEditForm.getName(), activity.getSubdepartment())) {
                if(activityTmp.getId() != activity.getId()) {
                    sameNameActivitiesCount++;
                }
            }
            for(Activity activityTmp : Activity.getByCodeName(activityEditForm.getCodeName(), activity.getSubdepartment())) {
                if(activityTmp.getId() != activity.getId()) {
                    sameCodeNameActivitiesCount++;
                }
            }
            if(sameNameActivitiesCount > 0) {
                %>{"status": "FAIL", "comment": "Activity with the same Name already exists"}<%
            } else if(sameCodeNameActivitiesCount > 0) {
                %>{"status": "FAIL", "comment": "Activity with the same Code Name already exists"}<%
            } else {
                activity.setName(activityEditForm.getName());
                activity.setCodeName(activityEditForm.getCodeName());
                activity.setIsActive(activityEditForm.getIsActive());
                activity.setIsConflictCheck(activityEditForm.getIsConflictCheck());
                hs.save(activity);
                %>
                {
                "status": "OK"
                }
                <%
            }
        }
} else if("deleteActivity".equals(command)) {
    Activity activity = (Activity)hs.get(Activity.class, new Long(request.getParameter("id")));
    hs.delete(activity);
    %>
    {
    "status": "OK"
    }
    <%
} else if("checkActivityDependencies".equals(command)) {
    Activity activity = (Activity)hs.get(Activity.class, new Long(request.getParameter("id")));
    %>
    {
    "status": "OK",
    "projectCodes": <%=activity.getProjectCodes().size() %>
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