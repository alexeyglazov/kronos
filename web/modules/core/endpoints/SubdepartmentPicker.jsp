<%-- 
    Document   : subdepartments
    Created on : 31.03.2011, 13:08:03
    Author     : glazov
--%>
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
       List<CountryVO> countryVOs = new LinkedList<CountryVO>();
       if(Employee.Profile.COUNTRY_ADMINISTRATOR.equals(currentUser.getProfile())) {
           countryVOs.add(new CountryVO(currentUser.getCountry()));
       } else if(Employee.Profile.SUPER_USER.equals(currentUser.getProfile())) {
           List<Country> countries = new LinkedList<Country>(RightsItem.getCountries(currentUser, module));
           Collections.sort(countries, new CountryComparator());
           for(Country country : countries) {
               countryVOs.add(new CountryVO(country));
           }
       }
%>
{
"status": "OK",
"countries": <% gson.toJson(countryVOs, out); %>
}
<%
} else if("getCountryContent".equals(command)) {
       List<OfficeVO> officeVOs = new LinkedList<OfficeVO>();
       Country country = (Country)hs.get(Country.class, new Long(request.getParameter("countryId")));
       List<Office> offices = new LinkedList<Office>();
       if(Employee.Profile.COUNTRY_ADMINISTRATOR.equals(currentUser.getProfile())) {
           if(country != null) {
               offices = new LinkedList<Office>(country.getOffices());
           }
       } else if(Employee.Profile.SUPER_USER.equals(currentUser.getProfile())) {
           if(country != null) {
               offices = new LinkedList<Office>(RightsItem.getOffices(currentUser, module, country));
           }
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