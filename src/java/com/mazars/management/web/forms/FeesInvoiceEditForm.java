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
public class FeesInvoiceEditForm {
    public enum Mode {
        CREATE,
        UPDATE
    }
    private FeesInvoiceEditForm.Mode mode;
    private Long id;
    private Long feesItemId;
    private BigDecimal amount;
    private BigDecimal vatIncludedAmount;
    private YearMonthDate date;
    private String reference;
    private Boolean isAdvance;
    private Boolean isCancelled;

    public FeesInvoiceEditForm() {
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

    public Long getFeesItemId() {
        return feesItemId;
    }

    public void setFeesItemId(Long feesItemId) {
        this.feesItemId = feesItemId;
    }

    public YearMonthDate getDate() {
        return date;
    }

    public void setDate(YearMonthDate date) {
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

    public Mode getMode() {
        return mode;
    }

    public void setMode(Mode mode) {
        this.mode = mode;
    }

    public String getReference() {
        return reference;
    }

    public void setReference(String reference) {
        this.reference = reference;
    }

    public Boolean getIsCancelled() {
        return isCancelled;
    }

    public void setIsCancelled(Boolean isCancelled) {
        this.isCancelled = isCancelled;
    }

    public static FeesInvoiceEditForm getFromJson(String json) {
        Gson gson = new Gson();
        return gson.fromJson(json, FeesInvoiceEditForm.class);
    }
}
