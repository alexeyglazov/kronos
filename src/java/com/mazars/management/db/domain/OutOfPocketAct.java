package com.mazars.management.db.domain;
import com.mazars.management.db.util.HibernateUtil;
import java.math.BigDecimal;
import org.hibernate.Session;
import java.util.List;
import java.util.Set;
import java.util.HashSet;
import java.util.Calendar;

public class OutOfPocketAct {
    private Long id;
    private BigDecimal amount;
    private BigDecimal cvAmount;
    private Calendar date;
    private Boolean isSigned;
    private String reference;
    private String stamp;
    
    private OutOfPocketItem outOfPocketItem;
    public OutOfPocketAct() {}

    public String getStamp() {
        return stamp;
    }

    public void setStamp(String stamp) {
        this.stamp = stamp;
    }

    public Boolean getIsSigned() {
        return isSigned;
    }

    public void setIsSigned(Boolean isSigned) {
        this.isSigned = isSigned;
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
