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
public class PlanningGroupVO {
    private Long id;
    private String name;
    private String description;
    public PlanningGroupVO() {};

    public PlanningGroupVO(PlanningGroup planningGroup) {
        this.id = planningGroup.getId();
        this.name = planningGroup.getName();
        this.description = planningGroup.getDescription();
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
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
    public static List<PlanningGroupVO> getList(List<PlanningGroup> planningGroups) {
        List<PlanningGroupVO> planningGroupVOs = new LinkedList<PlanningGroupVO>();
        if(planningGroups == null) {
            return null;
        }
        for(PlanningGroup planningGroup : planningGroups) {
           planningGroupVOs.add(new PlanningGroupVO(planningGroup));
        }
        return planningGroupVOs;
    }
}
