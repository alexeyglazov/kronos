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
public class Department {
    private Long id;
    private String name;
    private String codeName;
    private String description;
    private Boolean isActive;
    private Boolean isBusinessTrippable;
    private Office office;
    private Set<Subdepartment> subdepartments = new HashSet<Subdepartment>();

    public Department() {}

    public String getCodeName() {
        return codeName;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    public Boolean getIsBusinessTrippable() {
        return isBusinessTrippable;
    }

    public void setIsBusinessTrippable(Boolean isBusinessTrippable) {
        this.isBusinessTrippable = isBusinessTrippable;
    }

    public void setCodeName(String codeName) {
        this.codeName = codeName;
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

    public Set<Subdepartment> getSubdepartments() {
        return subdepartments;
    }

    public void setSubdepartments(Set<Subdepartment> subdepartments) {
        this.subdepartments = subdepartments;
    }

    public Office getOffice() {
        return office;
    }

    public void setOffice(Office office) {
        this.office = office;
    }

    @Override
    public int hashCode() {
        int hash = 7;
        hash = 83 * hash + Objects.hashCode(this.id);
        return hash;
    }

    @Override
    public boolean equals(Object obj) {
        if (obj == null) {
            return false;
        }
        if (!(obj instanceof Department)) {
            return false;
        }
        final Department other = (Department) obj;
        if (!Objects.equals(this.getId(), other.getId())) {
            return false;
        }
        return true;
    }

    public static List<Department> getAll() {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<Department>)hs.createQuery("from Department").list();
    }
    public static List<Department> getByName(String name) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<Department>)hs.createQuery("select d from Department as d where d.name=:name").setString("name", name).list();
    }
    public static List<Department> getByCodeName(String codeName) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<Department>)hs.createQuery("select d from Department as d where d.codeName=:codeName").setString("codeName", codeName).list();
    }
    public static List<Department> getByName(String name, Office office) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<Department>)hs.createQuery("select d from Department as d inner join d.office as o where d.name=:name and o=:office").setString("name", name).setParameter("office", office).list();
    }
    public static List<Department> getByCodeName(String codeName, Office office) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<Department>)hs.createQuery("select d from Department as d inner join d.office as o where d.codeName=:codeName and o=:office").setString("codeName", codeName).setParameter("office", office).list();
    }
    public List<Employee> getEmployees() {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<Employee>)hs.createQuery("select distinct e from Employee as e inner join e.position as p inner join p.subdepartment as s inner join s.department as d where d=:department").setParameter("department", this).list();
    }
    public List<Employee> getEmployeesWithCarreers(Calendar startDate, Calendar endDate) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        String query = "select distinct e from Department as d inner join d.subdepartments as s inner join s.positions as p inner join p.employeePositionHistoryItems as ephi inner join ephi.employee as e ";
        query += "where d=:department ";
        query += "and ephi.start<=:endDate and (ephi.end=null or ephi.end>=:startDate )";
        Query hq = hs.createQuery(query);
        hq.setParameter("startDate", startDate);
        hq.setParameter("endDate", endDate);
        hq.setParameter("department", this);
        return (List<Employee>)hq.list();
    }
}
