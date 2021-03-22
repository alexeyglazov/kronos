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
public class ModuleEditForm {
    public enum Mode {
        CREATE,
        UPDATE
    }
    private ModuleEditForm.Mode mode;
    private Long id;
    private String name;
    private Boolean isReport;
    private String description;

    public ModuleEditForm() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ModuleEditForm.Mode getMode() {
        return mode;
    }

    public void setMode(ModuleEditForm.Mode mode) {
        this.mode = mode;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Boolean getIsReport() {
        return isReport;
    }

    public void setIsReport(Boolean isReport) {
        this.isReport = isReport;
    }

    public static ModuleEditForm getFromJson(String json) {
        Gson gson = new Gson();
        return gson.fromJson(json, ModuleEditForm.class);
    }
}
