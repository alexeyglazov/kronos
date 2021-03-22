/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.reports.vo;

import com.mazars.management.db.domain.EmployeePositionHistoryItem.ContractType;
import com.mazars.management.db.domain.LeavesItem.Type;
import com.mazars.management.db.vo.*;
import com.mazars.management.db.domain.*;
import com.mazars.management.db.util.CalendarUtil;
import com.mazars.management.reports.*;
import java.math.BigDecimal;
import java.util.Calendar;
import java.util.List;
import java.util.LinkedList;
import java.util.Date;

/**
 *
 * @author glazov
 */
public class SalaryReportVO {
    public class Row {
        private Long employeeId;
        private String employeeUserName;
        private String employeeFirstName;
        private String employeeLastName;
        private String employeeFirstNameLocalLanguage;
        private String employeeLastNameLocalLanguage;
        private Boolean employeeIsActive;
        private String employeeEmail;
        private EmployeePositionHistoryItem.ContractType employeePositionHistoryItemContractType;
        private LeavesItem.Type leavesItemType;
        private Calendar displayedStart;
        private Calendar displayedEnd;
        private Long positionId;
        private String positionName;
        private Long standardPositionId;
        private String standardPositionName;
        private Long subdepartmentId;
        private String subdepartmentName;
        private Long departmentId;
        private String departmentName;
        private Long officeId;
        private String officeName;
        private Calendar salaryStart;
        private Calendar salaryEnd;
        private BigDecimal salaryValue;
        private Long currencyId;
        private String currencyCode;
        private Integer paidLeavesWorkingDaysCount;
        private Integer paidLeavesWorkingDaysTotalCount;
        private Integer unpaidLeavesWorkingDaysCount;
        private Integer unpaidLeavesWorkingDaysTotalCount;
        private YearMonthDate leavesItemStart;
        private YearMonthDate leavesItemEnd;
        public Row(SalaryReport.Row row) {
            Employee employee = row.getEmployee();
            EmployeePositionHistoryItem employeePositionHistoryItem = row.getEmployeePositionHistoryItem();
            LeavesItem leavesItem = row.getLeavesItem();
            Position position = row.getPosition();
            StandardPosition standardPosition = position.getStandardPosition();
            Subdepartment subdepartment = position.getSubdepartment();
            Department department = subdepartment.getDepartment();
            Office office = department.getOffice();
            Salary salary = row.getSalary();
            this.employeeId = employee.getId();
            this.employeeUserName = employee.getUserName();
            this.employeeFirstName = employee.getFirstName();
            this.employeeLastName = employee.getLastName();
            this.employeeFirstNameLocalLanguage = employee.getFirstNameLocalLanguage();
            this.employeeLastNameLocalLanguage = employee.getLastNameLocalLanguage();
            this.employeePositionHistoryItemContractType = employeePositionHistoryItem.getContractType();
            this.employeeIsActive = employee.getIsActive();
            this.employeeEmail = employee.getEmail();
            if(leavesItem != null) {
                this.leavesItemType = leavesItem.getType();
                if(leavesItem.getStart() != null) {
                    this.leavesItemStart = new YearMonthDate(leavesItem.getStart());
                }
                if(leavesItem.getEnd() != null) {
                    this.leavesItemEnd = new YearMonthDate(leavesItem.getEnd());
                }
            }
            this.displayedStart = row.getDisplayedStart();
            this.displayedEnd = row.getDisplayedEnd();
            this.positionId = position.getId();
            this.positionName = position.getName();
            this.standardPositionId = standardPosition.getId();
            this.standardPositionName = standardPosition.getName();
            this.subdepartmentId = subdepartment.getId();
            this.subdepartmentName = subdepartment.getName();
            this.departmentId = department.getId();
            this.departmentName = department.getName();
            this.officeId = office.getId();
            this.officeName = office.getName();
            if(salary != null) {
                this.salaryStart = salary.getStart();
                this.salaryEnd = salary.getEnd();
                this.salaryValue = salary.getValue();
                this.currencyId = salary.getCurrency().getId();
                this.currencyCode = salary.getCurrency().getCode();
            }
            this.paidLeavesWorkingDaysCount = row.getPaidLeavesWorkingDaysCount();
            this.paidLeavesWorkingDaysTotalCount = row.getPaidLeavesWorkingDaysTotalCount();
            this.unpaidLeavesWorkingDaysCount = row.getUnpaidLeavesWorkingDaysCount();
            this.unpaidLeavesWorkingDaysTotalCount = row.getUnpaidLeavesWorkingDaysTotalCount();
        }

        public Boolean isEmployeeIsActive() {
            return employeeIsActive;
        }

        public void setEmployeeIsActive(Boolean employeeIsActive) {
            this.employeeIsActive = employeeIsActive;
        }

        public String getEmployeeEmail() {
            return employeeEmail;
        }

        public void setEmployeeEmail(String employeeEmail) {
            this.employeeEmail = employeeEmail;
        }

        public Long getStandardPositionId() {
            return standardPositionId;
        }

        public void setStandardPositionId(Long standardPositionId) {
            this.standardPositionId = standardPositionId;
        }

        public String getStandardPositionName() {
            return standardPositionName;
        }

        public void setStandardPositionName(String standardPositionName) {
            this.standardPositionName = standardPositionName;
        }

        public Integer getPaidLeavesWorkingDaysCount() {
            return paidLeavesWorkingDaysCount;
        }

