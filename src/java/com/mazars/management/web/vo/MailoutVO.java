/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.web.vo;
import com.mazars.management.db.vo.*;
import com.mazars.management.db.domain.*;
import java.util.LinkedList;
import java.util.List;

/**
 *
 * @author glazov
 */
public class MailoutVO {
    private Long id;
    private String name;
    private String description;
    private String senderName;
    private String subject;
    private String testTo;
    private String replyTo;
    private String dispositionNotificationTo;
    private Mailout.Status status;
    private MailoutContent mailoutContent;
    private Integer delay;
    private Integer partSize;    
    
    public MailoutVO() {};

    public MailoutVO(Mailout mailout) {
        this.id = mailout.getId();
        this.name = mailout.getName();
        this.description = mailout.getDescription();
        this.senderName = mailout.getSenderName();
        this.subject = mailout.getSubject();
        this.testTo = mailout.getTestTo();
        this.replyTo = mailout.getReplyTo();
        this.dispositionNotificationTo = mailout.getDispositionNotificationTo();
        this.delay = mailout.getDelay();
        this.partSize = mailout.getPartSize();
        this.status = mailout.getStatus();
        this.mailoutContent = mailout.getMailoutContent();
    }

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

    public String getDispositionNotificationTo() {
        return dispositionNotificationTo;
    }

    public void setDispositionNotificationTo(String dispositionNotificationTo) {
        this.dispositionNotificationTo = dispositionNotificationTo;
    }

    public Mailout.Status getStatus() {
        return status;
    }

    public void setStatus(Mailout.Status status) {
        this.status = status;
    }

    public String getTestTo() {
        return testTo;
    }

    public void setTestTo(String testTo) {
        this.testTo = testTo;
    }

    public MailoutContent getMailoutContent() {
        return mailoutContent;
    }

    public void setMailoutContent(MailoutContent mailoutContent) {
        this.mailoutContent = mailoutContent;
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

    public static List<MailoutVO> getList(List<Mailout> mailouts) {
        List<MailoutVO> mailoutVOs = new LinkedList<MailoutVO>();
        if(mailouts == null) {
            return null;
        }
        for(Mailout mailout : mailouts) {
           mailoutVOs.add(new MailoutVO(mailout));
        }
        return mailoutVOs;
    }
}
