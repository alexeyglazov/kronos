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
public class FeesPaymentEditForm {
    public enum Mode {
        CREATE,
        UPDATE
    }
    private FeesPaymentEditForm.Mode mode;
    private Long id;
    private String invoiceReference;
    private Long feesItemId;
    private BigDecimal amount;
    private BigDecimal cvAmount;
    private YearMonthDate date;
    private String reference;

    public FeesPaymentEditForm() {
    }

    public Mode getMode() {
        return mode;
    }

    public void setMode(Mode mode) {
        this.mode = mode;
    }

    public String getInvoiceReference() {
        return invoiceReference;
    }

    public void setInvoiceReference(String invoiceReference) {
        this.invoiceReference = invoiceReference;
    }

    public String getReference() {
        return reference;
    }

    public void setReference(String reference) {
        this.reference = reference;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

 
    public static FeesPaymentEditForm getFromJson(String json) {
        Gson gson = new Gson();
        return gson.fromJson(json, FeesPaymentEditForm.class);
    }

}
