/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mazars.management.webservices.vo;

import com.mazars.management.db.domain.InvoiceRequest;
import com.mazars.management.db.domain.InvoiceRequestPacket;
import com.mazars.management.db.domain.OutOfPocketItem;
import java.math.BigDecimal;
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
@XmlRootElement(name="outOfPocketRequest", namespace = "http://services.webservices.management.mazars.com/")
@XmlAccessorType(XmlAccessType.FIELD)
public class OutOfPocketRequestVO {
    @XmlElement(name="id", namespace = "http://services.webservices.management.mazars.com/")
    private Long id;
    @XmlElement(name="projectCode", namespace = "http://services.webservices.management.mazars.com/")
    private String projectCode;   
    @XmlElement(name="type", namespace = "http://services.webservices.management.mazars.com/")
    private OutOfPocketItem.Type type;
    @XmlElement(name="amount", namespace = "http://services.webservices.management.mazars.com/")
    private BigDecimal amount;
    @XmlElement(name="currencyCode", namespace = "http://services.webservices.management.mazars.com/")
    private String currencyCode;
    @XmlElement(name="description", namespace = "http://services.webservices.management.mazars.com/")
    private String description;
    @XmlElement(name="status", namespace = "http://services.webservices.management.mazars.com/")
    private InvoiceRequestPacket.Status status;
    @XmlElement(name="modifiedAt", namespace = "http://services.webservices.management.mazars.com/")
    private Date modifiedAt; 
    @XmlElement(name="createdAt", namespace = "http://services.webservices.management.mazars.com/")
    private Date createdAt;
    @XmlElement(name="invoiceRequestPacketIds", namespace = "http://services.webservices.management.mazars.com/")
    private List<Long> invoiceRequestPacketIds = new LinkedList<Long>();
    
    @XmlElement(name="invoiceRequestIds", namespace = "http://services.webservices.management.mazars.com/")
    private List<Long> invoiceRequestIds = new LinkedList<Long>();
    @XmlElement(name="actRequestIds", namespace = "http://services.webservices.management.mazars.com/")
    private List<Long> actRequestIds = new LinkedList<Long>();
    @XmlElement(name="taxInvoiceRequestIds", namespace = "http://services.webservices.management.mazars.com/")
    private List<Long> taxInvoiceRequestIds = new LinkedList<Long>();
    
    public OutOfPocketRequestVO() {
    }

    public OutOfPocketRequestVO(com.mazars.management.db.domain.OutOfPocketRequest outOfPocketRequest) {
        this.id = outOfPocketRequest.getId();
        this.projectCode = outOfPocketRequest.getProjectCode().getCode();
        this.status = outOfPocketRequest.getStatus();
        this.type = outOfPocketRequest.getType();
        this.amount = outOfPocketRequest.getAmount();
        if(outOfPocketRequest.getCurrency() != null) {
            this.currencyCode = outOfPocketRequest.getCurrency().getCode();
        }
        this.description = outOfPocketRequest.getDescription();
        this.modifiedAt = outOfPocketRequest.getModifiedAt();
        this.createdAt = outOfPocketRequest.getCreatedAt();
        if(outOfPocketRequest.getProjectCode().getInvoiceRequestPackets() != null) {
            for(InvoiceRequestPacket invoiceRequestPacket : outOfPocketRequest.getProjectCode().getInvoiceRequestPackets()) {
                this.invoiceRequestPacketIds.add(invoiceRequestPacket.getId());
                if(invoiceRequestPacket.getInvoiceRequests() != null) {
                    for(InvoiceRequest invoiceRequest : invoiceRequestPacket.getInvoiceRequests()) {
                        this.invoiceRequestIds.add(invoiceRequest.getId());
                    }
                }
                if(invoiceRequestPacket.getActRequest() != null) {
                    this.actRequestIds.add(invoiceRequestPacket.getActRequest().getId());
                }
                if(invoiceRequestPacket.getTaxInvoiceRequest() != null) {
                    this.taxInvoiceRequestIds.add(invoiceRequestPacket.getTaxInvoiceRequest().getId());
                }
            }
        }
    }

    public InvoiceRequestPacket.Status getStatus() {
        return status;
    }

    public void setStatus(InvoiceRequestPacket.Status status) {
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public List<Long> getInvoiceRequestPacketIds() {
        return invoiceRequestPacketIds;
    }

    public void setInvoiceRequestPacketIds(List<Long> invoiceRequestPacketIds) {
        this.invoiceRequestPacketIds = invoiceRequestPacketIds;
    }

    public List<Long> getInvoiceRequestIds() {
        return invoiceRequestIds;
    }

    public void setInvoiceRequestIds(List<Long> invoiceRequestIds) {
        this.invoiceRequestIds = invoiceRequestIds;
    }

    public List<Long> getActRequestIds() {
        return actRequestIds;
    }

    public void setActRequestIds(List<Long> actRequestIds) {
        this.actRequestIds = actRequestIds;
    }

    public List<Long> getTaxInvoiceRequestIds() {
        return taxInvoiceRequestIds;
    }

    public void setTaxInvoiceRequestIds(List<Long> taxInvoiceRequestIds) {
        this.taxInvoiceRequestIds = taxInvoiceRequestIds;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getProjectCode() {
        return projectCode;
    }

    public void setProjectCode(String projectCode) {
        this.projectCode = projectCode;
    }

    public OutOfPocketItem.Type getType() {
        return type;
    }

    public void setType(OutOfPocketItem.Type type) {
        this.type = type;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getCurrencyCode() {
        return currencyCode;
    }

    public void setCurrencyCode(String currencyCode) {
        this.currencyCode = currencyCode;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public Date getModifiedAt() {
        return modifiedAt;
    }

    public void setModifiedAt(Date modifiedAt) {
        this.modifiedAt = modifiedAt;
    }
}
