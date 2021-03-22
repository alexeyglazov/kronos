/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.db.domain;
import com.mazars.management.db.util.HibernateUtil;
import java.util.Calendar;
import org.hibernate.Session;
import java.util.List;
import java.util.Set;
import java.util.HashSet;
import java.util.Objects;
import org.hibernate.Query;

/**
 *
 * @author glazov
 */
public class Office {
    private Long id;
    private String name;
    private String codeName;
    private String description;
    private Country country;
    private Boolean isActive;

    private Set<Department> departments = new HashSet<Department>();
    public Office() {};
    public String getCodeName() {
        return codeName;
    }

    public void setCodeName(String codeName) {
        this.codeName = codeName;
    }
    public Set<Department> getDepartments() {
        return departments;
    }

    public void setDepartments(Set<Department> departments) {
        this.departments = departments;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
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

    public Country getCountry() {
        return country;
    }

    public void setCountry(Country country) {
        this.country = country;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    @Override
    public int hashCode() {
        int hash = 7;
        hash = 71 * hash + Objects.hashCode(this.id);
        return hash;
    }

    @Override
    public boolean equals(Object obj) {
        if (obj == null) {
            return false;
        }
        if (!(obj instanceof Office)) {
            return false;
        }
        final Office other = (Office) obj;
        if (!Objects.equals(this.getId(), other.getId())) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "Office{" + "id=" + id + ", name=" + name + ", codeName=" + codeName + ", description=" + description + ", isActive=" + isActive + '}';
    }





    public static List<Office> getAll() {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<Office>)hs.createQuery("from Office").list();
    }
    public static List<Office> find(String term) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<Office>)hs.createQuery("select o from Office as o where o.name like ?").setString(0, term + "%").list();
    }
    public static List<Office> getByName(String name) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<Office>)hs.createQuery("select o from Office as o where o.name=:name").setString("name", name).list();
    }
    public static List<Office> getByCodeName(String codeName) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<Office>)hs.createQuery("select o from Office as o where o.codeName=:codeName").setString("codeName", codeName).list();
    }
    public static List<Office> getByName(String name, Country country) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<Office>)hs.createQuery("select o from Office as o inner join o.country as c where o.name=:name and c=:country").setString("name", name).setParameter("country", country).list();
    }
    public static List<Office> getByCodeName(String codeName, Country country) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<Office>)hs.createQuery("select o from Office as o inner join o.country as c where o.codeName=:codeName and c=:country").setString("codeName", codeName).setParameter("country", country).list();
    }
    public List<Employee> getEmployees() {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<Employee>)hs.createQuery("select distinct e from Employee as e inner join e.position as p inner join p.subdepartment as s inner join s.department as d inner join d.office as o where o=:office").setParameter("office", this).list();
    }
    public List<Employee> getEmployeesWithCarreers(Calendar startDate, Calendar endDate) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        String query = "select distinct e from Office as o inner join o.departments as d inner join d.subdepartments as s inner join s.positions as p inner join p.employeePositionHistoryItems as ephi inner join ephi.employee as e ";
        query += "where o=:office ";
        query += "and ephi.start<=:endDate and (ephi.end=null or ephi.end>=:startDate )";
        Query hq = hs.createQuery(query);
        hq.setParameter("startDate", startDate);
        hq.setParameter("endDate", endDate);
        hq.setParameter("office", this);
        return (List<Employee>)hq.list();
    }
    public List<Subdepartment> getSubdepartments() {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<Subdepartment>)hs.createQuery("select distinct s from Subdepartment as s inner join s.department as d inner join d.office as o where o=:office").setParameter("office", this).list();
    }

}
