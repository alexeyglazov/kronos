/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.db.comparators;
import com.mazars.management.db.domain.*;
import java.util.Comparator;
/**
 *
 * @author Glazov
 */
public class ActRequestComparator implements Comparator<ActRequest> {
    public int compare(ActRequest o1, ActRequest o2) {
        if(o1.getDate() == null && o2.getDate() == null) {
            return 0;
        } else if(o1.getDate() == null && o2.getDate() != null) {
            return -1;
        } else if(o1.getDate() != null && o2.getDate() == null) {
            return 1;
        } else {
            return o1.getDate().compareTo(o2.getDate());
        }
    }
}
