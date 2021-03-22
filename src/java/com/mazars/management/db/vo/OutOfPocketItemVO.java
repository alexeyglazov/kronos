/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.db.vo;
import com.mazars.management.db.domain.*;
import com.mazars.management.db.domain.OutOfPocketItem.Type;
import java.math.BigDecimal;
import java.util.Calendar;
/**
 *
 * @author glazov
 */
public class OutOfPocketItemVO {
    private Long id;
    private Calendar date;
    private OutOfPocketItem.Type type;
    private BigDecimal amount;

    public OutOfPocketItemVO() {
    }

    public OutOfPocketItemVO(OutOfPocketItem outOfPocketItem) {
        this.id = outOfPocketItem.getId();
        this.type = outOfPocketItem.getType();
        this.amount = outOfPocketItem.getAmount();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Calendar getDate() {
        return date;
    }

    public void setDate(Calendar date) {
        this.date = date;
    }

    public Type getType() {
        return type;
    }

    public void setType(Type type) {
        this.type = type;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }
}
