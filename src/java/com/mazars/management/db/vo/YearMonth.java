/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.db.vo;

import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.Objects;

/**
 *
 * @author glazov
 */
public class YearMonth {
    private Integer year;
    private Integer month;

    public YearMonth() {
    }

    public YearMonth(Integer year, Integer month) {
        this.year = year;
        this.month = month;
    }

    public YearMonth(Calendar calendar) {
        year = calendar.get(Calendar.YEAR);
        month = calendar.get(Calendar.MONTH);
    }
    public YearMonth(Date date) {
        Calendar calendar = new GregorianCalendar();
        calendar.setTime(date);
        year = calendar.get(Calendar.YEAR);
        month = calendar.get(Calendar.MONTH);
    }

    public Integer getMonth() {
        return month;
    }

    public void setMonth(Integer month) {
        this.month = month;
    }

    public Integer getYear() {
        return year;
    }

    public void setYear(Integer year) {
        this.year = year;
    }
    public Calendar getCalendar() {
        Calendar calendar = new GregorianCalendar();
        calendar.set(Calendar.YEAR, year);
        calendar.set(Calendar.MONTH, month);
        calendar.set(Calendar.DATE, 1);
        calendar.set(Calendar.HOUR_OF_DAY, 0);
        calendar.set(Calendar.MINUTE, 0);
        calendar.set(Calendar.SECOND, 0);
        calendar.set(Calendar.MILLISECOND, 0);
        return calendar;
    }    
    public int compareTo(YearMonth yearMonth2) {
        return this.getCalendar().compareTo(yearMonth2.getCalendar());
    }

    @Override
    public boolean equals(Object obj) {
        if (obj == null) {
            return false;
        }
        if (!(obj instanceof YearMonth)) {
            return false;
        }
        final YearMonth other = (YearMonth) obj;
        if (!Objects.equals(this.year, other.year)) {
            return false;
        }
        if (!Objects.equals(this.month, other.month)) {
            return false;
        }
        return true;
    }

    @Override
    public int hashCode() {
        int hash = 3;
        hash = 41 * hash + Objects.hashCode(this.year);
        hash = 41 * hash + Objects.hashCode(this.month);
        return hash;
    }

    @Override
    public String toString() {
        return "{" + year + "-" + (month + 1) + '}';
    }
    public YearMonthDate getShiftedByMonths(int shift) {
        Calendar cal = this.getCalendar();
        cal.add(Calendar.MONTH, shift);
        return new YearMonthDate(cal);
    }    
}
