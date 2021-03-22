/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.web.vo;

import com.mazars.management.db.domain.*;
import java.util.Calendar;

/**
 *
 * @author Glazov
 */
public class ExtendedPositionVO {
    private Long id;
    private String name;
    private Boolean isActive;
    private String standardPositionName;
    private String subdepartmentName;
    private String departmentName;
    private String officeName;

    public ExtendedPositionVO() {
    }
    
    public ExtendedPositionVO(Position position) {
        StandardPosition standardPosition = position.getStandardPosition();
        Subdepartment subdepartment = position.getSubdepartment();
        Department department = subdepartment.getDepartment();
        Office office = department.getOffice();
        this.id = position.getId();
        this.isActive = position.getIsActive();
        this.name = position.getName();
        this.standardPositionName = standardPosition.getName();
        this.subdepartmentName = subdepartment.getName();
        this.departmentName = department.getName();
        this.officeName = office.getName();
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

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getOfficeName() {
        return officeName;
    }

    public void setOfficeName(String officeName) {
        this.officeName = officeName;
    }

    public String getStandardPositionName() {
        return standardPositionName;
    }

    public void setStandardPositionName(String standardPositionName) {
        this.standardPositionName = standardPositionName;
    }

    public String getSubdepartmentName() {
        return subdepartmentName;
    }

    public void setSubdepartmentName(String subdepartmentName) {
        this.subdepartmentName = subdepartmentName;
    }
 
}
