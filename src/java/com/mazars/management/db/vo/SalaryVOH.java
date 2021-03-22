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
public class SalaryVOH extends SalaryVO {
    private Long currencyId;
    public SalaryVOH() {}

    public SalaryVOH(Salary salary) {
        super(salary);
        this.currencyId = salary.getCurrency().getId();
    }

    public Long getCurrencyId() {
        return currencyId;
    }

    public void setCurrencyId(Long currencyId) {
        this.currencyId = currencyId;
    }
}
