<%-- 
    Document   : subdepartments
    Created on : 31.03.2011, 13:08:03
    Author     : glazov
--%>
<%@page import="java.io.PrintWriter"%>
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
Module module = Module.getByName("Financial Information Report");

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
       Country country = currentUser.getCountry();
     
       List<Office> offices = new LinkedList<Office>();
        if(currentUser.getProfile().equals(Employee.Profile.SUPER_USER)) {
            offices.addAll(RightsItem.getOffices(currentUser, module, country));
        } else if(currentUser.getProfile().equals(Employee.Profile.COUNTRY_ADMINISTRATOR)) {
            offices.addAll(country.getOffices());
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
    if(currentUser.getProfile().equals(Employee.Profile.SUPER_USER)) {
        departments.addAll(RightsItem.getDepartments(currentUser, module, office));
    } else if(currentUser.getProfile().equals(Employee.Profile.COUNTRY_ADMINISTRATOR)) {
        departments.addAll(office.getDepartments());
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
    if(currentUser.getProfile().equals(Employee.Profile.SUPER_USER)) {
        subdepartments.addAll(RightsItem.getSubdepartments(currentUser, module, department));
    } else if(currentUser.getProfile().equals(Employee.Profile.COUNTRY_ADMINISTRATOR)) {
        subdepartments.addAll(department.getSubdepartments());
    }
    Collections.sort(subdepartments, new SubdepartmentComparator());
    List<SubdepartmentVO> subdepartmentVOs = SubdepartmentVO.getList(subdepartments);
%>
{
"status": "OK",
"subdepartments": <% gson.toJson(subdepartmentVOs, out); %>
}
<%
} else if("generateReport".equals(command)) {
    ProductivityReportForm productivityReportForm = ProductivityReportForm.getFromJson(request.getParameter("productivityReportForm"));
    ProductivityReport productivityReport = new ProductivityReport(productivityReportForm, module, currentUser);
    
    productivityReport.build();
    ProductivityReportVO productivityReportVO = new ProductivityReportVO(productivityReport);
    %>
    {
        "status": "OK",
        "report": <% gson.toJson(productivityReportVO, out); %>
    }
    <%
} else if("generateXLSReport".equals(command)) {
    ProductivityReportForm productivityReportForm = ProductivityReportForm.getFromJson(request.getParameter("productivityReportForm"));
    ProductivityReport productivityReport = new ProductivityReport(productivityReportForm, module, currentUser);

    productivityReport.build();
    SimpleDateFormat dateFormatterShort = new SimpleDateFormat("ddMMyyyy");
    SimpleDateFormat dateFormatterLong = new SimpleDateFormat("ddMMyyyyHHmmss");

    String formOfficeCodeName = "ALL";
    String formDepartmentCodeName = "ALL";
    String formSubdepartmentCodeName = "ALL";
    if(productivityReport.getFormOffice() != null) {
        formOfficeCodeName = productivityReport.getFormOffice().getCodeName();
    }
    if(productivityReport.getFormDepartment() != null) {
        formDepartmentCodeName = productivityReport.getFormDepartment().getCodeName();
    }
    if(productivityReport.getFormSubdepartment() != null) {
        formSubdepartmentCodeName = productivityReport.getFormSubdepartment().getCodeName();
    }
    String formStartDate = dateFormatterShort.format(productivityReportForm.getStartDate().getCalendar().getTime());
    String formEndDate = dateFormatterShort.format(productivityReportForm.getEndDate().getCalendar().getTime());


    String fileName = "PROD_" + formOfficeCodeName + "_" + formDepartmentCodeName + "_" + formSubdepartmentCodeName + "_";
    fileName += formStartDate + "_";
    fileName += formEndDate + "_";
    fileName += dateFormatterLong.format(productivityReport.getCreatedAt());
    fileName += ".xls";

    response.setContentType("application/vnd.ms-excel");
    response.setHeader("content-disposition", "filename=" + fileName);
    ProductivityReportExcelBuilder reb = new ProductivityReportExcelBuilder(productivityReport);
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
