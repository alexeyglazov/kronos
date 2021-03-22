/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.db.vo;

import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;

/**
 *
 * @author glazov
 */
public class YearMonthDateTime extends YearMonthDate {
    private Integer hour;
    private Integer minute;
    private Integer second;

    public YearMonthDateTime() {
    }

    public YearMonthDateTime(Integer year, Integer month, Integer dayOfMonth, Integer hour, Integer minute, Integer second) {
        super(year, month, dayOfMonth);
        this.hour = hour;
        this.minute = minute;
        this.second = second;
    }

    public YearMonthDateTime(Calendar calendar) {
        super(calendar.get(Calendar.YEAR), calendar.get(Calendar.MONTH), calendar.get(Calendar.DAY_OF_MONTH));
        hour = calendar.get(Calendar.HOUR_OF_DAY);
        minute = calendar.get(Calendar.MINUTE);
        second = calendar.get(Calendar.SECOND);
    }
    public YearMonthDateTime(Date date) {
        super(date);
        Calendar calendar = new GregorianCalendar();
        calendar.setTime(date);
        hour = calendar.get(Calendar.HOUR_OF_DAY);
        minute = calendar.get(Calendar.MINUTE);
        second = calendar.get(Calendar.SECOND);
    }
    public Integer getHour() {
        return hour;
    }

    public void setHour(Integer hour) {
        this.hour = hour;
    }

    public Integer getMinute() {
        return minute;
    }

    public void setMinute(Integer minute) {
        this.minute = minute;
    }

    public Integer getSecond() {
        return second;
    }

    public void setSecond(Integer second) {
        this.second = second;
    }
    public Calendar getCalendar() {
        Calendar calendar = new GregorianCalendar();
        calendar.set(Calendar.YEAR, getYear());
        calendar.set(Calendar.MONTH, getMonth());
        calendar.set(Calendar.DATE, getDayOfMonth());
        calendar.set(Calendar.HOUR_OF_DAY, hour);
        calendar.set(Calendar.MINUTE, minute);
        calendar.set(Calendar.SECOND, second);
        calendar.set(Calendar.MILLISECOND, 0);
        return calendar;
    }
    public int compareTo(YearMonthDateTime yearMonthDate2) {
        return this.getCalendar().compareTo(yearMonthDate2.getCalendar());
    }

    @Override
    public boolean equals(Object obj) {
        if(obj == null) {
            return false;
        }
        if (obj == this) {
            return true;
        }
        if (obj.getClass() != getClass()) {
            return false;
        }
        YearMonthDateTime obj2 = (YearMonthDateTime)obj;
        if(partsEqual(getYear(), obj2.getYear()) && partsEqual(getMonth(), obj2.getMonth()) && partsEqual(getDayOfMonth(), obj2.getDayOfMonth()) && partsEqual(this.hour, obj2.getHour()) && partsEqual(this.minute, obj2.getMinute()) && partsEqual(this.second, obj2.getSecond())) {
            return true;
        } else {
            return false;
        }
    }
    private boolean partsEqual(Integer a, Integer b) {
        if(a == null && b == null) {
            return true;
        } else if(a == null && b != null) {
            return false;
        } else if(a != null && b == null) {
            return false;
        } else {
            return a.equals(b);
        }
    }

    @Override
    public String toString() {
        return "YearMonthDateTime{" + "year=" + getYear() + ", month=" + getMonth() + ", dayOfMonth=" + getDayOfMonth() + ", hour=" + hour + ", minute=" + minute + ", second=" + second + '}';
    }
    public YearMonthDateTime getShifted(int shift) {
        Calendar cal = this.getCalendar();
        cal.add(Calendar.DAY_OF_MONTH, shift);
        return new YearMonthDateTime(cal);
    }
}
