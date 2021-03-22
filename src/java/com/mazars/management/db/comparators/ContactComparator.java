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
public class ContactComparator implements Comparator<Contact> {
    public int compare(Contact o1, Contact o2) {
        return o1.getLastName().compareToIgnoreCase(o2.getLastName());
    }
}
