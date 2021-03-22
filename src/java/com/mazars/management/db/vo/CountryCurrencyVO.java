/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.db.vo;
import com.mazars.management.db.domain.*;
import java.util.Calendar;
/**
 *
 * @author glazov
 */
public class CountryCurrencyVO {
    private Long id;
    private Boolean isMain;
    public CountryCurrencyVO() {
    }
    public CountryCurrencyVO(CountryCurrency countryCurrency) {
        this.id = countryCurrency.getId();
        this.isMain = countryCurrency.getIsMain();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Boolean getIsMain() {
        return isMain;
    }

    public void setIsMain(Boolean isMain) {
        this.isMain = isMain;
    }
}
