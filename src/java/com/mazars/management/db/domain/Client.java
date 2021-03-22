package com.mazars.management.db.domain;
import com.mazars.management.db.util.HibernateUtil;
import java.util.Calendar;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import org.hibernate.Query;
import org.hibernate.Session;

public class Client {
    public enum CustomerType {
        PIE,
        OMB
    }
    public enum ChannelType {
        CHANNEL1,
        CHANNEL2
    }
    public enum ClientGroup {
        ONE,
        TWO,
        THREE,
        NA
    }
    private Long id;
    private ClientGroup clientGroup;
    private String name;
    private String codeName;
    private String alias;
    
    private ISOCountry country;

    private String legalStreet;
    private String legalZipCode;
    private String legalCity;
    private ISOCountry legalCountry;
    
    private Boolean isPostalAddressEqualToLegal;
    private String postalStreet;
    private String postalZipCode;
    private String postalCity;
    private ISOCountry postalCountry;
    
    private String phone;
    private String email;
    private String taxNumber;
    private ISOCountry listingCountry;
    private Boolean isReferred;
    private Boolean isListed;
    private Boolean isTransnational;
    private CustomerType customerType;
    private ChannelType channelType;
    private Set<ClientHistoryItem> clientHistoryItems = new HashSet<ClientHistoryItem>();
    private Group group;
    private Set<SubdepartmentClientLink> subdepartmentClientLinks = new HashSet<SubdepartmentClientLink>();
    private Set<ContactClientLink> contactClientLinks = new HashSet<ContactClientLink>();
    private Set<ProjectCode> projectCodes = new HashSet<ProjectCode>();
    private Set<InvoiceRequest> invoiceRequests = new HashSet<InvoiceRequest>();
    private Set<ActRequest> actRequests = new HashSet<ActRequest>();
    private String color;
    private Set<PlanningGroup> planningGroups = new HashSet<PlanningGroup>();
    private Country workCountry;
    private Boolean isFuture;
    private Boolean isExternal;
    private Boolean isActive;
    private Set<ClientActivitySectorLink> clientActivitySectorLinks = new HashSet<ClientActivitySectorLink>();


    public Client() {}

    public ClientGroup getClientGroup() {
        return clientGroup;
    }

    public void setClientGroup(ClientGroup clientGroup) {
        this.clientGroup = clientGroup;
    }

    public String getAlias() {
        return alias;
    }

    public void setAlias(String alias) {
        this.alias = alias;
    }

    public Boolean getIsTransnational() {
        return isTransnational;
    }

