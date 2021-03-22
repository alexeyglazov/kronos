/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.web.vo;

import com.mazars.management.db.domain.*;
import com.mazars.management.db.vo.YearMonthDateTime;
import com.mazars.management.jobs.Job;

/**
 *
 * @author Glazov
 */
public class JobWithEmployeeVO {
    private String name;
    private YearMonthDateTime startDate;
    private Long employeeId;
    private String employeeUserName;
    private double part;

    public JobWithEmployeeVO() {
    }
    public JobWithEmployeeVO(Job job) {
        this.name = job.getName();
        this.part = job.getPart();
        if(job.getStartDate() != null) {
            this.startDate = new YearMonthDateTime(job.getStartDate());
        }
        if(job.getEmployee() != null) {
            this.employeeId = job.getEmployee().getId();
            this.employeeUserName = job.getEmployee().getUserName();
        }
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public YearMonthDateTime getStartDate() {
        return startDate;
    }

    public void setStartDate(YearMonthDateTime startDate) {
        this.startDate = startDate;
    }

    public double getPart() {
        return part;
    }

    public void setPart(double part) {
        this.part = part;
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
}
