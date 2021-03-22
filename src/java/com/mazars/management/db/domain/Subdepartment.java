/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.db.domain;
import com.mazars.management.db.util.HibernateUtil;
import java.util.Calendar;
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
public class Subdepartment {   
    private Long id;
    private String name;
    private String codeName;
    private String description;
    private Department department;
    private Boolean isActive;
    private Set<SubdepartmentClientLink> subdepartmentClientLinks = new HashSet<SubdepartmentClientLink>();
    private Set<Activity> activities = new HashSet<Activity>();
    private Set<Position> positions = new HashSet<Position>();
    private Set<TaskType> taskTypes = new HashSet<TaskType>();
    private Set<PlanningType> planningTypes = new HashSet<PlanningType>();
    private Set<ProjectCode> projectCodes = new HashSet<ProjectCode>();
    private Set<RightsItem> rightsItems = new HashSet<RightsItem>();
    private Set<EmployeeSubdepartmentHistoryItem> employeeSubdepartmentHistoryItems = new HashSet<EmployeeSubdepartmentHistoryItem>();
    private Set<StandardSellingRateGroup> standardSellingRateGroups = new HashSet<StandardSellingRateGroup>();
    private Set<StandardCostGroup> standardCostGroups = new HashSet<StandardCostGroup>();
    private Set<ProjectCodeComment> projectCodeComments = new HashSet<ProjectCodeComment>();
    private Set<SubdepartmentConflict> checkingSubdepartmentSubdepartmentConflicts = new HashSet<SubdepartmentConflict>();
    private Set<SubdepartmentConflict> checkedSubdepartmentSubdepartmentConflicts = new HashSet<SubdepartmentConflict>();

    public Subdepartment() {
    }

    public Set<SubdepartmentConflict> getCheckingSubdepartmentSubdepartmentConflicts() {
        return checkingSubdepartmentSubdepartmentConflicts;
    }

    public void setCheckingSubdepartmentSubdepartmentConflicts(Set<SubdepartmentConflict> checkingSubdepartmentSubdepartmentConflicts) {
        this.checkingSubdepartmentSubdepartmentConflicts = checkingSubdepartmentSubdepartmentConflicts;
    }

    public Set<SubdepartmentConflict> getCheckedSubdepartmentSubdepartmentConflicts() {
        return checkedSubdepartmentSubdepartmentConflicts;
    }

    public void setCheckedSubdepartmentSubdepartmentConflicts(Set<SubdepartmentConflict> checkedSubdepartmentSubdepartmentConflicts) {
        this.checkedSubdepartmentSubdepartmentConflicts = checkedSubdepartmentSubdepartmentConflicts;
    }

    public Set<SubdepartmentClientLink> getSubdepartmentClientLinks() {
        return subdepartmentClientLinks;
    }

    public void setSubdepartmentClientLinks(Set<SubdepartmentClientLink> subdepartmentClientLinks) {
        this.subdepartmentClientLinks = subdepartmentClientLinks;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }
    public String getCodeName() {
        return codeName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setCodeName(String codeName) {
        this.codeName = codeName;
    }

    public Set<Activity> getActivities() {
        return activities;
    }

    public void setActivities(Set<Activity> activities) {
        this.activities = activities;
    }

    public Department getDepartment() {
        return department;
    }

    public void setDepartment(Department department) {
        this.department = department;
    }

    public Set<ProjectCodeComment> getProjectCodeComments() {
        return projectCodeComments;
    }

    public void setProjectCodeComments(Set<ProjectCodeComment> projectCodeComments) {
        this.projectCodeComments = projectCodeComments;
    }

    public Set<ProjectCode> getProjectCodes() {
        return projectCodes;
    }

    public void setProjectCodes(Set<ProjectCode> projectCodes) {
        this.projectCodes = projectCodes;
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

    public Set<Position> getPositions() {
        return positions;
    }

    public void setPositions(Set<Position> positions) {
        this.positions = positions;
    }

    public Set<TaskType> getTaskTypes() {
        return taskTypes;
    }

    public void setTaskTypes(Set<TaskType> taskTypes) {
        this.taskTypes = taskTypes;
    }

    public Set<PlanningType> getPlanningTypes() {
        return planningTypes;
    }

    public void setPlanningTypes(Set<PlanningType> planningTypes) {
        this.planningTypes = planningTypes;
    }

    public Set<RightsItem> getRightsItems() {
        return rightsItems;
    }

    public void setRightsItems(Set<RightsItem> rightsItems) {
        this.rightsItems = rightsItems;
    }

    public Set<EmployeeSubdepartmentHistoryItem> getEmployeeSubdepartmentHistoryItems() {
        return employeeSubdepartmentHistoryItems;
    }

    public void setEmployeeSubdepartmentHistoryItems(Set<EmployeeSubdepartmentHistoryItem> employeeSubdepartmentHistoryItems) {
        this.employeeSubdepartmentHistoryItems = employeeSubdepartmentHistoryItems;
    }

    public Set<StandardSellingRateGroup> getStandardSellingRateGroups() {
        return standardSellingRateGroups;
    }

    public void setStandardSellingRateGroups(Set<StandardSellingRateGroup> standardSellingRateGroups) {
        this.standardSellingRateGroups = standardSellingRateGroups;
    }

    public Set<StandardCostGroup> getStandardCostGroups() {
        return standardCostGroups;
    }

    public void setStandardCostGroups(Set<StandardCostGroup> standardCostGroups) {
        this.standardCostGroups = standardCostGroups;
    }

    public static List<Subdepartment> getAll() {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<Subdepartment>)hs.createQuery("from Subdepartment").list();
    }

    public List<Employee> getEmployees() {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<Employee>)hs.createQuery("select distinct e from Employee as e inner join e.position as p inner join p.subdepartment as s where s.id=?").setParameter(0, new Long(this.id)).list();
    }

