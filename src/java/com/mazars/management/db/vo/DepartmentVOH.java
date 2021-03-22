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
public class DepartmentVOH extends DepartmentVO{
    private Long officeId;
    private Set<Long> subdepartmentIds = new HashSet<Long>();

    public DepartmentVOH() {
    }

    public DepartmentVOH(Department department) {
        super(department);
        this.officeId = department.getOffice().getId();
        for(Subdepartment subdepartment : department.getSubdepartments()) {
            this.subdepartmentIds.add(subdepartment.getId());
        }
    }

    public Long getOfficeId() {
        return officeId;
    }

    public void setOfficeId(Long officeId) {
        this.officeId = officeId;
    }

    public Set<Long> getSubdepartmentIds() {
        return subdepartmentIds;
    }

    public void setSubdepartmentIds(Set<Long> subdepartmentIds) {
        this.subdepartmentIds = subdepartmentIds;
    }

}
