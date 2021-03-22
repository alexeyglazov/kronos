/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.db.domain;
import com.mazars.management.db.util.HibernateUtil;
import java.util.Date;
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
public class Employee {
    public enum Profile {
        NON_USER,
        USER,
        SUPER_USER,
        COUNTRY_ADMINISTRATOR
    }
    private Long id;
    private String userName;
    private String hashedPassword;
    private String salt;
    private Boolean passwordToBeChanged;
    private String firstName;
    private String lastName;
    private String firstNameLocalLanguage;
    private String lastNameLocalLanguage;
    private String maidenName;
    private String email;
    private String externalId;
    private String secretKey;
    private Date secretKeyDate;

    private Position position;
    private Set<ProjectCode> createdProjectCodes = new HashSet<ProjectCode>();
    private Set<ProjectCode> closedProjectCodes = new HashSet<ProjectCode>();
    private Set<ProjectCode> inChargeProjectCodes = new HashSet<ProjectCode>(); // this empoyee is a Person In Charge for thees Codes
    private Set<ProjectCode> inChargePartnerProjectCodes = new HashSet<ProjectCode>(); // this empoyee is a Person In Charge for thees Codes
    private Set<ProjectCodeApprovement> primaryProjectCodeApprovements = new HashSet<ProjectCodeApprovement>();
    private Set<ProjectCodeApprovement> secondaryProjectCodeApprovements = new HashSet<ProjectCodeApprovement>();
    private Employee.Profile profile;
    private Boolean isAdministrator;
    private Boolean isFuture;
    private Boolean isActive;

    private Set<EmployeePositionHistoryItem> employeePositionHistoryItems = new HashSet<EmployeePositionHistoryItem>();
    private Set<EmployeeSubdepartmentHistoryItem> employeeSubdepartmentHistoryItems = new HashSet<EmployeeSubdepartmentHistoryItem>();
    private Set<EmployeeProjectCodeAccessItem> employeeProjectCodeAccessItems = new HashSet<EmployeeProjectCodeAccessItem>();
    private Set<TimeSpentItem> timeSpentItems = new HashSet<TimeSpentItem>();
    private Set<BusinessTripItem> businessTripItems = new HashSet<BusinessTripItem>();
    
    private Set<RightsItem> rightsItems = new HashSet<RightsItem>();

    private Set<LeavesItem> leavesItems = new HashSet<LeavesItem>();
    private Set<Salary> salaries = new HashSet<Salary>();

    private Set<MailoutRecipient> mailoutRecipients = new HashSet<MailoutRecipient>();
    private Set<MailoutHistoryItem> mailoutHistoryItems = new HashSet<MailoutHistoryItem>();
    
    private Set<PlanningItem> planningItems = new HashSet<PlanningItem>();
    private Set<PlanningGroup> inChargePlanningGroups = new HashSet<PlanningGroup>();
    private Set<EmployeeContactLink> employeeContactLinks = new HashSet<EmployeeContactLink>();

    private Set<ClientHistoryItem> clientHistoryItems = new HashSet<ClientHistoryItem>();
    private Set<ContactHistoryItem> contactHistoryItems = new HashSet<ContactHistoryItem>();

    private NaturalPerson naturalPerson;

    public NaturalPerson getNaturalPerson() {
        return naturalPerson;
    }

    public void setNaturalPerson(NaturalPerson naturalPerson) {
        this.naturalPerson = naturalPerson;
    }

    public Set<ClientHistoryItem> getClientHistoryItems() {
        return clientHistoryItems;
    }

    public void setClientHistoryItems(Set<ClientHistoryItem> clientHistoryItems) {
        this.clientHistoryItems = clientHistoryItems;
    }

    public Set<EmployeeContactLink> getEmployeeContactLinks() {
        return employeeContactLinks;
    }

    public void setEmployeeContactLinks(Set<EmployeeContactLink> employeeContactLinks) {
        this.employeeContactLinks = employeeContactLinks;
    }

