<%-- 
    Document   : subdepartments
    Created on : 31.03.2011, 13:08:03
    Author     : glazov
--%>
<%@page import="com.mazars.management.web.vo.ConciseEmployee"%>
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
if("getInitialContent".equals(command)) {
    ClientListFilter filter = ClientListFilter.getFromJson(request.getParameter("filter"));
       
    Group group = null;
    if(filter.getGroupId() != null) {
        group = (Group)hs.get(Group.class, filter.getGroupId());
    }
    ActivitySector activitySector = null;
    ActivitySectorGroup activitySectorGroup = null;
    if(filter.getActivitySectorId() != null) {
        activitySector = (ActivitySector)hs.get(ActivitySector.class, filter.getActivitySectorId());
        activitySectorGroup = activitySector.getActivitySectorGroup();
    } else if(filter.getActivitySectorGroupId() != null) {
        activitySectorGroup = (ActivitySectorGroup)hs.get(ActivitySectorGroup.class, filter.getActivitySectorGroupId());      
    }   

    ISOCountry isoCountry = null;
    if(filter.getCountryId() != null) {
        isoCountry = (ISOCountry)hs.get(ISOCountry.class, filter.getCountryId());
    }

    Subdepartment subdepartment = null;
    Department department = null;
    Office office = null;
    if(filter.getSubdepartmentId() != null) {
        subdepartment = (Subdepartment)hs.get(Subdepartment.class, filter.getSubdepartmentId());
        department = subdepartment.getDepartment();
        office = department.getOffice();
    } else if(filter.getDepartmentId() != null) {
        department = (Department)hs.get(Department.class, filter.getDepartmentId());
        office = department.getOffice();       
    } else if(filter.getOfficeId() != null) {
        office = (Office)hs.get(Office.class, filter.getOfficeId());      
    }
    
    Country country = currentUser.getCountry();
    List<Group> groups = new LinkedList<Group>(country.getGroups());
    List<ActivitySectorGroup> activitySectorGroups = ActivitySectorGroup.getAll();;
    List<ActivitySector> activitySectors = new LinkedList<ActivitySector>();
    List<Office> offices = new LinkedList<Office>();
    List<Department> departments = new LinkedList<Department>();
    List<Subdepartment> subdepartments = new LinkedList<Subdepartment>();
    if(activitySectorGroup != null) {
        activitySectors = new LinkedList<ActivitySector>(activitySectorGroup.getActivitySectors());
    } else {
        activitySectors = new LinkedList<ActivitySector>(ActivitySector.getAll());
    }
    List<ISOCountry> isoCountries = ISOCountry.getAll();
    if(Employee.Profile.COUNTRY_ADMINISTRATOR.equals(currentUser.getProfile())) {
       if(country != null) {
           offices = new LinkedList<Office>(country.getOffices());
       }
       if(office != null) {
           departments = new LinkedList<Department>(office.getDepartments());
       }
       if(department != null) {
           subdepartments = new LinkedList<Subdepartment>(department.getSubdepartments());
       }
    } else if(Employee.Profile.SUPER_USER.equals(currentUser.getProfile())) {
       if(country != null) {
           offices = new LinkedList<Office>(RightsItem.getOffices(currentUser, module, country));
       }
       if(office != null) {
           departments = new LinkedList<Department>(RightsItem.getDepartments(currentUser, module, office));
       }
       if(department != null) {
           subdepartments = new LinkedList<Subdepartment>(RightsItem.getSubdepartments(currentUser, module, department));
       }
    }

    Collections.sort(groups, new GroupComparator());
    Collections.sort(activitySectorGroups, new ActivitySectorGroupComparator());
    Collections.sort(activitySectors, new ActivitySectorComparator());
    Collections.sort(isoCountries, new ISOCountryComparator());
    Collections.sort(offices, new OfficeComparator());
    Collections.sort(departments, new DepartmentComparator());
    Collections.sort(subdepartments, new SubdepartmentComparator());
    
    List<GroupVO> groupVOs = GroupVO.getList(groups);
    List<ActivitySectorGroupVO> activitySectorGroupVOs = ActivitySectorGroupVO.getList(activitySectorGroups);
    List<ActivitySectorVO> activitySectorVOs = ActivitySectorVO.getList(activitySectors);
    List<ISOCountryVO> isoCountryVOs = ISOCountryVO.getList(isoCountries);
    List<OfficeVO> officeVOs = OfficeVO.getList(offices);
    List<DepartmentVO> departmentVOs = DepartmentVO.getList(departments);
    List<SubdepartmentVO> subdepartmentVOs = SubdepartmentVO.getList(subdepartments);
    
%>
{
"status": "OK",
"groups": <% gson.toJson(groupVOs, out); %>,
"offices": <% gson.toJson(officeVOs, out); %>,
"departments": <% gson.toJson(departmentVOs, out); %>,
"subdepartments": <% gson.toJson(subdepartmentVOs, out); %>,
"activitySectorGroups": <% gson.toJson(activitySectorGroupVOs, out); %>,
"activitySectors": <% gson.toJson(activitySectorVOs, out); %>,
"isoCountries": <% gson.toJson(isoCountryVOs, out); %>,
"groupId": <%=group != null ? group.getId() : null %>,
"activitySectorGroupId": <%=activitySectorGroup != null ? activitySectorGroup.getId() : null %>,
"activitySectorId": <%=activitySector != null ? activitySector.getId() : null %>,
"officeId": <%=office != null ? office.getId() : null %>,
"departmentId": <%=department != null ? department.getId() : null %>,
"subdepartmentId": <%=subdepartment != null ? subdepartment.getId() : null %>,
"countryId": <%= isoCountry != null ? isoCountry.getId() : null %>
}
<%
} else if("getOfficeContent".equals(command)) {
       List<DepartmentVO> departmentVOs = new LinkedList<DepartmentVO>();
       Office office = (Office)hs.get(Office.class, new Long(request.getParameter("officeId")));
       List<Department> departments = new LinkedList<Department>();
       if(Employee.Profile.COUNTRY_ADMINISTRATOR.equals(currentUser.getProfile())) {
           departments = new LinkedList<Department>(office.getDepartments());
       } else if(Employee.Profile.SUPER_USER.equals(currentUser.getProfile())) {
           departments = new LinkedList<Department>(RightsItem.getDepartments(currentUser, module, office));
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
    List<SubdepartmentVO> subdepartmentVOs = new LinkedList<SubdepartmentVO>();
    Department department = (Department)hs.get(Department.class, new Long(request.getParameter("departmentId")));
    List<Subdepartment> subdepartments = new LinkedList<Subdepartment>();
    if(Employee.Profile.COUNTRY_ADMINISTRATOR.equals(currentUser.getProfile())) {
        subdepartments = new LinkedList<Subdepartment>(department.getSubdepartments());
    } else if(Employee.Profile.SUPER_USER.equals(currentUser.getProfile())) {
        subdepartments = new LinkedList<Subdepartment>(RightsItem.getSubdepartments(currentUser, module, department));
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
} else if("getActivitySectorGroupContent".equals(command)) {
    ActivitySectorGroup activitySectorGroup = null;
    if(request.getParameter("activitySectorGroupId") != null) {
        activitySectorGroup = (ActivitySectorGroup)hs.get(ActivitySectorGroup.class, new Long(request.getParameter("activitySectorGroupId")));
    }
    List<ActivitySector> activitySectors = new LinkedList<ActivitySector>();
    if(activitySectorGroup != null) {
        activitySectors = new LinkedList<ActivitySector>(activitySectorGroup.getActivitySectors());
    } else {
        activitySectors = new LinkedList<ActivitySector>(ActivitySector.getAll());
    }
    Collections.sort(activitySectors, new ActivitySectorComparator());
    List<ActivitySectorVO> activitySectorVOs = ActivitySectorVO.getList(activitySectors);
%>
{
"status": "OK",
"activitySectors": <% gson.toJson(activitySectorVOs, out); %>
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