/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mazars.management.service;

import com.mazars.management.db.domain.Employee;
import com.mazars.management.db.domain.JobResult;
import com.mazars.management.db.domain.Mailout;
import com.mazars.management.db.domain.MailoutRecipient;
import com.mazars.management.db.util.HibernateUtil;
import com.mazars.management.jobs.Job;
import java.util.Date;
import java.util.LinkedList;
import java.util.List;
import org.hibernate.Session;

/**
 *
 * @author glazov
 */
public class MailerJob extends Job {
    Mailout mailout;
    List<MailoutRecipient> mailoutRecipients = new LinkedList<MailoutRecipient>();

    public Mailout getMailout() {
        return mailout;
    }

    public void setMailout(Mailout mailout) {
        this.mailout = mailout;
    }

    public List<MailoutRecipient> getMailoutRecipients() {
        return mailoutRecipients;
    }

    public void setMailoutRecipients(List<MailoutRecipient> mailoutRecipients) {
        this.mailoutRecipients = mailoutRecipients;
    }

    @Override
    public void execute() throws Exception {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        try {
            hs.beginTransaction();
            refresh();
            hs.getTransaction().commit();
        } catch(Exception e) {
            hs.getTransaction().rollback();
            throw e;
        }
        doSend();
    }
    public void refresh() throws Exception {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        setMailout((Mailout)hs.get(Mailout.class, mailout.getId()));
        mailout.makeMailoutContent();
        setEmployee((Employee)hs.get(Employee.class, getEmployee().getId()));       
    }
    private void doSend() throws Exception {
        Mailer mailer = new Mailer(mailout, this);
        if(mailoutRecipients == null || mailoutRecipients.isEmpty()) {
            mailer.sendPartially();
        } else {
            mailer.sendToSelected(mailoutRecipients);
        }
        byte[] data = null;
        
        JobResult jobResult = new JobResult();
        jobResult.setName(this.getName());
        jobResult.setEmployee(getEmployee());
        jobResult.setStartDate(this.getStartDate());
        jobResult.setEndDate(new Date());
        jobResult.setData(data);
        if(data != null) {
            jobResult.setDataSize(data.length);
        } else {
            jobResult.setDataSize(null);
        }
        jobResult.setFileName(null);
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        try {
            hs.beginTransaction();
            hs.save(jobResult);
            hs.getTransaction().commit();
        } catch(Exception e) {
            hs.getTransaction().rollback();
            throw e;
        }
    }
}
