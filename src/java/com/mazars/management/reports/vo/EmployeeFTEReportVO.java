/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.reports.vo;

import com.mazars.management.db.domain.*;
import com.mazars.management.db.domain.EmployeePositionHistoryItem.ContractType;
import com.mazars.management.db.vo.YearMonthDateTime;
import com.mazars.management.reports.*;
import java.util.Calendar;
import java.util.Date;
import java.util.LinkedList;
import java.util.List;

/**
 *
 * @author glazov
 */
public class EmployeeFTEReportVO {
    public class Row {
        private Long employeeId;
        private String employeeUserName;
        private String employeeFirstName;
        private String employeeLastName;
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
        private EmployeePositionHistoryItem.ContractType contractType;
        private Integer partTimePercentage;
        private Long timeSpent;
        private Integer workingDaysCount = 0;
        private Integer positionWorkingDaysCount = 0;
        private Double fte = null;
        public Row(EmployeeFTEReport.Row row) {
            Employee employee = row.getEmployee();
            Position position = row.getPosition();
            StandardPosition standardPosition = row.getStandardPosition();
            Subdepartment subdepartment = position.getSubdepartment();
            Department department = subdepartment.getDepartment();
            Office office = department.getOffice();
            this.employeeId = employee.getId();
            this.employeeUserName = employee.getUserName();
            this.employeeFirstName = employee.getFirstName();
            this.employeeLastName = employee.getLastName();
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
            this.timeSpent = row.getTimeSpent();
            this.workingDaysCount = row.getWorkingDaysCount();
            this.positionWorkingDaysCount = row.getPositionWorkingDaysCount();
            this.contractType = row.getEmployeePositionHistoryItem().getContractType();
            if(EmployeePositionHistoryItem.ContractType.PART_TIME.equals(row.getEmployeePositionHistoryItem().getContractType())) {
                this.partTimePercentage = row.getEmployeePositionHistoryItem().getPartTimePercentage();
            } else {
                this.partTimePercentage = null;
            }
            this.fte = row.getFte();
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

        public Integer getWorkingDaysCount() {
            return workingDaysCount;
        }

        public void setWorkingDaysCount(Integer workingDaysCount) {
            this.workingDaysCount = workingDaysCount;
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

        public Long getTimeSpent() {
            return timeSpent;
        }

        public void setTimeSpent(Long timeSpent) {
            this.timeSpent = timeSpent;
        }

        public ContractType getContractType() {
            return contractType;
        }

        public void setContractType(ContractType contractType) {
            this.contractType = contractType;
        }

        public Integer getPartTimePercentage() {
            return partTimePercentage;
        }

        public void setPartTimePercentage(Integer partTimePercentage) {
            this.partTimePercentage = partTimePercentage;
        }

        public Integer getPositionWorkingDaysCount() {
            return positionWorkingDaysCount;
        }

        public void setPositionWorkingDaysCount(Integer positionWorkingDaysCount) {
            this.positionWorkingDaysCount = positionWorkingDaysCount;
        }

        public Double getFte() {
            return fte;
        }

        public void setFte(Double fte) {
            this.fte = fte;
        }
    }
    private Integer workingDaysCount;
    private List<Row> rows = new LinkedList<Row>();

    private Calendar startDate;
    private Calendar endDate;
    private YearMonthDateTime createdAt;

    public EmployeeFTEReportVO(EmployeeFTEReport employeeFTEReport) {
        this.createdAt = new YearMonthDateTime(employeeFTEReport.getCreatedAt());
        this.startDate = employeeFTEReport.getFormStartDate();
        this.endDate = employeeFTEReport.getFormEndDate();
        for(EmployeeFTEReport.Row row : employeeFTEReport.getRows()) {
            this.rows.add(new EmployeeFTEReportVO.Row(row));
        }
        this.workingDaysCount = employeeFTEReport.getWorkingDaysCount();
    }

    public Integer getWorkingDaysCount() {
        return workingDaysCount;
    }

    public void setWorkingDaysCount(Integer workingDaysCount) {
        this.workingDaysCount = workingDaysCount;
    }

    public List<Row> getRows() {
        return rows;
    }

    public void setRows(List<Row> rows) {
        this.rows = rows;
    }

    public YearMonthDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(YearMonthDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public Calendar getEndDate() {
        return endDate;
    }

    public void setEndDate(Calendar endDate) {
        this.endDate = endDate;
    }

    public Calendar getStartDate() {
        return startDate;
    }

    public void setStartDate(Calendar startDate) {
        this.startDate = startDate;
    }
}
