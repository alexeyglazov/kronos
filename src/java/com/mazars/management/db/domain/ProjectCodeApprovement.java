/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.db.domain;
import com.mazars.management.db.util.HibernateUtil;
import com.mazars.management.db.vo.YearMonth;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import org.hibernate.Query;
import org.hibernate.Session;

/**
 *
 * @author glazov
 */
public class ProjectCodeApprovement {
    public static enum AnalysisStatus {
        OK,
        NO_TIMESHEET,
        NO_PRIMARY_APPROVEMENT,
        NO_SECONDARY_APPROVEMENT,
        PRIMARY_APPROVEMENT_COMPROMISED,
        SECONDARY_APPROVEMENT_COMPROMISED
    }
    private Long id;
    private ProjectCode projectCode;
    private Boolean isPrimaryApproved;
    private Employee primaryApprovedBy;
    private Date primaryApprovedAt;
    private Boolean isSecondaryApproved;
    private Employee secondaryApprovedBy;
    private Date secondaryApprovedAt;
    private Integer year;
    private Integer month;
    
    public ProjectCodeApprovement() {};

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ProjectCode getProjectCode() {
        return projectCode;
    }

    public void setProjectCode(ProjectCode projectCode) {
        this.projectCode = projectCode;
    }

    public Boolean getIsPrimaryApproved() {
        return isPrimaryApproved;
    }

    public void setIsPrimaryApproved(Boolean isPrimaryApproved) {
        this.isPrimaryApproved = isPrimaryApproved;
    }

    public Employee getPrimaryApprovedBy() {
        return primaryApprovedBy;
    }

    public void setPrimaryApprovedBy(Employee primaryApprovedBy) {
        this.primaryApprovedBy = primaryApprovedBy;
    }

    public Date getPrimaryApprovedAt() {
        return primaryApprovedAt;
    }

    public void setPrimaryApprovedAt(Date primaryApprovedAt) {
        this.primaryApprovedAt = primaryApprovedAt;
    }

    public Boolean getIsSecondaryApproved() {
        return isSecondaryApproved;
    }

    public void setIsSecondaryApproved(Boolean isSecondaryApproved) {
        this.isSecondaryApproved = isSecondaryApproved;
    }

    public Employee getSecondaryApprovedBy() {
        return secondaryApprovedBy;
    }

    public void setSecondaryApprovedBy(Employee secondaryApprovedBy) {
        this.secondaryApprovedBy = secondaryApprovedBy;
    }

    public Date getSecondaryApprovedAt() {
        return secondaryApprovedAt;
    }

    public void setSecondaryApprovedAt(Date secondaryApprovedAt) {
        this.secondaryApprovedAt = secondaryApprovedAt;
    }

    public Integer getYear() {
        return year;
    }

    public void setYear(Integer year) {
        this.year = year;
    }

    public Integer getMonth() {
        return month;
    }

    public void setMonth(Integer month) {
        this.month = month;
    }
    public static Map<YearMonth, AnalysisStatus> analyse(ProjectCode projectCode) {
        Map<YearMonth, AnalysisStatus> items = new HashMap<YearMonth, AnalysisStatus>();
        Map<YearMonth, Date> timeSheetItems = new HashMap<YearMonth, Date>();
        Map<YearMonth, Date> primaryApprovementItems = new HashMap<YearMonth, Date>();
        Map<YearMonth, Date> secondaryApprovementItems = new HashMap<YearMonth, Date>();
        for(YearMonth month : TimeSpentItem.getReportedMonths(projectCode)) {
            Date lastModifiedAt = TimeSpentItem.getLastModifiedAt(projectCode, month);
            if(lastModifiedAt != null) {
                timeSheetItems.put(month, lastModifiedAt);
            }
        }
        
        for(ProjectCodeApprovement projectCodeApprovement : projectCode.getProjectCodeApprovements()) {
            YearMonth month = new YearMonth(projectCodeApprovement.getYear(), projectCodeApprovement.getMonth());
            if(projectCodeApprovement.getPrimaryApprovedAt() != null) {
                primaryApprovementItems.put(month, projectCodeApprovement.getPrimaryApprovedAt());
            }
            if(projectCodeApprovement.getSecondaryApprovedAt() != null) {
                secondaryApprovementItems.put(month, projectCodeApprovement.getSecondaryApprovedAt());
            }
        }        
        
        for(YearMonth month : timeSheetItems.keySet()) {
            Date lastModifiedAt = timeSheetItems.get(month);
            items.put(month, AnalysisStatus.NO_PRIMARY_APPROVEMENT);
        }
        for(YearMonth month : primaryApprovementItems.keySet()) {
            Date primaryApprovedAt = primaryApprovementItems.get(month);
            Date secondaryApprovedAt = secondaryApprovementItems.get(month);
            if(items.get(month) == null) {
                items.put(month, AnalysisStatus.NO_TIMESHEET);
            } else {
                if(primaryApprovedAt.before(timeSheetItems.get(month))) {
                    items.put(month, AnalysisStatus.PRIMARY_APPROVEMENT_COMPROMISED);
                } else if(secondaryApprovedAt == null) {
                    items.put(month, AnalysisStatus.NO_SECONDARY_APPROVEMENT);
                } else if(secondaryApprovedAt.before(primaryApprovedAt)) {
                    items.put(month, AnalysisStatus.SECONDARY_APPROVEMENT_COMPROMISED);
                } else {
                    items.put(month, AnalysisStatus.OK);
                }
            }
        }
        return items;
    }
}
