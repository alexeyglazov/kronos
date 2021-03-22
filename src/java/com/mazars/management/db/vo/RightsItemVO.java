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
public class RightsItemVO {
    private Long id;

    public RightsItemVO() {
    }

    public RightsItemVO(RightsItem rightsItem) {
        this.id = rightsItem.getId();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

}
