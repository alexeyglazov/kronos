/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.db.vo;
import com.mazars.management.db.domain.*;

/**
 *
 * @author glazov
 */
public class EmployeeSubdepartmentHistoryItemVOH extends EmployeeSubdepartmentHistoryItemVO {
    private Long employeeId;
    private Long subdepartmentId;
    public EmployeeSubdepartmentHistoryItemVOH() {
    }
    public EmployeeSubdepartmentHistoryItemVOH(EmployeeSubdepartmentHistoryItem employeeSubdepartmentHistoryItem) {
        super(employeeSubdepartmentHistoryItem);
        this.employeeId = employeeSubdepartmentHistoryItem.getEmployee().getId();
        this.subdepartmentId = employeeSubdepartmentHistoryItem.getSubdepartment().getId();
    }

    public Long getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(Long employeeId) {
        this.employeeId = employeeId;
    }

    public Long getSubdepartmentId() {
        return subdepartmentId;
    }

    public void setSubdepartmentId(Long subdepartmentId) {
        this.subdepartmentId = subdepartmentId;
    }

}
