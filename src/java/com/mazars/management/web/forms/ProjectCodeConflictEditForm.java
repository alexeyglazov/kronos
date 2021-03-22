/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.web.forms;
import com.google.gson.Gson;
import com.mazars.management.db.domain.ProjectCodeConflict;
/**
 *
 * @author glazov
 */
public class ProjectCodeConflictEditForm {
    private ProjectCodeConflict.Status status;
    private Long id;
    private Long projectCodeId;
    private Long checkingSubdepartmentId;
    private String comment;

    public ProjectCodeConflictEditForm() {
    }

    public ProjectCodeConflict.Status getStatus() {
        return status;
    }

    public void setStatus(ProjectCodeConflict.Status status) {
        this.status = status;
    }

    public Long getProjectCodeId() {
        return projectCodeId;
    }

    public void setProjectCodeId(Long projectCodeId) {
        this.projectCodeId = projectCodeId;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getCheckingSubdepartmentId() {
        return checkingSubdepartmentId;
    }

    public void setCheckingSubdepartmentId(Long checkingSubdepartmentId) {
        this.checkingSubdepartmentId = checkingSubdepartmentId;
    }

    public static ProjectCodeConflictEditForm getFromJson(String json) {
        Gson gson = new Gson();
        return gson.fromJson(json, ProjectCodeConflictEditForm.class);
    }

}
