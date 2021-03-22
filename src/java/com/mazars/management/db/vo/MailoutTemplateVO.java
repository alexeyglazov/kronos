/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.db.vo;
import com.mazars.management.db.domain.*;
import java.util.LinkedList;
import java.util.List;

/**
 *
 * @author glazov
 */
public class MailoutTemplateVO {
    private Long id;
    private String name;
    private String description;
    
    public MailoutTemplateVO() {};

    public MailoutTemplateVO(MailoutTemplate mailoutTemplate) {
        this.id = mailoutTemplate.getId();
        this.name = mailoutTemplate.getName();
        this.description = mailoutTemplate.getDescription();
    }

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

    public static List<MailoutTemplateVO> getList(List<MailoutTemplate> mailoutTemplates) {
        List<MailoutTemplateVO> mailoutTemplateVOs = new LinkedList<MailoutTemplateVO>();
        if(mailoutTemplates == null) {
            return null;
        }
        for(MailoutTemplate mailoutTemplate : mailoutTemplates) {
           mailoutTemplateVOs.add(new MailoutTemplateVO(mailoutTemplate));
        }
        return mailoutTemplateVOs;
    }
}
