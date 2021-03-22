/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.web.comparators;
import com.mazars.management.web.vo.DescribedClient;
import java.util.Comparator;
/**
 *
 * @author Glazov
 */
public class DescribedClientComparator implements Comparator<DescribedClient> {
    public int compare(DescribedClient o1, DescribedClient o2) {
        return o1.getName().compareTo(o2.getName());
    }
}
