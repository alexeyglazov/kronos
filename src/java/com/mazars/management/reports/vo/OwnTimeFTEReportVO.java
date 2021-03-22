/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.reports.vo;

import com.mazars.management.db.domain.*;
import com.mazars.management.db.vo.StandardPositionVO;
import com.mazars.management.db.vo.YearMonthDateTime;
import com.mazars.management.reports.*;
import com.mazars.management.web.vo.OfficeDepartmentSubdepartment;
import java.util.Calendar;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

/**
 *
 * @author glazov
 */
public class OwnTimeFTEReportVO {
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
   
    private Map<Long, Map<Long, Cell>> info = new HashMap<Long, Map<Long, Cell>>();
    private List<OfficeDepartmentSubdepartment> subdepartments = new LinkedList<OfficeDepartmentSubdepartment>();
    private List<StandardPositionVO> standardPositions = new LinkedList<StandardPositionVO>();
    private Calendar startDate;
    private Calendar endDate;
    private YearMonthDateTime createdAt;    
    public OwnTimeFTEReportVO(OwnTimeFTEReport ownTimeFTEReport) {
        this.createdAt = new YearMonthDateTime(ownTimeFTEReport.getCreatedAt());
        this.startDate = ownTimeFTEReport.getFormStartDate();
        this.endDate = ownTimeFTEReport.getFormEndDate();        
        for(StandardPosition standardPosition : ownTimeFTEReport.getStandardPositions()) {
            this.standardPositions.add(new StandardPositionVO(standardPosition));
        }
        for(Subdepartment subdepartment : ownTimeFTEReport.getSubdepartments()) {
            this.subdepartments.add(new OfficeDepartmentSubdepartment(subdepartment));
        }
        for(Subdepartment subdepartment : ownTimeFTEReport.getInfo().keySet()) {
            Map<StandardPosition, OwnTimeFTEReport.Cell> tmpSubInfo = ownTimeFTEReport.getInfo().get(subdepartment);
            Map<Long, Cell> subInfo = info.get(subdepartment.getId());
            if(subInfo == null) {
                subInfo = new HashMap<Long, Cell>();
                info.put(subdepartment.getId(), subInfo);
            }
            for(StandardPosition standardPosition : tmpSubInfo.keySet()) {
                OwnTimeFTEReport.Cell tmpCell = tmpSubInfo.get(standardPosition);
                subInfo.put(standardPosition.getId(), new Cell(tmpCell.getTimeSpent(), tmpCell.getFte()));
            }
        }
    }

    public Map<Long, Map<Long, Cell>> getInfo() {
        return info;
    }

    public void setInfo(Map<Long, Map<Long, Cell>> info) {
        this.info = info;
    }

    public List<OfficeDepartmentSubdepartment> getSubdepartments() {
        return subdepartments;
    }

    public void setSubdepartments(List<OfficeDepartmentSubdepartment> subdepartments) {
        this.subdepartments = subdepartments;
    }

    public List<StandardPositionVO> getStandardPositions() {
        return standardPositions;
    }

    public void setStandardPositions(List<StandardPositionVO> standardPositions) {
        this.standardPositions = standardPositions;
    }

    public Calendar getStartDate() {
        return startDate;
    }

    public void setStartDate(Calendar startDate) {
        this.startDate = startDate;
    }

    public Calendar getEndDate() {
        return endDate;
    }

    public void setEndDate(Calendar endDate) {
        this.endDate = endDate;
    }

    public YearMonthDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(YearMonthDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
