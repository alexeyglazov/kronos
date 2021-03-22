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
/**
 *
 * @author glazov
 */
public class StandardCostGroup {
    private Long id;
    private Calendar start;
    private Calendar end;
    private Currency currency;
    private Subdepartment subdepartment;
    private Set<StandardCost> standardCosts = new HashSet<StandardCost>();

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

    public Set<StandardCost> getStandardCosts() {
        return standardCosts;
    }

    public void setStandardCosts(Set<StandardCost> standardCosts) {
        this.standardCosts = standardCosts;
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
}
