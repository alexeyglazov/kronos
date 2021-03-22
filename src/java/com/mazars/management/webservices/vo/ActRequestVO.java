/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mazars.management.webservices.vo;

import com.mazars.management.db.domain.ActRequest;
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
@XmlRootElement(name="actRequest", namespace = "http://services.webservices.management.mazars.com/")
@XmlAccessorType(XmlAccessType.FIELD)
public class ActRequestVO {
    @XmlRootElement(name="actRequestItem", namespace = "http://services.webservices.management.mazars.com/")
    @XmlAccessorType(XmlAccessType.FIELD)
    public static class ActRequestItem {
        @XmlElement(name="name", namespace = "http://services.webservices.management.mazars.com/")
        private String name;
        @XmlElement(name="amount", namespace = "http://services.webservices.management.mazars.com/")
        private BigDecimal amount;

        public ActRequestItem() {
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
    @XmlElement(name="actRequestItems", namespace = "http://services.webservices.management.mazars.com/")
    private List<ActRequestVO.ActRequestItem> actRequestItems = new LinkedList<ActRequestVO.ActRequestItem>();
    @XmlElement(name="status", namespace = "http://services.webservices.management.mazars.com/")
    private InvoiceRequestPacket.Status status;
    @XmlElement(name="invoiceRequestIds", namespace = "http://services.webservices.management.mazars.com/")
    private List<Long> invoiceRequestIds = new LinkedList<Long>();
    @XmlElement(name="taxInvoiceId", namespace = "http://services.webservices.management.mazars.com/")
    private Long taxInvoiceRequestId = null;
    @XmlElement(name="isCancelled", namespace = "http://services.webservices.management.mazars.com/")
    private Boolean isCancelled;
    @XmlElement(name="withVAT", namespace = "http://services.webservices.management.mazars.com/")
    private Boolean withVAT;
    @XmlElement(name="reference", namespace = "http://services.webservices.management.mazars.com/")
    private String reference;
    
    public ActRequestVO() {
    }

    public ActRequestVO(com.mazars.management.db.domain.ActRequest actRequest) {
        this.id = actRequest.getId();
        this.projectCode = actRequest.getInvoiceRequestPacket().getProjectCode().getCode();
        this.invoiceRequestPacketId = actRequest.getInvoiceRequestPacket().getId();
        this.clientId = actRequest.getClient().getId();
        this.clientName = actRequest.getClient().getName();
        this.description = actRequest.getDescription();
        this.date = actRequest.getDate();
        this.modifiedAt = actRequest.getInvoiceRequestPacket().getModifiedAt();
        this.invoiceCurrency = actRequest.getInvoiceCurrency().getCode();
        this.paymentCurrency = actRequest.getPaymentCurrency().getCode();
        this.status = actRequest.getInvoiceRequestPacket().getStatus();
        for(com.mazars.management.db.domain.ActRequestItem actRequestItem : actRequest.getActRequestItems()) {
            ActRequestVO.ActRequestItem actRequestItem1 = new ActRequestVO.ActRequestItem();
            actRequestItem1.setName(actRequestItem.getName());
            actRequestItem1.setAmount(actRequestItem.getAmount());
            this.getActRequestItems().add(actRequestItem1);
        }
        if(actRequest.getInvoiceRequestPacket().getInvoiceRequests() != null) {
            for(InvoiceRequest invoiceRequest : actRequest.getInvoiceRequestPacket().getInvoiceRequests()) {
                this.invoiceRequestIds.add(invoiceRequest.getId());
            }
        }
        if(actRequest.getInvoiceRequestPacket().getTaxInvoiceRequest() != null) {
            this.taxInvoiceRequestId = actRequest.getInvoiceRequestPacket().getTaxInvoiceRequest().getId();
        }
        this.isCancelled = actRequest.getIsCancelled();
        this.withVAT = actRequest.getInvoiceRequestPacket().getWithVAT();
        this.reference = actRequest.getReference();
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

    public List<ActRequestItem> getActRequestItems() {
        return actRequestItems;
    }

    public void setActRequestItems(List<ActRequestItem> actRequestItems) {
        this.actRequestItems = actRequestItems;
    }

    public InvoiceRequestPacket.Status getStatus() {
        return status;
    }

    public void setStatus(InvoiceRequestPacket.Status status) {
        this.status = status;
    }

    public List<Long> getInvoiceRequestIds() {
        return invoiceRequestIds;
    }

    public void setInvoiceRequestIds(List<Long> invoiceRequestIds) {
        this.invoiceRequestIds = invoiceRequestIds;
    }

    public Long getTaxInvoiceRequestId() {
        return taxInvoiceRequestId;
    }

    public void setTaxInvoiceRequestId(Long taxInvoiceRequestId) {
        this.taxInvoiceRequestId = taxInvoiceRequestId;
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

    public Boolean isWithVAT() {
        return withVAT;
    }

    public void setWithVAT(Boolean withVAT) {
        this.withVAT = withVAT;
    }
}
