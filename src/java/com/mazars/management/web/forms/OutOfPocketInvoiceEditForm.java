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
public class OutOfPocketInvoiceEditForm {
    public enum Mode {
        CREATE,
        UPDATE
    }
    private OutOfPocketInvoiceEditForm.Mode mode;
    private Long id;
    private Long outOfPocketItemId;
    private BigDecimal amount;
    private BigDecimal vatIncludedAmount;
    private YearMonthDate date;
    private String reference;

    public OutOfPocketInvoiceEditForm() {
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

    public Long getOutOfPocketItemId() {
        return outOfPocketItemId;
    }

    public void setOutOfPocketItemId(Long outOfPocketItemId) {
        this.outOfPocketItemId = outOfPocketItemId;
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

    public static OutOfPocketInvoiceEditForm getFromJson(String json) {
        Gson gson = new Gson();
        return gson.fromJson(json, OutOfPocketInvoiceEditForm.class);
    }
}
