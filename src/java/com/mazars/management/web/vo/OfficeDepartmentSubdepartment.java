/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mazars.management.web.vo;

import com.mazars.management.db.domain.Activity;
import com.mazars.management.db.domain.Department;
import com.mazars.management.db.domain.Office;
import com.mazars.management.db.domain.Subdepartment;
import java.util.Comparator;
import java.util.LinkedList;
import java.util.List;

/**
 *
 * @author glazov
 */
public class OfficeDepartmentSubdepartment {
    public static class OfficeDepartmentSubdepartmentComparator implements Comparator<OfficeDepartmentSubdepartment>  {
        @Override
        public int compare(OfficeDepartmentSubdepartment o1, OfficeDepartmentSubdepartment o2) {
            int result = o1.getOfficeName().compareToIgnoreCase(o2.getOfficeName());
            if(result != 0) {
                return result;
            }
            result = o1.getDepartmentName().compareToIgnoreCase(o2.getDepartmentName());
            if(result != 0) {
                return result;
            }
            result = o1.getSubdepartmentName().compareToIgnoreCase(o2.getSubdepartmentName());
            return result;
        }    
    }
    private Long officeId;
    private String officeName;
    private Long departmentId;
    private String departmentName;
    private Long subdepartmentId;
    private String subdepartmentName;

    public OfficeDepartmentSubdepartment(Subdepartment subdepartment) {
        this.subdepartmentId = subdepartment.getId();
        this.subdepartmentName = subdepartment.getName();
        Department department = subdepartment.getDepartment();
        this.departmentId = department.getId();
        this.departmentName = department.getName();
        Office office = department.getOffice();
        this.officeId = office.getId();
        this.officeName = office.getName();
    }

    public Long getOfficeId() {
        return officeId;
    }

    public void setOfficeId(Long officeId) {
        this.officeId = officeId;
    }

    public String getOfficeName() {
        return officeName;
    }

    public void setOfficeName(String officeName) {
        this.officeName = officeName;
    }

    public Long getDepartmentId() {
        return departmentId;
    }

    public void setDepartmentId(Long departmentId) {
        this.departmentId = departmentId;
    }

    public String getDepartmentName() {
        return departmentName;
    }

    public void setDepartmentName(String departmentName) {
        this.departmentName = departmentName;
    }

    public Long getSubdepartmentId() {
        return subdepartmentId;
    }

    public void setSubdepartmentId(Long subdepartmentId) {
        this.subdepartmentId = subdepartmentId;
    }

    public String getSubdepartmentName() {
        return subdepartmentName;
    }

    public void setSubdepartmentName(String subdepartmentName) {
        this.subdepartmentName = subdepartmentName;
    }
    public static List<OfficeDepartmentSubdepartment> getList(List<Subdepartment> subdepartments) {
        List<OfficeDepartmentSubdepartment> officeDepartmentSubdepartments = new LinkedList<OfficeDepartmentSubdepartment>();
        if(subdepartments == null) {
            return null;
        }
        for(Subdepartment subdepartment : subdepartments) {
           officeDepartmentSubdepartments.add(new OfficeDepartmentSubdepartment(subdepartment));
        }
        return officeDepartmentSubdepartments;
    }    
}
