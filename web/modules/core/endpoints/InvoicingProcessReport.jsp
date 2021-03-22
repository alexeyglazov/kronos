<%--
    Document   : subdepartments
    Created on : 31.03.2011, 13:08:03
    Author     : glazov
--%>
<%@page import="com.mazars.management.reports.InvoicingProcessReport"%>
<%@page import="java.io.PrintStream"%>
<%@page import="com.mazars.management.reports.InvoiceDocumentReport"%>
<%@page import="java.io.PrintWriter"%>
<%@page contentType="text/html" pageEncoding="UTF-8"
    import="java.util.List"
    import="java.util.LinkedList"
    import="java.util.Collections"
    import="java.util.Map"
    import="java.util.HashMap"
    import="java.math.BigDecimal"
    import="java.util.Locale"
    import="java.util.Calendar"
    import="com.mazars.management.db.domain.*"
    import="com.mazars.management.db.vo.*"
    import="com.mazars.management.web.forms.*"
    import="com.mazars.management.db.util.HibernateUtil"
    import="org.hibernate.Session"
    import="com.google.gson.Gson"
    import="com.mazars.management.reports.vo.*"
    import="java.text.SimpleDateFormat"
    import="com.mazars.management.reports.excel.*"
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

Employee employee = (Employee)hs.get(Employee.class, new Long(currentUser.getId()));
if("generateReport".equals(command)) {
    InvoicingProcessReportForm invoicingProcessReportForm = InvoicingProcessReportForm.getFromJson(request.getParameter("invoicingProcessReportForm"));
    InvoicingProcessReport invoicingProcessReport = new InvoicingProcessReport(invoicingProcessReportForm, module, currentUser);
    invoicingProcessReport.build();
    InvoicingProcessReportVO invoicingProcessReportVO = new InvoicingProcessReportVO(invoicingProcessReport);
    %>
    {
    "status": "OK",
    "invoicingProcessReport": <% gson.toJson(invoicingProcessReportVO, out); %>
    }
    <%
} else if("generateXLSReport".equals(command)) {
    InvoicingProcessReportForm invoicingProcessReportForm = InvoicingProcessReportForm.getFromJson(request.getParameter("invoicingProcessReportForm"));
    InvoicingProcessReport invoicingProcessReport = new InvoicingProcessReport(invoicingProcessReportForm, module, currentUser);
    invoicingProcessReport.build();

    SimpleDateFormat dateFormatterShort = new SimpleDateFormat("ddMMyyyy");
    SimpleDateFormat dateFormatterLong = new SimpleDateFormat("ddMMyyyyHHmmss");
    String fileName = "InvoicingProcess_";
    fileName += dateFormatterLong.format(invoicingProcessReport.getCreatedAt());
    fileName += ".xls";

    response.setContentType("application/vnd.ms-excel");
    response.setHeader("content-disposition", "filename=" + fileName);
    InvoicingProcessReportExcelBuilder reb = new InvoicingProcessReportExcelBuilder(invoicingProcessReport);
    reb.createReport(response.getOutputStream());
}
hs.getTransaction().commit();

} catch (Exception ex) {
    hs.getTransaction().rollback();
    %>
    {
        "status": "FAIL",
        "comment": <% gson.toJson(ex.toString(), out); %>
        <% ex.printStackTrace(new PrintWriter(out)); %>
    }
    <%
}
%>
