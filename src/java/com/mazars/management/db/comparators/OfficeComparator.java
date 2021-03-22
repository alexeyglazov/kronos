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
public class OfficeComparator implements Comparator<Office> {
    public int compare(Office o1, Office o2) {
        return o1.getName().compareToIgnoreCase(o2.getName());
    }
}