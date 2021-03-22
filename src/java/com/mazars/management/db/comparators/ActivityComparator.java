/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.db.comparators;
import com.mazars.management.db.domain.Activity;
import java.util.Comparator;
/**
 *
 * @author Glazov
 */
public class ActivityComparator implements Comparator<Activity> {
    @Override
    public int compare(Activity o1, Activity o2) {
        return o1.getName().compareToIgnoreCase(o2.getName());
    }
}
