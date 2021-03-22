/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.web.vo;

import com.mazars.management.db.complex.EmployeeSubdepartmentHistoryItemWithEmployeeAndSubdepartment;
import com.mazars.management.db.domain.*;
import com.mazars.management.db.domain.EmployeeSubdepartmentHistoryItem.Type;
import com.mazars.management.db.util.EmployeeProjectCodeAccessItemUtil.DescribedEmployeeProjectCodeAccessItem;
import java.util.Calendar;
import java.util.LinkedList;
import java.util.List;

/**
 *
 * @author Glazov
 */
public class EmployeeProjectCodeAccessItemVO {
    private Long id;

    private Long employeeId;
    private String employeeUserName;
    private String employeeFirstName;
    private String employeeLastName;

    private Long projectCodeId;
    private String projectCodeCode;
    private Boolean projectCodeIsHidden;

    private Long employeeSubdepartmentId;
    private String employeeSubdepartmentName;
    private Long employeeDepartmentId;
    private String employeeDepartmentName;
    private Long employeeOfficeId;
    private String employeeOfficeName;

    private Long projectCodeSubdepartmentId;
    private String projectCodeSubdepartmentName;
    private Long projectCodeDepartmentId;
    private String projectCodeDepartmentName;
    private Long projectCodeOfficeId;
    private String projectCodeOfficeName;

    public EmployeeProjectCodeAccessItemVO() {
    }
    public EmployeeProjectCodeAccessItemVO(DescribedEmployeeProjectCodeAccessItem describedEmployeeProjectCodeAccessItem) {
        Employee employee = describedEmployeeProjectCodeAccessItem.getEmployee();
        ProjectCode projectCode = describedEmployeeProjectCodeAccessItem.getProjectCode();
        Subdepartment employeeSubdepartment = describedEmployeeProjectCodeAccessItem.getEmployeeSubdepartment();
        Department employeeDepartment = describedEmployeeProjectCodeAccessItem.getEmployeeDepartment();
        Office employeeOffice = describedEmployeeProjectCodeAccessItem.getEmployeeOffice();
        Subdepartment projectCodeSubdepartment = describedEmployeeProjectCodeAccessItem.getProjectCodeSubdepartment();
        Department projectCodeDepartment = describedEmployeeProjectCodeAccessItem.getProjectCodeDepartment();
        Office projectCodeOffice = describedEmployeeProjectCodeAccessItem.getProjectCodeOffice();
        
        this.id = describedEmployeeProjectCodeAccessItem.getEmployeeProjectCodeAccessItem().getId();
        this.employeeId = employee.getId();
        this.employeeUserName = employee.getUserName();
        this.employeeFirstName = employee.getFirstName();
        this.employeeLastName = employee.getLastName();
        
        this.projectCodeId = projectCode.getId();
        this.projectCodeCode = projectCode.getCode();
        this.projectCodeIsHidden = projectCode.getIsHidden();
        
        this.employeeSubdepartmentId = employeeSubdepartment.getId();
        this.employeeSubdepartmentName = employeeSubdepartment.getName();
        this.employeeDepartmentId = employeeDepartment.getId();
        this.employeeDepartmentName = employeeDepartment.getName();
        this.employeeOfficeId = employeeOffice.getId();
        this.employeeOfficeName = employeeOffice.getName();

        this.projectCodeSubdepartmentId = projectCodeSubdepartment.getId();
        this.projectCodeSubdepartmentName = projectCodeSubdepartment.getName();
        this.projectCodeDepartmentId = projectCodeDepartment.getId();
        this.projectCodeDepartmentName = projectCodeDepartment.getName();
        this.projectCodeOfficeId = projectCodeOffice.getId();
        this.projectCodeOfficeName = projectCodeOffice.getName();
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

    public Long getProjectCodeId() {
        return projectCodeId;
    }

    public void setProjectCodeId(Long projectCodeId) {
        this.projectCodeId = projectCodeId;
    }

    public String getProjectCodeCode() {
        return projectCodeCode;
    }

    public void setProjectCodeCode(String projectCodeCode) {
        this.projectCodeCode = projectCodeCode;
    }

    public Boolean isProjectCodeIsHidden() {
        return projectCodeIsHidden;
    }

    public void setProjectCodeIsHidden(Boolean projectCodeIsHidden) {
        this.projectCodeIsHidden = projectCodeIsHidden;
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

    public Long getProjectCodeSubdepartmentId() {
        return projectCodeSubdepartmentId;
    }

    public void setProjectCodeSubdepartmentId(Long projectCodeSubdepartmentId) {
        this.projectCodeSubdepartmentId = projectCodeSubdepartmentId;
    }

    public String getProjectCodeSubdepartmentName() {
        return projectCodeSubdepartmentName;
    }

    public void setProjectCodeSubdepartmentName(String projectCodeSubdepartmentName) {
        this.projectCodeSubdepartmentName = projectCodeSubdepartmentName;
    }

    public Long getProjectCodeDepartmentId() {
        return projectCodeDepartmentId;
    }

    public void setProjectCodeDepartmentId(Long projectCodeDepartmentId) {
        this.projectCodeDepartmentId = projectCodeDepartmentId;
    }

    public String getProjectCodeDepartmentName() {
        return projectCodeDepartmentName;
    }

    public void setProjectCodeDepartmentName(String projectCodeDepartmentName) {
        this.projectCodeDepartmentName = projectCodeDepartmentName;
    }

    public Long getProjectCodeOfficeId() {
        return projectCodeOfficeId;
    }

    public void setProjectCodeOfficeId(Long projectCodeOfficeId) {
        this.projectCodeOfficeId = projectCodeOfficeId;
    }

    public String getProjectCodeOfficeName() {
        return projectCodeOfficeName;
    }

    public void setProjectCodeOfficeName(String projectCodeOfficeName) {
        this.projectCodeOfficeName = projectCodeOfficeName;
    }

    public static List<EmployeeProjectCodeAccessItemVO> getList(List<DescribedEmployeeProjectCodeAccessItem> describedEmployeeProjectCodeAccessItems ) {
        List<EmployeeProjectCodeAccessItemVO> employeeProjectCodeAccessItemVOs = new LinkedList<EmployeeProjectCodeAccessItemVO>();
        if(describedEmployeeProjectCodeAccessItems == null) {
            return null;
        }
        for(DescribedEmployeeProjectCodeAccessItem describedEmployeeProjectCodeAccessItem : describedEmployeeProjectCodeAccessItems) {
           employeeProjectCodeAccessItemVOs.add(new EmployeeProjectCodeAccessItemVO(describedEmployeeProjectCodeAccessItem));
        }
        return employeeProjectCodeAccessItemVOs;
    }
}
