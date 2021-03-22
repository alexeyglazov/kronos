/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mazars.management.web.vo;

import com.mazars.management.db.domain.InvoiceRequestPacket;
import com.mazars.management.db.domain.InvoiceRequestPacketHistoryItem;
import com.mazars.management.db.domain.OutOfPocketRequest;
import com.mazars.management.db.domain.OutOfPocketRequestHistoryItem;
import com.mazars.management.db.vo.YearMonthDateTime;

/**
 *
 * @author glazov
 */
public class OutOfPocketRequestHistoryItemVO {
    private Long id;
    private InvoiceRequestPacket.Status status;
    private String comment;
    private YearMonthDateTime time;
    private Long employeeId;
    private String employeeUserName;

    public OutOfPocketRequestHistoryItemVO(OutOfPocketRequestHistoryItem outOfPocketRequestHistoryItem) {
        this.id = outOfPocketRequestHistoryItem.getId();
        this.status = outOfPocketRequestHistoryItem.getStatus();
        this.comment = outOfPocketRequestHistoryItem.getComment();
        if(outOfPocketRequestHistoryItem.getTime() != null) {
            this.time = new YearMonthDateTime(outOfPocketRequestHistoryItem.getTime());
        }
        if(outOfPocketRequestHistoryItem.getEmployee() != null) {
            this.employeeId = outOfPocketRequestHistoryItem.getEmployee().getId();
            this.employeeUserName = outOfPocketRequestHistoryItem.getEmployee().getUserName();
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
