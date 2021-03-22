/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.web.vo;

import com.mazars.management.db.domain.*;
import com.mazars.management.db.domain.EmployeePositionHistoryItem.ContractType;
import java.util.Calendar;
import java.util.GregorianCalendar;

/**
 *
 * @author Glazov
 */
public class ExtendedEmployeePositionHistoryItemVO {
    private Long id;
    private Long employeeId;
    private Calendar start;
    private Calendar end;
    private Long positionId;
    private EmployeePositionHistoryItem.ContractType contractType;
    private Integer partTimePercentage;
    private String positionName;
    private String standardPositionName;
    private String subdepartmentName;
    private String departmentName;
    private String officeName;
    private EmployeePositionHistoryItem.TimeStatus timeStatus;
    private EmployeePositionHistoryItem.CareerStatus careerStatus;

    public ExtendedEmployeePositionHistoryItemVO() {
    }
    public ExtendedEmployeePositionHistoryItemVO(EmployeePositionHistoryItem employeePositionHistoryItem) {
        this(employeePositionHistoryItem, new GregorianCalendar());
    }
    public ExtendedEmployeePositionHistoryItemVO(EmployeePositionHistoryItem employeePositionHistoryItem, Calendar timeStatusDay) {
        Position position = employeePositionHistoryItem.getPosition();
        StandardPosition standardPosition = position.getStandardPosition();
        Subdepartment subdepartment = position.getSubdepartment();
        Department department = subdepartment.getDepartment();
        Office office = department.getOffice();
        this.id = employeePositionHistoryItem.getId();
        this.employeeId = employeePositionHistoryItem.getEmployee().getId();
        this.start = employeePositionHistoryItem.getStart();
        this.end = employeePositionHistoryItem.getEnd();
        this.positionId = position.getId();
        this.positionName = position.getName();
        this.contractType = employeePositionHistoryItem.getContractType();
        this.partTimePercentage = employeePositionHistoryItem.getPartTimePercentage();
        this.standardPositionName = standardPosition.getName();
        this.subdepartmentName = subdepartment.getName();
        this.departmentName = department.getName();
        this.officeName = office.getName();
        this.timeStatus = employeePositionHistoryItem.getTimeStatus(timeStatusDay);
        this.careerStatus = employeePositionHistoryItem.getCareerStatus();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public String getDepartmentName() {
        return departmentName;
    }

    public void setDepartmentName(String departmentName) {
        this.departmentName = departmentName;
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

    public EmployeePositionHistoryItem.TimeStatus getTimeStatus() {
        return timeStatus;
    }

    public void setTimeStatus(EmployeePositionHistoryItem.TimeStatus timeStatus) {
        this.timeStatus = timeStatus;
    }

    public EmployeePositionHistoryItem.CareerStatus getCareerStatus() {
        return careerStatus;
    }

    public void setCareerStatus(EmployeePositionHistoryItem.CareerStatus careerStatus) {
        this.careerStatus = careerStatus;
    }
}
