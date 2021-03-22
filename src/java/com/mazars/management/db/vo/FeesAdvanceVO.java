/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.db.vo;
import com.mazars.management.db.domain.*;
import com.mazars.management.db.util.HibernateUtil;
import java.math.BigDecimal;
import java.util.Calendar;
import org.hibernate.Session;
import java.util.List;
import java.util.Set;
import java.util.HashSet;
import java.util.LinkedList;

/**
 *
 * @author glazov
 */
public class FeesAdvanceVO {
    private Long id;
    private BigDecimal amount;
    private Calendar date;
    private Boolean isAdvance;

    public FeesAdvanceVO() {
    }
    public FeesAdvanceVO(FeesAdvance feesAdvance) {
        id = feesAdvance.getId();
        amount = feesAdvance.getAmount();
        date = feesAdvance.getDate();
        isAdvance = feesAdvance.getIsAdvance();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public Calendar getDate() {
        return date;
    }

    public void setDate(Calendar date) {
        this.date = date;
    }

    public Boolean getIsAdvance() {
        return isAdvance;
    }

    public void setIsAdvance(Boolean isAdvance) {
        this.isAdvance = isAdvance;
    }
    public static List<FeesAdvanceVO> getList(List<FeesAdvance> feesAdvances) {
        List<FeesAdvanceVO> feesAdvanceVOs = new LinkedList<FeesAdvanceVO>();
        if(feesAdvances == null) {
            return null;
        }
        for(FeesAdvance feesAdvance : feesAdvances) {
           feesAdvanceVOs.add(new FeesAdvanceVO(feesAdvance));
        }
        return feesAdvanceVOs;
    }
}