    public Set<ContactHistoryItem> getContactHistoryItems() {
        return contactHistoryItems;
    }

    public void setContactHistoryItems(Set<ContactHistoryItem> contactHistoryItems) {
        this.contactHistoryItems = contactHistoryItems;
    }

    public Set<ProjectCode> getClosedProjectCodes() {
        return closedProjectCodes;
    }

    public void setClosedProjectCodes(Set<ProjectCode> closedProjectCodes) {
        this.closedProjectCodes = closedProjectCodes;
    }

    public Set<ProjectCode> getCreatedProjectCodes() {
        return createdProjectCodes;
    }

    public void setCreatedProjectCodes(Set<ProjectCode> createdProjectCodes) {
        this.createdProjectCodes = createdProjectCodes;
    }

    public Set<ProjectCode> getInChargeProjectCodes() {
        return inChargeProjectCodes;
    }

    public void setInChargeProjectCodes(Set<ProjectCode> inChargeProjectCodes) {
        this.inChargeProjectCodes = inChargeProjectCodes;
    }

    public Set<ProjectCode> getInChargePartnerProjectCodes() {
        return inChargePartnerProjectCodes;
    }

    public void setInChargePartnerProjectCodes(Set<ProjectCode> inChargePartnerProjectCodes) {
        this.inChargePartnerProjectCodes = inChargePartnerProjectCodes;
    }

    public Set<ProjectCodeApprovement> getPrimaryProjectCodeApprovements() {
        return primaryProjectCodeApprovements;
    }

    public void setPrimaryProjectCodeApprovements(Set<ProjectCodeApprovement> primaryProjectCodeApprovements) {
        this.primaryProjectCodeApprovements = primaryProjectCodeApprovements;
    }

    public Set<ProjectCodeApprovement> getSecondaryProjectCodeApprovements() {
        return secondaryProjectCodeApprovements;
    }

    public void setSecondaryProjectCodeApprovements(Set<ProjectCodeApprovement> secondaryProjectCodeApprovements) {
        this.secondaryProjectCodeApprovements = secondaryProjectCodeApprovements;
    }

    public Set<TimeSpentItem> getTimeSpentItems() {
        return timeSpentItems;
    }

    public void setTimeSpentItems(Set<TimeSpentItem> timeSpentItems) {
        this.timeSpentItems = timeSpentItems;
    }

    public Set<BusinessTripItem> getBusinessTripItems() {
        return businessTripItems;
    }

    public void setBusinessTripItems(Set<BusinessTripItem> businessTripItems) {
        this.businessTripItems = businessTripItems;
    }

    public String getExternalId() {
        return externalId;
    }

    public void setExternalId(String externalId) {
        this.externalId = externalId;
    }

    public Boolean getIsFuture() {
        return isFuture;
    }

    public void setIsFuture(Boolean isFuture) {
        this.isFuture = isFuture;
    }

    public Employee() {}

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Boolean getIsAdministrator() {
        return isAdministrator;
    }

