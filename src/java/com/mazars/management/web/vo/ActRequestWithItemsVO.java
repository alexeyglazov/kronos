/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mazars.management.web.vo;

import com.mazars.management.db.domain.ActRequest;
import com.mazars.management.db.domain.ActRequestItem;
import com.mazars.management.db.domain.InvoiceRequest;
import com.mazars.management.db.domain.InvoiceRequestPacket;
import com.mazars.management.db.vo.YearMonthDate;
import java.math.BigDecimal;
import java.util.LinkedList;
import java.util.List;

/**
 *
 * @author glazov
 */
public class ActRequestWithItemsVO {
    public class ActRequestItemVO {
        private Long id;
        private String name;
        private BigDecimal amount;

        public ActRequestItemVO() {
        }

        public ActRequestItemVO(ActRequestItem actRequestItem) {
            this.id = actRequestItem.getId();
            this.name = actRequestItem.getName();
            this.amount = actRequestItem.getAmount();
        }

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
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
    
    private Long id;
    private Long clientId;
    private String clientName;
    private String reference;
    private String description;
    private YearMonthDate date;
    private Long invoiceCurrencyId;
    private String invoiceCurrencyCode;
    private Long paymentCurrencyId;
    private String paymentCurrencyCode;
    private Boolean isCancelled;
    private List<ActRequestItemVO> actRequestItems = new LinkedList<ActRequestItemVO>();
    private Long invoiceRequestPacketId;
    
    public ActRequestWithItemsVO() {
    }

    public ActRequestWithItemsVO(ActRequest actRequest) {
        this.id = actRequest.getId();
        if(actRequest.getClient() != null) {
            this.clientId = actRequest.getClient().getId();
            this.clientName = actRequest.getClient().getName();
        }
        this.description = actRequest.getDescription();
        if(actRequest.getDate() != null) {
            this.date = new YearMonthDate(actRequest.getDate());
        }
        this.invoiceCurrencyId = actRequest.getInvoiceCurrency().getId();
        this.invoiceCurrencyCode = actRequest.getInvoiceCurrency().getCode();
        this.paymentCurrencyId = actRequest.getPaymentCurrency().getId();
        this.paymentCurrencyCode = actRequest.getPaymentCurrency().getCode();
        this.isCancelled = actRequest.getIsCancelled();
        this.reference = actRequest.getReference();
        for(ActRequestItem actRequestItem : actRequest.getActRequestItems()) {
            actRequestItems.add(new ActRequestItemVO(actRequestItem));
        }
        invoiceRequestPacketId = actRequest.getInvoiceRequestPacket().getId();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getClientId() {
        return clientId;
    }

    public void setClientId(Long clientId) {
        this.clientId = clientId;
    }

    public String getClientName() {
        return clientName;
    }

    public void setClientName(String clientName) {
        this.clientName = clientName;
    }

    public Long getInvoiceRequestPacketId() {
        return invoiceRequestPacketId;
    }

    public void setInvoiceRequestPacketId(Long invoiceRequestPacketId) {
        this.invoiceRequestPacketId = invoiceRequestPacketId;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public YearMonthDate getDate() {
        return date;
    }

    public void setDate(YearMonthDate date) {
        this.date = date;
    }

    public Long getInvoiceCurrencyId() {
        return invoiceCurrencyId;
    }

    public void setInvoiceCurrencyId(Long invoiceCurrencyId) {
        this.invoiceCurrencyId = invoiceCurrencyId;
    }

    public String getInvoiceCurrencyCode() {
        return invoiceCurrencyCode;
    }

    public void setInvoiceCurrencyCode(String invoiceCurrencyCode) {
        this.invoiceCurrencyCode = invoiceCurrencyCode;
    }

    public Long getPaymentCurrencyId() {
        return paymentCurrencyId;
    }

    public void setPaymentCurrencyId(Long paymentCurrencyId) {
        this.paymentCurrencyId = paymentCurrencyId;
    }

    public String getPaymentCurrencyCode() {
        return paymentCurrencyCode;
    }

    public void setPaymentCurrencyCode(String paymentCurrencyCode) {
        this.paymentCurrencyCode = paymentCurrencyCode;
    }

    public List<ActRequestItemVO> getActRequestItems() {
        return actRequestItems;
    }

    public void setActRequestItems(List<ActRequestItemVO> actRequestItems) {
        this.actRequestItems = actRequestItems;
    }   

    public String getReference() {
        return reference;
    }

    public void setReference(String reference) {
        this.reference = reference;
    }

    public Boolean getIsCancelled() {
        return isCancelled;
    }

    public void setIsCancelled(Boolean isCancelled) {
        this.isCancelled = isCancelled;
    }
}
