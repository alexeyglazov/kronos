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
    import="com.mazars.management.reports.MonthlyTimeSheetReport"
    import="com.mazars.management.reports.vo.*"
    import="java.text.SimpleDateFormat"
    import="com.mazars.management.reports.excel.MonthlyTimeSheetReportExcelBuilder"
    import="com.mazars.management.web.security.AccessChecker"
    import="com.mazars.management.db.comparators.*"
    import="java.util.zip.*"
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

hs.refresh(currentUser);
if("getInitialContent".equals(command)) {
    Integer minYear = TimeSpentItem.getMinYear();
%>
{
"status": "OK",
"minYear": <%=minYear %>
}
<%
} else if("generateXLSReport".equals(command)) {
    Map<String, String> localizedLabels = new HashMap<String, String>();
    localizedLabels.put("Caption", "Табель учета рабочего времени");
    localizedLabels.put("Company Name", "ЗАО \"Мазар\"");
    localizedLabels.put("Last Name", "Фамилия");
    localizedLabels.put("First Name", "Имя");
    localizedLabels.put("Month", "Месяц");
    localizedLabels.put("Year", "Год");
    localizedLabels.put("Project", "Проект");
    localizedLabels.put("Total", "Итого часов");
    localizedLabels.put("Other", "Прочее:");
    localizedLabels.put("Internal Not Idle Tasks", "# ЗАО \"Мазар\"");
    localizedLabels.put("TOTAL", "ИТОГО");
    String[] localizedMonths = {"Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"};
    Map<String, String> localizedTasks = new HashMap<String, String>();
    localizedTasks.put("Paid Leaves", "# ЗАО \"Мазар\" отпуск");
    localizedTasks.put("Sick Leaves", "# ЗАО \"Мазар\" больничный лист");

    MonthlyTimeSheetReportForm monthlyTimeSheetReportForm = MonthlyTimeSheetReportForm.getFromJson(request.getParameter("monthlyTimeSheetReportForm"));
    MonthlyTimeSheetReport monthlyTimeSheetReport = new MonthlyTimeSheetReport(monthlyTimeSheetReportForm.getYear(), monthlyTimeSheetReportForm.getMonth());
    monthlyTimeSheetReport.build();

    SimpleDateFormat dateFormatterShort = new SimpleDateFormat("ddMMyyyy");
    SimpleDateFormat dateFormatterLong = new SimpleDateFormat("ddMMyyyyHHmmss");
    String[] months = {"January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"};

    String fileName = "MTS_" + monthlyTimeSheetReport.getYear() + "_" + months[monthlyTimeSheetReport.getMonth()] + "_";
    fileName += dateFormatterLong.format(monthlyTimeSheetReport.getCreatedAt());
    fileName += ".zip";

    response.setContentType("application/x-zip-compressed");
    response.setHeader("content-disposition", "filename=" + fileName);
    ZipOutputStream zipOutputStream = new ZipOutputStream(response.getOutputStream());
    MonthlyTimeSheetReportExcelBuilder reb = new MonthlyTimeSheetReportExcelBuilder(monthlyTimeSheetReport, zipOutputStream, localizedLabels, localizedMonths, localizedTasks);
    reb.createZipFile();
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
