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
import java.util.Objects;

/**
 *
 * @author glazov
 */
public class Currency {

    private Long id;
    private String name;
    private String code;
    private Set<CountryCurrency> countryCurrencies = new HashSet<CountryCurrency>();

    public Currency() {
    }

    public Currency(String name, String code) {
        this.name = name;
        this.code = code;
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

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public Set<CountryCurrency> getCountryCurrencies() {
        return countryCurrencies;
    }

    public void setCountryCurrencies(Set<CountryCurrency> countryCurrencies) {
        this.countryCurrencies = countryCurrencies;
    }

    public static List<Currency> getAll() {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<Currency>)hs.createQuery("select c from Currency as c").list();
    }
    public static Currency getByCode(String code) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (Currency)hs.createQuery("select c from Currency as c where c.code=:code").setParameter("code", code).uniqueResult();
    }
    public static List<Currency> getCurrencies(Employee employee) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<Currency>)hs.createQuery("select distinct c from Employee as e inner join e.salaries as s inner join s.currency as c where e=:employee").setParameter("employee", employee).list();
    }
    public static Long getTotalCount() {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (Long)hs.createQuery("select count(*) from Currency").uniqueResult();
    }
    public static Currency getByName(String name) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (Currency)hs.createQuery("select c from Currency as c where c.name=:name").setParameter("name", name).uniqueResult();
    } 

    @Override
    public int hashCode() {
        int hash = 7;
        hash = 61 * hash + Objects.hashCode(this.id);
        return hash;
    }

    @Override
    public boolean equals(Object obj) {
        if (obj == null) {
            return false;
        }
        if (!(obj instanceof Currency)) {
            return false;
        }
        final Currency other = (Currency) obj;
        if (!Objects.equals(this.id, other.id)) {
            return false;
        }
        return true;
    }
}
