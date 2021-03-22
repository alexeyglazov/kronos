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
public class MailoutBody {
    private Long id;
    private Mailout mailout;
    private String name;
    private String content;
    
    public MailoutBody() {};

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

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

}
