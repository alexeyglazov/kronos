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
public class EmployeePositionHistoryItemComparator implements Comparator<EmployeePositionHistoryItem> {
    public int compare(EmployeePositionHistoryItem o1, EmployeePositionHistoryItem o2) {
        return o1.getStart().compareTo(o2.getStart());
    }
}
