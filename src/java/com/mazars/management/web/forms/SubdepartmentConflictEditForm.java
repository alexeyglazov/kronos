/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.web.forms;
import com.google.gson.Gson;

/**
 *
 * @author glazov
 */
public class SubdepartmentConflictEditForm {
    public enum Mode {
        CREATE,
        UPDATE
    }
    private SubdepartmentConflictEditForm.Mode mode;
    private Long id;
    private Long checkedSubdepartmentId;
    private Long checkingSubdepartmentId;

    public SubdepartmentConflictEditForm() {
    }


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Mode getMode() {
        return mode;
    }

    public void setMode(Mode mode) {
        this.mode = mode;
    }

    public Long getCheckedSubdepartmentId() {
        return checkedSubdepartmentId;
    }

    public void setCheckedSubdepartmentId(Long checkedSubdepartmentId) {
        this.checkedSubdepartmentId = checkedSubdepartmentId;
    }

    public Long getCheckingSubdepartmentId() {
        return checkingSubdepartmentId;
    }

    public void setCheckingSubdepartmentId(Long checkingSubdepartmentId) {
        this.checkingSubdepartmentId = checkingSubdepartmentId;
    }

    public static SubdepartmentConflictEditForm getFromJson(String json) {
        Gson gson = new Gson();
        return gson.fromJson(json, SubdepartmentConflictEditForm.class);
    }
}
