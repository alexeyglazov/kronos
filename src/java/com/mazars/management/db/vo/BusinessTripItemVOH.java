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
public class BusinessTripItemVOH extends BusinessTripItemVO {
    private Long projectCodeId;
    private Long employeeId;

    public BusinessTripItemVOH() {
    }

    public BusinessTripItemVOH(BusinessTripItem businessTripItem) {
        super(businessTripItem);
        if(businessTripItem.getProjectCode() != null) {
            this.projectCodeId = businessTripItem.getProjectCode().getId();
        } else {
            this.projectCodeId = null;
        }
        this.employeeId = businessTripItem.getEmployee().getId();
    }

    public Long getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(Long employeeId) {
        this.employeeId = employeeId;
    }

    public Long getProjectCodeId() {
        return projectCodeId;
    }

    public void setProjectCodeId(Long projectCodeId) {
        this.projectCodeId = projectCodeId;
    }
}
