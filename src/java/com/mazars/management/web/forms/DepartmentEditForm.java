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
public class DepartmentEditForm {
    public enum Mode {
        CREATE,
        UPDATE
    }
    private DepartmentEditForm.Mode mode;
    private Long id;
    private Long officeId;
    private String name;
    private String codeName;
    private String description;
    private Boolean isActive;
    private Boolean isBusinessTrippable;

    public DepartmentEditForm() {
    }

    public String getCodeName() {
        return codeName;
    }

    public void setCodeName(String codeName) {
        this.codeName = codeName;
    }

    public Long getOfficeId() {
        return officeId;
    }

    public void setOfficeId(Long officeId) {
        this.officeId = officeId;
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

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    public Boolean getIsBusinessTrippable() {
        return isBusinessTrippable;
    }

    public void setIsBusinessTrippable(Boolean isBusinessTrippable) {
        this.isBusinessTrippable = isBusinessTrippable;
    }

    public static DepartmentEditForm getFromJson(String json) {
        Gson gson = new Gson();
        return gson.fromJson(json, DepartmentEditForm.class);
    }

}
