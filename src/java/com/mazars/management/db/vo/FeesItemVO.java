/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.db.vo;
import com.mazars.management.db.domain.*;
import com.mazars.management.db.domain.FeesItem.Type;
import java.math.BigDecimal;
import java.util.Calendar;
/**
 *
 * @author glazov
 */
public class FeesItemVO {
    private Long id;
    private Calendar date;
    private FeesItem.Type type;

    private BigDecimal quotationCurrencyRate;
    private BigDecimal quotationNegociated;

    private BigDecimal vat;
    private String comment;

    public FeesItemVO() {
    }

    public FeesItemVO(FeesItem feesItem) {
        this.id = feesItem.getId();
        this.date = feesItem.getDate();
        this.type = feesItem.getType();
        this.quotationCurrencyRate = feesItem.getQuotationCurrencyRate();
        this.quotationNegociated = feesItem.getQuotationNegociated();
        this.vat = feesItem.getVat();
        this.comment = feesItem.getComment();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Calendar getDate() {
        return date;
    }

    public void setDate(Calendar date) {
        this.date = date;
    }

    public Type getType() {
        return type;
    }

    public void setType(Type type) {
        this.type = type;
    }

    public BigDecimal getQuotationCurrencyRate() {
        return quotationCurrencyRate;
    }

    public void setQuotationCurrencyRate(BigDecimal quotationCurrencyRate) {
        this.quotationCurrencyRate = quotationCurrencyRate;
    }

    public BigDecimal getQuotationNegociated() {
        return quotationNegociated;
    }

    public void setQuotationNegociated(BigDecimal quotationNegociated) {
        this.quotationNegociated = quotationNegociated;
    }

    public BigDecimal getVat() {
        return vat;
    }

    public void setVat(BigDecimal feesVat) {
        this.vat = feesVat;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }
}
