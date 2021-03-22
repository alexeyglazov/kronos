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
public class PlanningTypeVOH extends PlanningTypeVO {
    private Long subdepartmentId;

    public PlanningTypeVOH() {
    }

    public PlanningTypeVOH(PlanningType planningType) {
        super(planningType);
        if(planningType.getSubdepartment() != null) {
            this.subdepartmentId = planningType.getSubdepartment().getId();
        } else {
            this.subdepartmentId = null;
        }
    }

    public Long getSubdepartmentId() {
        return subdepartmentId;
    }

    public void setSubdepartmentId(Long subdepartmentId) {
        this.subdepartmentId = subdepartmentId;
    }

}
