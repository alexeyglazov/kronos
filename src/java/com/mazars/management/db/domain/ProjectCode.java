/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.db.domain;
import com.mazars.management.db.util.HibernateUtil;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import org.hibernate.Query;
import org.hibernate.Session;
/**
 *
 * @author glazov
 */
public class ProjectCode {
    public enum PeriodType {
        QUARTER,
        MONTH,
        DATE,
        COUNTER
    }
    public enum PeriodQuarter {
        FIRST,
        SECOND,
        THIRD,
        FOURTH
    }
    public enum PeriodMonth {
        JANUARY,
        FEBRUARY,
        MARCH,
        APRIL,
        MAY,
        JUNE,
        JULY,
        AUGUST,
        SEPTEMBER,
        OCTOBER,
        NOVEMBER,
        DECEMBER
    }
    public enum PeriodDate {
        D3101,
        D2802,
        D3103,
        D3004,
        D3105,
        D3006,
        D3107,
        D3108,
        D3009,
        D3110,
        D3011,
        D3112
    }
    private Long id;
    private Client client;
    private Subdepartment subdepartment;
    private Activity activity;

    private PeriodType periodType;
    private PeriodQuarter periodQuarter;
    private PeriodMonth periodMonth;
    private PeriodDate periodDate;
    private Integer periodCounter;

    private String code;

    private Integer year;
    private String description;
    private String comment;
    private Date createdAt;
    private Employee createdBy;
    private Boolean isClosed;
    private Date modifiedAt;
    private Date closedAt;
    private Employee closedBy;
    private Calendar startDate;
    private Calendar endDate;
    private Boolean isFuture;
    private Boolean isDead;
    private Boolean isHidden;
    private ProjectCodeConflict.Status conflictStatus;
    
    private Set<ProjectCodeApprovement> projectCodeApprovements = new HashSet<ProjectCodeApprovement>();
    private Set<TimeSpentItem> timeSpentItems = new HashSet<TimeSpentItem>();
    private Set<BusinessTripItem> businessTripItems = new HashSet<BusinessTripItem>();
    private FeesItem feesItem;
    private Agreement agreement;
    private OutOfPocketItem outOfPocketItem;
    private Set<InvoiceRequestPacket> invoiceRequestPackets = new HashSet<InvoiceRequestPacket>();
    private OutOfPocketRequest outOfPocketRequest;
    // For example 2010 must be displayed as 2010-2011
    private Integer financialYear;
    private Employee inChargePerson; // Person in charge
    private Employee inChargePartner; // Partner in charge
    private Set<PlanningGroupToProjectCodeLink> planningGroupToProjectCodeLinks = new HashSet<PlanningGroupToProjectCodeLink>();
    private Set<EmployeeProjectCodeAccessItem> employeeProjectCodeAccessItems = new HashSet<EmployeeProjectCodeAccessItem>();
    private Set<ProjectCodeConflict> projectCodeConflicts = new HashSet<ProjectCodeConflict>();

    public ProjectCodeConflict.Status getConflictStatus() {
        return conflictStatus;
    }

    public void setConflictStatus(ProjectCodeConflict.Status conflictStatus) {
        this.conflictStatus = conflictStatus;
    }

    public Employee getInChargePerson() {
        return inChargePerson;
    }

    public void setInChargePerson(Employee inChargePerson) {
        this.inChargePerson = inChargePerson;
    }

    public Employee getInChargePartner() {
        return inChargePartner;
    }

    public void setInChargePartner(Employee inChargePartner) {
        this.inChargePartner = inChargePartner;
    }

    public Set<ProjectCodeConflict> getProjectCodeConflicts() {
        return projectCodeConflicts;
    }

    public void setProjectCodeConflicts(Set<ProjectCodeConflict> projectCodeConflicts) {
        this.projectCodeConflicts = projectCodeConflicts;
    }

    public Integer getFinancialYear() {
        return financialYear;
    }

    public void setFinancialYear(Integer financialYear) {
        this.financialYear = financialYear;
    }

    public Integer getYear() {
        return year;
    }

