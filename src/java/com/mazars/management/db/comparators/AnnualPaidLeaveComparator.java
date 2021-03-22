/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.db.comparators;
import com.mazars.management.db.domain.AnnualPaidLeave;
import java.util.Comparator;
/**
 *
 * @author Glazov
 */
public class AnnualPaidLeaveComparator implements Comparator<AnnualPaidLeave> {
    public int compare(AnnualPaidLeave o1, AnnualPaidLeave o2) {
        if(o1.getStart() == null && o2.getStart() == null) {
            return 0;
        } else if(o1.getStart() == null && o2.getStart() != null) {
            return -1;
        } else if(o1.getStart() != null && o2.getStart() == null) {
            return 1;
        } else {
            return o1.getStart().compareTo(o2.getStart());
        }
        
    }
}
