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
public class OutOfPocketInvoiceVOH extends OutOfPocketInvoiceVO {
    private Long outOfPocketItemId;

    public OutOfPocketInvoiceVOH() {
        super();
    }

    public OutOfPocketInvoiceVOH(OutOfPocketInvoice outOfPocketInvoice) {
        super(outOfPocketInvoice);
        if(outOfPocketInvoice.getOutOfPocketItem() != null) {
            outOfPocketItemId = outOfPocketInvoice.getOutOfPocketItem().getId();
        }
    }

    public Long getOutOfPocketItemId() {
        return outOfPocketItemId;
    }

    public void setOutOfPocketItemId(Long outOfPocketItemId) {
        this.outOfPocketItemId = outOfPocketItemId;
    }
}
