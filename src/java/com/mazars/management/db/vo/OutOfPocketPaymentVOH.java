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
public class OutOfPocketPaymentVOH extends OutOfPocketPaymentVO {
    private Long outOfPocketItemId;

    public OutOfPocketPaymentVOH() {
        super();
    }

    public OutOfPocketPaymentVOH(OutOfPocketPayment outOfPocketPayment) {
        super(outOfPocketPayment);
        if(outOfPocketPayment.getOutOfPocketItem() != null) {
            outOfPocketItemId = outOfPocketPayment.getOutOfPocketItem().getId();
        }
    }

    public Long getOutOfPocketItemId() {
        return outOfPocketItemId;
    }

    public void setOutOfPocketItemId(Long outOfPocketItemId) {
        this.outOfPocketItemId = outOfPocketItemId;
    }

}
