/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.db.domain;
import com.mazars.management.db.util.HibernateUtil;
import java.util.Calendar;
import org.hibernate.Session;
import java.util.List;
import java.util.Set;
import java.util.HashSet;
import org.hibernate.Query;

/**
 *
 * @author glazov
 */
public class MailoutAttachment {
    private Long id;
    private Mailout mailout;
    private String name;
    private String source;
    
    public MailoutAttachment() {};

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Mailout getMailout() {
        return mailout;
    }

    public void setMailout(Mailout mailout) {
        this.mailout = mailout;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }

}
