/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.web.forms;
import com.google.gson.Gson;
import com.mazars.management.db.domain.InvoiceRequestPacket;
import com.mazars.management.db.domain.OutOfPocketItem;
import java.math.BigDecimal;

/**
 *
 * @author glazov
 */
public class OutOfPocketRequestEditForm {
    public enum Mode {
        CREATE,
        UPDATE
    }
    private Mode mode;
    private Long id;
    private Long projectCodeId;
    
    private OutOfPocketItem.Type type;
    private BigDecimal amount;
    private Long currencyId;
    private String description;
    private InvoiceRequestPacket.Status status;

    public OutOfPocketRequestEditForm() {
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

    public Long getProjectCodeId() {
        return projectCodeId;
    }

    public void setProjectCodeId(Long projectCodeId) {
        this.projectCodeId = projectCodeId;
    }

    public OutOfPocketItem.Type getType() {
        return type;
    }

    public void setType(OutOfPocketItem.Type type) {
        this.type = type;
    }

    public Long getCurrencyId() {
        return currencyId;
    }

    public void setCurrencyId(Long currencyId) {
        this.currencyId = currencyId;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public InvoiceRequestPacket.Status getStatus() {
        return status;
    }

    public void setStatus(InvoiceRequestPacket.Status status) {
        this.status = status;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public static OutOfPocketRequestEditForm getFromJson(String json) {
        Gson gson = new Gson();
        return gson.fromJson(json, OutOfPocketRequestEditForm.class);
    }
}
