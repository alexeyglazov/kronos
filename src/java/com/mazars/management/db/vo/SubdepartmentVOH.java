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
public class SubdepartmentVOH extends SubdepartmentVO {
    private Long departmentId;
    private Set<Long> employeeIds  = new HashSet<Long>();
    private Set<Long> activityIds = new HashSet<Long>();
    private Set<Long> positionIds = new HashSet<Long>();
    private Set<Long> taskTypeIds = new HashSet<Long>();
    private Set<Long> internalTaskIds = new HashSet<Long>();
    private Set<Long> projectCodeIds = new HashSet<Long>();

    public SubdepartmentVOH() {
    }

    public SubdepartmentVOH(Subdepartment subdepartment) {
        super(subdepartment);
        this.departmentId = subdepartment.getDepartment().getId();
        for(Employee employee : subdepartment.getEmployees()) {
            this.employeeIds.add(employee.getId());
        }
        for(Activity activity : subdepartment.getActivities()) {
            this.activityIds.add(activity.getId());
        }
        for(Position position : subdepartment.getPositions()) {
            this.positionIds.add(position.getId());
        }
        for(TaskType taskType : subdepartment.getTaskTypes()) {
            this.taskTypeIds.add(taskType.getId());
        }
        for(ProjectCode projectCode : subdepartment.getProjectCodes()) {
            this.projectCodeIds.add(projectCode.getId());
        }
    }

    public Set<Long> getActivityIds() {
        return activityIds;
    }

    public void setActivityIds(Set<Long> activityIds) {
        this.activityIds = activityIds;
    }

    public Long getDepartmentId() {
        return departmentId;
    }

    public void setDepartmentId(Long departmentId) {
        this.departmentId = departmentId;
    }

    public Set<Long> getEmployeeIds() {
        return employeeIds;
    }

    public void setEmployeeIds(Set<Long> employeeIds) {
        this.employeeIds = employeeIds;
    }

    public Set<Long> getPositionIds() {
        return positionIds;
    }

    public void setPositionIds(Set<Long> positionIds) {
        this.positionIds = positionIds;
    }

    public Set<Long> getProjectCodeIds() {
        return projectCodeIds;
    }

    public void setProjectCodeIds(Set<Long> projectCodeIds) {
        this.projectCodeIds = projectCodeIds;
    }

    public Set<Long> getTaskTypeIds() {
        return taskTypeIds;
    }

    public void setTaskTypeIds(Set<Long> taskTypeIds) {
        this.taskTypeIds = taskTypeIds;
    }

    public void setInternalTaskIds(Set<Long> internalTaskIds) {
        this.internalTaskIds = internalTaskIds;
    }
}
