/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mazars.management.jobs;

import com.mazars.management.db.comparators.ClosedMonthComparator;
import com.mazars.management.db.domain.ClosedMonth;
import com.mazars.management.db.domain.Country;
import com.mazars.management.db.domain.Employee;
import com.mazars.management.db.util.HibernateUtil;
import com.mazars.management.service.ConfigUtils;
import com.mazars.management.service.MailUtils;
import java.text.SimpleDateFormat;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Properties;
import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.PasswordAuthentication;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import org.hibernate.Session;

/**
 *
 * @author glazov
 */
public class MonthCloseNotificationJob extends AbstractJob {
    @Override
    public void execute() {
        SimpleDateFormat dateFormatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        try{
            hs.beginTransaction();
            List<Country> countries = Country.getAll();
            String successEmployees = "";
            String failEmployees = "";
            for(Country country : countries) {
                List<ClosedMonth> unclosedMonthes = ClosedMonth.checkCountry(country);
                if(! unclosedMonthes.isEmpty()) {
                    Collections.sort(unclosedMonthes, new ClosedMonthComparator());
                    for(Employee employee : Employee.getByCountryAndProfile(country, Employee.Profile.COUNTRY_ADMINISTRATOR)) {
                        if(! employee.getIsActive()) {
                            continue;
                        }
                        String message = getMessage(employee, country, unclosedMonthes);
                        try {
                            sentMessage(message, employee.getEmail());
                            successEmployees += employee.getUserName() + ", ";
                        } catch (Exception e) {
                            e.printStackTrace(System.out);
                            failEmployees += employee.getUserName() + ", ";
                        }
                    }
                }
            }
            hs.getTransaction().commit();
            System.out.println("The task for checking unclosed months was executed at " + dateFormatter.format(new Date()));
            System.out.println("Message sending passed to " + successEmployees );
            System.out.println("Message sending failed to " + failEmployees );
        } catch(Exception e) {
            hs.getTransaction().rollback();
            e.printStackTrace(System.out);
        }
    }   

    public String getMessage(Employee employee, Country country, List<ClosedMonth> unclosedMonthes) {
        String[] months = {"January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"};
        SimpleDateFormat dateFormatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String message = "";
        message += "Dear " + employee.getFullName() + ",<br />";
        message += "Some months in Kronos are not closed<br />";
        message += "Country: " + country.getName() + "<br />";
        for(ClosedMonth month : unclosedMonthes) {
            message += "" + months[month.getMonth()] + " " + month.getYear() + "<br />";
        }
        message += "Connect to Kronos at <a href=\"" + ConfigUtils.getProperties().getProperty("server.url") + "\">" + ConfigUtils.getProperties().getProperty("server.url") + "</a><br />";
        message += "Find the editor form at <strong>Admin/Close month</strong> section<br />";
        message += "This message was created automatically. Please do not reply to it.<br /><br />";
        message += "The database was analyzed at " + dateFormatter.format(new Date()) + "<br />";
        return message;
    }
    private void sentMessage(String message, String email) throws MessagingException {
        javax.mail.Session mailSession = MailUtils.getSession();
            
        Message msg = new MimeMessage(mailSession);
        msg.setFrom(new InternetAddress(ConfigUtils.getProperties().getProperty("mailer.from")));
        InternetAddress[] address = {new InternetAddress(email)};
        msg.setRecipients(Message.RecipientType.TO, address);
        msg.setSubject("Month not closed in Kronos.");
        msg.setSentDate(new Date());
        msg.setContent(message, "text/html");
        Transport.send(msg);    
    }
    
    @Override
    public void init() throws Exception {
        String monthCloserNotificationTimePattern = ConfigUtils.getProperties().getProperty("monthCloserNotificationTimePattern");
        if(monthCloserNotificationTimePattern != null) {
            String error = Scheduler.analyzeTimePattern(monthCloserNotificationTimePattern);
            if(error != null) {
                throw new Exception(error);
            }
            setTimePattern(monthCloserNotificationTimePattern);
            setInitialized(true);
        } else {
            setInitialized(false);
        }
    }
}
