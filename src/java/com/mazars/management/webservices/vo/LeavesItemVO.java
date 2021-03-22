/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mazars.management.webservices.vo;

import com.mazars.management.db.domain.InvoiceRequest;
import com.mazars.management.db.domain.InvoiceRequestPacket;
import com.mazars.management.db.domain.LeavesItem;
import com.mazars.management.db.domain.TaxInvoiceRequest;
import java.math.BigDecimal;
import java.util.Calendar;
import java.util.Date;
import java.util.LinkedList;
import java.util.List;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

/**
 *
 * @author glazov
 */
@XmlRootElement(name="leavesItem", namespace = "http://services.webservices.management.mazars.com/")
@XmlAccessorType(XmlAccessType.FIELD)
public class LeavesItemVO {
    @XmlElement(name="startDate", namespace = "http://services.webservices.management.mazars.com/")
    private Calendar startDate;
    @XmlElement(name="endDate", namespace = "http://services.webservices.management.mazars.com/")
    private Calendar endDate;    
    @XmlElement(name="type", namespace = "http://services.webservices.management.mazars.com/")
    private LeavesItem.Type type;
    
    public LeavesItemVO() {
    }

    public LeavesItemVO(LeavesItem leavesItem) {
        this.startDate = leavesItem.getStart();
        this.endDate = leavesItem.getEnd();
        this.type = leavesItem.getType();
    }

    public Calendar getStartDate() {
        return startDate;
    }

    public void setStartDate(Calendar startDate) {
        this.startDate = startDate;
    }

    public Calendar getEndDate() {
        return endDate;
    }

    public void setEndDate(Calendar endDate) {
        this.endDate = endDate;
    }

    public LeavesItem.Type getType() {
        return type;
    }

    public void setType(LeavesItem.Type type) {
        this.type = type;
    }
}
