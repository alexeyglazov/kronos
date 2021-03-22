/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.web.vo;

import com.mazars.management.db.domain.ContactHistoryItem;
import com.mazars.management.db.domain.Employee;
import com.mazars.management.db.vo.YearMonthDateTime;
/**
 *
 * @author Glazov
 */
public class ContactHistoryItemVO {
    private Long id;
    private ContactHistoryItem.Status status;
    private String comment;
    private YearMonthDateTime modifiedAt;
    private Long modifiedById;
    private String modifiedByFirstName;
    private String modifiedByLastName;
    private String modifiedByUserName;

    public ContactHistoryItemVO() {}

    public ContactHistoryItemVO(ContactHistoryItem contactHistoryItem, Employee modifiedBy) {
        this.id = contactHistoryItem.getId();
        this.status = contactHistoryItem.getStatus();
        this.comment = contactHistoryItem.getComment();
        this.modifiedAt = new YearMonthDateTime(contactHistoryItem.getModifiedAt());
        if(modifiedBy != null) {
            this.modifiedById = modifiedBy.getId();
            this.modifiedByFirstName = modifiedBy.getFirstName();
            this.modifiedByLastName = modifiedBy.getLastName();
            this.modifiedByUserName = modifiedBy.getUserName();
        }
    }
    public ContactHistoryItemVO(ContactHistoryItem contactHistoryItem) {
        this(contactHistoryItem, contactHistoryItem.getModifiedBy());
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ContactHistoryItem.Status getStatus() {
        return status;
    }

    public void setStatus(ContactHistoryItem.Status status) {
        this.status = status;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public YearMonthDateTime getModifiedAt() {
        return modifiedAt;
    }

    public void setModifiedAt(YearMonthDateTime modifiedAt) {
        this.modifiedAt = modifiedAt;
    }

    public Long getModifiedById() {
        return modifiedById;
    }

    public void setModifiedById(Long modifiedById) {
        this.modifiedById = modifiedById;
    }

    public String getModifiedByFirstName() {
        return modifiedByFirstName;
    }

    public void setModifiedByFirstName(String modifiedByFirstName) {
        this.modifiedByFirstName = modifiedByFirstName;
    }

    public String getModifiedByLastName() {
        return modifiedByLastName;
    }

    public void setModifiedByLastName(String modifiedByLastName) {
        this.modifiedByLastName = modifiedByLastName;
    }

    public String getModifiedByUserName() {
        return modifiedByUserName;
    }

    public void setModifiedByUserName(String modifiedByUserName) {
        this.modifiedByUserName = modifiedByUserName;
    }

}
