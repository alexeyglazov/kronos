/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mazars.management.db.domain;

import com.mazars.management.db.util.CalendarUtil;
import com.mazars.management.db.util.HibernateUtil;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import org.hibernate.Query;
import org.hibernate.Session;

/**
 *
 * @author glazov
 */
public class BusinessTripItem {
    private Long id;
    private Calendar day;
    private Date modifiedAt;
    private Employee employee;
    private ProjectCode projectCode;

    public BusinessTripItem() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Calendar getDay() {
        return day;
    }

    public void setDay(Calendar day) {
        this.day = day;
    }

    public Date getModifiedAt() {
        return modifiedAt;
    }

    public void setModifiedAt(Date modifiedAt) {
        this.modifiedAt = modifiedAt;
    }

    public Employee getEmployee() {
        return employee;
    }

    public void setEmployee(Employee employee) {
        this.employee = employee;
    }

    public ProjectCode getProjectCode() {
        return projectCode;
    }

    public void setProjectCode(ProjectCode projectCode) {
        this.projectCode = projectCode;
    }
    public static List<BusinessTripItem> getAllByEmployeeStartAndEndDates(Employee employee, Calendar startDate, Calendar endDate) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<BusinessTripItem>)hs.createQuery("select bti from BusinessTripItem as bti inner join bti.employee as e where e=:employee and bti.day >= :day1 and bti.day <= :day2").setParameter("employee", employee).setParameter("day1", startDate).setParameter("day2", endDate).list();
    }
    public static List<BusinessTripItem> getAllByEmployeeYearMonth(Employee employee, int year, int month) {
        Calendar startDate = CalendarUtil.getBeginDateForYearMonth(year, month);
        Calendar endDate = CalendarUtil.getEndDateForYearMonth(year, month);
        return getAllByEmployeeStartAndEndDates(employee, startDate, endDate);
    }
    public static BusinessTripItem get(Employee employee, ProjectCode projectCode, Calendar day) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (BusinessTripItem)hs.createQuery("select distinct bti from BusinessTripItem as bti where bti.employee=:employee and bti.projectCode=:projectCode and bti.day=:day").setParameter("employee", employee).setParameter("projectCode", projectCode).setParameter("day", day).uniqueResult();
    }
}
