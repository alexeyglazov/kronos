/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.reports.vo;

import com.mazars.management.db.vo.*;
import com.mazars.management.reports.*;
import com.mazars.management.reports.InvoicingReport.Signed;
import java.math.BigDecimal;
import java.util.*;

/**
 *
 * @author glazov
 */
public class InvoicingReportVO {
    public class RowVO {
        private Long subdepartmentId;
        private String subdepartmentName;
        private Long departmentId;
        private String departmentName;
        private Long officeId;
        private String officeName;
        private Long groupId;
        private String groupName;
        private Long clientId;
        private String clientName;
        private Long projectCodeId;
        private String projectCodeCode;
        private String projectCodeDescription;
        private String projectCodeInChargePerson;
        private String projectCodeInChargePartner;                
        private Integer projectCodeFinancialYear;
        private Boolean projectCodeIsClosed;
        private YearMonthDateTime projectCodeClosedAt;
        private YearMonthDateTime projectCodeCreatedAt;
        private Boolean projectCodeIsDead;
        private YearMonthDate lastFillingDay;
        private Long timeSpent;
        private FeesItemVOH feesItem;
        private OutOfPocketItemVOH outOfPocketItem;

        private BigDecimal feesAdvanceTotalAmount;
        private BigDecimal feesInvoiceTotalAmount;
        private BigDecimal feesInvoiceTotalVatIncludedAmount;
        private BigDecimal feesPaymentTotalAmount;
        private BigDecimal feesPaymentTotalCvAmount;
        private BigDecimal feesActTotalAmount;
        private BigDecimal feesActTotalCvAmount;
        private InvoicingReport.Signed feesActIsSigned;
        private BigDecimal outOfPocketInvoiceTotalAmount;
        private BigDecimal outOfPocketInvoiceTotalVatIncludedAmount;
        private BigDecimal outOfPocketPaymentTotalAmount;
        private BigDecimal outOfPocketPaymentTotalCvAmount;
        private BigDecimal outOfPocketActTotalAmount;
        private BigDecimal outOfPocketActTotalCvAmount;
        private InvoicingReport.Signed outOfPocketActIsSigned;
        
        public RowVO(InvoicingReport.Row row) {
            if(row.getOffice() != null) {
                officeId = row.getOffice().getId();
                officeName = row.getOffice().getName();
            }
            if(row.getDepartment() != null) {
                departmentId = row.getDepartment().getId();
                departmentName = row.getDepartment().getName();
            }
            if(row.getSubdepartment() != null) {
                subdepartmentId = row.getSubdepartment().getId();
                subdepartmentName = row.getSubdepartment().getName();
            }
            if(row.getGroup() != null) {
                groupId = row.getGroup().getId();
                groupName = row.getGroup().getName();
            }    
            if(row.getClient() != null) {
                clientId = row.getClient().getId();
                clientName = row.getClient().getName();
            }    
            if(row.getProjectCode() != null) {
                projectCodeId = row.getProjectCode().getId();
                projectCodeCode = row.getProjectCode().getCode();
                projectCodeDescription = row.getProjectCode().getDescription();
                projectCodeFinancialYear = row.getProjectCode().getFinancialYear();
                projectCodeIsClosed = row.getProjectCode().getIsClosed();
                if(row.getProjectCode().getClosedAt() != null) {
                    projectCodeClosedAt = new YearMonthDateTime(row.getProjectCode().getClosedAt());
                }
                if(row.getProjectCode().getCreatedAt() != null) {
                    projectCodeCreatedAt = new YearMonthDateTime(row.getProjectCode().getCreatedAt());
                }
                projectCodeIsDead = row.getProjectCode().getIsDead();
                if(row.getProjectCode().getInChargePerson() != null) {
                    projectCodeInChargePerson = row.getProjectCode().getInChargePerson().getFirstName() + " " + row.getProjectCode().getInChargePerson().getLastName();
                }
                if(row.getProjectCode().getInChargePartner() != null) {
                    projectCodeInChargePartner = row.getProjectCode().getInChargePartner().getFirstName() + " " + row.getProjectCode().getInChargePartner().getLastName();
                }
            }
            if(row.getLastFillingDay() != null) {
                lastFillingDay = new YearMonthDate(row.getLastFillingDay());
            }
            timeSpent = row.getTimeSpent();
            if(row.getFeesItem() != null) {
                feesItem = new FeesItemVOH(row.getFeesItem());
            }
            if(row.getOutOfPocketItem() != null) {
                outOfPocketItem = new OutOfPocketItemVOH(row.getOutOfPocketItem());
            }
            feesAdvanceTotalAmount = row.getFeesAdvanceTotalAmount();
            feesInvoiceTotalAmount = row.getFeesInvoiceTotalAmount();
            feesInvoiceTotalVatIncludedAmount = row.getFeesInvoiceTotalVatIncludedAmount();
            feesPaymentTotalAmount = row.getFeesPaymentTotalAmount();
            feesPaymentTotalCvAmount = row.getFeesPaymentTotalCvAmount();
            feesActTotalAmount = row.getFeesActTotalAmount();
            feesActTotalCvAmount = row.getFeesActTotalCvAmount();
            feesActIsSigned = row.getFeesActIsSigned();
            outOfPocketInvoiceTotalAmount = row.getOutOfPocketInvoiceTotalAmount();
            outOfPocketInvoiceTotalVatIncludedAmount = row.getOutOfPocketInvoiceTotalVatIncludedAmount();
            outOfPocketPaymentTotalAmount = row.getOutOfPocketPaymentTotalAmount();
            outOfPocketPaymentTotalCvAmount = row.getOutOfPocketPaymentTotalCvAmount();
            outOfPocketActTotalAmount = row.getOutOfPocketActTotalAmount();
            outOfPocketActTotalCvAmount = row.getOutOfPocketActTotalCvAmount();
            outOfPocketActIsSigned = row.getOutOfPocketActIsSigned();
        }

