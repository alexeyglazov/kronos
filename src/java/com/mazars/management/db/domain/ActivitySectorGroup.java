package com.mazars.management.db.domain;
import com.mazars.management.db.util.HibernateUtil;
import org.hibernate.Session;
import java.util.List;
import java.util.Set;
import java.util.HashSet;

public class ActivitySectorGroup {
    private Long id;
    private String name;
    private String description;
    private Set<ActivitySector> activitySectors = new HashSet<ActivitySector>();


    public ActivitySectorGroup() {}

    public ActivitySectorGroup(Long id, String name, String description) {
        this.id = id;
        this.name = name;
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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Set<ActivitySector> getActivitySectors() {
        return activitySectors;
    }

    public void setActivitySectors(Set<ActivitySector> activitySectors) {
        this.activitySectors = activitySectors;
    }

    public static List<ActivitySectorGroup> getAll() {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<ActivitySectorGroup>)hs.createQuery("select asg from ActivitySectorGroup as asg").list();
    }
}
