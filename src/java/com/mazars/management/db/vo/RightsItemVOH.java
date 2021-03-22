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
public class RightsItemVOH extends RightsItemVO {
    private Long employeeId;
    private Long moduleId;
    private Long subdepartmentId;

    public RightsItemVOH() {
    }

    public RightsItemVOH(RightsItem rightsItem) {
        super(rightsItem);
        this.employeeId = rightsItem.getEmployee().getId();
        this.moduleId = rightsItem.getModule().getId();
        this.subdepartmentId = rightsItem.getSubdepartment().getId();

    }

    public Long getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(Long employeeId) {
        this.employeeId = employeeId;
    }

    public Long getModuleId() {
        return moduleId;
    }

    public void setModuleId(Long moduleId) {
        this.moduleId = moduleId;
    }

    public Long getSubdepartmentId() {
        return subdepartmentId;
    }

    public void setSubdepartmentId(Long subdepartmentId) {
        this.subdepartmentId = subdepartmentId;
    }

}
