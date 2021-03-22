/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.db.domain;
import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;
import javax.xml.bind.annotation.XmlEnum;
import javax.xml.bind.annotation.XmlType;

/**
 *
 * @author glazov
 */
public class OutOfPocketItem {
    @XmlType(name="OutOfPocketItemType", namespace = "http://services.webservices.management.mazars.com/")   
    @XmlEnum
    public enum Type {
        FULL,
        LIMITED,
        NO
    }

    private Long id;

    private Type type;
    private BigDecimal amount;
    private Currency currency;

    private Currency outOfPocketInvoiceCurrency;
    private Currency outOfPocketPaymentCurrency;
    private Currency outOfPocketActCurrency;

    private Set<OutOfPocketInvoice> outOfPocketInvoices = new HashSet<OutOfPocketInvoice>();
    private Set<OutOfPocketPayment> outOfPocketPayments = new HashSet<OutOfPocketPayment>();
    private Set<OutOfPocketAct> outOfPocketActs = new HashSet<OutOfPocketAct>();
    
    private ProjectCode projectCode;

    public Currency getOutOfPocketActCurrency() {
        return outOfPocketActCurrency;
    }

    public void setOutOfPocketActCurrency(Currency outOfPocketActCurrency) {
        this.outOfPocketActCurrency = outOfPocketActCurrency;
    }

    public Set<OutOfPocketAct> getOutOfPocketActs() {
        return outOfPocketActs;
    }

    public void setOutOfPocketActs(Set<OutOfPocketAct> outOfPocketActs) {
        this.outOfPocketActs = outOfPocketActs;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Type getType() {
        return type;
    }

    public void setType(Type type) {
        this.type = type;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public Currency getOutOfPocketInvoiceCurrency() {
        return outOfPocketInvoiceCurrency;
    }

    public void setOutOfPocketInvoiceCurrency(Currency outOfPocketInvoiceCurrency) {
        this.outOfPocketInvoiceCurrency = outOfPocketInvoiceCurrency;
    }

    public Currency getOutOfPocketPaymentCurrency() {
        return outOfPocketPaymentCurrency;
    }

    public void setOutOfPocketPaymentCurrency(Currency outOfPocketPaymentCurrency) {
        this.outOfPocketPaymentCurrency = outOfPocketPaymentCurrency;
    }

    public Set<OutOfPocketInvoice> getOutOfPocketInvoices() {
        return outOfPocketInvoices;
    }

    public void setOutOfPocketInvoices(Set<OutOfPocketInvoice> outOfPocketInvoices) {
        this.outOfPocketInvoices = outOfPocketInvoices;
    }

    public Set<OutOfPocketPayment> getOutOfPocketPayments() {
        return outOfPocketPayments;
    }

    public void setOutOfPocketPayments(Set<OutOfPocketPayment> outOfPocketPayments) {
        this.outOfPocketPayments = outOfPocketPayments;
    }

    public ProjectCode getProjectCode() {
        return projectCode;
    }

    public void setProjectCode(ProjectCode projectCode) {
        this.projectCode = projectCode;
    }

    public Currency getCurrency() {
        return currency;
    }

    public void setCurrency(Currency currency) {
        this.currency = currency;
    }
    public Boolean hasOutOfPocketInvoices() {
        if(! this.getOutOfPocketInvoices().isEmpty()) {
            return true;
        }
        return false;
    }
    public Boolean hasOutOfPocketActs() {
        if(! this.getOutOfPocketActs().isEmpty()) {
            return true;
        }
        return false;
    }
    public Boolean hasOutOfPocketPayments() {
        if(! this.getOutOfPocketPayments().isEmpty()) {
            return true;
        }
        return false;
    }
    public Boolean hasOutOfPocketExpenses() {
        if(this.hasOutOfPocketActs() || this.hasOutOfPocketInvoices() || this.hasOutOfPocketPayments()) {
            return true;
        }
        return false;
    }
}
