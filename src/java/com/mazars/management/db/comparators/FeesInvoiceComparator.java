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
public class FeesInvoiceComparator implements Comparator<FeesInvoice> {
    public int compare(FeesInvoice o1, FeesInvoice o2) {
        return o1.getDate().compareTo(o2.getDate());
    }
}
