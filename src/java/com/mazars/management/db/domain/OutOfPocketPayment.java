package com.mazars.management.db.domain;
import com.mazars.management.db.util.HibernateUtil;
import java.math.BigDecimal;
import org.hibernate.Session;
import java.util.List;
import java.util.Set;
import java.util.HashSet;
import java.util.Calendar;

public class OutOfPocketPayment {
    private Long id;
    private String invoiceReference;
    private BigDecimal amount;
    private BigDecimal cvAmount;
    private Calendar date;
    private String reference;
    private String stamp;

    private OutOfPocketItem outOfPocketItem;
    public OutOfPocketPayment() {}

    public String getInvoiceReference() {
        return invoiceReference;
    }

    public void setInvoiceReference(String invoiceReference) {
        this.invoiceReference = invoiceReference;
    }

    public String getStamp() {
        return stamp;
    }

    public void setStamp(String stamp) {
        this.stamp = stamp;
    }

    public String getReference() {
        return reference;
    }

    public void setReference(String reference) {
        this.reference = reference;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
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

    public OutOfPocketItem getOutOfPocketItem() {
        return outOfPocketItem;
    }

    public void setOutOfPocketItem(OutOfPocketItem outOfPocketItem) {
        this.outOfPocketItem = outOfPocketItem;
    }

}
