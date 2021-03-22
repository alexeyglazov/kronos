/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.reports.vo;

import com.mazars.management.db.domain.*;
import com.mazars.management.db.domain.FeesItem.Type;
import com.mazars.management.db.vo.*;
import com.mazars.management.reports.*;
import java.math.BigDecimal;
import java.util.Calendar;
import java.util.LinkedList;
import java.util.List;
/**
 *
 * @author glazov
 */
public class BusinessTripReportVO {
    public class Row {
        private Long projectCodeId;
        private String projectCodeCode;
        
        private Long clientId;
        private String clientName;
        
        private Long employeeId;
        private String employeeFirstName;
        private String employeeLastName;
        private String employeeFirstNameLocalLanguage;
        private String employeeLastNameLocalLanguage;

        private YearMonthDate startDate;
        private YearMonthDate endDate;
        private Long businessTripDaysCount;

        public Row(BusinessTripReport.Row row) {
            this.projectCodeId = row.getProjectCode().getId();
            this.projectCodeCode = row.getProjectCode().getCode();

            this.clientId = row.getClient().getId();
            this.clientName = row.getClient().getName();

            this.employeeId = row.getEmployee().getId();
            this.employeeFirstName = row.getEmployee().getFirstName();
            this.employeeLastName = row.getEmployee().getLastName();
            this.employeeFirstNameLocalLanguage = row.getEmployee().getFirstNameLocalLanguage();
            this.employeeLastNameLocalLanguage = row.getEmployee().getLastNameLocalLanguage();

            if(row.getStartDate() != null) {
                this.startDate = new YearMonthDate(row.getStartDate());
            }
            if(row.getEndDate() != null) {
                this.endDate = new YearMonthDate(row.getEndDate());
            }
            this.businessTripDaysCount = row.getBusinessTripDaysCount();
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

        public Long getBusinessTripDaysCount() {
            return businessTripDaysCount;
        }

        public void setBusinessTripDaysCount(Long businessTripDaysCount) {
            this.businessTripDaysCount = businessTripDaysCount;
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

        public YearMonthDate getStartDate() {
            return startDate;
        }

        public void setStartDate(YearMonthDate startDate) {
            this.startDate = startDate;
        }

        public YearMonthDate getEndDate() {
            return endDate;
        }

        public void setEndDate(YearMonthDate endDate) {
            this.endDate = endDate;
        }
    }

    List<Row> rows = new LinkedList<Row>();
    YearMonthDateTime createdAt;

    private YearMonthDate formStartDate;
    private YearMonthDate formEndDate;


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

    public List<Row> getRows() {
        return rows;
    }

    public void setRows(List<Row> rows) {
        this.rows = rows;
    }

    public BusinessTripReportVO(BusinessTripReport businessTripReport) {
        this.createdAt = new YearMonthDateTime(businessTripReport.getCreatedAt());
        this.formStartDate = businessTripReport.getFormStartDate();
        this.formEndDate = businessTripReport.getFormEndDate();
        
        for(BusinessTripReport.Row row : businessTripReport.getRows()) {
            this.rows.add(new BusinessTripReportVO.Row(row));
        }
    }
}
