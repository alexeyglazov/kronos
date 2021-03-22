/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mazars.management.db.util;

import com.mazars.management.db.domain.Client;
import com.mazars.management.db.domain.Employee;
import com.mazars.management.db.domain.Group;
import com.mazars.management.db.domain.ProjectCode;
import com.mazars.management.db.domain.ProjectCodeConflict;
import com.mazars.management.db.domain.Subdepartment;
import com.mazars.management.db.domain.SubdepartmentClientLink;
import com.mazars.management.db.domain.SubdepartmentConflict;
import java.util.Date;
import java.util.LinkedList;
import java.util.List;

/**
 *
 * @author glazov
 */
public class ProjectCodeConflictUtil {
    
    public static List<Subdepartment> detectConflicts(ProjectCode projectCode) {
        Client client  = projectCode.getClient();
        Subdepartment subdepartment = projectCode.getSubdepartment();
        List<Subdepartment> potentialSubdepartments = new LinkedList<Subdepartment>();
        Group group = client.getGroup();
        if(group == null) {
            potentialSubdepartments.addAll(SubdepartmentClientLink.getSubdepartments(client));
        } else {
            potentialSubdepartments.addAll(SubdepartmentClientLink.getSubdepartments(group));
        }
        potentialSubdepartments.remove(subdepartment);
        if(Boolean.TRUE.equals(projectCode.getActivity().getIsConflictCheck())) {
            potentialSubdepartments.add(subdepartment);
        }
        return SubdepartmentConflict.getCheckingSubdepartments(subdepartment, potentialSubdepartments);
    }
    public static List<ProjectCodeConflict> createProjectCodeConflicts(ProjectCode projectCode, List<Subdepartment> checkingSubdepartments, Employee modifiedBy) {
        List<ProjectCodeConflict> projectCodeConflicts = new LinkedList<ProjectCodeConflict>();
        Date now = new Date();
        for(Subdepartment subdepartment : checkingSubdepartments) {
            ProjectCodeConflict projectCodeConflict = new ProjectCodeConflict();
            projectCodeConflict.setProjectCode(projectCode);
            projectCodeConflict.setCheckingSubdepartment(subdepartment);
            projectCodeConflict.setStatus(ProjectCodeConflict.Status.DETECTED);
            projectCodeConflict.setModifiedAt(now);
            if(modifiedBy == null) {
                projectCodeConflict.setModifiedBy(projectCode.getCreatedBy());
            } else {
                projectCodeConflict.setModifiedBy(modifiedBy);
            }
            projectCodeConflicts.add(projectCodeConflict);
        }
        return projectCodeConflicts;
    }
    public static List<ProjectCodeConflict> createProjectCodeConflicts(ProjectCode projectCode, Employee modifiedBy) {
        return ProjectCodeConflictUtil.createProjectCodeConflicts(projectCode, ProjectCodeConflictUtil.detectConflicts(projectCode), modifiedBy);
    }
}
