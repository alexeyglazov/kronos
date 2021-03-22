package com.mazars.management.db.vo;
import com.mazars.management.db.domain.*;
import java.math.BigDecimal;
import java.util.Calendar;


public class FeesInvoiceVO {
    private Long id;
    private BigDecimal amount;
    private BigDecimal vatIncludedAmount;
    private Calendar date;
    private String reference;
    private Boolean isAdvance;

    public FeesInvoiceVO() {}

    public FeesInvoiceVO(FeesInvoice feesInvoice) {
        this.id = feesInvoice.getId();
        this.amount = feesInvoice.getAmount();
        this.vatIncludedAmount = feesInvoice.getVatIncludedAmount();
        this.date = feesInvoice.getDate();
        this.reference = feesInvoice.getReference();
        this.isAdvance = feesInvoice.getIsAdvance();
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public BigDecimal getVatIncludedAmount() {
        return vatIncludedAmount;
    }

    public void setVatIncludedAmount(BigDecimal vatIncludedAmount) {
        this.vatIncludedAmount = vatIncludedAmount;
    }

    public Calendar getDate() {
        return date;
    }

    public void setDate(Calendar date) {
        this.date = date;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Boolean getIsAdvance() {
        return isAdvance;
    }

    public void setIsAdvance(Boolean isAdvance) {
        this.isAdvance = isAdvance;
    }

    public String getReference() {
        return reference;
    }

    public void setReference(String reference) {
        this.reference = reference;
    }
}
