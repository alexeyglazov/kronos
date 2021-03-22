/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.db.vo;

import com.mazars.management.db.comparators.YearMonthDateComparator;
import java.util.Calendar;
import java.util.Collections;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.List;

/**
 *
 * @author glazov
 */
public class YearMonthDate {
    private Integer year;
    private Integer month;
    private Integer dayOfMonth;

    public YearMonthDate() {
    }

    public YearMonthDate(Integer year, Integer month, Integer dayOfMonth) {
        this.year = year;
        this.month = month;
        this.dayOfMonth = dayOfMonth;
    }

    public YearMonthDate(Calendar calendar) {
        year = calendar.get(Calendar.YEAR);
        month = calendar.get(Calendar.MONTH);
        dayOfMonth = calendar.get(Calendar.DAY_OF_MONTH);
    }
    public YearMonthDate(Date date) {
        Calendar calendar = new GregorianCalendar();
        calendar.setTime(date);
        year = calendar.get(Calendar.YEAR);
        month = calendar.get(Calendar.MONTH);
        dayOfMonth = calendar.get(Calendar.DAY_OF_MONTH);
    }

    public Integer getDayOfMonth() {
        return dayOfMonth;
    }

    public void setDayOfMonth(Integer dayOfMonth) {
        this.dayOfMonth = dayOfMonth;
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
        calendar.set(Calendar.DATE, dayOfMonth);
        calendar.set(Calendar.HOUR_OF_DAY, 0);
        calendar.set(Calendar.MINUTE, 0);
        calendar.set(Calendar.SECOND, 0);
        calendar.set(Calendar.MILLISECOND, 0);
        return calendar;
    }
    public int compareTo(YearMonthDate yearMonthDate2) {
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
        YearMonthDate obj2 = (YearMonthDate)obj;
        if(partsEqual(this.year, obj2.getYear()) && partsEqual(this.month, obj2.getMonth()) && partsEqual(this.dayOfMonth, obj2.getDayOfMonth())) {
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
        return "{" + year + "-" + (month + 1) + "-" + dayOfMonth + '}';
    }
    public YearMonthDate getShifted(int shift) {
        Calendar cal = this.getCalendar();
        cal.add(Calendar.DAY_OF_MONTH, shift);
        return new YearMonthDate(cal);
    }
    public static int getDaysInRange(YearMonthDate start, YearMonthDate end) {
        int days = 0;
        if(start.getYear().equals(end.getYear()) && start.getMonth().equals(end.getMonth())) {
            days += (1 + end.getDayOfMonth() - start.getDayOfMonth());
        } else if(start.getYear().equals(end.getYear())) {
            YearMonthDate endTmp = new YearMonthDate(start.getYear(), start.getMonth(), YearMonthDate.getDaysInCertainYearMonth(start.getYear(), start.getMonth()));
            YearMonthDate startTmp = new YearMonthDate(end.getYear(), end.getMonth(), 1);
            days += getDaysInRange(start, endTmp);
            if(end.getMonth() - start.getMonth() > 1) {
                for(int m = (start.getMonth() + 1); m <= (end.getMonth() - 1); m++) {
                    days += getDaysInCertainYearMonth(start.getYear(), m);
                }
            }        
            days += getDaysInRange(startTmp, end);        
        } else {
            YearMonthDate endTmp = new YearMonthDate(start.getYear(), 11, 31);
            YearMonthDate startTmp = new YearMonthDate(end.getYear(), 0, 1);
            days += getDaysInRange(start, endTmp);
            if(end.getYear() - start.getYear() > 1) {
                for(int y = (start.getYear() + 1); y <= (end.getYear() - 1); y++) {
                    Calendar calendar = (new YearMonthDate(y, 0, 1)).getCalendar();
                    days += calendar.getActualMaximum(Calendar.DAY_OF_YEAR);
                }
            }        
            days += getDaysInRange(startTmp, end);
        }
        return days;
    }
    public static int getDaysCountInRangeWithoutDays(YearMonthDate start, YearMonthDate end, List<YearMonthDate> days) {
        List<YearMonthDateRange> daysRanges = YearMonthDateRange.getRangesFromNeighbourDays(days);
        List<YearMonthDateRange> ranges = YearMonthDateRange.getSubtraction(new YearMonthDateRange(start, end), daysRanges);
        int count = 0;
        for(YearMonthDateRange range : ranges) {
            count += YearMonthDate.getDaysInRange(range.getStart(), range.getEnd());
        }
        return count;
    }
    public static int getDaysInCertainYearMonth(int year, int month) {
        Calendar calendar = (new YearMonthDate(year, month, 1)).getCalendar();
        return calendar.getActualMaximum(Calendar.DAY_OF_MONTH);
    }
}
