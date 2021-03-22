/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.db.vo;
import com.mazars.management.db.domain.*;
import com.mazars.management.db.domain.EmployeeSubdepartmentHistoryItem.Type;
import java.util.Calendar;
/**
 *
 * @author glazov
 */
public class EmployeeSubdepartmentHistoryItemVO {
    private Long id;
    private Calendar start;
    private Calendar end;
    private EmployeeSubdepartmentHistoryItem.Type type;
    public EmployeeSubdepartmentHistoryItemVO() {
    }
    public EmployeeSubdepartmentHistoryItemVO(EmployeeSubdepartmentHistoryItem employeeSubdepartmentHistoryItem) {
        this.id = employeeSubdepartmentHistoryItem.getId();
        this.start = employeeSubdepartmentHistoryItem.getStart();
        this.end = employeeSubdepartmentHistoryItem.getEnd();
        this.type = employeeSubdepartmentHistoryItem.getType();
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

    public Type getType() {
        return type;
    }

    public void setType(Type type) {
        this.type = type;
    }
   
}
