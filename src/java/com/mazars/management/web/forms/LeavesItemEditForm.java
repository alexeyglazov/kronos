/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.web.forms;
import com.google.gson.Gson;
import com.mazars.management.db.domain.*;
import com.mazars.management.db.domain.Employee.Profile;
import com.mazars.management.db.domain.LeavesItem.Type;
import com.mazars.management.db.vo.*;

/**
 *
 * @author glazov
 */
public class LeavesItemEditForm {
    public enum Mode {
        CREATE,
        UPDATE
    }
    private LeavesItemEditForm.Mode mode;
    private Long id;
    private Long employeeId;
    private LeavesItem.Type type;
    private YearMonthDate start;
    private YearMonthDate end;

    public Long getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(Long employeeId) {
        this.employeeId = employeeId;
    }

    public YearMonthDate getEnd() {
        return end;
    }

    public void setEnd(YearMonthDate end) {
        this.end = end;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Mode getMode() {
        return mode;
    }

    public void setMode(Mode mode) {
        this.mode = mode;
    }

    public Type getType() {
        return type;
    }

    public void setType(Type type) {
        this.type = type;
    }

    public YearMonthDate getStart() {
        return start;
    }

    public void setStart(YearMonthDate start) {
        this.start = start;
    }

    public static LeavesItemEditForm getFromJson(String json) {
        Gson gson = new Gson();
        return gson.fromJson(json, LeavesItemEditForm.class);
    }
}
