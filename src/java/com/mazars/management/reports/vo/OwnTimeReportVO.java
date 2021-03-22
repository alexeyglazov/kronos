/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.reports.vo;

import com.mazars.management.db.domain.*;
import com.mazars.management.db.vo.*;
import com.mazars.management.reports.*;
import com.mazars.management.reports.OwnTimeReport.View;
import com.mazars.management.web.vo.OfficeDepartmentSubdepartment;
import java.util.*;

/**
 *
 * @author glazov
 */
public class OwnTimeReportVO {
    public class SubreportVO {
        private Map<Long, Map<Long, Long>> info = new HashMap<Long, Map<Long, Long>>();
        private Boolean isInternal = null;
        private TaskVO task;
        private Boolean isIdle;

        public SubreportVO(OwnTimeReport.Subreport subreport) {
            this.isInternal = subreport.getIsInternal();
            if(subreport.getTask() != null) { 
                this.task = new TaskVO(subreport.getTask());
            }
            this.isIdle = subreport.getIsIdle();
            for(Subdepartment subdepartment : subreport.getInfo().keySet()) {
                Map<StandardPosition, Long> tmpSubInfo = subreport.getInfo().get(subdepartment);
                Map<Long, Long> subInfo = info.get(subdepartment.getId());
                if(subInfo == null) {
                    subInfo = new HashMap<Long, Long>();
                    info.put(subdepartment.getId(), subInfo);
                }
                for(StandardPosition standardPosition : tmpSubInfo.keySet()) {
                    Long timeSpent = tmpSubInfo.get(standardPosition);
                    subInfo.put(standardPosition.getId(), timeSpent);
                }
            }
        }

        public Boolean getIsIdle() {
            return isIdle;
        }

        public void setIsIdle(Boolean isIdle) {
            this.isIdle = isIdle;
        }

        public Boolean getIsInternal() {
            return isInternal;
        }

        public void setIsInternal(Boolean isInternal) {
            this.isInternal = isInternal;
        }

        public Map<Long, Map<Long, Long>> getInfo() {
            return info;
        }

        public void setInfo(Map<Long, Map<Long, Long>> info) {
            this.info = info;
        }

        public TaskVO getTask() {
            return task;
        }

        public void setTask(TaskVO task) {
            this.task = task;
        }
    }
    
    private List<SubreportVO> subreports = new LinkedList<SubreportVO>();
    private List<OfficeDepartmentSubdepartment> subdepartments = new LinkedList<OfficeDepartmentSubdepartment>();
    private List<StandardPositionVO> standardPositions = new LinkedList<StandardPositionVO>();
    private YearMonthDateTime createdAt;
    
    private String formOfficeName;
    private String formDepartmentName;
    private String formSubdepartmentName;
    private YearMonthDate formStartDate;
    private YearMonthDate formEndDate;
    private OwnTimeReport.View view;

    public OwnTimeReportVO(OwnTimeReport ownTimeReport) {
        this.createdAt = new YearMonthDateTime(ownTimeReport.getCreatedAt());
        for(OwnTimeReport.Subreport subreport : ownTimeReport.getSubreports()) {
            subreports.add(new SubreportVO(subreport));
        }

        for(StandardPosition standardPosition : ownTimeReport.getStandardPositions()) {
            standardPositions.add(new StandardPositionVO(standardPosition));
        }
        for(Subdepartment subdepartment : ownTimeReport.getSubdepartments()) {
            subdepartments.add(new OfficeDepartmentSubdepartment(subdepartment));
        }
        if(ownTimeReport.getFormOffice() != null) {
            this.formOfficeName = ownTimeReport.getFormOffice().getName();
        }
        if(ownTimeReport.getFormDepartment() != null) {
            this.formDepartmentName = ownTimeReport.getFormDepartment().getName();
        }
        if(ownTimeReport.getFormSubdepartment() != null) {
            this.formSubdepartmentName = ownTimeReport.getFormSubdepartment().getName();
        }
        this.formStartDate = ownTimeReport.getFormStartDate();
        this.formEndDate = ownTimeReport.getFormEndDate();
        this.view = ownTimeReport.getView();
    }

    public YearMonthDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(YearMonthDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public String getFormDepartmentName() {
        return formDepartmentName;
    }

    public void setFormDepartmentName(String formDepartmentName) {
        this.formDepartmentName = formDepartmentName;
    }

    public YearMonthDate getFormEndDate() {
        return formEndDate;
    }

    public void setFormEndDate(YearMonthDate formEndDate) {
        this.formEndDate = formEndDate;
    }

    public String getFormOfficeName() {
        return formOfficeName;
    }

    public void setFormOfficeName(String formOfficeName) {
        this.formOfficeName = formOfficeName;
    }

    public YearMonthDate getFormStartDate() {
        return formStartDate;
    }

    public void setFormStartDate(YearMonthDate formStartDate) {
        this.formStartDate = formStartDate;
    }

    public String getFormSubdepartmentName() {
        return formSubdepartmentName;
    }

    public void setFormSubdepartmentName(String formSubdepartmentName) {
        this.formSubdepartmentName = formSubdepartmentName;
    }

    public List<StandardPositionVO> getStandardPositions() {
        return standardPositions;
    }

    public void setStandardPositions(List<StandardPositionVO> standardPositions) {
        this.standardPositions = standardPositions;
    }

    public List<SubreportVO> getSubreports() {
        return subreports;
    }

    public void setSubreports(List<SubreportVO> subreports) {
        this.subreports = subreports;
    }

    public View getView() {
        return view;
    }

    public void setView(View view) {
        this.view = view;
    }
}
