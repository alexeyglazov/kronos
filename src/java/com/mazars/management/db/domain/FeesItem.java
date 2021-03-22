/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.db.domain;
import java.math.BigDecimal;
import java.util.Calendar;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

/**
 *
 * @author glazov
 */
public class FeesItem {
    public enum Type {
        FLAT_FEE,
        TIMESPENT,
        QUOTATION
    }
    private Long id;
    private Calendar date;
    private Type type;

    private Currency feesAdvanceCurrency;
    private Currency feesInvoiceCurrency;
    private Currency feesPaymentCurrency;
    private Currency feesActCurrency;

    private Set<PositionQuotation> positionQuotations = new HashSet<PositionQuotation>();
    private BigDecimal quotationCurrencyRate;
    private BigDecimal quotationNegociated;

    private Set<FeesAdvance> feesAdvances = new HashSet<FeesAdvance>();
    private Set<FeesInvoice> feesInvoices = new HashSet<FeesInvoice>();
    private Set<FeesPayment> feesPayments = new HashSet<FeesPayment>();
    private Set<FeesAct> feesActs = new HashSet<FeesAct>();
    
    private BigDecimal vat;
    private String comment;

    private ProjectCode projectCode;

    public Currency getFeesActCurrency() {
        return feesActCurrency;
    }

    public void setFeesActCurrency(Currency feesActCurrency) {
        this.feesActCurrency = feesActCurrency;
    }

    public Set<FeesAct> getFeesActs() {
        return feesActs;
    }

    public void setFeesActs(Set<FeesAct> feesActs) {
        this.feesActs = feesActs;
    }

    public Calendar getDate() {
        return date;
    }

    public Type getType() {
        return type;
    }

    public void setType(Type type) {
        this.type = type;
    }

    public Currency getFeesAdvanceCurrency() {
        return feesAdvanceCurrency;
    }

    public void setFeesAdvanceCurrency(Currency feesAdvanceCurrency) {
        this.feesAdvanceCurrency = feesAdvanceCurrency;
    }

    public Currency getFeesInvoiceCurrency() {
        return feesInvoiceCurrency;
    }

    public void setFeesInvoiceCurrency(Currency feesInvoiceCurrency) {
        this.feesInvoiceCurrency = feesInvoiceCurrency;
    }

    public Currency getFeesPaymentCurrency() {
        return feesPaymentCurrency;
    }

    public void setFeesPaymentCurrency(Currency feesPaymentCurrency) {
        this.feesPaymentCurrency = feesPaymentCurrency;
    }

    public Set<PositionQuotation> getPositionQuotations() {
        return positionQuotations;
    }

    public void setPositionQuotations(Set<PositionQuotation> positionQuotations) {
        this.positionQuotations = positionQuotations;
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

    public void setVat(BigDecimal vat) {
        this.vat = vat;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
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

    public ProjectCode getProjectCode() {
        return projectCode;
    }

    public void setProjectCode(ProjectCode projectCode) {
        this.projectCode = projectCode;
    }

    public Set<FeesAdvance> getFeesAdvances() {
        return feesAdvances;
    }

    public void setFeesAdvances(Set<FeesAdvance> feesAdvances) {
        this.feesAdvances = feesAdvances;
    }

    public Set<FeesInvoice> getFeesInvoices() {
        return feesInvoices;
    }

    public void setFeesInvoices(Set<FeesInvoice> feesInvoices) {
        this.feesInvoices = feesInvoices;
    }

    public Set<FeesPayment> getFeesPayments() {
        return feesPayments;
    }

    public void setFeesPayments(Set<FeesPayment> feesPayments) {
        this.feesPayments = feesPayments;
    }
    public Boolean hasFeesAdvances() {
        if(! this.getFeesAdvances().isEmpty()) {
            return true;
        }
        return false;
    }    
    public Boolean hasFeesInvoices() {
        if(! this.getFeesInvoices().isEmpty()) {
            return true;
        }
        return false;
    }    
    public Boolean hasFeesActs() {
        if(! this.getFeesActs().isEmpty()) {
            return true;
        }
        return false;
    }
    public Boolean hasFeesPayments() {
        if(! this.getFeesPayments().isEmpty()) {
            return true;
        }
        return false;
    }
    public Boolean hasFeesExpenses() {
        if(this.hasFeesActs() || this.hasFeesInvoices() || this.hasFeesPayments() || this.hasFeesAdvances()) {
            return true;
        }
        return false;
    }
    @Override
    public String toString() {
        String result = "";
        result += "FeesItem{";
        result += "id=" + id;
        result += ", date=" + ((date != null) ? date.getTime() : null);
        result += ", type=" + type;
        result += ", feesAdvanceCurrency=" + ((feesAdvanceCurrency != null) ? feesAdvanceCurrency.getCode() : null);
        result += ", feesInvoiceCurrency=" + ((feesInvoiceCurrency != null) ? feesInvoiceCurrency.getCode() : null);
        result += ", feesPaymentCurrency=" + ((feesPaymentCurrency != null) ? feesPaymentCurrency.getCode() : null);
        result += ", feesActCurrency=" + ((feesActCurrency != null) ? feesActCurrency.getCode() : null);
        result += ", positionQuotations=" + ((positionQuotations != null) ? positionQuotations.size() : null);
        result += ", quotationCurrencyRate=" + quotationCurrencyRate;
        result += ", quotationNegociated=" + quotationNegociated;
        result += ", feesAdvances=" + ((feesAdvances != null) ? feesAdvances.size() : null);
        result += ", feesInvoices=" + ((feesInvoices != null) ? feesInvoices.size() : null);
        result += ", feesPayments=" + ((feesPayments != null) ? feesPayments.size() : null);
        result += ", feesActs=" + ((feesActs != null) ? feesActs.size() : null);
        result += ", vat=" + vat;
        result += ", comment=" + comment;
        result += ", projectCode=" + ((projectCode != null) ? projectCode.getCode() : null);
        result += '}';
        
        return result;
    }
    public FeesInvoice getFeesInvoice(String reference) {
        for(FeesInvoice feesInvoice : this.getFeesInvoices()) {
            if(reference.equals(feesInvoice.getReference())) {
                return feesInvoice;
            }
        }
        return null;
    }
    public FeesAct getFeesAct(String reference) {
        for(FeesAct feesAct : this.getFeesActs()) {
            if(reference.equals(feesAct.getReference())) {
                return feesAct;
            }
        }
        return null;
    }

    @Override
    public int hashCode() {
        int hash = 7;
        hash = 79 * hash + Objects.hashCode(this.id);
        return hash;
    }

    @Override
    public boolean equals(Object obj) {
        if (obj == null) {
            return false;
        }
        if (!(obj instanceof FeesItem)) {
            return false;
        }
        final FeesItem other = (FeesItem) obj;
        if (!Objects.equals(this.id, other.id)) {
            return false;
        }
        return true;
    }
}
