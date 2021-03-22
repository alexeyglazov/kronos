/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.db.vo;
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
    private String description;

    public OutOfPocketRequestVO() {
    }

    public OutOfPocketRequestVO(OutOfPocketRequest outOfPocketRequest) {
        this.id = outOfPocketRequest.getId();
        this.status = outOfPocketRequest.getStatus();
        this.type = outOfPocketRequest.getType();
        this.amount = outOfPocketRequest.getAmount();
        this.description = outOfPocketRequest.getDescription();
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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
