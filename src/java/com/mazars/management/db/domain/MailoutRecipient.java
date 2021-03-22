/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.db.domain;
import com.mazars.management.db.util.HibernateUtil;
import java.util.Calendar;
import org.hibernate.Session;
import java.util.List;
import java.util.Set;
import java.util.HashSet;
import org.hibernate.Query;

/**
 *
 * @author glazov
 */
public class MailoutRecipient {
    public enum Status {
        CREATED,
        SENT,
        RECIEVED,
        SEND_FAILED,
        RECIEVE_FAILED
    }
    public enum Source {
        FREE,
        CONTACT,
        EMPLOYEE
    }
    private Long id;
    private Mailout mailout;
    private Status status;
    private Source source;
    private String email;
    private Contact contact;
    private Employee employee;
    private String comment;
    
    public MailoutRecipient() {};

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Mailout getMailout() {
        return mailout;
    }

    public void setMailout(Mailout mailout) {
        this.mailout = mailout;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public Source getSource() {
        return source;
    }

    public void setSource(Source source) {
        this.source = source;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Contact getContact() {
        return contact;
    }

    public void setContact(Contact contact) {
        this.contact = contact;
    }

    public Employee getEmployee() {
        return employee;
    }

    public void setEmployee(Employee employee) {
        this.employee = employee;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }
    public static List<MailoutRecipient> getMailoutRecipients(Mailout mailout, List<MailoutRecipient.Status> statuses) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        String query = "select mr from MailoutRecipient as mr inner join mr.mailout as m where m=:mailout and mr.status in :statuses ";
        Query hq = hs.createQuery(query);
        hq.setParameter("mailout", mailout);
        hq.setParameterList("statuses", statuses);
        return (List<MailoutRecipient>)hq.list();
    }
}
