/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.db.domain;
import com.mazars.management.db.util.HibernateUtil;
import java.util.Calendar;
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
public class InvoiceRequest {
    public static enum Status {
        SUSPENDED,
        ACTIVE,
        LOCKED,
        CLOSED
    }
    private Long id;
    private InvoiceRequestPacket invoiceRequestPacket;
    private Client client;
    private String reference;
    private String description;
    private Calendar date;
    private Currency invoiceCurrency;
    private Currency paymentCurrency;
    private Boolean isCancelled;
    private Boolean isExternallyCancelled;
       
    private Set<InvoiceRequestItem> invoiceRequestItems = new HashSet<InvoiceRequestItem>();

    public InvoiceRequest() {};

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public InvoiceRequestPacket getInvoiceRequestPacket() {
        return invoiceRequestPacket;
    }

    public void setInvoiceRequestPacket(InvoiceRequestPacket invoiceRequestPacket) {
        this.invoiceRequestPacket = invoiceRequestPacket;
    }

    public Client getClient() {
        return client;
    }

    public void setClient(Client client) {
        this.client = client;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Calendar getDate() {
        return date;
    }

    public void setDate(Calendar date) {
        this.date = date;
    }

    public Currency getInvoiceCurrency() {
        return invoiceCurrency;
    }

    public void setInvoiceCurrency(Currency invoiceCurrency) {
        this.invoiceCurrency = invoiceCurrency;
    }

    public Currency getPaymentCurrency() {
        return paymentCurrency;
    }

    public void setPaymentCurrency(Currency paymentCurrency) {
        this.paymentCurrency = paymentCurrency;
    }

    public Set<InvoiceRequestItem> getInvoiceRequestItems() {
        return invoiceRequestItems;
    }

    public void setInvoiceRequestItems(Set<InvoiceRequestItem> invoiceRequestItems) {
        this.invoiceRequestItems = invoiceRequestItems;
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
    public static List<InvoiceRequest> getList(Country country, List<InvoiceRequestPacket.Status> statuses) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        List<InvoiceRequest> invoiceRequests = new LinkedList<InvoiceRequest>();
        String query = "";
        query += "select ir from InvoiceRequest as ir ";
        query += "inner join ir.invoiceRequestPacket as irp ";
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
        invoiceRequests = (List<InvoiceRequest>)hq.list();
        return invoiceRequests;
    }
    public static List<InvoiceRequest> getList(Employee employee, Module module, List<InvoiceRequestPacket.Status> statuses) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        List<InvoiceRequest> invoiceRequests = new LinkedList<InvoiceRequest>();
        String query = "";
        query += "select ir from InvoiceRequest as ir ";
        query += "inner join ir.invoiceRequestPacket as irp ";
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
        invoiceRequests = (List<InvoiceRequest>)hq.list();
        return invoiceRequests;
    }
    public static List<InvoiceRequest> getAll() {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<InvoiceRequest>)hs.createQuery("select ir from InvoiceRequest as ir").list();
    }
    
}
