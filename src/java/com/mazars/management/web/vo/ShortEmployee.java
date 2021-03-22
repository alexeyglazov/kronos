/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mazars.management.web.vo;

import com.mazars.management.db.domain.Employee;

/**
 *
 * @author glazov
 */
public class ShortEmployee {
    private Long id;
    private String userName;
    private String firstName;
    private String lastName;

    public ShortEmployee(Employee employee) {
        this.id = employee.getId();
        this.userName = employee.getUserName();
        this.firstName = employee.getFirstName();
        this.lastName = employee.getLastName();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
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
}
