/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.db.comparators;
import com.mazars.management.db.domain.LeavesItem;
import java.util.Comparator;
/**
 *
 * @author Glazov
 */
public class LeavesItemComparator implements Comparator<LeavesItem> {
    public int compare(LeavesItem o1, LeavesItem o2) {
        return o1.getStart().compareTo(o2.getStart());
    }
}
