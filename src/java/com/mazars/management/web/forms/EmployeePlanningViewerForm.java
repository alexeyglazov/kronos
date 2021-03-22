/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.web.forms;
import com.google.gson.Gson;
import com.mazars.management.db.vo.*;
import com.mazars.management.reports.OwnTimeReport;

/**
 *
 * @author glazov
 */
public class EmployeePlanningViewerForm {
    private Long employeeId;
    private YearMonthDate startDate;
    private YearMonthDate endDate;

    public EmployeePlanningViewerForm() {
    }

    public YearMonthDate getEndDate() {
        return endDate;
    }

    public void setEndDate(YearMonthDate endDate) {
        this.endDate = endDate;
    }

    public YearMonthDate getStartDate() {
        return startDate;
    }

    public void setStartDate(YearMonthDate startDate) {
        this.startDate = startDate;
    }

    public Long getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(Long employeeId) {
        this.employeeId = employeeId;
    }

    
    public static EmployeePlanningViewerForm getFromJson(String json) {
        Gson gson = new Gson();
        return gson.fromJson(json, EmployeePlanningViewerForm.class);
    }
}
