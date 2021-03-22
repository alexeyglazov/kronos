/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.db.comparators;
import java.util.Comparator;
import com.mazars.management.db.domain.*;
import java.util.List;
import java.util.ArrayList;
/**
 *
 * @author Glazov
 */
public class ClosedMonthComparator implements Comparator<ClosedMonth> {
    public int compare(ClosedMonth o1, ClosedMonth o2) {
        int yearResult = o1.getYear().compareTo(o2.getYear());
        if(yearResult != 0) {
            return yearResult;
        }
        return o1.getMonth().compareTo(o2.getMonth());
    }
}
