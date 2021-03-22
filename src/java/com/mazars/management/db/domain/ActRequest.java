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
public class ActRequest {
    public static enum Status {
        SUSPENDED,
        ACTIVE,
        LOCKED,
        CLOSED
    }
    private Long id;
    private Client client;
    private String reference;
    private String description;
    private Calendar date;
    private Currency invoiceCurrency;
    private Currency paymentCurrency;
    private Boolean isCancelled;
    private Boolean isExternallyCancelled;

    private InvoiceRequestPacket invoiceRequestPacket;
    private Set<ActRequestItem> actRequestItems = new HashSet<ActRequestItem>();
    
    public ActRequest() {};
    public ActRequest(InvoiceRequest invoiceRequest) {
        //this.id = null;
        this.client = invoiceRequest.getClient();
        this.description = invoiceRequest.getDescription();
        this.date = invoiceRequest.getDate();
        this.invoiceCurrency = invoiceRequest.getInvoiceCurrency();
        this.paymentCurrency = invoiceRequest.getPaymentCurrency();
        this.isCancelled = invoiceRequest.getIsCancelled();
        this.isExternallyCancelled = invoiceRequest.getIsExternallyCancelled();
        this.invoiceRequestPacket = invoiceRequest.getInvoiceRequestPacket();
        for(InvoiceRequestItem invoiceRequestItem : invoiceRequest.getInvoiceRequestItems()) {
            ActRequestItem actRequestItem = new ActRequestItem();
            //actRequestItem.setId(null);
            actRequestItem.setName(invoiceRequestItem.getName());
            actRequestItem.setAmount(invoiceRequestItem.getAmount());
            actRequestItem.setActRequest(this);
            this.getActRequestItems().add(actRequestItem);
        }
    };
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Set<ActRequestItem> getActRequestItems() {
        return actRequestItems;
    }

    public void setActRequestItems(Set<ActRequestItem> actRequestItems) {
        this.actRequestItems = actRequestItems;
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

    public String getReference() {
        return reference;
    }

    public void setReference(String reference) {
        this.reference = reference;
    }

    public Boolean getIsCancelled() {
        return isCancelled;
    }

    public Boolean getIsExternallyCancelled() {
        return isExternallyCancelled;
    }

    public void setIsExternallyCancelled(Boolean isExternallyCancelled) {
        this.isExternallyCancelled = isExternallyCancelled;
    }

    public void setIsCancelled(Boolean isCancelled) {
        this.isCancelled = isCancelled;
    }

    public InvoiceRequestPacket getInvoiceRequestPacket() {
        return invoiceRequestPacket;
    }

    public void setInvoiceRequestPacket(InvoiceRequestPacket invoiceRequestPacket) {
        this.invoiceRequestPacket = invoiceRequestPacket;
    }
    
    public static List<ActRequest> getList(Country country, List<InvoiceRequestPacket.Status> statuses) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        List<ActRequest> actRequests = new LinkedList<ActRequest>();
        String query = "";
        query += "select ar from ActRequest as ar ";
        query += "inner join ar.invoiceRequestPacket as irp ";
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
        actRequests = (List<ActRequest>)hq.list();
        return actRequests;
    }
    public static List<ActRequest> getList(Employee employee, Module module, List<InvoiceRequestPacket.Status> statuses) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        List<ActRequest> actRequests = new LinkedList<ActRequest>();
        String query = "";
        query += "select ar from ActRequest as ar ";
        query += "inner join ar.invoiceRequestPacket as irp ";
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
        actRequests = (List<ActRequest>)hq.list();
        return actRequests;
    } 
    public static List<ActRequest> getAll() {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<ActRequest>)hs.createQuery("select ar from ActRequest as ar").list();
    }
}
