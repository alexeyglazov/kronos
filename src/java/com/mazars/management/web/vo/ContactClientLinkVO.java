/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.web.vo;

import com.mazars.management.db.domain.*;
import java.util.LinkedList;
import java.util.List;

/**
 *
 * @author Glazov
 */
public class ContactClientLinkVO {
    private Long id;
    private Long contactId;
    private String contactFirstName;
    private String contactLastName;
    private Long clientId;
    private String clientName;

    public ContactClientLinkVO() {
    }
    
    public ContactClientLinkVO(ContactClientLink contactClientLink) {
        Client client = contactClientLink.getClient();
        Contact contact = contactClientLink.getContact();
        this.id = contactClientLink.getId();
        this.contactId = contact.getId();
        this.contactFirstName = contact.getFirstName();
        this.contactLastName = contact.getLastName();
        this.clientId = client.getId();
        this.clientName = client.getName();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getContactId() {
        return contactId;
    }

    public void setContactId(Long contactId) {
        this.contactId = contactId;
    }

    public String getContactFirstName() {
        return contactFirstName;
    }

    public void setContactFirstName(String contactFirstName) {
        this.contactFirstName = contactFirstName;
    }

    public String getContactLastName() {
        return contactLastName;
    }

    public void setContactLastName(String contactLastName) {
        this.contactLastName = contactLastName;
    }

    public Long getClientId() {
        return clientId;
    }

    public void setClientId(Long clientId) {
        this.clientId = clientId;
    }

    public String getClientName() {
        return clientName;
    }

    public void setClientName(String clientName) {
        this.clientName = clientName;
    }

    public static List<ContactClientLinkVO> getList(List<ContactClientLink> contactClientLinks) {
        List<ContactClientLinkVO> contactClientLinkVOs = new LinkedList<ContactClientLinkVO>();
        if(contactClientLinks == null) {
            return null;
        }
        for(ContactClientLink contactClientLink : contactClientLinks) {
           contactClientLinkVOs.add(new ContactClientLinkVO(contactClientLink));
        }
        return contactClientLinkVOs;
    }
}
