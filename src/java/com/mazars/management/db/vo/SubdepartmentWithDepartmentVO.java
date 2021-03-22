/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.db.vo;
import com.mazars.management.db.domain.*;
import java.util.Set;
import java.util.HashSet;

/**
 *
 * @author glazov
 */
public class SubdepartmentWithDepartmentVO extends SubdepartmentVO {
    private Long departmentId;

    public SubdepartmentWithDepartmentVO() {
    }

    public SubdepartmentWithDepartmentVO(Subdepartment subdepartment) {
        super(subdepartment);
        this.departmentId = subdepartment.getDepartment().getId();
    }

    public Long getDepartmentId() {
        return departmentId;
    }

    public void setDepartmentId(Long departmentId) {
        this.departmentId = departmentId;
    }
}
