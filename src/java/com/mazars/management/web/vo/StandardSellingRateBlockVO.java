/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.web.vo;

import com.mazars.management.db.domain.*;
import com.mazars.management.db.vo.StandardSellingRateVOH;
import java.util.Calendar;
import java.util.LinkedList;
import java.util.List;
/**
 *
 * @author Glazov
 */
public class StandardSellingRateBlockVO {   
    private Long standardSellingRateGroupId;
    private Calendar start;
    private Calendar end;
    private Long currencyId;
    private String currencyName;
    private List<StandardSellingRateVOH> standardSellingRates = new LinkedList<StandardSellingRateVOH>();

    public StandardSellingRateBlockVO() {
    }
    public StandardSellingRateBlockVO(StandardSellingRateGroup standardSellingRateGroup) {
        Currency currency = standardSellingRateGroup.getCurrency();
        this.standardSellingRateGroupId = standardSellingRateGroup.getId();
        this.start = standardSellingRateGroup.getStart();
        this.end = standardSellingRateGroup.getEnd();
        this.currencyId = currency.getId();
        this.currencyName = currency.getName();
        for(StandardSellingRate standardSellingRate : standardSellingRateGroup.getStandardSellingRates()) {
           this.standardSellingRates.add(new StandardSellingRateVOH(standardSellingRate));
        }
    }

    public Long getCurrencyId() {
        return currencyId;
    }

    public void setCurrencyId(Long currencyId) {
        this.currencyId = currencyId;
    }

    public String getCurrencyName() {
        return currencyName;
    }

    public void setCurrencyName(String currencyName) {
        this.currencyName = currencyName;
    }

    public Calendar getEnd() {
        return end;
    }

    public void setEnd(Calendar end) {
        this.end = end;
    }

    public Long getStandardSellingRateGroupId() {
        return standardSellingRateGroupId;
    }

    public void setStandardSellingRateGroupId(Long standardSellingRateGroupId) {
        this.standardSellingRateGroupId = standardSellingRateGroupId;
    }

    public List<StandardSellingRateVOH> getStandardSellingRates() {
        return standardSellingRates;
    }

    public void setStandardSellingRates(List<StandardSellingRateVOH> standardSellingRates) {
        this.standardSellingRates = standardSellingRates;
    }

    public Calendar getStart() {
        return start;
    }

    public void setStart(Calendar start) {
        this.start = start;
    }
}
