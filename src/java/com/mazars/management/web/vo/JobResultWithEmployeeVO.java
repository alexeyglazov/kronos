/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.web.vo;

import com.mazars.management.db.domain.*;
import com.mazars.management.db.vo.YearMonthDateTime;

/**
 *
 * @author Glazov
 */
public class JobResultWithEmployeeVO {
    private Long id;
    private String name;
    private YearMonthDateTime startDate;
    private YearMonthDateTime endDate;
    private String fileName;
    private Integer dataSize;
    private Long employeeId;
    private String employeeUserName;

    public JobResultWithEmployeeVO() {
    }
    public JobResultWithEmployeeVO(JobResult jobResult) {
        this.id = jobResult.getId();
        this.name = jobResult.getName();
        this.startDate = new YearMonthDateTime(jobResult.getStartDate());
        this.endDate = new YearMonthDateTime(jobResult.getEndDate());
        if(jobResult.getDataSize() != null) {
            this.dataSize = jobResult.getDataSize();
        }
        this.employeeId = jobResult.getEmployee().getId();
        this.employeeUserName = jobResult.getEmployee().getUserName();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public YearMonthDateTime getEndDate() {
        return endDate;
    }

    public void setEndDate(YearMonthDateTime endDate) {
        this.endDate = endDate;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public Integer getDataSize() {
        return dataSize;
    }

    public void setDataSize(Integer dataSize) {
        this.dataSize = dataSize;
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
