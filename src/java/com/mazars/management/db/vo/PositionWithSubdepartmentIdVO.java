/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.db.vo;
import com.mazars.management.db.domain.*;
import java.util.Set;
import java.util.HashSet;
/**
 *
 * @author glazov
 */
public class PositionWithSubdepartmentIdVO extends PositionVO {
    private Long subdepartmentId;

    public PositionWithSubdepartmentIdVO() {}

    public PositionWithSubdepartmentIdVO(Position position) {
        super(position);
        this.subdepartmentId = position.getSubdepartment().getId();
    }

    public Long getSubdepartmentId() {
        return subdepartmentId;
    }

    public void setSubdepartmentId(Long subdepartmentId) {
        this.subdepartmentId = subdepartmentId;
    }


}
