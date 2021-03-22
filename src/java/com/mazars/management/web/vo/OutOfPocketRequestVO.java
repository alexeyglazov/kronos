/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.web.vo;
import com.mazars.management.db.domain.*;
import com.mazars.management.db.domain.OutOfPocketItem.Type;
import java.math.BigDecimal;
/**
 *
 * @author glazov
 */
public class OutOfPocketRequestVO {
    private Long id;
    private InvoiceRequestPacket.Status status;
    private OutOfPocketItem.Type type;
    private BigDecimal amount;
    private Long currencyId;
    private String description;
    private String currencyCode;
    private Boolean hasActualOutOfPocketExpenses;

    public OutOfPocketRequestVO() {
    }

    public OutOfPocketRequestVO(OutOfPocketRequest outOfPocketRequest) {
        this.id = outOfPocketRequest.getId();
        this.status = outOfPocketRequest.getStatus();
        this.type = outOfPocketRequest.getType();
        this.amount = outOfPocketRequest.getAmount();
        this.description = outOfPocketRequest.getDescription();
        if(outOfPocketRequest.getCurrency() != null) {
            this.currencyId = outOfPocketRequest.getCurrency().getId();
            this.currencyCode = outOfPocketRequest.getCurrency().getCode();
        }
        if(outOfPocketRequest.getProjectCode().getOutOfPocketItem() != null) {
            this.hasActualOutOfPocketExpenses = outOfPocketRequest.getProjectCode().getOutOfPocketItem().hasOutOfPocketExpenses();
        }
    }

    public Boolean isHasActualOutOfPocketExpenses() {
        return hasActualOutOfPocketExpenses;
    }

    public void setHasActualOutOfPocketExpenses(Boolean hasActualOutOfPocketExpenses) {
        this.hasActualOutOfPocketExpenses = hasActualOutOfPocketExpenses;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public InvoiceRequestPacket.Status getStatus() {
        return status;
    }

    public void setStatus(InvoiceRequestPacket.Status status) {
        this.status = status;
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

    public Long getCurrencyId() {
        return currencyId;
    }

    public void setCurrencyId(Long currencyId) {
        this.currencyId = currencyId;
    }

    public String getCurrencyCode() {
        return currencyCode;
    }

    public void setCurrencyCode(String currencyCode) {
        this.currencyCode = currencyCode;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
