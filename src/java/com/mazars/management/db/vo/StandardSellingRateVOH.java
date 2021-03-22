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
public class StandardSellingRateVOH extends StandardSellingRateVO {
    private Long positionId;
    public StandardSellingRateVOH() {}

    public StandardSellingRateVOH(StandardSellingRate standardSellingRate) {
        super(standardSellingRate);
        if(standardSellingRate.getPosition() != null) {
            this.positionId = standardSellingRate.getPosition().getId();
        }
    }

    public Long getPositionId() {
        return positionId;
    }

    public void setPositionId(Long positionId) {
        this.positionId = positionId;
    }


}
