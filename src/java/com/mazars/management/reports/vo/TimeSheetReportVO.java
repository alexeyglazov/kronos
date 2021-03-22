/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.reports.vo;

import com.mazars.management.db.vo.*;
import com.mazars.management.db.domain.Employee;
import com.mazars.management.db.domain.Subdepartment;
import com.mazars.management.db.domain.Department;
import com.mazars.management.reports.*;
import java.util.List;
import java.util.LinkedList;
import java.util.Calendar;
import java.util.Date;
/**
 *
 * @author glazov
 */
public class TimeSheetReportVO {
    public class Row {
        private String groupName;
        private String clientName;
        private String code;
        private Calendar day;
        private Integer timeSpent;
        private String description;
        private String taskTypeName;
        private String taskName;
        private YearMonthDateTime modifiedAt;

        public Row(TimeSheetReport.Row row) {
            this.groupName = row.getGroupName();
            this.clientName = row.getClientName();
            this.code = row.getCode();
            this.day = row.getDay();
            this.timeSpent = row.getTimeSpent();
            this.description = row.getDescription();
            this.taskTypeName = row.getTaskTypeName();
            this.taskName = row.getTaskName();
            if(row.getModifiedAt() != null) {
                this.modifiedAt = new YearMonthDateTime(row.getModifiedAt());
            }
        }

        public String getClientName() {
            return clientName;
        }

        public void setClientName(String clientName) {
            this.clientName = clientName;
        }

        public String getCode() {
            return code;
        }

        public void setCode(String code) {
            this.code = code;
        }

        public Calendar getDay() {
            return day;
        }

        public void setDay(Calendar day) {
            this.day = day;
        }

        public String getDescription() {
            return description;
        }

        public void setDescription(String description) {
            this.description = description;
        }

        public String getGroupName() {
            return groupName;
        }

        public void setGroupName(String groupName) {
            this.groupName = groupName;
        }

        public YearMonthDateTime getModifiedAt() {
            return modifiedAt;
        }

        public void setModifiedAt(YearMonthDateTime modifiedAt) {
            this.modifiedAt = modifiedAt;
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

        public Integer getTimeSpent() {
            return timeSpent;
        }

        public void setTimeSpent(Integer timeSpent) {
            this.timeSpent = timeSpent;
        }
    }

    List<Row> rows = new LinkedList<Row>();
    YearMonthDateTime createdAt;
    YearMonthDate formStartDate;
    YearMonthDate formEndDate;
    EmployeeWithoutPasswordVO formEmployee;
    SubdepartmentVO formEmployeeSubdepartment;
    DepartmentVO formEmployeeDepartment;

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

    public EmployeeWithoutPasswordVO getFormEmployee() {
        return formEmployee;
    }

    public void setFormEmployee(EmployeeWithoutPasswordVO formEmployee) {
        this.formEmployee = formEmployee;
    }

    public SubdepartmentVO getFormEmployeeSubdepartment() {
        return formEmployeeSubdepartment;
    }

    public void setFormEmployeeSubdepartment(SubdepartmentVO formEmployeeSubdepartment) {
        this.formEmployeeSubdepartment = formEmployeeSubdepartment;
    }

    public DepartmentVO getFormEmployeeDepartment() {
        return formEmployeeDepartment;
    }

    public void setFormEmployeeDepartment(DepartmentVO formEmployeeDepartment) {
        this.formEmployeeDepartment = formEmployeeDepartment;
    }


    public TimeSheetReportVO(TimeSheetReport timeSheetReport) {
        for(TimeSheetReport.Row row : timeSheetReport.getRows()) {
            this.rows.add(new TimeSheetReportVO.Row(row));
        }
        this.createdAt = new YearMonthDateTime(timeSheetReport.getCreatedAt());
        this.formEmployee = new EmployeeWithoutPasswordVO(timeSheetReport.getFormEmployee());
        this.formEmployeeSubdepartment = new SubdepartmentVO(timeSheetReport.getFormEmployeeSubdepartment());
        this.formEmployeeDepartment = new DepartmentVO(timeSheetReport.getFormEmployeeDepartment());
    }
}
