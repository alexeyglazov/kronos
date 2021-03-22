/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.web.forms;
import com.google.gson.Gson;
import com.mazars.management.db.domain.Contact;
import com.mazars.management.db.domain.ContactHistoryItem;
import com.mazars.management.db.vo.DateRange;
import java.util.LinkedList;
import java.util.List;

/**
 *
 * @author glazov
 */
public class ContactManagerFilterForm {
    private String name;
    private List<String> emails = new LinkedList<String>();
    private List<Long> employeeIds = new LinkedList<Long>();
    private Boolean isEmployeeInChargePerson;
    private Boolean isEmployeeResponsiblePerson;
    
    private List<Long> subdepartmentIds = new LinkedList<Long>();
    private Boolean isSubdepartmentOfProjectCode;
    private Boolean isSubdepartmentOfResponsiblePerson;
    
    private Long groupId;
    private Long clientId;
    private Boolean isActive;
    private Boolean isNewsletters;
    private Boolean isReminder;
    private Contact.PresentType presentType;
    private Boolean contactHistoryItemPresent;
    private ContactHistoryItem.Status contactHistoryItemStatus;
    private DateRange contactHistoryItemRange;

    public ContactManagerFilterForm() {
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<String> getEmails() {
        return emails;
    }

    public void setEmails(List<String> emails) {
        this.emails = emails;
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

    public Boolean getIsReminder() {
        return isReminder;
    }

    public void setIsReminder(Boolean isReminder) {
        this.isReminder = isReminder;
    }

    public Contact.PresentType getPresentType() {
        return presentType;
    }

    public void setPresentType(Contact.PresentType presentType) {
        this.presentType = presentType;
    }

    public Boolean getContactHistoryItemPresent() {
        return contactHistoryItemPresent;
    }

    public void setContactHistoryItemPresent(Boolean contactHistoryItemPresent) {
        this.contactHistoryItemPresent = contactHistoryItemPresent;
    }

    public DateRange getContactHistoryItemRange() {
        return contactHistoryItemRange;
    }

    public void setContactHistoryItemRange(DateRange contactHistoryItemRange) {
        this.contactHistoryItemRange = contactHistoryItemRange;
    }

    public List<Long> getEmployeeIds() {
        return employeeIds;
    }

    public void setEmployeeIds(List<Long> employeeIds) {
        this.employeeIds = employeeIds;
    }

    public Boolean getIsEmployeeInChargePerson() {
        return isEmployeeInChargePerson;
    }

    public void setIsEmployeeInChargePerson(Boolean isEmployeeInChargePerson) {
        this.isEmployeeInChargePerson = isEmployeeInChargePerson;
    }

    public Boolean getIsEmployeeResponsiblePerson() {
        return isEmployeeResponsiblePerson;
    }

    public void setIsEmployeeResponsiblePerson(Boolean isEmployeeResponsiblePerson) {
        this.isEmployeeResponsiblePerson = isEmployeeResponsiblePerson;
    }

    public List<Long> getSubdepartmentIds() {
        return subdepartmentIds;
    }

    public void setSubdepartmentIds(List<Long> subdepartmentIds) {
        this.subdepartmentIds = subdepartmentIds;
    }

    public Boolean getIsSubdepartmentOfProjectCode() {
        return isSubdepartmentOfProjectCode;
    }

    public void setIsSubdepartmentOfProjectCode(Boolean isSubdepartmentOfProjectCode) {
        this.isSubdepartmentOfProjectCode = isSubdepartmentOfProjectCode;
    }

    public Boolean getIsSubdepartmentOfResponsiblePerson() {
        return isSubdepartmentOfResponsiblePerson;
    }

    public void setIsSubdepartmentOfResponsiblePerson(Boolean isSubdepartmentOfResponsiblePerson) {
        this.isSubdepartmentOfResponsiblePerson = isSubdepartmentOfResponsiblePerson;
    }

    public Long getGroupId() {
        return groupId;
    }

    public void setGroupId(Long groupId) {
        this.groupId = groupId;
    }

    public Long getClientId() {
        return clientId;
    }

    public void setClientId(Long clientId) {
        this.clientId = clientId;
    }

    public ContactHistoryItem.Status getContactHistoryItemStatus() {
        return contactHistoryItemStatus;
    }

    public void setContactHistoryItemStatus(ContactHistoryItem.Status contactHistoryItemStatus) {
        this.contactHistoryItemStatus = contactHistoryItemStatus;
    }

    public static ContactManagerFilterForm getFromJson(String json) {
        Gson gson = new Gson();
        return gson.fromJson(json, ContactManagerFilterForm.class);
    }
}
