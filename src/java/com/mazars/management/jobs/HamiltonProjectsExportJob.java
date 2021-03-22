/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mazars.management.jobs;

import com.mazars.management.db.domain.Activity;
import com.mazars.management.db.domain.Client;
import com.mazars.management.db.domain.Country;
import com.mazars.management.db.domain.Department;
import com.mazars.management.db.domain.Employee;
import com.mazars.management.db.domain.Office;
import com.mazars.management.db.domain.OutOfPocketItem;
import com.mazars.management.db.domain.ProjectCode;
import com.mazars.management.db.util.HibernateUtil;
import com.mazars.management.service.ConfigUtils;
import com.mazars.management.service.MailUtils;
import com.mazars.management.service.StringUtils;
import com.mazars.management.webservices.clients.hamilton.projects.Credential;
import com.mazars.management.webservices.clients.hamilton.projects.ExpNoteImportResult;
import com.mazars.management.webservices.clients.hamilton.projects.ExpNoteProject;
import com.mazars.management.webservices.clients.hamilton.projects.HDSWebFault;
import com.mazars.management.webservices.clients.hamilton.projects.MasterDataImportService;
import com.mazars.management.webservices.clients.hamilton.projects.MasterDataImportService_Service;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.LinkedList;
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
public class HamiltonProjectsExportJob extends AbstractJob {
    @Override
    public void execute() {
        SimpleDateFormat dateFormatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        try{
            hs.beginTransaction();
            Boolean hamiltonProjectsExportAllowed = StringUtils.getBoolean(ConfigUtils.getProperties().getProperty("hamiltonProjectsExportAllowed"));
            String hamiltonProjectsExportCountries = (String)ConfigUtils.getProperties().get("hamiltonProjectsExportCountries");
            String hamiltonProjectsExportUser = (String)ConfigUtils.getProperties().get("hamiltonProjectsExportUser");
            String hamiltonProjectsExportKey = (String)ConfigUtils.getProperties().get("hamiltonProjectsExportKey");
            if(! Boolean.TRUE.equals(hamiltonProjectsExportAllowed)) {
                String message = "It is not allowed to make export of Projects to HDS Group. See config properties (\"hamiltonProjectsExportAllowed\").";
                System.out.println(message);
            } else if(hamiltonProjectsExportCountries != null && hamiltonProjectsExportUser != null && hamiltonProjectsExportKey != null) {
                String[] countryNames = hamiltonProjectsExportCountries.split(",");
                List<Country> countries = new LinkedList<Country>();
                for(String name : countryNames) {
                    countries.addAll(Country.getByName(name));
                }
                
                Date closedAtTo = new Date();
                GregorianCalendar calStart = new GregorianCalendar();
                calStart.add(Calendar.MONTH, -2);
                Date closedAtFrom = calStart.getTime();
                
                for(Country country : countries) {
                    try {
                        // send all opened projects and all projects closed not earlier than 2 months ago
                        ExpNoteImportResult result = processCountry(country, closedAtFrom, closedAtTo, hamiltonProjectsExportUser.trim(), hamiltonProjectsExportKey.trim());
                        String message = "";
                        message += "The task for exporting projects to Hamilton was executed at " + dateFormatter.format(new Date());
                        message += ", Country " + country.getName();
                        message += ", Inserted " + result.getInsertedNumberOfRecords();
                        message += ", Updated " + result.getUpdatedNumberOfRecords();
                        System.out.println(message);
                    } catch (Exception ex) {
                        for(Employee employee : Employee.getByCountryAndProfile(country, Employee.Profile.COUNTRY_ADMINISTRATOR)) {
                            if(! employee.getIsActive()) {
                                continue;
                            }
                            String message = getMessage(employee, country, ex.getMessage());
                            sendMessage(message, employee.getEmail());
                        }
                        throw ex;
                    }
                }            
            } else {
                String message = "";
                if(hamiltonProjectsExportCountries == null) {
                    message += "Config property hamiltonProjectsExportCountries is not set ";
                }
                if(hamiltonProjectsExportUser == null) {
                    message += "Config property hamiltonProjectsExportUser is not set ";
                }
                if(hamiltonProjectsExportKey == null) {
                    message += "Config property hamiltonProjectsExportKey is not set ";
                }
                message += dateFormatter.format(new Date());
                System.out.println(message);
            }
            hs.getTransaction().commit();
        } catch(Exception e) {
            hs.getTransaction().rollback();
            e.printStackTrace(System.out);
        }
    }   
    public ExpNoteImportResult processCountry(Country country, Date closedAtFrom, Date closedAtTo, String user, String key) throws Exception {
        SimpleDateFormat dateFormatter = new SimpleDateFormat("yyyy-MM-dd");
                
        // send all opened projects and all projects closed in certain period
        List<ProjectCode> projectCodes = ProjectCode.getProjectCodesByClosedFlag(country, false);
        projectCodes.addAll(ProjectCode.getProjectCodes(country, null, null, null, null, closedAtFrom, closedAtTo) );
        
        List<ExpNoteProject> projects = new LinkedList<ExpNoteProject>();
        for(ProjectCode projectCode : projectCodes) {
            Client client = projectCode.getClient();
            Activity activity = projectCode.getActivity();
            Department department = projectCode.getSubdepartment().getDepartment();
            Office office = department.getOffice();
            Employee inChargePerson = projectCode.getInChargePerson();
            OutOfPocketItem outOfPocketItem = projectCode.getOutOfPocketItem();

            ExpNoteProject project = new ExpNoteProject();
            project.setProjectName(projectCode.getCode());
            project.setClient(client.getName());
            project.setActivity(activity.getName());
            project.setDepartment(office.getName() + " / " + department.getName());
            if(inChargePerson != null && inChargePerson.getExternalId() != null && ! inChargePerson.getExternalId().trim().equals("")) {
                project.setResponsible(inChargePerson.getExternalId().trim());
            }
            if(outOfPocketItem != null && outOfPocketItem.getType() != null) {
                project.setDisbursement("" + outOfPocketItem.getType());
            } else {
                project.setDisbursement("NA");
            }
            String projectDeactivationDate = null;
            if(projectCode.getClosedAt() != null) {
                projectDeactivationDate = dateFormatter.format(projectCode.getClosedAt());
            }
            project.setProjectDeactivationDate(projectDeactivationDate);
            projects.add(project);
        }    

        Credential credential = new Credential();
        credential.setKey(key);
        credential.setUser(user);
        
        MasterDataImportService_Service service = new MasterDataImportService_Service();
        MasterDataImportService a = service.getMasterDataImport();
        try {
            ExpNoteImportResult result = a.importExpNoteProjects(credential, projects);
            return result;
        } catch (HDSWebFault ex) {
            throw new Exception(ex.toString());
        }
    }
    public String getMessage(Employee employee, Country country, String exceptionMessage) {
        SimpleDateFormat dateFormatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String message = "";
        message += "Dear " + employee.getFullName() + ",<br />";
        message += "Country: " + country.getName() + "<br />";
        message += "Exception has been thrown after attempt to export project data to Hamilton web-service: " + exceptionMessage + "<br />";
        message += "Connect to Kronos at <a href=\"" + ConfigUtils.getProperties().getProperty("server.url") + "\">" + ConfigUtils.getProperties().getProperty("server.url") + "</a><br />";
        message += "This message was created automatically. Please do not reply to it.<br /><br />";
        message += "The attempt to export project was done at " + dateFormatter.format(new Date()) + "<br />";
        return message;
    }
    private void sendMessage(String message, String email) throws MessagingException {
        javax.mail.Session mailSession = MailUtils.getSession();
            
        Message msg = new MimeMessage(mailSession);
        msg.setFrom(new InternetAddress(ConfigUtils.getProperties().getProperty("mailer.from")));
        InternetAddress[] address = {new InternetAddress(email)};
        msg.setRecipients(Message.RecipientType.TO, address);
        msg.setSubject("Projects info export to Hamilton");
        msg.setSentDate(new Date());
        msg.setContent(message, "text/html");
        Transport.send(msg);    
    }
    
    @Override
    public void init() throws Exception {
        String hamiltonProjectsExportTimePattern = ConfigUtils.getProperties().getProperty("hamiltonProjectsExportTimePattern");
        if(hamiltonProjectsExportTimePattern != null) {
            String error = Scheduler.analyzeTimePattern(hamiltonProjectsExportTimePattern);
            if(error != null) {
                throw new Exception(error);
            }
            setTimePattern(hamiltonProjectsExportTimePattern);
            setInitialized(true);
        } else {
            setInitialized(false);
        }
    }
}
