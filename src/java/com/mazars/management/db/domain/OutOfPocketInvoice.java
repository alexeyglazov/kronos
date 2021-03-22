package com.mazars.management.db.domain;
import com.mazars.management.db.util.HibernateUtil;
import java.math.BigDecimal;
import org.hibernate.Session;
import java.util.List;
import java.util.Set;
import java.util.HashSet;
import java.util.Calendar;

public class OutOfPocketInvoice {
    private Long id;
    private BigDecimal amount;
    private BigDecimal vatIncludedAmount;
    private Calendar date;
    private String reference;
    private String stamp;

    private OutOfPocketItem outOfPocketItem;

    public OutOfPocketInvoice() {}

    public String getStamp() {
        return stamp;
    }

    public void setStamp(String stamp) {
        this.stamp = stamp;
    }

    public BigDecimal getVatIncludedAmount() {
        return vatIncludedAmount;
    }

    public void setVatIncludedAmount(BigDecimal vatIncludedAmount) {
        this.vatIncludedAmount = vatIncludedAmount;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
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

    public OutOfPocketItem getOutOfPocketItem() {
        return outOfPocketItem;
    }

    public void setOutOfPocketItem(OutOfPocketItem outOfPocketItem) {
        this.outOfPocketItem = outOfPocketItem;
    }
}