        public void setPaidLeavesWorkingDaysCount(Integer paidLeavesWorkingDaysCount) {
            this.paidLeavesWorkingDaysCount = paidLeavesWorkingDaysCount;
        }

        public Integer getPaidLeavesWorkingDaysTotalCount() {
            return paidLeavesWorkingDaysTotalCount;
        }

        public void setPaidLeavesWorkingDaysTotalCount(Integer paidLeavesWorkingDaysTotalCount) {
            this.paidLeavesWorkingDaysTotalCount = paidLeavesWorkingDaysTotalCount;
        }

        public Integer getUnpaidLeavesWorkingDaysCount() {
            return unpaidLeavesWorkingDaysCount;
        }

        public void setUnpaidLeavesWorkingDaysCount(Integer unpaidLeavesWorkingDaysCount) {
            this.unpaidLeavesWorkingDaysCount = unpaidLeavesWorkingDaysCount;
        }

        public Integer getUnpaidLeavesWorkingDaysTotalCount() {
            return unpaidLeavesWorkingDaysTotalCount;
        }

        public void setUnpaidLeavesWorkingDaysTotalCount(Integer unpaidLeavesWorkingDaysTotalCount) {
            this.unpaidLeavesWorkingDaysTotalCount = unpaidLeavesWorkingDaysTotalCount;
        }

        public Calendar getDisplayedEnd() {
            return displayedEnd;
        }

        public void setDisplayedEnd(Calendar displayedEnd) {
            this.displayedEnd = displayedEnd;
        }

        public Calendar getDisplayedStart() {
            return displayedStart;
        }

        public void setDisplayedStart(Calendar displayedStart) {
            this.displayedStart = displayedStart;
        }

        public Type getLeavesItemType() {
            return leavesItemType;
        }

        public void setLeavesItemType(Type leavesItemType) {
            this.leavesItemType = leavesItemType;
        }

        public String getEmployeeFirstNameLocalLanguage() {
            return employeeFirstNameLocalLanguage;
        }

        public void setEmployeeFirstNameLocalLanguage(String employeeFirstNameLocalLanguage) {
            this.employeeFirstNameLocalLanguage = employeeFirstNameLocalLanguage;
        }

        public String getEmployeeLastNameLocalLanguage() {
            return employeeLastNameLocalLanguage;
        }

        public void setEmployeeLastNameLocalLanguage(String employeeLastNameLocalLanguage) {
            this.employeeLastNameLocalLanguage = employeeLastNameLocalLanguage;
        }

        public ContractType getEmployeePositionHistoryItemContractType() {
            return employeePositionHistoryItemContractType;
        }

        public void setEmployeePositionHistoryItemContractType(ContractType employeePositionHistoryItemContractType) {
            this.employeePositionHistoryItemContractType = employeePositionHistoryItemContractType;
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

        public Long getPositionId() {
            return positionId;
        }

        public void setPositionId(Long positionId) {
            this.positionId = positionId;
        }

        public String getPositionName() {
            return positionName;
        }

        public void setPositionName(String positionName) {
            this.positionName = positionName;
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

        public String getCurrencyCode() {
            return currencyCode;
        }

        public void setCurrencyCode(String currencyCode) {
            this.currencyCode = currencyCode;
        }

        public Long getCurrencyId() {
            return currencyId;
        }

        public void setCurrencyId(Long currencyId) {
            this.currencyId = currencyId;
        }

        public Calendar getSalaryStart() {
            return salaryStart;
        }

        public void setSalaryStart(Calendar salaryStart) {
            this.salaryStart = salaryStart;
        }

        public Calendar getSalaryEnd() {
            return salaryEnd;
        }

        public void setSalaryEnd(Calendar salaryEnd) {
            this.salaryEnd = salaryEnd;
        }

        public BigDecimal getSalaryValue() {
            return salaryValue;
        }

        public void setSalaryValue(BigDecimal salaryValue) {
            this.salaryValue = salaryValue;
        }

        public YearMonthDate getLeavesItemStart() {
            return leavesItemStart;
        }

        public void setLeavesItemStart(YearMonthDate leavesItemStart) {
            this.leavesItemStart = leavesItemStart;
        }

        public YearMonthDate getLeavesItemEnd() {
            return leavesItemEnd;
        }

        public void setLeavesItemEnd(YearMonthDate leavesItemEnd) {
            this.leavesItemEnd = leavesItemEnd;
        }

    }
    private List<Row> rows = new LinkedList<Row>();
    private YearMonthDate formStartDate;
    private YearMonthDate formEndDate;
    private List<CurrencyVO> currencies = new LinkedList<CurrencyVO>();
    private YearMonthDateTime createdAt;

 
    public SalaryReportVO(SalaryReport salaryReport) {
        this.createdAt = new YearMonthDateTime(salaryReport.getCreatedAt());
        this.formStartDate = new YearMonthDate(salaryReport.getFormStartDate());
        this.formEndDate = new YearMonthDate(salaryReport.getFormEndDate());
        for(SalaryReport.Row row : salaryReport.getRows()) {
            this.rows.add(new Row(row));
        }
        for(Currency currency : salaryReport.getCurrencies()) {
            this.currencies.add(new CurrencyVO(currency));
        }
    }

    public YearMonthDate getFormStartDate() {
        return formStartDate;
    }

    public void setFormStartDate(YearMonthDate formStartDate) {
        this.formStartDate = formStartDate;
    }

    public YearMonthDate getFormEndDate() {
        return formEndDate;
    }

    public void setFormEndDate(YearMonthDate formEndDate) {
        this.formEndDate = formEndDate;
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
}
