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
public class TaxInvoiceRequest {
    public static enum Status {
        SUSPENDED,
        ACTIVE,
        LOCKED,
        CLOSED
    }    
    private Long id;
    private String reference;
    private Boolean isCancelled;
    private Boolean isExternallyCancelled;    

    private InvoiceRequestPacket invoiceRequestPacket;
    
    public TaxInvoiceRequest() {};

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getReference() {
        return reference;
    }

    public void setReference(String reference) {
        this.reference = reference;
    }

    public Boolean getIsCancelled() {
        return isCancelled;
    }

    public void setIsCancelled(Boolean isCancelled) {
        this.isCancelled = isCancelled;
    }

    public Boolean getIsExternallyCancelled() {
        return isExternallyCancelled;
    }

    public void setIsExternallyCancelled(Boolean isExternallyCancelled) {
        this.isExternallyCancelled = isExternallyCancelled;
    }

    public InvoiceRequestPacket getInvoiceRequestPacket() {
        return invoiceRequestPacket;
    }

    public void setInvoiceRequestPacket(InvoiceRequestPacket invoiceRequestPacket) {
        this.invoiceRequestPacket = invoiceRequestPacket;
    }

    public static List<TaxInvoiceRequest> getList(Country country, List<InvoiceRequestPacket.Status> statuses) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        List<TaxInvoiceRequest> taxInvoiceRequests = new LinkedList<TaxInvoiceRequest>();
        String query = "";
        query += "select tir from TaxInvoiceRequest as tir ";
        query += "inner join tir.invoiceRequestPacket as irp ";
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
        taxInvoiceRequests = (List<TaxInvoiceRequest>)hq.list();
        return taxInvoiceRequests;
    }
    public static List<TaxInvoiceRequest> getList(Employee employee, Module module, List<InvoiceRequestPacket.Status> statuses) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        List<TaxInvoiceRequest> taxInvoiceRequests = new LinkedList<TaxInvoiceRequest>();
        String query = "";
        query += "select tir from TaxInvoiceRequest as tir ";
        query += "inner join tir.invoiceRequestPacket as irp ";
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
        taxInvoiceRequests = (List<TaxInvoiceRequest>)hq.list();
        return taxInvoiceRequests;
    } 
}
