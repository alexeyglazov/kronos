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
public class TimeSpentItemsForm {
    public static class Item {

        private Long id;
        private String description;
        private Integer timeSpent;

        public String getDescription() {
            return description;
        }

        public void setDescription(String description) {
            this.description = description;
        }

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public Integer getTimeSpent() {
            return timeSpent;
        }

        public void setTimeSpent(Integer timeSpent) {
            this.timeSpent = timeSpent;
        }
    }
    private String mode;
    private Integer year;
    private Integer month;
    private List<Integer> days;
    private Long projectCodeId;
    private Long taskId;
    private List<Item> items = new LinkedList<Item>();

    public TimeSpentItemsForm() {
    }

    public String getMode() {
        return mode;
    }

    public void setMode(String mode) {
        this.mode = mode;
    }

    public List<Integer> getDays() {
        return days;
    }

    public void setDays(List<Integer> days) {
        this.days = days;
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

    public Long getProjectCodeId() {
        return projectCodeId;
    }

    public void setProjectCodeId(Long projectCodeId) {
        this.projectCodeId = projectCodeId;
    }

    public Long getTaskId() {
        return taskId;
    }

    public void setTaskId(Long taskId) {
        this.taskId = taskId;
    }

    public static TimeSpentItemsForm getFromJson(String json) {
        Gson gson = new Gson();
        return gson.fromJson(json, TimeSpentItemsForm.class);
    }

}
