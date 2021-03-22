/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.web.forms;
import com.google.gson.Gson;

/**
 *
 * @author glazov
 */
public class TaskEditForm {
    public enum Mode {
        CREATE,
        UPDATE
    }
    private TaskEditForm.Mode mode;
    private Long id;
    private Long taskTypeId;
    private String name;
    private Boolean isActive;
    private Boolean isIdle;
    private Boolean isTraining;
    private String description;

    public TaskEditForm() {
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Long getTaskTypeId() {
        return taskTypeId;
    }

    public void setTaskTypeId(Long taskTypeId) {
        this.taskTypeId = taskTypeId;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Mode getMode() {
        return mode;
    }

    public void setMode(Mode mode) {
        this.mode = mode;
    }

    public Boolean getIsIdle() {
        return isIdle;
    }

    public void setIsIdle(Boolean isIdle) {
        this.isIdle = isIdle;
    }

    public Boolean getIsTraining() {
        return isTraining;
    }

    public void setIsTraining(Boolean isTraining) {
        this.isTraining = isTraining;
    }

    public static TaskEditForm getFromJson(String json) {
        Gson gson = new Gson();
        return gson.fromJson(json, TaskEditForm.class);
    }

}
