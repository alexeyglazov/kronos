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
public class CountryCurrencyComparator implements Comparator<CountryCurrency> {
    public int compare(CountryCurrency o1, CountryCurrency o2) {
        return o1.getCurrency().getName().compareToIgnoreCase(o2.getCurrency().getName());
    }
}
