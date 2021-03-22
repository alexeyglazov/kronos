/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.db.domain;
import com.mazars.management.db.util.HibernateUtil;
import org.hibernate.Session;
import java.util.List;
import java.util.Set;
import java.util.HashSet;
/**
 *
 * @author glazov
 */
public class PlanningType {
    private Long id;
    private String name;
    private Boolean isActive;
    private Boolean isInternal;
    private Set<PlanningGroup> planningGroups = new HashSet<PlanningGroup>();
    private Subdepartment subdepartment;

    public PlanningType() {
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

    public Subdepartment getSubdepartment() {
        return subdepartment;
    }

    public void setSubdepartment(Subdepartment subdepartment) {
        this.subdepartment = subdepartment;
    }

    public Boolean getIsInternal() {
        return isInternal;
    }

    public void setIsInternal(Boolean isInternal) {
        this.isInternal = isInternal;
    }

    public Set<PlanningGroup> getPlanningGroups() {
        return planningGroups;
    }

    public void setPlanningGroups(Set<PlanningGroup> planningGroups) {
        this.planningGroups = planningGroups;
    }
    public static List<PlanningType> getByName(String name, Subdepartment subdepartment) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<PlanningType>)hs.createQuery("select pt from PlanningType as pt where pt.name=:name and pt.subdepartment=:subdepartment").setString("name", name).setParameter("subdepartment", subdepartment).list();
    }
}
