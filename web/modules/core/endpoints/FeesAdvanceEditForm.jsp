<%-- 
    Document   : subdepartments
    Created on : 31.03.2011, 13:08:03
    Author     : glazov
--%><%@page import="java.util.Map"%>
<%@page import="java.util.HashMap"%>
<%@page contentType="text/html" pageEncoding="UTF-8"
    import="java.util.List"
    import="java.util.LinkedList"
    import="java.util.Locale"
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
Module module = Module.getByName("Financial Information");

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

if("saveFeesAdvance".equals(command)) {
    FeesAdvanceEditForm feesAdvanceEditForm = FeesAdvanceEditForm.getFromJson(request.getParameter("feesAdvanceEditForm"));
    if(FeesAdvanceEditForm.Mode.CREATE.equals(feesAdvanceEditForm.getMode())) {
        FeesItem feesItem = (FeesItem)hs.get(FeesItem.class, new Long(feesAdvanceEditForm.getFeesItemId()));
        FeesAdvance feesAdvance = new FeesAdvance();
        feesAdvance.setFeesItem(feesItem);

        feesAdvance.setIsAdvance(feesAdvanceEditForm.getIsAdvance());
        feesAdvance.setAmount(feesAdvanceEditForm.getAmount());
        if(feesAdvanceEditForm.getDate() != null) {
            feesAdvance.setDate(feesAdvanceEditForm.getDate().getCalendar());
        } else {
            feesAdvance.setDate(null);
        }
        hs.save(feesAdvance);
    } else if(FeesAdvanceEditForm.Mode.UPDATE.equals(feesAdvanceEditForm.getMode())) {
        FeesAdvance feesAdvance = (FeesAdvance)hs.get(FeesAdvance.class, new Long(feesAdvanceEditForm.getId()));
        feesAdvance.setIsAdvance(feesAdvanceEditForm.getIsAdvance());
        feesAdvance.setAmount(feesAdvanceEditForm.getAmount());
        if(feesAdvanceEditForm.getDate() != null) {
            feesAdvance.setDate(feesAdvanceEditForm.getDate().getCalendar());
        } else {
            feesAdvance.setDate(null);
        }

        hs.save(feesAdvance);
    }
    %>
    {
    "status": "OK"
    }
    <%
} else if("deleteFeesAdvance".equals(command)) {
    FeesAdvance feesAdvance = (FeesAdvance)hs.get(FeesAdvance.class, new Long(request.getParameter("id")));
    hs.delete(feesAdvance);
    %>
    {
    "status": "OK"
    }
    <%
} else if("checkFeesAdvanceDependencies".equals(command)) {
    FeesAdvance feesAdvance = (FeesAdvance)hs.get(FeesAdvance.class, new Long(request.getParameter("id")));
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