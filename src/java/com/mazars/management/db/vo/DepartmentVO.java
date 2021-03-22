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
public class DepartmentVO {
    private Long id;
    private String name;
    private String codeName;
    private String description;
    private Boolean isActive;
    private Boolean isBusinessTrippable;

    public DepartmentVO() {}

    public DepartmentVO(Department department) {
        this.id = department.getId();
        this.name = department.getName();
        this.codeName = department.getCodeName();
        this.description = department.getDescription();
        this.isActive = department.getIsActive();
        this.isBusinessTrippable = department.getIsBusinessTrippable();
    }

    public Boolean getIsBusinessTrippable() {
        return isBusinessTrippable;
    }

    public void setIsBusinessTrippable(Boolean isBusinessTrippable) {
        this.isBusinessTrippable = isBusinessTrippable;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    public String getCodeName() {
        return codeName;
    }

    public void setCodeName(String codeName) {
        this.codeName = codeName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
    public static List<DepartmentVO> getList(List<Department> departments) {
        List<DepartmentVO> departmentVOs = new LinkedList<DepartmentVO>();
        if(departments == null) {
            return null;
        }
        for(Department department : departments) {
           departmentVOs.add(new DepartmentVO(department));
        }
        return departmentVOs;
    }
}
