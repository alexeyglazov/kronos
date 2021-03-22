/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mazars.management.webservices.vo;

import com.mazars.management.db.domain.InvoiceRequest;
import com.mazars.management.db.domain.InvoiceRequestPacket;
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
@XmlRootElement(name="taxInvoiceRequest", namespace = "http://services.webservices.management.mazars.com/")
@XmlAccessorType(XmlAccessType.FIELD)
public class TaxInvoiceRequestVO {
    @XmlElement(name="id", namespace = "http://services.webservices.management.mazars.com/")
    private Long id;
    @XmlElement(name="projectCode", namespace = "http://services.webservices.management.mazars.com/")
    private String projectCode;
    @XmlElement(name="invoiceRequestPacketId", namespace = "http://services.webservices.management.mazars.com/")
    private Long invoiceRequestPacketId;    
    @XmlElement(name="withVAT", namespace = "http://services.webservices.management.mazars.com/")
    private Boolean withVAT;
    @XmlElement(name="status", namespace = "http://services.webservices.management.mazars.com/")
    private InvoiceRequestPacket.Status status;
    @XmlElement(name="actRequestId", namespace = "http://services.webservices.management.mazars.com/")
    private Long actRequestId;
    @XmlElement(name="isCancelled", namespace = "http://services.webservices.management.mazars.com/")
    private Boolean isCancelled;
    @XmlElement(name="modifiedAt", namespace = "http://services.webservices.management.mazars.com/")
    private Date modifiedAt; 
    @XmlElement(name="reference", namespace = "http://services.webservices.management.mazars.com/")
    private String reference;
    
    public TaxInvoiceRequestVO() {
    }

    public TaxInvoiceRequestVO(com.mazars.management.db.domain.TaxInvoiceRequest taxInvoiceRequest) {
        this.id = taxInvoiceRequest.getId();
        this.projectCode = taxInvoiceRequest.getInvoiceRequestPacket().getProjectCode().getCode();
        this.invoiceRequestPacketId = taxInvoiceRequest.getInvoiceRequestPacket().getId();
        this.withVAT = taxInvoiceRequest.getInvoiceRequestPacket().getWithVAT();
        this.isCancelled = taxInvoiceRequest.getIsCancelled();
        this.reference = taxInvoiceRequest.getReference();
        this.modifiedAt = taxInvoiceRequest.getInvoiceRequestPacket().getModifiedAt();
        this.status = taxInvoiceRequest.getInvoiceRequestPacket().getStatus();
        if(taxInvoiceRequest.getInvoiceRequestPacket().getActRequest() != null) {
            this.actRequestId = taxInvoiceRequest.getInvoiceRequestPacket().getActRequest().getId();
        }
        this.isCancelled = taxInvoiceRequest.getIsCancelled();
        this.reference = taxInvoiceRequest.getReference();
    }

    public Boolean getWithVAT() {
        return withVAT;
    }

    public void setWithVAT(Boolean withVAT) {
        this.withVAT = withVAT;
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

    public String getProjectCode() {
        return projectCode;
    }

    public Long getInvoiceRequestPacketId() {
        return invoiceRequestPacketId;
    }

    public void setInvoiceRequestPacketId(Long invoiceRequestPacketId) {
        this.invoiceRequestPacketId = invoiceRequestPacketId;
    }

    public void setProjectCode(String projectCode) {
        this.projectCode = projectCode;
    }

     public Long getActRequestId() {
        return actRequestId;
    }

    public void setActRequestId(Long actRequestId) {
        this.actRequestId = actRequestId;
    }

    public Boolean getIsCancelled() {
        return isCancelled;
    }

    public void setIsCancelled(Boolean isCancelled) {
        this.isCancelled = isCancelled;
    }

    public String getReference() {
        return reference;
    }

    public void setReference(String reference) {
        this.reference = reference;
    }

    public Date getModifiedAt() {
        return modifiedAt;
    }

    public void setModifiedAt(Date modifiedAt) {
        this.modifiedAt = modifiedAt;
    }
}
