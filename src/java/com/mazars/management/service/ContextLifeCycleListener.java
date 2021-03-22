/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mazars.management.service;

import com.mazars.management.db.util.HibernateUtil;
import com.mazars.management.jobs.AbstractJob;
import com.mazars.management.jobs.HamiltonProjectsExportJob;
import com.mazars.management.jobs.MonthCloseNotificationJob;
import com.mazars.management.jobs.ProjectCodeCloseJob;
import com.mazars.management.jobs.Scheduler;
import com.mazars.management.security.SecurityUtils;
import com.mazars.management.web.content.ContentManager;
import java.net.URI;
import java.util.Date;
import java.util.List;
import java.util.Timer;
import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import org.hibernate.Hibernate;
import org.hibernate.Session;

/**
 * Web application lifecycle listener.
 *
 * @author glazov
 */
public class ContextLifeCycleListener implements ServletContextListener {

    @Override
    public void contextInitialized(ServletContextEvent sce) {

        if(sce.getServletContext().getInitParameter("DatabaseUrlSystemVariable") != null && System.getenv(sce.getServletContext().getInitParameter("DatabaseUrlSystemVariable")) != null) {
            String databaseURL = System.getenv(sce.getServletContext().getInitParameter("DatabaseUrlSystemVariable"));
            HibernateUtil.setDatabaseURL(databaseURL);
        }
        HibernateUtil.setConfigFile(sce.getServletContext().getInitParameter("HibernateConfigFile"));
        
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        try {
            hs.beginTransaction();
            
            // read ConfigProperties from database and put them into ConfigUtils class
            ConfigUtils.init();
            // read SecretKey string from web.xml
            if(sce.getServletContext().getInitParameter("SecretKey") != null) {
                SecurityUtils.init(sce.getServletContext().getInitParameter("SecretKey").trim());
            }
            
            ContentManager.init(sce.getServletContext());
            
            MonthCloseNotificationJob monthCloseNotificationJob = new MonthCloseNotificationJob();
            monthCloseNotificationJob.init();
                      
            HamiltonProjectsExportJob hamiltonProjectsExportJob = new HamiltonProjectsExportJob();
            hamiltonProjectsExportJob.init();

            ProjectCodeCloseJob projectCodeCloseJob = new ProjectCodeCloseJob();
            projectCodeCloseJob.init();
            
            Scheduler scheduler = Scheduler.getInstance();
            List<AbstractJob> jobs = scheduler.getJobs();
            if(monthCloseNotificationJob.getInitialized()) {
                jobs.add(monthCloseNotificationJob);
            }
            if(hamiltonProjectsExportJob.getInitialized()) {
                jobs.add(hamiltonProjectsExportJob);
            }
            if(projectCodeCloseJob.getInitialized()) {
                jobs.add(projectCodeCloseJob);
            }
            scheduler.setJobs(jobs);
            
            Timer timer = new Timer();
            timer.schedule(scheduler, new Date(), 1000*60); // run every minute
            
            hs.getTransaction().commit();
        } catch (Exception e) {
            hs.getTransaction().rollback();
            e.printStackTrace(System.out);
        }
    }

    @Override
    public void contextDestroyed(ServletContextEvent sce) {
        //throw new UnsupportedOperationException("Not supported yet.");
    }
}
