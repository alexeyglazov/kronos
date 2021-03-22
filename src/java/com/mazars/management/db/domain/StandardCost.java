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
public class StandardCost {
    private Long id;
    private BigDecimal amount;
    private Position position;
    private StandardCostGroup standardCostGroup;

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

    public StandardCostGroup getStandardCostGroup() {
        return standardCostGroup;
    }

    public void setStandardCostGroup(StandardCostGroup standardCostGroup) {
        this.standardCostGroup = standardCostGroup;
    }

    @Override
    public int hashCode() {
        int hash = 7;
        hash = 11 * hash + Objects.hashCode(this.id);
        return hash;
    }

    @Override
    public boolean equals(Object obj) {
        if (obj == null) {
            return false;
        }
        if (!(obj instanceof StandardCost)) {
            return false;
        }
        final StandardCost other = (StandardCost) obj;
        if (!Objects.equals(this.id, other.id)) {
            return false;
        }
        return true;
    }
}
