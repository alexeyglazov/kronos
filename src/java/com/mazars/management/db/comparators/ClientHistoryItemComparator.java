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
public class ClientHistoryItemComparator implements Comparator<ClientHistoryItem> {
    public int compare(ClientHistoryItem o1, ClientHistoryItem o2) {
        return o1.getCreatedAt().compareTo(o2.getCreatedAt());
    }
}
