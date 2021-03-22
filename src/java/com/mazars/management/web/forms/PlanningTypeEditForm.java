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
public class PlanningTypeEditForm {
    public enum Mode {
        CREATE,
        UPDATE
    }
    private PlanningTypeEditForm.Mode mode;
    private Long id;
    private Long subdepartmentId;
    private String name;
    private Boolean isActive;
    private Boolean isInternal;

    public PlanningTypeEditForm() {
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

    public Boolean getIsInternal() {
        return isInternal;
    }

    public void setIsInternal(Boolean isInternal) {
        this.isInternal = isInternal;
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

    public PlanningTypeEditForm.Mode getMode() {
        return mode;
    }

    public void setMode(PlanningTypeEditForm.Mode mode) {
        this.mode = mode;
    }

    public static PlanningTypeEditForm getFromJson(String json) {
        Gson gson = new Gson();
        return gson.fromJson(json, PlanningTypeEditForm.class);
    }

}
