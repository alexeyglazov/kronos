/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.reports.vo;

import com.mazars.management.db.domain.Department;
import com.mazars.management.db.domain.Employee;
import com.mazars.management.db.domain.FeesAct;
import com.mazars.management.db.domain.Office;
import com.mazars.management.db.domain.ProjectCode;
import com.mazars.management.db.domain.Subdepartment;
import com.mazars.management.db.vo.*;
import com.mazars.management.reports.*;
import com.mazars.management.web.vo.OfficeDepartmentSubdepartment;
import java.util.Date;
import java.util.LinkedList;
import java.util.List;
/**
 *
 * @author glazov
 */
public class EmployeesForProjectsReportVO {
    public class Row {
        private Long officeId;
        private String officeName;
        private Long departmentId;
        private String departmentName;
        private Long subdepartmentId;
        private String subdepartmentName;
        private Long employeeId;
        private String employeeUserName;
        private String employeeFirstName;
        private String employeeLastName;
        private String employeeFirstNameLocalLanguage;
        private String employeeLastNameLocalLanguage;
        private Long projectCodeId;
        private String projectCodeCode;
        private Boolean projectCodeIsDead;
        private Long timeSpent;
        private List<YearMonthDate> feesActDates = new LinkedList<YearMonthDate>();

        public Row(EmployeesForProjectsReport.Row row) {
            Office office = row.getOffice();
            Department department = row.getDepartment();
            Subdepartment subdepartment = row.getSubdepartment();
            Employee employee = row.getEmployee();
            ProjectCode projectCode = row.getProjectCode();
            officeId = office.getId();
            officeName = office.getName();
            departmentId = department.getId();
            departmentName = department.getName();
            subdepartmentId = subdepartment.getId();
            subdepartmentName = subdepartment.getName();
            employeeId = employee.getId();
            employeeUserName = employee.getUserName();
            employeeFirstName = employee.getFirstName();
            employeeLastName = employee.getLastName();
            employeeFirstNameLocalLanguage = employee.getFirstNameLocalLanguage();
            employeeLastNameLocalLanguage = employee.getLastNameLocalLanguage();
            if(projectCode != null) {
                projectCodeId = projectCode.getId();
                projectCodeCode = projectCode.getCode();
                projectCodeIsDead = projectCode.getIsDead();
            }
            timeSpent = row.getTimeSpent();
            List<FeesAct> feesActs = row.getFeesActs();
            if(feesActs != null) {
                for(FeesAct feesAct : feesActs) {
                    if(feesAct.getDate() != null) {
                        feesActDates.add(new YearMonthDate(feesAct.getDate()));
                    }
                }
            }
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

        public String getEmployeeFirstName() {
            return employeeFirstName;
        }

        public void setEmployeeFirstName(String employeeFirstName) {
            this.employeeFirstName = employeeFirstName;
        }

        public String getEmployeeFirstNameLocalLanguage() {
            return employeeFirstNameLocalLanguage;
        }

        public void setEmployeeFirstNameLocalLanguage(String employeeFirstNameLocalLanguage) {
            this.employeeFirstNameLocalLanguage = employeeFirstNameLocalLanguage;
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

        public String getEmployeeLastNameLocalLanguage() {
            return employeeLastNameLocalLanguage;
        }

        public void setEmployeeLastNameLocalLanguage(String employeeLastNameLocalLanguage) {
            this.employeeLastNameLocalLanguage = employeeLastNameLocalLanguage;
        }

        public String getEmployeeUserName() {
            return employeeUserName;
        }

        public void setEmployeeUserName(String employeeUserName) {
            this.employeeUserName = employeeUserName;
        }

        public String getProjectCodeCode() {
            return projectCodeCode;
        }

        public void setProjectCodeCode(String projectCodeCode) {
            this.projectCodeCode = projectCodeCode;
        }

        public Long getProjectCodeId() {
            return projectCodeId;
        }

        public void setProjectCodeId(Long projectCodeId) {
            this.projectCodeId = projectCodeId;
        }

        public Boolean getProjectCodeIsDead() {
            return projectCodeIsDead;
        }

        public void setProjectCodeIsDead(Boolean projectCodeIsDead) {
            this.projectCodeIsDead = projectCodeIsDead;
        }

        public Long getTimeSpent() {
            return timeSpent;
        }

        public void setTimeSpent(Long timeSpent) {
            this.timeSpent = timeSpent;
        }

        public List<YearMonthDate> getFeesActDates() {
            return feesActDates;
        }

        public void setFeesActDates(List<YearMonthDate> feesActDates) {
            this.feesActDates = feesActDates;
        }
    }

    List<Row> rows = new LinkedList<Row>();
    Integer formYear;
    Integer formMonth;
    String formSubdepartmentName = null;
    String formDepartmentName = null;
    String formOfficeName = null;
    YearMonthDateTime createdAt;

    public List<Row> getRows() {
        return rows;
    }

    public void setRows(List<Row> rows) {
        this.rows = rows;
    }

    public Integer getFormYear() {
        return formYear;
    }

    public void setFormYear(Integer formYear) {
        this.formYear = formYear;
    }

    public Integer getFormMonth() {
        return formMonth;
    }

    public void setFormMonth(Integer formMonth) {
        this.formMonth = formMonth;
    }

    public String getFormSubdepartmentName() {
        return formSubdepartmentName;
    }

    public void setFormSubdepartmentName(String formSubdepartmentName) {
        this.formSubdepartmentName = formSubdepartmentName;
    }

    public String getFormDepartmentName() {
        return formDepartmentName;
    }

    public void setFormDepartmentName(String formDepartmentName) {
        this.formDepartmentName = formDepartmentName;
    }

    public String getFormOfficeName() {
        return formOfficeName;
    }

    public void setFormOfficeName(String formOfficeName) {
        this.formOfficeName = formOfficeName;
    }

    public YearMonthDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(YearMonthDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public EmployeesForProjectsReportVO(EmployeesForProjectsReport employeesForProjectsReport) {
        for(EmployeesForProjectsReport.Row row : employeesForProjectsReport.getRows()) {
            this.rows.add(new EmployeesForProjectsReportVO.Row(row));
        }
        this.formYear = employeesForProjectsReport.getFormYear();
        this.formMonth = employeesForProjectsReport.getFormMonth();
        if(employeesForProjectsReport.getFormSubdepartment() != null) {
            this.formSubdepartmentName = employeesForProjectsReport.getFormSubdepartment().getName();
        }
        if(employeesForProjectsReport.getFormDepartment() != null) {
            this.formDepartmentName = employeesForProjectsReport.getFormDepartment().getName();
        }
        if(employeesForProjectsReport.getFormOffice() != null) {
            this.formOfficeName = employeesForProjectsReport.getFormOffice().getName();
        }
        this.createdAt = new YearMonthDateTime(employeesForProjectsReport.getCreatedAt());
    }
}
