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
public class EmployeePositionHistoryItemVOH extends EmployeePositionHistoryItemVO {
    private Long employeeId;
    private Long positionId;
    public EmployeePositionHistoryItemVOH() {
    }
    public EmployeePositionHistoryItemVOH(EmployeePositionHistoryItem employeePositionHistoryItem) {
        super(employeePositionHistoryItem);
        this.employeeId = employeePositionHistoryItem.getEmployee().getId();
        this.positionId = employeePositionHistoryItem.getPosition().getId();
    }

    public Long getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(Long employeeId) {
        this.employeeId = employeeId;
    }

    public Long getPositionId() {
        return positionId;
    }

    public void setPositionId(Long positionId) {
        this.positionId = positionId;
    }

}
