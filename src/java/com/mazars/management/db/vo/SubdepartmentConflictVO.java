package com.mazars.management.db.vo;
import com.mazars.management.db.domain.*;

public class SubdepartmentConflictVO {
    private Long id;
    public SubdepartmentConflictVO() {}

    public SubdepartmentConflictVO(SubdepartmentConflict subdepartmentConflict) {
        this.id = subdepartmentConflict.getId();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
}
