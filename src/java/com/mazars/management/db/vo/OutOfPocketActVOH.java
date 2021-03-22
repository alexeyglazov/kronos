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
public class OutOfPocketActVOH extends OutOfPocketActVO {
    private Long outOfPocketItemId;

    public OutOfPocketActVOH() {
        super();
    }

    public OutOfPocketActVOH(OutOfPocketAct outOfPocketAct) {
        super(outOfPocketAct);
        if(outOfPocketAct.getOutOfPocketItem() != null) {
            outOfPocketItemId = outOfPocketAct.getOutOfPocketItem().getId();
        }
    }

    public Long getOutOfPocketItemId() {
        return outOfPocketItemId;
    }

    public void setOutOfPocketItemId(Long outOfPocketItemId) {
        this.outOfPocketItemId = outOfPocketItemId;
    }

}
