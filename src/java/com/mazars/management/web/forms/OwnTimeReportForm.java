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
public class OwnTimeReportForm {
    private Long officeId;
    private Long departmentId;
    private Long subdepartmentId;
    private OwnTimeReport.View view;
    private YearMonthDate startDate;
    private YearMonthDate endDate;

    public OwnTimeReportForm() {
    }

    public OwnTimeReport.View getView() {
        return view;
    }

    public void setView(OwnTimeReport.View view) {
        this.view = view;
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

    public Long getDepartmentId() {
        return departmentId;
    }

    public void setDepartmentId(Long departmentId) {
        this.departmentId = departmentId;
    }

    public Long getSubdepartmentId() {
        return subdepartmentId;
    }

    public void setSubdepartmentId(Long subdepartmentId) {
        this.subdepartmentId = subdepartmentId;
    }

    public void setOfficeId(Long officeId) {
        this.officeId = officeId;
    }

    public Long getOfficeId() {
        return officeId;
    }
    
    public static OwnTimeReportForm getFromJson(String json) {
        Gson gson = new Gson();
        return gson.fromJson(json, OwnTimeReportForm.class);
    }
}
