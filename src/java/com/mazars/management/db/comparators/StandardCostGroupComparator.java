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
public class StandardCostGroupComparator implements Comparator<StandardCostGroup> {
    public int compare(StandardCostGroup o1, StandardCostGroup o2) {
        return o1.getStart().compareTo(o2.getStart());
    }
}
