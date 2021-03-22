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
public class PlanningTypeComparator implements Comparator<PlanningType> {
    public int compare(PlanningType o1, PlanningType o2) {
        return o1.getName().compareToIgnoreCase(o2.getName());
    }
}
