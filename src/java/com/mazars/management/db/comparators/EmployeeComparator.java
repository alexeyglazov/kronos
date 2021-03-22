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
public class EmployeeComparator implements Comparator<Employee> {
    public enum Mode {
        USERNAME,
        FIRSTNAME,
        LASTNAME,
        FIRSTNAME_LASTNAME
    }
    Mode mode = Mode.USERNAME;

    public Mode getMode() {
        return mode;
    }

    public void setMode(Mode mode) {
        this.mode = mode;
    }

    public EmployeeComparator() {
    }

    public EmployeeComparator(Mode mode) {
        this.mode = mode;
    }
    public int compare(Employee o1, Employee o2) {
        if(Mode.USERNAME.equals(this.mode)) {
            return o1.getUserName().compareToIgnoreCase(o2.getUserName());
        } else if(Mode.FIRSTNAME.equals(this.mode)) {
            return o1.getFirstName().compareToIgnoreCase(o2.getFirstName());
        } else if(Mode.LASTNAME.equals(this.mode)) {
            return o1.getLastName().compareToIgnoreCase(o2.getLastName());
        } else {
            int c = o1.getFirstName().compareToIgnoreCase(o2.getFirstName());
            if(c == 0) {
                return o1.getLastName().compareToIgnoreCase(o2.getLastName());
            } else {
                return c;
            }
        }
    }
}
