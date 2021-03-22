/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.reports.vo;

import com.mazars.management.db.domain.*;
import com.mazars.management.db.domain.EmployeePositionHistoryItem.ContractType;
import com.mazars.management.db.domain.LeavesItem.Type;
import com.mazars.management.db.util.CalendarUtil;
import com.mazars.management.db.vo.*;
import com.mazars.management.reports.*;
import com.mazars.management.service.LeavesBalanceCalculator;
import com.mazars.management.web.vo.LeavesBalanceCalculatorResult;
import java.math.BigDecimal;
import java.util.Calendar;
import java.util.Date;
import java.util.LinkedList;
import java.util.List;

/**
 *
 * @author glazov
 */
public class LeavesReportVO {
    public class Row {
        private Long employeeId;
        private String employeeUserName;
        private String employeeFirstName;
        private String employeeLastName;
        private String employeeFirstNameLocalLanguage;
        private String employeeLastNameLocalLanguage;
        private Boolean employeeIsActive;
        private String employeeEmail;
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
        private LeavesBalanceCalculatorResult leavesBalanceCalculatorResult;

        public Row(LeavesReport.Row row) {
            Employee employee = row.getEmployee();
            Position position = row.getPosition();
            StandardPosition standardPosition = row.getStandardPosition();
            Subdepartment subdepartment = row.getSubdepartment();
            Department department = row.getDepartment();
            Office office = row.getOffice();
            LeavesBalanceCalculator leavesBalanceCalculator = row.getLeavesBalanceCalculator();
            this.employeeId = employee.getId();
            this.employeeUserName = employee.getUserName();
            this.employeeFirstName = employee.getFirstName();
            this.employeeLastName = employee.getLastName();
            this.employeeFirstNameLocalLanguage = employee.getFirstNameLocalLanguage();
            this.employeeLastNameLocalLanguage = employee.getLastNameLocalLanguage();
            this.employeeIsActive = employee.getIsActive();
            this.employeeEmail = employee.getEmail();
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
            if(leavesBalanceCalculator != null) {
                this.leavesBalanceCalculatorResult = new LeavesBalanceCalculatorResult(leavesBalanceCalculator);
            }
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

        public LeavesBalanceCalculatorResult getLeavesBalanceCalculatorResult() {
            return leavesBalanceCalculatorResult;
        }

        public void setLeavesBalanceCalculatorResult(LeavesBalanceCalculatorResult leavesBalanceCalculatorResult) {
            this.leavesBalanceCalculatorResult = leavesBalanceCalculatorResult;
        }

    }
    private List<Row> rows = new LinkedList<Row>();
    private YearMonthDate formDate;
    private Boolean formIsActive;
    private YearMonthDateTime createdAt;
 
    public LeavesReportVO(LeavesReport leavesReport) {
        this.createdAt = new YearMonthDateTime(leavesReport.getCreatedAt());
        this.formDate = new YearMonthDate(leavesReport.getFormDate());
        this.formIsActive = leavesReport.getFormIsActive();
        for(LeavesReport.Row row : leavesReport.getRows()) {
            this.rows.add(new Row(row));
        }
    }

    public YearMonthDate getFormDate() {
        return formDate;
    }

    public void setFormDate(YearMonthDate formDate) {
        this.formDate = formDate;
    }

    public Boolean isFormIsActive() {
        return formIsActive;
    }

    public void setFormIsActive(Boolean formIsActive) {
        this.formIsActive = formIsActive;
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
}
