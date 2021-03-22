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
public class CurrencyBindForm {
    private Long countryId;
    private Long currencyId;

    public CurrencyBindForm() {
    }

    public Long getCountryId() {
        return countryId;
    }

    public void setCountryId(Long countryId) {
        this.countryId = countryId;
    }

    public Long getCurrencyId() {
        return currencyId;
    }

    public void setCurrencyId(Long currencyId) {
        this.currencyId = currencyId;
    }


    public static CurrencyBindForm getFromJson(String json) {
        Gson gson = new Gson();
        return gson.fromJson(json, CurrencyBindForm.class);
    }

}
