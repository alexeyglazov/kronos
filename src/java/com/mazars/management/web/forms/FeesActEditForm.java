/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.web.forms;
import com.google.gson.Gson;
import com.mazars.management.db.vo.YearMonthDate;
import java.math.BigDecimal;

/**
 *
 * @author glazov
 */
public class FeesActEditForm {
    public enum Mode {
        CREATE,
        UPDATE
    }
    private FeesActEditForm.Mode mode;
    private Long id;
    private Long feesItemId;
    private BigDecimal amount;
    private BigDecimal cvAmount;
    private YearMonthDate date;
    private String reference;
    private Boolean isSigned;
    
    public FeesActEditForm() {
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

    public Long getFeesItemId() {
        return feesItemId;
    }

    public void setFeesItemId(Long feesItemId) {
        this.feesItemId = feesItemId;
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

    public YearMonthDate getDate() {
        return date;
    }

    public void setDate(YearMonthDate date) {
        this.date = date;
    }

 
    public static FeesActEditForm getFromJson(String json) {
        Gson gson = new Gson();
        return gson.fromJson(json, FeesActEditForm.class);
    }

}
