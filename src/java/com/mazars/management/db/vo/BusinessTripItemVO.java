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
public class BusinessTripItemVO {
    private Long id;
    private Calendar day;
    private Date modifiedAt;

    public BusinessTripItemVO() {
    }
    public BusinessTripItemVO(BusinessTripItem businessTripItem) {
        this.id = businessTripItem.getId();
        this.day = businessTripItem.getDay();
        this.modifiedAt = businessTripItem.getModifiedAt();
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

    public Date getModifiedAt() {
        return modifiedAt;
    }

    public void setModifiedAt(Date modifiedAt) {
        this.modifiedAt = modifiedAt;
    }

}
