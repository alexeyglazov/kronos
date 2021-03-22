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
public class PlanningItemsBatchCreationForm {
    public enum Mode {
        CREATE,
        UPDATE
    }    
    public static class Item {
        private Long id;
        private YearMonthDate startDate;
        private YearMonthDate endDate;
        private Long sourceSubdepartmentId;
        private String description;
        private String location;
        private Long employeeId;

        public Item() {
        }

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
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

        public Long getSourceSubdepartmentId() {
            return sourceSubdepartmentId;
        }

        public void setSourceSubdepartmentId(Long sourceSubdepartmentId) {
            this.sourceSubdepartmentId = sourceSubdepartmentId;
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

        public Long getEmployeeId() {
            return employeeId;
        }

        public void setEmployeeId(Long employeeId) {
            this.employeeId = employeeId;
        }
    } 
    private PlanningItemsBatchCreationForm.Mode mode;
    private Long id;
    private Long targetSubdepartmentId;
    private Long inChargePersonId;
    private Long clientId;
    private List<Long> projectCodeIds = new LinkedList<Long>();
    private Long taskId;
    private Long planningTypeId;
    private String description;
    private Boolean isApproved;
    private List<Item> items = new LinkedList<Item>();

    public PlanningItemsBatchCreationForm() {
    }

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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Long getTargetSubdepartmentId() {
        return targetSubdepartmentId;
    }

    public void setTargetSubdepartmentId(Long targetSubdepartmentId) {
        this.targetSubdepartmentId = targetSubdepartmentId;
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

    public List<Long> getProjectCodeIds() {
        return projectCodeIds;
    }

    public void setProjectCodeIds(List<Long> projectCodeIds) {
        this.projectCodeIds = projectCodeIds;
    }

    public Long getPlanningTypeId() {
        return planningTypeId;
    }

    public void setPlanningTypeId(Long planningTypeId) {
        this.planningTypeId = planningTypeId;
    }

    public Long getTaskId() {
        return taskId;
    }

    public void setTaskId(Long taskId) {
        this.taskId = taskId;
    }

    public Boolean getIsApproved() {
        return isApproved;
    }

    public void setIsApproved(Boolean isApproved) {
        this.isApproved = isApproved;
    }

    public List<Item> getItems() {
        return items;
    }

    public void setItems(List<Item> items) {
        this.items = items;
    }

    public static PlanningItemsBatchCreationForm getFromJson(String json) {
        Gson gson = new Gson();
        return gson.fromJson(json, PlanningItemsBatchCreationForm.class);
    }
}
