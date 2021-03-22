/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.db.domain;

import com.mazars.management.db.util.HibernateUtil;
import java.util.Calendar;
import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import org.hibernate.Query;
import org.hibernate.Session;


/**
 *
 * @author glazov
 */
public class Position {
    private Long id;
    private String name;
    private String localLanguageName;
    private String visitCardName;
    private String localLanguageVisitCardName;
    private Integer sortValue;
    private Subdepartment subdepartment;
    private Boolean isActive;
    private Set<EmployeePositionHistoryItem> employeePositionHistoryItems = new HashSet<EmployeePositionHistoryItem>();
    private Set<AnnualPaidLeave> annualPaidLeaves = new HashSet<AnnualPaidLeave>();
    private Set<Employee> employees = new HashSet<Employee>();
    private StandardPosition standardPosition;
    Set<StandardSellingRate> standardSellingRates = new HashSet<StandardSellingRate>();
    private Set<PositionQuotation> positionQuotations = new HashSet<PositionQuotation>();
    Set<StandardCost> standardCosts = new HashSet<StandardCost>();
    public Position() {}

    public Integer getSortValue() {
        return sortValue;
    }

    public void setSortValue(Integer sortValue) {
        this.sortValue = sortValue;
    }

    public Subdepartment getSubdepartment() {
        return subdepartment;
    }

    public void setSubdepartment(Subdepartment subdepartment) {
        this.subdepartment = subdepartment;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
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

    public Set<EmployeePositionHistoryItem> getEmployeePositionHistoryItems() {
        return employeePositionHistoryItems;
    }

    public void setEmployeePositionHistoryItems(Set<EmployeePositionHistoryItem> employeePositionHistoryItems) {
        this.employeePositionHistoryItems = employeePositionHistoryItems;
    }

    public StandardPosition getStandardPosition() {
        return standardPosition;
    }

    public void setStandardPosition(StandardPosition standardPosition) {
        this.standardPosition = standardPosition;
    }

    public Set<StandardSellingRate> getStandardSellingRates() {
        return standardSellingRates;
    }

    public void setStandardSellingRates(Set<StandardSellingRate> standardSellingRates) {
        this.standardSellingRates = standardSellingRates;
    }

    public Set<StandardCost> getStandardCosts() {
        return standardCosts;
    }

    public void setStandardCosts(Set<StandardCost> standardCosts) {
        this.standardCosts = standardCosts;
    }

    public Set<Employee> getEmployees() {
        return employees;
    }

    public void setEmployees(Set<Employee> employees) {
        this.employees = employees;
    }

    public Set<PositionQuotation> getPositionQuotations() {
        return positionQuotations;
    }

    public void setPositionQuotations(Set<PositionQuotation> positionQuotations) {
        this.positionQuotations = positionQuotations;
    }

    public Set<AnnualPaidLeave> getAnnualPaidLeaves() {
        return annualPaidLeaves;
    }

    public void setAnnualPaidLeaves(Set<AnnualPaidLeave> annualPaidLeaves) {
        this.annualPaidLeaves = annualPaidLeaves;
    }

    public String getLocalLanguageName() {
        return localLanguageName;
    }

    public void setLocalLanguageName(String localLanguageName) {
        this.localLanguageName = localLanguageName;
    }

    public String getVisitCardName() {
        return visitCardName;
    }

    public void setVisitCardName(String visitCardName) {
        this.visitCardName = visitCardName;
    }

    public String getLocalLanguageVisitCardName() {
        return localLanguageVisitCardName;
    }

    public void setLocalLanguageVisitCardName(String localLanguageVisitCardName) {
        this.localLanguageVisitCardName = localLanguageVisitCardName;
    }

    @Override
    public int hashCode() {
        int hash = 5;
        hash = 11 * hash + Objects.hashCode(this.id);
        return hash;
    }

    @Override
    public boolean equals(Object obj) {
        if (obj == null) {
            return false;
        }
        if (!(obj instanceof Position)) {
            return false;
        }
        final Position other = (Position) obj;
        if (!Objects.equals(this.id, other.id)) {
            return false;
        }
        return true;
    }
    
    public List<Employee> getEmployeesWithCarreers(Calendar startDate, Calendar endDate) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        String query = "select distinct e from Position as p inner join p.employeePositionHistoryItems as ephi inner join ephi.employee as e ";
        query += "where p=:position ";
        query += "and ephi.start<=:endDate and (ephi.end=null or ephi.end>=:startDate )";
        Query hq = hs.createQuery(query);
        hq.setParameter("startDate", startDate);
        hq.setParameter("endDate", endDate);
        hq.setParameter("position", this);
        return (List<Employee>)hq.list();
    } 
    public static List<Position> getByName(String name, Subdepartment subdepartment) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<Position>)hs.createQuery("select p from Position as p inner join p.subdepartment as s where p.name=:name and s=:subdepartment").setString("name", name).setParameter("subdepartment", subdepartment).list();
    }
}
