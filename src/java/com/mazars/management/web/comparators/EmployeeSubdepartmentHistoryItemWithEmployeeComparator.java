/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.web.comparators;
import java.util.Comparator;
import com.mazars.management.web.vo.EmployeeSubdepartmentHistoryItemWithEmployeeVO;
import java.util.List;
import java.util.ArrayList;
/**
 *
 * @author Glazov
 */
public class EmployeeSubdepartmentHistoryItemWithEmployeeComparator implements Comparator<EmployeeSubdepartmentHistoryItemWithEmployeeVO> {
    public int compare(EmployeeSubdepartmentHistoryItemWithEmployeeVO o1, EmployeeSubdepartmentHistoryItemWithEmployeeVO o2) {
        if(o1.getEmployeeUserName() != o2.getEmployeeUserName()) {
            return o1.getEmployeeUserName().compareToIgnoreCase(o2.getEmployeeUserName());
        }
        return o1.getStart().compareTo(o2.getStart());
    }
}
