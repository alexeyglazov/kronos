/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.db.vo;
import com.mazars.management.db.domain.*;

/**
 *
 * @author glazov
 */
public class PositionVO {
    private Long id;
    private String name;
    private String localLanguageName;
    private String visitCardName;
    private String localLanguageVisitCardName;
    private Integer sortValue;
    private Boolean isActive;
    public PositionVO() {}

    public PositionVO(Position position) {
        this.id = position.getId();
        this.name = position.getName();
        this.localLanguageName = position.getLocalLanguageName();
        this.visitCardName = position.getVisitCardName();
        this.localLanguageVisitCardName = position.getLocalLanguageVisitCardName();
        this.sortValue = position.getSortValue();
        this.isActive = position.getIsActive();
    }

    public Integer getSortValue() {
        return sortValue;
    }

    public void setSortValue(Integer sortValue) {
        this.sortValue = sortValue;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
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

    public String getLocalLanguageName() {
        return localLanguageName;
    }

    public void setLocalLanguageName(String localLanguageName) {
        this.localLanguageName = localLanguageName;
    }

    public String getVisitCardName() {
        return visitCardName;
    }

    public void setVisitCardName(String visitCardName) {
        this.visitCardName = visitCardName;
    }

    public String getLocalLanguageVisitCardName() {
        return localLanguageVisitCardName;
    }

    public void setLocalLanguageVisitCardName(String localLanguageVisitCardName) {
        this.localLanguageVisitCardName = localLanguageVisitCardName;
    }
}
