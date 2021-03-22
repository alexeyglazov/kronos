/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mazars.management.web.vo;

import com.mazars.management.db.domain.ActRequest;
import com.mazars.management.db.domain.ActRequestItem;
import com.mazars.management.db.domain.InvoiceRequest;
import com.mazars.management.db.domain.InvoiceRequestPacket;
import com.mazars.management.db.domain.TaxInvoiceRequest;
import com.mazars.management.db.vo.YearMonthDate;
import java.math.BigDecimal;
import java.util.LinkedList;
import java.util.List;

/**
 *
 * @author glazov
 */
public class TaxInvoiceRequestVO {  
    private Long id;
    private String reference;
    private Boolean isCancelled;
    private Long invoiceRequestPacketId;
    
    public TaxInvoiceRequestVO() {
    }

    public TaxInvoiceRequestVO(TaxInvoiceRequest taxInvoiceRequest) {
        this.id = taxInvoiceRequest.getId();
        this.isCancelled = taxInvoiceRequest.getIsCancelled();
        this.reference = taxInvoiceRequest.getReference();
        invoiceRequestPacketId = taxInvoiceRequest.getInvoiceRequestPacket().getId();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getInvoiceRequestPacketId() {
        return invoiceRequestPacketId;
    }

    public void setInvoiceRequestPacketId(Long invoiceRequestPacketId) {
        this.invoiceRequestPacketId = invoiceRequestPacketId;
    }

    public String getReference() {
        return reference;
    }

    public void setReference(String reference) {
        this.reference = reference;
    }

    public Boolean getIsCancelled() {
        return isCancelled;
    }

    public void setIsCancelled(Boolean isCancelled) {
        this.isCancelled = isCancelled;
    }
}
