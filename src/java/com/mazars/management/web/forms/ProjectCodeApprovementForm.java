/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.web.forms;
import com.google.gson.Gson;
import com.mazars.management.db.vo.YearMonth;
import java.util.LinkedList;
import java.util.List;

/**
 *
 * @author glazov
 */
public class ProjectCodeApprovementForm {
    public enum ApprovementAction {
        SET_PRIMARY_APPROVEMENT,
        UNSET_PRIMARY_APPROVEMENT,
        SET_SECONDARY_APPROVEMENT,
        UNSET_SECONDARY_APPROVEMENT
    }
    private ProjectCodeApprovementForm.ApprovementAction approvementAction;
    private Long projectCodeId;
    private List<YearMonth> months = new LinkedList<YearMonth>();

    public ProjectCodeApprovementForm() {
    }

    public ApprovementAction getApprovementAction() {
        return approvementAction;
    }

    public void setApprovementAction(ApprovementAction approvementAction) {
        this.approvementAction = approvementAction;
    }

    public Long getProjectCodeId() {
        return projectCodeId;
    }

    public void setProjectCodeId(Long projectCodeId) {
        this.projectCodeId = projectCodeId;
    }

    public List<YearMonth> getMonths() {
        return months;
    }

    public void setMonths(List<YearMonth> months) {
        this.months = months;
    }

    public static ProjectCodeApprovementForm getFromJson(String json) {
        Gson gson = new Gson();
        return gson.fromJson(json, ProjectCodeApprovementForm.class);
    }

}
