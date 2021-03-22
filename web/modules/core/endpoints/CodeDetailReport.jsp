<%-- 
    Document   : subdepartments
    Created on : 31.03.2011, 13:08:03
    Author     : glazov
--%>
<%@page import="com.mazars.management.db.util.ClientListUtil"%>
<%@page import="com.mazars.management.db.util.ProjectCodeListUtil"%>
<%@page import="com.mazars.management.db.comparators.CurrencyComparator"%>
<%@page import="java.util.Collections"%>
<%@page import="java.util.List"%>
<%@page import="java.util.LinkedList"%>
<%@page import="java.util.Map"%>
<%@page import="java.util.HashMap"%>
<%@page contentType="text/html" pageEncoding="UTF-8"
    import="com.mazars.management.db.domain.*"
    import="com.mazars.management.db.vo.*"
    import="com.mazars.management.web.forms.*"
    import="com.mazars.management.db.util.HibernateUtil"
    import="org.hibernate.Session"
    import="com.google.gson.Gson"
    import="com.mazars.management.reports.TimeSheetReport"
    import="com.mazars.management.reports.vo.*"
    import="java.text.SimpleDateFormat"
    import="com.mazars.management.reports.CodeDetailReport"
    import="com.mazars.management.reports.excel.CodeDetailReportExcelBuilder"
    import="com.mazars.management.web.security.AccessChecker"
    import="com.mazars.management.service.ConfigUtils"
    import="com.mazars.management.service.StringUtils"
    import="java.io.PrintWriter"
    import="com.mazars.management.db.comparators.ProjectCodeComparator"
    import="com.mazars.management.db.comparators.ClientComparator"
