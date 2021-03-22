/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.db.vo;
import com.mazars.management.db.domain.*;
import java.util.Set;
import java.util.HashSet;

/**
 *
 * @author glazov
 */
public class NotificationItemVOH extends NotificationItemVO {
    private Long employeeId;

    public NotificationItemVOH() {
    }

    public NotificationItemVOH(NotificationItem notificationItem) {
        super(notificationItem);
        this.employeeId = notificationItem.getEmployee().getId();
    }

    public Long getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(Long employeeId) {
        this.employeeId = employeeId;
    }

}
