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
import java.util.Calendar;
import javax.xml.bind.annotation.XmlEnum;
import javax.xml.bind.annotation.XmlType;
/**
 *
 * @author glazov
 */
public class LeavesItem {
    @XmlType(name="InvoiceRequestStatus", namespace = "http://services.webservices.management.mazars.com/")   
    @XmlEnum
    public enum Type {
        MATERNITY_LEAVE,
        LONG_LEAVE,
        PARENTAL_LEAVE,
        PAID_LEAVE,
        UNPAID_LEAVE
    }
    private Long id;
    private Type type;
    private Calendar start;
    private Calendar end;
    private Employee employee;

    public Employee getEmployee() {
        return employee;
    }

    public void setEmployee(Employee employee) {
        this.employee = employee;
    }

    public Calendar getEnd() {
        return end;
    }

    public void setEnd(Calendar end) {
        this.end = end;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Calendar getStart() {
        return start;
    }

    public void setStart(Calendar start) {
        this.start = start;
    }

    public Type getType() {
        return type;
    }

    public void setType(Type type) {
        this.type = type;
    }
    public static List<LeavesItem> getSortedLeavesItems(Employee employee) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<LeavesItem>)hs.createQuery("select li from LeavesItem as li inner join li.employee as e where e=:employee order by li.start desc").setParameter("employee", employee).list();
    }
    public static Calendar getMinStart() {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (Calendar)hs.createQuery("select min(li.start) from LeavesItem as li ").uniqueResult();
    }
}
