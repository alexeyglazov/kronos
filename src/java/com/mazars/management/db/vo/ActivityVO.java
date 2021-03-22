/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.db.vo;
import com.mazars.management.db.domain.*;
import java.util.LinkedList;
import java.util.List;

/**
 *
 * @author glazov
 */
public class ActivityVO {
    private Long id;
    private String name;
    private String codeName;
    private Boolean isActive;
    private Boolean isConflictCheck;

    public ActivityVO() {
    }

    public ActivityVO(Activity activity) {
        this.id = activity.getId();
        this.name = activity.getName();
        this.codeName = activity.getCodeName();
        this.isActive = activity.getIsActive();
        this.isConflictCheck = activity.getIsConflictCheck();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Boolean getIsConflictCheck() {
        return isConflictCheck;
    }

    public void setIsConflictCheck(Boolean isConflictCheck) {
        this.isConflictCheck = isConflictCheck;
    }

    public String getCodeName() {
        return codeName;
    }

    public void setCodeName(String codeName) {
        this.codeName = codeName;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
    public static List<ActivityVO> getList(List<Activity> activities) {
        List<ActivityVO> activityVOs = new LinkedList<ActivityVO>();
        if(activities == null) {
            return null;
        }
        for(Activity activity : activities) {
           activityVOs.add(new ActivityVO(activity));
        }
        return activityVOs;
    }    
}
