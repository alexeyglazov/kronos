/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.db.vo;
import com.mazars.management.db.domain.*;
import java.util.Set;
import java.util.HashSet;
/**
 *
 * @author glazov
 */
public class TaskVOH extends TaskVO {
    private Long taskTypeId;
    private Set<Long> timeSpentItemIds = new HashSet<Long>();

    public TaskVOH() {
    }

    public TaskVOH(Task task) {
        super(task);
        this.taskTypeId = task.getTaskType().getId();
        for(TimeSpentItem timeSpentItem : task.getTimeSpentItems()) {
            this.timeSpentItemIds.add(timeSpentItem.getId());
        }
    }

    public Long getTaskTypeId() {
        return taskTypeId;
    }

    public void setTaskTypeId(Long taskTypeId) {
        this.taskTypeId = taskTypeId;
    }

    public Set<Long> getTimeSpentItemIds() {
        return timeSpentItemIds;
    }

    public void setTimeSpentItemIds(Set<Long> timeSpentItemIds) {
        this.timeSpentItemIds = timeSpentItemIds;
    }
}
