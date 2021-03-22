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
public class PositionVOH extends PositionVO {
    private Set<Long> employeeIds = new HashSet<Long>();
    private Set<Long> employeePositionHistoryItemIds = new HashSet<Long>();
    private Long standardPositionId;
    private Long subdepartmentId;

    public PositionVOH() {}

    public PositionVOH(Position position) {
        super(position);
        for(Employee employee : position.getEmployees()) {
            this.employeeIds.add(employee.getId());
        }
        for(EmployeePositionHistoryItem employeePositionHistoryItem : position.getEmployeePositionHistoryItems()) {
            this.employeePositionHistoryItemIds.add(employeePositionHistoryItem.getId());
        }
        this.standardPositionId = position.getStandardPosition().getId();
        this.subdepartmentId = position.getSubdepartment().getId();
    }

    public Set<Long> getEmployeePositionHistoryItemIds() {
        return employeePositionHistoryItemIds;
    }

    public void setEmployeePositionHistoryItemIds(Set<Long> employeePositionHistoryItemIds) {
        this.employeePositionHistoryItemIds = employeePositionHistoryItemIds;
    }

    public Long getStandardPositionId() {
        return standardPositionId;
    }

    public void setStandardPositionId(Long standardPositionId) {
        this.standardPositionId = standardPositionId;
    }

    public Long getSubdepartmentId() {
        return subdepartmentId;
    }

    public void setSubdepartmentId(Long subdepartmentId) {
        this.subdepartmentId = subdepartmentId;
    }

    public Set<Long> getEmployeeIds() {
        return employeeIds;
    }

    public void setEmployeeIds(Set<Long> employeeIds) {
        this.employeeIds = employeeIds;
    }
}
