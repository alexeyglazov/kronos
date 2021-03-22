/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.db.domain;
import com.mazars.management.db.util.HibernateUtil;
import java.util.Calendar;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import org.hibernate.Query;
import org.hibernate.Session;

/**
 *
 * @author glazov
 */
public class MailoutTemplate {
    private Long id;
    private String name;
    private String description;
    private MailoutContent mailoutContent;
    private String jsonMailoutContent;
    
    public MailoutTemplate() {};

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public MailoutContent getMailoutContent() {
        return mailoutContent;
    }

    public void setMailoutContent(MailoutContent mailoutContent) {
        this.mailoutContent = mailoutContent;
    }

    public String getJsonMailoutContent() {
        return jsonMailoutContent;
    }

    public void setJsonMailoutContent(String jsonMailoutContent) {
        this.jsonMailoutContent = jsonMailoutContent;
    }

    public void makeJsonMailoutContent() {
        if(this.mailoutContent != null) {
            this.jsonMailoutContent = this.mailoutContent.getJSON();
        } else {
            this.jsonMailoutContent = null;
        }
    }
    public void makeMailoutContent() {
        this.mailoutContent = new MailoutContent(this.jsonMailoutContent);
    }
    public static List<MailoutTemplate> getMailoutTemplates() {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        String query = "select mt from MailoutTemplate as mt";
        Query hq = hs.createQuery(query);
        return (List<MailoutTemplate>)hq.list();
    }
}
