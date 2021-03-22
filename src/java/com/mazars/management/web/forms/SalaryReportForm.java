/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.web.forms;
import com.google.gson.Gson;
import com.mazars.management.db.vo.*;

/**
 *
 * @author glazov
 */
public class SalaryReportForm {
    private YearMonthDate startDate;
    private YearMonthDate endDate;

    public SalaryReportForm() {
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

    public static SalaryReportForm getFromJson(String json) {
        Gson gson = new Gson();
        return gson.fromJson(json, SalaryReportForm.class);
    }
}
