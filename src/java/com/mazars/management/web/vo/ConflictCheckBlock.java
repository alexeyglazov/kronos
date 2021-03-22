/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.web.vo;

import com.mazars.management.db.comparators.ProjectCodeConflictHistoryItemComparator;
import com.mazars.management.db.domain.Employee;
import com.mazars.management.db.domain.ProjectCode;
import com.mazars.management.db.domain.ProjectCodeConflict;
import com.mazars.management.db.domain.ProjectCodeConflictHistoryItem;
import com.mazars.management.db.vo.ProjectCodeVO;
import com.mazars.management.db.vo.YearMonth;
import com.mazars.management.db.vo.YearMonthDateTime;
import java.util.Collections;
import java.util.Date;
import java.util.LinkedList;
import java.util.List;

/**
 *
 * @author glazov
 */
public class ConflictCheckBlock {
    public static class HistoryItem {
        private Long projectCodeConflictHistoryItemId;
        private ProjectCodeConflict.Status status;
        private ConciseEmployee modifiedBy;
        private YearMonthDateTime modifiedAt;
        private String comment;

        public HistoryItem() {
        }
        public HistoryItem(ProjectCodeConflictHistoryItem projectCodeConflictHistoryItem) {
            this.projectCodeConflictHistoryItemId = projectCodeConflictHistoryItem.getId();
            this.comment = projectCodeConflictHistoryItem.getComment();
            if(projectCodeConflictHistoryItem.getStatus() != null) {
                this.status = projectCodeConflictHistoryItem.getStatus();
            }
            if(projectCodeConflictHistoryItem.getModifiedBy() != null) {
                this.modifiedBy = new ConciseEmployee(projectCodeConflictHistoryItem.getModifiedBy());
            }
            if(projectCodeConflictHistoryItem.getModifiedAt() != null) {
                this.modifiedAt = new YearMonthDateTime(projectCodeConflictHistoryItem.getModifiedAt());
            }
        }

        public Long getProjectCodeConflictHistoryItemId() {
            return projectCodeConflictHistoryItemId;
        }

        public void setProjectCodeConflictHistoryItemId(Long projectCodeConflictHistoryItemId) {
            this.projectCodeConflictHistoryItemId = projectCodeConflictHistoryItemId;
        }

        public ProjectCodeConflict.Status getStatus() {
            return status;
        }

        public void setStatus(ProjectCodeConflict.Status status) {
            this.status = status;
        }

        public ConciseEmployee getModifiedBy() {
            return modifiedBy;
        }

        public void setModifiedBy(ConciseEmployee modifiedBy) {
            this.modifiedBy = modifiedBy;
        }

        public YearMonthDateTime getModifiedAt() {
            return modifiedAt;
        }

        public void setModifiedAt(YearMonthDateTime modifiedAt) {
            this.modifiedAt = modifiedAt;
        }

        public String getComment() {
            return comment;
        }

        public void setComment(String comment) {
            this.comment = comment;
        }
    }
    public static class Item {
        private Long projectCodeConflictId;
        private OfficeDepartmentSubdepartment checkingSubdepartment;
        private ProjectCodeConflict.Status status;
        private ConciseEmployee modifiedBy;
        private YearMonthDateTime modifiedAt;
        private List<HistoryItem> historyItems = new LinkedList<HistoryItem>();
        
