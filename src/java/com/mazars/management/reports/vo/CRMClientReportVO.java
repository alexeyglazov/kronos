/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.reports.vo;

import com.mazars.management.db.domain.ActivitySector;
import com.mazars.management.db.domain.Client;
import com.mazars.management.db.domain.Client.ChannelType;
import com.mazars.management.db.domain.Client.CustomerType;
import com.mazars.management.db.domain.Group;
import com.mazars.management.db.domain.Subdepartment;
import com.mazars.management.db.vo.ActivitySectorVO;
import com.mazars.management.reports.*;
import com.mazars.management.web.vo.OfficeDepartmentSubdepartment;
import java.util.Date;
import java.util.LinkedList;
import java.util.List;
/**
 *
 * @author glazov
 */
public class CRMClientReportVO {
    public class Row {
        private Long groupId;
        private String groupName;
        private String groupCountryName;
        private Boolean groupIsListed;
        private String groupListingCountryName;
        private Boolean groupIsReferred;
        private Boolean groupIsMazarsAudit;

        private Long clientId;
        private Client.ClientGroup clientGroup;
        private String clientName;
        private String clientCodeName;
        private List<OfficeDepartmentSubdepartment> clientSubdepartments = new LinkedList<OfficeDepartmentSubdepartment>();
        private String clientCountryName;
        
        private String clientPostalStreet;
        private String clientPostalZipCode;
        private String clientPostalCity;
        private String clientPostalCountryName;

        private Boolean clientIsPostalAddressEqualToLegal;
        private String clientLegalStreet;
        private String clientLegalZipCode;
        private String clientLegalCity;
        private String clientLegalCountryName;
        
        
        private String clientPhone;
        private String clientEmail;
        private String clientTaxNumber;
        
        private List<Long> activitySectorIds = new LinkedList<Long>();
        
        private Boolean clientIsListed;
        private String clientListingCountryName;
        private Boolean clientIsReferred;
        private Client.CustomerType clientCustomerType;
        
        private Client.ChannelType clientChannelType;
        private Boolean clientIsTransnational;
        private Boolean clientIsFuture;
        private Boolean clientIsExternal;
        private Boolean clientIsActive;

        public Row(CRMClientReport.Row row) {
            for(ActivitySector activitySector : row.getClientActivitySectors()) {
                this.activitySectorIds.add(activitySector.getId());
            }            
            if(row.getGroup() != null) {
                Group group = row.getGroup();
                this.groupId = group.getId();
                this.groupName = group.getName();
                if(row.getGroupCountry() != null) {
                    this.groupCountryName = row.getGroupCountry().getName();
                }
                this.groupIsListed = group.getIsListed();
                if(row.getGroupListingCountry() != null) {
                    this.groupListingCountryName = row.getGroupListingCountry().getName();
                }
                this.groupIsReferred = group.getIsReferred();
                this.groupIsMazarsAudit = group.getIsMazarsAudit();
            }
            if(row.getClient() != null) {
                Client client = row.getClient();
                this.clientId = client.getId();
                this.clientName = client.getName();
                this.clientCodeName = client.getCodeName();
                this.clientGroup = client.getClientGroup();
                if(row.getClientSubdepartments() != null && ! row.getClientSubdepartments().isEmpty()) {
                    for(Subdepartment subdepartment : row.getClientSubdepartments()) {
                        this.clientSubdepartments.add(new OfficeDepartmentSubdepartment(subdepartment));
                    }
                }
                if(row.getClientCountry() != null) {
                    this.clientCountryName = row.getClientCountry().getName();
                }
                
                this.clientPostalStreet = client.getPostalStreet();
                this.clientPostalZipCode = client.getPostalZipCode();
                this.clientPostalCity = client.getPostalCity();
                if(row.getClientPostalCountry() != null) {
                    this.clientPostalCountryName = row.getClientPostalCountry().getName();
                }                
                this.clientIsPostalAddressEqualToLegal = client.getIsPostalAddressEqualToLegal();
                if(Boolean.TRUE.equals(this.clientIsPostalAddressEqualToLegal)) {               
                    this.clientLegalStreet = client.getPostalStreet();
                    this.clientLegalZipCode = client.getPostalZipCode();
                    this.clientLegalCity = client.getPostalCity();
                    if(row.getClientPostalCountry() != null) {
                        this.clientLegalCountryName = row.getClientPostalCountry().getName();
                    } 
                } else {
                    this.clientLegalStreet = client.getLegalStreet();
                    this.clientLegalZipCode = client.getLegalZipCode();
                    this.clientLegalCity = client.getLegalCity();
                    if(row.getClientLegalCountry() != null) {
                        this.clientLegalCountryName = row.getClientLegalCountry().getName();
                    }                
                }
                this.clientPhone = client.getPhone();
                this.clientEmail = client.getEmail();
                this.clientTaxNumber = client.getTaxNumber();
                

                this.clientIsListed = client.getIsListed();
                if(row.getClientListingCountry() != null) {
                    this.clientListingCountryName = row.getClientListingCountry().getName();
                }
                this.clientIsReferred = client.getIsReferred();
                this.clientCustomerType = client.getCustomerType();
                this.clientChannelType = client.getChannelType();
                this.clientIsTransnational = client.getIsTransnational();
                this.clientIsFuture = client.getIsFuture();
                this.clientIsExternal = client.getIsExternal();
                this.clientIsActive = client.getIsActive();
            }
        }

