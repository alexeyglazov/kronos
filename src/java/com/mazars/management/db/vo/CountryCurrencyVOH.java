/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.db.vo;
import com.mazars.management.db.domain.*;
import java.util.Set;
import java.util.HashSet;

/**
 *
 * @author glazov
 */
public class CountryCurrencyVOH extends CountryCurrencyVO{
    private Long countryId;
    private Long currencyId;

    public CountryCurrencyVOH() {
    }

    public CountryCurrencyVOH(CountryCurrency countryCurrency) {
        super(countryCurrency);
        this.countryId = countryCurrency.getCountry().getId();
        this.currencyId = countryCurrency.getCurrency().getId();
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
}
