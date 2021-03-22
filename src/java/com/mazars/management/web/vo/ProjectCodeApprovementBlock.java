/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.web.vo;

import com.mazars.management.db.vo.ProjectCodeVO;
import com.mazars.management.db.vo.YearMonth;
import com.mazars.management.db.vo.YearMonthDateTime;
import java.util.LinkedList;
import java.util.List;

/**
 *
 * @author glazov
 */
public class ProjectCodeApprovementBlock {
    public static class Item {
        private YearMonth month;
        private Boolean isClosed;
        private Long timeSpent;
        private YearMonthDateTime lastModifiedAt;

        private ConciseEmployee primaryApprovedBy;
        private YearMonthDateTime primaryApprovedAt;
        private ConciseEmployee secondaryApprovedBy;
        private YearMonthDateTime secondaryApprovedAt;

        public Item() {
        }

        public YearMonth getMonth() {
            return month;
        }

        public void setMonth(YearMonth month) {
            this.month = month;
        }

        public Boolean getIsClosed() {
            return isClosed;
        }

        public void setIsClosed(Boolean isClosed) {
            this.isClosed = isClosed;
        }

        public YearMonthDateTime getLastModifiedAt() {
            return lastModifiedAt;
        }

        public void setLastModifiedAt(YearMonthDateTime lastModifiedAt) {
            this.lastModifiedAt = lastModifiedAt;
        }

        public Long getTimeSpent() {
            return timeSpent;
        }

        public void setTimeSpent(Long timeSpent) {
            this.timeSpent = timeSpent;
        }

        public ConciseEmployee getPrimaryApprovedBy() {
            return primaryApprovedBy;
        }

        public void setPrimaryApprovedBy(ConciseEmployee primaryApprovedBy) {
            this.primaryApprovedBy = primaryApprovedBy;
        }

        public YearMonthDateTime getPrimaryApprovedAt() {
            return primaryApprovedAt;
        }

        public void setPrimaryApprovedAt(YearMonthDateTime primaryApprovedAt) {
            this.primaryApprovedAt = primaryApprovedAt;
        }

        public ConciseEmployee getSecondaryApprovedBy() {
            return secondaryApprovedBy;
        }

        public void setSecondaryApprovedBy(ConciseEmployee secondaryApprovedBy) {
            this.secondaryApprovedBy = secondaryApprovedBy;
        }

        public YearMonthDateTime getSecondaryApprovedAt() {
            return secondaryApprovedAt;
        }

        public void setSecondaryApprovedAt(YearMonthDateTime secondaryApprovedAt) {
            this.secondaryApprovedAt = secondaryApprovedAt;
        }
    }
    
    private ProjectCodeVO projectCode;
    private ConciseEmployee createdBy;
    private ConciseEmployee inChargePerson;
    private ConciseEmployee inChargePartner;
    private ConciseEmployee closedBy;
    private List<Item> items = new LinkedList();

    public ProjectCodeApprovementBlock() {
    }

    public ProjectCodeVO getProjectCode() {
        return projectCode;
    }

    public void setProjectCode(ProjectCodeVO projectCode) {
        this.projectCode = projectCode;
    }

    public List<Item> getItems() {
        return items;
    }

    public void setItems(List<Item> items) {
        this.items = items;
    }

    public ConciseEmployee getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(ConciseEmployee createdBy) {
        this.createdBy = createdBy;
    }

    public ConciseEmployee getClosedBy() {
        return closedBy;
    }

    public void setClosedBy(ConciseEmployee closedBy) {
        this.closedBy = closedBy;
    }

    public ConciseEmployee getInChargePerson() {
        return inChargePerson;
    }

    public void setInChargePerson(ConciseEmployee inChargePerson) {
        this.inChargePerson = inChargePerson;
    }

    public ConciseEmployee getInChargePartner() {
        return inChargePartner;
    }

    public void setInChargePartner(ConciseEmployee inChargePartner) {
        this.inChargePartner = inChargePartner;
    }
}
