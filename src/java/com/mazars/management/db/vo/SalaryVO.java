/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.db.vo;
import com.mazars.management.db.domain.*;
import java.math.BigDecimal;
import java.util.Calendar;


/**
 *
 * @author glazov
 */
public class SalaryVO {
    private Long id;
    private BigDecimal value;
    private Calendar start;
    private Calendar end;
    public SalaryVO() {};

    public SalaryVO(Salary salary) {
        this.id = salary.getId();
        this.value = salary.getValue();
        this.start = salary.getStart();
        this.end = salary.getEnd();
    }

    public Calendar getEnd() {
        return end;
    }

    public void setEnd(Calendar end) {
        this.end = end;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Calendar getStart() {
        return start;
    }

    public void setStart(Calendar start) {
        this.start = start;
    }

    public BigDecimal getValue() {
        return value;
    }

    public void setValue(BigDecimal value) {
        this.value = value;
    }
    
}
