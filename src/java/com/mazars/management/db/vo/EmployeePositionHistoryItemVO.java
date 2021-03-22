/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.db.vo;
import com.mazars.management.db.domain.*;
import com.mazars.management.db.domain.EmployeePositionHistoryItem.ContractType;
import java.util.Calendar;
/**
 *
 * @author glazov
 */
public class EmployeePositionHistoryItemVO {
    private Long id;
    private Calendar start;
    private Calendar end;
    private EmployeePositionHistoryItem.ContractType contractType;
    private Integer partTimePercentage;
    public EmployeePositionHistoryItemVO() {
    }
    public EmployeePositionHistoryItemVO(EmployeePositionHistoryItem employeePositionHistoryItem) {
        this.id = employeePositionHistoryItem.getId();
        this.start = employeePositionHistoryItem.getStart();
        this.end = employeePositionHistoryItem.getEnd();
        this.contractType = employeePositionHistoryItem.getContractType();
        this.partTimePercentage = employeePositionHistoryItem.getPartTimePercentage();
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

    public ContractType getContractType() {
        return contractType;
    }

    public void setContractType(ContractType contractType) {
        this.contractType = contractType;
    }

    public Integer getPartTimePercentage() {
        return partTimePercentage;
    }

    public void setPartTimePercentage(Integer partTimePercentage) {
        this.partTimePercentage = partTimePercentage;
    }
}
