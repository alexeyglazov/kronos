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
public class FeesActVOH extends FeesActVO {
    private Long feesItemId;

    public FeesActVOH() {
        super();
    }

    public FeesActVOH(FeesAct feesAct) {
        super(feesAct);
        if(feesAct.getFeesItem() != null) {
            feesItemId = feesAct.getFeesItem().getId();
        }
    }

    public Long getFeesItemId() {
        return feesItemId;
    }

    public void setFeesItemId(Long feesItemId) {
        this.feesItemId = feesItemId;
    }

}
