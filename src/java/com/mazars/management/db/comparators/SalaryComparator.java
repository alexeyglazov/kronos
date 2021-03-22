/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.db.comparators;
import com.mazars.management.db.domain.Salary;
import java.util.Comparator;
/**
 *
 * @author Glazov
 */
public class SalaryComparator implements Comparator<Salary> {
    @Override
    public int compare(Salary o1, Salary o2) {
        int startResult = o1.getStart().compareTo(o2.getStart());
        if(startResult != 0) {
            return startResult;
        }
        if(o1.getEnd() == null && o2.getEnd() == null) {
            return 0;
        } else if(o1.getEnd() == null && o2.getEnd() != null) {
            return 1;
        } else if(o1.getEnd() != null && o2.getEnd() == null) {
            return -1;
        } else {
            return o1.getEnd().compareTo(o2.getEnd());
        }
    }
}
