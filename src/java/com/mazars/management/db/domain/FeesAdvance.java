/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.db.domain;
import java.math.BigDecimal;
import java.util.Calendar;

/**
 *
 * @author glazov
 */
public class FeesAdvance {
    private Long id;
    private FeesItem feesItem;
    private BigDecimal amount;
    private Boolean isAdvance;
    private Calendar date;
    private String stamp;

    public String getStamp() {
        return stamp;
    }

    public void setStamp(String stamp) {
        this.stamp = stamp;
    }

    public FeesItem getFeesItem() {
        return feesItem;
    }

    public void setFeesItem(FeesItem feesItem) {
        this.feesItem = feesItem;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public Calendar getDate() {
        return date;
    }

    public void setDate(Calendar date) {
        this.date = date;
    }
}
