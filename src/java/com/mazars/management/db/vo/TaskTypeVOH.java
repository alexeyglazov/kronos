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
public class TaskTypeVOH extends TaskTypeVO {
    private Long subdepartmentId;

    public TaskTypeVOH() {
    }

    public TaskTypeVOH(TaskType taskType) {
        super(taskType);
        if(taskType.getSubdepartment() != null) {
            this.subdepartmentId = taskType.getSubdepartment().getId();
        } else {
            this.subdepartmentId = null;
        }
    }

    public Long getSubdepartmentId() {
        return subdepartmentId;
    }

    public void setSubdepartmentId(Long subdepartmentId) {
        this.subdepartmentId = subdepartmentId;
    }

}
