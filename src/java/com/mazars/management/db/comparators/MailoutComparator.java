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
public class MailoutComparator implements Comparator<Mailout> {
    public int compare(Mailout o1, Mailout o2) {
/**        if(o1.getCreatedAt() == null && o2.getCreatedAt() == null) {
            return 0;
        } else if(o1.getCreatedAt() == null && o2.getCreatedAt() != null) {
            return -1;
        } else if(o1.getCreatedAt() != null && o2.getCreatedAt() == null) {
            return 1;
        } else {
            return o1.getCreatedAt().compareTo(o2.getCreatedAt());
        }
    *?*/
        return 1;
    }
}
