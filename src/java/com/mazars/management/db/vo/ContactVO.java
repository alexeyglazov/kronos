package com.mazars.management.db.vo;
import com.mazars.management.db.domain.*;
import com.mazars.management.db.domain.Contact.Gender;
import com.mazars.management.db.domain.Contact.NormalPosition;
import java.util.LinkedList;
import java.util.List;

public class ContactVO {
    private Long id;
    private Contact.Gender gender;
    private String firstName;
    private String lastName;
    private String firstNameLocalLanguage;
    private String lastNameLocalLanguage;
    private String comment;
    private String directPhone;
    private String mobilePhone;
    private String email;
    private String language;
    
    private Boolean isClientsAddressUsed;
    private String street;
    private String zipCode;
    private String city;

    private Contact.NormalPosition normalPosition;
    private String otherNormalPosition;
    private Contact.PresentType presentType;

    private Boolean isNewsletters;
    private Boolean isReminder;
    private Boolean isActive;

    public ContactVO() {}

    public ContactVO(Contact contact) {
        this.id = contact.getId();
        this.gender = contact.getGender();
        this.firstName = contact.getFirstName();
        this.lastName = contact.getLastName();
        this.firstNameLocalLanguage = contact.getFirstNameLocalLanguage();
        this.lastNameLocalLanguage = contact.getLastNameLocalLanguage();
        this.normalPosition = contact.getNormalPosition();
        this.comment = contact.getComment();
        this.directPhone = contact.getDirectPhone();
        this.mobilePhone = contact.getMobilePhone();
        this.email = contact.getEmail();
        this.language = contact.getLanguage();

        this.isClientsAddressUsed = contact.getIsClientsAddressUsed();
        this.street = contact.getStreet();
        this.zipCode = contact.getZipCode();
        this.city = contact.getCity();
        this.otherNormalPosition = contact.getOtherNormalPosition();
        this.presentType = contact.getPresentType();
                
        this.isNewsletters = contact.getIsNewsletters();
        this.isReminder = contact.getIsReminder();
        this.isActive = contact.getIsActive();       
    }

    public Boolean getIsClientsAddressUsed() {
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

    public String getOtherNormalPosition() {
        return otherNormalPosition;
    }

    public void setOtherNormalPosition(String otherNormalPosition) {
        this.otherNormalPosition = otherNormalPosition;
    }

    public Contact.PresentType getPresentType() {
        return presentType;
    }

    public void setPresentType(Contact.PresentType presentType) {
        this.presentType = presentType;
    }

    public String getDirectPhone() {
        return directPhone;
    }

    public void setDirectPhone(String directPhone) {
        this.directPhone = directPhone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getFirstNameLocalLanguage() {
        return firstNameLocalLanguage;
    }

    public void setFirstNameLocalLanguage(String firstNameLocalLanguage) {
        this.firstNameLocalLanguage = firstNameLocalLanguage;
    }

    public Gender getGender() {
        return gender;
    }

    public void setGender(Gender gender) {
        this.gender = gender;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    public Boolean getIsNewsletters() {
        return isNewsletters;
    }

    public void setIsNewsletters(Boolean isNewsletters) {
        this.isNewsletters = isNewsletters;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getLastNameLocalLanguage() {
        return lastNameLocalLanguage;
    }

    public void setLastNameLocalLanguage(String lastNameLocalLanguage) {
        this.lastNameLocalLanguage = lastNameLocalLanguage;
    }

    public String getMobilePhone() {
        return mobilePhone;
    }

    public void setMobilePhone(String mobilePhone) {
        this.mobilePhone = mobilePhone;
    }

    public NormalPosition getNormalPosition() {
        return normalPosition;
    }

    public void setNormalPosition(NormalPosition normalPosition) {
        this.normalPosition = normalPosition;
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

    public Boolean getIsReminder() {
        return isReminder;
    }

    public void setIsReminder(Boolean isReminder) {
        this.isReminder = isReminder;
    }
    public static List<ContactVO> getList(List<Contact> contacts) {
        List<ContactVO> contactVOs = new LinkedList<ContactVO>();
        if(contacts == null) {
            return null;
        }
        for(Contact contact : contacts) {
           contactVOs.add(new ContactVO(contact));
        }
        return contactVOs;
    }    
}
