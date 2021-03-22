/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.reports;
import com.mazars.management.db.domain.*;
import com.mazars.management.web.forms.FTEReportForm;
import com.mazars.management.web.forms.OwnTimeReportForm;
import java.util.*;
import java.util.Calendar;
/**
 *
 * @author glazov
 */
public class FTEReport {
  
    private Calendar formStartDate;
    private Calendar formEndDate;
    private Employee currentUser;
    private Module module;
    private FTEReportForm form;
    private EmployeeFTEReport employeeFTEReport = null;
    private StandardPositionFTEReport standardPositionFTEReport = null;
    private OwnTimeFTEReport ownTimeFTEReport = null;

    private Date createdAt;

    public FTEReport(FTEReportForm fteReportForm, Module module, Employee currentUser) {
        this.form = fteReportForm;
        this.module = module;
        this.currentUser = currentUser;
        
        this.formStartDate = fteReportForm.getStartDate().getCalendar();
        this.formEndDate = fteReportForm.getEndDate().getCalendar();

        employeeFTEReport = new EmployeeFTEReport(this.form, this.module, this.currentUser);
        standardPositionFTEReport = new StandardPositionFTEReport(this.form, this.module, this.currentUser);
        ownTimeFTEReport = new OwnTimeFTEReport(fteReportForm, module, currentUser);
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public Calendar getFormStartDate() {
        return formStartDate;
    }

    public void setFormStartDate(Calendar formStartDate) {
        this.formStartDate = formStartDate;
    }

    public Calendar getFormEndDate() {
        return formEndDate;
    }

    public void setFormEndDate(Calendar formEndDate) {
        this.formEndDate = formEndDate;
    }

    public EmployeeFTEReport getEmployeeFTEReport() {
        return employeeFTEReport;
    }

    public void setEmployeeFTEReport(EmployeeFTEReport employeeFTEReport) {
        this.employeeFTEReport = employeeFTEReport;
    }

    public StandardPositionFTEReport getStandardPositionFTEReport() {
        return standardPositionFTEReport;
    }

    public void setStandardPositionFTEReport(StandardPositionFTEReport standardPositionFTEReport) {
        this.standardPositionFTEReport = standardPositionFTEReport;
    }

    public OwnTimeFTEReport getOwnTimeFTEReport() {
        return ownTimeFTEReport;
    }

    public void setOwnTimeFTEReport(OwnTimeFTEReport ownTimeFTEReport) {
        this.ownTimeFTEReport = ownTimeFTEReport;
    }

    public void build() {
        this.employeeFTEReport.build();
        this.standardPositionFTEReport.buildFromEmployeeFTEReport(this.employeeFTEReport);
        
        OwnTimeReportForm ownTimeReportForm = new OwnTimeReportForm();
        ownTimeReportForm.setStartDate(this.form.getStartDate());
        ownTimeReportForm.setEndDate(this.form.getEndDate());
        ownTimeReportForm.setView(OwnTimeReport.View.TIME);
        OwnTimeReport ownTimeReport = new OwnTimeReport(ownTimeReportForm, module, currentUser);
        ownTimeReport.buildSubreportNonInternal();
        this.ownTimeFTEReport.buildFromOwnTimeReportAndStandardPositionFTEReport(ownTimeReport, standardPositionFTEReport);

        this.createdAt = new Date();
    }
}
