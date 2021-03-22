/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.db.comparators;
import java.util.Comparator;
import com.mazars.management.db.domain.*;
import java.util.List;
import java.util.ArrayList;
import com.mazars.management.web.comparators.StringWithNumbersComparator;
/**
 *
 * @author Glazov
 */
public class PositionComparator implements Comparator<Position> {
    public enum Mode {
        NAME,
        STRING_WITH_NUMBERS_NAME,
        STANDARD_POSITION_AND_STRING_WITH_NUMBERS_NAME
    };
    private Mode mode;
    private StringWithNumbersComparator stringWithNumbersComparator = new StringWithNumbersComparator();

    public PositionComparator() {
        mode = Mode.STRING_WITH_NUMBERS_NAME;
    }
    public PositionComparator(Mode mode) {
        this.mode = mode;
    }
    
    @Override
    public int compare(Position o1, Position o2) {
        if(mode == null || Mode.NAME.equals(mode)) {
            return compareByName(o1, o2);
        } else if(mode == null || Mode.STRING_WITH_NUMBERS_NAME.equals(mode)) {
            return compareByStringWithNumbersName(o1, o2);
        } else if(mode == null || Mode.STANDARD_POSITION_AND_STRING_WITH_NUMBERS_NAME.equals(mode)) {
            return compareByStandardPositionAndStringWithNumbersName(o1, o2);
        }
        return 1;
    }
    private int compareByName(Position o1, Position o2) {
        return o1.getName().compareToIgnoreCase(o2.getName());
    }
    private int compareByStringWithNumbersName(Position o1, Position o2) {
        return stringWithNumbersComparator.compare(o1.getName(), o2.getName());
    }
    private int compareByStandardPositionAndStringWithNumbersName(Position o1, Position o2) {
        if(o1.getStandardPosition().getSortValue() != o2.getStandardPosition().getSortValue()) {
            return o1.getStandardPosition().getSortValue().compareTo(o2.getStandardPosition().getSortValue());
        }
        return stringWithNumbersComparator.compare(o1.getName(), o2.getName());
    }
    public Mode getMode() {
        return mode;
    }

    public void setMode(Mode mode) {
        this.mode = mode;
    }
}
