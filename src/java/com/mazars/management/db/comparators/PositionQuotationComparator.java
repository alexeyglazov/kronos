/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.db.comparators;
import com.mazars.management.db.domain.*;
import com.mazars.management.web.comparators.StringWithNumbersComparator;
import java.util.Comparator;
/**
 *
 * @author Glazov
 */
public class PositionQuotationComparator implements Comparator<PositionQuotation> {
    private StringWithNumbersComparator stringWithNumbersComparator = new StringWithNumbersComparator();
    @Override
    public int compare(PositionQuotation o1, PositionQuotation o2) {
        if(o1.getPosition().getStandardPosition().getSortValue() != o2.getPosition().getStandardPosition().getSortValue()) {
            return o1.getPosition().getStandardPosition().getSortValue().compareTo(o2.getPosition().getStandardPosition().getSortValue());
        }
        return stringWithNumbersComparator.compare(o1.getPosition().getName(), o2.getPosition().getName());
    }
}
