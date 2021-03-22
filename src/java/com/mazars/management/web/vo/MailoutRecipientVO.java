/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.web.vo;

import com.mazars.management.db.domain.*;
import com.mazars.management.db.util.MailoutUtil;

/**
 *
 * @author Glazov
 */
public class MailoutRecipientVO {
    private Long id;
    private MailoutRecipient.Status status;
    private MailoutRecipient.Source source;
    private String email;
    private String comment;
    private Long contactId;
    private String contactFirstName;
    private String contactLastName;
    private Long employeeId;
    private String employeeFirstName;
    private String employeeLastName;

    public MailoutRecipientVO() {
    }
    public MailoutRecipientVO(MailoutUtil.DescribedMailoutRecipient describedMailoutRecipient) {
        MailoutRecipient mailoutRecipient = describedMailoutRecipient.getMailoutRecipient();
        Contact contact = describedMailoutRecipient.getContact();
        Employee employee = describedMailoutRecipient.getEmployee();
        this.id = mailoutRecipient.getId();
        this.status = mailoutRecipient.getStatus();
        this.source = mailoutRecipient.getSource();
        this.email = mailoutRecipient.getEmail();
        this.comment = mailoutRecipient.getComment();
        if(contact != null) {
            this.contactId = contact.getId();
            this.contactFirstName = contact.getFirstName();
            this.contactLastName = contact.getLastName();
        }
        if(employee != null) {
            this.employeeId = employee.getId();
            this.employeeFirstName = employee.getFirstName();
            this.employeeLastName = employee.getLastName();
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public MailoutRecipient.Status getStatus() {
        return status;
    }

    public void setStatus(MailoutRecipient.Status status) {
        this.status = status;
    }

    public MailoutRecipient.Source getSource() {
        return source;
    }

    public void setSource(MailoutRecipient.Source source) {
        this.source = source;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Long getContactId() {
        return contactId;
    }

    public void setContactId(Long contactId) {
        this.contactId = contactId;
    }

    public String getContactFirstName() {
        return contactFirstName;
    }

    public void setContactFirstName(String contactFirstName) {
        this.contactFirstName = contactFirstName;
    }

    public String getContactLastName() {
        return contactLastName;
    }

    public void setContactLastName(String contactLastName) {
        this.contactLastName = contactLastName;
    }

    public Long getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(Long employeeId) {
        this.employeeId = employeeId;
    }

    public String getEmployeeFirstName() {
        return employeeFirstName;
    }

    public void setEmployeeFirstName(String employeeFirstName) {
        this.employeeFirstName = employeeFirstName;
    }

    public String getEmployeeLastName() {
        return employeeLastName;
    }

    public void setEmployeeLastName(String employeeLastName) {
        this.employeeLastName = employeeLastName;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }
    
}
