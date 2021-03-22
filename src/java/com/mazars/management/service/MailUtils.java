/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mazars.management.service;

import com.mazars.management.db.domain.Client;
import com.mazars.management.db.domain.ConfigProperty;
import com.mazars.management.db.domain.Department;
import com.mazars.management.db.domain.Employee;
import com.mazars.management.db.domain.Office;
import com.mazars.management.db.domain.ProjectCodeConflict;
import com.mazars.management.db.domain.Subdepartment;
import com.mazars.management.db.domain.Task;
import com.mazars.management.reports.ProductivityAndCompletionReport;
import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.LinkedList;
import java.util.List;
import java.util.Properties;
import java.util.Set;
import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;


/**
 *
 * @author glazov
 */
public class MailUtils {
    public static Session getSession() {
        Properties mailProperties = new Properties();
        mailProperties.put("mail.smtp.host", ConfigUtils.getProperties().getProperty("mailer.hostName"));
        mailProperties.put("mail.smtp.auth", "true");
        mailProperties.put("mail.smtp.starttls.enable", "true");
        mailProperties.put("mail.smtp.port", ConfigUtils.getProperties().getProperty("mailer.port"));
        mailProperties.put("mail.debug","false");

        javax.mail.Session mailSession = javax.mail.Session.getInstance(mailProperties,
            new javax.mail.Authenticator() {
            protected PasswordAuthentication getPasswordAuthentication() {
            return new PasswordAuthentication(
                    ConfigUtils.getProperties().getProperty("mailer.authentication.userName"),
                    ConfigUtils.getProperties().getProperty("mailer.authentication.password"));
            }
        });
        return mailSession;
    }
    public static String getCreateEmployeeMailContent(Employee employee, String password) {
        String content = "Dear " + employee.getFullName() + ",<br />";
        content += "Kronos account has been created for you<br />";
        content += "Login: " + employee.getUserName() + "<br />";
        content += "Password: " + password + "<br />";
        content += "Connect to Kronos at <a href=\"" + ConfigUtils.getProperties().getProperty("server.url") + "\">" + ConfigUtils.getProperties().getProperty("server.url") + "</a><br />";
        return content;
    }
    public static void sendCreateEmployeeMessage(Session mailSession, String content, String email) throws MessagingException {
        Message msg = new MimeMessage(mailSession);
        msg.setFrom(new InternetAddress(ConfigUtils.getProperties().getProperty("mailer.from")));
        InternetAddress[] address = {new InternetAddress(email)};
        msg.setRecipients(Message.RecipientType.TO, address);
        msg.setSubject("Kronos account created");
        msg.setSentDate(new Date());
        msg.setContent(content, "text/html");
        Transport.send(msg);
    }
    public static String getRegenerateEmployeePasswordMailContent(Employee employee, String password) {
        String content = "Dear " + employee.getFullName() + ",<br />";
        content += "Your Kronos account has been updated with new password.<br />";
        content += "Login: " + employee.getUserName() + "<br />";
        content += "Password: " + password + "<br />";
        content += "Connect to Kronos at <a href=\"" + ConfigUtils.getProperties().getProperty("server.url") + "\">" + ConfigUtils.getProperties().getProperty("server.url") + "</a><br />";
        return content;
    }
    public static void sendRegenerateEmployeePasswordMessage(Session mailSession, String content, String email) throws MessagingException {
        Message msg = new MimeMessage(mailSession);
        msg.setFrom(new InternetAddress(ConfigUtils.getProperties().getProperty("mailer.from")));
        InternetAddress[] address = {new InternetAddress(email)};
        msg.setRecipients(Message.RecipientType.TO, address);
        msg.setSubject("Kronos account updated");
        msg.setSentDate(new Date());
        msg.setContent(content, "text/html");
        Transport.send(msg);
    }
    