    public void setIsTransnational(Boolean isTransnational) {
        this.isTransnational = isTransnational;
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

    public String getCodeName() {
        return codeName;
    }

    public void setCodeName(String codeName) {
        this.codeName = codeName;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public ChannelType getChannelType() {
        return channelType;
    }

    public void setChannelType(ChannelType channelType) {
        this.channelType = channelType;
    }

    public ISOCountry getCountry() {
        return country;
    }

    public void setCountry(ISOCountry country) {
        this.country = country;
    }

    public CustomerType getCustomerType() {
        return customerType;
    }

    public void setCustomerType(CustomerType customerType) {
        this.customerType = customerType;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Boolean getIsListed() {
        return isListed;
    }

    public void setIsListed(Boolean isListed) {
        this.isListed = isListed;
    }

    public Boolean getIsReferred() {
        return isReferred;
    }

    public void setIsReferred(Boolean isReferred) {
        this.isReferred = isReferred;
    }

    public ISOCountry getListingCountry() {
        return listingCountry;
    }

    public void setListingCountry(ISOCountry listingCountry) {
        this.listingCountry = listingCountry;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getLegalStreet() {
        return legalStreet;
    }

    public void setLegalStreet(String legalStreet) {
        this.legalStreet = legalStreet;
    }

    public String getLegalZipCode() {
        return legalZipCode;
    }

    public void setLegalZipCode(String legalZipCode) {
        this.legalZipCode = legalZipCode;
    }

    public String getLegalCity() {
        return legalCity;
    }

    public void setLegalCity(String legalCity) {
        this.legalCity = legalCity;
    }

    public ISOCountry getLegalCountry() {
        return legalCountry;
    }

    public void setLegalCountry(ISOCountry legalCountry) {
        this.legalCountry = legalCountry;
    }

    public Boolean getIsPostalAddressEqualToLegal() {
        return isPostalAddressEqualToLegal;
    }

    public void setIsPostalAddressEqualToLegal(Boolean isPostalAddressEqualToLegal) {
        this.isPostalAddressEqualToLegal = isPostalAddressEqualToLegal;
    }

    public String getPostalStreet() {
        return postalStreet;
    }

    public void setPostalStreet(String postalStreet) {
        this.postalStreet = postalStreet;
    }

    public String getPostalZipCode() {
        return postalZipCode;
    }

    public void setPostalZipCode(String postalZipCode) {
        this.postalZipCode = postalZipCode;
    }

    public String getPostalCity() {
        return postalCity;
    }

    public void setPostalCity(String postalCity) {
        this.postalCity = postalCity;
    }

    public ISOCountry getPostalCountry() {
        return postalCountry;
    }

    public void setPostalCountry(ISOCountry postalCountry) {
        this.postalCountry = postalCountry;
    }

    public Set<ClientHistoryItem> getClientHistoryItems() {
        return clientHistoryItems;
    }

    public void setClientHistoryItems(Set<ClientHistoryItem> clientHistoryItems) {
        this.clientHistoryItems = clientHistoryItems;
    }

    public Group getGroup() {
        return group;
    }

    public void setGroup(Group group) {
        this.group = group;
    }

    public Set<SubdepartmentClientLink> getSubdepartmentClientLinks() {
        return subdepartmentClientLinks;
    }

    public void setSubdepartmentClientLinks(Set<SubdepartmentClientLink> subdepartmentClientLinks) {
        this.subdepartmentClientLinks = subdepartmentClientLinks;
    }

    public Set<ContactClientLink> getContactClientLinks() {
        return contactClientLinks;
    }

    public void setContactClientLinks(Set<ContactClientLink> contactClientLinks) {
        this.contactClientLinks = contactClientLinks;
    }

    public Set<ProjectCode> getProjectCodes() {
        return projectCodes;
    }

    public void setProjectCodes(Set<ProjectCode> projectCodes) {
        this.projectCodes = projectCodes;
    }

    public Set<InvoiceRequest> getInvoiceRequests() {
        return invoiceRequests;
    }

    public void setInvoiceRequests(Set<InvoiceRequest> invoiceRequests) {
        this.invoiceRequests = invoiceRequests;
    }

    public Set<ActRequest> getActRequests() {
        return actRequests;
    }

    public void setActRequests(Set<ActRequest> actRequests) {
        this.actRequests = actRequests;
    }

    public Set<PlanningGroup> getPlanningGroups() {
        return planningGroups;
    }

    public void setPlanningGroups(Set<PlanningGroup> planningGroups) {
        this.planningGroups = planningGroups;
    }
  
    public ClientHistoryItem getLatestClientHistoryItem() {
        return ClientHistoryItem.getLatestClientHistoryItem(this);
    }

    public Country getWorkCountry() {
        return workCountry;
    }

    public void setWorkCountry(Country workCountry) {
        this.workCountry = workCountry;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public String getTaxNumber() {
        return taxNumber;
    }

    public void setTaxNumber(String taxNumber) {
        this.taxNumber = taxNumber;
    }

    public Boolean getIsFuture() {
        return isFuture;
    }

    public void setIsFuture(Boolean isFuture) {
        this.isFuture = isFuture;
    }

    public Boolean getIsExternal() {
        return isExternal;
    }

    public void setIsExternal(Boolean isExternal) {
        this.isExternal = isExternal;
    }

    public Set<ClientActivitySectorLink> getClientActivitySectorLinks() {
        return clientActivitySectorLinks;
    }

    public void setClientActivitySectorLinks(Set<ClientActivitySectorLink> clientActivitySectorLinks) {
        this.clientActivitySectorLinks = clientActivitySectorLinks;
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
        if (!(obj instanceof Client)) {
            return false;
        }
        final Client other = (Client) obj;
        if (!Objects.equals(this.getId(), other.getId())) {
            return false;
        }
        return true;
    }

    public static List<Client> getAll() {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<Client>)hs.createQuery("from Client").list();
    }
    public static List<Client> getAllByCountry(ISOCountry isoCountry) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<Client>)hs.createQuery("select c from Client as c inner join c.country as cntr where cntr=:country ").setParameter("country", isoCountry).list();
    }
    public static List<Client> find(String term) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<Client>)hs.createQuery("select c from Client as c where c.name like ?").setString(0, term + "%").list();
    }
    public static List<Client> getByName(String name) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<Client>)hs.createQuery("select c from Client as c where c.name=:name").setString("name", name).list();
    }
    public static List<Client> getByCodeName(String codeName) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<Client>)hs.createQuery("select c from Client as c where c.codeName=:codeName").setString("codeName", codeName).list();
    }
    public static List<Client> getByName(String name, Group group) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<Client>)hs.createQuery("select c from Client as c inner join c.group as g where c.name=:name and g=:group").setString("name", name).setParameter("group", group).list();
    }
    public static List<Client> getByCodeName(String codeName, Group group) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<Client>)hs.createQuery("select c from Client as c inner join c.group as g where c.codeName=:codeName and g=:group").setString("codeName", codeName).setParameter("group", group).list();
    }
    public List<Contact> getContacts() {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        String query = "";
        query += "select cc from Client as c inner join c.contactClientLinks as ccl inner join ccl.contact as cc "; 
        query += "where ";
        query += "c=:client ";
        Query hq = hs.createQuery(query);
        hq.setParameter("client", this);
        return (List<Contact>)hq.list();
    }

    public Map<Subdepartment, Long> getProjectCodeCountsForSubdepartments(Calendar start, Calendar end) {
        Map<Subdepartment, Long> projectCodeCounts = new HashMap<Subdepartment, Long>();
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        String query = "";
        query += "select s, count(*) from Client as c ";      
        query += "inner join c.projectCodes as pc ";
        query += "inner join pc.subdepartment as s ";
        query += "where ";
        query += "c=:client and ";
        query += "(pc.endDate=null or pc.endDate>:startDate) and ";
        query += "(pc.startDate=null or pc.startDate<:endDate) ";
        query += "group by s ";
        Query hq = hs.createQuery(query);
        hq.setParameter("startDate", start);
        hq.setParameter("endDate", end);
        hq.setParameter("client", this);
        List<Object[]> selection = (List<Object[]>)hq.list();
        for(Object[] tuple : selection) {
            Subdepartment subdepartment = (Subdepartment)tuple[0];
            Long count = (Long)tuple[1];
            projectCodeCounts.put(subdepartment, count);
        }
        return projectCodeCounts;
    }    
    public List<ProjectCode> getProjectCodes(Calendar start, Calendar end) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        String query = "";
        query += "select pc from Client as c ";      
        query += "inner join c.projectCodes as pc ";
        query += "where ";
        query += "c=:client and ";
        query += "(pc.endDate=null or pc.endDate>:startDate) and ";
        query += "(pc.startDate=null or pc.startDate<:endDate) ";
        Query hq = hs.createQuery(query);
        hq.setParameter("startDate", start);
        hq.setParameter("endDate", end);
        hq.setParameter("client", this);
        List<ProjectCode> projectCodes = (List<ProjectCode>)hq.list();
        return projectCodes;
    }   
    public List<ActivitySector> getActivitySectors() {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        String query = "";
        query += "select asec from ActivitySector as asec ";      
        query += "inner join asec.clientActivitySectorLinks as casl ";
        query += "inner join casl.client as c ";
        query += "where ";
        query += "c=:client ";
        Query hq = hs.createQuery(query);
        hq.setParameter("client", this);
        List<ActivitySector> activitySectors = (List<ActivitySector>)hq.list();
        return activitySectors;
    }
}
