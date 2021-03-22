/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.db.domain;
import com.mazars.management.db.util.HibernateUtil;
import org.hibernate.Session;
import java.util.List;
import java.util.Set;
import java.util.HashSet;

/**
 *
 * @author glazov
 */
public class Language {
    public enum Type {
        SOVEREIGN_COUNTRIES,
        SUBNATIONAL_ENTITIES
    }
    private Long id;
    private String name;
    private Type type;

    public Language() {
    }

    public Language(String name, Type type) {
        this.name = name;
        this.type = type;
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

    public Type getType() {
        return type;
    }

    public void setType(Type type) {
        this.type = type;
    }
    public static List<Language> getAll() {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<Language>)hs.createQuery("from Language").list();
    }
    public static Long getTotalCount() {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (Long)hs.createQuery("select count(*) from Language").uniqueResult();
    }
}
