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
public class MonthlyTimeSheetReportForm {
    private Integer year;
    private Integer month;

    public MonthlyTimeSheetReportForm() {
    }

    public Integer getMonth() {
        return month;
    }

    public void setMonth(Integer month) {
        this.month = month;
    }

    public Integer getYear() {
        return year;
    }

    public void setYear(Integer year) {
        this.year = year;
    }

    public static MonthlyTimeSheetReportForm getFromJson(String json) {
        Gson gson = new Gson();
        return gson.fromJson(json, MonthlyTimeSheetReportForm.class);
    }
}
