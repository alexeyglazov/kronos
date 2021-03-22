/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.reports.vo;

import com.mazars.management.db.vo.*;
import com.mazars.management.reports.*;
import com.mazars.management.reports.TrainingReport.SearchType;
import java.util.*;

/**
 *
 * @author glazov
 */
public class TrainingReportVO {
    public class RowVO {
        private Long employeeId;
        private String employeeUserName;
        private String employeeFullName;
        private Long officeId;
        private String officeName;
        private Long departmentId;
        private String departmentName;        
        private Long subdepartmentId;
        private String subdepartmentName;
        private Long taskId;
        private String taskName;
        private Integer timeSpent;
        private YearMonthDate day;
        private String description;
        private YearMonthDateTime modifiedAt;
        
        public RowVO(TrainingReport.Row row) {
            employeeId = row.getEmployee().getId();
            employeeUserName = row.getEmployee().getUserName();
            employeeFullName = row.getEmployee().getFullName();
            officeId = row.getOffice().getId();
            officeName = row.getOffice().getName();
            departmentId = row.getDepartment().getId();
            departmentName = row.getDepartment().getName();        
            subdepartmentId = row.getSubdepartment().getId();
            subdepartmentName = row.getSubdepartment().getName();
            taskId = row.getTask().getId();
            taskName = row.getTask().getName();
            timeSpent = row.getTimeSpentItem().getTimeSpent();
            day = new YearMonthDate(row.getTimeSpentItem().getDay());
            description = row.getTimeSpentItem().getDescription();
            modifiedAt = new YearMonthDateTime(row.getTimeSpentItem().getModifiedAt());
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

        public String getEmployeeFullName() {
            return employeeFullName;
        }

        public void setEmployeeFullName(String employeeFullName) {
            this.employeeFullName = employeeFullName;
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

        public Long getTaskId() {
            return taskId;
        }

        public void setTaskId(Long taskId) {
            this.taskId = taskId;
        }

        public String getTaskName() {
            return taskName;
        }

        public void setTaskName(String taskName) {
            this.taskName = taskName;
        }

        public Integer getTimeSpent() {
            return timeSpent;
        }

        public void setTimeSpent(Integer timeSpent) {
            this.timeSpent = timeSpent;
        }

        public YearMonthDate getDay() {
            return day;
        }

        public void setDay(YearMonthDate day) {
            this.day = day;
        }

        public String getDescription() {
            return description;
        }

        public void setDescription(String description) {
            this.description = description;
        }

        public YearMonthDateTime getModifiedAt() {
            return modifiedAt;
        }

        public void setModifiedAt(YearMonthDateTime modifiedAt) {
            this.modifiedAt = modifiedAt;
        }
    }

    private List<RowVO> rows = new LinkedList<RowVO>();
    private YearMonthDateTime createdAt;
    
    private YearMonthDate formStartDate;
    private YearMonthDate formEndDate;
    private String formKeyword;
    private TrainingReport.SearchType formSearchType;
    
    public TrainingReportVO(TrainingReport trainingReport) {
        this.createdAt = new YearMonthDateTime(trainingReport.getCreatedAt());
        for(TrainingReport.Row row : trainingReport.getRows()) {
            rows.add(new RowVO(row));
        }
        this.formStartDate = trainingReport.getFormStartDate();
        this.formEndDate = trainingReport.getFormEndDate();
        this.formKeyword = trainingReport.getFormKeyword();
        this.formSearchType = trainingReport.getFormSearchType();
    }

    public List<RowVO> getRows() {
        return rows;
    }

    public void setRows(List<RowVO> rows) {
        this.rows = rows;
    }

    public YearMonthDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(YearMonthDateTime createdAt) {
        this.createdAt = createdAt;
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

    public String getFormKeyword() {
        return formKeyword;
    }

    public void setFormKeyword(String formKeyword) {
        this.formKeyword = formKeyword;
    }

    public SearchType getFormSearchType() {
        return formSearchType;
    }

    public void setFormSearchType(SearchType formSearchType) {
        this.formSearchType = formSearchType;
    }
}
