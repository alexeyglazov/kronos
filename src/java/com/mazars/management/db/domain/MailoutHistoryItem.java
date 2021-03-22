/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.db.domain;
import java.util.Date;

/**
 *
 * @author glazov
 */
public class MailoutHistoryItem {
    private Long id;
    private Mailout.Status status;
    private String comment;
    private Date time;
    private Employee employee;
    private Mailout mailout;

    public MailoutHistoryItem() {};

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

    public Date getTime() {
        return time;
    }

    public void setTime(Date time) {
        this.time = time;
    }

    public Employee getEmployee() {
        return employee;
    }

    public void setEmployee(Employee employee) {
        this.employee = employee;
    }

    public Mailout getMailout() {
        return mailout;
    }

    public void setMailout(Mailout mailout) {
        this.mailout = mailout;
    }

    public Mailout.Status getStatus() {
        return status;
    }

    public void setStatus(Mailout.Status status) {
        this.status = status;
    }


}
