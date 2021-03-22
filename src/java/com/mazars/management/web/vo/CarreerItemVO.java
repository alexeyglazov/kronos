/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.web.vo;

import com.mazars.management.db.domain.*;
import com.mazars.management.db.domain.EmployeeSubdepartmentHistoryItem.Type;
import java.util.Calendar;

/**
 *
 * @author Glazov
 */
public class CarreerItemVO {
    private Long employeePositionHistoryItemId;
    private Calendar start;
    private Calendar end;
    private String positionName;
    private String standardPositionName;
    private String subdepartmentName;
    private String departmentName;
    private String officeName;

    public CarreerItemVO() {
    }
    public CarreerItemVO(EmployeePositionHistoryItem employeePositionHistoryItem) {
        Position position = employeePositionHistoryItem.getPosition();
        StandardPosition standardPosition = position.getStandardPosition();
        Subdepartment subdepartment = position.getSubdepartment();
        Department department = subdepartment.getDepartment();
        Office office = department.getOffice();
        this.employeePositionHistoryItemId = employeePositionHistoryItem.getId();
        this.start = employeePositionHistoryItem.getStart();
        this.end = employeePositionHistoryItem.getEnd();
        this.positionName = position.getName();
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

    public Long getEmployeePositionHistoryItemid() {
        return employeePositionHistoryItemId;
    }

    public void setEmployeePositionHistoryItemid(Long employeePositionHistoryItemId) {
        this.employeePositionHistoryItemId = employeePositionHistoryItemId;
    }

    public Calendar getEnd() {
        return end;
    }

    public void setEnd(Calendar end) {
        this.end = end;
    }

    public String getOfficeName() {
        return officeName;
    }

    public void setOfficeName(String officeName) {
        this.officeName = officeName;
    }

    public String getPositionName() {
        return positionName;
    }

    public void setPositionName(String positionName) {
        this.positionName = positionName;
    }

    public String getStandardPositionName() {
        return standardPositionName;
    }

    public void setStandardPositionName(String standardPositionName) {
        this.standardPositionName = standardPositionName;
    }

    public Calendar getStart() {
        return start;
    }

    public void setStart(Calendar start) {
        this.start = start;
    }

    public String getSubdepartmentName() {
        return subdepartmentName;
    }

    public void setSubdepartmentName(String subdepartmentName) {
        this.subdepartmentName = subdepartmentName;
    }

}
