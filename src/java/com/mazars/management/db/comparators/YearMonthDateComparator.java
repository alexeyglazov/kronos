/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.db.comparators;
import com.mazars.management.db.vo.YearMonthDate;
import java.util.Comparator;
/**
 *
 * @author Glazov
 */
public class YearMonthDateComparator implements Comparator<YearMonthDate> {
    @Override
    public int compare(YearMonthDate o1, YearMonthDate o2) {
        return o1.getCalendar().compareTo(o2.getCalendar());
    }
}
