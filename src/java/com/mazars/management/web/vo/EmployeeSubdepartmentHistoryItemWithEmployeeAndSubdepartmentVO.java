/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.web.vo;

import com.mazars.management.db.complex.EmployeeSubdepartmentHistoryItemWithEmployeeAndSubdepartment;
import com.mazars.management.db.domain.*;
import com.mazars.management.db.domain.EmployeeSubdepartmentHistoryItem.Type;
import java.util.Calendar;

/**
 *
 * @author Glazov
 */
public class EmployeeSubdepartmentHistoryItemWithEmployeeAndSubdepartmentVO {
    private Long id;
    private Calendar start;
    private Calendar end;
    private EmployeeSubdepartmentHistoryItem.Type type;

    private Long employeeId;
    private String employeeUserName;
    private String employeeFirstName;
    private String employeeLastName;
    
    private Long employeeSubdepartmentId;
    private String employeeSubdepartmentName;
    private Long employeeDepartmentId;
    private String employeeDepartmentName;
    private Long employeeOfficeId;
    private String employeeOfficeName;

    private Long subdepartmentId;
    private String subdepartmentName;
    
    private Long subdepartmentDepartmentId;
    private String subdepartmentDepartmentName;
    private Long subdepartmentOfficeId;
    private String subdepartmentOfficeName;

