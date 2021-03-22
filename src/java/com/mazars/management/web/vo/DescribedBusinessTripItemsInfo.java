/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mazars.management.web.vo;

import com.mazars.management.db.domain.BusinessTripItem;
import com.mazars.management.db.domain.ProjectCode;
import com.mazars.management.db.domain.TimeSpentItem;
import com.mazars.management.db.util.BusinessTripItemUtil.DescribedBusinessTripItem;
import com.mazars.management.db.vo.YearMonthDate;
import java.util.LinkedList;
import java.util.List;

/**
 *
 * @author glazov
 */
public class DescribedBusinessTripItemsInfo {
    public static class ProjectCodeVO {
        private Long id;
        private String code;
        private String description;
        private Boolean isClosed;
        private List<BusinessTripItemVO> businessTripItems = new LinkedList<BusinessTripItemVO>();

        public ProjectCodeVO(ProjectCode projectCode) {
            this.id = projectCode.getId();
            this.code = projectCode.getCode();
            this.description = projectCode.getDescription();
            this.isClosed = projectCode.getIsClosed();
        }

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public Boolean isIsClosed() {
            return isClosed;
        }

        public void setIsClosed(Boolean isClosed) {
            this.isClosed = isClosed;
        }

        public String getCode() {
            return code;
        }

        public void setCode(String code) {
            this.code = code;
        }

        public String getDescription() {
            return description;
        }

        public void setDescription(String description) {
            this.description = description;
        }
        public List<BusinessTripItemVO> getBusinessTripItems() {
            return businessTripItems;
        }

        public void setBusinessTripItems(List<BusinessTripItemVO> businessTripItems) {
            this.businessTripItems = businessTripItems;
        }
        public BusinessTripItemVO getBusinessTripItem(Long businessTripItemId) {
            for(BusinessTripItemVO businessTripItem : this.getBusinessTripItems()) {
                if(businessTripItem.getId().equals(businessTripItemId)) {
                    return businessTripItem;
                }
            }
            return null;
        }         
    }
    public static class BusinessTripItemVO {
        private Long id;
        private YearMonthDate day;

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public YearMonthDate getDay() {
            return day;
        }

        public void setDay(YearMonthDate day) {
            this.day = day;
        }

        public BusinessTripItemVO(BusinessTripItem businessTripItem) {
            this.id = businessTripItem.getId();
            this.day = new YearMonthDate(businessTripItem.getDay());
        }
        
    }
    private List<ProjectCodeVO> projectCodes = new LinkedList<ProjectCodeVO>();
    public ProjectCodeVO getProjectCode(Long projectCodeId) {
        for(ProjectCodeVO projectCode : this.getProjectCodes()) {
            if(projectCode.getId().equals(projectCodeId)) {
                return projectCode;
            }
        }
        return null;
    }
    
    public List<ProjectCodeVO> getProjectCodes() {
        return projectCodes;
    }

    public void setProjectCodes(List<ProjectCodeVO> projectCodes) {
        this.projectCodes = projectCodes;
    }
    
    public DescribedBusinessTripItemsInfo(List<DescribedBusinessTripItem> describedBusinessTripItems) {
        for(DescribedBusinessTripItem describedBusinessTripItem : describedBusinessTripItems) {
            ProjectCode projectCode = describedBusinessTripItem.getProjectCode();
            BusinessTripItem businessTripItem = describedBusinessTripItem.getBusinessTripItem();
            
            ProjectCodeVO projectCodeVO = this.getProjectCode(projectCode.getId());
            if(projectCodeVO == null) {
                projectCodeVO = new ProjectCodeVO(projectCode);
                this.getProjectCodes().add(projectCodeVO);
            } 

            BusinessTripItemVO businessTripItemVO = projectCodeVO.getBusinessTripItem(businessTripItem.getId());
            if(businessTripItemVO == null) {
                businessTripItemVO = new BusinessTripItemVO(businessTripItem);
                projectCodeVO.getBusinessTripItems().add(businessTripItemVO);
            }
        }
    }
}
