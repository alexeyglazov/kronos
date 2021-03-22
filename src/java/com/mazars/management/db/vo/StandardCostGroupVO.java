/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.db.vo;
import com.mazars.management.db.domain.*;
import java.util.Calendar;

/**
 *
 * @author glazov
 */
public class StandardCostGroupVO {
    private Long id;
    private Calendar start;
    private Calendar end;
    public StandardCostGroupVO() {}

    public StandardCostGroupVO(StandardCostGroup standardCostGroup) {
        this.id = standardCostGroup.getId();
        this.start = standardCostGroup.getStart();
        this.end = standardCostGroup.getEnd();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Calendar getStart() {
        return start;
    }

    public void setStart(Calendar start) {
        this.start = start;
    }

    public Calendar getEnd() {
        return end;
    }

    public void setEnd(Calendar end) {
        this.end = end;
    }
}
