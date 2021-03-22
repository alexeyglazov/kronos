/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.web.comparators;
import java.util.Comparator;
import com.mazars.management.web.vo.StandardCostBlockVO;
/**
 *
 * @author Glazov
 */
public class StandardCostBlockComparator implements Comparator<StandardCostBlockVO> {
    public int compare(StandardCostBlockVO o1, StandardCostBlockVO o2) {
        return o1.getStart().compareTo(o2.getStart());
    }
}
