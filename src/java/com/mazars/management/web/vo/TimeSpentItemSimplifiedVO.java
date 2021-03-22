/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.web.vo;
import com.mazars.management.db.domain.*;
import java.util.Calendar;

/**
 *
 * @author glazov
 */
public class TimeSpentItemSimplifiedVO {
    private Long id;
    private Calendar day;
    private Integer timeSpent;

    public TimeSpentItemSimplifiedVO() {
    }
    public TimeSpentItemSimplifiedVO(TimeSpentItem timeSpentItem) {
        this.id = timeSpentItem.getId();
        this.day = timeSpentItem.getDay();
        this.timeSpent = timeSpentItem.getTimeSpent();
    }

    public Calendar getDay() {
        return day;
    }

    public void setDay(Calendar day) {
        this.day = day;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getTimeSpent() {
        return timeSpent;
    }

    public void setTimeSpent(Integer timeSpent) {
        this.timeSpent = timeSpent;
    }
}
