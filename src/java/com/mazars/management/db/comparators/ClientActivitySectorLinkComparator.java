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
public class ClientActivitySectorLinkComparator implements Comparator<ClientActivitySectorLink> {
    public int compare(ClientActivitySectorLink o1, ClientActivitySectorLink o2) {
        return o1.getSortValue().compareTo(o2.getSortValue());
    }
}
