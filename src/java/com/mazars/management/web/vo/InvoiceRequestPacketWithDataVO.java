/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mazars.management.web.vo;

import com.mazars.management.db.comparators.InvoiceRequestComparator;
import com.mazars.management.db.domain.InvoiceRequest;
import com.mazars.management.db.domain.InvoiceRequestItem;
import com.mazars.management.db.domain.InvoiceRequestPacket;
import com.mazars.management.db.domain.InvoiceRequestPacket.Status;
import com.mazars.management.db.vo.YearMonthDate;
import java.math.BigDecimal;
import java.util.Collections;
import java.util.LinkedList;
import java.util.List;

/**
 *
 * @author glazov
 */
public class InvoiceRequestPacketWithDataVO {   
    private Long id;
    private InvoiceRequestPacket.Status status;
    private Boolean withVAT;
    private String comment;
    private List<InvoiceRequestWithItemsVO> invoiceRequests = new LinkedList<InvoiceRequestWithItemsVO>();
    private ActRequestWithItemsVO actRequest;
    private TaxInvoiceRequestVO taxInvoiceRequest;

    public InvoiceRequestPacketWithDataVO() {
    }

    public InvoiceRequestPacketWithDataVO(InvoiceRequestPacket invoiceRequestPacket) {
        this.id = invoiceRequestPacket.getId();
        
        this.status = invoiceRequestPacket.getStatus();
        this.comment = invoiceRequestPacket.getComment();
        this.withVAT = invoiceRequestPacket.getWithVAT();
        if(invoiceRequestPacket.getInvoiceRequests() != null) {
            List<InvoiceRequest> tmpInvoiceRequests = new LinkedList<InvoiceRequest>(invoiceRequestPacket.getInvoiceRequests());
            Collections.sort(tmpInvoiceRequests, new InvoiceRequestComparator());
            for(InvoiceRequest invoiceRequest : tmpInvoiceRequests) {
                invoiceRequests.add(new InvoiceRequestWithItemsVO(invoiceRequest));
            }
        }
        if(invoiceRequestPacket.getActRequest() != null) {
            this.actRequest = new ActRequestWithItemsVO(invoiceRequestPacket.getActRequest());
        }
        if(invoiceRequestPacket.getTaxInvoiceRequest() != null) {
            this.taxInvoiceRequest = new TaxInvoiceRequestVO(invoiceRequestPacket.getTaxInvoiceRequest());
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public Boolean isWithVAT() {
        return withVAT;
    }

    public void setWithVAT(Boolean withVAT) {
        this.withVAT = withVAT;
    }

    public List<InvoiceRequestWithItemsVO> getInvoiceRequests() {
        return invoiceRequests;
    }

    public void setInvoiceRequests(List<InvoiceRequestWithItemsVO> invoiceRequests) {
        this.invoiceRequests = invoiceRequests;
    }

    public ActRequestWithItemsVO getActRequest() {
        return actRequest;
    }

    public void setActRequest(ActRequestWithItemsVO actRequest) {
        this.actRequest = actRequest;
    }

    public TaxInvoiceRequestVO getTaxInvoiceRequest() {
        return taxInvoiceRequest;
    }

    public void setTaxInvoiceRequest(TaxInvoiceRequestVO taxInvoiceRequest) {
        this.taxInvoiceRequest = taxInvoiceRequest;
    }


}
