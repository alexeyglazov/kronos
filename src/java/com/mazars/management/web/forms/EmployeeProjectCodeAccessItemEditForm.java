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
public class EmployeeProjectCodeAccessItemEditForm {
    public enum Mode {
        CREATE,
        UPDATE
    }
    private EmployeeProjectCodeAccessItemEditForm.Mode mode;
    private Long id;
    private Long projectCodeId;
    private Long employeeId;

    public EmployeeProjectCodeAccessItemEditForm() {
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

    public Long getProjectCodeId() {
        return projectCodeId;
    }

    public void setProjectCodeId(Long projectCodeId) {
        this.projectCodeId = projectCodeId;
    }


    public Long getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(Long employeeId) {
        this.employeeId = employeeId;
    }

    public static EmployeeProjectCodeAccessItemEditForm getFromJson(String json) {
        Gson gson = new Gson();
        return gson.fromJson(json, EmployeeProjectCodeAccessItemEditForm.class);
    }

}
