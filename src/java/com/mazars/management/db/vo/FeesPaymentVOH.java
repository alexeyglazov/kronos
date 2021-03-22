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
public class FeesPaymentVOH extends FeesPaymentVO {
    private Long feesItemId;

    public FeesPaymentVOH() {
        super();
    }

    public FeesPaymentVOH(FeesPayment feesPayment) {
        super(feesPayment);
        if(feesPayment.getFeesItem() != null) {
            feesItemId = feesPayment.getFeesItem().getId();
        }
    }

    public Long getFeesItemId() {
        return feesItemId;
    }

    public void setFeesItemId(Long feesItemId) {
        this.feesItemId = feesItemId;
    }

}
