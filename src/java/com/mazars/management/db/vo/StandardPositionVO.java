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
public class StandardPositionVO {
    private Long id;
    private String name;
    private Integer sortValue;
    public StandardPositionVO() {}

    public StandardPositionVO(StandardPosition standardPosition) {
        this.id = standardPosition.getId();
        this.name = standardPosition.getName();
        this.sortValue = standardPosition.getSortValue();
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

    public Integer getSortValue() {
        return sortValue;
    }

    public void setSortValue(Integer sortValue) {
        this.sortValue = sortValue;
    }
    public static List<StandardPositionVO> getList(List<StandardPosition> standardPositions) {
        List<StandardPositionVO> standardPositionVOs = new LinkedList<StandardPositionVO>();
        if(standardPositions == null) {
            return null;
        }
        for(StandardPosition standardPosition : standardPositions) {
           standardPositionVOs.add(new StandardPositionVO(standardPosition));
        }
        return standardPositionVOs;
    }
}
