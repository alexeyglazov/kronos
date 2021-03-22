/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.web.comparators;
import java.util.Comparator;
import com.mazars.management.web.vo.StandardSellingRateBlockVO;
/**
 *
 * @author Glazov
 */
public class StandardSellingRateBlockComparator implements Comparator<StandardSellingRateBlockVO> {
    public int compare(StandardSellingRateBlockVO o1, StandardSellingRateBlockVO o2) {
        return o1.getStart().compareTo(o2.getStart());
    }
}
