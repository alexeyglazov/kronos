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
public class StandardPositionEditForm {
    public enum Mode {
        CREATE,
        UPDATE
    }
    private StandardPositionEditForm.Mode mode;
    private Long id;
    private String name;
    private Integer sortValue;

    public StandardPositionEditForm() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public StandardPositionEditForm.Mode getMode() {
        return mode;
    }

    public void setMode(StandardPositionEditForm.Mode mode) {
        this.mode = mode;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getSortValue() {
        return sortValue;
    }

    public void setSortValue(Integer sortValue) {
        this.sortValue = sortValue;
    }

    public static StandardPositionEditForm getFromJson(String json) {
        Gson gson = new Gson();
        return gson.fromJson(json, StandardPositionEditForm.class);
    }
}
