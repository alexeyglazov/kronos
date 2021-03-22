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
public class FreedaysManagerForm {
    private Integer year;
    private List<YearMonthDate> freedays = new LinkedList<YearMonthDate>();

    public FreedaysManagerForm() {
    }

    public Integer getYear() {
        return year;
    }

    public void setYear(Integer year) {
        this.year = year;
    }

    public List<YearMonthDate> getFreedays() {
        return freedays;
    }

    public void setFreedays(List<YearMonthDate> freedays) {
        this.freedays = freedays;
    }

    public static FreedaysManagerForm getFromJson(String json) {
        Gson gson = new Gson();
        return gson.fromJson(json, FreedaysManagerForm.class);
    }
}
