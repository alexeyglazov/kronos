/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.web.forms;
import com.google.gson.Gson;
import java.util.List;
/**
 *
 * @author glazov
 */
public class MonthCloserForm {
    private Integer year;
    private List<Integer> closedMonthIds;

    public MonthCloserForm() {
    }

    public List<Integer> getClosedMonthIds() {
        return closedMonthIds;
    }

    public void setClosedMonthIds(List<Integer> closedMonthIds) {
        this.closedMonthIds = closedMonthIds;
    }

    public Integer getYear() {
        return year;
    }

    public void setYear(Integer year) {
        this.year = year;
    }

    public static MonthCloserForm getFromJson(String json) {
        Gson gson = new Gson();
        return gson.fromJson(json, MonthCloserForm.class);
    }

}
