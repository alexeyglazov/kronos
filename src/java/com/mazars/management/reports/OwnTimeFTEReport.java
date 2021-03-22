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
public class OwnTimeFTEReport {
    public class Cell {
        private Long timeSpent;
        private Double fte;

        public Cell() {
        }

        public Cell(Long timeSpent, Double fte) {
            this.timeSpent = timeSpent;
            this.fte = fte;
        }

        public Long getTimeSpent() {
            return timeSpent;
        }

        public void setTimeSpent(Long timeSpent) {
            this.timeSpent = timeSpent;
        }

        public Double getFte() {
            return fte;
        }

        public void setFte(Double fte) {
            this.fte = fte;
        }
        
    }
    private List<Subdepartment> subdepartments = new LinkedList<Subdepartment>();
    private List<StandardPosition> standardPositions = new LinkedList<StandardPosition>();
    private Map<Subdepartment, Map<StandardPosition, Cell>> info = new HashMap<Subdepartment, Map<StandardPosition, Cell>>();

    public Map<Subdepartment, Map<StandardPosition, Cell>> getInfo() {
        return info;
    }

    public void setInfo(Map<Subdepartment, Map<StandardPosition, Cell>> info) {
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

    public OwnTimeFTEReport(FTEReportForm fteReportForm, Module module, Employee currentUser) {
        this.form = fteReportForm;
        this.module = module;
        this.currentUser = currentUser;
        
        this.formStartDate = fteReportForm.getStartDate().getCalendar();
        this.formEndDate = fteReportForm.getEndDate().getCalendar();

        if(currentUser.getProfile().equals(Employee.Profile.SUPER_USER)) {
            this.subdepartments.addAll(RightsItem.getSubdepartments(currentUser, module, currentUser.getCountry() ));
        } else if(currentUser.getProfile().equals(Employee.Profile.COUNTRY_ADMINISTRATOR)) {
            this.subdepartments.addAll(currentUser.getCountry().getSubdepartments());
        }
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

    public void buildFromOwnTimeReportAndStandardPositionFTEReport(OwnTimeReport ownTimeReport, StandardPositionFTEReport standardPositionFTEReport) {
        this.subdepartments = ownTimeReport.getSubdepartments();
        this.standardPositions = ownTimeReport.getStandardPositions();
        OwnTimeReport.Subreport ownTimeSubreport = ownTimeReport.getSubreports().get(0);
        for(Subdepartment subdepartment : this.subdepartments) {
            for(StandardPosition standardPosition : this.standardPositions) {
                Long timeSpent = ownTimeSubreport.getTimeSpent(subdepartment, standardPosition);
                Double fte = standardPositionFTEReport.getFte(subdepartment, standardPosition);
                if(timeSpent != null || fte != null) {
                    Cell cell = new Cell(timeSpent, fte);
                    putCell(subdepartment, standardPosition, cell);
                }
            }
        }
        this.createdAt = new Date();
    }
    public Cell getCell(Subdepartment subdepartment, StandardPosition standardPosition) {
        if(info.containsKey(subdepartment)) {
            return info.get(subdepartment).get(standardPosition);
        }
        return null;
    }
    public void putCell(Subdepartment subdepartment, StandardPosition standardPosition, Cell cell) {
        Map<StandardPosition, Cell> subInfo = info.get(subdepartment);
        if(subInfo == null) {
            subInfo = new HashMap<StandardPosition, Cell>();
            info.put(subdepartment, subInfo);
        }
        subInfo.put(standardPosition, cell);
    }
}
