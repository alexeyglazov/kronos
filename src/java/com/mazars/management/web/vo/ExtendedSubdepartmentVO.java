/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.web.vo;

import com.mazars.management.db.domain.*;

/**
 *
 * @author Glazov
 */
public class ExtendedSubdepartmentVO {
    private Long id;
    private String name;
    private String codeName;
    private Long departmentId;
    private String departmentName;
    private String departmentCodeName;
    private Long officeId;
    private String officeName;
    private String officeCodeName;

    public ExtendedSubdepartmentVO() {
    }
    
    public ExtendedSubdepartmentVO(Subdepartment subdepartment) {
        Department department = subdepartment.getDepartment();
        Office office = department.getOffice();
        this.id = subdepartment.getId();
        this.name = subdepartment.getName();
        this.codeName = subdepartment.getCodeName();
        this.departmentId = department.getId();
        this.departmentName = department.getName();
        this.departmentCodeName = department.getCodeName();
        this.officeId = office.getId();
        this.officeName = office.getName();
        this.officeCodeName = office.getCodeName();
    }

    public String getCodeName() {
        return codeName;
    }

    public void setCodeName(String codeName) {
        this.codeName = codeName;
    }

    public String getDepartmentCodeName() {
        return departmentCodeName;
    }

    public void setDepartmentCodeName(String departmentCodeName) {
        this.departmentCodeName = departmentCodeName;
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

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getOfficeCodeName() {
        return officeCodeName;
    }

    public void setOfficeCodeName(String officeCodeName) {
        this.officeCodeName = officeCodeName;
    }

    public Long getOfficeId() {
        return officeId;
    }

    public void setOfficeId(Long officeId) {
        this.officeId = officeId;
    }

    public String getOfficeName() {
        return officeName;
    }

    public void setOfficeName(String officeName) {
        this.officeName = officeName;
    }
}
