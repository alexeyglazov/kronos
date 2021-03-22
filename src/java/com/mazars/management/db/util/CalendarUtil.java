/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.db.util;
import java.util.Calendar;
import java.util.GregorianCalendar;
/**
 *
 * @author glazov
 */
public class CalendarUtil {
    public static Calendar getBeginDateForYearMonth(int year, int month) {
        Calendar beginDate = new GregorianCalendar();
        beginDate.set(Calendar.YEAR, year);
        beginDate.set(Calendar.MONTH, month);
        beginDate.set(Calendar.DATE, 1);
        beginDate.set(Calendar.HOUR_OF_DAY, 0);
        beginDate.set(Calendar.MINUTE, 0);
        beginDate.set(Calendar.SECOND, 0);
        beginDate.set(Calendar.MILLISECOND, 0);
        return beginDate;
    }
    public static Calendar getEndDateForYearMonth(int year, int month) {
        Calendar endDate = new GregorianCalendar();
        endDate.set(Calendar.YEAR, year);
        endDate.set(Calendar.MONTH, month + 1);
        endDate.set(Calendar.DATE, 1);
        endDate.set(Calendar.HOUR_OF_DAY, 0);
        endDate.set(Calendar.MINUTE, 0);
        endDate.set(Calendar.SECOND, 0);
        endDate.set(Calendar.MILLISECOND, 0);
        endDate.add(Calendar.MILLISECOND, -1);
        return endDate;
    }
    public static Calendar getToday() {
        Calendar today = new GregorianCalendar();
        today.set(Calendar.HOUR_OF_DAY, 0);
        today.set(Calendar.MINUTE, 0);
        today.set(Calendar.SECOND, 0);
        today.set(Calendar.MILLISECOND, 0);
        return today;
    }
    public static Calendar getYesterday() {
        Calendar yesterday = getToday();
        yesterday.add(Calendar.DAY_OF_MONTH, -1);
        return yesterday;
    }
    public static Calendar getMonthStart(Calendar calendar) {
        Calendar monthStart = new GregorianCalendar();
        CalendarUtil.truncateTime(monthStart);
        monthStart.set(Calendar.YEAR, calendar.get(Calendar.YEAR));
        monthStart.set(Calendar.MONTH, calendar.get(Calendar.MONTH));
        monthStart.set(Calendar.DAY_OF_MONTH, 1);
        return monthStart;
    }
    public static void truncateTime(Calendar calendar) {
        if(calendar == null) {
            return;
        }
        calendar.set(Calendar.HOUR_OF_DAY, 0);
        calendar.set(Calendar.MINUTE, 0);
        calendar.set(Calendar.SECOND, 0);
        calendar.set(Calendar.MILLISECOND, 0);
    }
    public static int getWorkingDaysCount(Calendar start, Calendar end) {
        if(start == null) {
            throw new IllegalArgumentException("Argument start can not be equal null");
        }
        if(end == null) {
            throw new IllegalArgumentException("Argument end can not be equal null");
        }
        int count = 0;
        Calendar current = new GregorianCalendar(start.get(Calendar.YEAR), start.get(Calendar.MONTH), start.get(Calendar.DAY_OF_MONTH));
        truncateTime(current);
        while(! current.after(end)) {
           int day = current.get(Calendar.DAY_OF_WEEK);
           if(day != 1 && day != 7) {
                count++;
           }
           current.add(Calendar.DAY_OF_YEAR, 1);
        }
        return count;
    }
}