    public static String getProjectCodeConflictCheckNotificationMailContent(Employee employee, ProjectCodeConflict projectCodeConflict) {
        SimpleDateFormat dateFormatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String content = "Dear " + employee.getFullName() + ",<br />";
        content += "Project code conflict has been detected<br />";
        content += "ProjectCode: " + projectCodeConflict.getProjectCode().getCode() + "<br />";
        if(projectCodeConflict.getProjectCode().getInChargePerson() != null) {
            content += "Person in charge: " + projectCodeConflict.getProjectCode().getInChargePerson().getFullName() + "<br />";
        }
        if(projectCodeConflict.getProjectCode().getInChargePartner() != null) {
            content += "Partner in charge: " + projectCodeConflict.getProjectCode().getInChargePartner().getFullName() + "<br />";
        }
        if(projectCodeConflict.getProjectCode().getCreatedBy() != null) {
            content += "Created by: " + projectCodeConflict.getProjectCode().getCreatedBy().getFullName() + "<br />";
        }
        if(projectCodeConflict.getProjectCode().getCreatedAt() != null) {
            content += "Created at: " + dateFormatter.format(projectCodeConflict.getProjectCode().getCreatedAt()) + "<br />";
        }
        if(projectCodeConflict.getProjectCode().getClient() != null) {
            content += "Client: " + projectCodeConflict.getProjectCode().getClient().getName() + "<br />";
        }
        content += "Connect to Kronos at <a href=\"" + ConfigUtils.getProperties().getProperty("server.url") + "\">" + ConfigUtils.getProperties().getProperty("server.url") + "</a><br />";
        content += "and visit Code Management or Conflict Check page<br />";
        return content;
    }
    public static void sendProjectCodeConflictCheckNotificationMessage(Session mailSession, String content, String email) throws MessagingException {
        Message msg = new MimeMessage(mailSession);
        msg.setFrom(new InternetAddress(ConfigUtils.getProperties().getProperty("mailer.from")));
        InternetAddress[] address = {new InternetAddress(email)};
        msg.setRecipients(Message.RecipientType.TO, address);
        msg.setSubject("Kronos conflict detected");
        msg.setSentDate(new Date());
        msg.setContent(content, "text/html");
        Transport.send(msg);
    }
    
    public static String getSubdepartmentUnboundFromClientNotificationMailContent(Employee employee, Subdepartment subdepartment, Client client) {
        String content = "Dear " + employee.getFullName() + ",<br />";
        content += "A subdepartment has been unbound from a client.<br />";
        Department department = subdepartment.getDepartment();
        Office office = department.getOffice();
        content += "Subdepartment: " + office.getName() + "/" + department.getName() + "/" + subdepartment.getName() + "<br />";
        content += "<hr /><br />";
        content += "Client: " + client.getName() + "<br />";
        content += "Connect to Kronos at <a href=\"" + ConfigUtils.getProperties().getProperty("server.url") + "\">" + ConfigUtils.getProperties().getProperty("server.url") + "</a><br />";
        return content;
    }
    public static void sendSubdepartmentUnboundFromClientNotificationMessage(Session mailSession, String content, String email) throws MessagingException {
        Message msg = new MimeMessage(mailSession);
        msg.setFrom(new InternetAddress(ConfigUtils.getProperties().getProperty("mailer.from")));
        InternetAddress[] address = {new InternetAddress(email)};
        msg.setRecipients(Message.RecipientType.TO, address);
        msg.setSubject("Subdepartment unbound from client");
        msg.setSentDate(new Date());
        msg.setContent(content, "text/html");
        Transport.send(msg);
    }    

    public static String getSubdepartmentBoundToClientNotificationMailContent(Employee employee, Set<Subdepartment> subdepartments, Client client) {
        String content = "Dear " + employee.getFullName() + ",<br />";
        content += "Subdepartments have been bound to a client.<br />";
        for(Subdepartment subdepartment : subdepartments) {
            Department department = subdepartment.getDepartment();
            Office office = department.getOffice();
            content += "Subdepartment: " + office.getName() + "/" + department.getName() + "/" + subdepartment.getName() + "<br />";
        }
        content += "<hr /><br />";
        content += "Client: " + client.getName() + "<br />";
        content += "Connect to Kronos at <a href=\"" + ConfigUtils.getProperties().getProperty("server.url") + "\">" + ConfigUtils.getProperties().getProperty("server.url") + "</a><br />";
        return content;
    }
    public static void sendSubdepartmentBoundToClientNotificationMessage(Session mailSession, String content, String email) throws MessagingException {
        Message msg = new MimeMessage(mailSession);
        msg.setFrom(new InternetAddress(ConfigUtils.getProperties().getProperty("mailer.from")));
        InternetAddress[] address = {new InternetAddress(email)};
        msg.setRecipients(Message.RecipientType.TO, address);
        msg.setSubject("Subdepartment bound to client");
        msg.setSentDate(new Date());
        msg.setContent(content, "text/html");
        Transport.send(msg);
    }    

