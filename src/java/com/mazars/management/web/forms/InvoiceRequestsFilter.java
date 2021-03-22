/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.web.forms;
import com.google.gson.Gson;
import com.mazars.management.db.vo.YearMonthDate;

/**
 *
 * @author glazov
 */
public class InvoiceRequestsFilter {
    public enum BooleanExtended {
        ALL, TRUE, FALSE
    }
    private BooleanExtended hasRequests;
    private BooleanExtended hasInvoiceRequests;
    private BooleanExtended hasActRequests;
    private BooleanExtended hasTaxInvoiceRequests;
    private Boolean hasSuspendedRequests;
    private Boolean hasActiveRequests;
    private Boolean hasLockedRequests;
    private Boolean hasClosedRequests;
    private String invoiceReference;
    private String actReference;
    private String paymentReference;
    private String outOfPocketInvoiceReference;
    private String outOfPocketActReference;
    private String outOfPocketPaymentReference;
    private YearMonthDate startDate;
    private YearMonthDate endDate;
    
    public BooleanExtended getHasRequests() {
        return hasRequests;
    }

    public void setHasRequests(BooleanExtended hasRequests) {
        this.hasRequests = hasRequests;
    }

    public BooleanExtended getHasInvoiceRequests() {
        return hasInvoiceRequests;
    }

    public void setHasInvoiceRequests(BooleanExtended hasInvoiceRequests) {
        this.hasInvoiceRequests = hasInvoiceRequests;
    }

    public BooleanExtended getHasActRequests() {
        return hasActRequests;
    }

    public void setHasActRequests(BooleanExtended hasActRequests) {
        this.hasActRequests = hasActRequests;
    }

    public BooleanExtended getHasTaxInvoiceRequests() {
        return hasTaxInvoiceRequests;
    }

    public void setHasTaxInvoiceRequests(BooleanExtended hasTaxInvoiceRequests) {
        this.hasTaxInvoiceRequests = hasTaxInvoiceRequests;
    }

    public Boolean getHasSuspendedRequests() {
        return hasSuspendedRequests;
    }

    public void setHasSuspendedRequests(Boolean hasSuspendedRequests) {
        this.hasSuspendedRequests = hasSuspendedRequests;
    }

    public Boolean getHasActiveRequests() {
        return hasActiveRequests;
    }

    public void setHasActiveRequests(Boolean hasActiveRequests) {
        this.hasActiveRequests = hasActiveRequests;
    }

    public Boolean getHasClosedRequests() {
        return hasClosedRequests;
    }

    public void setHasClosedRequests(Boolean hasClosedRequests) {
        this.hasClosedRequests = hasClosedRequests;
    }

    public Boolean getHasLockedRequests() {
        return hasLockedRequests;
    }

    public void setHasLockedRequests(Boolean hasLockedRequests) {
        this.hasLockedRequests = hasLockedRequests;
    }

    public String getInvoiceReference() {
        return invoiceReference;
    }

    public void setInvoiceReference(String invoiceReference) {
        this.invoiceReference = invoiceReference;
    }

    public String getActReference() {
        return actReference;
    }

    public void setActReference(String actReference) {
        this.actReference = actReference;
    }

    public String getPaymentReference() {
        return paymentReference;
    }

    public void setPaymentReference(String paymentReference) {
        this.paymentReference = paymentReference;
    }

    public String getOutOfPocketInvoiceReference() {
        return outOfPocketInvoiceReference;
    }

    public void setOutOfPocketInvoiceReference(String outOfPocketInvoiceReference) {
        this.outOfPocketInvoiceReference = outOfPocketInvoiceReference;
    }

    public String getOutOfPocketActReference() {
        return outOfPocketActReference;
    }

    public void setOutOfPocketActReference(String outOfPocketActReference) {
        this.outOfPocketActReference = outOfPocketActReference;
    }

    public String getOutOfPocketPaymentReference() {
        return outOfPocketPaymentReference;
    }

    public void setOutOfPocketPaymentReference(String outOfPocketPaymentReference) {
        this.outOfPocketPaymentReference = outOfPocketPaymentReference;
    }

    public YearMonthDate getStartDate() {
        return startDate;
    }

