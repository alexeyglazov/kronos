/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.db.vo;

/**
 *
 * @author glazov
 */
public class DateRange {
    private YearMonthDate from;
    private YearMonthDate to;

    public DateRange() {
    }

    public YearMonthDate getFrom() {
        return from;
    }

    public void setFrom(YearMonthDate from) {
        this.from = from;
    }

    public YearMonthDate getTo() {
        return to;
    }

    public void setTo(YearMonthDate to) {
        this.to = to;
    }

}
