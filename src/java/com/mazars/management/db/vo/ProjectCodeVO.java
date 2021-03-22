/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.db.vo;
import com.mazars.management.db.domain.*;
import java.util.Date;
import java.util.LinkedList;
import java.util.List;

/**
 *
 * @author glazov
 */
public class ProjectCodeVO {
    private Long id;

    private ProjectCode.PeriodType periodType;
    private ProjectCode.PeriodQuarter periodQuarter;
    private ProjectCode.PeriodMonth periodMonth;
    private ProjectCode.PeriodDate periodDate;
    private Integer periodCounter;

    private String code;
    private Integer year;
    private String description;
    private String comment;
    private YearMonthDateTime createdAt;
    private YearMonthDateTime modifiedAt;
    private Boolean isClosed;
    private YearMonthDateTime closedAt;
    private YearMonthDate startDate;
    private YearMonthDate endDate;
    private Boolean isFuture;
    private Boolean isDead;
    private Boolean isHidden;
    // For example 2010 must be displayed as 2010-2011
    private Integer financialYear;
    private ProjectCodeConflict.Status conflictStatus;

    public ProjectCodeVO() {
    }

    public ProjectCodeVO(ProjectCode projectCode) {
        this.id = projectCode.getId();
        this.periodType = projectCode.getPeriodType();
        this.periodQuarter = projectCode.getPeriodQuarter();
        this.periodMonth = projectCode.getPeriodMonth();
        this.periodDate = projectCode.getPeriodDate();
        this.periodCounter = projectCode.getPeriodCounter();
        this.code = projectCode.getCode();
        this.year = projectCode.getYear();
        this.description = projectCode.getDescription();
        this.comment = projectCode.getComment();
        this.conflictStatus = projectCode.getConflictStatus();
        if(projectCode.getCreatedAt() != null) {
            this.createdAt = new YearMonthDateTime(projectCode.getCreatedAt());
        }
        if(projectCode.getModifiedAt() != null) {
            this.modifiedAt = new YearMonthDateTime(projectCode.getModifiedAt());
        }    
        this.isClosed = projectCode.getIsClosed();
        if(projectCode.getClosedAt() != null) {
            this.closedAt = new YearMonthDateTime(projectCode.getClosedAt());
        }
        if(projectCode.getStartDate() != null) {
            this.startDate = new YearMonthDate(projectCode.getStartDate());
        }
        if(projectCode.getEndDate() != null) {
            this.endDate = new YearMonthDate(projectCode.getEndDate());
        }
        this.isFuture = projectCode.getIsFuture();
        this.isDead = projectCode.getIsDead();
        this.isHidden = projectCode.getIsHidden();
        this.financialYear = projectCode.getFinancialYear();
    }

    public ProjectCodeConflict.Status getConflictStatus() {
        return conflictStatus;
    }

    public void setConflictStatus(ProjectCodeConflict.Status conflictStatus) {
        this.conflictStatus = conflictStatus;
    }

    public Boolean getIsHidden() {
        return isHidden;
    }

    public void setIsHidden(Boolean isHidden) {
        this.isHidden = isHidden;
    }

    public Integer getFinancialYear() {
        return financialYear;
    }

    public void setFinancialYear(Integer financialYear) {
        this.financialYear = financialYear;
    }

    public Integer getYear() {
        return year;
    }

    public void setYear(Integer year) {
        this.year = year;
    }

    public Boolean getIsDead() {
        return isDead;
    }

    public void setIsDead(Boolean isDead) {
        this.isDead = isDead;
    }

    public Boolean getIsFuture() {
        return isFuture;
    }

    public void setIsFuture(Boolean isFuture) {
        this.isFuture = isFuture;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public YearMonthDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(YearMonthDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public YearMonthDateTime getModifiedAt() {
        return modifiedAt;
    }

    public void setModifiedAt(YearMonthDateTime modifiedAt) {
        this.modifiedAt = modifiedAt;
    }

    public YearMonthDateTime getClosedAt() {
        return closedAt;
    }

    public void setClosedAt(YearMonthDateTime closedAt) {
        this.closedAt = closedAt;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public YearMonthDate getEndDate() {
        return endDate;
    }

    public void setEndDate(YearMonthDate endDate) {
        this.endDate = endDate;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Boolean getIsClosed() {
        return isClosed;
    }

    public void setIsClosed(Boolean isClosed) {
        this.isClosed = isClosed;
    }

    public YearMonthDate getStartDate() {
        return startDate;
    }

    public void setStartDate(YearMonthDate startDate) {
        this.startDate = startDate;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public Integer getPeriodCounter() {
        return periodCounter;
    }

    public void setPeriodCounter(Integer periodCounter) {
        this.periodCounter = periodCounter;
    }

    public ProjectCode.PeriodDate getPeriodDate() {
        return periodDate;
    }

    public void setPeriodDate(ProjectCode.PeriodDate periodDate) {
        this.periodDate = periodDate;
    }

    public ProjectCode.PeriodMonth getPeriodMonth() {
        return periodMonth;
    }

    public void setPeriodMonth(ProjectCode.PeriodMonth periodMonth) {
        this.periodMonth = periodMonth;
    }

    public ProjectCode.PeriodQuarter getPeriodQuarter() {
        return periodQuarter;
    }

    public void setPeriodQuarter(ProjectCode.PeriodQuarter periodQuarter) {
        this.periodQuarter = periodQuarter;
    }

    public ProjectCode.PeriodType getPeriodType() {
        return periodType;
    }

    public void setPeriodType(ProjectCode.PeriodType periodType) {
        this.periodType = periodType;
    }
    public static List<ProjectCodeVO> getList(List<ProjectCode> projectCodes) {
        List<ProjectCodeVO> projectCodeVOs = new LinkedList<ProjectCodeVO>();
        if(projectCodes == null) {
            return null;
        }
        for(ProjectCode projectCode : projectCodes) {
           projectCodeVOs.add(new ProjectCodeVO(projectCode));
        }
        return projectCodeVOs;
    }
}
