<%-- 
    Document   : subdepartments
    Created on : 31.03.2011, 13:08:03
    Author     : glazov
--%>
<%@page import="com.mazars.management.web.comparators.PositionWithStandardPositionComparator"%>
<%@page contentType="text/html" pageEncoding="UTF-8"
    import="java.util.*"
    import="com.mazars.management.db.domain.*"
    import="com.mazars.management.db.vo.*"
    import="com.mazars.management.web.forms.*"
    import="com.mazars.management.db.util.HibernateUtil"
    import="org.hibernate.Session"
    import="com.google.gson.Gson"
    import="com.mazars.management.reports.vo.*"
    import="com.mazars.management.web.security.AccessChecker"
    import="com.mazars.management.db.comparators.*"
    import="com.mazars.management.web.vo.*"
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

hs.refresh(currentUser);
if("getInitialContent".equals(command)) {
       List<OfficeVO> officeVOs = new LinkedList<OfficeVO>();
       List<ProjectCodeVO> projectCodeVOs = new LinkedList<ProjectCodeVO>();

       if(Employee.Profile.COUNTRY_ADMINISTRATOR.equals(currentUser.getProfile())) {
           Country country = currentUser.getCountry();
           List<Office> offices = new LinkedList<Office>(country.getOffices());
           Collections.sort(offices, new OfficeComparator());
           for(Office office : offices) {
               officeVOs.add(new OfficeVO(office));
           }
       } else if(Employee.Profile.SUPER_USER.equals(currentUser.getProfile())) {
            List<Office> offices = new LinkedList<Office>();
            offices = RightsItem.getOffices(currentUser, module);
            Collections.sort(offices, new OfficeComparator());
            for(Office office : offices) {
                officeVOs.add(new OfficeVO(office));
            }
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

    if(office != null) {
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

    if(department != null) {
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
    }
    %>
    {
        "status": "OK",
        "subdepartments": <% gson.toJson(subdepartmentVOs, out); %>
    }
    <%
} else if("getSubdepartmentContent".equals(command)) {
    Subdepartment subdepartment = (Subdepartment)hs.get(Subdepartment.class, new Long(request.getParameter("subdepartmentId")));
    List<StandardSellingRateBlockVO> standardSellingRateBlockVOs = new LinkedList<StandardSellingRateBlockVO>();
    List<StandardCostBlockVO> standardCostBlockVOs = new LinkedList<StandardCostBlockVO>();

    List<StandardSellingRateGroup> standardSellingRateGroups = new LinkedList<StandardSellingRateGroup>(subdepartment.getStandardSellingRateGroups());
    Collections.sort(standardSellingRateGroups, new StandardSellingRateGroupComparator());
    Collections.reverse(standardSellingRateGroups);
    for(StandardSellingRateGroup standardSellingRateGroup : standardSellingRateGroups) {
        standardSellingRateBlockVOs.add(new StandardSellingRateBlockVO(standardSellingRateGroup));
    }
    List<StandardCostGroup> standardCostGroups = new LinkedList<StandardCostGroup>(subdepartment.getStandardCostGroups());
    Collections.sort(standardCostGroups, new StandardCostGroupComparator());
    Collections.reverse(standardCostGroups);
    for(StandardCostGroup standardCostGroup : standardCostGroups) {
        standardCostBlockVOs.add(new StandardCostBlockVO(standardCostGroup));
    }
    List<PositionWithStandardPositionVO> positionWithStandardPositionVOs = new LinkedList<PositionWithStandardPositionVO>();
    for(Position position : subdepartment.getPositions()) {
        positionWithStandardPositionVOs.add(new PositionWithStandardPositionVO(position));
    }
    Collections.sort(positionWithStandardPositionVOs, new PositionWithStandardPositionComparator()); 
%>
    {
        "status": "OK",
        "standardSellingRateBlocks" : <% gson.toJson(standardSellingRateBlockVOs, out); %>,
        "standardCostBlocks" : <% gson.toJson(standardCostBlockVOs, out); %>,
        "positions" : <% gson.toJson(positionWithStandardPositionVOs, out); %>
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
