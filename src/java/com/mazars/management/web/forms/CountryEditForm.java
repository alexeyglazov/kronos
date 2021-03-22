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
public class CountryEditForm {
    public enum Mode {
        CREATE,
        UPDATE
    }
    private CountryEditForm.Mode mode;
    private Long id;
    private String name;
    private String description;

    public CountryEditForm() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public CountryEditForm.Mode getMode() {
        return mode;
    }

    public void setMode(CountryEditForm.Mode mode) {
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

    public static CountryEditForm getFromJson(String json) {
        Gson gson = new Gson();
        return gson.fromJson(json, CountryEditForm.class);
    }

}
