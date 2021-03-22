/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.db.domain;
import com.mazars.management.db.util.HibernateUtil;
import org.hibernate.Session;
import java.util.Set;
import java.util.HashSet;
import java.util.List;
/**
 *
 * @author glazov
 */
public class Module {
    private Long id;
    private Set<RightsItem> rightsItems = new HashSet<RightsItem>();
    private String name;
    private String description;
    private Boolean isReport;

    public Module() {
    }

    public Module(String name, String description, Boolean isReport) {
        this.name = name;
        this.description = description;
        this.isReport = isReport;
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

    public Set<RightsItem> getRightsItems() {
        return rightsItems;
    }

    public void setRightsItems(Set<RightsItem> rightsItems) {
        this.rightsItems = rightsItems;
    }

    public Boolean getIsReport() {
        return isReport;
    }

    public void setIsReport(Boolean isReport) {
        this.isReport = isReport;
    }

    public static List<Module> getAll() {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<Module>)hs.createQuery("from Module").list();
    }
    public static Module getByName(String name) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (Module)hs.createQuery("from Module as m where m.name=:name").setString("name", name).uniqueResult();
    }
    public static Long getTotalCount() {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (Long)hs.createQuery("select count(*) from Module").uniqueResult();
    }
}
