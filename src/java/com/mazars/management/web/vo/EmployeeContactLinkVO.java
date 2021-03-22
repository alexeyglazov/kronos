/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.web.vo;

import com.mazars.management.db.domain.*;
import java.util.LinkedList;
import java.util.List;

/**
 *
 * @author Glazov
 */
public class EmployeeContactLinkVO {
    private Long id;
    private Long contactId;
    private String contactFirstName;
    private String contactLastName;
    private String comment;
    private Long employeeId;
    private String employeeFirstName;
    private String employeeLastName;
    private String employeeFirstNameLocalLanguage;
    private String employeeLastNameLocalLanguage;
    private String employeeUserName;

    public EmployeeContactLinkVO() {
    }
    
    public EmployeeContactLinkVO(EmployeeContactLink employeeContactLink) {
        Employee employee = employeeContactLink.getEmployee();
        Contact contact = employeeContactLink.getContact();
        this.id = employeeContactLink.getId();
        this.contactId = contact.getId();
        this.contactFirstName = contact.getFirstName();
        this.contactLastName = contact.getLastName();
        this.comment = employeeContactLink.getComment();
        this.employeeId = employee.getId();
        this.employeeFirstName = employee.getFirstName();
        this.employeeLastName = employee.getLastName();
        this.employeeFirstNameLocalLanguage = employee.getFirstNameLocalLanguage();
        this.employeeLastNameLocalLanguage = employee.getLastNameLocalLanguage();
        this.employeeUserName = employee.getUserName();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getContactId() {
        return contactId;
    }

    public void setContactId(Long contactId) {
        this.contactId = contactId;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
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

    public String getEmployeeFirstNameLocalLanguage() {
        return employeeFirstNameLocalLanguage;
    }

    public void setEmployeeFirstNameLocalLanguage(String employeeFirstNameLocalLanguage) {
        this.employeeFirstNameLocalLanguage = employeeFirstNameLocalLanguage;
    }

    public String getEmployeeLastNameLocalLanguage() {
        return employeeLastNameLocalLanguage;
    }

    public void setEmployeeLastNameLocalLanguage(String employeeLastNameLocalLanguage) {
        this.employeeLastNameLocalLanguage = employeeLastNameLocalLanguage;
    }

    public String getEmployeeUserName() {
        return employeeUserName;
    }

    public void setEmployeeUserName(String employeeUserName) {
        this.employeeUserName = employeeUserName;
    }
    public static List<EmployeeContactLinkVO> getList(List<EmployeeContactLink> employeeContactLinks) {
        List<EmployeeContactLinkVO> employeeContactLinkVOs = new LinkedList<EmployeeContactLinkVO>();
        if(employeeContactLinks == null) {
            return null;
        }
        for(EmployeeContactLink employeeContactLink : employeeContactLinks) {
           employeeContactLinkVOs.add(new EmployeeContactLinkVO(employeeContactLink));
        }
        return employeeContactLinkVOs;
    }
}