        public BigDecimal getFeesInvoiceTotalVatIncludedAmount() {
            return feesInvoiceTotalVatIncludedAmount;
        }

        public void setFeesInvoiceTotalVatIncludedAmount(BigDecimal feesInvoiceTotalVatIncludedAmount) {
            this.feesInvoiceTotalVatIncludedAmount = feesInvoiceTotalVatIncludedAmount;
        }

        public BigDecimal getOutOfPocketInvoiceTotalVatIncludedAmount() {
            return outOfPocketInvoiceTotalVatIncludedAmount;
        }

        public void setOutOfPocketInvoiceTotalVatIncludedAmount(BigDecimal outOfPocketInvoiceTotalVatIncludedAmount) {
            this.outOfPocketInvoiceTotalVatIncludedAmount = outOfPocketInvoiceTotalVatIncludedAmount;
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

        public BigDecimal getFeesPaymentTotalCvAmount() {
            return feesPaymentTotalCvAmount;
        }

        public void setFeesPaymentTotalCvAmount(BigDecimal feesPaymentTotalCvAmount) {
            this.feesPaymentTotalCvAmount = feesPaymentTotalCvAmount;
        }

        public BigDecimal getFeesActTotalAmount() {
            return feesActTotalAmount;
        }

        public void setFeesActTotalAmount(BigDecimal feesActTotalAmount) {
            this.feesActTotalAmount = feesActTotalAmount;
        }

        public BigDecimal getFeesActTotalCvAmount() {
            return feesActTotalCvAmount;
        }

        public void setFeesActTotalCvAmount(BigDecimal feesActTotalCvAmount) {
            this.feesActTotalCvAmount = feesActTotalCvAmount;
        }

        public Signed getFeesActIsSigned() {
            return feesActIsSigned;
        }

        public void setFeesActIsSigned(Signed feesActIsSigned) {
            this.feesActIsSigned = feesActIsSigned;
        }

        public BigDecimal getOutOfPocketPaymentTotalCvAmount() {
            return outOfPocketPaymentTotalCvAmount;
        }

        public void setOutOfPocketPaymentTotalCvAmount(BigDecimal outOfPocketPaymentTotalCvAmount) {
            this.outOfPocketPaymentTotalCvAmount = outOfPocketPaymentTotalCvAmount;
        }

        public BigDecimal getOutOfPocketActTotalAmount() {
            return outOfPocketActTotalAmount;
        }

        public void setOutOfPocketActTotalAmount(BigDecimal outOfPocketActTotalAmount) {
            this.outOfPocketActTotalAmount = outOfPocketActTotalAmount;
        }

        public BigDecimal getOutOfPocketActTotalCvAmount() {
            return outOfPocketActTotalCvAmount;
        }

        public void setOutOfPocketActTotalCvAmount(BigDecimal outOfPocketActTotalCvAmount) {
            this.outOfPocketActTotalCvAmount = outOfPocketActTotalCvAmount;
        }

        public Signed getOutOfPocketActIsSigned() {
            return outOfPocketActIsSigned;
        }

        public void setOutOfPocketActIsSigned(Signed outOfPocketActIsSigned) {
            this.outOfPocketActIsSigned = outOfPocketActIsSigned;
        }

        public Long getTimeSpent() {
            return timeSpent;
        }

        public void setTimeSpent(Long timeSpent) {
            this.timeSpent = timeSpent;
        }

        public Long getSubdepartmentId() {
            return subdepartmentId;
        }

        public void setSubdepartmentId(Long subdepartmentId) {
            this.subdepartmentId = subdepartmentId;
        }

        public String getSubdepartmentName() {
            return subdepartmentName;
        }

        public void setSubdepartmentName(String subdepartmentName) {
            this.subdepartmentName = subdepartmentName;
        }

        public Long getDepartmentId() {
            return departmentId;
        }

        public void setDepartmentId(Long departmentId) {
            this.departmentId = departmentId;
        }

        public String getDepartmentName() {
            return departmentName;
        }

        public void setDepartmentName(String departmentName) {
            this.departmentName = departmentName;
        }

        public Long getOfficeId() {
            return officeId;
        }

        public void setOfficeId(Long officeId) {
            this.officeId = officeId;
        }

        public String getOfficeName() {
            return officeName;
        }

        public void setOfficeName(String officeName) {
            this.officeName = officeName;
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

        public String getProjectCodeDescription() {
            return projectCodeDescription;
        }

        public void setProjectCodeDescription(String projectCodeDescription) {
            this.projectCodeDescription = projectCodeDescription;
        }

        public YearMonthDateTime getProjectCodeCreatedAt() {
            return projectCodeCreatedAt;
        }

        public void setProjectCodeCreatedAt(YearMonthDateTime projectCodeCreatedAt) {
            this.projectCodeCreatedAt = projectCodeCreatedAt;
        }

        public Integer getProjectCodeFinancialYear() {
            return projectCodeFinancialYear;
        }

        public void setProjectCodeFinancialYear(Integer projectCodeFinancialYear) {
            this.projectCodeFinancialYear = projectCodeFinancialYear;
        }

        public Boolean getProjectCodeIsClosed() {
            return projectCodeIsClosed;
        }

        public void setProjectCodeIsClosed(Boolean projectCodeIsClosed) {
            this.projectCodeIsClosed = projectCodeIsClosed;
        }

        public YearMonthDateTime getProjectCodeClosedAt() {
            return projectCodeClosedAt;
        }

        public void setProjectCodeClosedAt(YearMonthDateTime projectCodeClosedAt) {
            this.projectCodeClosedAt = projectCodeClosedAt;
        }

        public Boolean getProjectCodeIsDead() {
            return projectCodeIsDead;
        }

        public void setProjectCodeIsDead(Boolean projectCodeIsDead) {
            this.projectCodeIsDead = projectCodeIsDead;
        }

        public String getProjectCodeInChargePerson() {
            return projectCodeInChargePerson;
        }

        public void setProjectCodeInChargePerson(String projectCodeInChargePerson) {
            this.projectCodeInChargePerson = projectCodeInChargePerson;
        }

        public String getProjectCodeInChargePartner() {
            return projectCodeInChargePartner;
        }

        public void setProjectCodeInChargePartner(String projectCodeInChargePartner) {
            this.projectCodeInChargePartner = projectCodeInChargePartner;
        }

        public YearMonthDate getLastFillingDay() {
            return lastFillingDay;
        }

        public void setLastFillingDay(YearMonthDate lastFillingDay) {
            this.lastFillingDay = lastFillingDay;
        }

        public FeesItemVOH getFeesItem() {
            return feesItem;
        }

        public void setFeesItem(FeesItemVOH feesItem) {
            this.feesItem = feesItem;
        }

        public OutOfPocketItemVOH getOutOfPocketItem() {
            return outOfPocketItem;
        }

        public void setOutOfPocketItem(OutOfPocketItemVOH outOfPocketItem) {
            this.outOfPocketItem = outOfPocketItem;
        }

        public BigDecimal getFeesAdvanceTotalAmount() {
            return feesAdvanceTotalAmount;
        }

        public void setFeesAdvanceTotalAmount(BigDecimal feesAdvanceTotalAmount) {
            this.feesAdvanceTotalAmount = feesAdvanceTotalAmount;
        }

        public BigDecimal getFeesInvoiceTotalAmount() {
            return feesInvoiceTotalAmount;
        }

        public void setFeesInvoiceTotalAmount(BigDecimal feesInvoiceTotalAmount) {
            this.feesInvoiceTotalAmount = feesInvoiceTotalAmount;
        }

        public BigDecimal getFeesPaymentTotalAmount() {
            return feesPaymentTotalAmount;
        }

        public void setFeesPaymentTotalAmount(BigDecimal feesPaymentTotalAmount) {
            this.feesPaymentTotalAmount = feesPaymentTotalAmount;
        }

        public BigDecimal getOutOfPocketInvoiceTotalAmount() {
            return outOfPocketInvoiceTotalAmount;
        }

        public void setOutOfPocketInvoiceTotalAmount(BigDecimal outOfPocketInvoiceTotalAmount) {
            this.outOfPocketInvoiceTotalAmount = outOfPocketInvoiceTotalAmount;
        }

        public BigDecimal getOutOfPocketPaymentTotalAmount() {
            return outOfPocketPaymentTotalAmount;
        }

        public void setOutOfPocketPaymentTotalAmount(BigDecimal outOfPocketPaymentTotalAmount) {
            this.outOfPocketPaymentTotalAmount = outOfPocketPaymentTotalAmount;
        }
    }

    private YearMonthDateTime createdAt;
    private List<CurrencyVO> currencies = new LinkedList<CurrencyVO>();
    private CurrencyVO mainCurrency = new CurrencyVO();
    
    private Boolean isFilterUsed;
    private Boolean isInvoiceRequestsFilterUsed;
    private Map<Long, BigDecimal> formCurrencyRates;
    private List<RowVO> rows = new LinkedList<RowVO>();

    public InvoicingReportVO(InvoicingReport invoicingReport) {
        if(invoicingReport.getForm().getFilter() != null) {
            this.isFilterUsed = invoicingReport.getForm().getFilter().isUsed();
        }
        if(invoicingReport.getForm().getInvoiceRequestsFilter() != null) {
            this.isInvoiceRequestsFilterUsed = invoicingReport.getForm().getInvoiceRequestsFilter().isUsed();
        }
        this.createdAt = new YearMonthDateTime(invoicingReport.getCreatedAt());
        this.currencies = CurrencyVO.getList(invoicingReport.getCurrencies());
        this.mainCurrency = new CurrencyVO(invoicingReport.getMainCurrency());
        
        this.formCurrencyRates = invoicingReport.getForm().getCurrencyRates();
        
        for(InvoicingReport.Row row : invoicingReport.getRows()) {
            this.rows.add(new RowVO(row));
        }
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

    public CurrencyVO getMainCurrency() {
        return mainCurrency;
    }

    public void setMainCurrency(CurrencyVO mainCurrency) {
        this.mainCurrency = mainCurrency;
    }

    public Map<Long, BigDecimal> getFormCurrencyRates() {
        return formCurrencyRates;
    }

    public void setFormCurrencyRates(Map<Long, BigDecimal> formCurrencyRates) {
        this.formCurrencyRates = formCurrencyRates;
    }

    public Boolean isIsFilterUsed() {
        return isFilterUsed;
    }

    public void setIsFilterUsed(Boolean isFilterUsed) {
        this.isFilterUsed = isFilterUsed;
    }

    public Boolean isIsInvoiceRequestsFilterUsed() {
        return isInvoiceRequestsFilterUsed;
    }

    public void setIsInvoiceRequestsFilterUsed(Boolean isInvoiceRequestsFilterUsed) {
        this.isInvoiceRequestsFilterUsed = isInvoiceRequestsFilterUsed;
    }

    public List<RowVO> getRows() {
        return rows;
    }

    public void setRows(List<RowVO> rows) {
        this.rows = rows;
    }
}
