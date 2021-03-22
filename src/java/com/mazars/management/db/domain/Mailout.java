/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.db.domain;
import com.mazars.management.db.util.HibernateUtil;
import java.util.Calendar;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import org.hibernate.Query;
import org.hibernate.Session;

/**
 *
 * @author glazov
 */
public class Mailout {
    public static enum Status {
        MODIFIED,
        TESTED,
        STARTED,
        FINISHED,
        CLOSED
    }
    private Long id;
    private String name;
    private String description;
    private String senderName;
    private String subject;
    private String testTo;
    private String replyTo;
    private String dispositionNotificationTo;
    private Status status;
    private Integer delay;
    private Integer partSize;
    
    private MailoutContent mailoutContent;
    private String jsonMailoutContent;
       
    private Set<MailoutRecipient> mailoutRecipients = new HashSet<MailoutRecipient>();
    private Set<MailoutHistoryItem> mailoutHistoryItems = new HashSet<MailoutHistoryItem>();
    
    public Mailout() {};

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getSenderName() {
        return senderName;
    }

    public void setSenderName(String senderName) {
        this.senderName = senderName;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getReplyTo() {
        return replyTo;
    }

    public void setReplyTo(String replyTo) {
        this.replyTo = replyTo;
    }

    public String getTestTo() {
        return testTo;
    }

    public void setTestTo(String testTo) {
        this.testTo = testTo;
    }

    public String getDispositionNotificationTo() {
        return dispositionNotificationTo;
    }

    public void setDispositionNotificationTo(String dispositionNotificationTo) {
        this.dispositionNotificationTo = dispositionNotificationTo;
    }

    public Set<MailoutHistoryItem> getMailoutHistoryItems() {
        return mailoutHistoryItems;
    }

    public void setMailoutHistoryItems(Set<MailoutHistoryItem> mailoutHistoryItems) {
        this.mailoutHistoryItems = mailoutHistoryItems;
    }

    public Set<MailoutRecipient> getMailoutRecipients() {
        return mailoutRecipients;
    }

    public void setMailoutRecipients(Set<MailoutRecipient> mailoutRecipients) {
        this.mailoutRecipients = mailoutRecipients;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public Integer getDelay() {
        return delay;
    }

    public void setDelay(Integer delay) {
        this.delay = delay;
    }

    public Integer getPartSize() {
        return partSize;
    }

    public void setPartSize(Integer partSize) {
        this.partSize = partSize;
    }

    public MailoutContent getMailoutContent() {
        return mailoutContent;
    }

    public void setMailoutContent(MailoutContent mailoutContent) {
        this.mailoutContent = mailoutContent;
    }

    public String getJsonMailoutContent() {
        return jsonMailoutContent;
    }

    public void setJsonMailoutContent(String jsonMailoutContent) {
        this.jsonMailoutContent = jsonMailoutContent;
    }

    public void makeJsonMailoutContent() {
        if(this.mailoutContent != null) {
            this.jsonMailoutContent = this.mailoutContent.getJSON();
        } else {
            this.jsonMailoutContent = null;
        }
    }
    public void makeMailoutContent() {
        this.mailoutContent = new MailoutContent(this.jsonMailoutContent);
    }
    public static List<Mailout> getMailouts() {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        String query = "select m from Mailout as m";
        Query hq = hs.createQuery(query);
        return (List<Mailout>)hq.list();
    }
}
