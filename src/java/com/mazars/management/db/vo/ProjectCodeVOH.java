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
public class ProjectCodeVOH extends ProjectCodeVO {
    private Long clientId;
    private Long subdepartmentId;
    private Long activityId;

    private Long createdById;
    private Long closedById;
    private Long inChargePeronId;
    private Long inChargePartnerId;

    public ProjectCodeVOH() {
    }

    public ProjectCodeVOH(ProjectCode projectCode) {
        super(projectCode);
        this.clientId = projectCode.getClient().getId();
        this.subdepartmentId = projectCode.getSubdepartment().getId();
        this.activityId = projectCode.getActivity().getId();
        this.createdById = projectCode.getCreatedBy().getId();
        this.closedById = null;
        if(projectCode.getClosedBy() != null) {
            this.closedById = projectCode.getClosedBy().getId();
        }
        if(projectCode.getInChargePerson() != null) {
            this.inChargePeronId = projectCode.getInChargePerson().getId();
        }
        if(projectCode.getInChargePartner() != null) {
            this.inChargePartnerId = projectCode.getInChargePartner().getId();
        }
     }

    public Long getInChargePeronId() {
        return inChargePeronId;
    }

    public void setInChargePeronId(Long inChargePeronId) {
        this.inChargePeronId = inChargePeronId;
    }

    public Long getInChargePartnerId() {
        return inChargePartnerId;
    }

    public void setInChargePartnerId(Long inChargePartnerId) {
        this.inChargePartnerId = inChargePartnerId;
    }

    public Long getActivityId() {
        return activityId;
    }

    public void setActivityId(Long activityId) {
        this.activityId = activityId;
    }

    public Long getClientId() {
        return clientId;
    }

    public void setClientId(Long clientId) {
        this.clientId = clientId;
    }

    public Long getClosedById() {
        return closedById;
    }

    public void setClosedById(Long closedById) {
        this.closedById = closedById;
    }

    public Long getCreatedById() {
        return createdById;
    }

    public void setCreatedById(Long createdById) {
        this.createdById = createdById;
    }

    public Long getSubdepartmentId() {
        return subdepartmentId;
    }

    public void setSubdepartmentId(Long subdepartmentId) {
        this.subdepartmentId = subdepartmentId;
    }
}
