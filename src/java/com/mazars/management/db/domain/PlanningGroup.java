/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.db.domain;
import com.mazars.management.db.util.HibernateUtil;
import com.mazars.management.web.forms.PlanningGroupPickerForm;
import java.util.Calendar;
import org.hibernate.Session;
import java.util.List;
import java.util.Set;
import java.util.HashSet;
import java.util.LinkedList;
import org.hibernate.Query;

/**
 *
 * @author glazov
 */
public class PlanningGroup {
    private Long id;
    private String name;
    private String description;
    private Boolean isApproved;
    private Subdepartment targetSubdepartment;
    private Client client;
    private Task task;
    private Employee inChargePerson;
    private PlanningType planningType;
    
    private Set<PlanningItem> planningItems = new HashSet<PlanningItem>();
    private Set<PlanningGroupToProjectCodeLink> planningGroupToProjectCodeLinks = new HashSet<PlanningGroupToProjectCodeLink>();

    public PlanningGroup() {};

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Set<PlanningGroupToProjectCodeLink> getPlanningGroupToProjectCodeLinks() {
        return planningGroupToProjectCodeLinks;
    }

    public void setPlanningGroupToProjectCodeLinks(Set<PlanningGroupToProjectCodeLink> planningGroupToProjectCodeLinks) {
        this.planningGroupToProjectCodeLinks = planningGroupToProjectCodeLinks;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Set<PlanningItem> getPlanningItems() {
        return planningItems;
    }

    public void setPlanningItems(Set<PlanningItem> planningItems) {
        this.planningItems = planningItems;
    }

    public Subdepartment getTargetSubdepartment() {
        return targetSubdepartment;
    }

    public void setTargetSubdepartment(Subdepartment targetSubdepartment) {
        this.targetSubdepartment = targetSubdepartment;
    }

    public Task getTask() {
        return task;
    }

    public void setTask(Task task) {
        this.task = task;
    }

    public Client getClient() {
        return client;
    }

    public void setClient(Client client) {
        this.client = client;
    }

    public Employee getInChargePerson() {
        return inChargePerson;
    }

    public void setInChargePerson(Employee inChargePerson) {
        this.inChargePerson = inChargePerson;
    }

    public PlanningType getPlanningType() {
        return planningType;
    }

    public void setPlanningType(PlanningType planningType) {
        this.planningType = planningType;
    }

    public Boolean getIsApproved() {
        return isApproved;
    }

    public void setIsApproved(Boolean isApproved) {
        this.isApproved = isApproved;
    }

    public static List<PlanningGroup> search(PlanningGroupPickerForm planningGroupPickerForm) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();

        String descriptionPattern = null;
        Calendar startDate = null;
        Calendar endDate = null;

        descriptionPattern = planningGroupPickerForm.getDescriptionPattern();
        if(! descriptionPattern.startsWith("%")) {
            descriptionPattern = "%" + descriptionPattern;
        }
        if(! descriptionPattern.endsWith("%")) {
            descriptionPattern = descriptionPattern + "%";
        }
        if(planningGroupPickerForm.getStartDate() != null) {
            startDate = planningGroupPickerForm.getStartDate().getCalendar();
        }
        if(planningGroupPickerForm.getEndDate() != null) {
            endDate = planningGroupPickerForm.getEndDate().getCalendar();
        } 
        List<PlanningGroup> planningGroups = new LinkedList<PlanningGroup>();
        String query = "select pg from PlanningGroup as pg inner join pg.planningItems as pi inner join pg.targetSubdepartment as ts ";
        query += "where ";
        query += "ts.id in :subdepartmentIds ";
        query += "and (";
        query += "pg.name like :description1 ";
        query += "or pg.description like :description2 ";
        query += "or pi.description like :description3 ";
        query += ") ";
        query += "and (pi.startDate<=:endDate and pi.endDate>=:startDate) ";
        query += "group by pg ";
        Query hq = hs.createQuery(query);
        hq.setParameterList("subdepartmentIds", planningGroupPickerForm.getSubdepartmentIds());
        hq.setParameter("description1", descriptionPattern);
        hq.setParameter("description2", descriptionPattern);
        hq.setParameter("description3", descriptionPattern);
        hq.setParameter("startDate", startDate);
        hq.setParameter("endDate", endDate);
        planningGroups = (List<PlanningGroup>)hq.list();
        return planningGroups;
    }

}
