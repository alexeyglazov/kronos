/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.db.vo;
import com.mazars.management.db.domain.*;
import java.util.LinkedList;
import java.util.List;
import java.util.Objects;


/**
 *
 * @author glazov
 */
public class CurrencyVO {
    private Long id;
    private String name;
    private String code;
    public CurrencyVO() {};

    public CurrencyVO(Currency currency) {
        this.id = currency.getId();
        this.name = currency.getName();
        this.code = currency.getCode();
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
    public static List<CurrencyVO> getList(List<Currency> currencies) {
        List<CurrencyVO> currencyVOs = new LinkedList<CurrencyVO>();
        if(currencies == null) {
            return null;
        }
        for(Currency currency : currencies) {
           currencyVOs.add(new CurrencyVO(currency));
        }
        return currencyVOs;
    }
}
