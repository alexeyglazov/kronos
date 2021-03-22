/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.web.forms;
import com.google.gson.Gson;
import com.mazars.management.db.domain.*;
import com.mazars.management.db.domain.LeavesItem.Type;
import com.mazars.management.db.vo.*;

/**
 *
 * @author glazov
 */
public class AnnualPaidLeaveEditForm {
    public enum Mode {
        CREATE,
        UPDATE
    }
    private AnnualPaidLeaveEditForm.Mode mode;
    private Long id;
    private Long positionId;
    private EmployeePositionHistoryItem.ContractType contractType;
    private Integer duration;
    private YearMonthDate start;
    private YearMonthDate end;

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

    public EmployeePositionHistoryItem.ContractType getContractType() {
        return contractType;
    }

    public void setContractType(EmployeePositionHistoryItem.ContractType contractType) {
        this.contractType = contractType;
    }

    public Integer getDuration() {
        return duration;
    }

    public void setDuration(Integer duration) {
        this.duration = duration;
    }

    public YearMonthDate getStart() {
        return start;
    }

    public void setStart(YearMonthDate start) {
        this.start = start;
    }

    public static AnnualPaidLeaveEditForm getFromJson(String json) {
        Gson gson = new Gson();
        return gson.fromJson(json, AnnualPaidLeaveEditForm.class);
    }
}
