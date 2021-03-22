/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.reports.vo;

import com.mazars.management.db.vo.*;
import com.mazars.management.reports.*;
import java.util.List;
import java.util.LinkedList;
/**
 *
 * @author glazov
 */
public class ActualTimespentReportVO {
    public class Row {
        private Long groupId;
        private String groupName;
        private Long clientId;
        private String clientName;
        private Long employeeId;
        private String employeeFirstName;
        private String employeeLastName;
        private Long projectCodeId;
        private String projectCodeCode;
        private Long timespent;

        public Row(ActualTimespentReport.Row row) {
            if(row.getGroup() != null) {
                this.groupId = row.getGroup().getId();
                this.groupName = row.getGroup().getName();
            }
            if(row.getClient() != null) {
                this.clientId = row.getClient().getId();
                this.clientName = row.getClient().getName();
            }
            if(row.getEmployee() != null) {
                this.employeeId = row.getEmployee().getId();
                this.employeeFirstName = row.getEmployee().getFirstName();
                this.employeeLastName = row.getEmployee().getLastName();
            }
            if(row.getProjectCode() != null) {
                this.projectCodeId = row.getProjectCode().getId();
                this.projectCodeCode = row.getProjectCode().getCode();
            }
            this.timespent = row.getTimespent();
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

        public Long getEmployeeId() {
            return employeeId;
        }

        public void setEmployeeId(Long employeeId) {
            this.employeeId = employeeId;
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

        public Long getTimespent() {
            return timespent;
        }

        public void setTimespent(Long timespent) {
            this.timespent = timespent;
        }

    }

    List<Row> rows = new LinkedList<Row>();

    private YearMonthDateTime createdAt;
    
    private String formGroupName;
    private String formClientName;
    private String formProjectCodeCode;    
    private Integer formYear;    

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

    public String getFormGroupName() {
        return formGroupName;
    }

    public void setFormGroupName(String formGroupName) {
        this.formGroupName = formGroupName;
    }

    public String getFormClientName() {
        return formClientName;
    }

    public void setFormClientName(String formClientName) {
        this.formClientName = formClientName;
    }

    public String getFormProjectCodeCode() {
        return formProjectCodeCode;
    }

    public void setFormProjectCodeCode(String formProjectCodeCode) {
        this.formProjectCodeCode = formProjectCodeCode;
    }

    public Integer getFormYear() {
        return formYear;
    }

    public void setFormYear(Integer formYear) {
        this.formYear = formYear;
    }


    public ActualTimespentReportVO(ActualTimespentReport actualTimespentReport) {
        for(ActualTimespentReport.Row row : actualTimespentReport.getRows()) {
            this.rows.add(new ActualTimespentReportVO.Row(row));
        }
        this.createdAt = new YearMonthDateTime(actualTimespentReport.getCreatedAt());
        if(actualTimespentReport.getFormGroup() != null) {
            this.formGroupName = actualTimespentReport.getFormGroup().getName();
        }
        if(actualTimespentReport.getFormClient() != null) {
            this.formClientName = actualTimespentReport.getFormClient().getName();
        }
        if(actualTimespentReport.getFormProjectCode() != null) {
            this.formProjectCodeCode = actualTimespentReport.getFormProjectCode().getCode();
        }
        this.formYear = actualTimespentReport.getFormYear();
    }
}
