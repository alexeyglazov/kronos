/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.db.domain;
import com.mazars.management.db.util.HibernateUtil;
import java.math.BigDecimal;
import org.hibernate.Session;
import java.util.List;
import java.util.Set;
import java.util.HashSet;

/**
 *
 * @author glazov
 */
public class InvoiceRequestItem {
    private Long id;
    private InvoiceRequest invoiceRequest;
    private String name;
    private BigDecimal amount;

    public InvoiceRequestItem() {};

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public InvoiceRequest getInvoiceRequest() {
        return invoiceRequest;
    }

    public void setInvoiceRequest(InvoiceRequest invoiceRequest) {
        this.invoiceRequest = invoiceRequest;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }
    public static List<InvoiceRequestItem> getAll() {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<InvoiceRequestItem>)hs.createQuery("select iri from InvoiceRequestItem as iri").list();
    }    
}
