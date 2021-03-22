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
public class PlanningGroupPickerForm {
    private List<Long> subdepartmentIds = new LinkedList<Long>();
    private String descriptionPattern;
    private YearMonthDate startDate;
    private YearMonthDate endDate;

    public PlanningGroupPickerForm() {       
    }

    public List<Long> getSubdepartmentIds() {
        return subdepartmentIds;
    }

    public void setSubdepartmentIds(List<Long> subdepartmentIds) {
        this.subdepartmentIds = subdepartmentIds;
    }

    public String getDescriptionPattern() {
        return descriptionPattern;
    }

    public void setDescriptionPattern(String descriptionPattern) {
        this.descriptionPattern = descriptionPattern;
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

    public static PlanningGroupPickerForm getFromJson(String json) {
        Gson gson = new Gson();
        return gson.fromJson(json, PlanningGroupPickerForm.class);
    }
}
