/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mazars.management.jobs;

import com.mazars.management.db.domain.Employee;
import com.mazars.management.db.domain.FeesAct;
import com.mazars.management.db.domain.ProjectCode;
import com.mazars.management.db.domain.Subdepartment;
import com.mazars.management.db.util.CalendarUtil;
import com.mazars.management.db.util.HibernateUtil;
import com.mazars.management.service.ConfigUtils;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.LinkedList;
import java.util.List;
import org.hibernate.Session;

/**
 *
 * @author glazov
 */
public class ProjectCodeCloseJob extends AbstractJob {
    @Override
    public void execute() {
        SimpleDateFormat dateFormatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        try{
            hs.beginTransaction();
            String projectCodeCloseJobSubdepartmentIds = (String)ConfigUtils.getProperties().get("projectCodeCloseJobSubdepartmentIds");
            String projectCodeCloseJobExpirationDays = (String)ConfigUtils.getProperties().get("projectCodeCloseJobExpirationDays");
            String projectCodeCloseJobEmployee = (String)ConfigUtils.getProperties().get("projectCodeCloseJobEmployee");
            if(projectCodeCloseJobSubdepartmentIds != null && projectCodeCloseJobExpirationDays != null && projectCodeCloseJobEmployee != null) {
                String[] subdepartmentIds = projectCodeCloseJobSubdepartmentIds.split(",");
                List<Subdepartment> subdepartments = new LinkedList<Subdepartment>();
                for(String strSubdepartmentId : subdepartmentIds) {
                    Subdepartment subdepartment = (Subdepartment)hs.get(Subdepartment.class, new Long(strSubdepartmentId.trim()));
                    subdepartments.add(subdepartment);
                }
                
                Integer expirationDays = Integer.parseInt(projectCodeCloseJobExpirationDays);
                Calendar actDateStart = null;
                Calendar actDateEnd = new GregorianCalendar();
                CalendarUtil.truncateTime(actDateEnd);
                actDateEnd.add(Calendar.DAY_OF_MONTH, -expirationDays);
                
                Employee employee = Employee.getByUserName(projectCodeCloseJobEmployee);
                
                Date closedAt = new Date();
                List<ProjectCode> projectCodes = FeesAct.getProjectCodes(subdepartments, actDateStart, actDateEnd, false);
                
                String projectCodesList = "";
                for(ProjectCode projectCode : projectCodes) {
                    projectCodesList += projectCode.getCode() + " ";
                }
                
                for(ProjectCode projectCode : projectCodes) {
                    try {
                        projectCode.setIsClosed(Boolean.TRUE);
                        projectCode.setClosedBy(employee);
                        projectCode.setClosedAt(closedAt);
                        hs.save(projectCode);
                        
                        String message = "";
                        message += "The task to close all projects with old acts was executed at " + dateFormatter.format(new Date()) + ". ";
                        message += "Project Codes to close: " + projectCodesList;
                        System.out.println(message);
                    } catch (Exception ex) {
                        throw ex;
                    }
                }            
            } else {
                String message = "";
                if(projectCodeCloseJobSubdepartmentIds == null) {
                    message += "Config property projectCodeCloseJobSubdepartmentIds is not set ";
                }
                if(projectCodeCloseJobExpirationDays == null) {
                    message += "Config property projectCodeCloseJobExpirationDays is not set ";
                }
                if(projectCodeCloseJobEmployee == null) {
                    message += "Config property projectCodeCloseJobEmployee is not set ";
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
    
    @Override
    public void init() throws Exception {
        String projectCodeCloseTimePattern = ConfigUtils.getProperties().getProperty("projectCodeCloseTimePattern");
        if(projectCodeCloseTimePattern != null) {
            String error = Scheduler.analyzeTimePattern(projectCodeCloseTimePattern);
            if(error != null) {
                throw new Exception(error);
            }
            setTimePattern(projectCodeCloseTimePattern);
            setInitialized(true);
        } else {
            setInitialized(false);
        }
    }
}
