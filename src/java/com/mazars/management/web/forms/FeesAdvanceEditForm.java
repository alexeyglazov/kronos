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
 * @author Glazov
 */
public class FeesAdvanceEditForm {
    public enum Mode {
        CREATE,
        UPDATE
    }
    private FeesAdvanceEditForm.Mode mode;
    private Long id;
    private Long feesItemId;
    private BigDecimal amount;
    private Boolean isAdvance;
    private YearMonthDate date;

    public FeesAdvanceEditForm() {
    }

    public FeesAdvanceEditForm.Mode getMode() {
        return mode;
    }

    public void setMode(FeesAdvanceEditForm.Mode mode) {
        this.mode = mode;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public Boolean getIsAdvance() {
        return isAdvance;
    }

    public void setIsAdvance(Boolean isAdvance) {
        this.isAdvance = isAdvance;
    }

    public YearMonthDate getDate() {
        return date;
    }

    public void setDate(YearMonthDate date) {
        this.date = date;
    }

    public Long getFeesItemId() {
        return feesItemId;
    }

    public void setFeesItemId(Long feesItemId) {
        this.feesItemId = feesItemId;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
    public static FeesAdvanceEditForm getFromJson(String json) {
        Gson gson = new Gson();
        return gson.fromJson(json, FeesAdvanceEditForm.class);
    }
}
