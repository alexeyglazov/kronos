package com.mazars.management.db.domain;
import com.mazars.management.db.util.HibernateUtil;
import java.math.BigDecimal;
import java.util.Calendar;
import java.util.LinkedList;
import java.util.List;
import org.hibernate.Query;
import org.hibernate.Session;

public class FeesAct {
    private Long id;
    private BigDecimal amount;
    private BigDecimal cvAmount;
    private Calendar date;
    private Boolean isSigned;
    private String reference;
    private String stamp;
    
    private FeesItem feesItem;
    public FeesAct() {}

    public String getStamp() {
        return stamp;
    }

    public void setStamp(String stamp) {
        this.stamp = stamp;
    }

    public Boolean getIsSigned() {
        return isSigned;
    }

    public void setIsSigned(Boolean isSigned) {
        this.isSigned = isSigned;
    }

    public String getReference() {
        return reference;
    }

    public void setReference(String reference) {
        this.reference = reference;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public BigDecimal getCvAmount() {
        return cvAmount;
    }

    public void setCvAmount(BigDecimal cvAmount) {
        this.cvAmount = cvAmount;
    }

    public Calendar getDate() {
        return date;
    }

    public void setDate(Calendar date) {
        this.date = date;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public FeesItem getFeesItem() {
        return feesItem;
    }

    public void setFeesItem(FeesItem feesItem) {
        this.feesItem = feesItem;
    }
    public static List<ProjectCode> getProjectCodes(List<Subdepartment> subdepartments, Calendar lastActDateStart, Calendar lastActDateEnd, Boolean isClosed) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        String query = "";
        query += "select pc from ProjectCode as pc ";
        query += "inner join pc.subdepartment as s ";
        query += "inner join pc.feesItem as fi ";
        query += "inner join fi.feesActs as fa ";
        query += "where ";
        query += "s in (:subdepartments) ";
        query += "and pc.isClosed=:isClosed ";
        //if(lastActDateStart != null) {
        //    query += "and fa.date>=:actDateStart ";
        //}
        //if(lastActDateEnd != null) {
        //    query += "and fa.date<=:actDateEnd ";
        //}
        query += "group by pc ";
        query += "having ";
        boolean isUsed = false;
        if(lastActDateStart != null) {
            if(isUsed) {
                query += "and ";
            }
            query += "max(fa.date)>=:actDateStart ";
            isUsed = true;
        }
        if(lastActDateEnd != null) {
            if(isUsed) {
                query += "and ";
            }
            query += "max(fa.date)<=:actDateEnd ";
            isUsed = true;
        }
        Query hq = hs.createQuery(query);
        hq.setParameterList("subdepartments", subdepartments);
        hq.setParameter("isClosed", isClosed);
        if(lastActDateStart != null) {
            hq.setParameter("actDateStart", lastActDateStart);
        }
        if(lastActDateEnd != null) {
            hq.setParameter("actDateEnd", lastActDateEnd);
        }
        
        return (List<ProjectCode>)hq.list();
    }
}
