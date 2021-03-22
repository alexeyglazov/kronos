/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.db.domain;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;

/**
 *
 * @author glazov
 */
public class ProjectCodeConflict {
    public  enum Status {
        NOT_DETECTED,
        DETECTED,
        IRRESOLVABLE,
        RESOLVED
    }
    private Long id;
    private ProjectCode projectCode;
    private Subdepartment checkingSubdepartment;
    private Status status;
    private Employee modifiedBy;
    private Date modifiedAt;
    private Set<ProjectCodeConflictHistoryItem> projectCodeConflictHistoryItems = new HashSet<ProjectCodeConflictHistoryItem>(); 
    
    public ProjectCodeConflict() {
    }

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

    public Subdepartment getCheckingSubdepartment() {
        return checkingSubdepartment;
    }

    public void setCheckingSubdepartment(Subdepartment checkingSubdepartment) {
        this.checkingSubdepartment = checkingSubdepartment;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public Employee getModifiedBy() {
        return modifiedBy;
    }

    public void setModifiedBy(Employee modifiedBy) {
        this.modifiedBy = modifiedBy;
    }

    public Date getModifiedAt() {
        return modifiedAt;
    }

    public void setModifiedAt(Date modifiedAt) {
        this.modifiedAt = modifiedAt;
    }

    public Set<ProjectCodeConflictHistoryItem> getProjectCodeConflictHistoryItems() {
        return projectCodeConflictHistoryItems;
    }

    public void setProjectCodeConflictHistoryItems(Set<ProjectCodeConflictHistoryItem> projectCodeConflictHistoryItems) {
        this.projectCodeConflictHistoryItems = projectCodeConflictHistoryItems;
    }
    public static ProjectCodeConflict.Status calculateConflictStatus(ProjectCode projectCode) {
        boolean hasNotDetected = false;
        boolean hasDetected = false;
        boolean hasIrresolvable = false;
        boolean hasResolved = false;
        for(ProjectCodeConflict tmpProjectCodeConflict : projectCode.getProjectCodeConflicts()) {
            if(ProjectCodeConflict.Status.NOT_DETECTED.equals(tmpProjectCodeConflict.getStatus())) {
                hasNotDetected = true;
            } else if(ProjectCodeConflict.Status.DETECTED.equals(tmpProjectCodeConflict.getStatus())) {
                hasDetected = true;
            } else if(ProjectCodeConflict.Status.IRRESOLVABLE.equals(tmpProjectCodeConflict.getStatus())) {
                hasIrresolvable = true;
            } else if(ProjectCodeConflict.Status.RESOLVED.equals(tmpProjectCodeConflict.getStatus())) {
                hasResolved = true;
            }
        }
        if(hasIrresolvable) {
            return ProjectCodeConflict.Status.IRRESOLVABLE;
        } else if(hasDetected) {
            return ProjectCodeConflict.Status.DETECTED;
        } else if(hasResolved) {
            return ProjectCodeConflict.Status.RESOLVED;
        } else if(hasNotDetected) {
            return ProjectCodeConflict.Status.NOT_DETECTED;
        }
        return null;
    }
}
