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
public class OutOfPocketInvoiceComparator implements Comparator<OutOfPocketInvoice> {
    public int compare(OutOfPocketInvoice o1, OutOfPocketInvoice o2) {
        return o1.getDate().compareTo(o2.getDate());
    }
}
