/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.db.domain;

import java.util.Date;

/**
 *
 * @author glazov
 */
public class ProjectCodeConflictHistoryItem {
    private Long id;
    private ProjectCodeConflict projectCodeConflict;
    private ProjectCodeConflict.Status status;
    private Employee modifiedBy;
    private Date modifiedAt;
    private String comment;
    public ProjectCodeConflictHistoryItem() {
    }
    public static ProjectCodeConflictHistoryItem getInitialProjectCodeConflictHistoryItem(ProjectCodeConflict projectCodeConflict) {
        ProjectCodeConflictHistoryItem projectCodeConflictHistoryItem = new ProjectCodeConflictHistoryItem();
        projectCodeConflictHistoryItem.setProjectCodeConflict(projectCodeConflict);
        projectCodeConflictHistoryItem.setModifiedAt(projectCodeConflict.getModifiedAt());
        projectCodeConflictHistoryItem.setModifiedBy(projectCodeConflict.getModifiedBy());
        projectCodeConflictHistoryItem.setStatus(projectCodeConflict.getStatus());
        projectCodeConflictHistoryItem.setComment("Conflict was detected when Project code was created");
        return projectCodeConflictHistoryItem;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ProjectCodeConflict getProjectCodeConflict() {
        return projectCodeConflict;
    }

    public void setProjectCodeConflict(ProjectCodeConflict projectCodeConflict) {
        this.projectCodeConflict = projectCodeConflict;
    }

    public ProjectCodeConflict.Status getStatus() {
        return status;
    }

    public void setStatus(ProjectCodeConflict.Status status) {
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

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

}
