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
public class CountryComparator implements Comparator<Country> {
    public int compare(Country o1, Country o2) {
        return o1.getName().compareToIgnoreCase(o2.getName());
    }
}
