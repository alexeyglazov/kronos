/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.db.complex;
import com.mazars.management.db.domain.*;
/**
 *
 * @author glazov
 */
public class EmployeeSubdepartmentHistoryItemWithEmployeeAndSubdepartment {
    private EmployeeSubdepartmentHistoryItem employeeSubdepartmentHistoryItem;
    private Employee employee;
    private Subdepartment employeeSubdepartment;
    private Department employeeDepartment;
    private Office employeeOffice;
    private Subdepartment subdepartment;
    private Department subdepartmentDepartment;
    private Office subdepartmentOffice;
    public EmployeeSubdepartmentHistoryItemWithEmployeeAndSubdepartment() {
    }

    public EmployeeSubdepartmentHistoryItemWithEmployeeAndSubdepartment(EmployeeSubdepartmentHistoryItem employeeSubdepartmentHistoryItem, Employee employee, Subdepartment employeeSubdepartment, Department employeeDepartment, Office employeeOffice, Subdepartment subdepartment, Department subdepartmentDepartment, Office subdepartmentOffice) {
        this.employeeSubdepartmentHistoryItem = employeeSubdepartmentHistoryItem;
        this.employee = employee;
        this.employeeSubdepartment = employeeSubdepartment;
        this.employeeDepartment = employeeDepartment;
        this.employeeOffice = employeeOffice;
        this.subdepartment = subdepartment;
        this.subdepartmentDepartment = subdepartmentDepartment;
        this.subdepartmentOffice = subdepartmentOffice;
    }

    public EmployeeSubdepartmentHistoryItem getEmployeeSubdepartmentHistoryItem() {
        return employeeSubdepartmentHistoryItem;
    }

    public void setEmployeeSubdepartmentHistoryItem(EmployeeSubdepartmentHistoryItem employeeSubdepartmentHistoryItem) {
        this.employeeSubdepartmentHistoryItem = employeeSubdepartmentHistoryItem;
    }

    public Employee getEmployee() {
        return employee;
    }

    public void setEmployee(Employee employee) {
        this.employee = employee;
    }

    public Subdepartment getEmployeeSubdepartment() {
        return employeeSubdepartment;
    }

    public void setEmployeeSubdepartment(Subdepartment employeeSubdepartment) {
        this.employeeSubdepartment = employeeSubdepartment;
    }

    public Department getEmployeeDepartment() {
        return employeeDepartment;
    }

    public void setEmployeeDepartment(Department employeeDepartment) {
        this.employeeDepartment = employeeDepartment;
    }

    public Office getEmployeeOffice() {
        return employeeOffice;
    }

    public void setEmployeeOffice(Office employeeOffice) {
        this.employeeOffice = employeeOffice;
    }

    public Subdepartment getSubdepartment() {
        return subdepartment;
    }

    public void setSubdepartment(Subdepartment subdepartment) {
        this.subdepartment = subdepartment;
    }

    public Department getSubdepartmentDepartment() {
        return subdepartmentDepartment;
    }

    public void setSubdepartmentDepartment(Department subdepartmentDepartment) {
        this.subdepartmentDepartment = subdepartmentDepartment;
    }

    public Office getSubdepartmentOffice() {
        return subdepartmentOffice;
    }

    public void setSubdepartmentOffice(Office subdepartmentOffice) {
        this.subdepartmentOffice = subdepartmentOffice;
    }


}
