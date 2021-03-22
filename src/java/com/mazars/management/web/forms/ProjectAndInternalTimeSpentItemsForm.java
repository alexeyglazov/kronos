/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mazars.management.web.forms;

import com.google.gson.Gson;
import com.mazars.management.charts.data.ProjectAndInternalTimeSpentItems;
import com.mazars.management.charts.data.ProjectAndInternalTimeSpentItems.View;
import com.mazars.management.db.vo.YearMonthDate;

/**
 *
 * @author Glazov
 */
public class ProjectAndInternalTimeSpentItemsForm {
    private YearMonthDate startDate;
    private YearMonthDate endDate;
    private Long employeeId;
    private ProjectAndInternalTimeSpentItems.View view;

    public ProjectAndInternalTimeSpentItemsForm() {
    }

    public View getView() {
        return view;
    }

    public void setView(View view) {
        this.view = view;
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

    public Long getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(Long employeeId) {
        this.employeeId = employeeId;
    }
    
    public static ProjectAndInternalTimeSpentItemsForm getFromJson(String json) {
        Gson gson = new Gson();
        return gson.fromJson(json, ProjectAndInternalTimeSpentItemsForm.class);
    }
}
