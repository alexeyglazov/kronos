package com.mazars.management.db.domain;
import com.mazars.management.db.util.HibernateUtil;
import java.util.Date;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.List;
import java.util.Set;
import org.hibernate.Query;
import org.hibernate.Session;

public class Contact {
    public enum Gender {
        MR,
        MRS,
        MS
    }
    public enum NormalPosition {
        CEO,
        CFO,
        HR,
        CIO,
        TAX_MANAGER,
        CA,
        OTHER
    }
    public enum PresentType {
        VIP,
        STANDARD,
        CARD,
        NO
    }
    private Long id;
    private Gender gender;
    private String firstName;
    private String lastName;
    private String firstNameLocalLanguage;
    private String lastNameLocalLanguage;
    private String directPhone;
    private String mobilePhone;
    private String email;
    private String language;
    private ISOCountry residencialCountry;
    private Boolean isClientsAddressUsed;
    private String street; // address
    private String zipCode; // address
    private String city; // address
    private ISOCountry country; // address

    private String comment;
    private NormalPosition normalPosition;
    private String otherNormalPosition;
    
    private PresentType presentType;
    private Boolean isNewsletters;
    private Boolean isReminder;  
    private Boolean isActive;
    private Set<ContactHistoryItem> contactHistoryItems = new HashSet<ContactHistoryItem>();
    private Set<EmployeeContactLink> employeeContactLinks = new HashSet<EmployeeContactLink>();
    private Set<ContactClientLink> contactClientLinks = new HashSet<ContactClientLink>();

    private Set<MailoutRecipient> mailoutRecipients = new HashSet<MailoutRecipient>();
    
    public Contact() {}

    public Set<ContactHistoryItem> getContactHistoryItems() {
        return contactHistoryItems;
    }

    public void setContactHistoryItems(Set<ContactHistoryItem> contactHistoryItems) {
        this.contactHistoryItems = contactHistoryItems;
    }

    public Set<EmployeeContactLink> getEmployeeContactLinks() {
        return employeeContactLinks;
    }

    public void setEmployeeContactLinks(Set<EmployeeContactLink> employeeContactLinks) {
        this.employeeContactLinks = employeeContactLinks;
    }

    public String getDirectPhone() {
        return directPhone;
    }

    public void setDirectPhone(String directPhone) {
        this.directPhone = directPhone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
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

    public Gender getGender() {
        return gender;
    }

    public void setGender(Gender gender) {
        this.gender = gender;
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

    public Boolean getIsNewsletters() {
        return isNewsletters;
    }

    public void setIsNewsletters(Boolean isNewsletters) {
        this.isNewsletters = isNewsletters;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
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

    public String getMobilePhone() {
        return mobilePhone;
    }

    public void setMobilePhone(String mobilePhone) {
        this.mobilePhone = mobilePhone;
    }

    public NormalPosition getNormalPosition() {
        return normalPosition;
    }

    public void setNormalPosition(NormalPosition normalPosition) {
        this.normalPosition = normalPosition;
    }

    public ISOCountry getResidencialCountry() {
        return residencialCountry;
    }

    public void setResidencialCountry(ISOCountry residencialCountry) {
        this.residencialCountry = residencialCountry;
    }

    public Boolean getIsClientsAddressUsed() {
        return isClientsAddressUsed;
    }

    public void setIsClientsAddressUsed(Boolean isClientsAddressUsed) {
        this.isClientsAddressUsed = isClientsAddressUsed;
    }

    public String getStreet() {
        return street;
    }

    public void setStreet(String street) {
        this.street = street;
    }

    public String getZipCode() {
        return zipCode;
    }

    public void setZipCode(String zipCode) {
        this.zipCode = zipCode;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public ISOCountry getCountry() {
        return country;
    }

    public void setCountry(ISOCountry country) {
        this.country = country;
    }

    public String getOtherNormalPosition() {
        return otherNormalPosition;
    }

    public void setOtherNormalPosition(String otherNormalPosition) {
        this.otherNormalPosition = otherNormalPosition;
    }

    public PresentType getPresentType() {
        return presentType;
    }

    public void setPresentType(PresentType presentType) {
        this.presentType = presentType;
    }

    public Boolean getIsReminder() {
        return isReminder;
    }

    public void setIsReminder(Boolean isReminder) {
        this.isReminder = isReminder;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public Set<MailoutRecipient> getMailoutRecipients() {
        return mailoutRecipients;
    }

    public void setMailoutRecipients(Set<MailoutRecipient> mailoutRecipients) {
        this.mailoutRecipients = mailoutRecipients;
    }

    public Set<ContactClientLink> getContactClientLinks() {
        return contactClientLinks;
    }

    public void setContactClientLinks(Set<ContactClientLink> contactClientLinks) {
        this.contactClientLinks = contactClientLinks;
    }
    public List<Client> getClients() {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        String query = "";
        query += "select c from Contact as cc inner join cc.contactClientLinks as ccl inner join ccl.client as c "; 
        query += "where ";
        query += "cc=:contact ";
        Query hq = hs.createQuery(query);
        hq.setParameter("contact", this);
        return (List<Client>)hq.list();
    }
    
    public static List<Contact> getByEmail(String email, Client client) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<Contact>)hs.createQuery("select c from Contact as c inner join c.contactClientLinks as ccl inner join ccl.client as cl where c.email=:email and cl=:client").setString("email", email).setParameter("client", client).list();
    }
    public static List<Contact> getByEmail(String email) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<Contact>)hs.createQuery("select c from Contact as c where c.email=:email").setString("email", email).list();
    }
    public static List<Contact> getByIds(List<Long> ids) {
        if(ids.isEmpty()) {
            return new LinkedList<Contact>();
        }
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        String query = "select c from Contact as c where c.id in (:ids) ";
        Query hq = hs.createQuery(query);
        return (List<Contact>)hq.setParameterList("ids", ids).list();
    }
    public static List<Contact> getAll() {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<Contact>)hs.createQuery("select c from Contact as c ").list();
    }    
    public List<Employee> getProjectCodeInChargePersons() {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        String query = "select e from Employee as e inner join e.inChargeProjectCodes as pc inner join pc.client as c inner join c.contactClientLinks as ccl inner join ccl.contact as cc ";
        query += "where cc=:contact ";
        query += "group by e ";
        Query hq = hs.createQuery(query);
        hq.setParameter("contact", this);
        return (List<Employee>)hq.list();
    }
}
