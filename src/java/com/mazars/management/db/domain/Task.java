/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.db.domain;
import java.util.Set;
import java.util.HashSet;
import com.mazars.management.db.util.HibernateUtil;
import org.hibernate.Session;
import java.util.List;
import java.util.Objects;
/**
 *
 * @author glazov
 */
public class Task {
    private Long id;
    private String name;
    private Boolean isActive;
    private Boolean isIdle;
    private Boolean isTraining;
    private String description;
    private TaskType taskType;
    private String color;
    private Set<TimeSpentItem> timeSpentItems = new HashSet<TimeSpentItem>();
    private Set<PlanningGroup> planningGroups = new HashSet<PlanningGroup>();

    public Task() {
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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    public Boolean getIsIdle() {
        return isIdle;
    }

    public void setIsIdle(Boolean isIdle) {
        this.isIdle = isIdle;
    }

    public TaskType getTaskType() {
        return taskType;
    }

    public void setTaskType(TaskType taskType) {
        this.taskType = taskType;
    }

    public Set<TimeSpentItem> getTimeSpentItems() {
        return timeSpentItems;
    }

    public void setTimeSpentItems(Set<TimeSpentItem> timeSpentItems) {
        this.timeSpentItems = timeSpentItems;
    }

    public Boolean getIsTraining() {
        return isTraining;
    }

    public void setIsTraining(Boolean isTraining) {
        this.isTraining = isTraining;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public Set<PlanningGroup> getPlanningGroups() {
        return planningGroups;
    }

    public void setPlanningGroups(Set<PlanningGroup> planningGroups) {
        this.planningGroups = planningGroups;
    }

    @Override
    public int hashCode() {
        int hash = 7;
        hash = 59 * hash + Objects.hashCode(this.id);
        return hash;
    }

    @Override
    public boolean equals(Object obj) {
        if (obj == null) {
            return false;
        }
        if (!(obj instanceof Task)) {
            return false;
        }
        final Task other = (Task) obj;
        if (!Objects.equals(this.getId(), other.getId())) {
            return false;
        }
        return true;
    }

    
    public static List<Task> getIdleTasks() {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<Task>)hs.createQuery("select t from Task as t where t.isIdle=true").list();
    }
    public static List<Task> getByName(String name, TaskType taskType) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<Task>)hs.createQuery("select t from Task as t inner join t.taskType as tt where t.name=:name and tt=:taskType").setString("name", name).setParameter("taskType", taskType).list();
    }
    public static List<Task> getByName(String name, Department department) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<Task>)hs.createQuery("select distinct t from Task as t inner join t.taskType as tt inner join tt.subdepartment as s inner join s.department as d where t.name=:name and d=:department").setString("name", name).setParameter("department", department).list();
    }
    public static List<Task> getByName(String name, Subdepartment subdepartment) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<Task>)hs.createQuery("select distinct t from Task as t inner join t.taskType as tt inner join tt.subdepartment as s where t.name=:name and s=:subdepartment").setString("name", name).setParameter("subdepartment", subdepartment).list();
    }
    public static List<Task> getCommonByName(String name) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<Task>)hs.createQuery("select distinct t from Task as t inner join t.taskType as tt where t.name=:name and tt.subdepartment is null").setString("name", name).list();
    }
    public static List<Task> getByName(String name) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<Task>)hs.createQuery("select distinct t from Task as t where t.name=:name").setString("name", name).list();
    }
}
