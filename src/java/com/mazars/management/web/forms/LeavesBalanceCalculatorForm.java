/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.web.forms;
import com.google.gson.Gson;
import com.mazars.management.db.vo.YearMonthDate;

/**
 *
 * @author glazov
 */
public class LeavesBalanceCalculatorForm {
    private Long employeeId;
    private YearMonthDate date;

    public LeavesBalanceCalculatorForm() {
    }

    public Long getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(Long employeeId) {
        this.employeeId = employeeId;
    }

    public YearMonthDate getDate() {
        return date;
    }

    public void setDate(YearMonthDate date) {
        this.date = date;
    }

    public static LeavesBalanceCalculatorForm getFromJson(String json) {
        Gson gson = new Gson();
        return gson.fromJson(json, LeavesBalanceCalculatorForm.class);
    }

}
