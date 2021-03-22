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
public class CurrencyEditForm {
    public enum Mode {
        CREATE,
        UPDATE
    }
    private CurrencyEditForm.Mode mode;
    private Long id;
    private String name;
    private String code;

    public CurrencyEditForm() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public CurrencyEditForm.Mode getMode() {
        return mode;
    }

    public void setMode(CurrencyEditForm.Mode mode) {
        this.mode = mode;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public static CurrencyEditForm getFromJson(String json) {
        Gson gson = new Gson();
        return gson.fromJson(json, CurrencyEditForm.class);
    }
}
