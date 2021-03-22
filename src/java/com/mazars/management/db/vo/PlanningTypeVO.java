/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.db.vo;
import com.mazars.management.db.domain.*;
import java.util.LinkedList;
import java.util.List;
/**
 *
 * @author glazov
 */
public class PlanningTypeVO {
    private Long id;
    private String name;
    private Boolean isActive;
    private Boolean isInternal;

    public PlanningTypeVO() {
    }

    public PlanningTypeVO(PlanningType planningType) {
        this.id = planningType.getId();
        this.name = planningType.getName();
        this.isActive = planningType.getIsActive();
        this.isInternal = planningType.getIsInternal();
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

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    public Boolean getIsInternal() {
        return isInternal;
    }

    public void setIsInternal(Boolean isInternal) {
        this.isInternal = isInternal;
    }
    public static List<PlanningTypeVO> getList(List<PlanningType> planningTypes) {
        List<PlanningTypeVO> planningTypeVOs = new LinkedList<PlanningTypeVO>();
        if(planningTypes == null) {
            return null;
        }
        for(PlanningType planningType : planningTypes) {
           planningTypeVOs.add(new PlanningTypeVO(planningType));
        }
        return planningTypeVOs;
    }        
}
