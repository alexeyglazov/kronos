/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.web.forms;
import com.google.gson.Gson;

/**
 *
 * @author glazov
 */
public class EmployeeFilter {
    private Long officeId;
    private Long departmentId;
    private Long subdepartmentId;
    private Long employeeId;

    public EmployeeFilter() {
    }
    public static EmployeeFilter getFromJson(String json) {
        Gson gson = new Gson();
        return gson.fromJson(json, EmployeeFilter.class);
    }

    public Long getOfficeId() {
        return officeId;
    }

    public void setOfficeId(Long officeId) {
        this.officeId = officeId;
    }
    public Long getDepartmentId() {
        return departmentId;
    }

    public void setDepartmentId(Long departmentId) {
        this.departmentId = departmentId;
    }

    public Long getSubdepartmentId() {
        return subdepartmentId;
    }

    public void setSubdepartmentId(Long subdepartmentId) {
        this.subdepartmentId = subdepartmentId;
    }

    public Long getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(Long employeeId) {
        this.employeeId = employeeId;
    }

    private Boolean isStringUsed(String field) {
        if(field == null || field.trim().equals("")) {
            return false;
        }
        return true;
    }

    public Boolean isOfficeIdUsed() {
        if(officeId !=null) {
            return true;
        } else {
            return false;
        }
    }
    public Boolean isDepartmentIdUsed() {
        if(departmentId !=null) {
            return true;
        } else {
            return false;
        }
    }
    public Boolean isSubdepartmentIdUsed() {
        if(subdepartmentId != null) {
            return true;
        } else {
            return false;
        }
    }
    public Boolean isEmployeeIdUsed() {
        if(employeeId != null) {
            return true;
        } else {
            return false;
        }
    }

    ///////////////////
    public Boolean isUsed() {
       return isOfficeIdUsed() ||
        isDepartmentIdUsed() ||
        isSubdepartmentIdUsed() ||
        isEmployeeIdUsed()
        ;
    }
}
