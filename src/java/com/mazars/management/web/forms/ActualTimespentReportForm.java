/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.web.forms;
import com.google.gson.Gson;
import com.mazars.management.db.vo.*;

/**
 *
 * @author glazov
 */
public class ActualTimespentReportForm {
    private Long groupId;
    private Long clientId;
    private Long projectCodeId;
    private Integer year;

    public ActualTimespentReportForm() {
    }

    public Long getGroupId() {
        return groupId;
    }

    public void setGroupId(Long groupId) {
        this.groupId = groupId;
    }

    public Long getClientId() {
        return clientId;
    }

    public void setClientId(Long clientId) {
        this.clientId = clientId;
    }

    public Long getProjectCodeId() {
        return projectCodeId;
    }

    public void setProjectCodeId(Long projectCodeId) {
        this.projectCodeId = projectCodeId;
    }

    public Integer getYear() {
        return year;
    }

    public void setYear(Integer year) {
        this.year = year;
    }


    public static ActualTimespentReportForm getFromJson(String json) {
        Gson gson = new Gson();
        return gson.fromJson(json, ActualTimespentReportForm.class);
    }
}
