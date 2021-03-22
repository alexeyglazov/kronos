/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.db.domain;
import com.mazars.management.db.util.HibernateUtil;
import java.util.Date;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.List;
import java.util.Set;
import javax.xml.bind.annotation.XmlEnum;
import javax.xml.bind.annotation.XmlType;
import org.hibernate.Query;
import org.hibernate.Session;

/**
 *
 * @author glazov
 */
public class InvoiceRequestPacket {
    @XmlType(name="InvoiceRequestStatus", namespace = "http://services.webservices.management.mazars.com/")   
    @XmlEnum
    public static enum Status {
        SUSPENDED,
        ACTIVE,
        LOCKED,
        CLOSED
    }
    private Long id;
    private ProjectCode projectCode;
    private Set<InvoiceRequest> invoiceRequests = new HashSet<InvoiceRequest>();
    private ActRequest actRequest;
    private TaxInvoiceRequest taxInvoiceRequest;
    private Boolean withVAT;
    private String comment;
    private Status status;
    private Set<InvoiceRequestPacketHistoryItem> invoiceRequestPacketHistoryItems = new HashSet<InvoiceRequestPacketHistoryItem>();
    
   
    private static List<Status> availabilityStatuses = new LinkedList<Status>();
    private static List<Status> editabilityStatuses = new LinkedList<Status>();
    static {
        availabilityStatuses.add(Status.ACTIVE);
        availabilityStatuses.add(Status.LOCKED);
    }
    static {
        editabilityStatuses.add(Status.SUSPENDED);
        editabilityStatuses.add(Status.ACTIVE);
        editabilityStatuses.add(Status.CLOSED);
    }
    
    public InvoiceRequestPacket() {};

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public ProjectCode getProjectCode() {
        return projectCode;
    }

    public void setProjectCode(ProjectCode projectCode) {
        this.projectCode = projectCode;
    }

    public Set<InvoiceRequest> getInvoiceRequests() {
        return invoiceRequests;
    }

    public void setInvoiceRequests(Set<InvoiceRequest> invoiceRequests) {
        this.invoiceRequests = invoiceRequests;
    }

    public ActRequest getActRequest() {
        return actRequest;
    }

    public void setActRequest(ActRequest actRequest) {
        this.actRequest = actRequest;
    }

    public TaxInvoiceRequest getTaxInvoiceRequest() {
        return taxInvoiceRequest;
    }

    public void setTaxInvoiceRequest(TaxInvoiceRequest taxInvoiceRequest) {
        this.taxInvoiceRequest = taxInvoiceRequest;
    }

    public Set<InvoiceRequestPacketHistoryItem> getInvoiceRequestPacketHistoryItems() {
        return invoiceRequestPacketHistoryItems;
    }

    public void setInvoiceRequestPacketHistoryItems(Set<InvoiceRequestPacketHistoryItem> invoiceRequestPacketHistoryItems) {
        this.invoiceRequestPacketHistoryItems = invoiceRequestPacketHistoryItems;
    }

    public Boolean getWithVAT() {
        return withVAT;
    }

    public void setWithVAT(Boolean withVAT) {
        this.withVAT = withVAT;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public static List<Status> getAvailabilityStatuses() {
        return availabilityStatuses;
    }

    public static List<Status> getEditabilityStatuses() {
        return editabilityStatuses;
    }

    public Boolean hasStatusInHistory(InvoiceRequestPacket.Status status) {
        Boolean hasStatusInHistory = false;
        for(InvoiceRequestPacketHistoryItem invoiceRequestPacketHistoryItem : this.getInvoiceRequestPacketHistoryItems()) {
            if(status.equals(invoiceRequestPacketHistoryItem.getStatus())) {
                return true;
            }
        }
        return hasStatusInHistory;
    } 
    public Date getModifiedAt() {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        String query = "";
        query += "select max(irphi.time) from InvoiceRequestPacket as irp ";
        query += "inner join irp.invoiceRequestPacketHistoryItems as irphi ";
        query += "where ";
        query += "irp=:invoiceRequestPacket ";
        query += "group by irp ";
        Query hq = hs.createQuery(query);
        hq.setParameter("invoiceRequestPacket", this);
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
        query += "select min(irphi.time) from InvoiceRequestPacket as irp ";
        query += "inner join irp.invoiceRequestPacketHistoryItems as irphi ";
        query += "where ";
        query += "irp=:invoiceRequestPacket ";
        query += "group by irp ";
        Query hq = hs.createQuery(query);
        hq.setParameter("invoiceRequestPacket", this);
        List<Date> selection = (List<Date>)hq.list();
        Date createdAt = null;
        if(selection.size() > 0) {
            createdAt = selection.get(0);
        }
        return createdAt;
    }    
    public static List<InvoiceRequestPacket> getList(Country country, List<InvoiceRequestPacket.Status> statuses) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        List<InvoiceRequestPacket> invoiceRequestPackets = new LinkedList<InvoiceRequestPacket>();
        String query = "";
        query += "select irp from InvoiceRequestPacket as irp ";
        query += "inner join irp.projectCode as pc ";
        query += "inner join pc.subdepartment as s ";
        query += "inner join s.department as d ";
        query += "inner join d.office as o ";
        query += "inner join o.country as c ";
        query += "where ";
        query += "c=:country ";
        query += "and irp.status in :statuses ";
        Query hq = hs.createQuery(query);
        hq.setParameter("country", country);
        hq.setParameterList("statuses", statuses);
        invoiceRequestPackets = (List<InvoiceRequestPacket>)hq.list();
        return invoiceRequestPackets;
    }
    public static List<InvoiceRequestPacket> getList(Employee employee, Module module, List<InvoiceRequestPacket.Status> statuses) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        List<InvoiceRequestPacket> invoiceRequestPackets = new LinkedList<InvoiceRequestPacket>();
        String query = "";
        query += "select irp from InvoiceRequestPacket as irp ";
        query += "inner join irp.projectCode as pc ";
        query += "inner join pc.subdepartment as s ";
        query += "inner join s.rightsItems as ri ";
        query += "inner join ri.employee as e ";
        query += "inner join ri.module as m ";
        query += "where ";
        query += "e=:employee ";
        query += "and m=:module ";
        query += "and irp.status in :statuses ";
        Query hq = hs.createQuery(query);
        hq.setParameter("employee", employee);
        hq.setParameter("module", module);
        hq.setParameterList("statuses", statuses);
        invoiceRequestPackets = (List<InvoiceRequestPacket>)hq.list();
        return invoiceRequestPackets;
    }    
}
