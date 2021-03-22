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
@XmlRootElement(name="invoiceRequest", namespace = "http://services.webservices.management.mazars.com/")
@XmlAccessorType(XmlAccessType.FIELD)
public class InvoiceRequestVO {
    @XmlRootElement(name="invoiceRequestItem", namespace = "http://services.webservices.management.mazars.com/")
    @XmlAccessorType(XmlAccessType.FIELD)
    public static class InvoiceRequestItem {
        @XmlElement(name="name", namespace = "http://services.webservices.management.mazars.com/")
        private String name;
        @XmlElement(name="amount", namespace = "http://services.webservices.management.mazars.com/")
        private BigDecimal amount;

        public InvoiceRequestItem() {
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public BigDecimal getAmount() {
            return amount;
        }

        public void setAmount(BigDecimal amount) {
            this.amount = amount;
        }
        
    }
    @XmlElement(name="id", namespace = "http://services.webservices.management.mazars.com/")
    private Long id;
    @XmlElement(name="projectCode", namespace = "http://services.webservices.management.mazars.com/")
    private String projectCode;
    @XmlElement(name="invoiceRequestPacketId", namespace = "http://services.webservices.management.mazars.com/")
    private Long invoiceRequestPacketId;   
    @XmlElement(name="clientId", namespace = "http://services.webservices.management.mazars.com/")
    private Long clientId;
    @XmlElement(name="clientName", namespace = "http://services.webservices.management.mazars.com/")
    private String clientName;
    @XmlElement(name="description", namespace = "http://services.webservices.management.mazars.com/")
    private String description;
    @XmlElement(name="date", namespace = "http://services.webservices.management.mazars.com/")
    private Calendar date;
    @XmlElement(name="modifiedAt", namespace = "http://services.webservices.management.mazars.com/")
    private Date modifiedAt;
    @XmlElement(name="invoiceCurrency", namespace = "http://services.webservices.management.mazars.com/")
    private String invoiceCurrency;
    @XmlElement(name="paymentCurrency", namespace = "http://services.webservices.management.mazars.com/")
    private String paymentCurrency;
    @XmlElement(name="invoiceRequestItems", namespace = "http://services.webservices.management.mazars.com/")
    private List<InvoiceRequestVO.InvoiceRequestItem> invoiceRequestItems = new LinkedList<InvoiceRequestVO.InvoiceRequestItem>();
    @XmlElement(name="status", namespace = "http://services.webservices.management.mazars.com/")
    private InvoiceRequestPacket.Status status;
    @XmlElement(name="actRequestId", namespace = "http://services.webservices.management.mazars.com/")
    private Long actRequestId;
    @XmlElement(name="isCancelled", namespace = "http://services.webservices.management.mazars.com/")
    private Boolean isCancelled;
    @XmlElement(name="withVAT", namespace = "http://services.webservices.management.mazars.com/")
    private Boolean withVAT;
    @XmlElement(name="reference", namespace = "http://services.webservices.management.mazars.com/")
    private String reference;
    
    public InvoiceRequestVO() {
    }

    public InvoiceRequestVO(com.mazars.management.db.domain.InvoiceRequest invoiceRequest) {
        this.id = invoiceRequest.getId();
        this.projectCode = invoiceRequest.getInvoiceRequestPacket().getProjectCode().getCode();
        this.invoiceRequestPacketId = invoiceRequest.getInvoiceRequestPacket().getId();
        this.clientId = invoiceRequest.getClient().getId();
        this.clientName = invoiceRequest.getClient().getName();
        this.description = invoiceRequest.getDescription();
        this.date = invoiceRequest.getDate();
        this.modifiedAt = invoiceRequest.getInvoiceRequestPacket().getModifiedAt();
        this.invoiceCurrency = invoiceRequest.getInvoiceCurrency().getCode();
        this.paymentCurrency = invoiceRequest.getPaymentCurrency().getCode();
        this.status = invoiceRequest.getInvoiceRequestPacket().getStatus();
        for(com.mazars.management.db.domain.InvoiceRequestItem invoiceRequestItem : invoiceRequest.getInvoiceRequestItems()) {
            InvoiceRequestVO.InvoiceRequestItem invoiceRequestItem1 = new InvoiceRequestVO.InvoiceRequestItem();
            invoiceRequestItem1.setName(invoiceRequestItem.getName());
            invoiceRequestItem1.setAmount(invoiceRequestItem.getAmount());
            this.getInvoiceRequestItems().add(invoiceRequestItem1);
        }
        if(invoiceRequest.getInvoiceRequestPacket().getActRequest() != null) {
            this.actRequestId = invoiceRequest.getInvoiceRequestPacket().getActRequest().getId();
        }
        this.isCancelled = invoiceRequest.getIsCancelled();
        this.withVAT = invoiceRequest.getInvoiceRequestPacket().getWithVAT();
        this.reference = invoiceRequest.getReference();
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

    public Long getInvoiceRequestPacketId() {
        return invoiceRequestPacketId;
    }

    public void setInvoiceRequestPacketId(Long invoiceRequestPacketId) {
        this.invoiceRequestPacketId = invoiceRequestPacketId;
    }

    public String getClientName() {
        return clientName;
    }

    public void setClientName(String clientName) {
        this.clientName = clientName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Calendar getDate() {
        return date;
    }

    public void setDate(Calendar date) {
        this.date = date;
    }

    public String getInvoiceCurrency() {
        return invoiceCurrency;
    }

    public void setInvoiceCurrency(String invoiceCurrency) {
        this.invoiceCurrency = invoiceCurrency;
    }

    public String getPaymentCurrency() {
        return paymentCurrency;
    }

    public void setPaymentCurrency(String paymentCurrency) {
        this.paymentCurrency = paymentCurrency;
    }

    public List<InvoiceRequestItem> getInvoiceRequestItems() {
        return invoiceRequestItems;
    }

    public void setInvoiceRequestItems(List<InvoiceRequestItem> invoiceRequestItems) {
        this.invoiceRequestItems = invoiceRequestItems;
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

    public Long getClientId() {
        return clientId;
    }

    public void setClientId(Long clientId) {
        this.clientId = clientId;
    }

    public Date getModifiedAt() {
        return modifiedAt;
    }

    public void setModifiedAt(Date modifiedAt) {
        this.modifiedAt = modifiedAt;
    }
}
