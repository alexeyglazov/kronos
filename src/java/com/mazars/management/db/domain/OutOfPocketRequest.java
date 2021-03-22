/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.db.domain;
import com.mazars.management.db.util.HibernateUtil;
import java.math.BigDecimal;
import java.util.Date;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.List;
import java.util.Set;
import org.hibernate.Query;
import org.hibernate.Session;

/**
 *
 * @author glazov
 */
public class OutOfPocketRequest {
    private Long id;
    private ProjectCode projectCode;
    private OutOfPocketItem.Type type;
    private BigDecimal amount;
    private Currency currency;
    private String description;
    private InvoiceRequestPacket.Status status;
    private Set<OutOfPocketRequestHistoryItem> outOfPocketRequestHistoryItems = new HashSet<OutOfPocketRequestHistoryItem>();
       
    public OutOfPocketRequest() {};

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ProjectCode getProjectCode() {
        return projectCode;
    }

    public void setProjectCode(ProjectCode projectCode) {
        this.projectCode = projectCode;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public OutOfPocketItem.Type getType() {
        return type;
    }

    public void setType(OutOfPocketItem.Type type) {
        this.type = type;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public Currency getCurrency() {
        return currency;
    }

    public void setCurrency(Currency currency) {
        this.currency = currency;
    }

    public Set<OutOfPocketRequestHistoryItem> getOutOfPocketRequestHistoryItems() {
        return outOfPocketRequestHistoryItems;
    }

    public void setOutOfPocketRequestHistoryItems(Set<OutOfPocketRequestHistoryItem> outOfPocketRequestHistoryItems) {
        this.outOfPocketRequestHistoryItems = outOfPocketRequestHistoryItems;
    }

    public InvoiceRequestPacket.Status getStatus() {
        return status;
    }

    public void setStatus(InvoiceRequestPacket.Status status) {
        this.status = status;
    }

    public Boolean hasStatusInHistory(InvoiceRequestPacket.Status status) {
        Boolean hasStatusInHistory = false;
        for(OutOfPocketRequestHistoryItem outOfPocketRequestHistoryItem : this.getOutOfPocketRequestHistoryItems()) {
            if(status.equals(outOfPocketRequestHistoryItem.getStatus())) {
                return true;
            }
        }
        return hasStatusInHistory;
    } 
    public Date getModifiedAt() {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        String query = "";
        query += "select max(ooprhi.time) from OutOfPocketRequest as oopr ";
        query += "inner join oopr.outOfPocketRequestHistoryItems as ooprhi ";
        query += "where ";
        query += "oopr=:outOfPocketRequest ";
        query += "group by oopr ";
        Query hq = hs.createQuery(query);
        hq.setParameter("outOfPocketRequest", this);
        List<Date> selection = (List<Date>)hq.list();
        Date modifiedAt = null;
        if(selection.size() > 0) {
            modifiedAt = selection.get(0);
        }
        return modifiedAt;
    }
    public Date getCreatedAt() {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        String query = "";
        query += "select min(ooprhi.time) from OutOfPocketRequest as oopr ";
        query += "inner join oopr.outOfPocketRequestHistoryItems as ooprhi ";
        query += "where ";
        query += "oopr=:outOfPocketRequest ";
        query += "group by oopr ";
        Query hq = hs.createQuery(query);
        hq.setParameter("outOfPocketRequest", this);
        List<Date> selection = (List<Date>)hq.list();
        Date createdAt = null;
        if(selection.size() > 0) {
            createdAt = selection.get(0);
        }
        return createdAt;
    }
    public static List<OutOfPocketRequest> getList(Country country, List<InvoiceRequestPacket.Status> statuses) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        List<OutOfPocketRequest> outOfPocketRequests = new LinkedList<OutOfPocketRequest>();
        String query = "";
        query += "select oopr from OutOfPocketRequest as oopr ";
        query += "inner join oopr.projectCode as pc ";
        query += "inner join pc.subdepartment as s ";
        query += "inner join s.department as d ";
        query += "inner join d.office as o ";
        query += "inner join o.country as c ";
        query += "where ";
        query += "c=:country ";
        query += "and oopr.status in :statuses ";
        Query hq = hs.createQuery(query);
        hq.setParameter("country", country);
        hq.setParameterList("statuses", statuses);
        outOfPocketRequests = (List<OutOfPocketRequest>)hq.list();
        return outOfPocketRequests;
    }
    public static List<OutOfPocketRequest> getList(Employee employee, Module module, List<InvoiceRequestPacket.Status> statuses) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        List<OutOfPocketRequest> outOfPocketRequests = new LinkedList<OutOfPocketRequest>();
        String query = "";
        query += "select oopr from OutOfPocketRequest as oopr ";
        query += "inner join oopr.projectCode as pc ";
        query += "inner join pc.subdepartment as s ";
        query += "inner join s.rightsItems as ri ";
        query += "inner join ri.employee as e ";
        query += "inner join ri.module as m ";
        query += "where ";
        query += "e=:employee ";
        query += "and m=:module ";
        query += "and oopr.status in :statuses ";
        Query hq = hs.createQuery(query);
        hq.setParameter("employee", employee);
        hq.setParameter("module", module);
        hq.setParameterList("statuses", statuses);
        outOfPocketRequests = (List<OutOfPocketRequest>)hq.list();
        return outOfPocketRequests;
    }    
}
