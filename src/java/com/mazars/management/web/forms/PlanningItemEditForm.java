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
public class PlanningItemEditForm {
    public enum Type {
        CREATE,
        EXISTING
    } 
    public enum Mode {
        CREATE,
        UPDATE
    }
    private PlanningItemEditForm.Mode mode;
    private Type planningGroupCreationType;
    
    private Long id;
    private Long planningGroupId;
    private String planningGroupDescription;
    private Boolean isApproved;
    private Long targetSubdepartmentId;
    private Long sourceSubdepartmentId;
    private Long employeeId;
    private Long inChargePersonId;
    private Long clientId;
    private Long activityId;
    private Long taskId;    
    private String description;
    private String location;
    private YearMonthDate startDate;
    private YearMonthDate endDate;
    private Long planningTypeId;

    public Mode getMode() {
        return mode;
    }

    public void setMode(Mode mode) {
        this.mode = mode;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getPlanningGroupId() {
        return planningGroupId;
    }

    public void setPlanningGroupId(Long planningGroupId) {
        this.planningGroupId = planningGroupId;
    }

    public Long getTargetSubdepartmentId() {
        return targetSubdepartmentId;
    }

    public void setTargetSubdepartmentId(Long targetSubdepartmentId) {
        this.targetSubdepartmentId = targetSubdepartmentId;
    }

    public Long getSourceSubdepartmentId() {
        return sourceSubdepartmentId;
    }

    public void setSourceSubdepartmentId(Long sourceSubdepartmentId) {
        this.sourceSubdepartmentId = sourceSubdepartmentId;
    }

    public Long getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(Long employeeId) {
        this.employeeId = employeeId;
    }

    public Long getInChargePersonId() {
        return inChargePersonId;
    }

    public void setInChargePersonId(Long inChargePersonId) {
        this.inChargePersonId = inChargePersonId;
    }

    public Long getClientId() {
        return clientId;
    }

    public void setClientId(Long clientId) {
        this.clientId = clientId;
    }

    public Type getPlanningGroupCreationType() {
        return planningGroupCreationType;
    }

    public void setPlanningGroupCreationType(Type planningGroupCreationType) {
        this.planningGroupCreationType = planningGroupCreationType;
    }

    public Long getPlanningTypeId() {
        return planningTypeId;
    }

    public void setPlanningTypeId(Long planningTypeId) {
        this.planningTypeId = planningTypeId;
    }

    public String getPlanningGroupDescription() {
        return planningGroupDescription;
    }

    public Boolean getIsApproved() {
        return isApproved;
    }

    public void setIsApproved(Boolean isApproved) {
        this.isApproved = isApproved;
    }

    public void setPlanningGroupDescription(String planningGroupDescription) {
        this.planningGroupDescription = planningGroupDescription;
    }

    public Long getActivityId() {
        return activityId;
    }

    public void setActivityId(Long activityId) {
        this.activityId = activityId;
    }

    public Long getTaskId() {
        return taskId;
    }

    public void setTaskId(Long taskId) {
        this.taskId = taskId;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
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
  
    public PlanningItemEditForm() {
    }

    public static PlanningItemEditForm getFromJson(String json) {
        Gson gson = new Gson();
        return gson.fromJson(json, PlanningItemEditForm.class);
    }
}
