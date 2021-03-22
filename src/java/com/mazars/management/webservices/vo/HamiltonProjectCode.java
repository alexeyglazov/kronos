/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mazars.management.webservices.vo;

import java.util.Date;

/**
 *
 * @author glazov
 */
public class HamiltonProjectCode {
    Long id;
    String code;
    Date createdAt;
    Date modifiedAt;
    Date closedAt;
    Long departmentId;
    String departmentName;
    Long clientId;
    String clientName;
    Long activityId;
    String activityName;
    Long inChargePersonId;
    String inChargePersonName;
    String outOfPocketType;

    public HamiltonProjectCode() {
    }

    public HamiltonProjectCode(com.mazars.management.db.domain.ProjectCode projectCode) {
        com.mazars.management.db.domain.Department department = projectCode.getSubdepartment().getDepartment();
        com.mazars.management.db.domain.Client client = projectCode.getClient();
        com.mazars.management.db.domain.Activity activity = projectCode.getActivity();
        com.mazars.management.db.domain.Employee inChargePerson = projectCode.getInChargePerson();
        com.mazars.management.db.domain.OutOfPocketItem outOfPocketItem = projectCode.getOutOfPocketItem();
        this.id = projectCode.getId();
        this.code = projectCode.getCode();
        this.createdAt = projectCode.getCreatedAt();
        this.modifiedAt = projectCode.getModifiedAt();
        this.closedAt = projectCode.getClosedAt();
        this.departmentId = department.getId();
        this.departmentName = department.getName();
        this.clientId = client.getId();
        this.clientName = client.getName();
        this.activityId = activity.getId();
        this.activityName = activity.getName();
        if(inChargePerson != null) {
            this.inChargePersonId = inChargePerson.getId();
            this.inChargePersonName = inChargePerson.getFullNameLocalLanguage(Boolean.FALSE);
        }
        if(outOfPocketItem != null) {
            this.outOfPocketType = "" + outOfPocketItem.getType();
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public Date getModifiedAt() {
        return modifiedAt;
    }

    public void setModifiedAt(Date modifiedAt) {
        this.modifiedAt = modifiedAt;
    }

    public Date getClosedAt() {
        return closedAt;
    }

    public void setClosedAt(Date closedAt) {
        this.closedAt = closedAt;
    }

    public Long getDepartmentId() {
        return departmentId;
    }

    public void setDepartmentId(Long departmentId) {
        this.departmentId = departmentId;
    }

    public String getDepartmentName() {
        return departmentName;
    }

    public void setDepartmentName(String departmentName) {
        this.departmentName = departmentName;
    }

    public Long getClientId() {
        return clientId;
    }

    public void setClientId(Long clientId) {
        this.clientId = clientId;
    }

    public String getClientName() {
        return clientName;
    }

    public void setClientName(String clientName) {
        this.clientName = clientName;
    }

    public Long getActivityId() {
        return activityId;
    }

    public void setActivityId(Long activityId) {
        this.activityId = activityId;
    }

    public String getActivityName() {
        return activityName;
    }

    public void setActivityName(String activityName) {
        this.activityName = activityName;
    }

    public Long getInChargePersonId() {
        return inChargePersonId;
    }

    public void setInChargePersonId(Long inChargePersonId) {
        this.inChargePersonId = inChargePersonId;
    }

    public String getInChargePersonName() {
        return inChargePersonName;
    }

    public void setInChargePersonName(String inChargePersonName) {
        this.inChargePersonName = inChargePersonName;
    }

    public String getOutOfPocketType() {
        return outOfPocketType;
    }

    public void setOutOfPocketType(String outOfPocketType) {
        this.outOfPocketType = outOfPocketType;
    }


}
