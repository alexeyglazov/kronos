/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.db.vo;
import com.mazars.management.db.domain.*;
import com.mazars.management.web.vo.ConciseEmployee;
/**
 *
 * @author glazov
 */
public class ProjectCodeVODetailed extends ProjectCodeVO {
    private String client;
    private String subdepartment;
    private String activity;
    private String office;

    private String createdBy;
    private String closedBy;
    private ConciseEmployee inChargePerson;
    private ConciseEmployee inChargePartner;

    public ProjectCodeVODetailed() {
    }

    public ProjectCodeVODetailed(ProjectCode projectCode) {
        super(projectCode);
        this.client = projectCode.getClient().getName();
        this.subdepartment = projectCode.getSubdepartment().getName();
        this.activity = projectCode.getActivity().getName();
        this.office = projectCode.getSubdepartment().getDepartment().getOffice().getName();
        this.createdBy = projectCode.getCreatedBy().getUserName();
        this.closedBy = null;
        if(projectCode.getClosedBy() != null) {
            this.closedBy = projectCode.getClosedBy().getUserName();
        }
        if(projectCode.getInChargePerson() != null) {
            this.inChargePerson = new ConciseEmployee(projectCode.getInChargePerson());
        }
        if(projectCode.getInChargePartner() != null) {
            this.inChargePartner = new ConciseEmployee(projectCode.getInChargePartner());
        }
    }

    public ConciseEmployee getInChargePerson() {
        return inChargePerson;
    }

    public void setInChargePerson(ConciseEmployee inChargePerson) {
        this.inChargePerson = inChargePerson;
    }

    public ConciseEmployee getInChargePartner() {
        return inChargePartner;
    }

    public void setInChargePartner(ConciseEmployee inChargePartner) {
        this.inChargePartner = inChargePartner;
    }

    public String getActivity() {
        return activity;
    }

    public void setActivity(String activity) {
        this.activity = activity;
    }

    public String getClient() {
        return client;
    }

    public void setClient(String client) {
        this.client = client;
    }

    public String getClosedBy() {
        return closedBy;
    }

    public void setClosedBy(String closedBy) {
        this.closedBy = closedBy;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public String getOffice() {
        return office;
    }

    public void setOffice(String office) {
        this.office = office;
    }

    public String getSubdepartment() {
        return subdepartment;
    }

    public void setSubdepartment(String subdepartment) {
        this.subdepartment = subdepartment;
    }

}
