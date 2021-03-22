/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.web.security;
import com.mazars.management.db.domain.*;
import com.mazars.management.security.SecurityUtils;
import java.io.IOException;
/**
 *
 * @author Glazov
 */
public class AccessChecker {
    public enum Status {
        VALID,
        NOT_LOGGED_IN,
        NOT_AUTHORIZED,
        NOT_AUTHORIZED_TO_MODULE,
        PASSWORD_MUST_BE_CHANGED
    }

    public AccessChecker() {
    }
    public Employee authenticate(String userName, String password) throws Exception {
        Employee employee = null;
        if(userName == null || "".equals(userName)) {
            throw new Exception("Username is not set.");
        }
        if(password == null || "".equals(password)) {
            throw new Exception("Password is not set.");
        }
        Employee user = Employee.getByUserName(userName);
        if(user == null) {
            throw new Exception("Employee with given user name does not exist.");
        } else {
            String hashedPassword = SecurityUtils.getHashAsString(password, user.getSalt());
            if(hashedPassword.equals(user.getHashedPassword())) {
                employee = user;
            } else {
                throw new Exception("Password is incorrect.");
            }
        }
        return employee;
    }
    public Status check(Employee employee) {
        if(employee == null) {
            return Status.NOT_LOGGED_IN;
        } else if(employee.getIsActive() != true || Employee.Profile.NON_USER.equals(employee.getProfile())) {
            return Status.NOT_AUTHORIZED;
        } else if(employee.getPasswordToBeChanged()) {
            return Status.PASSWORD_MUST_BE_CHANGED;
        }
        return Status.VALID;
    }
    public Status check(Employee employee, Module module) {
        if(employee == null) {
            return Status.NOT_LOGGED_IN;
        } else if(employee.getIsActive() != true) {
            return Status.NOT_AUTHORIZED;
        } else if(Employee.Profile.NON_USER.equals(employee.getProfile())) {
            return Status.NOT_AUTHORIZED;
        } else if(Boolean.TRUE.equals(employee.getPasswordToBeChanged())) {
            return Status.PASSWORD_MUST_BE_CHANGED;
        } else if(Employee.Profile.USER.equals(employee.getProfile()) && (module == null || ! module.getName().equals("Timesheets"))) {
            return Status.NOT_AUTHORIZED;
        } else if(Employee.Profile.SUPER_USER.equals(employee.getProfile())) {
            if(RightsItem.isAvailable(employee, module)) {
                return Status.VALID;
            } else {
                return Status.NOT_AUTHORIZED_TO_MODULE;
            }
        } else {
            if(module == null) {
                return Status.VALID;
            } else if ("Salary Report".equals(module.getName()) || "Salary".equals(module.getName())) {
                return Status.NOT_AUTHORIZED_TO_MODULE;
            } else {
                return Status.VALID;
            }
        }
    }
}
