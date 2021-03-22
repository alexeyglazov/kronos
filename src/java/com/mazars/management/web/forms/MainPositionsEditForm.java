/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.web.forms;
import com.google.gson.Gson;
import java.util.List;

/**
 *
 * @author glazov
 */
public class MainPositionsEditForm {
    private Long employeeId;
    private List<Long> mainEmployeePositionHistoryItemIds;

    public MainPositionsEditForm() {
    }

    public Long getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(Long employeeId) {
        this.employeeId = employeeId;
    }

    public List<Long> getMainEmployeePositionHistoryItemIds() {
        return mainEmployeePositionHistoryItemIds;
    }

    public void setMainEmployeePositionHistoryItemIds(List<Long> mainEmployeePositionHistoryItemIds) {
        this.mainEmployeePositionHistoryItemIds = mainEmployeePositionHistoryItemIds;
    }



    public static MainPositionsEditForm getFromJson(String json) {
        Gson gson = new Gson();
        return gson.fromJson(json, MainPositionsEditForm.class);
    }

}
