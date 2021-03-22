/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.web.vo;

import com.mazars.management.db.domain.Employee;
import com.mazars.management.db.domain.Group;
import com.mazars.management.db.domain.GroupHistoryItem;
import com.mazars.management.db.vo.YearMonthDateTime;
/**
 *
 * @author Glazov
 */
public class GroupHistoryItemWithCreatedByVO {
    private Long id;
    private String name;
    private String countryName;
    private YearMonthDateTime createdAt;
    private Long groupId;
    private Long createdById;
    private String createdByUserName;
    private String createdByFirstName;
    private String createdByLastName;

    public GroupHistoryItemWithCreatedByVO() {}

    public GroupHistoryItemWithCreatedByVO(GroupHistoryItem groupHistoryItem) {
        this.id = groupHistoryItem.getId();
        this.name = groupHistoryItem.getName();
        this.countryName = groupHistoryItem.getCountryName();
        if(groupHistoryItem.getCreatedAt() != null) {
            this.createdAt = new YearMonthDateTime(groupHistoryItem.getCreatedAt());
        }
        Group group = groupHistoryItem.getGroup();
        Employee createdBy = groupHistoryItem.getCreatedBy();
        if(group != null) {
            this.groupId = group.getId();
        }
        this.createdById = createdBy.getId();
        this.createdByUserName = createdBy.getUserName();
        this.createdByFirstName = createdBy.getFirstName();
        this.createdByLastName = createdBy.getLastName();
    }

    public String getCountryName() {
        return countryName;
    }

    public void setCountryName(String countryName) {
        this.countryName = countryName;
    }

    public YearMonthDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(YearMonthDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public String getCreatedByFirstName() {
        return createdByFirstName;
    }

    public void setCreatedByFirstName(String createdByFirstName) {
        this.createdByFirstName = createdByFirstName;
    }

    public Long getCreatedById() {
        return createdById;
    }

    public void setCreatedById(Long createdById) {
        this.createdById = createdById;
    }

    public String getCreatedByLastName() {
        return createdByLastName;
    }

    public void setCreatedByLastName(String createdByLastName) {
        this.createdByLastName = createdByLastName;
    }

    public String getCreatedByUserName() {
        return createdByUserName;
    }

    public void setCreatedByUserName(String createdByUserName) {
        this.createdByUserName = createdByUserName;
    }

    public Long getGroupId() {
        return groupId;
    }

    public void setGroupId(Long groupId) {
        this.groupId = groupId;
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

}
