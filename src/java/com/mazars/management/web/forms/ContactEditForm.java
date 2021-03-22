/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.web.forms;
import com.google.gson.Gson;
import com.mazars.management.db.domain.*;
import com.mazars.management.db.domain.Contact.Gender;
import com.mazars.management.db.domain.Contact.NormalPosition;


/**
 *
 * @author glazov
 */
public class ContactEditForm {
    public enum Mode {
        CREATE,
        UPDATE
    }
    private ContactEditForm.Mode mode;
    private Long id;
    private Long clientId;
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
    private Long residencialCountryId;
    private Boolean isReminder;
    private Boolean isNewsletters;
    private Boolean isActive;
    private String reason;
    
    private Boolean isClientsAddressUsed;
    private String street;
    private String zipCode;
    private String city;
    private Long countryId;    
    private Contact.NormalPosition normalPosition;
    private String otherNormalPosition;
    private Contact.PresentType presentType;

    public ContactEditForm() {
    }

    public Long getClientId() {
        return clientId;
    }

    public void setClientId(Long clientId) {
        this.clientId = clientId;
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

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
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

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
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

    public Mode getMode() {
        return mode;
    }

    public void setMode(Mode mode) {
        this.mode = mode;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public NormalPosition getNormalPosition() {
        return normalPosition;
    }

    public void setNormalPosition(NormalPosition normalPosition) {
        this.normalPosition = normalPosition;
    }

    public Long getResidencialCountryId() {
        return residencialCountryId;
    }

    public void setResidencialCountryId(Long residencialCountryId) {
        this.residencialCountryId = residencialCountryId;
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

    public Long getCountryId() {
        return countryId;
    }

    public void setCountryId(Long countryId) {
        this.countryId = countryId;
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

    public Boolean getIsReminder() {
        return isReminder;
    }

    public void setIsReminder(Boolean isReminder) {
        this.isReminder = isReminder;
    }

    public static ContactEditForm getFromJson(String json) {
        Gson gson = new Gson();
        return gson.fromJson(json, ContactEditForm.class);
    }

}
