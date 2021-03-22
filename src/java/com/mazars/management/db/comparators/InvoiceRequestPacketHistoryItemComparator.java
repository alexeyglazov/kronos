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
public class InvoiceRequestPacketHistoryItemComparator implements Comparator<InvoiceRequestPacketHistoryItem> {
    public int compare(InvoiceRequestPacketHistoryItem o1, InvoiceRequestPacketHistoryItem o2) {
        if(o1.getTime() == null && o2.getTime() == null) {
            return 0;
        } else if(o1.getTime() == null && o2.getTime() != null) {
            return -1;
        } else if(o1.getTime() != null && o2.getTime() == null) {
            return 1;
        } else {
            return o1.getTime().compareTo(o2.getTime());
        }
    }
}
