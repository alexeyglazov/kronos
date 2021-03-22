/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.web.forms;
import com.google.gson.Gson;
import java.util.List;
import java.util.LinkedList;

/**
 *
 * @author glazov
 */
public class BusinessTripItemsForm {
    public static class Item {

        private Long projectCodeId;
        private Integer dayOfMonth;

        public Long getProjectCodeId() {
            return projectCodeId;
        }

        public void setProjectCodeId(Long projectCodeId) {
            this.projectCodeId = projectCodeId;
        }

        public Integer getDayOfMonth() {
            return dayOfMonth;
        }

        public void setDayOfMonth(Integer dayOfMonth) {
            this.dayOfMonth = dayOfMonth;
        }
    }
    private Integer year;
    private Integer month;
    private List<Item> items = new LinkedList<Item>();

    public BusinessTripItemsForm() {
    }

    public List<Item> getItems() {
        return items;
    }

    public void setItems(List<Item> items) {
        this.items = items;
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

    public static BusinessTripItemsForm getFromJson(String json) {
        Gson gson = new Gson();
        return gson.fromJson(json, BusinessTripItemsForm.class);
    }

}
