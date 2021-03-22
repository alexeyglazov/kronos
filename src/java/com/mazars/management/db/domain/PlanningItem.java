/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.db.domain;
import com.mazars.management.db.util.HibernateUtil;
import com.mazars.management.db.vo.YearMonthDate;
import java.util.Calendar;
import java.util.LinkedList;
import java.util.List;
import org.hibernate.Query;
import org.hibernate.Session;
/**
 *
 * @author glazov
 */
public class PlanningItem {
    private Long id;
    private PlanningGroup planningGroup;
    private Subdepartment targetSubdepartment;
    private Subdepartment sourceSubdepartment;
    private Employee employee;
    private String description;
    private String location;
    private Calendar startDate;
    private Calendar endDate;

    public PlanningItem() {
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

    public Subdepartment getTargetSubdepartment() {
        return targetSubdepartment;
    }

    public void setTargetSubdepartment(Subdepartment targetSubdepartment) {
        this.targetSubdepartment = targetSubdepartment;
    }

    public Subdepartment getSourceSubdepartment() {
        return sourceSubdepartment;
    }

    public void setSourceSubdepartment(Subdepartment sourceSubdepartment) {
        this.sourceSubdepartment = sourceSubdepartment;
    }

    public Employee getEmployee() {
        return employee;
    }

    public void setEmployee(Employee employee) {
        this.employee = employee;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }


    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
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

    public static List<PlanningItem> getList(Calendar start, Calendar end) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        List<PlanningItem> planningItem = new LinkedList<PlanningItem>();
        String query = "from PlanningItem as pi ";
        query += "where ";
        query += "not (pi.startDate>:end or pi.endDate<:start) ";
        Query hq = hs.createQuery(query);
        hq.setParameter("start", start);
        hq.setParameter("end", end);
        planningItem = (List<PlanningItem>)hq.list();
        return planningItem;
    }
}
