/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.db.vo;
import com.mazars.management.db.domain.*;
import java.util.Calendar;
import java.util.Date;

/**
 *
 * @author glazov
 */
public class TimeSpentItemVO {
    private Long id;
    private Calendar day;
    private Integer timeSpent;
    private String description;
    private Date modifiedAt;

    public TimeSpentItemVO() {
    }
    public TimeSpentItemVO(TimeSpentItem timeSpentItem) {
        this.id = timeSpentItem.getId();
        this.day = timeSpentItem.getDay();
        this.timeSpent = timeSpentItem.getTimeSpent();
        this.description = timeSpentItem.getDescription();
        this.modifiedAt = timeSpentItem.getModifiedAt();
    }

    public Calendar getDay() {
        return day;
    }

    public void setDay(Calendar day) {
        this.day = day;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Date getModifiedAt() {
        return modifiedAt;
    }

    public void setModifiedAt(Date modifiedAt) {
        this.modifiedAt = modifiedAt;
    }

    public Integer getTimeSpent() {
        return timeSpent;
    }

    public void setTimeSpent(Integer timeSpent) {
        this.timeSpent = timeSpent;
    }
}
