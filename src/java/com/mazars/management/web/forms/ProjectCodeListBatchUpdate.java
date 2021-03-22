/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.web.forms;
import com.google.gson.Gson;

/**
 *
 * @author glazov
 */
public class ProjectCodeListBatchUpdate {
    public enum Action {
        SET_CLOSED,
        SET_NON_CLOSED,
        SET_FUTURE,
        SET_NON_FUTURE,
        SET_DEAD,
        SET_NON_DEAD,
        SET_HIDDEN,
        SET_NON_HIDDEN
    }
    Action action;
    Long[] projectCodeIds = null;
    public ProjectCodeListBatchUpdate() {
    }

    public Action getAction() {
        return action;
    }

    public void setAction(Action action) {
        this.action = action;
    }

    public Long[] getProjectCodeIds() {
        return projectCodeIds;
    }

    public void setProjectCodeIds(Long[] projectCodeIds) {
        this.projectCodeIds = projectCodeIds;
    }

    public static ProjectCodeListBatchUpdate getFromJson(String json) {
        Gson gson = new Gson();
        return gson.fromJson(json, ProjectCodeListBatchUpdate.class);
    }
}
