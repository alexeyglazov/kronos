/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mazars.management.webservices.vo;

import com.mazars.management.db.domain.InvoiceRequest;
import com.mazars.management.db.domain.InvoiceRequestPacket;
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
@XmlRootElement(name="invoiceRequestPacket", namespace = "http://services.webservices.management.mazars.com/")
@XmlAccessorType(XmlAccessType.FIELD)
public class InvoiceRequestPacketVO {
    @XmlElement(name="id", namespace = "http://services.webservices.management.mazars.com/")
    private Long id;
    @XmlElement(name="projectCode", namespace = "http://services.webservices.management.mazars.com/")
    private String projectCode;
    @XmlElement(name="status", namespace = "http://services.webservices.management.mazars.com/")
    private InvoiceRequestPacket.Status status;
    @XmlElement(name="withVAT", namespace = "http://services.webservices.management.mazars.com/")
    private Boolean withVAT;    
    @XmlElement(name="invoiceRequests", namespace = "http://services.webservices.management.mazars.com/")
    private List<InvoiceRequestVO> invoiceRequests = new LinkedList<InvoiceRequestVO>();
    @XmlElement(name="actRequest", namespace = "http://services.webservices.management.mazars.com/")
    private ActRequestVO actRequest;    
    @XmlElement(name="taxInvoiceRequest", namespace = "http://services.webservices.management.mazars.com/")
    private TaxInvoiceRequestVO taxInvoiceRequest;    

    @XmlElement(name="modifiedAt", namespace = "http://services.webservices.management.mazars.com/")
    private Date modifiedAt;
    
    public InvoiceRequestPacketVO() {
    }

    public InvoiceRequestPacketVO(com.mazars.management.db.domain.InvoiceRequestPacket invoiceRequestPacket) {
        this.id = invoiceRequestPacket.getId();
        this.projectCode = invoiceRequestPacket.getProjectCode().getCode();
        this.modifiedAt = invoiceRequestPacket.getModifiedAt();
        this.status = invoiceRequestPacket.getStatus();
        for(com.mazars.management.db.domain.InvoiceRequest invoiceRequest : invoiceRequestPacket.getInvoiceRequests()) {
            this.invoiceRequests.add(new InvoiceRequestVO(invoiceRequest));
        }
        if(invoiceRequestPacket.getActRequest() != null) {
            this.actRequest = new ActRequestVO(invoiceRequestPacket.getActRequest());
        }
        if(invoiceRequestPacket.getTaxInvoiceRequest() != null) {
            this.taxInvoiceRequest = new TaxInvoiceRequestVO(invoiceRequestPacket.getTaxInvoiceRequest());
        }
        this.withVAT = invoiceRequestPacket.getWithVAT();
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

    public void setProjectCode(String projectCode) {
        this.projectCode = projectCode;
    }

    public InvoiceRequestPacket.Status getStatus() {
        return status;
    }

    public void setStatus(InvoiceRequestPacket.Status status) {
        this.status = status;
    }

    public Boolean isWithVAT() {
        return withVAT;
    }

    public void setWithVAT(Boolean withVAT) {
        this.withVAT = withVAT;
    }

    public Date getModifiedAt() {
        return modifiedAt;
    }

    public void setModifiedAt(Date modifiedAt) {
        this.modifiedAt = modifiedAt;
    }

    public List<InvoiceRequestVO> getInvoiceRequests() {
        return invoiceRequests;
    }

    public void setInvoiceRequests(List<InvoiceRequestVO> invoiceRequests) {
        this.invoiceRequests = invoiceRequests;
    }

    public ActRequestVO getActRequest() {
        return actRequest;
    }

    public void setActRequest(ActRequestVO actRequest) {
        this.actRequest = actRequest;
    }

    public TaxInvoiceRequestVO getTaxInvoiceRequest() {
        return taxInvoiceRequest;
    }

    public void setTaxInvoiceRequest(TaxInvoiceRequestVO taxInvoiceRequest) {
        this.taxInvoiceRequest = taxInvoiceRequest;
    }
    
}
