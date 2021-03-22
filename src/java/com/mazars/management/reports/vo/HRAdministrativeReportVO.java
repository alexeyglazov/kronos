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
public class HRAdministrativeReportVO {
    public class Row {
        private Long officeId;
        private String officeName;
        private Long departmentId;
        private String departmentName;
        private Long subdepartmentId;
        private String subdepartmentName;
        private Long standardPositionId;
        private String standardPositionName;
        private Long positionId;
        private String positionName;
        private Long employeeId;
        private String employeeUserName;
        private String employeeFirstName;
        private String employeeLastName;
        private String employeeFirstNameLocalLanguage;
        private String employeeLastNameLocalLanguage;
        private String employeeEmail;
        private Boolean employeeIsActive;
        private YearMonthDate employeePositionHistoryItemStart;
        private YearMonthDate employeePositionHistoryItemEnd;
        private EmployeePositionHistoryItem.CareerStatus employeePositionHistoryItemCareerStatus;
        private EmployeePositionHistoryItem.TimeStatus employeePositionHistoryItemTimeStatus;

        public Row(HRAdministrativeReport.Row row, Calendar day) {
            Employee employee = row.getEmployee();
            EmployeePositionHistoryItem employeePositionHistoryItem = row.getEmployeePositionHistoryItem();
            Position position = row.getPosition();
            StandardPosition standardPosition = position.getStandardPosition();
            Subdepartment subdepartment = position.getSubdepartment();
            Department department = subdepartment.getDepartment();
            Office office = department.getOffice();
            this.officeId = office.getId();
            this.officeName = office.getName();
            this.departmentId = department.getId();
            this.departmentName = department.getName();
            this.subdepartmentId = subdepartment.getId();
            this.subdepartmentName = subdepartment.getName();
            this.standardPositionId = standardPosition.getId();
            this.standardPositionName = standardPosition.getName();
            this.positionId = position.getId();
            this.positionName = position.getName();
            this.employeeId = employee.getId();
            this.employeeUserName = employee.getUserName();
            this.employeeFirstName = employee.getFirstName();
            this.employeeLastName = employee.getLastName();
            this.employeeFirstNameLocalLanguage = employee.getFirstNameLocalLanguage();
            this.employeeLastNameLocalLanguage = employee.getLastNameLocalLanguage();
            this.employeeEmail = employee.getEmail();
            this.employeeIsActive = employee.getIsActive();
            if(employeePositionHistoryItem.getStart() != null) {
                this.employeePositionHistoryItemStart = new YearMonthDate(employeePositionHistoryItem.getStart());
            }
            if(employeePositionHistoryItem.getEnd() != null) {
                this.employeePositionHistoryItemEnd = new YearMonthDate(employeePositionHistoryItem.getEnd());
            }
            this.employeePositionHistoryItemCareerStatus = employeePositionHistoryItem.getCareerStatus();
            this.employeePositionHistoryItemTimeStatus = employeePositionHistoryItem.getTimeStatus(day);
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

        public Long getEmployeeId() {
            return employeeId;
        }

        public void setEmployeeId(Long employeeId) {
            this.employeeId = employeeId;
        }

        public String getEmployeeUserName() {
            return employeeUserName;
        }

        public void setEmployeeUserName(String employeeUserName) {
            this.employeeUserName = employeeUserName;
        }

        public String getEmployeeFirstName() {
            return employeeFirstName;
        }

        public void setEmployeeFirstName(String employeeFirstName) {
            this.employeeFirstName = employeeFirstName;
        }

        public String getEmployeeLastName() {
            return employeeLastName;
        }

        public void setEmployeeLastName(String employeeLastName) {
            this.employeeLastName = employeeLastName;
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

        public String getEmployeeEmail() {
            return employeeEmail;
        }

        public void setEmployeeEmail(String employeeEmail) {
            this.employeeEmail = employeeEmail;
        }

        public Boolean isEmployeeIsActive() {
            return employeeIsActive;
        }

        public void setEmployeeIsActive(Boolean employeeIsActive) {
            this.employeeIsActive = employeeIsActive;
        }

        public YearMonthDate getEmployeePositionHistoryItemStart() {
            return employeePositionHistoryItemStart;
        }

        public void setEmployeePositionHistoryItemStart(YearMonthDate employeePositionHistoryItemStart) {
            this.employeePositionHistoryItemStart = employeePositionHistoryItemStart;
        }

        public YearMonthDate getEmployeePositionHistoryItemEnd() {
            return employeePositionHistoryItemEnd;
        }

        public void setEmployeePositionHistoryItemEnd(YearMonthDate employeePositionHistoryItemEnd) {
            this.employeePositionHistoryItemEnd = employeePositionHistoryItemEnd;
        }

    }
    private List<Row> rows = new LinkedList<Row>();
    private YearMonthDate formStartDate;
    private YearMonthDate formEndDate;
    private YearMonthDateTime createdAt;

 
    public HRAdministrativeReportVO(HRAdministrativeReport hrAdministrativeReport) {
        this.createdAt = new YearMonthDateTime(hrAdministrativeReport.getCreatedAt());
        this.formStartDate = new YearMonthDate(hrAdministrativeReport.getFormStartDate());
        this.formEndDate = new YearMonthDate(hrAdministrativeReport.getFormEndDate());
        Calendar day = this.createdAt.getCalendar();
        CalendarUtil.truncateTime(day);
        for(HRAdministrativeReport.Row row : hrAdministrativeReport.getRows()) {
            this.rows.add(new Row(row, day));
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
}
