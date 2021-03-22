/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.web.vo;

import com.mazars.management.db.domain.Currency;
import com.mazars.management.db.domain.Subdepartment;
import com.mazars.management.db.util.ClientListUtil;
import com.mazars.management.db.util.ClientListUtil.ClientProjectActivityInfoItem;
import com.mazars.management.db.vo.YearMonthDateTime;
import java.math.BigDecimal;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

/**
 *
 * @author glazov
 */
public class DescribedClientWithProjectAndFinancialActivityInfoItemVO extends ClientAndGroupVO {
    private Map<Long, Long> subdepartmentCounts = new HashMap<Long, Long>();
    private Map<Long, BigDecimal> currencyAmounts = new HashMap<Long, BigDecimal>();

    public DescribedClientWithProjectAndFinancialActivityInfoItemVO() {
    }

    public DescribedClientWithProjectAndFinancialActivityInfoItemVO(ClientListUtil.DescribedClientWithProjectAndFinancialActivityInfoItem describedClientWithProjectAndFinancialActivityInfoItem) {
        super(describedClientWithProjectAndFinancialActivityInfoItem.getClient(), describedClientWithProjectAndFinancialActivityInfoItem.getGroup());
        for(Subdepartment subdepartment : describedClientWithProjectAndFinancialActivityInfoItem.getSubdepartmentCounts().keySet()) {
            Long count = describedClientWithProjectAndFinancialActivityInfoItem.getSubdepartmentCounts().get(subdepartment);
            subdepartmentCounts.put(subdepartment.getId(), count);
        }
        for(Currency currency : describedClientWithProjectAndFinancialActivityInfoItem.getCurrencyAmounts().keySet()) {
            BigDecimal amount = describedClientWithProjectAndFinancialActivityInfoItem.getCurrencyAmounts().get(currency);
            currencyAmounts.put(currency.getId(), amount);
        }
    }
    public Map<Long, Long> getSubdepartmentCounts() {
        return subdepartmentCounts;
    }

    public void setSubdepartmentCounts(Map<Long, Long> subdepartmentCounts) {
        this.subdepartmentCounts = subdepartmentCounts;
    }  
    
    public static List<DescribedClientWithProjectAndFinancialActivityInfoItemVO> getList(List<ClientListUtil.DescribedClientWithProjectAndFinancialActivityInfoItem> describedClientWithProjectAndFinancialActivityInfoItems) {
        List<DescribedClientWithProjectAndFinancialActivityInfoItemVO> describedClientWithProjectAndFinancialActivityInfoItemVOs = new LinkedList<DescribedClientWithProjectAndFinancialActivityInfoItemVO>();
        for(ClientListUtil.DescribedClientWithProjectAndFinancialActivityInfoItem describedClientWithProjectAndFinancialActivityInfoItem : describedClientWithProjectAndFinancialActivityInfoItems) {
            describedClientWithProjectAndFinancialActivityInfoItemVOs.add(new DescribedClientWithProjectAndFinancialActivityInfoItemVO(describedClientWithProjectAndFinancialActivityInfoItem));
        }
        return describedClientWithProjectAndFinancialActivityInfoItemVOs;
    }
}
