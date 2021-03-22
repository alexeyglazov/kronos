/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.db.domain;

import com.mazars.management.db.util.HibernateUtil;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import org.hibernate.Query;
import org.hibernate.Session;

/**
 *
 * @author glazov
 */
public class SubdepartmentClientLink {
    private Long id;
    private Subdepartment subdepartment;
    private Client client;
    public SubdepartmentClientLink() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Subdepartment getSubdepartment() {
        return subdepartment;
    }

    public void setSubdepartment(Subdepartment subdepartment) {
        this.subdepartment = subdepartment;
    }

    public Client getClient() {
        return client;
    }

    public void setClient(Client client) {
        this.client = client;
    }
    public static Set<Subdepartment> getSubdepartments(Client client) {
        Set<Subdepartment> subdepartments = new HashSet<Subdepartment>();
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        String query = "";
        query += "select s from Client as c ";
        query += "inner join c.subdepartmentClientLinks as scl ";
        query += "inner join scl.subdepartment as s ";
        query += "where c=:client ";
        query += "group by s ";
        Query hq = hs.createQuery(query);
        hq.setParameter("client", client);
        subdepartments.addAll((List<Subdepartment>)hq.list());
        return subdepartments;
    }
    public static Set<Client> getClients(Subdepartment subdepartment) {
        Set<Client> clients = new HashSet<Client>();
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        String query = "";
        query += "select c from Client as c ";
        query += "inner join s.subdepartmentClientLinks as scl ";
        query += "inner join scl.subdepartment as s ";
        query += "where s=:subdepartment ";
        query += "group by c ";
        Query hq = hs.createQuery(query);
        hq.setParameter("subdepartment", subdepartment);
        clients.addAll((List<Client>)hq.list());
        return clients;
    }
    public static Set<Subdepartment> getSubdepartments(Group group) {
        Set<Subdepartment> subdepartments = new HashSet<Subdepartment>();
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        String query = "";
        query += "select s from Group as g ";
        query += "inner join g.clients as c ";
        query += "inner join c.subdepartmentClientLinks as scl ";
        query += "inner join scl.subdepartment as s ";
        query += "where g=:group";
        Query hq = hs.createQuery(query);
        hq.setParameter("group", group);
        subdepartments.addAll((List<Subdepartment>)hq.list());
        return subdepartments;
    }
    
    public static void linkClientSubdepartments(Client client, Set<Subdepartment> subdepartments) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        for(Subdepartment subdepartment : subdepartments) {
            SubdepartmentClientLink subdepartmentClientLink = new SubdepartmentClientLink();
            subdepartmentClientLink.setClient(client);
            subdepartmentClientLink.setSubdepartment(subdepartment);
            hs.save(subdepartmentClientLink);
        }        
    }
    public static void unlinkClientSubdepartments(Client client, Set<Subdepartment> subdepartments) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        for(SubdepartmentClientLink subdepartmentClientLink : client.getSubdepartmentClientLinks()) {
            if(subdepartments.contains(subdepartmentClientLink.getSubdepartment())) {
                hs.delete(subdepartmentClientLink);
            }
        }
    }   
}
