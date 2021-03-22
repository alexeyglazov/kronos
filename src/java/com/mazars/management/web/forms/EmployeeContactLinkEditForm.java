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
public class EmployeeContactLinkEditForm {
    public enum Mode {
        CREATE,
        UPDATE
    }
    private EmployeeContactLinkEditForm.Mode mode;
    private Long id;
    private Long contactId;
    private Long employeeId;
    private String comment;

    public EmployeeContactLinkEditForm() {
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

    public Long getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(Long employeeId) {
        this.employeeId = employeeId;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public static EmployeeContactLinkEditForm getFromJson(String json) {
        Gson gson = new Gson();
        return gson.fromJson(json, EmployeeContactLinkEditForm.class);
    }

}
