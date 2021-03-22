/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.db.domain;
import com.mazars.management.db.util.HibernateUtil;
import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import org.hibernate.Session;

public class Group {
    private Set<Client> clients = new HashSet<Client>();


    private Long id;
    private String name;
    private String alias;
    private ISOCountry country;
    private Boolean isListed;
    private ISOCountry listingCountry;
    private Boolean isReferred;
    private Boolean isMazarsAudit;    
    private Set<ClientHistoryItem> clientHistoryItems = new HashSet<ClientHistoryItem>();
    private Set<GroupHistoryItem> groupHistoryItems = new HashSet<GroupHistoryItem>();
    private Country workCountry;
    
    public Group() {}
    public Set<Client> getClients() {
        return clients;
    }

    public void setClients(Set<Client> clients) {
        this.clients = clients;
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

    public String getAlias() {
        return alias;
    }

    public void setAlias(String alias) {
        this.alias = alias;
    }

    public Country getWorkCountry() {
        return workCountry;
    }

    public void setWorkCountry(Country workCountry) {
        this.workCountry = workCountry;
    }

    public ISOCountry getCountry() {
        return country;
    }

    public void setCountry(ISOCountry country) {
        this.country = country;
    }

    public Boolean getIsListed() {
        return isListed;
    }

    public void setIsListed(Boolean isListed) {
        this.isListed = isListed;
    }

    public ISOCountry getListingCountry() {
        return listingCountry;
    }

    public void setListingCountry(ISOCountry listingCountry) {
        this.listingCountry = listingCountry;
    }

    public Set<ClientHistoryItem> getClientHistoryItems() {
        return clientHistoryItems;
    }

    public void setClientHistoryItems(Set<ClientHistoryItem> clientHistoryItems) {
        this.clientHistoryItems = clientHistoryItems;
    }

    public Set<GroupHistoryItem> getGroupHistoryItems() {
        return groupHistoryItems;
    }

    public void setGroupHistoryItems(Set<GroupHistoryItem> groupHistoryItems) {
        this.groupHistoryItems = groupHistoryItems;
    }

    public Boolean getIsReferred() {
        return isReferred;
    }

    public void setIsReferred(Boolean isReferred) {
        this.isReferred = isReferred;
    }

    public Boolean getIsMazarsAudit() {
        return isMazarsAudit;
    }

    public void setIsMazarsAudit(Boolean isMazarsAudit) {
        this.isMazarsAudit = isMazarsAudit;
    }

    @Override
    public int hashCode() {
        int hash = 7;
        hash = 67 * hash + Objects.hashCode(this.clients);
        return hash;
    }

    @Override
    public boolean equals(Object obj) {
        if (obj == null) {
            return false;
        }
        if (!(obj instanceof Group)) {
            return false;
        }
        final Group other = (Group) obj;
        if (!Objects.equals(this.getId(), other.getId())) {
            return false;
        }
        return true;
    }

    
    public static List<Group> getAll() {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<Group>)hs.createQuery("from Group").list();
    }
    public static List<Group> getByName(String name) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<Group>)hs.createQuery("select g from Group as g where g.name=:name").setString("name", name).list();
    }
    public static List<Group> getByName(String name, Country country) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<Group>)hs.createQuery("select g from Group as g inner join g.workCountry as wc where g.name=:name and wc=:workCountry").setString("name", name).setParameter("workCountry", country).list();
    }
    public List<ProjectCode> getProjectCodes() {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<ProjectCode>)hs.createQuery("select pc from ProjectCode as pc inner join pc.client as c where c.group=:group").setParameter("group", this).list();
    }
}
