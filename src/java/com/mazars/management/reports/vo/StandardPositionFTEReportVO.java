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
public class StandardPositionFTEReportVO {
    private Map<Long, Map<Long, Double>> info = new HashMap<Long, Map<Long, Double>>();
    private List<OfficeDepartmentSubdepartment> subdepartments = new LinkedList<OfficeDepartmentSubdepartment>();
    private List<StandardPositionVO> standardPositions = new LinkedList<StandardPositionVO>();
    private Calendar startDate;
    private Calendar endDate;
    private YearMonthDateTime createdAt;    
    public StandardPositionFTEReportVO(StandardPositionFTEReport standardPositionFTEReport) {
        this.createdAt = new YearMonthDateTime(standardPositionFTEReport.getCreatedAt());
        this.startDate = standardPositionFTEReport.getFormStartDate();
        this.endDate = standardPositionFTEReport.getFormEndDate();        
        for(StandardPosition standardPosition : standardPositionFTEReport.getStandardPositions()) {
            this.standardPositions.add(new StandardPositionVO(standardPosition));
        }
        for(Subdepartment subdepartment : standardPositionFTEReport.getSubdepartments()) {
            this.subdepartments.add(new OfficeDepartmentSubdepartment(subdepartment));
        }
        for(Subdepartment subdepartment : standardPositionFTEReport.getInfo().keySet()) {
            Map<StandardPosition, Double> tmpSubInfo = standardPositionFTEReport.getInfo().get(subdepartment);
            Map<Long, Double> subInfo = info.get(subdepartment.getId());
            if(subInfo == null) {
                subInfo = new HashMap<Long, Double>();
                info.put(subdepartment.getId(), subInfo);
            }
            for(StandardPosition standardPosition : tmpSubInfo.keySet()) {
                Double fte = tmpSubInfo.get(standardPosition);
                subInfo.put(standardPosition.getId(), fte);
            }
        }
    }

    public Map<Long, Map<Long, Double>> getInfo() {
        return info;
    }

    public void setInfo(Map<Long, Map<Long, Double>> info) {
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
