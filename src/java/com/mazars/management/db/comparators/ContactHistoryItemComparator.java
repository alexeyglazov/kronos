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
public class ContactHistoryItemComparator implements Comparator<ContactHistoryItem> {
    public int compare(ContactHistoryItem o1, ContactHistoryItem o2) {
        return o1.getModifiedAt().compareTo(o2.getModifiedAt());
    }
}
