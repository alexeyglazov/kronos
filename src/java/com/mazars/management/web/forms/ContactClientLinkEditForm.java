/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.web.forms;
import com.google.gson.Gson;

/**
 *
 * @author glazov
 */
public class ContactClientLinkEditForm {
    public enum Mode {
        CREATE,
        UPDATE
    }
    private ContactClientLinkEditForm.Mode mode;
    private Long id;
    private Long contactId;
    private Long clientId;

    public ContactClientLinkEditForm() {
    }


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Mode getMode() {
        return mode;
    }

    public void setMode(Mode mode) {
        this.mode = mode;
    }

    public Long getContactId() {
        return contactId;
    }

    public void setContactId(Long contactId) {
        this.contactId = contactId;
    }

    public Long getClientId() {
        return clientId;
    }

    public void setClientId(Long clientId) {
        this.clientId = clientId;
    }

    public static ContactClientLinkEditForm getFromJson(String json) {
        Gson gson = new Gson();
        return gson.fromJson(json, ContactClientLinkEditForm.class);
    }
}
