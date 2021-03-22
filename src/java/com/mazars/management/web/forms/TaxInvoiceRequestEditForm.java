/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.web.forms;
import com.google.gson.Gson;
import com.mazars.management.db.domain.ActRequest;
import com.mazars.management.db.domain.InvoiceRequest;
import com.mazars.management.db.domain.InvoiceRequestPacket;
import com.mazars.management.db.domain.InvoiceRequestPacket.Status;
import com.mazars.management.db.domain.TaxInvoiceRequest;
import com.mazars.management.db.vo.YearMonthDate;
import com.mazars.management.service.StringUtils;
import java.math.BigDecimal;
import java.util.LinkedList;
import java.util.List;

/**
 *
 * @author glazov
 */
public class TaxInvoiceRequestEditForm {
    public enum Mode {
        CREATE,
        UPDATE
    }
    private TaxInvoiceRequestEditForm.Mode mode;
    private Long id;
    private Long invoiceRequestPacketId;
    private InvoiceRequestPacket.Status status;
    private Boolean isCancelled;

    public TaxInvoiceRequestEditForm() {
    }

    public Mode getMode() {
        return mode;
    }

    public void setMode(Mode mode) {
        this.mode = mode;
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

    public InvoiceRequestPacket.Status getStatus() {
        return status;
    }

    public void setStatus(InvoiceRequestPacket.Status status) {
        this.status = status;
    }

    public Boolean getIsCancelled() {
        return isCancelled;
    }

    public void setIsCancelled(Boolean isCancelled) {
        this.isCancelled = isCancelled;
    }

    public static TaxInvoiceRequestEditForm getFromJson(String json) {
        Gson gson = new Gson();
        return gson.fromJson(json, TaxInvoiceRequestEditForm.class);
    }
    public void normalize() {
    }    
}
