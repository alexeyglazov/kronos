package com.mazars.management.db.domain;
import com.mazars.management.db.util.HibernateUtil;
import java.math.BigDecimal;
import org.hibernate.Session;
import java.util.List;
import java.util.Set;
import java.util.HashSet;
import java.util.Calendar;

public class FeesInvoice {
    private Long id;
    private BigDecimal amount;
    private BigDecimal vatIncludedAmount;   
    private Calendar date;
    private String reference;
    private Boolean isAdvance;
    private String stamp;

    private FeesItem feesItem;

    public FeesInvoice() {}

    public String getStamp() {
        return stamp;
    }

    public void setStamp(String stamp) {
        this.stamp = stamp;
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

    public FeesItem getFeesItem() {
        return feesItem;
    }

    public void setFeesItem(FeesItem feesItem) {
        this.feesItem = feesItem;
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
