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
public class ProjectCodeApprovementFilter {
    public enum NoApprovement {
        ALL,
        NO_PRIMARY_APPROVEMENT,
        NO_SECONDARY_APPROVEMENT
    }

    private NoApprovement noApprovement;

    public ProjectCodeApprovementFilter() {
    }

    public NoApprovement getNoApprovement() {
        return noApprovement;
    }

    public void setNoApprovement(NoApprovement noApprovement) {
        this.noApprovement = noApprovement;
    }
    
    public static ProjectCodeApprovementFilter getFromJson(String json) {
        Gson gson = new Gson();
        return gson.fromJson(json, ProjectCodeApprovementFilter.class);
    }

    private Boolean isStringUsed(String field) {
        if(field == null || field.trim().equals("")) {
            return false;
        }
        return true;
    }


    public Boolean isNoApprovementUsed() {
        if(noApprovement != null && ! NoApprovement.ALL.equals(noApprovement)) {
            return true;
        } else {
            return false;
        }
    }




    ///////////////////
    public Boolean isUsed() {
       return isNoApprovementUsed();
    }
}
