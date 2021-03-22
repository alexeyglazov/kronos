/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.web.vo;

import com.mazars.management.db.comparators.StandardCostComparator;
import com.mazars.management.db.domain.*;
import com.mazars.management.db.vo.StandardCostVO;
import com.mazars.management.db.vo.StandardCostVOH;
import java.math.BigDecimal;
import java.util.Calendar;
import java.util.List;
import java.util.LinkedList;
import java.util.Collections;
/**
 *
 * @author Glazov
 */
public class StandardCostBlockVO {
    private Long standardCostGroupId;
    private Calendar start;
    private Calendar end;
    private Long currencyId;
    private String currencyName;
    private List<StandardCostVOH> standardCosts = new LinkedList<StandardCostVOH>();

    public StandardCostBlockVO() {
    }
    public StandardCostBlockVO(StandardCostGroup standardCostGroup) {
        Currency currency = standardCostGroup.getCurrency();
        this.standardCostGroupId = standardCostGroup.getId();
        this.start = standardCostGroup.getStart();
        this.end = standardCostGroup.getEnd();
        this.currencyId = currency.getId();
        this.currencyName = currency.getName();
        for(StandardCost standardCost : standardCostGroup.getStandardCosts()) {
           this.standardCosts.add(new StandardCostVOH(standardCost));
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

    public Long getStandardCostGroupId() {
        return standardCostGroupId;
    }

    public void setStandardCostGroupId(Long standardCostGroupId) {
        this.standardCostGroupId = standardCostGroupId;
    }

    public Calendar getStart() {
        return start;
    }

    public void setStart(Calendar start) {
        this.start = start;
    }

    public List<StandardCostVOH> getStandardCosts() {
        return standardCosts;
    }

    public void setStandardCosts(List<StandardCostVOH> standardCosts) {
        this.standardCosts = standardCosts;
    }

}
