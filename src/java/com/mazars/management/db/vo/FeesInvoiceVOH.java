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
public class FeesInvoiceVOH extends FeesInvoiceVO {
    private Long feesItemId;

    public FeesInvoiceVOH() {
        super();
    }

    public FeesInvoiceVOH(FeesInvoice feesInvoice) {
        super(feesInvoice);
        if(feesInvoice.getFeesItem() != null) {
            feesItemId = feesInvoice.getFeesItem().getId();
        }
    }

    public Long getFeesItemId() {
        return feesItemId;
    }

    public void setFeesItemId(Long feesItemId) {
        this.feesItemId = feesItemId;
    }

}
