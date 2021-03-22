/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.web.forms;
import com.google.gson.Gson;
import com.mazars.management.db.domain.OutOfPocketItem;
import com.mazars.management.db.domain.OutOfPocketItem.Type;
import com.mazars.management.db.vo.YearMonthDate;
import java.math.BigDecimal;

/**
 *
 * @author glazov
 */
public class OutOfPocketItemEditForm {   
    public enum Mode {
        CREATE,
        UPDATE
    }
    private OutOfPocketItemEditForm.Mode mode;
    private Long id;
    private YearMonthDate date;
    private Long projectCodeId;
    
    private Long currencyId;
    
    private Long outOfPocketInvoiceCurrencyId;
    private Long outOfPocketPaymentCurrencyId;
    private Long outOfPocketActCurrencyId;

    private OutOfPocketItem.Type type;
    private BigDecimal amount;

    public OutOfPocketItemEditForm() {
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

    public YearMonthDate getDate() {
        return date;
    }

    public void setDate(YearMonthDate date) {
        this.date = date;
    }

    public Long getOutOfPocketActCurrencyId() {
        return outOfPocketActCurrencyId;
    }

    public void setOutOfPocketActCurrencyId(Long outOfPocketActCurrencyId) {
        this.outOfPocketActCurrencyId = outOfPocketActCurrencyId;
    }

    public Long getProjectCodeId() {
        return projectCodeId;
    }

    public void setProjectCodeId(Long projectCodeId) {
        this.projectCodeId = projectCodeId;
    }

    public Type getType() {
        return type;
    }

    public void setType(Type type) {
        this.type = type;
    }

    public Long getOutOfPocketInvoiceCurrencyId() {
        return outOfPocketInvoiceCurrencyId;
    }

    public void setOutOfPocketInvoiceCurrencyId(Long outOfPocketInvoiceCurrencyId) {
        this.outOfPocketInvoiceCurrencyId = outOfPocketInvoiceCurrencyId;
    }

    public Long getOutOfPocketPaymentCurrencyId() {
        return outOfPocketPaymentCurrencyId;
    }

    public void setOutOfPocketPaymentCurrencyId(Long outOfPocketPaymentCurrencyId) {
        this.outOfPocketPaymentCurrencyId = outOfPocketPaymentCurrencyId;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public Long getCurrencyId() {
        return currencyId;
    }

    public void setCurrencyId(Long currencyId) {
        this.currencyId = currencyId;
    }
    
    public static OutOfPocketItemEditForm getFromJson(String json) {
        Gson gson = new Gson();
        return gson.fromJson(json, OutOfPocketItemEditForm.class);
    }
}
