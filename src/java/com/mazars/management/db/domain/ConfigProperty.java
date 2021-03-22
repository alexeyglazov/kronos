/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.db.domain;
import com.mazars.management.db.util.HibernateUtil;
import java.util.List;
import org.hibernate.Session;

/**
 *
 * @author glazov
 */
public class ConfigProperty {

    private Long id;
    private String name;
    private String value;
    private String description;

    public ConfigProperty() {
    }

    public ConfigProperty(String name, String value, String description) {
        this.name = name;
        this.value = value;
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

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }


    public static List<ConfigProperty> getAll() {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<ConfigProperty>)hs.createQuery("select cp from ConfigProperty as cp order by cp.name").list();
    }
    public static int deleteAll() {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return hs.createQuery("delete from ConfigProperty").executeUpdate();
    }
    public static ConfigProperty getByName(String name) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (ConfigProperty)hs.createQuery("select cp from ConfigProperty as cp where cp.name=:name").setParameter("name", name).uniqueResult();
    }
}
