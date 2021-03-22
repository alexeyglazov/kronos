/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mazars.management.db.domain;
import com.mazars.management.db.util.HibernateUtil;
import org.hibernate.Session;
import java.util.List;
/**
 *
 * @author Glazov
 */
public class NotificationItem {
    public enum Event {
        EMPLOYEE_CREATED,
        EMPLOYEE_UPDATED,
        EMPLOYEE_DELETED
    }
    private Long id;
    private Event event;
    private Employee employee;

    public NotificationItem() {}

    public Employee getEmployee() {
        return employee;
    }

    public void setEmployee(Employee employee) {
        this.employee = employee;
    }

    public Event getEvent() {
        return event;
    }

    public void setEvent(Event event) {
        this.event = event;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
    public static List<NotificationItem> get(Event event) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<NotificationItem>)hs.createQuery("select ni from NotificationItem as ni where ni.event=:event").setParameter("event", event).list();
    }
    public static List<NotificationItem> get(Employee employee) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<NotificationItem>)hs.createQuery("select ni from NotificationItem as ni where ni.employee=:employee").setParameter("employee", employee).list();
    }
    public static NotificationItem get(Event event, Employee employee) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (NotificationItem)hs.createQuery("select ni from NotificationItem as ni where ni.event=:event and ni.employee=:employee").setParameter("event", event).setParameter("employee", employee).uniqueResult();
    }
    public static List<NotificationItem> get(Country country) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<NotificationItem>)hs.createQuery("select ni from NotificationItem as ni inner join ni.employee as e inner join e.position as p inner join p.subdepartment as s inner join s.department as d inner join d.office as o where o.country=:country").setParameter("country", country).list();
    }
    public static List<Employee> getEmployees(Country country) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<Employee>)hs.createQuery("select distinct e from NotificationItem as ni inner join ni.employee as e inner join e.position as p inner join p.subdepartment as s inner join s.department as d inner join d.office as o where o.country=:country").setParameter("country", country).list();
    }
}
