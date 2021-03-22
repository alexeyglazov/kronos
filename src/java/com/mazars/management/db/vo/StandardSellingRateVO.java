/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.db.vo;
import com.mazars.management.db.domain.*;
import java.math.BigDecimal;

/**
 *
 * @author glazov
 */
public class StandardSellingRateVO {
    private Long id;
    private BigDecimal amount;
    public StandardSellingRateVO() {}

    public StandardSellingRateVO(StandardSellingRate standardSellingRate) {
        this.id = standardSellingRate.getId();
        this.amount = standardSellingRate.getAmount();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }
}
