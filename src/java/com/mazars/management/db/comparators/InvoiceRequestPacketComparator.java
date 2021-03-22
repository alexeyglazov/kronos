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
public class InvoiceRequestPacketComparator implements Comparator<InvoiceRequestPacket> {
    public int compare(InvoiceRequestPacket o1, InvoiceRequestPacket o2) {
        if(o1.getCreatedAt() == null && o2.getCreatedAt() == null) {
            return 0;
        } else if(o1.getCreatedAt() == null && o2.getCreatedAt() != null) {
            return -1;
        } else if(o1.getCreatedAt() != null && o2.getCreatedAt() == null) {
            return 1;
        } else {
            return o1.getCreatedAt().compareTo(o2.getCreatedAt());
        }
    }
}
