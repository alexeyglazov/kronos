/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.web.forms;
import com.google.gson.Gson;
import com.mazars.management.db.vo.YearMonthDate;

/**
 *
 * @author glazov
 */
public class YearMonthDateForm {
    private Integer year;
    private Integer month;
    private Integer dayOfMonth;

    public YearMonthDateForm() {
    }

    public Integer getYear() {
        return year;
    }

    public void setYear(Integer year) {
        this.year = year;
    }

    public Integer getMonth() {
        return month;
    }

    public void setMonth(Integer month) {
        this.month = month;
    }

    public Integer getDayOfMonth() {
        return dayOfMonth;
    }

    public void setDayOfMonth(Integer dayOfMonth) {
        this.dayOfMonth = dayOfMonth;
    }
    public YearMonthDate getYearMonthDate() {
        return new YearMonthDate(year, month, dayOfMonth);
    }
    public static YearMonthDateForm getFromJson(String json) {
        Gson gson = new Gson();
        return gson.fromJson(json, YearMonthDateForm.class);
    }
}
