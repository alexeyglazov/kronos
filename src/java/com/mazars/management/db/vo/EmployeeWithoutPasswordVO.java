/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.db.vo;
import com.mazars.management.db.domain.*;
import com.mazars.management.db.domain.Employee.Profile;
import java.util.LinkedList;
import java.util.List;

/**
 *
 * @author glazov
 */
public class EmployeeWithoutPasswordVO {
    private Long id;
    private String userName;
    private Boolean passwordToBeChanged;
    private String firstName;
    private String lastName;
    private String firstNameLocalLanguage;
    private String lastNameLocalLanguage;
    private String maidenName;
    private String email;
    private String externalId;

    private Employee.Profile profile;
    private Boolean isAdministrator;
    private Boolean isActive;
    private Boolean isFuture;

    public EmployeeWithoutPasswordVO() {}

    public EmployeeWithoutPasswordVO(Employee employee) {
        this.id = employee.getId();
        this.userName = employee.getUserName();
        this.passwordToBeChanged = employee.getPasswordToBeChanged();
        this.firstName = employee.getFirstName();
        this.lastName = employee.getLastName();
        this.firstNameLocalLanguage = employee.getFirstNameLocalLanguage();
        this.lastNameLocalLanguage = employee.getLastNameLocalLanguage();
        this.maidenName = employee.getMaidenName();
        this.email = employee.getEmail();
        this.externalId = employee.getExternalId();
        this.profile = employee.getProfile();
        this.isAdministrator = employee.getIsAdministrator();
        this.isActive = employee.getIsActive();
        this.isFuture = employee.getIsFuture();
    }

    public Boolean getIsAdministrator() {
        return isAdministrator;
    }

    public void setIsAdministrator(Boolean isAdministrator) {
        this.isAdministrator = isAdministrator;
    }

    public String getExternalId() {
        return externalId;
    }

    public void setExternalId(String externalId) {
        this.externalId = externalId;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getFirstNameLocalLanguage() {
        return firstNameLocalLanguage;
    }

    public void setFirstNameLocalLanguage(String firstNameLocalLanguage) {
        this.firstNameLocalLanguage = firstNameLocalLanguage;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    public Profile getProfile() {
        return profile;
    }

    public void setProfile(Profile profile) {
        this.profile = profile;
    }
   
    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getLastNameLocalLanguage() {
        return lastNameLocalLanguage;
    }

    public void setLastNameLocalLanguage(String lastNameLocalLanguage) {
        this.lastNameLocalLanguage = lastNameLocalLanguage;
    }

    public String getMaidenName() {
        return maidenName;
    }

    public void setMaidenName(String maidenName) {
        this.maidenName = maidenName;
    }

    public Boolean getPasswordToBeChanged() {
        return passwordToBeChanged;
    }

    public void setPasswordToBeChanged(Boolean passwordToBeChanged) {
        this.passwordToBeChanged = passwordToBeChanged;
    }
    public Boolean getIsFuture() {
        return isFuture;
    }

    public void setIsFuture(Boolean isFuture) {
        this.isFuture = isFuture;
    }
    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }
    public static List<EmployeeWithoutPasswordVO> getList(List<Employee> employees) {
        List<EmployeeWithoutPasswordVO> employeeVOs = new LinkedList<EmployeeWithoutPasswordVO>();
        if(employees == null) {
            return null;
        }
        for(Employee employee : employees) {
           employeeVOs.add(new EmployeeWithoutPasswordVO(employee));
        }
        return employeeVOs;
    }
}
