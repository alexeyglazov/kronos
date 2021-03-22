/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.web.vo;
import com.mazars.management.db.domain.*;
import java.util.Set;
import java.util.HashSet;
/**
 *
 * @author glazov
 */
public class TimeSpentItemSimplifiedVOH extends TimeSpentItemSimplifiedVO {
    private Long projectCodeId;
    private Long taskId;
    private Long employeeId;

    public TimeSpentItemSimplifiedVOH() {
    }

    public TimeSpentItemSimplifiedVOH(TimeSpentItem timeSpentItem) {
        super(timeSpentItem);
        if(timeSpentItem.getProjectCode() != null) {
            this.projectCodeId = timeSpentItem.getProjectCode().getId();
        } else {
            this.projectCodeId = null;
        }
        this.taskId = timeSpentItem.getTask().getId();
        this.employeeId = timeSpentItem.getEmployee().getId();
    }

    public Long getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(Long employeeId) {
        this.employeeId = employeeId;
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
}
