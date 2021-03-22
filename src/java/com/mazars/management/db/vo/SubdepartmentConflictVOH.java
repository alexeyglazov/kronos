package com.mazars.management.db.vo;
import com.mazars.management.db.domain.*;
import java.util.LinkedList;
import java.util.List;

public class SubdepartmentConflictVOH extends SubdepartmentConflictVO {
    private Long checkedSubdepartmentId;
    private Long checkingSubdepartmentId;

    public SubdepartmentConflictVOH() {}

    public SubdepartmentConflictVOH(SubdepartmentConflict subdepartmentConflict) {
        super(subdepartmentConflict);
        if(subdepartmentConflict.getCheckedSubdepartment() != null) {
            this.checkedSubdepartmentId = subdepartmentConflict.getCheckedSubdepartment().getId();
        }
        if(subdepartmentConflict.getCheckingSubdepartment() != null) {
            this.checkingSubdepartmentId = subdepartmentConflict.getCheckingSubdepartment().getId();
        }
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
    public static List<SubdepartmentConflictVOH> getList(List<SubdepartmentConflict> subdepartmentConflicts) {
        List<SubdepartmentConflictVOH> subdepartmentConflictVOs = new LinkedList<SubdepartmentConflictVOH>();
        if(subdepartmentConflicts == null) {
            return null;
        }
        for(SubdepartmentConflict subdepartmentConflict : subdepartmentConflicts) {
           subdepartmentConflictVOs.add(new SubdepartmentConflictVOH(subdepartmentConflict));
        }
        return subdepartmentConflictVOs;
    }
    
}
