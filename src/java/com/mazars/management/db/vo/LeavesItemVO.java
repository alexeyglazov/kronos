/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.db.vo;
import com.mazars.management.db.domain.*;
import com.mazars.management.db.domain.LeavesItem.Type;
import com.mazars.management.db.util.HibernateUtil;
import org.hibernate.Session;
import java.util.List;
import java.util.Set;
import java.util.HashSet;
import java.util.Calendar;
/**
 *
 * @author glazov
 */
public class LeavesItemVO {
    private Long id;
    private LeavesItem.Type type;
    private Calendar start;
    private Calendar end;

    public LeavesItemVO(LeavesItem leavesItem) {
        this.id = leavesItem.getId();
        this.type = leavesItem.getType();
        this.start = leavesItem.getStart();
        this.end = leavesItem.getEnd();
    }

    public Calendar getEnd() {
        return end;
    }

    public void setEnd(Calendar end) {
        this.end = end;
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

    public LeavesItem.Type getType() {
        return type;
    }

    public void setType(LeavesItem.Type type) {
        this.type = type;
    }
}
