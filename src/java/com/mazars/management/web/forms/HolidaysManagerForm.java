/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.web.forms;
import com.google.gson.Gson;
import com.mazars.management.db.vo.YearMonthDate;
import java.util.LinkedList;
import java.util.List;

/**
 *
 * @author glazov
 */
public class HolidaysManagerForm {
    private Integer year;
    private List<YearMonthDate> holidays = new LinkedList<YearMonthDate>();

    public HolidaysManagerForm() {
    }

    public Integer getYear() {
        return year;
    }

    public void setYear(Integer year) {
        this.year = year;
    }

    public List<YearMonthDate> getHolidays() {
        return holidays;
    }

    public void setHolidays(List<YearMonthDate> holidays) {
        this.holidays = holidays;
    }

    public static HolidaysManagerForm getFromJson(String json) {
        Gson gson = new Gson();
        return gson.fromJson(json, HolidaysManagerForm.class);
    }
}
