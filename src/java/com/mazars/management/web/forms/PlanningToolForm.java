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
public class PlanningToolForm {
    public enum Status {
        EDITED,
        DELETED
    }    
    public static class PlanningItem {
        private Long id;
        private Long targetSubdepartmentId;
        private Long sourceSubdepartmentId;
        private Long employeeId;
        private String description;
        private String location;
        private YearMonthDate startDate;
        private YearMonthDate endDate;
        private Status status;

        public PlanningItem() {
        }

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
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

        public Status getStatus() {
            return status;
        }

        public void setStatus(Status status) {
            this.status = status;
        }
    }    
    private List<PlanningItem> planningItems = new LinkedList<PlanningItem>();

    public PlanningToolForm() {
    }

    public List<PlanningItem> getPlanningItems() {
        return planningItems;
    }

    public void setPlanningItems(List<PlanningItem> planningItems) {
        this.planningItems = planningItems;
    }

    public static PlanningToolForm getFromJson(String json) {
        Gson gson = new Gson();
        return gson.fromJson(json, PlanningToolForm.class);
    }
}
