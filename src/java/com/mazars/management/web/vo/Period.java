/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mazars.management.web.vo;

import com.mazars.management.db.domain.ProjectCode;

/**
 *
 * @author glazov
 */
public class Period {
    private ProjectCode.PeriodType type;
    private ProjectCode.PeriodQuarter quarter;
    private ProjectCode.PeriodMonth month;
    private ProjectCode.PeriodDate date;
    private Integer counter;

    public Period() {
    }

    public ProjectCode.PeriodType getType() {
        return type;
    }

    public void setType(ProjectCode.PeriodType type) {
        this.type = type;
    }

    public ProjectCode.PeriodQuarter getQuarter() {
        return quarter;
    }

    public void setQuarter(ProjectCode.PeriodQuarter quarter) {
        this.quarter = quarter;
    }

    public ProjectCode.PeriodMonth getMonth() {
        return month;
    }

    public void setMonth(ProjectCode.PeriodMonth month) {
        this.month = month;
    }

    public ProjectCode.PeriodDate getDate() {
        return date;
    }

    public void setDate(ProjectCode.PeriodDate date) {
        this.date = date;
    }

    public Integer getCounter() {
        return counter;
    }

    public void setCounter(Integer counter) {
        this.counter = counter;
    }
}
