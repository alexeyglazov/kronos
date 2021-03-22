/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.web.vo;

import com.mazars.management.db.domain.*;
import java.util.Calendar;

/**
 *
 * @author Glazov
 */
public class EmployeeWithExtendedPositionVO {
    private Long id;
    private String firstName;
    private String lastName;
    private String firstNameLocalLanguage;
    private String lastNameLocalLanguage;
    private String userName;
    private String positionName;
    private String subdepartmentName;
    private String departmentName;
    private String officeName;

    public EmployeeWithExtendedPositionVO() {
    }
    
    public EmployeeWithExtendedPositionVO(Employee employee) {
        Position position = employee.getPosition();
        Subdepartment subdepartment = position.getSubdepartment();
        Department department = subdepartment.getDepartment();
        Office office = department.getOffice();
        this.id = employee.getId();
        this.firstName = employee.getFirstName();
        this.lastName = employee.getLastName();
        this.firstNameLocalLanguage = employee.getFirstNameLocalLanguage();
        this.lastNameLocalLanguage = employee.getLastNameLocalLanguage();
        this.userName = employee.getUserName();
        this.positionName = position.getName();
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

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
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

    public String getSubdepartmentName() {
        return subdepartmentName;
    }

    public void setSubdepartmentName(String subdepartmentName) {
        this.subdepartmentName = subdepartmentName;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getFirstNameLocalLanguage() {
        return firstNameLocalLanguage;
    }

    public void setFirstNameLocalLanguage(String firstNameLocalLanguage) {
        this.firstNameLocalLanguage = firstNameLocalLanguage;
    }

    public String getLastNameLocalLanguage() {
        return lastNameLocalLanguage;
    }

    public void setLastNameLocalLanguage(String lastNameLocalLanguage) {
        this.lastNameLocalLanguage = lastNameLocalLanguage;
    }
}
