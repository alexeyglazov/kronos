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
public class ISOCountryEditForm {
    public enum Mode {
        CREATE,
        UPDATE
    }
    private ISOCountryEditForm.Mode mode;
    private Long id;
    private String name;
    private String alpha2Code;
    private String alpha3Code;
    private String numericCode;

    public ISOCountryEditForm() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ISOCountryEditForm.Mode getMode() {
        return mode;
    }

    public void setMode(ISOCountryEditForm.Mode mode) {
        this.mode = mode;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAlpha2Code() {
        return alpha2Code;
    }

    public void setAlpha2Code(String alpha2Code) {
        this.alpha2Code = alpha2Code;
    }

    public String getAlpha3Code() {
        return alpha3Code;
    }

    public void setAlpha3Code(String alpha3Code) {
        this.alpha3Code = alpha3Code;
    }

    public String getNumericCode() {
        return numericCode;
    }

    public void setNumericCode(String numericCode) {
        this.numericCode = numericCode;
    }

    public static ISOCountryEditForm getFromJson(String json) {
        Gson gson = new Gson();
        return gson.fromJson(json, ISOCountryEditForm.class);
    }
}
