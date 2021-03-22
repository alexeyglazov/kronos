<%--
    Document   : subdepartments
    Created on : 31.03.2011, 13:08:03
    Author     : glazov
--%>
<%@page import="javax.mail.Authenticator"%>
<%@page import="javax.mail.Transport"%>
<%@page import="javax.mail.internet.InternetAddress"%>
<%@page import="javax.mail.internet.MimeMessage"%>
<%@page import="javax.mail.Message"%>
<%@page import="javax.mail.PasswordAuthentication"%>
<%@page import="com.sun.xml.messaging.saaj.util.ByteOutputStream"%>
<%@page import="java.io.BufferedReader"%>
<%@page import="java.io.InputStreamReader"%>
<%@page import="java.io.FileInputStream"%>
<%@page import="com.mazars.management.service.MailUtils"%>
<%@page import="javax.xml.datatype.DatatypeFactory"%>
<%@page import="javax.xml.datatype.XMLGregorianCalendar"%>
<%@page import="com.mazars.management.service.StringUtils"%>
<%@page import="com.mazars.management.db.util.ClientListUtil"%>
<%@page import="com.mazars.management.service.LeavesBalanceCalculator.Stage"%>
<%@page import="com.mazars.management.webservices.clients.hamilton.projects.Credential"%>
<%@page import="com.mazars.management.web.content.ContentManager"%>
<%@page import="com.mazars.management.webservices.clients.hamilton.projects.ExpNoteProject"%>
<%@page import="com.mazars.management.webservices.clients.hamilton.projects.ExpNoteImportResult"%>
<%@page import="com.mazars.management.webservices.clients.hamilton.projects.MasterDataImportService"%>
<%@page import="com.mazars.management.webservices.clients.hamilton.projects.MasterDataImportService_Service"%>
<%@page import="com.mazars.management.webservices.clients.hamilton.projects.HDSWebFault"%>
<%@page import="com.mazars.management.web.vo.LeavesBalanceCalculatorResult"%>
<%@page import="com.mazars.management.db.util.EmployeePositionHistoryItemUtils"%>
<%@page import="com.mazars.management.service.LeavesBalanceCalculator"%>
<%@page import="com.mazars.management.reports.InvoiceRequestReport"%>
<%@page import="com.mazars.management.db.util.CalendarUtil"%>
<%@page import="com.mazars.management.reports.jobs.ProfitabilityReportJob"%>
<%@page import="com.mazars.management.jobs.JobManager"%>
<%@page import="com.mazars.management.jobs.Job"%>
<%@page import="com.mazars.management.service.ObjectUtils"%>
<%@page import="java.io.ObjectOutputStream"%>
<%@page import="java.io.ObjectOutput"%>
<%@page import="java.io.ByteArrayOutputStream"%>
<%@page import="javax.crypto.SecretKey"%>
<%@page import="com.mazars.management.security.SecurityUtils"%>
<%@page import="java.net.URI"%>
<%@page import="com.mazars.management.reports.ProfitabilityReport"%>
<%@page import="java.io.PrintWriter"%>
<%@page import="java.io.PrintStream"%>
<%@page import="jxl.write.WritableSheet"%>
<%@page import="jxl.write.Label"%>
<%@page import="jxl.Sheet"%>
<%@page import="jxl.write.WritableWorkbook"%>
<%@page import="java.io.File"%>
<%@page import="jxl.Workbook"%>
<%@page import="com.mazars.management.service.ConfigUtils"%>
<%@page import="java.text.SimpleDateFormat"%>
<%@page import="java.math.BigDecimal"%>
<%@page import="org.hibernate.Query"%>
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
%>
<%
request.setCharacterEncoding("UTF-8");
Gson gson = new Gson();
Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
try {
    SimpleDateFormat dateFormatterShort = new SimpleDateFormat("dd.MM.yyyy HH:mm:ss");

    hs.beginTransaction();
//Employee defaultEmployee = (Employee)hs.get(Employee.class, new Long(2));
//Date defaultTime = dateFormatterShort.parse("2011-11-07 16:00:00");

String command = request.getParameter("command");
if(command == null) {
    command="list";
}
if("list".equals(command)) {
    Properties props = new Properties();
    props.put("mail.smtp.auth", "true");
    props.put("mail.smtp.starttls.enable", "true");
    props.put("mail.smtp.host", "smtp.office365.com");
    props.put("mail.smtp.port", "587");
    
props.put("mail.debug","false");
    
    javax.mail.Session mailSession = javax.mail.Session.getInstance(props, new Authenticator() {
        protected PasswordAuthentication getPasswordAuthentication() {
            return new PasswordAuthentication("svc_office@mazars.ru", "48F4cCSe2");
        }
    });
        %>mailSession: OK<br /><%
        
        Message msg = new MimeMessage(mailSession);
        msg.setFrom(new InternetAddress("newsletter@mazars.ru", "Test"));
        InternetAddress[] address = {new InternetAddress("alexey.glazov@mazars.ru"), new InternetAddress("mikhail.ionas@mazars.ru")};
        msg.setRecipients(Message.RecipientType.TO, address);
        msg.setSubject("Kronos account created");
        msg.setSentDate(new Date());
        msg.setContent("Test <strong>Hello</strong>", "text/html");
        Transport.send(msg)xcvxcv;   
        %>send: OK<br /><%
}

    hs.getTransaction().commit();
} catch (Exception ex) {
    hs.getTransaction().rollback();
    %>
    {
        "status": "FAIL",
        "comment": <% ex.printStackTrace(new PrintWriter(out)); %>
    }
    <%
}
%>