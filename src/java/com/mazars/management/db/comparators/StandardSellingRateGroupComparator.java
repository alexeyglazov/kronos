/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.db.comparators;
import java.util.Comparator;
import com.mazars.management.db.domain.*;
/**
 *
 * @author Glazov
 */
public class StandardSellingRateGroupComparator implements Comparator<StandardSellingRateGroup> {
    public int compare(StandardSellingRateGroup o1, StandardSellingRateGroup o2) {
        return o1.getStart().compareTo(o2.getStart());
    }
}
