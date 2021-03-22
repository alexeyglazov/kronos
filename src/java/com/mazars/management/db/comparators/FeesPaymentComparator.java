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
public class FeesPaymentComparator implements Comparator<FeesPayment> {
    public int compare(FeesPayment o1, FeesPayment o2) {
        return o1.getDate().compareTo(o2.getDate());
    }
}
