/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.web.comparators;
import com.mazars.management.web.vo.PositionWithStandardPositionVO;
import java.util.Comparator;
/**
 *
 * @author Glazov
 */
public class PositionWithStandardPositionComparator implements Comparator<PositionWithStandardPositionVO> {
    public enum Mode {
        POSITION_NAME,
        POSITION_SORT_VALUE
    }
    Mode mode = Mode.POSITION_SORT_VALUE;
    private StringWithNumbersComparator stringWithNumbersComparator = new StringWithNumbersComparator();

    public PositionWithStandardPositionComparator() {
    }
    
    public PositionWithStandardPositionComparator(Mode mode) {
        this.mode = mode;
    }
    @Override
    public int compare(PositionWithStandardPositionVO o1, PositionWithStandardPositionVO o2) {
        if(o1.getStandardPositionSortValue() != o2.getStandardPositionSortValue()) {
            return o1.getStandardPositionSortValue().compareTo(o2.getStandardPositionSortValue());
        }
        if(Mode.POSITION_SORT_VALUE.equals(mode)) {
            if(o1.getPositionSortValue() == null && o2.getPositionSortValue() == null) {

            } else if(o1.getPositionSortValue() == null && o2.getPositionSortValue() != null) {
                return 1;
            } else if(o1.getPositionSortValue() != null && o2.getPositionSortValue() == null) {
                return -1;
            } else if(o1.getPositionSortValue() != null && o2.getPositionSortValue() != null) {
                Integer result = o1.getPositionSortValue().compareTo(o2.getPositionSortValue());
                if(result != 0) {
                    return result;
                }
            }
        }
        return stringWithNumbersComparator.compare(o1.getPositionName(), o2.getPositionName());
    }

    public Mode getMode() {
        return mode;
    }

    public void setMode(Mode mode) {
        this.mode = mode;
    }
    
}
