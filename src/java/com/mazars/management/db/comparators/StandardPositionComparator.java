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
public class StandardPositionComparator implements Comparator<StandardPosition> {
    public int compare(StandardPosition o1, StandardPosition o2) {
        return o1.getSortValue().compareTo(o2.getSortValue());
    }
}
