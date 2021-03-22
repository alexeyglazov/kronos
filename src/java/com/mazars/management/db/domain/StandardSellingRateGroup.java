/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.db.domain;
import com.mazars.management.db.util.HibernateUtil;
import java.util.Calendar;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import org.hibernate.Query;
import org.hibernate.Session;
/**
 *
 * @author glazov
 */
public class StandardSellingRateGroup {
    private Long id;
    private Calendar start;
    private Calendar end;
    private Currency currency;
    private Subdepartment subdepartment;
    private Set<StandardSellingRate> standardSellingRates = new HashSet<StandardSellingRate>();

    public Currency getCurrency() {
        return currency;
    }

    public void setCurrency(Currency currency) {
        this.currency = currency;
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

    public Set<StandardSellingRate> getStandardSellingRates() {
        return standardSellingRates;
    }

    public void setStandardSellingRates(Set<StandardSellingRate> standardSellingRates) {
        this.standardSellingRates = standardSellingRates;
    }

    public Calendar getStart() {
        return start;
    }

    public void setStart(Calendar start) {
        this.start = start;
    }

    public Subdepartment getSubdepartment() {
        return subdepartment;
    }

    public void setSubdepartment(Subdepartment subdepartment) {
        this.subdepartment = subdepartment;
    }
    public static List<StandardSellingRateGroup> get(Subdepartment subdepartment, Calendar date) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<StandardSellingRateGroup>)hs.createQuery("select ssrg from StandardSellingRateGroup as ssrg where ssrg.subdepartment=:subdepartment and ssrg.start<=:date and (ssrg.end>=:date or ssrg.end=null) ").setParameter("subdepartment", subdepartment).setParameter("date", date).list();
    }
    public static List<StandardSellingRateGroup> get(Subdepartment subdepartment, Calendar startDate, Calendar endDate) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        String query = "select ssrg from StandardSellingRateGroup as ssrg where ssrg.subdepartment=:subdepartment and (ssrg.start<=:endDate and (ssrg.end=null or ssrg.end>=:startDate)) ";
        Query hq = hs.createQuery(query);
        hq.setParameter("subdepartment", subdepartment);
        hq.setParameter("startDate", startDate);
        hq.setParameter("endDate", endDate);
        return (List<StandardSellingRateGroup>)hq.list();
    }

}
