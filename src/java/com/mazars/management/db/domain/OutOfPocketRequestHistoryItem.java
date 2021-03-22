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
public class OutOfPocketRequestHistoryItem {
    private Long id;
    private InvoiceRequestPacket.Status status;
    private String comment;
    private Date time;
    private Employee employee;
    private OutOfPocketRequest outOfPocketRequest;

    public OutOfPocketRequestHistoryItem() {};

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

    public InvoiceRequestPacket.Status getStatus() {
        return status;
    }

    public void setStatus(InvoiceRequestPacket.Status status) {
        this.status = status;
    }

    public OutOfPocketRequest getOutOfPocketRequest() {
        return outOfPocketRequest;
    }

    public void setOutOfPocketRequest(OutOfPocketRequest outOfPocketRequest) {
        this.outOfPocketRequest = outOfPocketRequest;
    }
}
