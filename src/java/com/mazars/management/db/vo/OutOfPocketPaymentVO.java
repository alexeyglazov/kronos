package com.mazars.management.db.vo;
import com.mazars.management.db.domain.*;
import java.math.BigDecimal;
import java.util.Calendar;

public class OutOfPocketPaymentVO {
    private Long id;
    private String invoiceReference;
    private BigDecimal amount;
    private BigDecimal cvAmount;
    private String reference;
    private Calendar date;

    public OutOfPocketPaymentVO() {}

    public OutOfPocketPaymentVO(OutOfPocketPayment outOfPocketPayment) {
        this.id = outOfPocketPayment.getId();
        this.invoiceReference = outOfPocketPayment.getInvoiceReference();
        this.amount = outOfPocketPayment.getAmount();
        this.cvAmount = outOfPocketPayment.getCvAmount();
        this.reference = outOfPocketPayment.getReference();
        this.date = outOfPocketPayment.getDate();
    }

    public String getInvoiceReference() {
        return invoiceReference;
    }

    public void setInvoiceReference(String invoiceReference) {
        this.invoiceReference = invoiceReference;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getReference() {
        return reference;
    }

    public void setReference(String reference) {
        this.reference = reference;
    }

    public BigDecimal getCvAmount() {
        return cvAmount;
    }

    public void setCvAmount(BigDecimal cvAmount) {
        this.cvAmount = cvAmount;
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

 
}
