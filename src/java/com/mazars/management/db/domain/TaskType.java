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
import java.util.Objects;
/**
 *
 * @author glazov
 */
public class TaskType {
    private Long id;
    private String name;
    private Boolean isActive;
    private Boolean isInternal;
    private Set<Task> tasks = new HashSet<Task>();
    private Subdepartment subdepartment;

    public TaskType() {
    }

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

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    public Subdepartment getSubdepartment() {
        return subdepartment;
    }

    public void setSubdepartment(Subdepartment subdepartment) {
        this.subdepartment = subdepartment;
    }

    public Boolean getIsInternal() {
        return isInternal;
    }

    public void setIsInternal(Boolean isInternal) {
        this.isInternal = isInternal;
    }

    public Set<Task> getTasks() {
        return tasks;
    }

    public void setTasks(Set<Task> tasks) {
        this.tasks = tasks;
    }

    @Override
    public int hashCode() {
        int hash = 3;
        hash = 97 * hash + Objects.hashCode(this.id);
        return hash;
    }

    @Override
    public boolean equals(Object obj) {
        if (obj == null) {
            return false;
        }
        if (!(obj instanceof TaskType)) {
            return false;
        }
        final TaskType other = (TaskType) obj;
        if (!Objects.equals(this.getId(), other.getId())) {
            return false;
        }
        return true;
    }


    public static List<TaskType> getCommonTaskTypes() {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<TaskType>)hs.createQuery("select tt from TaskType as tt where tt.subdepartment is null").list();
    }
    public static List<Task> getCommonInternalTasks() {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<Task>)hs.createQuery("select t from Task as t inner join t.taskType as tt where tt.subdepartment is null and tt.isInternal=true").list();
    }
    public static List<TaskType> getAllForOpenProjectCodes(Subdepartment subdepartment) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<TaskType>)hs.createQuery("select distinct tt from TaskType as tt inner join tt.subdepartment as s inner join s.projectCodes as pc where s=:subdepartment and pc.isClosed=false").setParameter("subdepartment", subdepartment).list();
    }
    public static List<TaskType> getByName(String name, Subdepartment subdepartment) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        if(subdepartment == null) {
            return (List<TaskType>)hs.createQuery("select tt from TaskType as tt where tt.name=:name and tt.subdepartment=null").setString("name", name).list();
        } else {
            return (List<TaskType>)hs.createQuery("select tt from TaskType as tt inner join tt.subdepartment as s where tt.name=:name and s=:subdepartment").setString("name", name).setParameter("subdepartment", subdepartment).list();
        }
    }
}
