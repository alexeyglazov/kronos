/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.db.domain;
import com.mazars.management.db.comparators.EmployeePositionHistoryItemComparator;
import com.mazars.management.db.util.HibernateUtil;
import java.util.Calendar;
import java.util.Collections;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import org.hibernate.Session;
/**
 *
 * @author glazov
 */
public class PlanningGroupToProjectCodeLink {
    private Long id;
    private PlanningGroup planningGroup;
    private ProjectCode projectCode;
    public PlanningGroupToProjectCodeLink() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public PlanningGroup getPlanningGroup() {
        return planningGroup;
    }

    public void setPlanningGroup(PlanningGroup planningGroup) {
        this.planningGroup = planningGroup;
    }

    public ProjectCode getProjectCode() {
        return projectCode;
    }

    public void setProjectCode(ProjectCode projectCode) {
        this.projectCode = projectCode;
    }


}