        public List<Long> getActivitySectorIds() {
            return activitySectorIds;
        }

        public void setActivitySectorIds(List<Long> activitySectorIds) {
            this.activitySectorIds = activitySectorIds;
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

        public String getGroupCountryName() {
            return groupCountryName;
        }

        public void setGroupCountryName(String groupCountryName) {
            this.groupCountryName = groupCountryName;
        }

        public Boolean isGroupIsListed() {
            return groupIsListed;
        }

        public void setGroupIsListed(Boolean groupIsListed) {
            this.groupIsListed = groupIsListed;
        }

        public String getGroupListingCountryName() {
            return groupListingCountryName;
        }

        public void setGroupListingCountryName(String groupListingCountryName) {
            this.groupListingCountryName = groupListingCountryName;
        }

        public Boolean isGroupIsReferred() {
            return groupIsReferred;
        }

        public void setGroupIsReferred(Boolean groupIsReferred) {
            this.groupIsReferred = groupIsReferred;
        }

        public Boolean isGroupIsMazarsAudit() {
            return groupIsMazarsAudit;
        }

        public void setGroupIsMazarsAudit(Boolean groupIsMazarsAudit) {
            this.groupIsMazarsAudit = groupIsMazarsAudit;
        }

        public Long getClientId() {
            return clientId;
        }

        public void setClientId(Long clientId) {
            this.clientId = clientId;
        }

        public Client.ClientGroup getClientGroup() {
            return clientGroup;
        }

        public void setClientGroup(Client.ClientGroup clientGroup) {
            this.clientGroup = clientGroup;
        }

        public String getClientName() {
            return clientName;
        }

        public void setClientName(String clientName) {
            this.clientName = clientName;
        }

        public String getClientCodeName() {
            return clientCodeName;
        }

        public void setClientCodeName(String clientCodeName) {
            this.clientCodeName = clientCodeName;
        }

        public List<OfficeDepartmentSubdepartment> getClientSubdepartments() {
            return clientSubdepartments;
        }

        public void setClientSubdepartments(List<OfficeDepartmentSubdepartment> clientSubdepartments) {
            this.clientSubdepartments = clientSubdepartments;
        }

        public String getClientCountryName() {
            return clientCountryName;
        }

        public void setClientCountryName(String clientCountryName) {
            this.clientCountryName = clientCountryName;
        }

        public String getClientLegalStreet() {
            return clientLegalStreet;
        }

        public void setClientLegalStreet(String clientLegalStreet) {
            this.clientLegalStreet = clientLegalStreet;
        }

        public String getClientLegalZipCode() {
            return clientLegalZipCode;
        }

        public void setClientLegalZipCode(String clientLegalZipCode) {
            this.clientLegalZipCode = clientLegalZipCode;
        }

        public String getClientLegalCity() {
            return clientLegalCity;
        }

        public void setClientLegalCity(String clientLegalCity) {
            this.clientLegalCity = clientLegalCity;
        }

        public String getClientLegalCountryName() {
            return clientLegalCountryName;
        }

        public void setClientLegalCountryName(String clientLegalCountryName) {
            this.clientLegalCountryName = clientLegalCountryName;
        }

        public Boolean isClientIsPostalAddressEqualToLegal() {
            return clientIsPostalAddressEqualToLegal;
        }

        public void setClientIsPostalAddressEqualToLegal(Boolean clientIsPostalAddressEqualToLegal) {
            this.clientIsPostalAddressEqualToLegal = clientIsPostalAddressEqualToLegal;
        }

        public String getClientPostalStreet() {
            return clientPostalStreet;
        }

        public void setClientPostalStreet(String clientPostalStreet) {
            this.clientPostalStreet = clientPostalStreet;
        }

        public String getClientPostalZipCode() {
            return clientPostalZipCode;
        }

        public void setClientPostalZipCode(String clientPostalZipCode) {
            this.clientPostalZipCode = clientPostalZipCode;
        }

        public String getClientPostalCity() {
            return clientPostalCity;
        }

        public void setClientPostalCity(String clientPostalCity) {
            this.clientPostalCity = clientPostalCity;
        }

        public String getClientPostalCountryName() {
            return clientPostalCountryName;
        }

        public void setClientPostalCountryName(String clientPostalCountryName) {
            this.clientPostalCountryName = clientPostalCountryName;
        }

        public String getClientPhone() {
            return clientPhone;
        }

        public void setClientPhone(String clientPhone) {
            this.clientPhone = clientPhone;
        }

        public String getClientEmail() {
            return clientEmail;
        }

        public void setClientEmail(String clientEmail) {
            this.clientEmail = clientEmail;
        }

        public String getClientTaxNumber() {
            return clientTaxNumber;
        }

        public void setClientTaxNumber(String clientTaxNumber) {
            this.clientTaxNumber = clientTaxNumber;
        }

        public Boolean isClientIsListed() {
            return clientIsListed;
        }

        public void setClientIsListed(Boolean clientIsListed) {
            this.clientIsListed = clientIsListed;
        }

        public String getClientListingCountryName() {
            return clientListingCountryName;
        }

        public void setClientListingCountryName(String clientListingCountryName) {
            this.clientListingCountryName = clientListingCountryName;
        }

        public Boolean isClientIsReferred() {
            return clientIsReferred;
        }

        public void setClientIsReferred(Boolean clientIsReferred) {
            this.clientIsReferred = clientIsReferred;
        }

        public CustomerType getClientCustomerType() {
            return clientCustomerType;
        }

        public void setClientCustomerType(CustomerType clientCustomerType) {
            this.clientCustomerType = clientCustomerType;
        }

        public ChannelType getClientChannelType() {
            return clientChannelType;
        }

        public void setClientChannelType(ChannelType clientChannelType) {
            this.clientChannelType = clientChannelType;
        }

        public Boolean isClientIsTransnational() {
            return clientIsTransnational;
        }

        public void setClientIsTransnational(Boolean clientIsTransnational) {
            this.clientIsTransnational = clientIsTransnational;
        }

        public Boolean isClientIsFuture() {
            return clientIsFuture;
        }

        public void setClientIsFuture(Boolean clientIsFuture) {
            this.clientIsFuture = clientIsFuture;
        }

        public Boolean isClientIsExternal() {
            return clientIsExternal;
        }

        public void setClientIsExternal(Boolean clientIsExternal) {
            this.clientIsExternal = clientIsExternal;
        }

        public Boolean isClientIsActive() {
            return clientIsActive;
        }

        public void setClientIsActive(Boolean clientIsActive) {
            this.clientIsActive = clientIsActive;
        }
        
    }

    List<Row> rows = new LinkedList<Row>();
    List<ActivitySectorVO> activitySectors = new LinkedList<ActivitySectorVO>();
    Date createdAt;

    public CRMClientReportVO(CRMClientReport crmClientReport) {
        for(CRMClientReport.Row row : crmClientReport.getRows()) {
            this.rows.add(new CRMClientReportVO.Row(row));
        }
        for(ActivitySector activitySector : crmClientReport.getActivitySectors()) {
            this.activitySectors.add(new ActivitySectorVO(activitySector));
        }
        this.createdAt = crmClientReport.getCreatedAt();
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

    public List<ActivitySectorVO> getActivitySectors() {
        return activitySectors;
    }

    public void setActivitySectors(List<ActivitySectorVO> activitySectors) {
        this.activitySectors = activitySectors;
    }
}
