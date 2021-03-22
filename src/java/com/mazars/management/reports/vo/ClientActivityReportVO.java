/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.reports.vo;

import com.mazars.management.db.domain.Currency;
import com.mazars.management.db.domain.Subdepartment;
import com.mazars.management.db.util.ClientListUtil;
import com.mazars.management.db.vo.*;
import com.mazars.management.reports.*;
import com.mazars.management.web.vo.OfficeDepartmentSubdepartment;
import java.math.BigDecimal;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
/**
 *
 * @author glazov
 */
public class ClientActivityReportVO {
    public class Row {
        private Long groupId;
        private String groupName;
        private Long clientId;
        private String clientName;
        private Boolean clientIsActive;
        private Long countryId;
        private String countryName;
        private Map<Long, Long> subdepartmentCounts = new HashMap<Long, Long>();
        private Map<Long, BigDecimal> currencyAmounts = new HashMap<Long, BigDecimal>();

        public Row(ClientListUtil.DescribedClientWithProjectAndFinancialActivityInfoItem row) {
            if(row.getGroup() != null) {
                groupId = row.getGroup().getId() ;
                groupName = row.getGroup().getName() ;
            }
            if(row.getClient() != null) {
                clientId = row.getClient().getId();
                clientName = row.getClient().getName();
                clientIsActive = row.getClient().getIsActive();
            }
            if(row.getCountry() != null) {
                countryId = row.getCountry().getId() ;
                countryName = row.getCountry().getName() ;
            }
            for(Subdepartment subdepartment : row.getSubdepartmentCounts().keySet()) {
                Long count = row.getSubdepartmentCounts().get(subdepartment);
                subdepartmentCounts.put(subdepartment.getId(), count);
            }
            for(Currency currency : row.getCurrencyAmounts().keySet()) {
                BigDecimal amount = row.getCurrencyAmounts().get(currency);
                currencyAmounts.put(currency.getId(), amount);
            }
        }

        public String getGroupName() {
            return groupName;
        }

        public void setGroupName(String groupName) {
            this.groupName = groupName;
        }

        public Long getClientId() {
            return clientId;
        }

        public void setClientId(Long clientId) {
            this.clientId = clientId;
        }

        public String getClientName() {
            return clientName;
        }

        public void setClientName(String clientName) {
            this.clientName = clientName;
        }

        public Long getCountryId() {
            return countryId;
        }

        public void setCountryId(Long countryId) {
            this.countryId = countryId;
        }

        public String getCountryName() {
            return countryName;
        }

        public void setCountryName(String countryName) {
            this.countryName = countryName;
        }

        public Map<Long, BigDecimal> getCurrencyAmounts() {
            return currencyAmounts;
        }

        public void setCurrencyAmounts(Map<Long, BigDecimal> currencyAmounts) {
            this.currencyAmounts = currencyAmounts;
        }

        public Boolean isClientIsActive() {
            return clientIsActive;
        }

        public void setClientIsActive(Boolean clientIsActive) {
            this.clientIsActive = clientIsActive;
        }

        public Long getGroupId() {
            return groupId;
        }

        public void setGroupId(Long groupId) {
            this.groupId = groupId;
        }

        public Map<Long, Long> getSubdepartmentCounts() {
            return subdepartmentCounts;
        }

        public void setSubdepartmentCounts(Map<Long, Long> subdepartmentCounts) {
            this.subdepartmentCounts = subdepartmentCounts;
        }


    }

    List<Row> rows = new LinkedList<Row>();
    YearMonthDateTime createdAt;
    private List<OfficeDepartmentSubdepartment> subdepartments = new LinkedList<OfficeDepartmentSubdepartment>();
    private List<CurrencyVO> currencies = new LinkedList<CurrencyVO>();

    public ClientActivityReportVO(ClientActivityReport clientActivityReport) {
        for(ClientListUtil.DescribedClientWithProjectAndFinancialActivityInfoItem row : clientActivityReport.getRows()) {
            this.rows.add(new ClientActivityReportVO.Row(row));
        }
        for(Subdepartment subdepartment : clientActivityReport.getSubdepartments()) {
            this.subdepartments.add(new OfficeDepartmentSubdepartment(subdepartment));
        }
        for(Currency currency : clientActivityReport.getCurrencies()) {
            this.currencies.add(new CurrencyVO(currency));
        }
        this.createdAt = new YearMonthDateTime(clientActivityReport.getCreatedAt());
    }

    public YearMonthDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(YearMonthDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public List<Row> getRows() {
        return rows;
    }

    public void setRows(List<Row> rows) {
        this.rows = rows;
    }

    public List<CurrencyVO> getCurrencies() {
        return currencies;
    }

    public void setCurrencies(List<CurrencyVO> currencies) {
        this.currencies = currencies;
    }

    public List<OfficeDepartmentSubdepartment> getSubdepartments() {
        return subdepartments;
    }

    public void setSubdepartments(List<OfficeDepartmentSubdepartment> subdepartments) {
        this.subdepartments = subdepartments;
    }
}
