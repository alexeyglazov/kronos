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
public class TaskTypeVO {
    private Long id;
    private String name;
    private Boolean isActive;
    private Boolean isInternal;

    public TaskTypeVO() {
    }

    public TaskTypeVO(TaskType taskType) {
        this.id = taskType.getId();
        this.name = taskType.getName();
        this.isActive = taskType.getIsActive();
        this.isInternal = taskType.getIsInternal();
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

    public Boolean getIsInternal() {
        return isInternal;
    }

    public void setIsInternal(Boolean isInternal) {
        this.isInternal = isInternal;
    }
    public static List<TaskTypeVO> getList(List<TaskType> taskTypes) {
        List<TaskTypeVO> taskTypeVOs = new LinkedList<TaskTypeVO>();
        if(taskTypes == null) {
            return null;
        }
        for(TaskType taskType : taskTypes) {
           taskTypeVOs.add(new TaskTypeVO(taskType));
        }
        return taskTypeVOs;
    }    
}
