/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.reports;
import com.mazars.management.db.comparators.StandardPositionComparator;
import com.mazars.management.db.comparators.SubdepartmentComparator;
import com.mazars.management.db.domain.*;
import com.mazars.management.web.forms.FTEReportForm;
import java.util.*;
import java.util.Calendar;
/**
 *
 * @author glazov
 */
public class StandardPositionFTEReport {
    private List<Subdepartment> subdepartments = new LinkedList<Subdepartment>();
    private List<StandardPosition> standardPositions = new LinkedList<StandardPosition>();
    private Map<Subdepartment, Map<StandardPosition, Double>> info = new HashMap<Subdepartment, Map<StandardPosition, Double>>();

    public Map<Subdepartment, Map<StandardPosition, Double>> getInfo() {
        return info;
    }

    public void setInfo(Map<Subdepartment, Map<StandardPosition, Double>> info) {
        this.info = info;
    }

    public List<Subdepartment> getSubdepartments() {
        return subdepartments;
    }

    public void setSubdepartments(List<Subdepartment> subdepartments) {
        this.subdepartments = subdepartments;
    }

    public List<StandardPosition> getStandardPositions() {
        return standardPositions;
    }

    public void setStandardPositions(List<StandardPosition> standardPositions) {
        this.standardPositions = standardPositions;
    }
    
    private Calendar formStartDate;
    private Calendar formEndDate;

    private Employee currentUser;
    private Module module;
    private FTEReportForm form;
    private Date createdAt;

    public StandardPositionFTEReport(FTEReportForm fteReportForm, Module module, Employee currentUser) {
        this.form = fteReportForm;
        this.module = module;
        this.currentUser = currentUser;
        
        this.formStartDate = fteReportForm.getStartDate().getCalendar();
        this.formEndDate = fteReportForm.getEndDate().getCalendar();

        this.subdepartments = Subdepartment.getAllowedSubdepartments(null, null, null, currentUser, module);      
        Collections.sort(subdepartments, new SubdepartmentComparator());
        standardPositions = StandardPosition.getAll();
        Collections.sort(standardPositions, new StandardPositionComparator());
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

    public void buildFromEmployeeFTEReport(EmployeeFTEReport employeeFTEReport) {
        List<EmployeeFTEReport.Row> employeeRows = employeeFTEReport.getRows();
        for(EmployeeFTEReport.Row employeeRow : employeeRows) {
            Subdepartment subdepartment = employeeRow.getPosition().getSubdepartment();
            StandardPosition standardPosition = employeeRow.getStandardPosition();
            if(info.containsKey(subdepartment)) {
                Map<StandardPosition, Double> subInfo = info.get(subdepartment);
                Double fte = subInfo.get(standardPosition);
                if(fte != null) {
                    fte += employeeRow.getFte();
                } else {
                    fte = employeeRow.getFte();
                }
                subInfo.put(standardPosition, fte);
            } else {
                Map<StandardPosition, Double> subInfo = new HashMap<StandardPosition, Double>();
                subInfo.put(standardPosition, employeeRow.getFte());
                info.put(subdepartment, subInfo);
            }
        }
        this.createdAt = new Date();
    }
    public Double getFte(Subdepartment subdepartment, StandardPosition standardPosition) {
        if(info.containsKey(subdepartment)) {
            return info.get(subdepartment).get(standardPosition);
        }
        return null;
    }  
}
