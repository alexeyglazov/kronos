/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.db.comparators;
import java.util.Comparator;
import com.mazars.management.db.domain.*;
import com.mazars.management.web.comparators.StringWithNumbersComparator;
/**
 *
 * @author Glazov
 */
public class StandardSellingRateComparator implements Comparator<StandardSellingRate> {
    private StringWithNumbersComparator stringWithNumbersComparator = new StringWithNumbersComparator();
        @Override
        public int compare(StandardSellingRate o1, StandardSellingRate o2) {
            if(o1.getPosition().getStandardPosition().getSortValue() != o2.getPosition().getStandardPosition().getSortValue()) {
                return o1.getPosition().getStandardPosition().getSortValue().compareTo(o2.getPosition().getStandardPosition().getSortValue());
            }
            return stringWithNumbersComparator.compare(o1.getPosition().getName(), o2.getPosition().getName());
        }
}
