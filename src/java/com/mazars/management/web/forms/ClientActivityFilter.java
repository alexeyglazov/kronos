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
public class ClientActivityFilter {
    public enum ProjectsCount {
        ZERO,
        MORE_THAN_ZERO
    }
    private YearMonthDate startDate;
    private YearMonthDate endDate;
    private ProjectsCount projectsCount;

    public ClientActivityFilter() {
    }

    public ProjectsCount getProjectsCount() {
        return projectsCount;
    }

    public void setProjectsCount(ProjectsCount projectsCount) {
        this.projectsCount = projectsCount;
    }

    public YearMonthDate getEndDate() {
        return endDate;
    }

    public void setEndDate(YearMonthDate endDate) {
        this.endDate = endDate;
    }

    public YearMonthDate getStartDate() {
        return startDate;
    }

    public void setStartDate(YearMonthDate startDate) {
        this.startDate = startDate;
    }

    public static ClientActivityFilter getFromJson(String json) {
        Gson gson = new Gson();
        return gson.fromJson(json, ClientActivityFilter.class);
    }
    
    public Boolean isProjectsCountUsed() {
        if(projectsCount != null) {
            return true;
        } else {
            return false;
        }
    }
    public Boolean isStartDateUsed() {
        if(startDate != null) {
            return true;
        } else {
            return false;
        }
    }
    public Boolean isEndDateUsed() {
        if(endDate != null) {
            return true;
        } else {
            return false;
        }
    }
    public Boolean isUsed() {
       return isProjectsCountUsed() ||
        isStartDateUsed() || 
        isEndDateUsed();
    }           
}
