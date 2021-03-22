/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.db.domain;

import com.mazars.management.db.util.HibernateUtil;
import java.util.LinkedList;
import java.util.List;
import java.util.Objects;
import org.hibernate.Query;
import org.hibernate.Session;

/**
 *
 * @author glazov
 */
public class SubdepartmentConflict {
    private Long id;
    private Subdepartment checkingSubdepartment;
    private Subdepartment checkedSubdepartment;
    public SubdepartmentConflict() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Subdepartment getCheckingSubdepartment() {
        return checkingSubdepartment;
    }

    public void setCheckingSubdepartment(Subdepartment checkingSubdepartment) {
        this.checkingSubdepartment = checkingSubdepartment;
    }

    public Subdepartment getCheckedSubdepartment() {
        return checkedSubdepartment;
    }

    public void setCheckedSubdepartment(Subdepartment checkedSubdepartment) {
        this.checkedSubdepartment = checkedSubdepartment;
    }
    public static List<Subdepartment> getCheckingSubdepartments(Subdepartment checkedSubdepartment, List<Subdepartment> potentialCheckingSubdepartments) {
        if(potentialCheckingSubdepartments.isEmpty()) {
            return new LinkedList<Subdepartment>();
        }
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        String query = "select cgs from SubdepartmentConflict as sc ";
        query += "inner join sc.checkedSubdepartment as cds ";
        query += "inner join sc.checkingSubdepartment as cgs ";
        query += "where ";
        query += "cds=:checkedSubdepartment and cgs in (:checkingSubdepartments) ";
        Query hq = hs.createQuery(query);
        hq.setParameter("checkedSubdepartment", checkedSubdepartment);
        hq.setParameterList("checkingSubdepartments", potentialCheckingSubdepartments);
        List<Subdepartment> subdepartments = (List<Subdepartment>)hq.list();
        return subdepartments;
    }
    public static List<Subdepartment> getCheckingSubdepartments(Subdepartment checkedSubdepartment) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        String query = "select cgs from SubdepartmentConflict as sc ";
        query += "inner join sc.checkedSubdepartment as cds ";
        query += "inner join sc.checkingSubdepartment as cgs ";
        query += "where ";
        query += "cds=:checkedSubdepartment ";
        Query hq = hs.createQuery(query);
        hq.setParameter("checkedSubdepartment", checkedSubdepartment);
        List<Subdepartment> subdepartments = (List<Subdepartment>)hq.list();
        return subdepartments;
    }
    public static List<Subdepartment> getCheckedSubdepartments(Subdepartment checkingSubdepartment) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        String query = "select cds from SubdepartmentConflict as sc ";
        query += "inner join sc.checkedSubdepartment as cds ";
        query += "inner join sc.checkingSubdepartment as cgs ";
        query += "where ";
        query += "cgs=:checkingSubdepartment ";
        Query hq = hs.createQuery(query);
        hq.setParameter("checkingSubdepartment", checkingSubdepartment);
        List<Subdepartment> subdepartments = (List<Subdepartment>)hq.list();
        return subdepartments;
    }

    @Override
    public int hashCode() {
        int hash = 7;
        hash = 29 * hash + Objects.hashCode(this.id);
        return hash;
    }

    @Override
    public boolean equals(Object obj) {
        if (obj == null) {
            return false;
        }
        if (!(obj instanceof SubdepartmentConflict)) {
            return false;
        }
        final SubdepartmentConflict other = (SubdepartmentConflict) obj;
        if (!Objects.equals(this.id, other.id)) {
            return false;
        }
        return true;
    }

}
