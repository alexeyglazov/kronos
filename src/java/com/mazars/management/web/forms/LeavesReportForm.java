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
public class LeavesReportForm {
    private YearMonthDate date;
    private Boolean isActive;

    public LeavesReportForm() {
    }

    public YearMonthDate getDate() {
        return date;
    }

    public void setDate(YearMonthDate date) {
        this.date = date;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    public static LeavesReportForm getFromJson(String json) {
        Gson gson = new Gson();
        return gson.fromJson(json, LeavesReportForm.class);
    }
}
