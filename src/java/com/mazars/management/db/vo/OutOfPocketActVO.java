package com.mazars.management.db.vo;
import com.mazars.management.db.domain.*;
import java.math.BigDecimal;
import java.util.Calendar;

public class OutOfPocketActVO {
    private Long id;
    private BigDecimal amount;
    private BigDecimal cvAmount;
    private Calendar date;
    private String reference;
    private Boolean isSigned;

    public OutOfPocketActVO() {}

    public OutOfPocketActVO(OutOfPocketAct outOfPocketAct) {
        this.id = outOfPocketAct.getId();
        this.amount = outOfPocketAct.getAmount();
        this.cvAmount = outOfPocketAct.getCvAmount();
        this.date = outOfPocketAct.getDate();
        this.reference = outOfPocketAct.getReference();
        this.isSigned = outOfPocketAct.getIsSigned();
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

 
}
