/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.web.vo;

import com.mazars.management.db.domain.Employee;
import com.mazars.management.db.domain.Mailout;
import com.mazars.management.db.domain.MailoutHistoryItem;
import com.mazars.management.db.vo.YearMonthDateTime;
/**
 *
 * @author Glazov
 */
public class MailoutHistoryItemVO {
    private Long id;
    private Mailout.Status status;
    private String comment;
    private YearMonthDateTime time;
    private Long employeeId;
    private String employeeFirstName;
    private String employeeLastName;
    private String employeeUserName;

    public MailoutHistoryItemVO() {}

    public MailoutHistoryItemVO(MailoutHistoryItem mailoutHistoryItem, Employee employee) {
        this.id = mailoutHistoryItem.getId();
        this.status = mailoutHistoryItem.getStatus();
        this.comment = mailoutHistoryItem.getComment();
        this.time = new YearMonthDateTime(mailoutHistoryItem.getTime());
        if(employee != null) {
            this.employeeId = employee.getId();
            this.employeeFirstName = employee.getFirstName();
            this.employeeLastName = employee.getLastName();
            this.employeeUserName = employee.getUserName();
        }
    }
    public MailoutHistoryItemVO(MailoutHistoryItem mailoutHistoryItem) {
        this(mailoutHistoryItem, mailoutHistoryItem.getEmployee());
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public YearMonthDateTime getTime() {
        return time;
    }

    public void setTime(YearMonthDateTime time) {
        this.time = time;
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

    public String getEmployeeUserName() {
        return employeeUserName;
    }

    public void setEmployeeUserName(String employeeUserName) {
        this.employeeUserName = employeeUserName;
    }

    public Mailout.Status getStatus() {
        return status;
    }

    public void setStatus(Mailout.Status status) {
        this.status = status;
    }

}
