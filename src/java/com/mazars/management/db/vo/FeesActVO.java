package com.mazars.management.db.vo;
import com.mazars.management.db.domain.*;
import java.math.BigDecimal;
import java.util.Calendar;

public class FeesActVO {
    private Long id;
    private BigDecimal amount;
    private BigDecimal cvAmount;
    private Calendar date;
    private String reference;
    private Boolean isSigned;

    public FeesActVO() {}

    public FeesActVO(FeesAct feesAct) {
        this.id = feesAct.getId();
        this.amount = feesAct.getAmount();
        this.cvAmount = feesAct.getCvAmount();
        this.date = feesAct.getDate();
        this.reference = feesAct.getReference();
        this.isSigned = feesAct.getIsSigned();
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

    public String getReference() {
        return reference;
    }

    public void setReference(String reference) {
        this.reference = reference;
    }

    public Boolean getIsSigned() {
        return isSigned;
    }

    public void setIsSigned(Boolean isSigned) {
        this.isSigned = isSigned;
    }

 
}
