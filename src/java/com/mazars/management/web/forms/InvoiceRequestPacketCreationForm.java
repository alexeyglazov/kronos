/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.web.forms;
import com.google.gson.Gson;
import com.mazars.management.db.domain.InvoiceRequest;
import com.mazars.management.db.domain.InvoiceRequestPacket;
import com.mazars.management.db.domain.InvoiceRequestPacket.Status;
import com.mazars.management.db.vo.YearMonthDate;
import com.mazars.management.service.StringUtils;
import java.math.BigDecimal;
import java.util.LinkedList;
import java.util.List;

/**
 *
 * @author glazov
 */
public class InvoiceRequestPacketCreationForm {
    public static class InvoiceRequestItem {
        private String name;
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
    private Long id;
    private Long projectCodeId;
    private Long clientId;
    private String description;
    private YearMonthDate date;
    private Long invoiceCurrencyId;
    private Long paymentCurrencyId;
    private InvoiceRequestPacket.Status status;
    private Boolean withVAT;
    private String comment;
    private Boolean createActRequest;
    private Boolean createTaxInvoiceRequest;
    private List<InvoiceRequestItem> invoiceRequestItems = new LinkedList<InvoiceRequestItem>();

    public InvoiceRequestPacketCreationForm() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getProjectCodeId() {
        return projectCodeId;
    }

    public void setProjectCodeId(Long projectCodeId) {
        this.projectCodeId = projectCodeId;
    }

    public Long getClientId() {
        return clientId;
    }

    public void setClientId(Long clientId) {
        this.clientId = clientId;
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

    public Long getPaymentCurrencyId() {
        return paymentCurrencyId;
    }

    public void setPaymentCurrencyId(Long paymentCurrencyId) {
        this.paymentCurrencyId = paymentCurrencyId;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public Boolean getCreateActRequest() {
        return createActRequest;
    }

    public void setCreateActRequest(Boolean createActRequest) {
        this.createActRequest = createActRequest;
    }

    public Boolean getCreateTaxInvoiceRequest() {
        return createTaxInvoiceRequest;
    }

    public void setCreateTaxInvoiceRequest(Boolean createTaxInvoiceRequest) {
        this.createTaxInvoiceRequest = createTaxInvoiceRequest;
    }

    public List<InvoiceRequestItem> getInvoiceRequestItems() {
        return invoiceRequestItems;
    }

    public void setInvoiceRequestItems(List<InvoiceRequestItem> invoiceRequestItems) {
        this.invoiceRequestItems = invoiceRequestItems;
    }

    public Boolean getWithVAT() {
        return withVAT;
    }

    public void setWithVAT(Boolean withVAT) {
        this.withVAT = withVAT;
    }

    public static InvoiceRequestPacketCreationForm getFromJson(String json) {
        Gson gson = new Gson();
        return gson.fromJson(json, InvoiceRequestPacketCreationForm.class);
    }
    public void normalize() {
        description = StringUtils.stripNonValidXMLCharacters(description);
        for(InvoiceRequestPacketCreationForm.InvoiceRequestItem invoiceRequestItem : invoiceRequestItems) {
            invoiceRequestItem.name = StringUtils.stripNonValidXMLCharacters(invoiceRequestItem.name);
        }
    }    
}
