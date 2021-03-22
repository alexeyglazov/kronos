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
public class ContactSetInactiveForm {
    private Long id;
    private String reason;

    public ContactSetInactiveForm() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }


    public static ContactSetInactiveForm getFromJson(String json) {
        Gson gson = new Gson();
        return gson.fromJson(json, ContactSetInactiveForm.class);
    }

}
