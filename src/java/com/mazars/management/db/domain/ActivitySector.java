package com.mazars.management.db.domain;
import com.mazars.management.db.util.HibernateUtil;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import org.hibernate.Query;
import org.hibernate.Session;

public class ActivitySector {
    private Long id;
    private String name;
    private String description;
    private ActivitySectorGroup activitySectorGroup;
    private Set<ClientActivitySectorLink> clientActivitySectorLinks = new HashSet<ClientActivitySectorLink>();

    public ActivitySector() {}

    public ActivitySector(Long id, String name, String description, ActivitySectorGroup activitySectorGroup) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.activitySectorGroup = activitySectorGroup;
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

    public ActivitySectorGroup getActivitySectorGroup() {
        return activitySectorGroup;
    }

    public void setActivitySectorGroup(ActivitySectorGroup activitySectorGroup) {
        this.activitySectorGroup = activitySectorGroup;
    }

    public Set<ClientActivitySectorLink> getClientActivitySectorLinks() {
        return clientActivitySectorLinks;
    }

    public void setClientActivitySectorLinks(Set<ClientActivitySectorLink> clientActivitySectorLinks) {
        this.clientActivitySectorLinks = clientActivitySectorLinks;
    }

    public static List<ActivitySector> getAll() {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<ActivitySector>)hs.createQuery("select s from ActivitySector as s").list();
    }
    public static ActivitySector getByName(String name) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        Query hq = hs.createQuery("select s from ActivitySector as s where s.name=:name");
        hq.setParameter("name", name);
        return (ActivitySector)hq.uniqueResult();
    }

}
