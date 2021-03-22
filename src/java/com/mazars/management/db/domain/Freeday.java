/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.db.domain;
import com.mazars.management.db.util.CalendarUtil;
import com.mazars.management.db.util.HibernateUtil;
import com.mazars.management.db.vo.YearMonthDate;
import java.util.Calendar;
import org.hibernate.Session;
import java.util.List;
import java.util.LinkedList;
import org.hibernate.Query;

/**
 *
 * @author glazov
 */
public class Freeday {
    private Long id;
    private Calendar date;
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

    public Calendar getDate() {
        return date;
    }

    public void setDate(Calendar date) {
        this.date = date;
    }

    public static List<Freeday> getAllByCountryAndYear(Country country, Integer year) {
        Calendar start = new YearMonthDate(year, 0, 1).getCalendar();
        Calendar end = new YearMonthDate(year, 11, 31).getCalendar();
        return getAllByCountryAndRange(country, start, end);
    }
    public static List<Freeday> getAllByCountryYearMonth(Country country, Integer year, Integer month) {
        Calendar start = CalendarUtil.getBeginDateForYearMonth(year, month);
        Calendar end = CalendarUtil.getEndDateForYearMonth(year, month);
        return getAllByCountryAndRange(country, start, end);
    }
    public static List<Freeday> getAllByCountryAndRange(Country country, Calendar startDate, Calendar endDate) {
        List<Freeday> freedays = new LinkedList<Freeday>();
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        String query = "select f from Freeday as f inner join f.country as c where c=:country and f.date>=:startDate and f.date<=:endDate ";
        Query hq = hs.createQuery(query);
        hq.setParameter("country", country).setParameter("startDate", startDate).setParameter("endDate", endDate);
        freedays = hq.list();
        return freedays; 
    }

    public static boolean isFreeday(Country country, Calendar date) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        String query = "select f from Freeday as f inner join f.country as c where c=:country and f.date=:date";
        Query hq = hs.createQuery(query);
        hq.setParameter("country", country).setParameter("date", date);
        return hq.uniqueResult()!= null;      
    }
}