    @Override
    public int hashCode() {
        int hash = 7;
        hash = 79 * hash + Objects.hashCode(this.id);
        return hash;
    }

    @Override
    public boolean equals(Object obj) {
        if (obj == null) {
            return false;
        }
        if (!(obj instanceof Subdepartment)) {
            return false;
        }
        final Subdepartment other = (Subdepartment) obj;
        if (!Objects.equals(this.getId(), other.getId())) {
            return false;
        }
        return true;
    }


    
    public List<Employee> getEmployeesWithCarreers(Calendar startDate, Calendar endDate) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        String query = "select distinct e from Subdepartment as s inner join s.positions as p inner join p.employeePositionHistoryItems as ephi inner join ephi.employee as e ";
        query += "where s=:subdepartment ";
        query += "and ephi.start<=:endDate and (ephi.end=null or ephi.end>=:startDate )";
        Query hq = hs.createQuery(query);
        hq.setParameter("startDate", startDate);
        hq.setParameter("endDate", endDate);
        hq.setParameter("subdepartment", this);
        return (List<Employee>)hq.list();
    }    
    public static List<Subdepartment> find(String term) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<Subdepartment>)hs.createQuery("select s from Subdepartment as s where s.name like ?").setString(0, term + "%").list();
    }
    public static List<Subdepartment> getByName(String name) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<Subdepartment>)hs.createQuery("select s from Subdepartment as s where s.name=:name").setString("name", name).list();
    }
    public static List<Subdepartment> getByCodeName(String codeName) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<Subdepartment>)hs.createQuery("select s from Subdepartment as s where s.codeName=:codeName").setString("codeName", codeName).list();
    }
    public static List<Subdepartment> getByName(String name, Department department) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<Subdepartment>)hs.createQuery("select s from Subdepartment as s inner join s.department as d where s.name=:name and d=:department").setString("name", name).setParameter("department", department).list();
    }
    public static List<Subdepartment> getByCodeName(String codeName, Department department) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<Subdepartment>)hs.createQuery("select s from Subdepartment as s inner join s.department as d where s.codeName=:codeName and d=:department").setString("codeName", codeName).setParameter("department", department).list();
    }
    public static List<Subdepartment> getByNameAndDepartmentName(String name, String departmentName) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<Subdepartment>)hs.createQuery("select s from Subdepartment as s inner join s.department as d where s.name=:name and d.name=:departmentName").setString("name", name).setParameter("departmentName", departmentName).list();
    }
    public static List<Subdepartment> getByNameAndDepartmentName(String name, String departmentName, Office office) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<Subdepartment>)hs.createQuery("select s from Subdepartment as s inner join s.department as d inner join d.office as o where s.name=:name and d.name=:departmentName and o=:office").setString("name", name).setParameter("departmentName", departmentName).setParameter("office", office).list();
    }
    public static List<Subdepartment> getAllowedSubdepartments(Office office, Department department, Subdepartment subdepartment, Employee employee, Module module) {
        List<Subdepartment> subdepartments = new LinkedList<Subdepartment>();
        if(employee.getProfile().equals(Employee.Profile.SUPER_USER)) {
            if(subdepartment != null && RightsItem.isAvailable(subdepartment, employee, module)) {
                subdepartments.add(subdepartment);
            } else if(department != null) {
                subdepartments = RightsItem.getSubdepartments(employee, module, department);
            } else if(office != null) {
                subdepartments = RightsItem.getSubdepartments(employee, module, office);
            } else {
                subdepartments.addAll(RightsItem.getSubdepartments(employee, module, employee.getCountry() ));
            }
        } else if(employee.getProfile().equals(Employee.Profile.COUNTRY_ADMINISTRATOR)) {
            if(subdepartment != null && subdepartment.getDepartment().getOffice().getCountry().getId().equals(employee.getCountry().getId())) {
                subdepartments.add(subdepartment);
            } else if(department != null && department.getOffice().getCountry().getId().equals(employee.getCountry().getId())) {
                subdepartments.addAll(department.getSubdepartments());
            } else if(office != null && office.getCountry().getId().equals(employee.getCountry().getId())) {
                subdepartments.addAll(office.getSubdepartments());
            } else {
                subdepartments.addAll(employee.getCountry().getSubdepartments());
            }
        }
        return subdepartments;
    }

}