    public void setYear(Integer year) {
        this.year = year;
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

    public Boolean getIsDead() {
        return isDead;
    }

    public void setIsDead(Boolean isDead) {
        this.isDead = isDead;
    }

    public Activity getActivity() {
        return activity;
    }

    public void setActivity(Activity activity) {
        this.activity = activity;
    }

    public Client getClient() {
        return client;
    }

    public void setClient(Client client) {
        this.client = client;
    }

    public Date getClosedAt() {
        return closedAt;
    }

    public void setClosedAt(Date closedAt) {
        this.closedAt = closedAt;
    }

    public Employee getClosedBy() {
        return closedBy;
    }

    public void setClosedBy(Employee closedBy) {
        this.closedBy = closedBy;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public Employee getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(Employee createdBy) {
        this.createdBy = createdBy;
    }

    public Date getModifiedAt() {
        return modifiedAt;
    }

    public void setModifiedAt(Date modifiedAt) {
        this.modifiedAt = modifiedAt;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Calendar getEndDate() {
        return endDate;
    }

    public void setEndDate(Calendar endDate) {
        this.endDate = endDate;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Boolean getIsClosed() {
        return isClosed;
    }

    public void setIsClosed(Boolean isClosed) {
        this.isClosed = isClosed;
    }

    public Boolean getIsFuture() {
        return isFuture;
    }

    public void setIsFuture(Boolean isFutureProject) {
        this.isFuture = isFutureProject;
    }

    public Boolean getIsHidden() {
        return isHidden;
    }

    public void setIsHidden(Boolean isHidden) {
        this.isHidden = isHidden;
    }

    public Calendar getStartDate() {
        return startDate;
    }

    public void setStartDate(Calendar startDate) {
        this.startDate = startDate;
    }

    public Subdepartment getSubdepartment() {
        return subdepartment;
    }

    public void setSubdepartment(Subdepartment subdepartment) {
        this.subdepartment = subdepartment;
    }

    public Set<ProjectCodeApprovement> getProjectCodeApprovements() {
        return projectCodeApprovements;
    }

    public void setProjectCodeApprovements(Set<ProjectCodeApprovement> projectCodeApprovements) {
        this.projectCodeApprovements = projectCodeApprovements;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public Integer getPeriodCounter() {
        return periodCounter;
    }

    public void setPeriodCounter(Integer periodCounter) {
        this.periodCounter = periodCounter;
    }

    public PeriodDate getPeriodDate() {
        return periodDate;
    }

    public void setPeriodDate(PeriodDate periodDate) {
        this.periodDate = periodDate;
    }

    public PeriodMonth getPeriodMonth() {
        return periodMonth;
    }

    public void setPeriodMonth(PeriodMonth periodMonth) {
        this.periodMonth = periodMonth;
    }

    public PeriodQuarter getPeriodQuarter() {
        return periodQuarter;
    }

    public void setPeriodQuarter(PeriodQuarter periodQuarter) {
        this.periodQuarter = periodQuarter;
    }

    public PeriodType getPeriodType() {
        return periodType;
    }

    public void setPeriodType(PeriodType periodType) {
        this.periodType = periodType;
    }

    public FeesItem getFeesItem() {
        return feesItem;
    }

    public void setFeesItem(FeesItem feesItem) {
        this.feesItem = feesItem;
    }

    public Agreement getAgreement() {
        return agreement;
    }

    public void setAgreement(Agreement agreement) {
        this.agreement = agreement;
    }

    public OutOfPocketItem getOutOfPocketItem() {
        return outOfPocketItem;
    }

    public void setOutOfPocketItem(OutOfPocketItem outOfPocketItem) {
        this.outOfPocketItem = outOfPocketItem;
    }

    public Set<InvoiceRequestPacket> getInvoiceRequestPackets() {
        return invoiceRequestPackets;
    }

    public void setInvoiceRequestPackets(Set<InvoiceRequestPacket> invoiceRequestPackets) {
        this.invoiceRequestPackets = invoiceRequestPackets;
    }

    public Set<PlanningGroupToProjectCodeLink> getPlanningGroupToProjectCodeLinks() {
        return planningGroupToProjectCodeLinks;
    }

    public void setPlanningGroupToProjectCodeLinks(Set<PlanningGroupToProjectCodeLink> planningGroupToProjectCodeLinks) {
        this.planningGroupToProjectCodeLinks = planningGroupToProjectCodeLinks;
    }

    public OutOfPocketRequest getOutOfPocketRequest() {
        return outOfPocketRequest;
    }

    public void setOutOfPocketRequest(OutOfPocketRequest outOfPocketRequest) {
        this.outOfPocketRequest = outOfPocketRequest;
    }

    public Set<EmployeeProjectCodeAccessItem> getEmployeeProjectCodeAccessItems() {
        return employeeProjectCodeAccessItems;
    }

    public void setEmployeeProjectCodeAccessItems(Set<EmployeeProjectCodeAccessItem> employeeProjectCodeAccessItems) {
        this.employeeProjectCodeAccessItems = employeeProjectCodeAccessItems;
    }

    public static ProjectCode getByCode(String code) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (ProjectCode)hs.createQuery("select pc from ProjectCode as pc where pc.code=:code").setString("code", code).uniqueResult();
    }
    public static Subdepartment getSubdepartmentForOpenProjectCodes(Employee employee) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (Subdepartment)hs.createQuery("select distinct s from Subdepartment as s inner join s.positions as p inner join p.employees as e inner join s.projectCodes as pc where e=:employee and pc.isClosed=false").setParameter("employee", employee).uniqueResult();
    }
    public static List<Group> getGroupsForOpenProjectCodes(Employee employee) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<Group>)hs.createQuery("select distinct g from ProjectCode as pc inner join pc.subdepartment as s inner join s.positions as p inner join p.employees as e inner join pc.client as c inner join c.group as g where e=:employee and pc.isClosed=false").setParameter("employee", employee).list();
    }
    public static List<Client> getClients(Employee employee) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<Client>)hs.createQuery("select distinct c from ProjectCode as pc inner join pc.subdepartment as s inner join s.positions as p inner join p.employees as e inner join pc.client as c where e=:employee").setParameter("employee", employee).list();
    }
    public static List<Client> getClients(Country country) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<Client>)hs.createQuery("select distinct cl from ProjectCode as pc inner join pc.subdepartment as s inner join s.department as d inner join d.office as o inner join o.country as c inner join pc.client as cl where c=:country").setParameter("country", country).list();
    }
    public static List<ProjectCode> getProjectCodes(Country country, Client client) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<ProjectCode>)hs.createQuery("select distinct pc from ProjectCode as pc inner join pc.subdepartment as s inner join s.department as d inner join d.office as o inner join o.country as c inner join pc.client as cl where c=:country and cl=:client").setParameter("country", country).setParameter("client", client).list();
    }
    public static List<Client> getClientsForOpenProjectCodes(Subdepartment subdepartment) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<Client>)hs.createQuery("select distinct c from ProjectCode as pc inner join pc.subdepartment as s inner join pc.client as c where s=:subdepartment and pc.isClosed=false").setParameter("subdepartment", subdepartment).list();
    }
    public static List<Client> getClientsForOpenProjectCodes(Employee employee) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<Client>)hs.createQuery("select distinct c from ProjectCode as pc inner join pc.subdepartment as s inner join s.positions as p inner join p.employees as e inner join pc.client as c where e=:employee and pc.isClosed=false").setParameter("employee", employee).list();
    }
    public static List<Client> getClientsForOpenProjectCodes(Employee employee, Group group) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<Client>)hs.createQuery("select distinct c from ProjectCode as pc inner join pc.subdepartment as s inner join s.positions as p inner join p.employees as e inner join pc.client as c inner join c.group as g where e=:employee and pc.isClosed=false and g=:group").setParameter("employee", employee).setParameter("group", group).list();
    }
    public static List<ProjectCode> getOpenProjectCodes(Employee employee) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<ProjectCode>)hs.createQuery("select distinct pc from ProjectCode as pc inner join pc.subdepartment as s inner join s.positions as p inner join p.employees as e where e=:employee and pc.isClosed=false").setParameter("employee", employee).list();
    }
    public static List<ProjectCode> getOpenProjectCodes(Employee employee, Client client) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<ProjectCode>)hs.createQuery("select distinct pc from ProjectCode as pc inner join pc.subdepartment as s inner join s.positions as p inner join p.employees as e inner join pc.client as c where e=:employee and pc.isClosed=false and c=:client").setParameter("employee", employee).setParameter("client", client).list();
    }
    public static List<ProjectCode> getOpenProjectCodes(Subdepartment subdepartment, Client client) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<ProjectCode>)hs.createQuery("select distinct pc from ProjectCode as pc inner join pc.subdepartment as s inner join pc.client as c where s=:subdepartment and pc.isClosed=false and c=:client").setParameter("subdepartment", subdepartment).setParameter("client", client).list();
    }

    public static List<ProjectCode> getProjectCodes(Employee employee, Client client) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<ProjectCode>)hs.createQuery("select distinct pc from ProjectCode as pc inner join pc.subdepartment as s inner join s.positions as p inner join p.employees as e inner join pc.client as c where e=:employee and c=:client").setParameter("employee", employee).setParameter("client", client).list();
    }
    public static List<ProjectCode> getProjectCodes(Country clientCountry) {
        return getProjectCodesByClosedFlag(clientCountry, null);
    }
    public static List<ProjectCode> getProjectCodesByClosedFlag(Country clientCountry, Boolean isClosed) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        String query = "";
        query += "select pc from ProjectCode as pc inner join pc.client as c inner join c.workCountry as wc ";
        query += "where ";
        query += "wc=:workCountry ";
        if(Boolean.TRUE.equals(isClosed)) {
            query += "and pc.isClosed=true ";
        } else if(Boolean.FALSE.equals(isClosed)) {
            query += "and pc.isClosed=false ";        
        }
        Query hq = hs.createQuery(query);
        hq.setParameter("workCountry", clientCountry);
        return (List<ProjectCode>)hq.list();
    }
    public static List<ProjectCode> getProjectCodes(Country groupCountry, Date createdAtFrom, Date createdAtTo, Date modifiedAtFrom, Date modifiedAtTo, Date closedAtFrom, Date closedAtTo) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        String query = "";
        query += "select distinct pc from ProjectCode as pc inner join pc.client as c inner join c.workCountry as wc ";
        query += "where ";
        query += "wc=:workCountry ";
        boolean isUsed = true;
        if(createdAtFrom != null) {
            if(isUsed) {
                query += "and ";
            }
            query += "pc.createdAt>=:createdAtFrom ";
            isUsed = true;
        }
        if(createdAtTo != null) {
            if(isUsed) {
                query += "and ";
            }
            query += "pc.createdAt<=:createdAtTo ";
            isUsed = true;
        }
        if(modifiedAtFrom != null) {
            if(isUsed) {
                query += "and ";
            }
            query += "pc.modifiedAt>=:modifiedAtFrom ";
            isUsed = true;
        }
        if(modifiedAtTo != null) {
            if(isUsed) {
                query += "and ";
            }
            query += "pc.modifiedAt<=:modifiedAtTo ";
            isUsed = true;
        }
        if(closedAtFrom != null) {
            if(isUsed) {
                query += "and ";
            }
            query += "pc.closedAt>=:closedAtFrom ";
            isUsed = true;
        }
        if(closedAtTo != null) {
            if(isUsed) {
                query += "and ";
            }
            query += "pc.closedAt<=:closedAtTo ";
            isUsed = true;
        }
        Query hq = hs.createQuery(query);
        hq.setParameter("workCountry", groupCountry);
        if(createdAtFrom != null) {
            hq.setParameter("createdAtFrom", createdAtFrom);
        }
        if(createdAtTo != null) {
            hq.setParameter("createdAtTo", createdAtTo);
        }
        if(modifiedAtFrom != null) {
            hq.setParameter("modifiedAtFrom", modifiedAtFrom);
        }
        if(modifiedAtTo != null) {
            hq.setParameter("modifiedAtTo", modifiedAtTo);
        }
        if(closedAtFrom != null) {
            hq.setParameter("closedAtFrom", closedAtFrom);
        }
        if(closedAtTo != null) {
            hq.setParameter("closedAtTo", closedAtTo);
        }        
        return (List<ProjectCode>)hq.list();
    }
    public static List<ProjectCode> getProjectCodes(Country groupCountry, Group group, Client client, ProjectCode projectCode, Country officeCountry, Office office, Department department, Subdepartment subdepartment) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        String query = "select distinct pc from ProjectCode as pc ";
        if(subdepartment != null) {
            query += "inner join pc.subdepartment as s ";
        } else if(department != null) {
            query += "inner join pc.subdepartment as s inner join s.department as d ";
        } else if(office != null) {
            query += "inner join pc.subdepartment as s inner join s.department as d inner join d.office as o ";
        } else if(officeCountry != null) {
            query += "inner join pc.subdepartment as s inner join s.department as d inner join d.office as o inner join o.country as oc ";
        }
        if(client != null) {
            query += "inner join pc.client as c ";
        } else if(group != null) {
            query += "inner join pc.client as c left join c.group as g ";
        } else if(groupCountry != null) {
            query += "inner join pc.client as c inner join c.workCountry as gc ";
        }
        query += "where ";
        boolean conditionUsed = false;
        if(subdepartment != null) {
            query += "s=:subdepartment ";
        } else if(department != null) {
            query += "d=:department ";
        } else if(office != null) {
            query += "o=:office ";
        } else if(officeCountry != null) {
            query += "oc=:officeCountry ";
        }
        if(subdepartment != null || department != null || office != null || officeCountry != null) {
            conditionUsed = true;
        }
        if(conditionUsed) {
            query += "and ";
        }
        if(projectCode != null) {
            query += "pc=:projectCode ";
        } else if(client != null) {
            query += "c=:client ";
        } else if(group != null) {
            query += "g=:group ";
        } else if(groupCountry != null) {
            query += "gc=:groupCountry ";
        }
        if(projectCode != null || client != null || group != null || groupCountry != null) {
            conditionUsed = true;
        }
        Query hq = hs.createQuery(query);
        if(subdepartment != null) {
            hq.setParameter("subdepartment", subdepartment);
        } else if(department != null) {
            hq.setParameter("department", department);
        } else if(office != null) {
            hq.setParameter("office", office);
        } else if(officeCountry != null) {
            hq.setParameter("officeCountry", officeCountry);
        }
        if(projectCode != null) {
            hq.setParameter("projectCode", projectCode);
        } else if(client != null) {
            hq.setParameter("client", client);
        } else if(group != null) {
            hq.setParameter("group", group);
        } else if(groupCountry != null) {
            hq.setParameter("groupCountry", groupCountry);
        }
        return (List<ProjectCode>)hq.list();
    }

    public void generateCode() {
        Department department =  subdepartment.getDepartment();
        Office office = department.getOffice();
        String generatedCode = "";
        generatedCode += office.getCodeName();
        generatedCode += "_" + department.getCodeName();
        generatedCode += "_" + subdepartment.getCodeName();
        generatedCode += "_" + client.getCodeName();
        generatedCode += "_" + year;
        generatedCode += "_" + activity.getCodeName();
        if(ProjectCode.PeriodType.QUARTER.equals(periodType)) {
            Map<ProjectCode.PeriodQuarter, String> values = new HashMap<ProjectCode.PeriodQuarter, String>();
            values.put(ProjectCode.PeriodQuarter.FIRST, "1");
            values.put(ProjectCode.PeriodQuarter.SECOND, "2");
            values.put(ProjectCode.PeriodQuarter.THIRD, "3");
            values.put(ProjectCode.PeriodQuarter.FOURTH, "4");
            generatedCode += "_Q" + values.get(periodQuarter);
        } else if(ProjectCode.PeriodType.MONTH.equals(periodType)) {
            Map<ProjectCode.PeriodMonth, String> values = new HashMap<ProjectCode.PeriodMonth, String>();
            values.put(ProjectCode.PeriodMonth.JANUARY, "1");
            values.put(ProjectCode.PeriodMonth.FEBRUARY, "2");
            values.put(ProjectCode.PeriodMonth.MARCH, "3");
            values.put(ProjectCode.PeriodMonth.APRIL, "4");
            values.put(ProjectCode.PeriodMonth.MAY, "5");
            values.put(ProjectCode.PeriodMonth.JUNE, "6");
            values.put(ProjectCode.PeriodMonth.JULY, "7");
            values.put(ProjectCode.PeriodMonth.AUGUST, "8");
            values.put(ProjectCode.PeriodMonth.SEPTEMBER, "9");
            values.put(ProjectCode.PeriodMonth.OCTOBER, "10");
            values.put(ProjectCode.PeriodMonth.NOVEMBER, "11");
            values.put(ProjectCode.PeriodMonth.DECEMBER, "12");
            generatedCode += "_M" + values.get(periodMonth);
        } else if(ProjectCode.PeriodType.DATE.equals(periodType)) {
            Map<ProjectCode.PeriodDate, String> values = new HashMap<ProjectCode.PeriodDate, String>();
            values.put(ProjectCode.PeriodDate.D3101, "3101");
            values.put(ProjectCode.PeriodDate.D2802, "2802");
            values.put(ProjectCode.PeriodDate.D3103, "3103");
            values.put(ProjectCode.PeriodDate.D3004, "3004");
            values.put(ProjectCode.PeriodDate.D3105, "3105");
            values.put(ProjectCode.PeriodDate.D3006, "3006");
            values.put(ProjectCode.PeriodDate.D3107, "3107");
            values.put(ProjectCode.PeriodDate.D3108, "3108");
            values.put(ProjectCode.PeriodDate.D3009, "3009");
            values.put(ProjectCode.PeriodDate.D3110, "3110");
            values.put(ProjectCode.PeriodDate.D3011, "3011");
            values.put(ProjectCode.PeriodDate.D3112, "3112");
            generatedCode += "_" + values.get(periodDate);
        } else if(ProjectCode.PeriodType.COUNTER.equals(periodType)) {
            generatedCode += "_" + getPeriodCounter();
        }
        this.code = generatedCode;
    }
    public static Integer getMaxPeriodCounter(Integer year, Client client, Activity activity) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (Integer)hs.createQuery("select max(pc.periodCounter) from ProjectCode as pc where year=:year and client=:client and activity=:activity").setInteger("year", year).setEntity("client", client).setEntity("activity", activity).uniqueResult();
    }
    public static Integer getMinYear() {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (Integer)hs.createQuery("select min(pc.year) from ProjectCode as pc").uniqueResult();
    }
    public static Integer getMaxYear() {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (Integer)hs.createQuery("select max(pc.year) from ProjectCode as pc").uniqueResult();
    }
    public static List<Integer> getYears() {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<Integer>)hs.createQuery("select pc.year from ProjectCode as pc group by pc.year").list();
    }
    public static List<Integer> getFinancialYears() {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<Integer>)hs.createQuery("select pc.financialYear from ProjectCode as pc group by pc.financialYear").list();
    }
    public static List<ProjectCode> getAll() {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<ProjectCode>)hs.createQuery("select pc from ProjectCode as pc").list();
    }
    public static List<ProjectCode> getAll(Country country) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        String query = "select pc from ProjectCode as pc inner join pc.subdepartment as s inner join s.department as d inner join d.office as o ";
        query += "where o.country=:country ";
        Query hq = hs.createQuery(query).setParameter("country", country);
        return (List<ProjectCode>)hq.list();
    }
    public static List<ProjectCode> getAll(Client client) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        String query = "select pc from ProjectCode as pc inner join pc.client as c ";
        query += "where c=:client ";
        Query hq = hs.createQuery(query).setParameter("client", client);
        return (List<ProjectCode>)hq.list();
    }
    public static List<Employee> getInChargePersons(Subdepartment subdepartment) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        String query = "select e from Employee as e inner join e.inChargeProjectCodes as pc inner join pc.subdepartment as s ";
        query += "where s=:subdepartment ";
        query += "group by e ";
        Query hq = hs.createQuery(query);
        hq.setParameter("subdepartment", subdepartment);
        return (List<Employee>)hq.list();
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
        if (!(obj instanceof ProjectCode)) {
            return false;
        }
        final ProjectCode other = (ProjectCode) obj;
        if (!Objects.equals(this.getId(), other.getId())) {
            return false;
        }
        return true;
    }
    
}
