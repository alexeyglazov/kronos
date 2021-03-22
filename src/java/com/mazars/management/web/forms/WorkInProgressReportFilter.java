/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.web.forms;
import com.mazars.management.db.domain.*;
import com.mazars.management.db.domain.ProjectCode.PeriodType;

/**
 *
 * @author glazov
 */
public class WorkInProgressReportFilter {
    public enum BudgetType {
        NO_BUDGET,
        FLAT_FEE,
        TIMESPENT,
        QUOTATION
    }
    private Long officeId;
    private Long departmentId;
    private Long subdepartmentId;
    private Long activityId;
    private Long groupId;
    private Long clientId;
    private Integer projectCodeYear;
    private ProjectCode.PeriodType projectCodePeriodType;
    private BudgetType budgetType;

    public Long getActivityId() {
        return activityId;
    }

    public void setActivityId(Long activityId) {
        this.activityId = activityId;
    }

    public BudgetType getBudgetType() {
        return budgetType;
    }

    public void setBudgetType(BudgetType budgetType) {
        this.budgetType = budgetType;
    }

    public Long getClientId() {
        return clientId;
    }

    public void setClientId(Long clientId) {
        this.clientId = clientId;
    }

    public Long getDepartmentId() {
        return departmentId;
    }

    public void setDepartmentId(Long departmentId) {
        this.departmentId = departmentId;
    }

    public Long getGroupId() {
        return groupId;
    }

    public void setGroupId(Long groupId) {
        this.groupId = groupId;
    }

    public Long getOfficeId() {
        return officeId;
    }

    public void setOfficeId(Long officeId) {
        this.officeId = officeId;
    }

    public PeriodType getProjectCodePeriodType() {
        return projectCodePeriodType;
    }

    public void setProjectCodePeriodType(PeriodType projectCodePeriodType) {
        this.projectCodePeriodType = projectCodePeriodType;
    }

    public Integer getProjectCodeYear() {
        return projectCodeYear;
    }

    public void setProjectCodeYear(Integer projectCodeYear) {
        this.projectCodeYear = projectCodeYear;
    }

    public Long getSubdepartmentId() {
        return subdepartmentId;
    }

    public void setSubdepartmentId(Long subdepartmentId) {
        this.subdepartmentId = subdepartmentId;
    }
}
