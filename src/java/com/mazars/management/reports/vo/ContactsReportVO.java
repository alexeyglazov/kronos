/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.reports.vo;

import com.mazars.management.db.domain.Client;
import com.mazars.management.db.domain.Contact;
import com.mazars.management.db.domain.Employee;
import com.mazars.management.db.domain.Subdepartment;
import com.mazars.management.db.vo.*;
import com.mazars.management.reports.*;
import com.mazars.management.web.vo.OfficeDepartmentSubdepartment;
import com.mazars.management.web.vo.ShortEmployee;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.List;
import java.util.Set;
/**
 *
 * @author glazov
 */
public class ContactsReportVO {  
    public class Row {
        private String groupName;
        private String clientName;
        
        private Long contactId;
        private Contact.Gender contactGender;
        private String contactFirstName;
        private String contactLastName;
        private String contactFirstNameLocalLanguage;
        private String contactLastNameLocalLanguage;
        private String contactDirectPhone;
        private String contactMobilePhone;
        private String contactEmail;
        private Boolean contactIsClientsAddressUsed;
        private String contactStreet;
        private String contactZipCode;
        private String contactCity;
        private String contactCountryName;
        
        private String contactResidencialCountryName;
        private String contactLanguage;
        
        private String contactComment;
        private Contact.NormalPosition contactNormalPosition;
        private String contactOtherNormalPosition;
        
        private Contact.PresentType contactPresentType;
        private Boolean contactIsNewsletters;
        private Boolean contactIsReminder;
   
        private Boolean contactIsActive;
        private Set<Long> contactResponsiblePersonIds = new HashSet<Long>();
        private Set<Long> subdepartmentIds = new HashSet<Long>();
        
        public Row(ContactsReport.Row row) {
            if(row.getGroup() != null) {
                groupName = row.getGroup().getName() ;
            }
            Client client = row.getClient();
            if(client != null) {
                clientName = client.getName();
            }
            Contact contact = row.getContact();
            contactGender = contact.getGender();
            contactId = contact.getId();
            contactFirstName = contact.getFirstName();
            contactLastName = contact.getLastName();
            contactFirstNameLocalLanguage = contact.getFirstNameLocalLanguage();
            contactLastNameLocalLanguage = contact.getLastNameLocalLanguage();
            contactDirectPhone = contact.getDirectPhone();
            contactMobilePhone = contact.getMobilePhone();
            contactEmail = contact.getEmail();
            contactIsClientsAddressUsed = contact.getIsClientsAddressUsed();
            if(Boolean.TRUE.equals(contact.getIsClientsAddressUsed())) {
                contactStreet = client.getPostalStreet();
                contactZipCode = client.getPostalZipCode();
                contactCity = client.getPostalCity();
                if(row.getClientPostalCountry() != null) {
                    contactCountryName = row.getClientPostalCountry().getName();
                }
            } else {
                contactStreet = contact.getStreet();
                contactZipCode = contact.getZipCode();
                contactCity = contact.getCity();
                if(row.getContactCountry() != null) {
                    contactCountryName = row.getContactCountry().getName();
                }            
            }
            
            if(row.getContactResidencialCountry() != null) {
                contactResidencialCountryName = row.getContactResidencialCountry().getName();
            }
            contactLanguage = contact.getLanguage();
            contactComment = contact.getComment();
            contactNormalPosition = contact.getNormalPosition();
            if(Contact.NormalPosition.OTHER.equals(contact.getNormalPosition())) {
                contactOtherNormalPosition = contact.getOtherNormalPosition();
            }
           
            contactPresentType = contact.getPresentType();
            contactIsNewsletters = contact.getIsNewsletters();
            contactIsReminder = contact.getIsReminder();
            contactIsActive = contact.getIsActive();
            for(Employee responsiblePerson : row.getResponsiblePersons()) {
                contactResponsiblePersonIds.add(responsiblePerson.getId());
            }
            for(Subdepartment subdepartment : row.getSubdepartments()) {
                subdepartmentIds.add(subdepartment.getId());
            }
        }

        public String getGroupName() {
            return groupName;
        }

        public void setGroupName(String groupName) {
            this.groupName = groupName;
        }

