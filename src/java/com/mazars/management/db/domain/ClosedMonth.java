/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.db.domain;
import com.mazars.management.db.util.HibernateUtil;
import com.mazars.management.db.vo.YearMonthDate;
import java.util.GregorianCalendar;
import org.hibernate.Session;
import java.util.List;
import java.util.Set;
import java.util.HashSet;
import java.util.LinkedList;
import javax.mail.MessagingException;
import org.hibernate.Query;

/**
 *
 * @author glazov
 */
public class ClosedMonth {
    private Long id;
    private Integer year;
    private Integer month;
    private Country country;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Country getCountry() {
        return country;
    }

    public void setCountry(Country country) {
        this.country = country;
    }

    public Integer getMonth() {
        return month;
    }

    public void setMonth(Integer month) {
        this.month = month;
    }

    public Integer getYear() {
        return year;
    }

    public void setYear(Integer year) {
        this.year = year;
    }

    public static List<ClosedMonth> getAllByCountryAndYear(Country country, Integer year) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<ClosedMonth>)hs.createQuery("select cm from ClosedMonth as cm where cm.country=:country and cm.year=:year").setParameter("country", country).setInteger("year", year).list();
    }
    public static List<ClosedMonth> getAllByCountry(Country country) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<ClosedMonth>)hs.createQuery("select cm from ClosedMonth as cm where cm.country=:country").setParameter("country", country).list();
    }
    public static List<ClosedMonth> getAllByCountryAndRange(Country country, int startYear, int startMonth,  int endYear, int endMonth) {
        YearMonthDate start1 = new YearMonthDate(startYear, startMonth, 1);
        YearMonthDate end1 = new YearMonthDate(endYear, endMonth, 1);
        List<ClosedMonth> closedMonths = new LinkedList<ClosedMonth>();
        for(ClosedMonth closedMonth : getAllByCountry(country)) {
            YearMonthDate d = new YearMonthDate(closedMonth.getYear(), closedMonth.getMonth(), 1);
            if(start1.compareTo(d) <= 0 && end1.compareTo(d) >= 0) {
                closedMonths.add(closedMonth);
            }
        } 
        return closedMonths; 
    }
    public static List<ClosedMonth> getAllUnclosedByCountryAndRange(Country country, int startYear, int startMonth,  int endYear, int endMonth) {
        List<ClosedMonth> closedMonths = getAllByCountryAndRange(country, startYear, startMonth, endYear, endMonth);
        List<ClosedMonth> unclosedMonths = new LinkedList<ClosedMonth>();
        for(int year = startYear; year <= endYear; year++) {
             int monthFrom = (year == startYear) ? startMonth : 0; 
             int monthTo = (year == endYear) ? endMonth : 11;
             for(int month = monthFrom; month <= monthTo; month++) {
                 boolean closed = false;
                 for(ClosedMonth closedMonth : closedMonths) {
                     if(closedMonth.getYear().equals(year) && closedMonth.getMonth().equals(month)) {
                         closed = true;
                         break;
                     }
                 }
                 if(! closed) {
                     ClosedMonth unclosedMonth = new ClosedMonth();
                     unclosedMonth.setCountry(country);
                     unclosedMonth.setYear(year);
                     unclosedMonth.setMonth(month);
                     unclosedMonths.add(unclosedMonth);
                 }
             }
        } 
        return unclosedMonths; 
    }
    public static boolean isMonthClosed(Country country, Integer year, Integer month) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return hs.createQuery("select cm from ClosedMonth as cm inner join cm.country as c where c=:country and cm.year=:year and cm.month=:month").setParameter("country", country).setInteger("year", year).setInteger("month", month).uniqueResult() != null;
    }
    public static List<ClosedMonth> checkCountry(Country country) throws MessagingException {
        YearMonthDate minDay = new YearMonthDate(TimeSpentItem.getMinDay());
        YearMonthDate today = new YearMonthDate(new GregorianCalendar());
        int endYear = today.getYear();
        int endMonth = today.getMonth() - 1;
        if(today.getMonth() == 0) {
            endYear = today.getYear() - 1;
            endMonth = 11;
        }
        if(minDay.getYear() > endYear) {
            minDay.setYear(endYear);
        }
        return ClosedMonth.getAllUnclosedByCountryAndRange(country, minDay.getYear(), 0, endYear, endMonth);
    }
}
