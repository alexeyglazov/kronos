/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.web.forms;
import com.google.gson.Gson;
import com.mazars.management.db.domain.InvoiceRequestPacket;
import com.mazars.management.service.StringUtils;

/**
 *
 * @author glazov
 */
public class InvoiceRequestPacketEditForm {
    private Long id;
    private Boolean withVAT;
    private String comment;
    private InvoiceRequestPacket.Status status;

    public InvoiceRequestPacketEditForm() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Boolean getWithVAT() {
        return withVAT;
    }

    public void setWithVAT(Boolean withVAT) {
        this.withVAT = withVAT;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public InvoiceRequestPacket.Status getStatus() {
        return status;
    }

    public void setStatus(InvoiceRequestPacket.Status status) {
        this.status = status;
    }

    public static InvoiceRequestPacketEditForm getFromJson(String json) {
        Gson gson = new Gson();
        return gson.fromJson(json, InvoiceRequestPacketEditForm.class);
    }
    public void normalize() {
        comment = StringUtils.stripNonValidXMLCharacters(comment);
    }    
}
