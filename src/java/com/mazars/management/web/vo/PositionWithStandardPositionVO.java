/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.web.vo;

import com.mazars.management.db.domain.Position;
import com.mazars.management.db.domain.StandardPosition;

/**
 *
 * @author Glazov
 */
public class PositionWithStandardPositionVO {
    private Long id;
    private String positionName;
    private Boolean positionIsActive;
    private Integer positionSortValue;
    private Long standardPositionId;
    private String standardPositionName;
    private Integer standardPositionSortValue;

    public PositionWithStandardPositionVO() {}

    public PositionWithStandardPositionVO(Position position, StandardPosition standardPosition) {
        this.id = position.getId();
        this.positionName = position.getName();
        this.positionIsActive = position.getIsActive();
        this.positionSortValue = position.getSortValue();
        this.standardPositionId = standardPosition.getId();
        this.standardPositionName = standardPosition.getName();
        this.standardPositionSortValue = standardPosition.getSortValue();
    }
    public PositionWithStandardPositionVO(Position position) {
        StandardPosition standardPosition = position.getStandardPosition();
        this.id = position.getId();
        this.positionName = position.getName();
        this.positionIsActive = position.getIsActive();
        this.standardPositionId = standardPosition.getId();
        this.standardPositionName = standardPosition.getName();
        this.standardPositionSortValue = standardPosition.getSortValue();
    }
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Boolean getPositionIsActive() {
        return positionIsActive;
    }

    public void setPositionIsActive(Boolean positionIsActive) {
        this.positionIsActive = positionIsActive;
    }

    public String getPositionName() {
        return positionName;
    }

    public void setPositionName(String positionName) {
        this.positionName = positionName;
    }

    public Long getStandardPositionId() {
        return standardPositionId;
    }

    public void setStandardPositionId(Long standardPositionId) {
        this.standardPositionId = standardPositionId;
    }

    public String getStandardPositionName() {
        return standardPositionName;
    }

    public void setStandardPositionName(String standardPositionName) {
        this.standardPositionName = standardPositionName;
    }

    public Integer getStandardPositionSortValue() {
        return standardPositionSortValue;
    }

    public void setStandardPositionSortValue(Integer standardPositionSortValue) {
        this.standardPositionSortValue = standardPositionSortValue;
    }

    public Integer getPositionSortValue() {
        return positionSortValue;
    }

    public void setPositionSortValue(Integer positionSortValue) {
        this.positionSortValue = positionSortValue;
    }
}
