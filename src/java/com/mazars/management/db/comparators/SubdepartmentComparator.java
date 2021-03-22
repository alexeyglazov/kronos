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
public class SubdepartmentComparator implements Comparator<Subdepartment> {
    public enum Type {
        NAME,
        OFFICE_DEPARTMENT_SUBDEPARTMENT
    }

    private Type type = Type.NAME;
    public SubdepartmentComparator() {
    }

    public SubdepartmentComparator(Type type) {
        this.type = type;
    }
    
    public int compare(Subdepartment o1, Subdepartment o2) {
        if(Type.NAME.equals(this.type)) {
            return compareByName(o1, o2);
        } else if(Type.OFFICE_DEPARTMENT_SUBDEPARTMENT.equals(this.type)) {
            return compareByOfficeDepartmentSubdepartment(o1, o2);
        } else {
            return 0;
        }
    }
    public int compareByName(Subdepartment o1, Subdepartment o2) {
        return o1.getName().compareToIgnoreCase(o2.getName());
    }
    public int compareByOfficeDepartmentSubdepartment(Subdepartment o1, Subdepartment o2) {
        Department department1 = o1.getDepartment();
        Department department2 = o2.getDepartment();
        Office office1 = department1.getOffice();
        Office office2 = department2.getOffice();
        if(! office1.getId().equals(office2.getId())) {
            return office1.getName().compareToIgnoreCase(office2.getName());
        }
        if(! department1.getId().equals(department2.getId())) {
            return department1.getName().compareToIgnoreCase(department2.getName());
        }
        return o1.getName().compareToIgnoreCase(o2.getName());
    }
}
