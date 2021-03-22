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
public class PositionQuotationVO {
    private Long id;
    private Integer time;

    public PositionQuotationVO() {
    }
    public PositionQuotationVO(PositionQuotation positionQuotation) {
        id = positionQuotation.getId();
        time = positionQuotation.getTime();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getTime() {
        return time;
    }

    public void setTime(Integer time) {
        this.time = time;
    }
}
