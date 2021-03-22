<%-- 
    Document   : subdepartments
    Created on : 31.03.2011, 13:08:03
    Author     : glazov
--%>
<%@page import="java.io.PrintWriter"%>
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
Module module = Module.getByName("HR");

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

if("getInitialContent".equals(command)) {
       List<OfficeVO> officeVOs = new LinkedList<OfficeVO>();
       Country country = currentUser.getCountry();
       List<Office> offices = new LinkedList<Office>();
       if(Employee.Profile.COUNTRY_ADMINISTRATOR.equals(currentUser.getProfile())) {
           offices = new LinkedList<Office>(country.getOffices());
       } else if(Employee.Profile.SUPER_USER.equals(currentUser.getProfile())) {
           offices = RightsItem.getOffices(currentUser, module, country);
       }

       Collections.sort(offices, new OfficeComparator());
       for(Office office : offices) {
            officeVOs.add(new OfficeVO(office));
       }
%>
{
"status": "OK",
"offices": <% gson.toJson(officeVOs, out); %>
}
<%       
} else if("getOfficeContent".equals(command)) {
       Office office = (Office)hs.get(Office.class, new Long(request.getParameter("officeId")));
       List<DepartmentVO> departmentVOs = new LinkedList<DepartmentVO>();
       List<Department> departments = new LinkedList<Department>();
       if(Employee.Profile.COUNTRY_ADMINISTRATOR.equals(currentUser.getProfile())) {
           departments.addAll(office.getDepartments());
       } else if(Employee.Profile.SUPER_USER.equals(currentUser.getProfile())) {
           departments = RightsItem.getDepartments(currentUser, module, office);
       }
       Collections.sort(departments, new DepartmentComparator());
       for(Department department : departments) {
           departmentVOs.add(new DepartmentVO(department));
       }
%>
{
"status": "OK",
"departments": <% gson.toJson(departmentVOs, out); %>
}
<%
} else if("getDepartmentContent".equals(command)) {
       Department department = (Department)hs.get(Department.class, new Long(request.getParameter("departmentId")));
       List<SubdepartmentVO> subdepartmentVOs = new LinkedList<SubdepartmentVO>();
       List<Subdepartment> subdepartments = new LinkedList<Subdepartment>();
       if(Employee.Profile.COUNTRY_ADMINISTRATOR.equals(currentUser.getProfile())) {
           subdepartments.addAll(department.getSubdepartments());
       } else if(Employee.Profile.SUPER_USER.equals(currentUser.getProfile())) {
           subdepartments = RightsItem.getSubdepartments(currentUser, module, department);
       }
       Collections.sort(subdepartments, new SubdepartmentComparator());
       for(Subdepartment subdepartment : subdepartments) {
           subdepartmentVOs.add(new SubdepartmentVO(subdepartment));
       }
%>
{
"status": "OK",
"subdepartments": <% gson.toJson(subdepartmentVOs, out); %>
}
<%
} else if("getSubdepartmentContent".equals(command)) {
    Subdepartment subdepartment = (Subdepartment)hs.get(Subdepartment.class, new Long(request.getParameter("subdepartmentId")));
    List<PositionVO> positionVOs = new LinkedList<PositionVO>();
       
    List<Position> positions = new LinkedList<Position>(subdepartment.getPositions() );
    Collections.sort(positions, new PositionComparator());
    for(Position position : positions) {
        positionVOs.add(new PositionVO(position));
    }
%>
{
"status": "OK",
"positions": <% gson.toJson(positionVOs, out); %>
}
<%
} else if("getPositionContent".equals(command)) {
    Position position = (Position)hs.get(Position.class, new Long(request.getParameter("positionId")));
    List<AnnualPaidLeaveVO> annualPaidLeaveVOs = new LinkedList<AnnualPaidLeaveVO>();
       
    List<AnnualPaidLeave> annualPaidLeaves = new LinkedList<AnnualPaidLeave>(position.getAnnualPaidLeaves());
    Collections.sort(annualPaidLeaves, new AnnualPaidLeaveComparator());
    for(AnnualPaidLeave annualPaidLeave : annualPaidLeaves) {
        annualPaidLeaveVOs.add(new AnnualPaidLeaveVO(annualPaidLeave));
    }
    List<String> errors = AnnualPaidLeave.validate(position);
%>
{
"status": "OK",
"annualPaidLeaves": <% gson.toJson(annualPaidLeaveVOs, out); %>,
"errors": <% gson.toJson(errors, out); %>
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