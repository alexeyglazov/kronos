package com.mazars.management.db.vo;
import com.mazars.management.db.domain.*;
import java.util.HashSet;
import java.util.Set;

public class FeesItemVOH extends FeesItemVO {
    private Long projectCodeId;
    private Long feesAdvanceCurrencyId;
    private Long feesInvoiceCurrencyId;
    private Long feesPaymentCurrencyId;
    private Long feesActCurrencyId;
    private Set<Long> feesAdvanceIds = new HashSet<Long>();
    private Set<Long> feesInvoiceIds = new HashSet<Long>();
    private Set<Long> feesPaymentIds = new HashSet<Long>();
    private Set<Long> feesActIds = new HashSet<Long>();
    private Set<Long> positionQuotationIds = new HashSet<Long>();

    public FeesItemVOH() {}

    public FeesItemVOH(FeesItem feesItem) {
        super(feesItem);
        if(feesItem.getFeesAdvanceCurrency() != null ) {
            feesAdvanceCurrencyId = feesItem.getFeesAdvanceCurrency().getId();
        }
        if(feesItem.getFeesInvoiceCurrency() != null ) {
            feesInvoiceCurrencyId = feesItem.getFeesInvoiceCurrency().getId();
        }
        if(feesItem.getFeesPaymentCurrency() != null ) {
            feesPaymentCurrencyId = feesItem.getFeesPaymentCurrency().getId();
        }
        if(feesItem.getFeesActCurrency() != null ) {
            feesActCurrencyId = feesItem.getFeesActCurrency().getId();
        }
        for(FeesAdvance feesAdvance : feesItem.getFeesAdvances()) {
            feesAdvanceIds.add(feesAdvance.getId());
        }
        for(FeesInvoice feesInvoice : feesItem.getFeesInvoices()) {
            feesInvoiceIds.add(feesInvoice.getId());
        }
        for(FeesPayment feesPayment : feesItem.getFeesPayments()) {
            feesPaymentIds.add(feesPayment.getId());
        }
        for(FeesAct feesAct : feesItem.getFeesActs()) {
            feesActIds.add(feesAct.getId());
        }
        for(PositionQuotation positionQuotation : feesItem.getPositionQuotations()) {
            positionQuotationIds.add(positionQuotation.getId());
        }
        if(feesItem.getProjectCode() != null ) {
            projectCodeId = feesItem.getProjectCode().getId();
        }
    }

    public Long getProjectCodeId() {
        return projectCodeId;
    }

    public void setProjectCodeId(Long projectCodeId) {
        this.projectCodeId = projectCodeId;
    }

    public Long getFeesAdvanceCurrencyId() {
        return feesAdvanceCurrencyId;
    }

    public void setFeesAdvanceCurrencyId(Long feesAdvanceCurrencyId) {
        this.feesAdvanceCurrencyId = feesAdvanceCurrencyId;
    }

    public Long getFeesInvoiceCurrencyId() {
        return feesInvoiceCurrencyId;
    }

    public void setFeesInvoiceCurrencyId(Long feesInvoiceCurrencyId) {
        this.feesInvoiceCurrencyId = feesInvoiceCurrencyId;
    }

    public Long getFeesPaymentCurrencyId() {
        return feesPaymentCurrencyId;
    }

    public void setFeesPaymentCurrencyId(Long feesPaymentCurrencyId) {
        this.feesPaymentCurrencyId = feesPaymentCurrencyId;
    }

    public Set<Long> getFeesAdvanceIds() {
        return feesAdvanceIds;
    }

    public void setFeesAdvanceIds(Set<Long> feesAdvanceIds) {
        this.feesAdvanceIds = feesAdvanceIds;
    }

    public Set<Long> getFeesInvoiceIds() {
        return feesInvoiceIds;
    }

    public void setFeesInvoiceIds(Set<Long> feesInvoiceIds) {
        this.feesInvoiceIds = feesInvoiceIds;
    }

    public Set<Long> getFeesPaymentIds() {
        return feesPaymentIds;
    }

    public void setFeesPaymentIds(Set<Long> feesPaymentIds) {
        this.feesPaymentIds = feesPaymentIds;
    }

    public Long getFeesActCurrencyId() {
        return feesActCurrencyId;
    }

    public void setFeesActCurrencyId(Long feesActCurrencyId) {
        this.feesActCurrencyId = feesActCurrencyId;
    }

    public Set<Long> getFeesActIds() {
        return feesActIds;
    }

    public void setFeesActIds(Set<Long> feesActIds) {
        this.feesActIds = feesActIds;
    }

    public Set<Long> getPositionQuotationIds() {
        return positionQuotationIds;
    }

    public void setPositionQuotationIds(Set<Long> positionQuotationIds) {
        this.positionQuotationIds = positionQuotationIds;
    } 
}
