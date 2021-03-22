/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.web.forms;
import com.google.gson.Gson;
import com.mazars.management.db.domain.ActRequest;
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
public class ActRequestEditForm {
    public enum Mode {
        CREATE,
        UPDATE
    }
    public static class ActRequestItem {
        private String name;
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
    private ActRequestEditForm.Mode mode;
    private Long id;
    private Long invoiceRequestPacketId;
    private Long clientId;
    private String description;
    private YearMonthDate date;
    private Long invoiceCurrencyId;
    private Long paymentCurrencyId;
    private InvoiceRequestPacket.Status status;
    private Boolean isCancelled;
    private Boolean createTaxInvoiceRequest;
    private List<Long> invoiceRequestIds = new LinkedList<Long>();
    private List<ActRequestItem> actRequestItems = new LinkedList<ActRequestItem>();

    public ActRequestEditForm() {
    }

    public Mode getMode() {
        return mode;
    }

    public void setMode(Mode mode) {
        this.mode = mode;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getInvoiceRequestPacketId() {
        return invoiceRequestPacketId;
    }

    public void setInvoiceRequestPacketId(Long invoiceRequestPacketId) {
        this.invoiceRequestPacketId = invoiceRequestPacketId;
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

    public InvoiceRequestPacket.Status getStatus() {
        return status;
    }

    public void setStatus(InvoiceRequestPacket.Status status) {
        this.status = status;
    }

    public Boolean getCreateTaxInvoiceRequest() {
        return createTaxInvoiceRequest;
    }

    public void setCreateTaxInvoiceRequest(Boolean createTaxInvoiceRequest) {
        this.createTaxInvoiceRequest = createTaxInvoiceRequest;
    }

    public List<ActRequestItem> getActRequestItems() {
        return actRequestItems;
    }

    public void setActRequestItems(List<ActRequestItem> actRequestItems) {
        this.actRequestItems = actRequestItems;
    }

    public List<Long> getInvoiceRequestIds() {
        return invoiceRequestIds;
    }

    public void setInvoiceRequestIds(List<Long> invoiceRequestIds) {
        this.invoiceRequestIds = invoiceRequestIds;
    }

    public Boolean getIsCancelled() {
        return isCancelled;
    }

    public void setIsCancelled(Boolean isCancelled) {
        this.isCancelled = isCancelled;
    }

    public static ActRequestEditForm getFromJson(String json) {
        Gson gson = new Gson();
        return gson.fromJson(json, ActRequestEditForm.class);
    }
    public void normalize() {
        description = StringUtils.stripNonValidXMLCharacters(description);
        for(ActRequestEditForm.ActRequestItem actRequestItem : actRequestItems) {
            actRequestItem.name = StringUtils.stripNonValidXMLCharacters(actRequestItem.name);
        }
    }    
}
