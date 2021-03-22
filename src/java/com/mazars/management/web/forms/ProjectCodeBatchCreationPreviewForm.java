/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.web.forms;
import com.google.gson.Gson;
import com.mazars.management.web.vo.Period;
import java.util.LinkedList;
import java.util.List;

/**
 *
 * @author glazov
 */
public class ProjectCodeBatchCreationPreviewForm {
    private List<Long> clientIds = new LinkedList<Long>();
    private List<Long> activityIds = new LinkedList<Long>();
    private List<Period> periods = new LinkedList<Period>();
    private Integer year = null;

    public ProjectCodeBatchCreationPreviewForm() {
    }

    public List<Long> getClientIds() {
        return clientIds;
    }

    public void setClientIds(List<Long> clientIds) {
        this.clientIds = clientIds;
    }

    public List<Long> getActivityIds() {
        return activityIds;
    }

    public void setActivityIds(List<Long> activityIds) {
        this.activityIds = activityIds;
    }

    public List<Period> getPeriods() {
        return periods;
    }

    public void setPeriods(List<Period> periods) {
        this.periods = periods;
    }

    public Integer getYear() {
        return year;
    }

    public void setYear(Integer year) {
        this.year = year;
    }

    public static ProjectCodeBatchCreationPreviewForm getFromJson(String json) {
        Gson gson = new Gson();
        return gson.fromJson(json, ProjectCodeBatchCreationPreviewForm.class);
    }
}
