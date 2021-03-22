<%-- 
    Document   : subdepartments
    Created on : 31.03.2011, 13:08:03
    Author     : glazov
--%>
<%@page import="com.mazars.management.db.util.CalendarUtil"%>
<%@page contentType="text/html" pageEncoding="UTF-8"
    import="java.util.*"
    import="com.mazars.management.db.domain.Currency"
    import="com.mazars.management.db.domain.Employee"
    import="com.mazars.management.db.domain.Subdepartment"
    import="com.mazars.management.db.domain.Module"
    import="com.mazars.management.db.domain.Client"
    import="com.mazars.management.db.domain.Office"
    import="com.mazars.management.db.domain.Department"
    import="com.mazars.management.db.domain.Group"
    import="com.mazars.management.db.domain.Country"
    import="com.mazars.management.db.domain.RightsItem"
    import="com.mazars.management.db.domain.CountryCurrency"

    import="com.mazars.management.db.vo.*"
    import="com.mazars.management.web.forms.*"
    import="com.mazars.management.db.util.HibernateUtil"
    import="org.hibernate.Session"
    import="com.google.gson.Gson"
    import="com.mazars.management.reports.*"
    import="com.mazars.management.reports.vo.*"
    import="com.mazars.management.reports.excel.*"
    import="java.text.SimpleDateFormat"
    import="com.mazars.management.db.comparators.*"
    import="com.mazars.management.web.security.AccessChecker"
    import="java.util.zip.*"
