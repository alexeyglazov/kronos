/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.reports.vo;

import com.mazars.management.db.vo.YearMonthDateTime;
import com.mazars.management.reports.*;
import java.util.Calendar;
import java.util.Date;

/**
 *
 * @author glazov
 */
public class FTEReportVO {
    private Calendar startDate;
    private Calendar endDate;
    private YearMonthDateTime createdAt;
    EmployeeFTEReportVO employeeFTEReport;
    StandardPositionFTEReportVO standardPositionFTEReport;
    OwnTimeFTEReportVO ownTimeFTEReport;

    public FTEReportVO(FTEReport fteReport) {
        this.createdAt = new YearMonthDateTime(fteReport.getCreatedAt());
        this.startDate = fteReport.getFormStartDate();
        this.endDate = fteReport.getFormEndDate();
        this.employeeFTEReport = new EmployeeFTEReportVO(fteReport.getEmployeeFTEReport());
        this.standardPositionFTEReport = new StandardPositionFTEReportVO(fteReport.getStandardPositionFTEReport());
        this.ownTimeFTEReport = new OwnTimeFTEReportVO(fteReport.getOwnTimeFTEReport());
    }

    public EmployeeFTEReportVO getEmployeeFTEReport() {
        return employeeFTEReport;
    }

    public void setEmployeeFTEReportVO(EmployeeFTEReportVO employeeFTEReport) {
        this.employeeFTEReport = employeeFTEReport;
    }

    public StandardPositionFTEReportVO getStandardPositionFTEReport() {
        return standardPositionFTEReport;
    }

    public void setStandardPositionFTEReport(StandardPositionFTEReportVO standardPositionFTEReport) {
        this.standardPositionFTEReport = standardPositionFTEReport;
    }

    public OwnTimeFTEReportVO getOwnTimeFTEReport() {
        return ownTimeFTEReport;
    }

    public void setOwnTimeFTEReport(OwnTimeFTEReportVO ownTimeFTEReport) {
        this.ownTimeFTEReport = ownTimeFTEReport;
    }

    public YearMonthDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(YearMonthDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public Calendar getEndDate() {
        return endDate;
    }

    public void setEndDate(Calendar endDate) {
        this.endDate = endDate;
    }

    public Calendar getStartDate() {
        return startDate;
    }

    public void setStartDate(Calendar startDate) {
        this.startDate = startDate;
    }
}
