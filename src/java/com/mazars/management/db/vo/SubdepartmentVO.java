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
public class SubdepartmentVO {
    private Long id;
    private String name;
    private String codeName;
    private String description;
    private Boolean isActive;

    public SubdepartmentVO() {
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
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

    public SubdepartmentVO(Subdepartment subdepartment) {
        this.id = subdepartment.getId();
        this.name = subdepartment.getName();
        this.codeName = subdepartment.getCodeName();
        this.description = subdepartment.getDescription();
        this.isActive = subdepartment.getIsActive();
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
    public static List<SubdepartmentVO> getList(List<Subdepartment> subdepartments) {
        List<SubdepartmentVO> subdepartmentVOs = new LinkedList<SubdepartmentVO>();
        if(subdepartments == null) {
            return null;
        }
        for(Subdepartment subdepartment : subdepartments) {
           subdepartmentVOs.add(new SubdepartmentVO(subdepartment));
        }
        return subdepartmentVOs;
    }
}
