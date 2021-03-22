/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.db.comparators;
import com.mazars.management.db.vo.YearMonth;
import java.util.Comparator;
/**
 *
 * @author Glazov
 */
public class YearMonthComparator implements Comparator<YearMonth> {
    @Override
    public int compare(YearMonth o1, YearMonth o2) {
        return o1.getCalendar().compareTo(o2.getCalendar());
    }
}