    public static String getCompletionNotificationMailContent(Employee employee, Employee user, ProductivityAndCompletionReport productivityAndCompletionReport, String comment, String commentColor) {
        SimpleDateFormat dateFormatterShort = new SimpleDateFormat("yyyy-MM-dd");
        DecimalFormat decimalFormatter = new DecimalFormat("###.##");
        ProductivityAndCompletionReport.Row row = null;
        for(ProductivityAndCompletionReport.Row tmpRow : productivityAndCompletionReport.getRows()) {
            if(tmpRow.getEmployeeId() == employee.getId()) {
                row = tmpRow;
                break;
            }
        }
        
        String content = "Dear " + employee.getFullName() + ",<br />";
        content += "Here is the extraction of your time sheet for [";
        content += dateFormatterShort.format(productivityAndCompletionReport.getStartDate().getTime());
        content += "; ";
        content += dateFormatterShort.format(productivityAndCompletionReport.getEndDate().getTime());
        content += "] <br />";
        if(row.getProjectTimespent() != null) {
            content += "Time spent on projects: " + decimalFormatter.format(row.getProjectTimespent() / 60.0) + "<br />";
        }
        content += "Time spent on idle tasks: <br />";
        if(row.getIdleTimespentItems().isEmpty()) {
            content += "No idle tasks reported<br />";
        } else {
            for(Long taskId : row.getIdleTimespentItems().keySet()) {
                Task task = null;
                for(Task tmpTask : productivityAndCompletionReport.getIdleTasks()) {
                    if(tmpTask.getId().equals(taskId)) {
                        task = tmpTask;
                        break;
                    }
                }
                if(row.getIdleTimespentItems().get(taskId) != null) {
                    content += "" + task.getName() + ": " + decimalFormatter.format(row.getIdleTimespentItems().get(taskId) / 60.0) + "<br />";
                }    
            }
        }
        if(row.getNotIdleInternalTimespent() != null) {
            content += "Time spent on internal tasks: " + decimalFormatter.format(row.getNotIdleInternalTimespent() / 60.0) + "<br />";
        }
        if(row.getTotalTimeSpent() != null) {
            content += "Total time spent: " + decimalFormatter.format(row.getTotalTimeSpent() / 60.0) + "<br />";
        }
        if(row.getCompletion() != null) {
            content += "<h4>Completion: " + decimalFormatter.format(row.getCompletion() * 100.0) + "%</h4><br />";
        }    
        content += "Please fill in your time sheet properly to get full completion <br />";
        
        if(commentColor != null && ! commentColor.equals("")) {
            content += "<font color=\"" + commentColor + "\">";
        }
        if(comment != null && ! comment.equals("")) {
            content += comment + "<br />";
        }
        if(commentColor != null && ! commentColor.equals("")) {
            content += "</font>";
        }

        content += "<hr /><br />";
        content += "Connect to Kronos at <a href=\"" + ConfigUtils.getProperties().getProperty("server.url") + "\">" + ConfigUtils.getProperties().getProperty("server.url") + "</a><br /><br />";
        if(user != null) {
            content += "Sent from Kronos on behalf of " + user.getFullName() + "<br />";
        } else {
            content += "Sent from Kronos.<br />";        
        }
        return content;
    }
    public static void sendCompletionNotificationMessage(Session mailSession, String content, String employeeEmail, String userEmail) throws MessagingException {
        Message msg = new MimeMessage(mailSession);
        msg.setFrom(new InternetAddress(ConfigUtils.getProperties().getProperty("mailer.from")));
        List<InternetAddress> tmpAddresses = new LinkedList<InternetAddress>();
        tmpAddresses.add(new InternetAddress(employeeEmail));
        if(userEmail != null) {
            tmpAddresses.add(new InternetAddress(userEmail));
        }
        InternetAddress[] addresses = new InternetAddress[tmpAddresses.size()];
        addresses[0] = tmpAddresses.get(0);
        if(tmpAddresses.size() > 1) {
            addresses[1] = tmpAddresses.get(1);
        }
        msg.setRecipients(Message.RecipientType.TO, addresses);
        msg.setSubject("Kronos. Time sheet completion notification.");
        msg.setSentDate(new Date());
        msg.setContent(content, "text/html");
        Transport.send(msg);
    }    
    
}
