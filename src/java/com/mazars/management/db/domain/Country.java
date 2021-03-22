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
public class Country {
    private Long id;
    private String name;
    private String description;
    private Set<Office> offices = new HashSet<Office>();
    private Set<TaskType> taskTypes = new HashSet<TaskType>();
    private Set<ClosedMonth> closedMonths = new HashSet<ClosedMonth>();
    private Set<CountryCurrency> countryCurrencies = new HashSet<CountryCurrency>();
    private Set<Group> groups = new HashSet<Group>();
    private Set<Client> clients = new HashSet<Client>();

    public Country() {};

    public Set<Group> getGroups() {
        return groups;
    }

    public void setGroups(Set<Group> groups) {
        this.groups = groups;
    }

    public Set<TaskType> getTaskTypes() {
        return taskTypes;
    }

    public void setTaskTypes(Set<TaskType> taskTypes) {
        this.taskTypes = taskTypes;
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

    public Set<Office> getOffices() {
        return offices;
    }

    public void setOffices(Set<Office> offices) {
        this.offices = offices;
    }

    public Set<ClosedMonth> getClosedMonths() {
        return closedMonths;
    }

    public void setClosedMonths(Set<ClosedMonth> closedMonths) {
        this.closedMonths = closedMonths;
    }

    public Set<CountryCurrency> getCountryCurrencies() {
        return countryCurrencies;
    }

    public void setCountryCurrencies(Set<CountryCurrency> countryCurrencies) {
        this.countryCurrencies = countryCurrencies;
    }

    public Set<Client> getClients() {
        return clients;
    }

    public void setClients(Set<Client> clients) {
        this.clients = clients;
    }

    public static List<Country> getAll() {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<Country>)hs.createQuery("from Country").list();
    }
    public static List<Country> getByName(String name) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<Country>)hs.createQuery("select c from Country as c where c.name=:name").setString("name", name).list();
    }
    public List<Employee> getEmployees() {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<Employee>)hs.createQuery("select distinct e from Employee as e inner join e.position as p inner join p.subdepartment as s inner join s.department as d inner join d.office as o inner join o.country as c where c=:country").setParameter("country", this).list();
    }
    public List<Employee> getEmployeesByExternalIds(List<String> externalIds) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        Query hq = hs.createQuery("select distinct e from Employee as e inner join e.position as p inner join p.subdepartment as s inner join s.department as d inner join d.office as o inner join o.country as c where c=:country and e.externalId in (:externalIds)");
        hq.setParameter("country", this);
        hq.setParameterList("externalIds", externalIds);
        return (List<Employee>)hq.list();
    }
    public List<Subdepartment> getSubdepartments() {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<Subdepartment>)hs.createQuery("select distinct s from Subdepartment as s inner join s.department as d inner join d.office as o inner join o.country as c where c=:country").setParameter("country", this).list();
    }
    public List<Department> getDepartments() {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<Department>)hs.createQuery("select distinct d from Department as d inner join d.office as o inner join o.country as c where c=:country").setParameter("country", this).list();
    }

    public List<Employee> getEmployeesWithCarreers(Calendar startDate, Calendar endDate) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        String query = "select distinct e from Country as c inner join c.offices as o inner join o.departments as d inner join d.subdepartments as s inner join s.positions as p inner join p.employeePositionHistoryItems as ephi inner join ephi.employee as e ";
        query += "where c=:country ";
        query += "and ephi.start<=:endDate and (ephi.end=null or ephi.end>=:startDate )";
        Query hq = hs.createQuery(query);
        hq.setParameter("startDate", startDate);
        hq.setParameter("endDate", endDate);
        hq.setParameter("country", this);
        return (List<Employee>)hq.list();
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
        if (!(obj instanceof Country)) {
            return false;
        }
        final Country other = (Country) obj;
        if (!Objects.equals(this.id, other.id)) {
            return false;
        }
        return true;
    }

}