    public void setIsAdministrator(Boolean isAdministrator) {
        this.isAdministrator = isAdministrator;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getFirstNameLocalLanguage() {
        return firstNameLocalLanguage;
    }

    public void setFirstNameLocalLanguage(String firstNameLocalLanguage) {
        this.firstNameLocalLanguage = firstNameLocalLanguage;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    public Profile getProfile() {
        return profile;
    }

    public void setProfile(Profile profile) {
        this.profile = profile;
    }

   
    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getLastNameLocalLanguage() {
        return lastNameLocalLanguage;
    }

    public void setLastNameLocalLanguage(String lastNameLocalLanguage) {
        this.lastNameLocalLanguage = lastNameLocalLanguage;
    }

    public Set<MailoutRecipient> getMailoutRecipients() {
        return mailoutRecipients;
    }

    public void setMailoutRecipients(Set<MailoutRecipient> mailoutRecipients) {
        this.mailoutRecipients = mailoutRecipients;
    }

    public Set<MailoutHistoryItem> getMailoutHistoryItems() {
        return mailoutHistoryItems;
    }

    public void setMailoutHistoryItems(Set<MailoutHistoryItem> mailoutHistoryItems) {
        this.mailoutHistoryItems = mailoutHistoryItems;
    }

    public String getMaidenName() {
        return maidenName;
    }

    public void setMaidenName(String maidenName) {
        this.maidenName = maidenName;
    }

    public String getHashedPassword() {
        return hashedPassword;
    }

    public void setHashedPassword(String hashedPassword) {
        this.hashedPassword = hashedPassword;
    }

    public String getSalt() {
        return salt;
    }

    public void setSalt(String salt) {
        this.salt = salt;
    }

    public Set<EmployeeSubdepartmentHistoryItem> getEmployeeSubdepartmentHistoryItems() {
        return employeeSubdepartmentHistoryItems;
    }

    public void setEmployeeSubdepartmentHistoryItems(Set<EmployeeSubdepartmentHistoryItem> employeeSubdepartmentHistoryItems) {
        this.employeeSubdepartmentHistoryItems = employeeSubdepartmentHistoryItems;
    }

    public Set<EmployeeProjectCodeAccessItem> getEmployeeProjectCodeAccessItems() {
        return employeeProjectCodeAccessItems;
    }

    public void setEmployeeProjectCodeAccessItems(Set<EmployeeProjectCodeAccessItem> employeeProjectCodeAccessItems) {
        this.employeeProjectCodeAccessItems = employeeProjectCodeAccessItems;
    }

    public Set<EmployeePositionHistoryItem> getEmployeePositionHistoryItems() {
        return employeePositionHistoryItems;
    }

    public void setEmployeePositionHistoryItems(Set<EmployeePositionHistoryItem> employeePositionHistoryItems) {
        this.employeePositionHistoryItems = employeePositionHistoryItems;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public Set<RightsItem> getRightsItems() {
        return rightsItems;
    }

    public void setRightsItems(Set<RightsItem> rightsItems) {
        this.rightsItems = rightsItems;
    }

    public Set<LeavesItem> getLeavesItems() {
        return leavesItems;
    }

    public void setLeavesItems(Set<LeavesItem> leavesItems) {
        this.leavesItems = leavesItems;
    }

    public Set<Salary> getSalaries() {
        return salaries;
    }

    public void setSalaries(Set<Salary> salaries) {
        this.salaries = salaries;
    }

    public Position getPosition() {
        return position;
    }

    public void setPosition(Position position) {
        this.position = position;
    }

    public Boolean getPasswordToBeChanged() {
        return passwordToBeChanged;
    }

    public void setPasswordToBeChanged(Boolean passwordToBeChanged) {
        this.passwordToBeChanged = passwordToBeChanged;
    }

    public String getSecretKey() {
        return secretKey;
    }

    public void setSecretKey(String secretKey) {
        this.secretKey = secretKey;
    }

    public Date getSecretKeyDate() {
        return secretKeyDate;
    }

    public void setSecretKeyDate(Date secretKeyDate) {
        this.secretKeyDate = secretKeyDate;
    }

    public Set<PlanningItem> getPlanningItems() {
        return planningItems;
    }

    public void setPlanningItems(Set<PlanningItem> planningItems) {
        this.planningItems = planningItems;
    }

    public Set<PlanningGroup> getInChargePlanningGroups() {
        return inChargePlanningGroups;
    }

    public void setInChargePlanningGroups(Set<PlanningGroup> inChargePlanningGroups) {
        this.inChargePlanningGroups = inChargePlanningGroups;
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
        if (!(obj instanceof Employee)) {
            return false;
        }
        final Employee other = (Employee) obj;
        if (!Objects.equals(this.id, other.id)) {
            return false;
        }
        return true;
    }

    //public static Employee getByUserNameAndPassword(String userName, String password) {
    //    Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
    //    Employee employee = (Employee)hs.createQuery("from Employee e where e.userName = ? and e.password = ?").setString(0, userName).setString(1, password).uniqueResult();
    //    return employee;
    //}
    public static List<Employee> getByFirstNameAndLastName(String firstName, String lastName) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<Employee>)hs.createQuery("from Employee as e where e.firstName = :firstName and e.lastName = :lastName").setString("firstName", firstName).setString("lastName", lastName).list();
    }
    public static Employee getByUserName(String userName) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (Employee)hs.createQuery("select e from Employee as e where e.userName=:userName").setString("userName", userName).uniqueResult();
    }
    public static Employee getByExternalId(String externalId) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (Employee)hs.createQuery("select e from Employee as e where e.externalId=:externalId").setString("externalId", externalId).uniqueResult();
    }
    public static List<Employee> getByExternalIds(List<String> externalIds) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<Employee>)hs.createQuery("select e from Employee as e where e.externalId in (:externalIds)").setParameterList("externalIds", externalIds).list();
    }
    public static List<Employee> getBySubdepartments(List<Subdepartment> subdepartments) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        String query =  "select e from Employee as e inner join e.position as p inner join p.subdepartment as s where s in (:subdepartments)";
        Query hq = hs.createQuery(query);
        hq.setParameterList("subdepartments", subdepartments);
        return (List<Employee>)hq.list();
    }
    public static List<Employee> getByEmail(String email) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<Employee>)hs.createQuery("select e from Employee as e where e.email=:email").setString("email", email).list();
    }
    public static List<Employee> getByEmail(String email, Boolean isActive) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<Employee>)hs.createQuery("select e from Employee as e where e.email=:email and e.isActive=:isActive").setString("email", email).setParameter("isActive", isActive).list();
    }
    public static List<Employee> getByProfile(Profile profile) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<Employee>)hs.createQuery("select e from Employee as e where e.profile=:profile").setParameter("profile", profile).list();
    }
    public static List<Employee> getByCountryAndProfile(Country country, Profile profile) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<Employee>)hs.createQuery("select e from Employee as e inner join e.position as p inner join p.subdepartment as s inner join s.department as d inner join d.office as o inner join o.country as c where e.profile=:profile and c=:country").setParameter("profile", profile).setParameter("country", country).list();
    }
    public static List<Employee> getAll() {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<Employee>)hs.createQuery("select e from Employee as e").list();
    }
    public Set<Group> getCurrentGroupsForOpenProjectCodes() {
        Set<Group> groups = new HashSet<Group>();
        groups.addAll(ProjectCode.getGroupsForOpenProjectCodes(this));
        groups.addAll(EmployeeSubdepartmentHistoryItem.getCurrentGroupsForOpenProjectCodes(this));
        return groups;
    }
    public Set<Client> getCurrentClientsForOpenProjectCodes() {
        Set<Client> clients = new HashSet<Client>();
        clients.addAll(ProjectCode.getClientsForOpenProjectCodes(this));
        clients.addAll(EmployeeSubdepartmentHistoryItem.getCurrentClientsForOpenProjectCodes(this));
        return clients;
    }
    public Set<Client> getCurrentClientsForOpenProjectCodes(Group group) {
        Set<Client> clients = new HashSet<Client>();
        clients.addAll(ProjectCode.getClientsForOpenProjectCodes(this, group));
        clients.addAll(EmployeeSubdepartmentHistoryItem.getCurrentClientsForOpenProjectCodes(this, group));
        return clients;
    }
    public Set<ProjectCode> getCurrentOpenProjectCodes() {
        Set<ProjectCode> projectCodes = new HashSet<ProjectCode>();
        projectCodes.addAll(ProjectCode.getOpenProjectCodes(this));
        projectCodes.addAll(EmployeeSubdepartmentHistoryItem.getCurrentOpenProjectCodes(this));
        return projectCodes;
    }
    public Set<ProjectCode> getCurrentOpenProjectCodes(Client client) {
        Set<ProjectCode> projectCodes = new HashSet<ProjectCode>();
        projectCodes.addAll(ProjectCode.getOpenProjectCodes(this, client));
        projectCodes.addAll(EmployeeSubdepartmentHistoryItem.getCurrentOpenProjectCodes(this, client));
        return projectCodes;
    }
    public Country getCountry() {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (Country)hs.createQuery("select c from Employee as e inner join e.position as p inner join p.subdepartment as s inner join s.department as d inner join d.office as o inner join o.country as c where e=:employee").setParameter("employee", this).uniqueResult();
    }
    public Subdepartment getSubdepartment() {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (Subdepartment)hs.createQuery("select s from Employee as e inner join e.position as p inner join p.subdepartment as s where e=:employee").setParameter("employee", this).uniqueResult();
    }
    public Department getDepartment() {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (Department)hs.createQuery("select d from Employee as e inner join e.position as p inner join p.subdepartment as s inner join s.department as d where e=:employee").setParameter("employee", this).uniqueResult();
    }
    public Office getOffice() {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (Office)hs.createQuery("select o from Employee as e inner join e.position as p inner join p.subdepartment as s inner join s.department as d inner join d.office as o where e=:employee").setParameter("employee", this).uniqueResult();
    }
    
    public String getFullName() {
        if(this.firstName == null && this.lastName == null) {
            return null;
        }
        if(this.firstName == null) {
            return this.lastName;
        }  
        if(this.lastName == null) {
            return this.firstName;
        } 
        return this.firstName + " " + this.lastName;
    }
    public String getFullNameLocalLanguage() {
        return getFullNameLocalLanguage(Boolean.FALSE);
    }
    public String getFullNameLocalLanguage(Boolean lastNameAtFirst) {
        String fullName = null;
        if(this.firstNameLocalLanguage == null && this.lastNameLocalLanguage == null) {
            fullName = null;
        } else if(this.firstNameLocalLanguage == null) {
            fullName = this.lastNameLocalLanguage;
        } else if(this.lastNameLocalLanguage == null) {
            fullName = this.firstNameLocalLanguage;
        } else {
            if(Boolean.TRUE.equals(lastNameAtFirst)) {
                fullName = this.lastNameLocalLanguage + " " + this.firstNameLocalLanguage;
            } else {
                fullName = this.firstNameLocalLanguage + " " + this.lastNameLocalLanguage;
            }
        }            
        return fullName;
    }
    public static Long getTotalCount() {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (Long)hs.createQuery("select count(*) from Employee").uniqueResult();
    }
    public static List<Employee> getByIds(List<Long> ids) {
        if(ids.isEmpty()) {
            return new LinkedList<Employee>();
        }
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        String query = "select e from Employee as e where e.id in (:ids) ";
        Query hq = hs.createQuery(query);
        return (List<Employee>)hq.setParameterList("ids", ids).list();
    }
    public static List<Employee> getEmployees(List<Subdepartment> subdepartments, List<StandardPosition> standardPositions) {
        if(subdepartments.isEmpty() || standardPositions.isEmpty()) {
            return new LinkedList<Employee>();
        }
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        String query = "select e from Employee as e ";
        query += "inner join e.position as p ";
        query += "inner join p.standardPosition as sp ";
        query += "inner join p.subdepartment as s ";
        query += "where ";
        query += "sp in (:standardPositions) ";
        query += "and s in (:subdepartments) ";
        Query hq = hs.createQuery(query);
        hq.setParameterList("standardPositions", standardPositions);
        hq.setParameterList("subdepartments", subdepartments);
        List<Employee> employees = employees = (List<Employee>)hq.list();
        return employees;
    }

}
