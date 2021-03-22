/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mazars.management.web.vo;

import com.mazars.management.db.domain.InvoiceRequest;
import com.mazars.management.db.domain.InvoiceRequestPacketHistoryItem;
import com.mazars.management.db.domain.InvoiceRequestPacket;
import com.mazars.management.db.vo.YearMonthDateTime;

/**
 *
 * @author glazov
 */
public class InvoiceRequestPacketHistoryItemVO {
    private Long id;
    private InvoiceRequestPacket.Status status;
    private String comment;
    private YearMonthDateTime time;
    private Long employeeId;
    private String employeeUserName;

    public InvoiceRequestPacketHistoryItemVO(InvoiceRequestPacketHistoryItem invoiceRequestPacketHistoryItem) {
        this.id = invoiceRequestPacketHistoryItem.getId();
        this.status = invoiceRequestPacketHistoryItem.getStatus();
        this.comment = invoiceRequestPacketHistoryItem.getComment();
        if(invoiceRequestPacketHistoryItem.getTime() != null) {
            this.time = new YearMonthDateTime(invoiceRequestPacketHistoryItem.getTime());
        }
        if(invoiceRequestPacketHistoryItem.getEmployee() != null) {
            this.employeeId = invoiceRequestPacketHistoryItem.getEmployee().getId();
            this.employeeUserName = invoiceRequestPacketHistoryItem.getEmployee().getUserName();
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public InvoiceRequestPacket.Status getStatus() {
        return status;
    }

    public void setStatus(InvoiceRequestPacket.Status status) {
        this.status = status;
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

    public String getEmployeeUserName() {
        return employeeUserName;
    }

    public void setEmployeeUserName(String employeeUserName) {
        this.employeeUserName = employeeUserName;
    }
    
}
