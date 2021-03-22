<%-- 
    Document   : subdepartments
    Created on : 31.03.2011, 13:08:03
    Author     : glazov
--%><%@page import="com.mazars.management.web.vo.PlanningToolInfo"%>
<%@page import="com.mazars.management.db.util.PlanningItemUtil"%>
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
Module module = Module.getByName("Planning Write");

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
if("searchPlanningGroups".equals(command)) {
    PlanningGroupPickerForm planningGroupPickerForm = PlanningGroupPickerForm.getFromJson(request.getParameter("planningGroupPickerForm"));
    List<PlanningGroupVO> planningGroupVOs = new LinkedList<PlanningGroupVO>();  
    List<PlanningGroup> planningGroups = PlanningGroup.search(planningGroupPickerForm);
    Collections.sort(planningGroups, new PlanningGroupComparator());
    planningGroupVOs = PlanningGroupVO.getList(planningGroups);
%>
{
"status": "OK",
"planningGroups": <% gson.toJson(planningGroupVOs, out); %>
}
<%
} else if("getPlanningGroupInfo".equals(command)) {
    PlanningGroup planningGroup = (PlanningGroup)hs.get(PlanningGroup.class, new Long(request.getParameter("planningGroupId")));
    List<PlanningItemUtil.DescribedPlanningItem> describedPlanningItems = PlanningItemUtil.getDescribedPlanningItemsByPlanningGroup(planningGroup);   
    PlanningToolInfo planningToolInfo = new PlanningToolInfo();
    planningToolInfo.addDescribedPlanningItems(describedPlanningItems);
%>
    {
    "status": "OK",
    "planningToolInfo": <% gson.toJson(planningToolInfo, out); %>
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