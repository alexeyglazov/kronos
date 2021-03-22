/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.web.comparators;
import java.util.Comparator;
import com.mazars.management.web.vo.ExtendedEmployeePositionHistoryItemVO;
import java.util.List;
import java.util.ArrayList;
/**
 *
 * @author Glazov
 */
public class ExtendedEmployeePositionHistoryItemComparator implements Comparator<ExtendedEmployeePositionHistoryItemVO> {
    public int compare(ExtendedEmployeePositionHistoryItemVO o1, ExtendedEmployeePositionHistoryItemVO o2) {
        return o1.getStart().compareTo(o2.getStart());
    }
}
