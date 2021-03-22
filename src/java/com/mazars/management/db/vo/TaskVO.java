/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.db.vo;
import com.mazars.management.db.domain.*;
import java.util.LinkedList;
import java.util.List;
/**
 *
 * @author glazov
 */
public class TaskVO {
    private Long id;
    private String name;
    private Boolean isActive;
    private Boolean isIdle;
    private Boolean isTraining;
    private String description;
    private String color;
    
    public TaskVO() {
    }

    public TaskVO(Task task) {
        this.id = task.getId();
        this.name = task.getName();
        this.isActive = task.getIsActive();
        this.isIdle = task.getIsIdle();
        this.isTraining = task.getIsTraining();
        this.description = task.getDescription();
        this.color = task.getColor();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
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

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }
    public static List<TaskVO> getList(List<Task> tasks) {
        List<TaskVO> taskVOs = new LinkedList<TaskVO>();
        if(tasks == null) {
            return null;
        }
        for(Task task : tasks) {
           taskVOs.add(new TaskVO(task));
        }
        return taskVOs;
    }       
}
