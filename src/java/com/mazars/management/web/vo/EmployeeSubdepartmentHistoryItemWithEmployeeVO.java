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
public class EmployeeSubdepartmentHistoryItemWithEmployeeVO {
    private Long id;
    private Calendar start;
    private Calendar end;
    private EmployeeSubdepartmentHistoryItem.Type type;

    private Long employeeId;
    private String employeeUserName;
    private String employeeFirstName;
    private String employeeLastName;

    public EmployeeSubdepartmentHistoryItemWithEmployeeVO() {
    }
    public EmployeeSubdepartmentHistoryItemWithEmployeeVO(EmployeeSubdepartmentHistoryItem employeeSubdepartmentHistoryItem) {
        this.id = employeeSubdepartmentHistoryItem.getId();
        this.start = employeeSubdepartmentHistoryItem.getStart();
        this.end = employeeSubdepartmentHistoryItem.getEnd();
        this.type = employeeSubdepartmentHistoryItem.getType();
        Employee employee = employeeSubdepartmentHistoryItem.getEmployee();
        this.employeeId = employee.getId();
        this.employeeUserName = employee.getUserName();
        this.employeeFirstName = employee.getFirstName();
        this.employeeLastName = employee.getLastName();
    }

    public String getEmployeeFirstName() {
        return employeeFirstName;
    }

    public void setEmployeeFirstName(String employeeFirstName) {
        this.employeeFirstName = employeeFirstName;
    }

    public Long getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(Long employeeId) {
        this.employeeId = employeeId;
    }

    public String getEmployeeLastName() {
        return employeeLastName;
    }

    public void setEmployeeLastName(String employeeLastName) {
        this.employeeLastName = employeeLastName;
    }

    public String getEmployeeUserName() {
        return employeeUserName;
    }

    public void setEmployeeUserName(String employeeUserName) {
        this.employeeUserName = employeeUserName;
    }

    public Calendar getEnd() {
        return end;
    }

    public void setEnd(Calendar end) {
        this.end = end;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Calendar getStart() {
        return start;
    }

    public void setStart(Calendar start) {
        this.start = start;
    }

    public Type getType() {
        return type;
    }

    public void setType(Type type) {
        this.type = type;
    }

}
