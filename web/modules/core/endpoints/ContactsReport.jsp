<%-- 
    Document   : subdepartments
    Created on : 31.03.2011, 13:08:03
    Author     : glazov
--%><%@page import="java.io.PrintStream"%>
<%@page import="java.io.PrintWriter"%>
<%@page import="com.mazars.management.reports.excel.ContactsReportExcelBuilder"%>
<%@page import="com.mazars.management.reports.ContactsReport"%>
<%@page import="com.mazars.management.reports.excel.CredentialsReportExcelBuilder"%>
<%@page contentType="text/html" pageEncoding="UTF-8"
    import="java.util.*"
    import="com.mazars.management.db.domain.*"
    import="com.mazars.management.db.vo.*"
    import="com.mazars.management.web.forms.*"
    import="com.mazars.management.db.util.HibernateUtil"
    import="org.hibernate.Session"
    import="com.google.gson.Gson"
    import="com.mazars.management.reports.TimeSheetReport"
    import="com.mazars.management.reports.vo.*"
    import="java.text.SimpleDateFormat"
    import="com.mazars.management.reports.excel.TimeSheetReportExcelBuilder"
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
Module module = Module.getByName("Clients Report");

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
       List<Office> offices = new LinkedList<Office>();
       
       Country country = currentUser.getCountry();
       if(Employee.Profile.COUNTRY_ADMINISTRATOR.equals(currentUser.getProfile())) {
           offices.addAll(country.getOffices());
       } else if(Employee.Profile.SUPER_USER.equals(currentUser.getProfile())) {
           offices.addAll(RightsItem.getOffices(currentUser, module, country));
       }
       Collections.sort(offices, new OfficeComparator());
       
       List<OfficeVO> officeVOs = OfficeVO.getList(offices);
%>
{
"status": "OK",
"offices": <% gson.toJson(officeVOs, out); %>
}
<%
} else if("getOfficeContent".equals(command)) {
       Office office = (Office)hs.get(Office.class, new Long(request.getParameter("officeId")));

       List<Department> departments = new LinkedList<Department>();
       if(Employee.Profile.COUNTRY_ADMINISTRATOR.equals(currentUser.getProfile())) {
           Country country = currentUser.getCountry();
           departments.addAll(office.getDepartments());
       } else if(Employee.Profile.SUPER_USER.equals(currentUser.getProfile())) {
           departments.addAll(RightsItem.getDepartments(currentUser, module, office));
       }
       Collections.sort(departments, new DepartmentComparator());
       List<DepartmentVO> departmentVOs = DepartmentVO.getList(departments);
%>
{
"status": "OK",
"departments": <% gson.toJson(departmentVOs, out); %>
}
<%
} else if("getDepartmentContent".equals(command)) {
       Department department = (Department)hs.get(Department.class, new Long(request.getParameter("departmentId")));

       List<Subdepartment> subdepartments = new LinkedList<Subdepartment>();
       if(Employee.Profile.COUNTRY_ADMINISTRATOR.equals(currentUser.getProfile())) {
           Country country = currentUser.getCountry();
           subdepartments.addAll(department.getSubdepartments());
       } else if(Employee.Profile.SUPER_USER.equals(currentUser.getProfile())) {
           subdepartments.addAll(RightsItem.getSubdepartments(currentUser, module, department));
       }
       Collections.sort(subdepartments, new SubdepartmentComparator());
       List<SubdepartmentVO> subdepartmentVOs = SubdepartmentVO.getList(subdepartments);
%>
{
"status": "OK",
"subdepartments": <% gson.toJson(subdepartmentVOs, out); %>
}
<%
} else if("getSubdepartmentContent".equals(command)) {
    Subdepartment subdepartment = (Subdepartment)hs.get(Subdepartment.class, new Long(request.getParameter("subdepartmentId")));

    List<Activity> activities = new LinkedList<Activity>();
    if(Employee.Profile.COUNTRY_ADMINISTRATOR.equals(currentUser.getProfile())) {
        if(currentUser.getCountry().getId().equals(subdepartment.getDepartment().getOffice().getCountry().getId())) {
            activities.addAll(subdepartment.getActivities());
        }
    } else if(Employee.Profile.SUPER_USER.equals(currentUser.getProfile())) {
        if(RightsItem.isAvailable(subdepartment, currentUser, module)) {
           activities.addAll(subdepartment.getActivities());
        }   
    }
    Collections.sort(activities, new ActivityComparator());
    List<ActivityVO> activityVOs = ActivityVO.getList(activities);
%>
{
"status": "OK",
"activities": <% gson.toJson(activityVOs, out); %>
}
<%
} else if("generateReport".equals(command)) {
    ContactsReportForm contactsReportForm = ContactsReportForm.getFromJson(request.getParameter("contactsReportForm"));
    ContactsReport contactsReport = new ContactsReport(contactsReportForm, module, currentUser);
    contactsReport.build();
    ContactsReportVO contactsReportVO = new ContactsReportVO(contactsReport);
    %>
    {
    "status": "OK",
    "report": <% gson.toJson(contactsReportVO, out); %>
    }
    <%
} else if("generateXLSReport".equals(command)) {
    ContactsReportForm contactsReportForm = ContactsReportForm.getFromJson(request.getParameter("contactsReportForm"));
    ContactsReport contactsReport = new ContactsReport(contactsReportForm, module, currentUser);
    contactsReport.build();

    SimpleDateFormat dateFormatterShort = new SimpleDateFormat("ddMMyyyy");
    SimpleDateFormat dateFormatterLong = new SimpleDateFormat("ddMMyyyyHHmmss");
    String office = "ALL";
    String department = "ALL";
    String subdepartment = "ALL";
    String activity = "ALL";
    String normalPosition = "ALL";
    if(contactsReportForm.getOfficeId() != null) {
        office = "" + contactsReportForm.getOfficeId();
    }
    if(contactsReportForm.getDepartmentId() != null) {
        department = "" + contactsReportForm.getDepartmentId();
    }
    if(contactsReportForm.getSubdepartmentId() != null) {
        subdepartment = "" + contactsReportForm.getSubdepartmentId();
    }
    if(contactsReportForm.getActivityId() != null) {
        activity = "" + contactsReportForm.getActivityId();
    }
    if(contactsReportForm.getNormalPosition() != null) {
        normalPosition = "" + contactsReportForm.getNormalPosition();
    }
    
    String fileName = "CONTACTS_" + office + "_" + department + "_" + subdepartment + "_" + activity + "_" + normalPosition + "_";
    fileName += dateFormatterLong.format(contactsReport.getCreatedAt());
    fileName += ".xls";

    response.setContentType("application/vnd.ms-excel");
    response.setHeader("content-disposition", "filename=" + fileName);
    ContactsReportExcelBuilder reb = new ContactsReportExcelBuilder(contactsReport, response.getOutputStream());
    reb.createStandardReport(response.getOutputStream());
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
