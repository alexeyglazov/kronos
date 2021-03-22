package com.mazars.management.db.vo;
import com.mazars.management.db.domain.*;
import java.math.BigDecimal;
import java.util.Calendar;


public class OutOfPocketInvoiceVO {
    private Long id;
    private BigDecimal amount;
    private BigDecimal vatIncludedAmount;
    private Calendar date;
    private String reference;

    public OutOfPocketInvoiceVO() {}

    public OutOfPocketInvoiceVO(OutOfPocketInvoice outOfPocketInvoice) {
        this.id = outOfPocketInvoice.getId();
        this.amount = outOfPocketInvoice.getAmount();
        this.vatIncludedAmount = outOfPocketInvoice.getVatIncludedAmount();
        this.date = outOfPocketInvoice.getDate();
        this.reference = outOfPocketInvoice.getReference();
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

    public String getReference() {
        return reference;
    }

    public void setReference(String reference) {
        this.reference = reference;
    }
}
