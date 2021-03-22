/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.reports.vo;

import com.mazars.management.db.domain.ActivitySector;
import com.mazars.management.db.domain.Client;
import com.mazars.management.db.domain.Client.CustomerType;
import com.mazars.management.db.domain.Department;
import com.mazars.management.db.domain.Group;
import com.mazars.management.db.domain.Office;
import com.mazars.management.db.domain.Subdepartment;
import com.mazars.management.db.vo.ActivitySectorVO;
import com.mazars.management.reports.*;
import java.util.Date;
import java.util.LinkedList;
import java.util.List;
/**
 *
 * @author glazov
 */
public class CRMClientPerDepartmentReportVO {
    public class SubdepartmentColumn {
        private Long officeId;
        private String officeName;
        private Long departmentId;
        private String departmentName;
        private Long subdepartmentId;
        private String subdepartmentName;

        public SubdepartmentColumn() {
        }

        public SubdepartmentColumn(Subdepartment subdepartment) {
            Department department = subdepartment.getDepartment();
            Office office = department.getOffice();
            this.officeId = office.getId();
            this.officeName = office.getName();
            this.departmentId = department.getId();
            this.departmentName = department.getName();
            this.subdepartmentId = subdepartment.getId();
            this.subdepartmentName = subdepartment.getName();
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
    }
    public class Row {
        private List<Long> subdepartmentIds = new LinkedList<Long>();
        private List<Long> activitySectorIds = new LinkedList<Long>();
        private Long groupId;
        private String groupName;
        private Long clientId;
        private String clientName;
        private Client.CustomerType clientCustomerType;
        private Boolean clientIsReferred;

        public Row(CRMClientPerDepartmentReport.Row row) {
            for(ActivitySector activitySector : row.getActivitySectors()) {
                this.activitySectorIds.add(activitySector.getId());
            }
            for(Subdepartment subdepartment : row.getSubdepartments()) {
                this.subdepartmentIds.add(subdepartment.getId());
            }
            Group group = row.getGroup();
            Client client = row.getClient();
            if(group != null) {
                this.groupId = group.getId();
                this.groupName = group.getName();
            }
            if(client != null) {
                this.clientId = client.getId();
                this.clientName = client.getName();
                this.clientCustomerType = client.getCustomerType();
                this.clientIsReferred = client.getIsReferred();
            }
        }

        public List<Long> getSubdepartmentIds() {
            return subdepartmentIds;
        }

        public void setSubdepartmentIds(List<Long> subdepartmentIds) {
            this.subdepartmentIds = subdepartmentIds;
        }

        public Long getGroupId() {
            return groupId;
        }

        public void setGroupId(Long groupId) {
            this.groupId = groupId;
        }

        public String getGroupName() {
            return groupName;
        }

        public void setGroupName(String groupName) {
            this.groupName = groupName;
        }

        public Long getClientId() {
            return clientId;
        }

        public void setClientId(Long clientId) {
            this.clientId = clientId;
        }

        public String getClientName() {
            return clientName;
        }

        public void setClientName(String clientName) {
            this.clientName = clientName;
        }

        public CustomerType getClientCustomerType() {
            return clientCustomerType;
        }

        public void setClientCustomerType(CustomerType clientCustomerType) {
            this.clientCustomerType = clientCustomerType;
        }

        public Boolean getClientIsReferred() {
            return clientIsReferred;
        }

        public void setClientIsReferred(Boolean clientIsReferred) {
            this.clientIsReferred = clientIsReferred;
        }

        public List<Long> getActivitySectorIds() {
            return activitySectorIds;
        }

        public void setActivitySectorIds(List<Long> activitySectorIds) {
            this.activitySectorIds = activitySectorIds;
        }
    }

    List<Row> rows = new LinkedList<Row>();
    List<SubdepartmentColumn> subdepartmentColumns = new LinkedList<SubdepartmentColumn>();
    List<ActivitySectorVO> activitySectors = new LinkedList<ActivitySectorVO>();
    Date createdAt;
    public CRMClientPerDepartmentReportVO(CRMClientPerDepartmentReport crmClientPerDepartmentReport) {
        for(Subdepartment subdepartment : crmClientPerDepartmentReport.getSubdepartments()) {
            this.subdepartmentColumns.add(new CRMClientPerDepartmentReportVO.SubdepartmentColumn(subdepartment));
        }
        for(ActivitySector activitySector : crmClientPerDepartmentReport.getActivitySectors()) {
            this.activitySectors.add(new ActivitySectorVO(activitySector));
        }
        for(CRMClientPerDepartmentReport.Row row : crmClientPerDepartmentReport.getRows()) {
            this.rows.add(new CRMClientPerDepartmentReportVO.Row(row));
        }
        this.createdAt = crmClientPerDepartmentReport.getCreatedAt();
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public List<Row> getRows() {
        return rows;
    }

    public void setRows(List<Row> rows) {
        this.rows = rows;
    }

    public List<SubdepartmentColumn> getSubdepartmentColumns() {
        return subdepartmentColumns;
    }

    public void setSubdepartmentColumns(List<SubdepartmentColumn> subdepartmentColumns) {
        this.subdepartmentColumns = subdepartmentColumns;
    }

    public List<ActivitySectorVO> getActivitySectors() {
        return activitySectors;
    }

    public void setActivitySectors(List<ActivitySectorVO> activitySectors) {
        this.activitySectors = activitySectors;
    }
}
