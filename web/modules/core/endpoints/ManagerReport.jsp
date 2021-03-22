<%-- 
    Document   : subdepartments
    Created on : 31.03.2011, 13:08:03
    Author     : glazov
--%>

<%@page contentType="text/html" pageEncoding="UTF-8"
    import="java.io.PrintStream"
    import="java.io.PrintWriter"
    import="com.mazars.management.db.domain.ProjectCode"
    import="com.mazars.management.db.util.CalendarUtil"
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
    import="java.util.Collections"
    import="java.util.LinkedList"
    import="java.util.List"
    import="java.util.Map"
    import="java.util.HashMap"
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
       List<OfficeVO> officeVOs = new LinkedList<OfficeVO>();

       Country country = currentUser.getCountry();
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
        List<CurrencyVO> currencyVOs = new LinkedList<CurrencyVO>();
        Currency mainCurrency = CountryCurrency.getMainCurrency(country);
        List<Currency> currencies = CountryCurrency.getCurrencies(country);
        Collections.sort(currencies, new CurrencyComparator());
        for(Currency currency : currencies) {
            currencyVOs.add(new CurrencyVO(currency));
        }
        List<Integer> financialYears = ProjectCode.getFinancialYears();
        financialYears.remove(null);
        Collections.sort(financialYears);
%>
{
"status": "OK",
"mainCurrency": <% gson.toJson(new CurrencyVO(mainCurrency), out); %>,
"currencies": <% gson.toJson(currencyVOs, out); %>,
"offices": <% gson.toJson(officeVOs, out); %>,
"financialYears": <% gson.toJson(financialYears, out); %>
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
} else if("generateReport".equals(command)) {
    ManagerReportForm managerReportForm = ManagerReportForm.getFromJson(request.getParameter("managerReportForm"));
    ManagerReport managerReport = new ManagerReport(managerReportForm, module, currentUser);
    
    managerReport.build();
    ManagerReportVO managerReportVO = new ManagerReportVO(managerReport);
    %>
    {
        "status": "OK",
        "report": <% gson.toJson(managerReportVO, out); %>
    }
    <%
} else if("generateXLSReport".equals(command)) {
    ManagerReportForm managerReportForm = ManagerReportForm.getFromJson(request.getParameter("managerReportForm"));
    ManagerReport managerReport = new ManagerReport(managerReportForm, module, currentUser);

    managerReport.build();
    SimpleDateFormat dateFormatterShort = new SimpleDateFormat("ddMMyyyy");
    SimpleDateFormat dateFormatterLong = new SimpleDateFormat("ddMMyyyyHHmmss");

    String formOfficeCodeName = "ALL";
    String formDepartmentCodeName = "ALL";
    String formFinancialYear = "ALL";

    if(managerReport.getFormOffice() != null) {
        formOfficeCodeName = managerReport.getFormOffice().getCodeName();
    }
    if(managerReport.getFormDepartment() != null) {
        formDepartmentCodeName = managerReport.getFormDepartment().getCodeName();
    }
    if(managerReport.getFormFinancialYear() != null) {
        formFinancialYear = "" + managerReport.getFormFinancialYear() + (managerReport.getFormFinancialYear() + 1);
    }

    String fileName = "M_" + formOfficeCodeName + "_" + formDepartmentCodeName + "_" + formFinancialYear + "_";
    fileName += dateFormatterLong.format(managerReport.getCreatedAt());
    fileName += ".xls";

    response.setContentType("application/vnd.ms-excel");
    response.setHeader("content-disposition", "filename=" + fileName);
    ManagerReportExcelBuilder reb = new ManagerReportExcelBuilder(managerReport);
    reb.createReport(response.getOutputStream());
} else if("getNoFinancialYearDetails".equals(command)) {
    ManagerReportForm managerReportForm = ManagerReportForm.getFromJson(request.getParameter("managerReportForm"));
    ManagerReport managerReport = new ManagerReport(managerReportForm, module, currentUser);
    
    List<ProjectCode> noFinancialYearProjectCodes = managerReport.getNoFinancialYearProjectCodes();
    Collections.sort(noFinancialYearProjectCodes, new ProjectCodeComparator());
    List<String> noFinancialYearProjectCodeCodes = new LinkedList<String>();
    for(ProjectCode projectCode : noFinancialYearProjectCodes) {
        noFinancialYearProjectCodeCodes.add(projectCode.getCode());
    }
%>
    {
        "status": "OK",
        "noFinancialYearProjectCodes": <% gson.toJson(noFinancialYearProjectCodeCodes, out); %>
    }
    <%
} else if("getNoBudgetDetails".equals(command)) {
    ManagerReportForm managerReportForm = ManagerReportForm.getFromJson(request.getParameter("managerReportForm"));
    ManagerReport managerReport = new ManagerReport(managerReportForm, module, currentUser);
    
    List<ProjectCode> noBudgetProjectCodes = managerReport.getNoBudgetProjectCodes();
    Collections.sort(noBudgetProjectCodes, new ProjectCodeComparator());
    List<String> noBudgetProjectCodeCodes = new LinkedList<String>();
    for(ProjectCode projectCode : noBudgetProjectCodes) {
        noBudgetProjectCodeCodes.add(projectCode.getCode());
    }
%>
    {
        "status": "OK",
        "noBudgetProjectCodes": <% gson.toJson(noBudgetProjectCodeCodes, out); %>
    }
    <%
} else if("getNoInChargePersonDetails".equals(command)) {
    ManagerReportForm managerReportForm = ManagerReportForm.getFromJson(request.getParameter("managerReportForm"));
    ManagerReport managerReport = new ManagerReport(managerReportForm, module, currentUser);
    
    List<ProjectCode> noInChargePersonProjectCodes = managerReport.getNoInChargePersonProjectCodes();
    Collections.sort(noInChargePersonProjectCodes, new ProjectCodeComparator());
    List<String> noInChargePersonProjectCodeCodes = new LinkedList<String>();
    for(ProjectCode projectCode : noInChargePersonProjectCodes) {
        noInChargePersonProjectCodeCodes.add(projectCode.getCode());
    }
%>
    {
        "status": "OK",
        "noInChargePersonProjectCodes": <% gson.toJson(noInChargePersonProjectCodeCodes, out); %>
    }
    <%
} else if("getProjectCode".equals(command)) {
    ProjectCode projectCode = (ProjectCode)hs.get(ProjectCode.class, new Long(request.getParameter("id")));
    Employee createdBy = projectCode.getCreatedBy();
    Employee closedBy = projectCode.getClosedBy();
    Employee inChargePerson = projectCode.getInChargePerson();
    %>
    {
    "status": "OK",
    <% if(createdBy != null) { %>
    "createdBy": <% gson.toJson(new EmployeeWithoutPasswordVO(createdBy), out); %>,
    <% } %>
    <% if(closedBy != null) { %>
    "closedBy": <% gson.toJson(new EmployeeWithoutPasswordVO(closedBy), out); %>,
    <% } %>
    <% if(inChargePerson != null) { %>
    "inChargePerson": <% gson.toJson(new EmployeeWithoutPasswordVO(inChargePerson), out); %>,
    <% } %>
    "projectCode": <% gson.toJson(new ProjectCodeVO(projectCode), out); %>
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
        ex.printStackTrace(new PrintWriter(out));
}
%>
