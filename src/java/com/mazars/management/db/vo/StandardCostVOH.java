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
public class StandardCostVOH extends StandardCostVO {
    private Long positionId;
    public StandardCostVOH() {}

    public StandardCostVOH(StandardCost standardCost) {
        super(standardCost);
        if(standardCost.getPosition() != null) {
            this.positionId = standardCost.getPosition().getId();
        }
    }

    public Long getPositionId() {
        return positionId;
    }

    public void setPositionId(Long positionId) {
        this.positionId = positionId;
    }
}
