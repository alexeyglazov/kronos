/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.db.vo;
import com.mazars.management.db.domain.*;
import java.util.Set;
import java.util.HashSet;

/**
 *
 * @author glazov
 */
public class ActivityVOH extends ActivityVO {
    private Long subdepartmentId;
    private Set<Long> projectCodeIds = new HashSet<Long>();

    public ActivityVOH() {
    }

    public ActivityVOH(Activity activity) {
        super(activity);
        this.subdepartmentId = activity.getSubdepartment().getId();
        for(ProjectCode projectCode : activity.getProjectCodes()) {
            this.projectCodeIds.add(projectCode.getId());
        }
    }

    public Set<Long> getProjectCodeIds() {
        return projectCodeIds;
    }

    public void setProjectCodeIds(Set<Long> projectCodeIds) {
        this.projectCodeIds = projectCodeIds;
    }

    public Long getSubdepartmentId() {
        return subdepartmentId;
    }

    public void setSubdepartmentId(Long subdepartmentId) {
        this.subdepartmentId = subdepartmentId;
    }
}