        public Item() {
        }
        public Item(ProjectCodeConflict projectCodeConflict) {
            this.projectCodeConflictId = projectCodeConflict.getId();
            if(projectCodeConflict.getCheckingSubdepartment() != null) {
                this.checkingSubdepartment = new OfficeDepartmentSubdepartment(projectCodeConflict.getCheckingSubdepartment());
            }
            if(projectCodeConflict.getStatus() != null) {
                this.status = projectCodeConflict.getStatus();
            }
            if(projectCodeConflict.getModifiedBy() != null) {
                this.modifiedBy = new ConciseEmployee(projectCodeConflict.getModifiedBy());
            }
            if(projectCodeConflict.getModifiedAt() != null) {
                this.modifiedAt = new YearMonthDateTime(projectCodeConflict.getModifiedAt());
            }
            List<ProjectCodeConflictHistoryItem> projectCodeConflictHistoryItems = new LinkedList<ProjectCodeConflictHistoryItem>(projectCodeConflict.getProjectCodeConflictHistoryItems());
            Collections.sort(projectCodeConflictHistoryItems, new ProjectCodeConflictHistoryItemComparator());
            for(ProjectCodeConflictHistoryItem projectCodeConflictHistoryItem : projectCodeConflictHistoryItems) {
                this.historyItems.add(new HistoryItem(projectCodeConflictHistoryItem));
            }

        }

        public Long getProjectCodeConflictId() {
            return projectCodeConflictId;
        }

        public void setProjectCodeConflictId(Long projectCodeConflictId) {
            this.projectCodeConflictId = projectCodeConflictId;
        }

        public OfficeDepartmentSubdepartment getCheckingSubdepartment() {
            return checkingSubdepartment;
        }

        public void setCheckingSubdepartment(OfficeDepartmentSubdepartment checkingSubdepartment) {
            this.checkingSubdepartment = checkingSubdepartment;
        }

        public ProjectCodeConflict.Status getStatus() {
            return status;
        }

        public void setStatus(ProjectCodeConflict.Status status) {
            this.status = status;
        }

        public ConciseEmployee getModifiedBy() {
            return modifiedBy;
        }

        public void setModifiedBy(ConciseEmployee modifiedBy) {
            this.modifiedBy = modifiedBy;
        }

        public YearMonthDateTime getModifiedAt() {
            return modifiedAt;
        }

        public void setModifiedAt(YearMonthDateTime modifiedAt) {
            this.modifiedAt = modifiedAt;
        }

        public List<HistoryItem> getHistoryItems() {
            return historyItems;
        }

        public void setHistoryItems(List<HistoryItem> historyItems) {
            this.historyItems = historyItems;
        }
    } 
    private ProjectCodeVO projectCode;
    private OfficeDepartmentSubdepartment subdepartment;
    private ConciseEmployee createdBy;
    private ConciseEmployee inChargePerson;
    private ConciseEmployee inChargePartner;
    private ConciseEmployee closedBy;
    private List<Item> items = new LinkedList<Item>();

    public ConflictCheckBlock() {
    }

    public ConflictCheckBlock(ProjectCode projectCode) {
        this.projectCode = new ProjectCodeVO(projectCode);
        if(projectCode.getSubdepartment() != null) {
            this.subdepartment = new OfficeDepartmentSubdepartment(projectCode.getSubdepartment());
        }
        if(projectCode.getCreatedBy() != null) {
            this.createdBy = new ConciseEmployee(projectCode.getCreatedBy());
        }
        if(projectCode.getInChargePerson() != null) {
            this.inChargePerson = new ConciseEmployee(projectCode.getInChargePerson());
        }
        if(projectCode.getInChargePartner() != null) {
            this.inChargePartner = new ConciseEmployee(projectCode.getInChargePartner());
        }
        if(projectCode.getClosedBy() != null) {
            this.closedBy = new ConciseEmployee(projectCode.getClosedBy());
        }
        for(ProjectCodeConflict projectCodeConflict : projectCode.getProjectCodeConflicts()) {
            this.items.add(new Item(projectCodeConflict));
        }
    }

    public ProjectCodeVO getProjectCode() {
        return projectCode;
    }

    public void setProjectCode(ProjectCodeVO projectCode) {
        this.projectCode = projectCode;
    }

    public OfficeDepartmentSubdepartment getSubdepartment() {
        return subdepartment;
    }

    public void setSubdepartment(OfficeDepartmentSubdepartment subdepartment) {
        this.subdepartment = subdepartment;
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
