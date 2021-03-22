/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.web.forms;
import com.google.gson.Gson;
import com.mazars.management.db.domain.*;
import com.mazars.management.db.domain.Employee.Profile;
import com.mazars.management.db.vo.*;

/**
 *
 * @author glazov
 */
public class EmployeePositionHistoryItemEditForm {
    public enum Mode {
        CREATE,
        UPDATE
    }
    private EmployeePositionHistoryItemEditForm.Mode mode;
    private Long id;
    private Long employeeId;
    private Long positionId;
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

    public Long getPositionId() {
        return positionId;
    }

    public void setPositionId(Long positionId) {
        this.positionId = positionId;
    }

    public YearMonthDate getStart() {
        return start;
    }

    public void setStart(YearMonthDate start) {
        this.start = start;
    }

    public static EmployeePositionHistoryItemEditForm getFromJson(String json) {
        Gson gson = new Gson();
        return gson.fromJson(json, EmployeePositionHistoryItemEditForm.class);
    }

}