    public void setStartDate(YearMonthDate startDate) {
        this.startDate = startDate;
    }

    public YearMonthDate getEndDate() {
        return endDate;
    }

    public void setEndDate(YearMonthDate endDate) {
        this.endDate = endDate;
    }

    public InvoiceRequestsFilter() {
    }
    public static InvoiceRequestsFilter getFromJson(String json) {
        Gson gson = new Gson();
        return gson.fromJson(json, InvoiceRequestsFilter.class);
    }

    private Boolean isBooleanUsed(Boolean field) {
        if(Boolean.TRUE.equals(field)) {
            return true;
        }
        return false;
    }
    public Boolean isHasRequestsUsed() {
        return BooleanExtended.FALSE.equals(hasRequests) || BooleanExtended.TRUE.equals(hasRequests);
    }
    public Boolean isHasInvoiceRequestsUsed() {
        return BooleanExtended.FALSE.equals(hasInvoiceRequests) || BooleanExtended.TRUE.equals(hasInvoiceRequests);
    }
    public Boolean isHasActRequestsUsed() {
        return BooleanExtended.FALSE.equals(hasActRequests) || BooleanExtended.TRUE.equals(hasActRequests);
    }
    public Boolean isHasTaxInvoiceRequestsUsed() {
        return BooleanExtended.FALSE.equals(hasTaxInvoiceRequests) || BooleanExtended.TRUE.equals(hasTaxInvoiceRequests);
    }
    public Boolean isHasSuspendedRequestsUsed() {
        return isBooleanUsed(hasSuspendedRequests);
    }
    public Boolean isHasActiveRequestsUsed() {
        return isBooleanUsed(hasActiveRequests);
    }
    public Boolean isHasLockedRequestsUsed() {
        return isBooleanUsed(hasLockedRequests);
    }
    public Boolean isHasClosedRequestsUsed() {
        return isBooleanUsed(hasClosedRequests);
    }
    public Boolean isInvoiceReferenceUsed() {
        return invoiceReference != null && ! invoiceReference.trim().equals("");
    }
    public Boolean isActReferenceUsed() {
        return actReference != null && ! actReference.trim().equals("");
    }
    public Boolean isPaymentReferenceUsed() {
        return paymentReference != null && ! paymentReference.trim().equals("");
    }
    public Boolean isOutOfPocketInvoiceReferenceUsed() {
        return outOfPocketInvoiceReference != null && ! outOfPocketInvoiceReference.trim().equals("");
    }
    public Boolean isOutOfPocketActReferenceUsed() {
        return outOfPocketActReference != null && ! outOfPocketActReference.trim().equals("");
    }
    public Boolean isOutOfPocketPaymentReferenceUsed() {
        return outOfPocketPaymentReference != null && ! outOfPocketPaymentReference.trim().equals("");
    }
    public Boolean isStartDateUsed() {
        return startDate != null;
    }
    public Boolean isEndDateUsed() {
        return endDate != null;
    }
    ///////////////////
    public Boolean isUsed() {
        return isRequestUsed() ||
        isFeesReferenceUsed() ||
        isOutOfPocketReferenceUsed() ||
        isDateUsed()        ;
    }
    public Boolean isRequestUsed() {
       return isHasRequestsUsed() ||
        isHasInvoiceRequestsUsed() ||
        isHasActRequestsUsed() ||
        isHasTaxInvoiceRequestsUsed() ||       
        isHasSuspendedRequestsUsed() ||
        isHasActiveRequestsUsed() ||
        isHasLockedRequestsUsed() ||
        isHasClosedRequestsUsed();
    }
    public Boolean isFeesReferenceUsed() {
       return isInvoiceReferenceUsed() ||
        isActReferenceUsed() ||
        isPaymentReferenceUsed()               
               ;
    }
    public Boolean isOutOfPocketReferenceUsed() {
       return isOutOfPocketInvoiceReferenceUsed() ||
        isOutOfPocketActReferenceUsed() ||
        isOutOfPocketPaymentReferenceUsed()               
               ;
    }
    public Boolean isDateUsed() {
       return isStartDateUsed() || isEndDateUsed();
    }
}
