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
public class ActivityEditForm {
    public enum Mode {
        CREATE,
        UPDATE
    }
    private ActivityEditForm.Mode mode;
    private Long id;
    private Long subdepartmentId;
    private String name;
    private String codeName;
    private Boolean isActive;
    private Boolean isConflictCheck;

    public ActivityEditForm() {
    }

    public String getCodeName() {
        return codeName;
    }

    public void setCodeName(String codeName) {
        this.codeName = codeName;
    }

    public Boolean getIsConflictCheck() {
        return isConflictCheck;
    }

    public void setIsConflictCheck(Boolean isConflictCheck) {
        this.isConflictCheck = isConflictCheck;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    public Long getSubdepartmentId() {
        return subdepartmentId;
    }

    public void setSubdepartmentId(Long subdepartmentId) {
        this.subdepartmentId = subdepartmentId;
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


    public static ActivityEditForm getFromJson(String json) {
        Gson gson = new Gson();
        return gson.fromJson(json, ActivityEditForm.class);
    }

}
