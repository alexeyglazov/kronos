/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.db.domain;
import com.mazars.management.db.util.HibernateUtil;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import org.hibernate.Query;
import org.hibernate.Session;

/**
 *
 * @author glazov
 */
public class Activity {
    private Long id;
    private String name;
    private String codeName;
    private Boolean isActive;
    private Boolean isConflictCheck;
    private Subdepartment subdepartment;
    private Set<ProjectCode> projectCodes = new HashSet<ProjectCode>();

    public Activity() {
    }
    

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCodeName() {
        return codeName;
    }

    public void setCodeName(String codeName) {
        this.codeName = codeName;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    public Boolean getIsConflictCheck() {
        return isConflictCheck;
    }

    public void setIsConflictCheck(Boolean isConflictCheck) {
        this.isConflictCheck = isConflictCheck;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Subdepartment getSubdepartment() {
        return subdepartment;
    }

    public void setSubdepartment(Subdepartment subdepartment) {
        this.subdepartment = subdepartment;
    }
    public static List<Activity> getAll() {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<Activity>)hs.createQuery("select a from Activity as a ").list();
    }
    public static List<Activity> getAll(List<Subdepartment> subdepartments) {
        List<Activity> activities = new LinkedList<Activity>();
        if(subdepartments.isEmpty()) {
            return activities;
        }
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        String query = "select a from Activity as a where a.subdepartment in (:subdepartments)";
        Query hq = hs.createQuery(query);
        hq.setParameterList("subdepartments", subdepartments);
        return (List<Activity>)hq.list();
    }

    public Set<ProjectCode> getProjectCodes() {
        return projectCodes;
    }

    public void setProjectCodes(Set<ProjectCode> projectCodes) {
        this.projectCodes = projectCodes;
    }

    @Override
    public int hashCode() {
        int hash = 5;
        hash = 61 * hash + Objects.hashCode(this.id);
        return hash;
    }

    @Override
    public boolean equals(Object obj) {
        if (obj == null) {
            return false;
        }
        if (!(obj instanceof Activity)) {
            return false;
        }
        final Activity other = (Activity) obj;
        if (!Objects.equals(this.getId(), other.getId())) {
            return false;
        }
        return true;
    }
    
    
    public static List<Activity> find(String term) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<Activity>)hs.createQuery("select a from Activity as a where a.name like ?").setString(0, term + "%").list();
    }
    public static List<Activity> getByName(String name) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<Activity>)hs.createQuery("select a from Activity as a where a.name=:name").setString("name", name).list();
    }
    public static List<Activity> getByCodeName(String codeName) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<Activity>)hs.createQuery("select a from Activity as a where a.codeName=:codeName").setString("codeName", codeName).list();
    }
    public static List<Activity> getByName(String name, Subdepartment subdepartment) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<Activity>)hs.createQuery("select a from Activity as a inner join a.subdepartment as s where a.name=:name and s=:subdepartment").setString("name", name).setParameter("subdepartment", subdepartment).list();
    }
    public static List<Activity> getByCodeName(String codeName, Subdepartment subdepartment) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<Activity>)hs.createQuery("select a from Activity as a inner join a.subdepartment as s where a.codeName=:codeName and s=:subdepartment").setString("codeName", codeName).setParameter("subdepartment", subdepartment).list();
    }
}
