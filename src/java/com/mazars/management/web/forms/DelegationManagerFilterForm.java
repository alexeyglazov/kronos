/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.web.forms;
import com.google.gson.Gson;
import com.mazars.management.db.vo.*;

/**
 *
 * @author glazov
 */
public class DelegationManagerFilterForm {
    private Long subdepartmentOfficeId;
    private Long subdepartmentDepartmentId;
    private Long subdepartmentId;
    private Long employeeOfficeId;
    private Long employeeDepartmentId;
    private Long employeeSubdepartmentId;
    private Long employeeId;
    private YearMonthDate startDate;
    private YearMonthDate endDate;

    public DelegationManagerFilterForm() {
    }

    public Long getSubdepartmentOfficeId() {
        return subdepartmentOfficeId;
    }

    public void setSubdepartmentOfficeId(Long subdepartmentOfficeId) {
        this.subdepartmentOfficeId = subdepartmentOfficeId;
    }

    public Long getSubdepartmentDepartmentId() {
        return subdepartmentDepartmentId;
    }

    public void setSubdepartmentDepartmentId(Long subdepartmentDepartmentId) {
        this.subdepartmentDepartmentId = subdepartmentDepartmentId;
    }


    public Long getEmployeeOfficeId() {
        return employeeOfficeId;
    }

    public void setEmployeeOfficeId(Long employeeOfficeId) {
        this.employeeOfficeId = employeeOfficeId;
    }

    public Long getEmployeeDepartmentId() {
        return employeeDepartmentId;
    }

    public void setEmployeeDepartmentId(Long employeeDepartmentId) {
        this.employeeDepartmentId = employeeDepartmentId;
    }

    public Long getEmployeeSubdepartmentId() {
        return employeeSubdepartmentId;
    }

    public void setEmployeeSubdepartmentId(Long employeeSubdepartmentId) {
        this.employeeSubdepartmentId = employeeSubdepartmentId;
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

    public YearMonthDate getStartDate() {
        return startDate;
    }

    public void setStartDate(YearMonthDate startDate) {
        this.startDate = startDate;
    }

    public YearMonthDate getEndDate() {
        return endDate;
    }

    public void setEndDate(YearMonthDate endDate) {
        this.endDate = endDate;
    }


    public static DelegationManagerFilterForm getFromJson(String json) {
        Gson gson = new Gson();
        return gson.fromJson(json, DelegationManagerFilterForm.class);
    }
}
