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
public class FeesAdvanceComparator implements Comparator<FeesAdvance> {
    public int compare(FeesAdvance o1, FeesAdvance o2) {
        return o1.getDate().compareTo(o2.getDate());
    }
}
