/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.web.comparators;
import com.mazars.management.web.vo.DescribedClient;
import com.mazars.management.web.vo.DescribedClientWithProjectAndFinancialActivityInfoItemVO;
import java.util.Comparator;
/**
 *
 * @author Glazov
 */
public class DescribedClientWithProjectAndFinancialActivityInfoItemVOComparator implements Comparator<DescribedClientWithProjectAndFinancialActivityInfoItemVO> {
    public int compare(DescribedClientWithProjectAndFinancialActivityInfoItemVO o1, DescribedClientWithProjectAndFinancialActivityInfoItemVO o2) {
        return o1.getClientName().compareToIgnoreCase(o2.getClientName());
    }
}