%><%
request.setCharacterEncoding("UTF-8");
Employee currentUser = (Employee)session.getAttribute("currentUser");
String command = request.getParameter("command");
Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
Gson gson = new Gson();
try {
hs.beginTransaction();
Module module = Module.getByName("Code Report");


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

if("getInitialContent".equals(command)) {
    ProjectCodeListFilter filter = ProjectCodeListFilter.getFromJson(request.getParameter("filter"));
    InvoiceRequestsFilter invoiceRequestsFilter = new InvoiceRequestsFilter();
    ProjectCodeListSorter sorter = ProjectCodeListSorter.getFromJson(request.getParameter("sorter"));
    ProjectCodeListLimiter limiter = ProjectCodeListLimiter.getFromJson(request.getParameter("limiter"));
    ClientListFilter clientFilter = ClientListFilter.getFromJson(request.getParameter("clientFilter"));
    ClientListSorter clientSorter = new ClientListSorter();
    ProjectCodeListLimiter clientLimiter = new ProjectCodeListLimiter();
            
    
    List<Subdepartment> allowedSubdepartments = Subdepartment.getAllowedSubdepartments(null, null, null, currentUser, module);
    Long count = ProjectCodeListUtil.getCountOfProjectCodeFilteredList(filter, invoiceRequestsFilter, sorter, limiter, allowedSubdepartments);
    List<ProjectCode> projectCodes = ProjectCodeListUtil.getProjectCodeFilteredList(filter, invoiceRequestsFilter, sorter, limiter, allowedSubdepartments);

    List<ProjectCodeVO> projectCodeVOs = new LinkedList<ProjectCodeVO>();
    for(ProjectCode projectCode : projectCodes) {
        projectCodeVOs.add(new ProjectCodeVODetailed(projectCode));
    }
    
    Country country = currentUser.getCountry();
    List<CurrencyVO> currencyVOs = new LinkedList<CurrencyVO>();
    Currency mainCurrency = CountryCurrency.getMainCurrency(country);
    List<Currency> currencies = CountryCurrency.getCurrencies(country);
    Collections.sort(currencies, new CurrencyComparator());
    for(Currency currency : currencies) {
        currencyVOs.add(new CurrencyVO(currency));
    }
    Boolean useRequisites = StringUtils.getBoolean(ConfigUtils.getProperties().getProperty("reports.codeDetail.requisites.used"));
    
    List<Client> clients = ClientListUtil.getClientFilteredList(clientFilter, clientSorter, clientLimiter, currentUser, module);
    Collections.sort(clients, new ClientComparator());
    List<ClientVO> clientVOs = ClientVO.getList(clients);
%>
{
"status": "OK",
"clients": <% gson.toJson(clientVOs, out); %>,
"count": <%=count %>,
"projectCodes": <% gson.toJson(projectCodeVOs, out); %>,
"mainCurrency": <% gson.toJson(new CurrencyVO(mainCurrency), out); %>,
"currencies": <% gson.toJson(currencyVOs, out); %>,
"useRequisites" : <%=useRequisites %>
}
<%
} else if("getClientAndProjectCodesList".equals(command)) {
    ProjectCodeListFilter filter = ProjectCodeListFilter.getFromJson(request.getParameter("filter"));
    InvoiceRequestsFilter invoiceRequestsFilter = new InvoiceRequestsFilter();
    ProjectCodeListSorter sorter = ProjectCodeListSorter.getFromJson(request.getParameter("sorter"));
    ProjectCodeListLimiter limiter = ProjectCodeListLimiter.getFromJson(request.getParameter("limiter"));
    ClientListFilter clientFilter = ClientListFilter.getFromJson(request.getParameter("clientFilter"));
    ClientListSorter clientSorter = new ClientListSorter();
    ProjectCodeListLimiter clientLimiter = new ProjectCodeListLimiter();
            
    List<Subdepartment> allowedSubdepartments = Subdepartment.getAllowedSubdepartments(null, null, null, currentUser, module);
    Long count = ProjectCodeListUtil.getCountOfProjectCodeFilteredList(filter, invoiceRequestsFilter, sorter, limiter, allowedSubdepartments);
    List<ProjectCode> projectCodes = ProjectCodeListUtil.getProjectCodeFilteredList(filter, invoiceRequestsFilter, sorter, limiter, allowedSubdepartments);

    List<ProjectCodeVODetailed> projectCodeVOs = new LinkedList<ProjectCodeVODetailed>();
    for(ProjectCode projectCode : projectCodes) {
        projectCodeVOs.add(new ProjectCodeVODetailed(projectCode));
    }
    
    Country country = currentUser.getCountry();
    List<Client> clients = ClientListUtil.getClientFilteredList(clientFilter, clientSorter, clientLimiter, currentUser, module);
    Collections.sort(clients, new ClientComparator());
    List<ClientVO> clientVOs = ClientVO.getList(clients);
    
    %>{
    "status": "OK",
    "count": <%=count %>,
    "projectCodes": <% gson.toJson(projectCodeVOs, out); %>,
    "clients": <% gson.toJson(clientVOs, out); %>
    }<%    
} if("getProjectCodesList".equals(command)) {
    ProjectCodeListFilter filter = ProjectCodeListFilter.getFromJson(request.getParameter("filter"));
    InvoiceRequestsFilter invoiceRequestsFilter = new InvoiceRequestsFilter();
    ProjectCodeListSorter sorter = ProjectCodeListSorter.getFromJson(request.getParameter("sorter"));
    ProjectCodeListLimiter limiter = ProjectCodeListLimiter.getFromJson(request.getParameter("limiter"));

    List<Subdepartment> allowedSubdepartments = Subdepartment.getAllowedSubdepartments(null, null, null, currentUser, module);
    Long count = ProjectCodeListUtil.getCountOfProjectCodeFilteredList(filter, invoiceRequestsFilter, sorter, limiter, allowedSubdepartments);
    List<ProjectCode> projectCodes = ProjectCodeListUtil.getProjectCodeFilteredList(filter, invoiceRequestsFilter, sorter, limiter, allowedSubdepartments);

    List<ProjectCodeVODetailed> projectCodeVOs = new LinkedList<ProjectCodeVODetailed>();
    for(ProjectCode projectCode : projectCodes) {
        projectCodeVOs.add(new ProjectCodeVODetailed(projectCode));
    }
    %>{
    "status": "OK",
    "count": <%=count %>,
    "projectCodes": <% gson.toJson(projectCodeVOs, out); %>
    }<%
} else if("generateReport".equals(command)) {
    CodeDetailReportForm codeDetailReportForm = CodeDetailReportForm.getFromJson(request.getParameter("codeDetailReportForm"));
    CodeDetailReport codeDetailReport = new CodeDetailReport(codeDetailReportForm, module, currentUser);
    codeDetailReport.build();
    CodeDetailReportVO codeDetailReportVO = new CodeDetailReportVO(codeDetailReport);
    %>
    {
    "status": "OK",
    "report": <% gson.toJson(codeDetailReportVO, out); %>
    }
    <%
} else if("generateXLSReport".equals(command)) {
    CodeDetailReportForm codeDetailReportForm = CodeDetailReportForm.getFromJson(request.getParameter("codeDetailReportForm"));
    CodeDetailReport codeDetailReport = new CodeDetailReport(codeDetailReportForm, module, currentUser);
    codeDetailReport.build();

    SimpleDateFormat dateFormatterShort = new SimpleDateFormat("ddMMyyyy");
    SimpleDateFormat dateFormatterLong = new SimpleDateFormat("ddMMyyyyHHmmss");
    String fileName = "CD_";
    if(codeDetailReport.getFormProjectCodes().size() == 1 ) {
        fileName += codeDetailReport.getFormProjectCodes().get(0).getCode() + "_";
    }
    fileName += dateFormatterLong.format(codeDetailReport.getCreatedAt());
    fileName += ".xls";

    response.setContentType("application/vnd.ms-excel");
    response.setHeader("content-disposition", "filename=" + fileName);
    CodeDetailReportExcelBuilder reb = new CodeDetailReportExcelBuilder(codeDetailReport, response.getOutputStream());
    reb.createWorkbook();
    reb.fillWorkbook();
    reb.writeWorkbook();
}
hs.getTransaction().commit();

} catch (Exception ex) {
    hs.getTransaction().rollback();
    %>
    {
        "status": "FAIL",
        "comment": <% gson.toJson(ex.toString(), out); %>
        }<% ex.printStackTrace(new PrintWriter(out)); %>
    <%
}
%>
