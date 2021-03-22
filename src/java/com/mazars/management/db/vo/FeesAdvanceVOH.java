/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.db.vo;
import com.mazars.management.db.domain.*;


/**
 *
 * @author glazov
 */
public class FeesAdvanceVOH extends FeesAdvanceVO {
    private Long feesItemId;

    public FeesAdvanceVOH() {
        super();
    }
    public FeesAdvanceVOH(FeesAdvance feesAdvance) {
        super(feesAdvance);
        if(feesAdvance.getFeesItem() != null) {
            feesItemId = feesAdvance.getFeesItem().getId();
        }
    }

    public Long getFeesItemId() {
        return feesItemId;
    }

    public void setFeesItemId(Long feesItemId) {
        this.feesItemId = feesItemId;
    }

}
