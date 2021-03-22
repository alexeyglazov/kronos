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
public class PositionQuotationVOH extends PositionQuotationVO {
    private Long positionId;
    private Long feesItemId;

    public PositionQuotationVOH() {
        super();
    }
    public PositionQuotationVOH(PositionQuotation positionQuotation) {
        super(positionQuotation);
        if(positionQuotation.getPosition() != null) {
            positionId = positionQuotation.getPosition().getId();
        }
        if(positionQuotation.getFeesItem() != null) {
            feesItemId = positionQuotation.getFeesItem().getId();
        }
    }

    public Long getFeesItemId() {
        return feesItemId;
    }

    public void setFeesItemId(Long feesItemId) {
        this.feesItemId = feesItemId;
    }

    public Long getPositionId() {
        return positionId;
    }

    public void setPositionId(Long positionId) {
        this.positionId = positionId;
    }
}