%><%
request.setCharacterEncoding("UTF-8");
Employee currentUser = (Employee)session.getAttribute("currentUser");
String command = request.getParameter("command");
Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
Gson gson = new Gson();
try {
hs.beginTransaction();
Module module = Module.getByName("Timesheets Report");

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
       List<GroupVO> groupVOs = new LinkedList<GroupVO>();
       List<ClientVO> clientVOs = new LinkedList<ClientVO>();
       List<OfficeVO> officeVOs = new LinkedList<OfficeVO>();

       Country country = currentUser.getCountry();
       List<Group> groups = new LinkedList<Group>(country.getGroups());
       Collections.sort(groups, new GroupComparator());
       for(Group group : groups) {
           groupVOs.add(new GroupVO(group));
       }
       List<Client> clients = new LinkedList<Client>(country.getClients());
       Collections.sort(clients, new ClientComparator());
       for(Client client : clients) {
           clientVOs.add(new ClientVO(client));
       }
       if(Employee.Profile.COUNTRY_ADMINISTRATOR.equals(currentUser.getProfile())) {
           List<Office> offices = new LinkedList<Office>(country.getOffices());
           Collections.sort(offices, new OfficeComparator());
           for(Office office : offices) {
               officeVOs.add(new OfficeVO(office));
           }
        } else if(Employee.Profile.SUPER_USER.equals(currentUser.getProfile())) {
           List<Office> offices = RightsItem.getOffices(currentUser, module);
           Collections.sort(offices, new OfficeComparator());
           for(Office office : offices) {
               officeVOs.add(new OfficeVO(office));
           }
        }

%>
{
"status": "OK",
"groups": <% gson.toJson(groupVOs, out); %>,
"clients": <% gson.toJson(clientVOs, out); %>,
"offices": <% gson.toJson(officeVOs, out); %>
}
<%
} else if("getGroupContent".equals(command)) {
   Group group = (Group)hs.get(Group.class, new Long(request.getParameter("groupId")));
   List<ClientVO> clientVOs = new LinkedList<ClientVO>();
   List<Client> clients = new LinkedList<Client>(group.getClients());
   Collections.sort(clients, new ClientComparator());
   for(Client client : clients) {
       clientVOs.add(new ClientVO(client));
   }
%>
{
"status": "OK",
"clients": <% gson.toJson(clientVOs, out); %>
}
<%
} else if("getNullGroupContent".equals(command)) {
   Country country = currentUser.getCountry();
   List<ClientVO> clientVOs = new LinkedList<ClientVO>();
   List<Client> clients = new LinkedList<Client>(country.getClients());
   Collections.sort(clients, new ClientComparator());
   for(Client client : clients) {
       clientVOs.add(new ClientVO(client));
   }
%>
{
"status": "OK",
"clients": <% gson.toJson(clientVOs, out); %>
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
} else if("generateReport".equals(command)) {
    ProfitabilityReportForm profitabilityReportForm = ProfitabilityReportForm.getFromJson(request.getParameter("marginReportForm"));
    ProfitabilityReport profitabilityReport = new ProfitabilityReport(profitabilityReportForm, module, currentUser);
    
    profitabilityReport.build();
    ProfitabilityReportVO profitabilityReportVO = new ProfitabilityReportVO(profitabilityReport);
    %>
    {
        "status": "OK",
        "report": <% gson.toJson(profitabilityReportVO, out); %>
    }
    <%
} else if("generateXLSReport".equals(command)) {
    ProfitabilityReportForm profitabilityReportForm = ProfitabilityReportForm.getFromJson(request.getParameter("profitabilityReportForm"));
    ProfitabilityReport profitabilityReport = new ProfitabilityReport(profitabilityReportForm, module, currentUser);

    profitabilityReport.build();
    SimpleDateFormat dateFormatterShort = new SimpleDateFormat("ddMMyyyy");
    SimpleDateFormat dateFormatterLong = new SimpleDateFormat("ddMMyyyyHHmmss");

    String formGroupName = "ALL";
    String formClientCodeName = "ALL";
    String formOfficeCodeName = "ALL";
    String formDepartmentCodeName = "ALL";
    String formSubdepartmentCodeName = "ALL";
    String formStartDate = dateFormatterShort.format(profitabilityReportForm.getStartDate().getCalendar().getTime());
    String formEndDate = dateFormatterShort.format(profitabilityReportForm.getEndDate().getCalendar().getTime());

    if(profitabilityReport.getFormGroup() != null) {
        formGroupName = profitabilityReport.getFormGroup().getName().trim().replaceAll(" ", "").replaceAll("_", "");
    }
    if(profitabilityReport.getFormClient() != null) {
        formClientCodeName = profitabilityReport.getFormClient().getCodeName();
    }
    if(profitabilityReport.getFormOffice() != null) {
        formOfficeCodeName = profitabilityReport.getFormOffice().getCodeName();
    }
    if(profitabilityReport.getFormDepartment() != null) {
        formDepartmentCodeName = profitabilityReport.getFormDepartment().getCodeName();
    }
    if(profitabilityReport.getFormSubdepartment() != null) {
        formSubdepartmentCodeName = profitabilityReport.getFormSubdepartment().getCodeName();
    }


    String fileName = "P_" + formGroupName + "_" + formClientCodeName + "_" + formOfficeCodeName + "_" + formDepartmentCodeName + "_" + formSubdepartmentCodeName + "_";
    fileName += formStartDate + "_";
    fileName += formEndDate + "_";
    fileName += dateFormatterLong.format(profitabilityReport.getCreatedAt());
    fileName += ".xls";

    response.setContentType("application/vnd.ms-excel");
    response.setHeader("content-disposition", "filename=" + fileName);
    ProfitabilityReportExcelBuilder reb = new ProfitabilityReportExcelBuilder(profitabilityReport);
    reb.createStandardReport(response.getOutputStream());
} else if("generateDividedXLSReport".equals(command)) {
    ProfitabilityReportForm profitabilityReportForm = ProfitabilityReportForm.getFromJson(request.getParameter("profitabilityReportForm"));
    ProfitabilityReport profitabilityReport = new ProfitabilityReport(profitabilityReportForm, module, currentUser);
    profitabilityReport.build();
    SimpleDateFormat dateFormatterShort = new SimpleDateFormat("ddMMyyyy");
    SimpleDateFormat dateFormatterLong = new SimpleDateFormat("ddMMyyyyHHmmss");

    String formGroupName = "ALL";
    String formClientCodeName = "ALL";
    String formOfficeCodeName = "ALL";
    String formDepartmentCodeName = "ALL";
    String formSubdepartmentCodeName = "ALL";
    String formStartDate = dateFormatterShort.format(profitabilityReportForm.getStartDate().getCalendar().getTime());
    String formEndDate = dateFormatterShort.format(profitabilityReportForm.getEndDate().getCalendar().getTime());

    if(profitabilityReport.getFormGroup() != null) {
        formGroupName = profitabilityReport.getFormGroup().getName().trim().replaceAll(" ", "").replaceAll("_", "");
    }
    if(profitabilityReport.getFormClient() != null) {
        formClientCodeName = profitabilityReport.getFormClient().getCodeName();
    }
    if(profitabilityReport.getFormOffice() != null) {
        formOfficeCodeName = profitabilityReport.getFormOffice().getCodeName();
    }
    if(profitabilityReport.getFormDepartment() != null) {
        formDepartmentCodeName = profitabilityReport.getFormDepartment().getCodeName();
    }
    if(profitabilityReport.getFormSubdepartment() != null) {
        formSubdepartmentCodeName = profitabilityReport.getFormSubdepartment().getCodeName();
    }


    String fileName = "P_" + formGroupName + "_" + formClientCodeName + "_" + formOfficeCodeName + "_" + formDepartmentCodeName + "_" + formSubdepartmentCodeName + "_";
    fileName += formStartDate + "_";
    fileName += formEndDate + "_";
    fileName += dateFormatterLong.format(profitabilityReport.getCreatedAt());
    fileName += ".zip";

    response.setContentType("application/x-zip-compressed");
    response.setHeader("content-disposition", "filename=" + fileName);
    ZipOutputStream zipOutputStream = new ZipOutputStream(response.getOutputStream());
    ProfitabilityReportExcelBuilder reb = new ProfitabilityReportExcelBuilder(profitabilityReport);
    reb.createDividedReport(zipOutputStream);
    zipOutputStream.close();
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
