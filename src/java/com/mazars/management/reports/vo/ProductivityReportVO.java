/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.reports.vo;

import com.mazars.management.db.domain.*;
import com.mazars.management.db.domain.FeesItem.Type;
import com.mazars.management.db.vo.*;
import com.mazars.management.reports.*;
import java.math.BigDecimal;
import java.util.Calendar;
import java.util.Date;
import java.util.LinkedList;
import java.util.List;
/**
 *
 * @author glazov
 */
public class ProductivityReportVO {
    public class Row {
        private Long projectCodeId;
        private String projectCodeCode;
        private Boolean projectCodeIsClosed;
        private YearMonthDate projectCodeCreatedAt;
        private YearMonthDateTime projectCodeClosedAt;
        
        private Long groupId;
        private String groupName;
        private Long clientId;
        private String clientName;
        
        private FeesItem.Type feesItemType;
        private BigDecimal feesValue;
        private Long feesCurrencyId;
        private String feesCurrencyCode;
        private Long timeSpent;

        public Row(ProductivityReport.Row row) {
            this.projectCodeId = row.getProjectCodeId();
            this.projectCodeCode = row.getProjectCodeCode();
            this.projectCodeIsClosed = row.getProjectCodeIsClosed();
            if(row.getProjectCodeCreatedAt() != null ) {
                this.projectCodeCreatedAt = new YearMonthDateTime(row.getProjectCodeCreatedAt());
            }
            if(row.getProjectCodeClosedAt() != null ) {
                this.projectCodeClosedAt = new YearMonthDateTime(row.getProjectCodeClosedAt());
            }
            this.groupId = row.getGroupId();
            this.groupName = row.getGroupName();
            this.clientId = row.getClientId();
            this.clientName = row.getClientName();

            this.feesItemType = row.getFeesItemType();
            this.feesValue = row.getFeesValue();
            this.feesCurrencyId = row.getFeesCurrencyId();
            this.feesCurrencyCode = row.getFeesCurrencyCode();
            this.timeSpent = row.getTimeSpent();
        }

        public Long getProjectCodeId() {
            return projectCodeId;
        }

        public void setProjectCodeId(Long projectCodeId) {
            this.projectCodeId = projectCodeId;
        }

        public String getProjectCodeCode() {
            return projectCodeCode;
        }

        public void setProjectCodeCode(String projectCodeCode) {
            this.projectCodeCode = projectCodeCode;
        }

        public Boolean getProjectCodeIsClosed() {
            return projectCodeIsClosed;
        }

        public YearMonthDate getProjectCodeCreatedAt() {
            return projectCodeCreatedAt;
        }

        public void setProjectCodeCreatedAt(YearMonthDate projectCodeCreatedAt) {
            this.projectCodeCreatedAt = projectCodeCreatedAt;
        }

        public YearMonthDateTime getProjectCodeClosedAt() {
            return projectCodeClosedAt;
        }

        public void setProjectCodeClosedAt(YearMonthDateTime projectCodeClosedAt) {
            this.projectCodeClosedAt = projectCodeClosedAt;
        }

        public void setProjectCodeIsClosed(Boolean projectCodeIsClosed) {
            this.projectCodeIsClosed = projectCodeIsClosed;
        }

        public Long getGroupId() {
            return groupId;
        }

        public void setGroupId(Long groupId) {
            this.groupId = groupId;
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

        public Type getFeesItemType() {
            return feesItemType;
        }

        public void setFeesItemType(Type feesItemType) {
            this.feesItemType = feesItemType;
        }

        public BigDecimal getFeesValue() {
            return feesValue;
        }

        public void setFeesValue(BigDecimal feesValue) {
            this.feesValue = feesValue;
        }

        public Long getFeesCurrencyId() {
            return feesCurrencyId;
        }

        public void setFeesCurrencyId(Long feesCurrencyId) {
            this.feesCurrencyId = feesCurrencyId;
        }

        public String getFeesCurrencyCode() {
            return feesCurrencyCode;
        }

        public void setFeesCurrencyCode(String feesCurrencyCode) {
            this.feesCurrencyCode = feesCurrencyCode;
        }

        public Long getTimeSpent() {
            return timeSpent;
        }

        public void setTimeSpent(Long timeSpent) {
            this.timeSpent = timeSpent;
        }
    }

    List<Row> rows = new LinkedList<Row>();
    private List<CurrencyVO> currencies = new LinkedList<CurrencyVO>();
    YearMonthDateTime createdAt;

    private String formOfficeName;
    private String formDepartmentName;
    private String formSubdepartmentName;
    private YearMonthDate formStartDate;
    private YearMonthDate formEndDate;

    public String getFormOfficeName() {
        return formOfficeName;
    }

    public void setFormOfficeName(String formOfficeName) {
        this.formOfficeName = formOfficeName;
    }

    public String getFormDepartmentName() {
        return formDepartmentName;
    }

    public void setFormDepartmentName(String formDepartmentName) {
        this.formDepartmentName = formDepartmentName;
    }

    public String getFormSubdepartmentName() {
        return formSubdepartmentName;
    }

    public void setFormSubdepartmentName(String formSubdepartmentName) {
        this.formSubdepartmentName = formSubdepartmentName;
    }

    public YearMonthDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(YearMonthDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public List<CurrencyVO> getCurrencies() {
        return currencies;
    }

    public void setCurrencies(List<CurrencyVO> currencies) {
        this.currencies = currencies;
    }

    public YearMonthDate getFormEndDate() {
        return formEndDate;
    }

    public void setFormEndDate(YearMonthDate formEndDate) {
        this.formEndDate = formEndDate;
    }


    public YearMonthDate getFormStartDate() {
        return formStartDate;
    }

    public void setFormStartDate(YearMonthDate formStartDate) {
        this.formStartDate = formStartDate;
    }

    public List<Row> getRows() {
        return rows;
    }

    public void setRows(List<Row> rows) {
        this.rows = rows;
    }

    public ProductivityReportVO(ProductivityReport productivityReport) {
        this.createdAt = new YearMonthDateTime(productivityReport.getCreatedAt());
        this.formStartDate = productivityReport.getFormStartDate();
        this.formEndDate = productivityReport.getFormEndDate();
        if(productivityReport.getFormOffice() != null) {
            this.formOfficeName = productivityReport.getFormOffice().getName();
        }
        if(productivityReport.getFormDepartment() != null) {
            this.formDepartmentName = productivityReport.getFormDepartment().getName();
        }
        if(productivityReport.getFormSubdepartment() != null) {
            this.formSubdepartmentName = productivityReport.getFormSubdepartment().getName();
        }
        
        for(ProductivityReport.Row row : productivityReport.getRows()) {
            this.rows.add(new ProductivityReportVO.Row(row));
        }
        for(Currency currency : productivityReport.getCurrencies()) {
            this.currencies.add(new CurrencyVO(currency));
        }
    }
}
