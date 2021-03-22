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
public class ISOCountry {
    private Long id;
    private String name;
    private String alpha2Code;
    private String alpha3Code;
    private String numericCode;
    public ISOCountry() {
    }

    public ISOCountry(String name, String alpha2Code, String alpha3Code, String numericCode) {
        this.name = name;
        this.alpha2Code = alpha2Code;
        this.alpha3Code = alpha3Code;
        this.numericCode = numericCode;
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

    public String getAlpha2Code() {
        return alpha2Code;
    }

    public void setAlpha2Code(String alpha2Code) {
        this.alpha2Code = alpha2Code;
    }

    public String getAlpha3Code() {
        return alpha3Code;
    }

    public void setAlpha3Code(String alpha3Code) {
        this.alpha3Code = alpha3Code;
    }

    public String getNumericCode() {
        return numericCode;
    }

    public void setNumericCode(String numericCode) {
        this.numericCode = numericCode;
    }
    public static List<ISOCountry> getAll() {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<ISOCountry>)hs.createQuery("from ISOCountry").list();
    }
    public static Long getTotalCount() {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (Long)hs.createQuery("select count(*) from ISOCountry").uniqueResult();
    }
    public static ISOCountry getByName(String name) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (ISOCountry)hs.createQuery("from ISOCountry as isoc where isoc.name=:name").setString("name", name).uniqueResult();
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
        if (!(obj instanceof ISOCountry)) {
            return false;
        }
        final ISOCountry other = (ISOCountry) obj;
        if (!Objects.equals(this.getId(), other.getId())) {
            return false;
        }
        return true;
    }    
}