    public EmployeeSubdepartmentHistoryItemWithEmployeeAndSubdepartmentVO() {
    }
    public EmployeeSubdepartmentHistoryItemWithEmployeeAndSubdepartmentVO(EmployeeSubdepartmentHistoryItemWithEmployeeAndSubdepartment employeeSubdepartmentHistoryItemWithEmployeeAndSubdepartment) {
        EmployeeSubdepartmentHistoryItem employeeSubdepartmentHistoryItem = employeeSubdepartmentHistoryItemWithEmployeeAndSubdepartment.getEmployeeSubdepartmentHistoryItem();
        Employee employee = employeeSubdepartmentHistoryItemWithEmployeeAndSubdepartment.getEmployee();
        Subdepartment employeeSubdepartment = employeeSubdepartmentHistoryItemWithEmployeeAndSubdepartment.getEmployeeSubdepartment();
        Department employeeDepartment = employeeSubdepartmentHistoryItemWithEmployeeAndSubdepartment.getEmployeeDepartment();
        Office employeeOffice = employeeSubdepartmentHistoryItemWithEmployeeAndSubdepartment.getEmployeeOffice();
        Subdepartment subdepartment = employeeSubdepartmentHistoryItemWithEmployeeAndSubdepartment.getSubdepartment();
        Department subdepartmentDepartment = employeeSubdepartmentHistoryItemWithEmployeeAndSubdepartment.getSubdepartmentDepartment();
        Office subdepartmentOffice = employeeSubdepartmentHistoryItemWithEmployeeAndSubdepartment.getSubdepartmentOffice();
        this.id = employeeSubdepartmentHistoryItem.getId();
        this.start = employeeSubdepartmentHistoryItem.getStart();
        this.end = employeeSubdepartmentHistoryItem.getEnd();
        this.type = employeeSubdepartmentHistoryItem.getType();
        
        this.employeeId = employee.getId();
        this.employeeUserName = employee.getUserName();
        this.employeeFirstName = employee.getFirstName();
        this.employeeLastName = employee.getLastName();
        
        this.employeeSubdepartmentId = employeeSubdepartment.getId();
        this.employeeSubdepartmentName = employeeSubdepartment.getName();
        this.employeeDepartmentId = employeeDepartment.getId();
        this.employeeDepartmentName = employeeDepartment.getName();
        this.employeeOfficeId = employeeOffice.getId();
        this.employeeOfficeName = employeeOffice.getName();

        this.subdepartmentId = subdepartment.getId();
        this.subdepartmentName = subdepartment.getName();

        this.subdepartmentDepartmentId = subdepartmentDepartment.getId();
        this.subdepartmentDepartmentName = subdepartmentDepartment.getName();
        this.subdepartmentOfficeId = subdepartmentOffice.getId();
        this.subdepartmentOfficeName = subdepartmentOffice.getName();
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

    public Calendar getEnd() {
        return end;
    }

    public void setEnd(Calendar end) {
        this.end = end;
    }

    public Type getType() {
        return type;
    }

    public void setType(Type type) {
        this.type = type;
    }

    public Long getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(Long employeeId) {
        this.employeeId = employeeId;
    }

    public String getEmployeeUserName() {
        return employeeUserName;
    }

    public void setEmployeeUserName(String employeeUserName) {
        this.employeeUserName = employeeUserName;
    }

    public String getEmployeeFirstName() {
        return employeeFirstName;
    }

    public void setEmployeeFirstName(String employeeFirstName) {
        this.employeeFirstName = employeeFirstName;
    }

    public String getEmployeeLastName() {
        return employeeLastName;
    }

    public void setEmployeeLastName(String employeeLastName) {
        this.employeeLastName = employeeLastName;
    }

    public Long getEmployeeSubdepartmentId() {
        return employeeSubdepartmentId;
    }

    public void setEmployeeSubdepartmentId(Long employeeSubdepartmentId) {
        this.employeeSubdepartmentId = employeeSubdepartmentId;
    }

    public String getEmployeeSubdepartmentName() {
        return employeeSubdepartmentName;
    }

    public void setEmployeeSubdepartmentName(String employeeSubdepartmentName) {
        this.employeeSubdepartmentName = employeeSubdepartmentName;
    }

    public Long getEmployeeDepartmentId() {
        return employeeDepartmentId;
    }

    public void setEmployeeDepartmentId(Long employeeDepartmentId) {
        this.employeeDepartmentId = employeeDepartmentId;
    }

    public String getEmployeeDepartmentName() {
        return employeeDepartmentName;
    }

    public void setEmployeeDepartmentName(String employeeDepartmentName) {
        this.employeeDepartmentName = employeeDepartmentName;
    }

    public Long getEmployeeOfficeId() {
        return employeeOfficeId;
    }

    public void setEmployeeOfficeId(Long employeeOfficeId) {
        this.employeeOfficeId = employeeOfficeId;
    }

    public String getEmployeeOfficeName() {
        return employeeOfficeName;
    }

    public void setEmployeeOfficeName(String employeeOfficeName) {
        this.employeeOfficeName = employeeOfficeName;
    }

    public Long getSubdepartmentId() {
        return subdepartmentId;
    }

    public void setSubdepartmentId(Long subdepartmentId) {
        this.subdepartmentId = subdepartmentId;
    }

    public String getSubdepartmentName() {
        return subdepartmentName;
    }

    public void setSubdepartmentName(String subdepartmentName) {
        this.subdepartmentName = subdepartmentName;
    }

    public Long getSubdepartmentDepartmentId() {
        return subdepartmentDepartmentId;
    }

    public void setSubdepartmentDepartmentId(Long subdepartmentDepartmentId) {
        this.subdepartmentDepartmentId = subdepartmentDepartmentId;
    }

    public String getSubdepartmentDepartmentName() {
        return subdepartmentDepartmentName;
    }

    public void setSubdepartmentDepartmentName(String subdepartmentDepartmentName) {
        this.subdepartmentDepartmentName = subdepartmentDepartmentName;
    }

    public Long getSubdepartmentOfficeId() {
        return subdepartmentOfficeId;
    }

    public void setSubdepartmentOfficeId(Long subdepartmentOfficeId) {
        this.subdepartmentOfficeId = subdepartmentOfficeId;
    }

    public String getSubdepartmentOfficeName() {
        return subdepartmentOfficeName;
    }

    public void setSubdepartmentOfficeName(String subdepartmentOfficeName) {
        this.subdepartmentOfficeName = subdepartmentOfficeName;
    }
}
