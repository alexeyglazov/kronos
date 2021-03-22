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

if("savePosition".equals(command)) {
    PositionEditForm positionEditForm = PositionEditForm.getFromJson(request.getParameter("positionEditForm"));
    if(PositionEditForm.Mode.CREATE.equals(positionEditForm.getMode())) {
        Subdepartment subdepartment = (Subdepartment)hs.get(Subdepartment.class, new Long(positionEditForm.getSubdepartmentId()));
        StandardPosition standardPosition = (StandardPosition)hs.get(StandardPosition.class, new Long(positionEditForm.getStandardPositionId()));
        Integer sameNamePositionsCount = Position.getByName(positionEditForm.getName(), subdepartment).size();
        if(sameNamePositionsCount > 0) {
            %>{"status": "FAIL", "comment": "Position with the same Name already exists"}<%
        } else {
            Position position = new Position();
            position.setSubdepartment(subdepartment);
            position.setStandardPosition(standardPosition);
            position.setName(positionEditForm.getName());
            position.setLocalLanguageName(positionEditForm.getLocalLanguageName());
            position.setVisitCardName(positionEditForm.getVisitCardName());
            position.setLocalLanguageVisitCardName(positionEditForm.getLocalLanguageVisitCardName());
            position.setIsActive(positionEditForm.getIsActive());
            position.setSortValue(0);
            hs.save(position);
            %>
            {
            "status": "OK"
            }
            <%
        }
    } else if(PositionEditForm.Mode.UPDATE.equals(positionEditForm.getMode())) {
        Position position = (Position)hs.get(Position.class, new Long(positionEditForm.getId()));
        StandardPosition standardPosition = (StandardPosition)hs.get(StandardPosition.class, new Long(positionEditForm.getStandardPositionId()));
        Integer sameNamePositionsCount = 0;
        for(Position positionTmp : Position.getByName(positionEditForm.getName(), position.getSubdepartment())) {
            if(positionTmp.getId() != position.getId()) {
                sameNamePositionsCount++;
            }
        }
        if(sameNamePositionsCount > 0) {
            %>{"status": "FAIL", "comment": "Position with the same Name already exists"}<%
        } else {
            position.setName(positionEditForm.getName());
            position.setLocalLanguageName(positionEditForm.getLocalLanguageName());
            position.setVisitCardName(positionEditForm.getVisitCardName());
            position.setLocalLanguageVisitCardName(positionEditForm.getLocalLanguageVisitCardName());           
            position.setIsActive(positionEditForm.getIsActive());
            position.setStandardPosition(standardPosition);
            hs.save(position);
            %>
            {
            "status": "OK"
            }
            <%
        }
    }
} else if("getStandardPositions".equals(command)) {
       List<StandardPositionVO> standardPositionVOs = new LinkedList<StandardPositionVO>();
       List<StandardPosition> standardPositions = StandardPosition.getAll();
       for(StandardPosition standardPosition : standardPositions) {
           standardPositionVOs.add(new StandardPositionVO(standardPosition));
       }
       %>
       {
        "status": "OK",
       "standardPositions": <% gson.toJson(standardPositionVOs, out); %>}
       <%
} else if("deletePosition".equals(command)) {
    Position position = (Position)hs.get(Position.class, new Long(request.getParameter("id")));
    hs.delete(position);
    %>
    {
    "status": "OK"
    }
    <%
} else if("checkPositionDependencies".equals(command)) {
    Position position = (Position)hs.get(Position.class, new Long(request.getParameter("id")));
    %>{
    "status": "OK",
    "employeePositionHistoryItems": <%=position.getEmployeePositionHistoryItems().size() %>
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