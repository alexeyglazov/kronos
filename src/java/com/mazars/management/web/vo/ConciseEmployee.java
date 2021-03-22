/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.web.vo;

import com.mazars.management.db.domain.*;
import java.util.Calendar;
import java.util.LinkedList;
import java.util.List;

/**
 *
 * @author Glazov
 */
public class ConciseEmployee {
    private Long id;
    private String firstName;
    private String lastName;
    private String firstNameLocalLanguage;
    private String lastNameLocalLanguage;
    private String userName;

    public ConciseEmployee() {
    }
    
    public ConciseEmployee(Employee employee) {
        this.id = employee.getId();
        this.firstName = employee.getFirstName();
        this.lastName = employee.getLastName();
        this.firstNameLocalLanguage = employee.getFirstNameLocalLanguage();
        this.lastNameLocalLanguage = employee.getLastNameLocalLanguage();
        this.userName = employee.getUserName();
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

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }
    public static List<ConciseEmployee> getList(List<Employee> employees) {
        List<ConciseEmployee> employeeVOs = new LinkedList<ConciseEmployee>();
        if(employees == null) {
            return null;
        }
        for(Employee employee : employees) {
           employeeVOs.add(new ConciseEmployee(employee));
        }
        return employeeVOs;
    }
    
}
