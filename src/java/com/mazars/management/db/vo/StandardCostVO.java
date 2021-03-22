/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.db.vo;
import com.mazars.management.db.domain.StandardCost;
import java.math.BigDecimal;

/**
 *
 * @author glazov
 */
public class StandardCostVO {
    private Long id;
    private BigDecimal amount;
    public StandardCostVO() {}

    public StandardCostVO(StandardCost standardCost) {
        this.id = standardCost.getId();
        this.amount = standardCost.getAmount();
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
