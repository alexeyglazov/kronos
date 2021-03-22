/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.web.forms;
import com.google.gson.Gson;

/**
 *
 * @author glazov
 */
public class MailoutEditForm {    
    public enum Mode {
        CREATE,
        UPDATE
    }
    private MailoutEditForm.Mode mode;
    private Long id;
    private String name;
    private String description;
    private String senderName;
    private String subject;
    private String testTo;
    private String replyTo;
    private String dispositionNotificationTo;
    private Long templateId;
    private Integer delay;
    private Integer partSize;    

    public MailoutEditForm() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public MailoutEditForm.Mode getMode() {
        return mode;
    }

    public void setMode(MailoutEditForm.Mode mode) {
        this.mode = mode;
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

    public Long getTemplateId() {
        return templateId;
    }

    public void setTemplateId(Long templateId) {
        this.templateId = templateId;
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

    public static MailoutEditForm getFromJson(String json) {
        Gson gson = new Gson();
        return gson.fromJson(json, MailoutEditForm.class);
    }

}
