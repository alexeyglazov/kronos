<%--
    Document   : subdepartments
    Created on : 31.03.2011, 13:08:03
    Author     : glazov
--%>
<%@page import="javax.activation.DataHandler"%>
<%@page import="javax.activation.FileDataSource"%>
<%@page import="javax.activation.DataSource"%>
<%@page import="javax.mail.internet.MimeBodyPart"%>
<%@page import="javax.mail.internet.MimeMultipart"%>
<%@page import="javax.mail.Multipart"%>
<%@page import="javax.mail.Transport"%>
<%@page import="javax.mail.internet.InternetAddress"%>
<%@page import="javax.mail.internet.MimeMessage"%>
<%@page import="javax.mail.Message"%>
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
%><%
request.setCharacterEncoding("UTF-8");
Gson gson = new Gson();
Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
try {
    hs.beginTransaction();
    
    String message = "";
    message = "<style>table.a td {border: 1px solid red;} body { background-image: url(cid:image); background-color: #c7b39b;}</style>";
    message += "Dear " + "User" + ",<br />";
    message += "<h1>This is just a test of sending mails with inline images from java application</h1><img src=\"http://www.mazars.ru/extension/ezmazars_rwdesign/design/mazars_rwd/images/logos/logo_MAZARS.png\">";
    //message += "<h1>Detta är bara ett test för att skicka e-post med infogade bilder från Java-program</h1>";
    //message += "<h1>Это просто тест отсылки email c вложенными картинками из Java-программ</h1>";
    message += "<table class=\"a\"><tr><td><img src=\"cid:image\"></td><td><img src=\"cid:image2\"></td></tr></table>";
    message += "Connect to Kronos at <a href=\"" + ConfigUtils.getProperties().getProperty("server.url") + "\">" + ConfigUtils.getProperties().getProperty("server.url") + "</a><br />";

                Properties mailProperties = new Properties();
                mailProperties.put("mail.smtp.host", ConfigUtils.getProperties().getProperty("mailer.hostName"));
                mailProperties.put("mail.debug", "false");
                mailProperties.put("mail.user", ConfigUtils.getProperties().getProperty("mailer.authentication.userName"));
                mailProperties.put("mail.password", ConfigUtils.getProperties().getProperty("mailer.authentication.password"));
                javax.mail.Session mailSession = javax.mail.Session.getInstance(mailProperties);
                Message msg = new MimeMessage(mailSession);
                //msg.setFrom(new InternetAddress(ConfigUtils.getProperties().getProperty("mailer.from")));
                msg.setFrom(new InternetAddress("no-reply@mazars.ru"));
                InternetAddress[] address = {new InternetAddress("alexey.glazov@mazars.ru")};
                //InternetAddress[] address2 = {new InternetAddress("Mikhail.Ionas@mazars.ru"), new InternetAddress("anton.smirnov@mazars.ru"), new InternetAddress("Nadezhda.Matekina@mazars.ru")};
                msg.setRecipients(Message.RecipientType.TO, address);
                //msg.setRecipients(Message.RecipientType.BCC, address2);
                msg.setSubject("Just a test 123!!!");
                msg.setSentDate(new Date());
                //msg.setHeader("Disposition-Notification-To", "alexey.glazov@mazars.ru");
                
                
                
                Multipart mp = new MimeMultipart();

                MimeBodyPart htmlPart = new MimeBodyPart();
                htmlPart.setContent(message, "text/html");
                mp.addBodyPart(htmlPart);
                
//                byte[] attachmentData = new byte[1];
                MimeBodyPart attachment = new MimeBodyPart();
                DataSource fds = new FileDataSource("C:\\Program Files\\Apache Software Foundation\\Tomcat 8.0\\webapps\\russia\\WEB-INF\\files\\chart.pdf");  
                attachment.setDataHandler(new DataHandler(fds));  
                attachment.setFileName("MAZARS.pdf");
                //attachment.setContent(attachmentData, "application/pdf");
                mp.addBodyPart(attachment);

                MimeBodyPart imagePart = new MimeBodyPart();
fds = new FileDataSource("C:\\Program Files\\Apache Software Foundation\\Tomcat 8.0\\webapps\\russia\\WEB-INF\\files\\a.jpg");  
         imagePart.setDataHandler(new DataHandler(fds));  
         imagePart.setHeader("Content-ID", "<image>");  
         // add image to the multipart  
         mp.addBodyPart(imagePart);
         
         imagePart = new MimeBodyPart();
fds = new FileDataSource("C:\\Program Files\\Apache Software Foundation\\Tomcat 8.0\\webapps\\russia\\WEB-INF\\files\\targets.jpg");  
         imagePart.setDataHandler(new DataHandler(fds));  
         imagePart.setHeader("Content-ID", "<image2>");  
         // add image to the multipart  
         mp.addBodyPart(imagePart);


                msg.setContent(mp);
        
                Transport.send(msg);

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