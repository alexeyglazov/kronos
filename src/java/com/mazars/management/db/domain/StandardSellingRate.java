/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.db.domain;
import java.math.BigDecimal;
import java.util.Objects;
/**
 *
 * @author glazov
 */
public class StandardSellingRate {
    private Long id;
    private BigDecimal amount;
    private Position position;
    private StandardSellingRateGroup standardSellingRateGroup;

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Position getPosition() {
        return position;
    }

    public void setPosition(Position position) {
        this.position = position;
    }

    public StandardSellingRateGroup getStandardSellingRateGroup() {
        return standardSellingRateGroup;
    }

    public void setStandardSellingRateGroup(StandardSellingRateGroup standardSellingRateGroup) {
        this.standardSellingRateGroup = standardSellingRateGroup;
    }

    @Override
    public int hashCode() {
        int hash = 7;
        hash = 89 * hash + Objects.hashCode(this.id);
        return hash;
    }

    @Override
    public boolean equals(Object obj) {
        if (obj == null) {
            return false;
        }
        if (!(obj instanceof StandardSellingRate)) {
            return false;
        }
        final StandardSellingRate other = (StandardSellingRate) obj;
        if (!Objects.equals(this.id, other.id)) {
            return false;
        }
        return true;
    }

}
