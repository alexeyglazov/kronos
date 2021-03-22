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
public class OfficeVO {
    private Long id;
    private String name;
    private String codeName;
    private String description;
    private Boolean isActive;
    public OfficeVO() {};

    public OfficeVO(Office office) {
        this.id = office.getId();
        this.name = office.getName();
        this.codeName = office.getCodeName();
        this.description = office.getDescription();
        this.isActive = office.getIsActive();
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

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }
    public static List<OfficeVO> getList(List<Office> offices) {
        List<OfficeVO> officeVOs = new LinkedList<OfficeVO>();
        if(offices == null) {
            return null;
        }
        for(Office office : offices) {
           officeVOs.add(new OfficeVO(office));
        }
        return officeVOs;
    }
}