        public String getClientName() {
            return clientName;
        }

        public void setClientName(String clientName) {
            this.clientName = clientName;
        }

        public Long getContactId() {
            return contactId;
        }

        public void setContactId(Long contactId) {
            this.contactId = contactId;
        }

        public Contact.Gender getContactGender() {
            return contactGender;
        }

        public void setContactGender(Contact.Gender contactGender) {
            this.contactGender = contactGender;
        }

        public Boolean isContactIsReminder() {
            return contactIsReminder;
        }

        public void setContactIsReminder(Boolean contactIsReminder) {
            this.contactIsReminder = contactIsReminder;
        }

        public Boolean isContactIsActive() {
            return contactIsActive;
        }

        public void setContactIsActive(Boolean contactIsActive) {
            this.contactIsActive = contactIsActive;
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

        public String getContactFirstNameLocalLanguage() {
            return contactFirstNameLocalLanguage;
        }

        public void setContactFirstNameLocalLanguage(String contactFirstNameLocalLanguage) {
            this.contactFirstNameLocalLanguage = contactFirstNameLocalLanguage;
        }

        public String getContactLastNameLocalLanguage() {
            return contactLastNameLocalLanguage;
        }

        public void setContactLastNameLocalLanguage(String contactLastNameLocalLanguage) {
            this.contactLastNameLocalLanguage = contactLastNameLocalLanguage;
        }

        public String getContactDirectPhone() {
            return contactDirectPhone;
        }

        public void setContactDirectPhone(String contactDirectPhone) {
            this.contactDirectPhone = contactDirectPhone;
        }

        public String getContactMobilePhone() {
            return contactMobilePhone;
        }

        public void setContactMobilePhone(String contactMobilePhone) {
            this.contactMobilePhone = contactMobilePhone;
        }

        public String getContactEmail() {
            return contactEmail;
        }

        public void setContactEmail(String contactEmail) {
            this.contactEmail = contactEmail;
        }

        public Boolean isContactIsClientsAddressUsed() {
            return contactIsClientsAddressUsed;
        }

        public void setContactIsClientsAddressUsed(Boolean contactIsClientsAddressUsed) {
            this.contactIsClientsAddressUsed = contactIsClientsAddressUsed;
        }

        public String getContactStreet() {
            return contactStreet;
        }

        public void setContactStreet(String contactStreet) {
            this.contactStreet = contactStreet;
        }

        public String getContactZipCode() {
            return contactZipCode;
        }

        public void setContactZipCode(String contactZipCode) {
            this.contactZipCode = contactZipCode;
        }

        public String getContactCity() {
            return contactCity;
        }

        public void setContactCity(String contactCity) {
            this.contactCity = contactCity;
        }

        public String getContactCountryName() {
            return contactCountryName;
        }

        public void setContactCountryName(String contactCountryName) {
            this.contactCountryName = contactCountryName;
        }


        public String getContactResidencialCountryName() {
            return contactResidencialCountryName;
        }

        public void setContactResidencialCountryName(String contactResidencialCountryName) {
            this.contactResidencialCountryName = contactResidencialCountryName;
        }

        public String getContactLanguage() {
            return contactLanguage;
        }

        public void setContactLanguage(String contactLanguage) {
            this.contactLanguage = contactLanguage;
        }

        public String getContactComment() {
            return contactComment;
        }

        public void setContactComment(String contactComment) {
            this.contactComment = contactComment;
        }

        public Contact.NormalPosition getContactNormalPosition() {
            return contactNormalPosition;
        }

        public void setContactNormalPosition(Contact.NormalPosition contactNormalPosition) {
            this.contactNormalPosition = contactNormalPosition;
        }

        public Boolean isContactIsNewsletters() {
            return contactIsNewsletters;
        }

        public void setContactIsNewsletters(Boolean contactIsNewsletters) {
            this.contactIsNewsletters = contactIsNewsletters;
        }

        public Contact.PresentType getContactPresentType() {
            return contactPresentType;
        }

        public void setContactPresentType(Contact.PresentType contactPresentType) {
            this.contactPresentType = contactPresentType;
        }

        public String getContactOtherNormalPosition() {
            return contactOtherNormalPosition;
        }

        public void setContactOtherNormalPosition(String contactOtherNormalPosition) {
            this.contactOtherNormalPosition = contactOtherNormalPosition;
        }

        public Set<Long> getContactResponsiblePersonIds() {
            return contactResponsiblePersonIds;
        }

        public void setContactResponsiblePersonIds(Set<Long> contactResponsiblePersonIds) {
            this.contactResponsiblePersonIds = contactResponsiblePersonIds;
        }

        public Set<Long> getSubdepartmentIds() {
            return subdepartmentIds;
        }

        public void setSubdepartmentIds(Set<Long> subdepartmentIds) {
            this.subdepartmentIds = subdepartmentIds;
        }
    }

