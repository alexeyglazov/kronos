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
public class ActRequestItem {
    private Long id;
    private ActRequest actRequest;
    private String name;
    private BigDecimal amount;

    public ActRequestItem() {};

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ActRequest getActRequest() {
        return actRequest;
    }

    public void setActRequest(ActRequest actRequest) {
        this.actRequest = actRequest;
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
    public static List<ActRequestItem> getAll() {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<ActRequestItem>)hs.createQuery("select ari from ActRequestItem as ari").list();
    }    
}
