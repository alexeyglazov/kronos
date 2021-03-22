/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.db.domain;
import com.mazars.management.db.util.HibernateUtil;
import org.hibernate.Session;
import java.util.HashSet;
import java.util.Set;
import java.util.List;
/**
 *
 * @author glazov
 */
public class CountryCurrency {
    private Long id;
    private Country country;
    private Currency currency;
    private Boolean isMain;

    public Country getCountry() {
        return country;
    }

    public void setCountry(Country country) {
        this.country = country;
    }

    public Currency getCurrency() {
        return currency;
    }

    public void setCurrency(Currency currency) {
        this.currency = currency;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Boolean getIsMain() {
        return isMain;
    }

    public void setIsMain(Boolean isMain) {
        this.isMain = isMain;
    }
    public static List<Currency> getCurrencies(Country country) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<Currency>)hs.createQuery("select distinct currency from Country as country inner join country.countryCurrencies as cc inner join cc.currency as currency where country=:country").setParameter("country", country).list();
    }
    public static Currency getMainCurrency(Country country) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (Currency)hs.createQuery("select distinct currency from Country as country inner join country.countryCurrencies as cc inner join cc.currency as currency where country=:country and cc.isMain=true").setParameter("country", country).uniqueResult();
    }
    public static List<Country> getCountries(Currency currency) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<Country>)hs.createQuery("select distinct country from Country as country inner join country.countryCurrencies as cc inner join cc.currency as currency where currency=:currency").setParameter("currency", currency).list();
    }
    public static CountryCurrency getCountryCurrency(Country country, Currency currency) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (CountryCurrency)hs.createQuery("select cc from CountryCurrency as cc where cc.country=:country and cc.currency=:currency").setParameter("country", country).setParameter("currency", currency).uniqueResult();
    }
}
