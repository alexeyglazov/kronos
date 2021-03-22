/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mazars.management.web.vo;

import com.mazars.management.db.domain.InvoiceRequest;
import com.mazars.management.db.domain.InvoiceRequestPacket.Status;
import com.mazars.management.db.domain.InvoiceRequestItem;
import com.mazars.management.db.vo.YearMonthDate;
import java.math.BigDecimal;
import java.util.LinkedList;
import java.util.List;

/**
 *
 * @author glazov
 */
public class InvoiceRequestWithItemsVO {
    public class InvoiceRequestItemVO {
        private Long id;
        private String name;
        private BigDecimal amount;

        public InvoiceRequestItemVO() {
        }

        public InvoiceRequestItemVO(InvoiceRequestItem invoiceRequestItem) {
            this.id = invoiceRequestItem.getId();
            this.name = invoiceRequestItem.getName();
            this.amount = invoiceRequestItem.getAmount();
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
    private List<InvoiceRequestItemVO> invoiceRequestItems = new LinkedList<InvoiceRequestItemVO>();
    private Long invoiceRequestPacketId;

    public InvoiceRequestWithItemsVO() {
    }

    public InvoiceRequestWithItemsVO(InvoiceRequest invoiceRequest) {
        this.id = invoiceRequest.getId();
        if(invoiceRequest.getClient() != null) {
            this.clientId = invoiceRequest.getClient().getId();
            this.clientName = invoiceRequest.getClient().getName();
        }
        this.description = invoiceRequest.getDescription();
        if(invoiceRequest.getDate() != null) {
            this.date = new YearMonthDate(invoiceRequest.getDate());
        }
        this.invoiceCurrencyId = invoiceRequest.getInvoiceCurrency().getId();
        this.invoiceCurrencyCode = invoiceRequest.getInvoiceCurrency().getCode();
        this.paymentCurrencyId = invoiceRequest.getPaymentCurrency().getId();
        this.paymentCurrencyCode = invoiceRequest.getPaymentCurrency().getCode();
        this.isCancelled = invoiceRequest.getIsCancelled();
        this.reference = invoiceRequest.getReference();

        for(InvoiceRequestItem invoiceRequestItem : invoiceRequest.getInvoiceRequestItems()) {
            invoiceRequestItems.add(new InvoiceRequestItemVO(invoiceRequestItem));
        }
        this.invoiceRequestPacketId = invoiceRequest.getInvoiceRequestPacket().getId();
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

    public List<InvoiceRequestItemVO> getInvoiceRequestItems() {
        return invoiceRequestItems;
    }

    public void setInvoiceRequestItems(List<InvoiceRequestItemVO> invoiceRequestItems) {
        this.invoiceRequestItems = invoiceRequestItems;
    }

    public Long getInvoiceRequestPacketId() {
        return invoiceRequestPacketId;
    }

    public void setInvoiceRequestPacketId(Long invoiceRequestPacketId) {
        this.invoiceRequestPacketId = invoiceRequestPacketId;
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
