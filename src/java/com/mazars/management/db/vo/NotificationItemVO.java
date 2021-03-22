/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.db.vo;
import com.mazars.management.db.domain.*;
import com.mazars.management.db.domain.LeavesItem.Type;
import com.mazars.management.db.util.HibernateUtil;
import org.hibernate.Session;
import java.util.List;
import java.util.Set;
import java.util.HashSet;
import java.util.Calendar;
/**
 *
 * @author glazov
 */
public class NotificationItemVO {
    private Long id;
    private NotificationItem.Event event;
    public NotificationItemVO() {
    }
    public NotificationItemVO(NotificationItem notificationItem) {
        this.id = notificationItem.getId();
        this.event = notificationItem.getEvent();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

}