    List<Row> rows = new LinkedList<Row>();
    List<ShortEmployee> responsiblePersons = new LinkedList<ShortEmployee>();
    List<OfficeDepartmentSubdepartment> subdepartments = new LinkedList<OfficeDepartmentSubdepartment>();
    YearMonthDateTime createdAt;
    private String formOfficeName;
    private String formDepartmentName;
    private String formSubdepartmentName;
    private String formActivityName;
    private Contact.NormalPosition formNormalPosition;

    public ContactsReportVO(ContactsReport contactsReport) {
        for(ContactsReport.Row row : contactsReport.getRows()) {
            this.rows.add(new ContactsReportVO.Row(row));
        }
        for(Employee employee : contactsReport.getResponsiblePersons()) {
            this.responsiblePersons.add(new ShortEmployee(employee));
        }
        for(Subdepartment subdepartment : contactsReport.getSubdepartments()) {
            this.subdepartments.add(new OfficeDepartmentSubdepartment(subdepartment));
        }
        
        this.createdAt = new YearMonthDateTime(contactsReport.getCreatedAt());
        if(contactsReport.getFormOffice() != null) {
            this.formOfficeName = contactsReport.getFormOffice().getName();
        }
        if(contactsReport.getFormDepartment() != null) {
            this.formDepartmentName = contactsReport.getFormDepartment().getName();
        }
        if(contactsReport.getFormSubdepartment() != null) {
            this.formSubdepartmentName = contactsReport.getFormSubdepartment().getName();
        }
        if(contactsReport.getFormActivity() != null) {
            this.formActivityName = contactsReport.getFormActivity().getName();
        }
        if(contactsReport.getFormNormalPosition() != null) {
            this.formNormalPosition = contactsReport.getFormNormalPosition();
        }
    }

    public YearMonthDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(YearMonthDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public List<Row> getRows() {
        return rows;
    }

    public void setRows(List<Row> rows) {
        this.rows = rows;
    }

    public List<ShortEmployee> getResponsiblePersons() {
        return responsiblePersons;
    }

    public void setResponsiblePersons(List<ShortEmployee> responsiblePersons) {
        this.responsiblePersons = responsiblePersons;
    }

    public List<OfficeDepartmentSubdepartment> getSubdepartments() {
        return subdepartments;
    }

    public void setSubdepartments(List<OfficeDepartmentSubdepartment> subdepartments) {
        this.subdepartments = subdepartments;
    }

    public String getFormOfficeName() {
        return formOfficeName;
    }

    public void setFormOfficeName(String formOfficeName) {
        this.formOfficeName = formOfficeName;
    }

    public String getFormDepartmentName() {
        return formDepartmentName;
    }

    public void setFormDepartmentName(String formDepartmentName) {
        this.formDepartmentName = formDepartmentName;
    }

    public String getFormSubdepartmentName() {
        return formSubdepartmentName;
    }

    public void setFormSubdepartmentName(String formSubdepartmentName) {
        this.formSubdepartmentName = formSubdepartmentName;
    }

    public String getFormActivityName() {
        return formActivityName;
    }

    public void setFormActivityName(String formActivityName) {
        this.formActivityName = formActivityName;
    }

    public Contact.NormalPosition getFormNormalPosition() {
        return formNormalPosition;
    }

    public void setFormNormalPosition(Contact.NormalPosition formNormalPosition) {
        this.formNormalPosition = formNormalPosition;
    }
}
