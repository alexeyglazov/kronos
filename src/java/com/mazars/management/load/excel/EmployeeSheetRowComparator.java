/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.load.excel;
import java.util.Comparator;
/**
 *
 * @author Glazov
 */
public class EmployeeSheetRowComparator implements Comparator<EmployeeSheet.Row> {
    public int compare(EmployeeSheet.Row o1, EmployeeSheet.Row o2) {
        return o1.getFrom().compareTo(o2.getFrom());
    }
}