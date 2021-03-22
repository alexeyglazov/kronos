/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.db.domain;
import com.mazars.management.db.util.HibernateUtil;
import org.hibernate.Session;

import java.util.Set;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.List;
import java.util.Objects;
import org.hibernate.Query;

/**
 *
 * @author glazov
 */
public class StandardPosition {
    private Long id;
    private String name;
    private Integer sortValue;
    Set<Position> positions = new HashSet<Position>();
    public StandardPosition() {}

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

    public Integer getSortValue() {
        return sortValue;
    }

    public void setSortValue(Integer sortValue) {
        this.sortValue = sortValue;
    }

    public Set<Position> getPositions() {
        return positions;
    }

    public void setPositions(Set<Position> positions) {
        this.positions = positions;
    }

    public static List<StandardPosition> getAll() {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<StandardPosition>)hs.createQuery("from StandardPosition").list();
    }
    public static Long getTotalCount() {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (Long)hs.createQuery("select count(*) from StandardPosition").uniqueResult();
    }
    public static StandardPosition getByName(String name) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (StandardPosition)hs.createQuery("from StandardPosition as sp where sp.name=:name").setString("name", name).uniqueResult();
    }    
    public static List<StandardPosition> getByIds(List<Long> ids) {
        if(ids.isEmpty()) {
            return new LinkedList<StandardPosition>();
        }
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        String query = "select sp from StandardPosition as sp where sp.id in (:ids) ";
        Query hq = hs.createQuery(query);
        return (List<StandardPosition>)hq.setParameterList("ids", ids).list();
    }
    
    @Override
    public int hashCode() {
        int hash = 7;
        hash = 17 * hash + Objects.hashCode(this.id);
        return hash;
    }

    @Override
    public boolean equals(Object obj) {
        if (obj == null) {
            return false;
        }
        if (!(obj instanceof StandardPosition)) {
            return false;
        }
        final StandardPosition other = (StandardPosition) obj;
        if (!Objects.equals(this.id, other.id)) {
            return false;
        }
        return true;
    }
}
