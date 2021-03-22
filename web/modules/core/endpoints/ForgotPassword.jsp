<%-- 
    Document   : subdepartments
    Created on : 31.03.2011, 13:08:03
    Author     : glazov
--%><%@page import="com.mazars.management.service.MailUtils"%>
<%@page import="javax.mail.PasswordAuthentication"%>
<%@page import="javax.mail.Transport"%>
<%@page import="javax.mail.internet.InternetAddress"%>
<%@page import="javax.mail.internet.MimeMessage"%>
<%@page import="javax.mail.Message"%>
<%@page contentType="text/html" pageEncoding="UTF-8"
    import="com.mazars.management.web.content.ContentManager"
    import="com.mazars.management.service.ConfigUtils"
    import="com.mazars.management.security.PasswordUtil"
    import="com.mazars.management.security.SecurityUtils"
    import="java.util.*"
    import="com.mazars.management.db.domain.*"
    import="com.mazars.management.db.vo.*"
    import="com.mazars.management.web.forms.*"
    import="com.mazars.management.db.util.HibernateUtil"
    import="org.hibernate.Session"
    import="com.google.gson.Gson"
    import="com.mazars.management.web.security.AccessChecker"
    import="javax.mail.Authenticator"
%><%
request.setCharacterEncoding("UTF-8");
Employee currentUser = (Employee)session.getAttribute("currentUser");

String command = request.getParameter("command");
Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
Gson gson = new Gson();
try {
hs.beginTransaction();

if("checkRequest".equals(command)) {
    ForgotPasswordForm forgotPasswordForm = ForgotPasswordForm.getFromJson(request.getParameter("forgotPasswordForm"));
    ForgotPasswordForm.IdentifierType identifierType = forgotPasswordForm.getIdentifierType();
    String identifier = forgotPasswordForm.getIdentifier();
    Employee employee = null;
    if(ForgotPasswordForm.IdentifierType.USER_NAME.equals(forgotPasswordForm.getIdentifierType())) {
        employee = Employee.getByUserName(identifier);
        if(employee == null) {
            %>
            {
                "status": "FAIL",
                "comment": "No Employee with this User Name"
            }
            <%
        }
    } else {
        List<Employee> employees = Employee.getByEmail(identifier, true);
        if(employees.size() == 0) {
            %>
            {
                "status": "FAIL",
                "comment": "No active Employees with this E-mail"
            }
            <%
        } else if(employees.size() > 1) {
            %>
            {
                "status": "FAIL",
                "comment": "More than one active Employee with this E-mail"
            }
            <%
        } else {
            employee = employees.get(0);
        }
    }
    if(employee != null) {
        String secretKey = PasswordUtil.generate();
        Date secretKeyDate = new Date();
        employee.setSecretKey(secretKey);
        employee.setSecretKeyDate(secretKeyDate);
        String link = "" + ConfigUtils.getProperties().getProperty("server.url") + "" + ContentManager.link("/pages/en/forgotPassword.jsp?command=showSecretKeyForm&userName=" + employee.getUserName() + "&secretKey=" + secretKey);
        String message = "Dear " + employee.getFirstName() + " " + employee.getLastName() + ",<br />";
        message += "A request to regenerate your password has been sent to Kronos<br />";
        message += "If you do not intend to change your password then ignore this message<br />";
        message += "If you intend to change your password then use this link<br />";
        message += "Connect to Kronos at <a href=\"" + link + "\">" + link +"</a><br />";
        message += "Fill in the form with your user name and temporary secret key<br />";
        message += "User name: " + employee.getUserName() + "<br />";
        message += "Secret key: " + secretKey + "<br />";
                
        javax.mail.Session mailSession = MailUtils.getSession();
        
        Message msg = new MimeMessage(mailSession);
        msg.setFrom(new InternetAddress(ConfigUtils.getProperties().getProperty("mailer.from")));
        InternetAddress[] address = {new InternetAddress(employee.getEmail())};
        msg.setRecipients(Message.RecipientType.TO, address);
        msg.setSubject("Kronos account updated");
        msg.setSentDate(new Date());
        msg.setContent(message, "text/html");
        Transport.send(msg);
        hs.save(employee);
        %>
        {
            "status": "OK",
            "comment": "Secret key has been set"
        }
        <%
    }
} else if("changePassword".equals(command)) {
    SecretKeyForm secretKeyForm = SecretKeyForm.getFromJson(request.getParameter("secretKeyForm"));
    Employee employee = Employee.getByUserName(secretKeyForm.getUserName());
    if(employee == null) {
        %>
        {
           "status": "FAIL",
           "comment": "No Employee with this User Name"
        }
        <%
    } else if(secretKeyForm.getSecretKey() == null || secretKeyForm.getSecretKey().trim().equals("")) {
        %>
        {
            "status": "FAIL",
            "comment": "Secret Key is not set"
        }
        <%
    } else {    
        if(! secretKeyForm.getSecretKey().equals(employee.getSecretKey())) {
            %>
            {
                "status": "FAIL",
                "comment": "Incorrect Secret Key"
            }
            <%
        } else if(((new Date()).getTime() - employee.getSecretKeyDate().getTime()) > 1000 * 60 * 10) {
            employee.setSecretKey(null);
            employee.setSecretKeyDate(null);
            hs.save(employee);
            %>
            {
                "status": "FAIL",
                "comment": "Secret Key is expired"
            }
            <%
        } else {
            String password = PasswordUtil.generate();
            String salt = PasswordUtil.generate();
            String hashedPassword = SecurityUtils.getHashAsString(password, salt);
            employee.setHashedPassword(hashedPassword);
            employee.setPasswordToBeChanged(true);
            employee.setSalt(salt);
            employee.setSecretKey(null);
            employee.setSecretKeyDate(null);
            hs.save(employee);
            
            String message = "Dear " + employee.getFirstName() + " " + employee.getLastName() + ",<br />";
            message += "Your password has been changed<br />";
            message += "Connect to Kronos at <a href=\"" + ConfigUtils.getProperties().getProperty("server.url") + "\">" + ConfigUtils.getProperties().getProperty("server.url") + "</a><br />";
            message += "Login: " + employee.getUserName() + "<br />";
            message += "Password: " + password + "<br />";
            
            javax.mail.Session mailSession = MailUtils.getSession();
            
            Message msg = new MimeMessage(mailSession);
            msg.setFrom(new InternetAddress(ConfigUtils.getProperties().getProperty("mailer.from")));
            InternetAddress[] address = {new InternetAddress(employee.getEmail())};
            msg.setRecipients(Message.RecipientType.TO, address);
            msg.setSubject("Kronos account updated");
            msg.setSentDate(new Date());
            msg.setContent(message, "text/html");
            Transport.send(msg);
            %>
            {
                "status": "OK",
                "comment": "Password has been changed"
            }
            <%
        }
    }
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