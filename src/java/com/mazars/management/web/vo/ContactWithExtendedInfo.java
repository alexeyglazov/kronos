/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mazars.management.web.vo;

import com.mazars.management.db.domain.Client;
import com.mazars.management.db.domain.Contact;
import com.mazars.management.db.domain.Group;
import com.mazars.management.db.domain.ISOCountry;

/**
 *
 * @author glazov
 */
public class ContactWithExtendedInfo { 
    private Long id;
    private Contact.Gender gender;
    private String firstName;
    private String lastName;
    private String firstNameLocalLanguage;
    private String lastNameLocalLanguage;
    private String comment;
    private Contact.NormalPosition normalPosition;
    private String otherNormalPosition;
    private String language;
    private String residencialCountryName;
    private Boolean isClientsAddressUsed;
    private String street;
    private String zipCode;
    private String city;
    private String countryName;
    private Contact.PresentType presentType;
    private Boolean isNewsletters;
    private Boolean isReminder;                                            
    private String directPhone;
    private String mobilePhone;
    private String email;
    private Boolean isActive;
    
    private Long groupId;
    private String groupName;
    private Long clientId;
    private String clientName;

    public ContactWithExtendedInfo() {
    }

    public ContactWithExtendedInfo(Contact contact, Client client, Group group, ISOCountry clientLegalCountry, ISOCountry clientPostalCountry, ISOCountry country, ISOCountry residencialCountry) {
        if(contact != null) {
            this.id = contact.getId();
            this.gender = contact.getGender();
            this.firstName = contact.getFirstName();
            this.lastName = contact.getLastName();
            this.firstNameLocalLanguage = contact.getFirstNameLocalLanguage();
            this.lastNameLocalLanguage = contact.getLastNameLocalLanguage();
            this.normalPosition = contact.getNormalPosition();
            this.otherNormalPosition = contact.getOtherNormalPosition();
            this.comment = contact.getComment();
            this.directPhone = contact.getDirectPhone();
            this.mobilePhone = contact.getMobilePhone();
            this.email = contact.getEmail();
            this.language = contact.getLanguage();
            
            this.presentType = contact.getPresentType();
            this.isNewsletters = contact.getIsNewsletters();
            this.isReminder = contact.getIsReminder();
            this.isClientsAddressUsed = contact.getIsClientsAddressUsed();
            if(residencialCountry != null) {
                this.residencialCountryName = residencialCountry.getName();
            }
            
            
            ISOCountry tmpCountry = country;
            this.street = contact.getStreet();
            this.zipCode = contact.getZipCode();
            this.city = contact.getCity();
            if(Boolean.TRUE.equals(contact.getIsClientsAddressUsed())) {
                if(Boolean.TRUE.equals(client.getIsPostalAddressEqualToLegal())) {
                    tmpCountry = clientLegalCountry;
                    this.street = client.getLegalStreet();
                    this.zipCode = client.getLegalZipCode();
                    this.city = client.getLegalCity();
                } else {
                    tmpCountry = clientPostalCountry;
                    this.street = client.getPostalStreet();
                    this.zipCode = client.getPostalZipCode();
                    this.city = client.getPostalCity();                    
                }
            }
            if(tmpCountry != null) {
                this.countryName = tmpCountry.getName();
            }    
            
            this.isActive = contact.getIsActive();
        }
        if(client != null) {
            this.clientId = client.getId();
            this.clientName = client.getName();
        }
        if(group != null) {
            this.groupId = group.getId();
            this.groupName = group.getName();
        }        
    }

    public Contact.Gender getGender() {
        return gender;
    }

    public void setGender(Contact.Gender gender) {
        this.gender = gender;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public String getResidencialCountryName() {
        return residencialCountryName;
    }

    public void setResidencialCountryName(String residencialCountryName) {
        this.residencialCountryName = residencialCountryName;
    }

    public Boolean isIsClientsAddressUsed() {
        return isClientsAddressUsed;
    }

    public void setIsClientsAddressUsed(Boolean isClientsAddressUsed) {
        this.isClientsAddressUsed = isClientsAddressUsed;
    }

    public String getStreet() {
        return street;
    }

    public void setStreet(String street) {
        this.street = street;
    }

    public String getZipCode() {
        return zipCode;
    }

    public void setZipCode(String zipCode) {
        this.zipCode = zipCode;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getCountryName() {
        return countryName;
    }

    public void setCountryName(String countryName) {
        this.countryName = countryName;
    }

    public Contact.PresentType getPresentType() {
        return presentType;
    }

    public void setPresentType(Contact.PresentType presentType) {
        this.presentType = presentType;
    }

    public Boolean isIsNewsletters() {
        return isNewsletters;
    }

    public void setIsNewsletters(Boolean isNewsletters) {
        this.isNewsletters = isNewsletters;
    }

    public Boolean isIsReminder() {
        return isReminder;
    }

    public void setIsReminder(Boolean isReminder) {
        this.isReminder = isReminder;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public Contact.NormalPosition getNormalPosition() {
        return normalPosition;
    }

    public void setNormalPosition(Contact.NormalPosition normalPosition) {
        this.normalPosition = normalPosition;
    }

    public String getFirstNameLocalLanguage() {
        return firstNameLocalLanguage;
    }

    public void setFirstNameLocalLanguage(String firstNameLocalLanguage) {
        this.firstNameLocalLanguage = firstNameLocalLanguage;
    }

    public String getLastNameLocalLanguage() {
        return lastNameLocalLanguage;
    }

    public void setLastNameLocalLanguage(String lastNameLocalLanguage) {
        this.lastNameLocalLanguage = lastNameLocalLanguage;
    }

    public String getDirectPhone() {
        return directPhone;
    }

    public void setDirectPhone(String directPhone) {
        this.directPhone = directPhone;
    }

    public String getMobilePhone() {
        return mobilePhone;
    }

    public void setMobilePhone(String mobilePhone) {
        this.mobilePhone = mobilePhone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getOtherNormalPosition() {
        return otherNormalPosition;
    }

    public void setOtherNormalPosition(String otherNormalPosition) {
        this.otherNormalPosition = otherNormalPosition;
    }

    public Boolean isIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }
 
    public Long getGroupId() {
        return groupId;
    }

    public void setGroupId(Long groupId) {
        this.groupId = groupId;
    }

    public String getGroupName() {
        return groupName;
    }

    public void setGroupName(String groupName) {
        this.groupName = groupName;
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
}
