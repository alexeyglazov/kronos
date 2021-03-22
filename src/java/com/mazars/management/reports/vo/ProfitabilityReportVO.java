/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.reports.vo;

import com.mazars.management.db.domain.*;
import com.mazars.management.db.vo.*;
import com.mazars.management.reports.*;
import java.math.BigDecimal;
import java.util.Date;
import java.util.LinkedList;
import java.util.List;
/**
 *
 * @author glazov
 */
public class ProfitabilityReportVO {
    public class Row {
        private String projectCodeCode;
        private Long clientId;
        private String clientName;
        private Long employeeId;
        private String employeeUserName;
        private String employeeFirstName;
        private String employeeLastName;
        private String positionName;
        private String standardPositionName;
        private String taskName;
        private String taskTypeName;
        private Long timeSpent;
        private BigDecimal standardSellingRateAmount;
        private Long standardSellingRateCurrencyId;
        private String standardSellingRateCurrencyCode;
        private BigDecimal standardCostAmount;
        private Long standardCostCurrencyId;
        private String standardCostCurrencyCode;

        public Row(ProfitabilityReport.Row row) {
            Employee employee = row.getEmployeePositionHistoryItem().getEmployee();
            ProjectCode projectCode = row.getProjectCode();
            Client client = row.getClient();
            Position position = row.getPosition();
            StandardPosition standardPosition = row.getStandardPosition();
            Task task = row.getTask();
            TaskType taskType = task.getTaskType();
            this.projectCodeCode = projectCode.getCode();
            this.clientId = client.getId();
            this.clientName = client.getName();
            this.employeeId = employee.getId();
            this.employeeUserName = employee.getUserName();
            this.employeeFirstName = employee.getFirstName();
            this.employeeLastName = employee.getLastName();
            this.positionName = position.getName();
            this.standardPositionName = standardPosition.getName();
            this.taskName = task.getName();
            this.taskTypeName = taskType.getName();
            this.timeSpent = row.getTimeSpent();
            if(row.getStandardSellingRate() != null) {
                this.standardSellingRateAmount = row.getStandardSellingRate().getAmount();
                Currency currency = row.getStandardSellingRateGroup().getCurrency();
                this.standardSellingRateCurrencyId = currency.getId();
                this.standardSellingRateCurrencyCode = currency.getCode();
            }
            if(row.getStandardCost() != null) {
                this.standardCostAmount = row.getStandardCost().getAmount();
                Currency currency = row.getStandardCostGroup().getCurrency();
                this.standardCostCurrencyId = currency.getId();
                this.standardCostCurrencyCode = currency.getCode();
            }
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

        public BigDecimal getStandardSellingRateAmount() {
            return standardSellingRateAmount;
        }

        public void setStandardSellingRateAmount(BigDecimal standardSellingRateAmount) {
            this.standardSellingRateAmount = standardSellingRateAmount;
        }

        public Long getStandardSellingRateCurrencyId() {
            return standardSellingRateCurrencyId;
        }

        public void setStandardSellingRateCurrencyId(Long standardSellingRateCurrencyId) {
            this.standardSellingRateCurrencyId = standardSellingRateCurrencyId;
        }

        public String getStandardSellingRateCurrencyCode() {
            return standardSellingRateCurrencyCode;
        }

        public void setStandardSellingRateCurrencyCode(String standardSellingRateCurrencyCode) {
            this.standardSellingRateCurrencyCode = standardSellingRateCurrencyCode;
        }

        public BigDecimal getStandardCostAmount() {
            return standardCostAmount;
        }

        public void setStandardCostAmount(BigDecimal standardCostAmount) {
            this.standardCostAmount = standardCostAmount;
        }

        public Long getStandardCostCurrencyId() {
            return standardCostCurrencyId;
        }

        public void setStandardCostCurrencyId(Long standardCostCurrencyId) {
            this.standardCostCurrencyId = standardCostCurrencyId;
        }

        public String getStandardCostCurrencyCode() {
            return standardCostCurrencyCode;
        }

        public void setStandardCostCurrencyCode(String standardCostCurrencyCode) {
            this.standardCostCurrencyCode = standardCostCurrencyCode;
        }

        public String getEmployeeFirstName() {
            return employeeFirstName;
        }

        public void setEmployeeFirstName(String employeeFirstName) {
            this.employeeFirstName = employeeFirstName;
        }

        public Long getEmployeeId() {
            return employeeId;
        }

        public void setEmployeeId(Long employeeId) {
            this.employeeId = employeeId;
        }

        public String getEmployeeLastName() {
            return employeeLastName;
        }

        public void setEmployeeLastName(String employeeLastName) {
            this.employeeLastName = employeeLastName;
        }

        public String getEmployeeUserName() {
            return employeeUserName;
        }

        public void setEmployeeUserName(String employeeUserName) {
            this.employeeUserName = employeeUserName;
        }

        public String getPositionName() {
            return positionName;
        }

        public void setPositionName(String positionName) {
            this.positionName = positionName;
        }

        public String getProjectCodeCode() {
            return projectCodeCode;
        }

        public void setProjectCodeCode(String projectCodeCode) {
            this.projectCodeCode = projectCodeCode;
        }

        public String getStandardPositionName() {
            return standardPositionName;
        }

        public void setStandardPositionName(String standardPositionName) {
            this.standardPositionName = standardPositionName;
        }

        public String getTaskName() {
            return taskName;
        }

        public void setTaskName(String taskName) {
            this.taskName = taskName;
        }

        public String getTaskTypeName() {
            return taskTypeName;
        }

        public void setTaskTypeName(String taskTypeName) {
            this.taskTypeName = taskTypeName;
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
    private Date createdAt;

    private String formGroupName;
    private String formClientName;
    private String formOfficeName;
    private String formDepartmentName;
    private String formSubdepartmentName;
    private YearMonthDate formStartDate;
    private YearMonthDate formEndDate;

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public List<CurrencyVO> getCurrencies() {
        return currencies;
    }

    public void setCurrencies(List<CurrencyVO> currencies) {
        this.currencies = currencies;
    }

    public String getFormClientName() {
        return formClientName;
    }

    public void setFormClientName(String formClientName) {
        this.formClientName = formClientName;
    }

    public String getFormDepartmentName() {
        return formDepartmentName;
    }

    public void setFormDepartmentName(String formDepartmentName) {
        this.formDepartmentName = formDepartmentName;
    }

    public YearMonthDate getFormEndDate() {
        return formEndDate;
    }

    public void setFormEndDate(YearMonthDate formEndDate) {
        this.formEndDate = formEndDate;
    }

    public String getFormGroupName() {
        return formGroupName;
    }

    public void setFormGroupName(String formGroupName) {
        this.formGroupName = formGroupName;
    }

    public String getFormOfficeName() {
        return formOfficeName;
    }

    public void setFormOfficeName(String formOfficeName) {
        this.formOfficeName = formOfficeName;
    }

    public YearMonthDate getFormStartDate() {
        return formStartDate;
    }

    public void setFormStartDate(YearMonthDate formStartDate) {
        this.formStartDate = formStartDate;
    }

    public String getFormSubdepartmentName() {
        return formSubdepartmentName;
    }

    public void setFormSubdepartmentName(String formSubdepartmentName) {
        this.formSubdepartmentName = formSubdepartmentName;
    }

    public List<Row> getRows() {
        return rows;
    }

    public void setRows(List<Row> rows) {
        this.rows = rows;
    }

    public ProfitabilityReportVO(ProfitabilityReport profitabilityReport) {
        this.createdAt = profitabilityReport.getCreatedAt();
        if(profitabilityReport.getFormGroup() != null) {
            this.formGroupName = profitabilityReport.getFormGroup().getName();
        }
        if(profitabilityReport.getFormClient() != null) {
            this.formClientName = profitabilityReport.getFormClient().getName();
        }
        if(profitabilityReport.getFormOffice() != null) {
            this.formOfficeName = profitabilityReport.getFormOffice().getName();
        }
        if(profitabilityReport.getFormDepartment() != null) {
            this.formDepartmentName = profitabilityReport.getFormDepartment().getName();
        }
        if(profitabilityReport.getFormSubdepartment() != null) {
            this.formSubdepartmentName = profitabilityReport.getFormSubdepartment().getName();
        }
        this.formStartDate = profitabilityReport.getFormStartDate();
        this.formEndDate = profitabilityReport.getFormEndDate();

        for(ProfitabilityReport.Row row : profitabilityReport.getRows()) {
            this.rows.add(new ProfitabilityReportVO.Row(row));
        }
        for(Currency currency : profitabilityReport.getCurrencies()) {
            this.currencies.add(new CurrencyVO(currency));
        }
    }
}
