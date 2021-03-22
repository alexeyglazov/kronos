package com.mazars.management.db.vo;
import com.mazars.management.db.domain.*;
import java.util.HashSet;
import java.util.Set;

public class OutOfPocketItemVOH extends OutOfPocketItemVO {
    private Long projectCodeId;
    private Long currencyId;
    private Long outOfPocketInvoiceCurrencyId;
    private Long outOfPocketPaymentCurrencyId;
    private Long outOfPocketActCurrencyId;
    private Set<Long> outOfPocketInvoiceIds = new HashSet<Long>();
    private Set<Long> outOfPocketPaymentIds = new HashSet<Long>();
    private Set<Long> outOfPocketActIds = new HashSet<Long>();

    public OutOfPocketItemVOH() {}

    public OutOfPocketItemVOH(OutOfPocketItem outOfPocketItem) {
        super(outOfPocketItem);
        if(outOfPocketItem.getCurrency() != null ) {
            currencyId = outOfPocketItem.getCurrency().getId();
        }
        if(outOfPocketItem.getOutOfPocketInvoiceCurrency() != null ) {
            outOfPocketInvoiceCurrencyId = outOfPocketItem.getOutOfPocketInvoiceCurrency().getId();
        }
        if(outOfPocketItem.getOutOfPocketPaymentCurrency() != null ) {
            outOfPocketPaymentCurrencyId = outOfPocketItem.getOutOfPocketPaymentCurrency().getId();
        }
        if(outOfPocketItem.getOutOfPocketActCurrency() != null ) {
            outOfPocketActCurrencyId = outOfPocketItem.getOutOfPocketActCurrency().getId();
        }
        for(OutOfPocketInvoice outOfPocketInvoice : outOfPocketItem.getOutOfPocketInvoices()) {
            outOfPocketInvoiceIds.add(outOfPocketInvoice.getId());
        }
        for(OutOfPocketPayment outOfPocketPayment : outOfPocketItem.getOutOfPocketPayments()) {
            outOfPocketPaymentIds.add(outOfPocketPayment.getId());
        }
        for(OutOfPocketAct outOfPocketAct : outOfPocketItem.getOutOfPocketActs()) {
            outOfPocketActIds.add(outOfPocketAct.getId());
        }
        if(outOfPocketItem.getProjectCode() != null ) {
            projectCodeId = outOfPocketItem.getProjectCode().getId();
        }
    }

    public void setOutOfPocketActCurrencyId(Long outOfPocketActCurrencyId) {
        this.outOfPocketActCurrencyId = outOfPocketActCurrencyId;
    }

    public Long getOutOfPocketActCurrencyId() {
        return outOfPocketActCurrencyId;
    }
    
    public void setOutOfPocketActIds(Set<Long> outOfPocketActIds) {
        this.outOfPocketActIds = outOfPocketActIds;
    }

    public Set<Long> getOutOfPocketActIds() {
        return outOfPocketActIds;
    }

    public Long getProjectCodeId() {
        return projectCodeId;
    }

    public void setProjectCodeId(Long projectCodeId) {
        this.projectCodeId = projectCodeId;
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

    public Set<Long> getOutOfPocketInvoiceIds() {
        return outOfPocketInvoiceIds;
    }

    public void setOutOfPocketInvoiceIds(Set<Long> outOfPocketInvoiceIds) {
        this.outOfPocketInvoiceIds = outOfPocketInvoiceIds;
    }

    public Set<Long> getOutOfPocketPaymentIds() {
        return outOfPocketPaymentIds;
    }

    public void setOutOfPocketPaymentIds(Set<Long> outOfPocketPaymentIds) {
        this.outOfPocketPaymentIds = outOfPocketPaymentIds;
    }

    public Long getCurrencyId() {
        return currencyId;
    }

    public void setCurrencyId(Long currencyId) {
        this.currencyId = currencyId;
    }
}
