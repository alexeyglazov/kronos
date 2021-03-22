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
public class MailoutHistoryItemComparator implements Comparator<MailoutHistoryItem> {
    public int compare(MailoutHistoryItem o1, MailoutHistoryItem o2) {
        return o1.getTime().compareTo(o2.getTime());
    }
}
