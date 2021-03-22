/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.web.vo;

import com.mazars.management.db.domain.ActivitySector;
import com.mazars.management.db.domain.Client;
import com.mazars.management.db.domain.ClientActivitySectorLink;
import com.mazars.management.db.domain.Subdepartment;
import com.mazars.management.db.domain.SubdepartmentClientLink;
import com.mazars.management.db.util.ClientListUtil;
import java.util.LinkedList;
import java.util.List;

/**
 *
 * @author glazov
 */
public class DescribedClient {
    private Long id;
    private Client.ClientGroup clientGroup;
    private String name;
    private String alias;
    private String codeName;
    private List<Long> subdepartmentIds = new LinkedList<Long>();
    private Long countryId;
    private Long groupId;

    private String legalStreet;
    private String legalZipCode;
    private String legalCity;
    private Long legalCountryId;

    private Boolean isPostalAddressEqualToLegal;
    private String postalStreet;
    private String postalZipCode;
    private String postalCity;
    private Long postalCountryId;

    private String phone;
    private String email;
    private String taxNumber;

    private List<Long> activitySectorIds = new LinkedList<Long>();

    private Boolean isListed;
    private Long listingCountryId;
    private Boolean isReferred;
    private Client.CustomerType customerType;

    private Client.ChannelType channelType;
    private Boolean isTransnational;
    private Boolean isFuture;
    private Boolean isExternal;
    private Boolean isActive;

    public DescribedClient(Client client) {
        this.id = client.getId();
        this.clientGroup = client.getClientGroup();
        this.name = client.getName();
        this.alias = client.getAlias();
        this.codeName = client.getCodeName();
        for(SubdepartmentClientLink subdepartmentClientLink : client.getSubdepartmentClientLinks()) {
            this.subdepartmentIds.add(subdepartmentClientLink.getSubdepartment().getId());
        }
        if(client.getCountry() != null) {
            this.countryId = client.getCountry().getId();
        }
        if(client.getGroup() != null) {
            this.groupId = client.getGroup().getId();
        }      
        this.legalStreet = client.getLegalStreet();
        this.legalZipCode = client.getLegalZipCode();
        this.legalCity = client.getLegalCity();
        if(client.getLegalCountry() != null) {
            this.legalCountryId = client.getLegalCountry().getId();
        }
        this.isPostalAddressEqualToLegal = client.getIsPostalAddressEqualToLegal();
        this.postalStreet = client.getPostalStreet();
        this.postalZipCode = client.getPostalZipCode();
        this.postalCity = client.getPostalCity();
        if(client.getPostalCountry() != null) {
            this.postalCountryId = client.getPostalCountry().getId();
        }
        this.phone = client.getPhone();
        this.email = client.getEmail();
        this.taxNumber = client.getTaxNumber();
        for(ClientActivitySectorLink clientActivitySectorLink : client.getClientActivitySectorLinks() ) {
            this.activitySectorIds.add(clientActivitySectorLink.getActivitySector().getId());
        }
        this.isListed = client.getIsListed();
        if(client.getListingCountry() != null) {
            this.listingCountryId = client.getListingCountry().getId();
        }
        this.isReferred = client.getIsReferred();
        this.customerType = client.getCustomerType();
        
        this.channelType = client.getChannelType();
        this.isTransnational = client.getIsTransnational();
        this.isFuture = client.getIsFuture();
        this.isExternal = client.getIsExternal();
        this.isActive = client.getIsActive();        
    }
    public DescribedClient(ClientListUtil.DescribedClient describedClient) {
        Client client = describedClient.getClient();
        this.id = client.getId();
        this.clientGroup = client.getClientGroup();
        this.name = client.getName();
        this.alias = client.getAlias();
        this.codeName = client.getCodeName();
        for(Subdepartment subdepartment : describedClient.getSubdepartments()) {
            this.subdepartmentIds.add(subdepartment.getId());
        }
        if(describedClient.getCountry() != null) {
            this.countryId = describedClient.getCountry().getId();
        }
        if(describedClient.getGroup() != null) {
            this.groupId = describedClient.getGroup().getId();
        }      
        this.legalStreet = client.getLegalStreet();
        this.legalZipCode = client.getLegalZipCode();
        this.legalCity = client.getLegalCity();
        if(describedClient.getLegalCountry() != null) {
            this.legalCountryId = describedClient.getLegalCountry().getId();
        }
        this.isPostalAddressEqualToLegal = client.getIsPostalAddressEqualToLegal();
        this.postalStreet = client.getPostalStreet();
        this.postalZipCode = client.getPostalZipCode();
        this.postalCity = client.getPostalCity();
        if(describedClient.getPostalCountry() != null) {
            this.postalCountryId = describedClient.getPostalCountry().getId();
        }
        this.phone = client.getPhone();
        this.email = client.getEmail();
        this.taxNumber = client.getTaxNumber();
        for(ActivitySector activitySector : describedClient.getActivitySectors() ) {
            this.activitySectorIds.add(activitySector.getId());
        }
        this.isListed = client.getIsListed();
        if(describedClient.getListingCountry() != null) {
            this.listingCountryId = describedClient.getListingCountry().getId();
        }
        this.isReferred = client.getIsReferred();
        this.customerType = client.getCustomerType();
        
        this.channelType = client.getChannelType();
        this.isTransnational = client.getIsTransnational();
        this.isFuture = client.getIsFuture();
        this.isExternal = client.getIsExternal();
        this.isActive = client.getIsActive();        
    }

    public Long getGroupId() {
        return groupId;
    }

    public void setGroupId(Long groupId) {
        this.groupId = groupId;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Client.ClientGroup getClientGroup() {
        return clientGroup;
    }

    public void setClientGroup(Client.ClientGroup clientGroup) {
        this.clientGroup = clientGroup;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAlias() {
        return alias;
    }

    public void setAlias(String alias) {
        this.alias = alias;
    }

    public String getCodeName() {
        return codeName;
    }

    public void setCodeName(String codeName) {
        this.codeName = codeName;
    }

    public List<Long> getSubdepartmentIds() {
        return subdepartmentIds;
    }

    public void setSubdepartmentIds(List<Long> subdepartmentIds) {
        this.subdepartmentIds = subdepartmentIds;
    }

    public Long getCountryId() {
        return countryId;
    }

    public void setCountryId(Long countryId) {
        this.countryId = countryId;
    }

    public String getLegalStreet() {
        return legalStreet;
    }

    public void setLegalStreet(String legalStreet) {
        this.legalStreet = legalStreet;
    }

    public String getLegalZipCode() {
        return legalZipCode;
    }

    public void setLegalZipCode(String legalZipCode) {
        this.legalZipCode = legalZipCode;
    }

    public String getLegalCity() {
        return legalCity;
    }

    public void setLegalCity(String legalCity) {
        this.legalCity = legalCity;
    }

    public Long getLegalCountryId() {
        return legalCountryId;
    }

    public void setLegalCountryId(Long legalCountryId) {
        this.legalCountryId = legalCountryId;
    }

    public Boolean getIsPostalAddressEqualToLegal() {
        return isPostalAddressEqualToLegal;
    }

    public void setIsPostalAddressEqualToLegal(Boolean isPostalAddressEqualToLegal) {
        this.isPostalAddressEqualToLegal = isPostalAddressEqualToLegal;
    }

    public String getPostalStreet() {
        return postalStreet;
    }

    public void setPostalStreet(String postalStreet) {
        this.postalStreet = postalStreet;
    }

    public String getPostalZipCode() {
        return postalZipCode;
    }

    public void setPostalZipCode(String postalZipCode) {
        this.postalZipCode = postalZipCode;
    }

    public String getPostalCity() {
        return postalCity;
    }

    public void setPostalCity(String postalCity) {
        this.postalCity = postalCity;
    }

    public Long getPostalCountryId() {
        return postalCountryId;
    }

    public void setPostalCountryId(Long postalCountryId) {
        this.postalCountryId = postalCountryId;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getTaxNumber() {
        return taxNumber;
    }

    public void setTaxNumber(String taxNumber) {
        this.taxNumber = taxNumber;
    }

    public List<Long> getActivitySectorIds() {
        return activitySectorIds;
    }

    public void setActivitySectorIds(List<Long> activitySectorIds) {
        this.activitySectorIds = activitySectorIds;
    }

    public Boolean getIsListed() {
        return isListed;
    }

    public void setIsListed(Boolean isListed) {
        this.isListed = isListed;
    }

    public Long getListingCountryId() {
        return listingCountryId;
    }

    public void setListingCountryId(Long listingCountryId) {
        this.listingCountryId = listingCountryId;
    }

    public Boolean getIsReferred() {
        return isReferred;
    }

    public void setIsReferred(Boolean isReferred) {
        this.isReferred = isReferred;
    }

    public Client.CustomerType getCustomerType() {
        return customerType;
    }

    public void setCustomerType(Client.CustomerType customerType) {
        this.customerType = customerType;
    }

    public Client.ChannelType getChannelType() {
        return channelType;
    }

    public void setChannelType(Client.ChannelType channelType) {
        this.channelType = channelType;
    }

    public Boolean getIsTransnational() {
        return isTransnational;
    }

    public void setIsTransnational(Boolean isTransnational) {
        this.isTransnational = isTransnational;
    }

    public Boolean getIsFuture() {
        return isFuture;
    }

    public void setIsFuture(Boolean isFuture) {
        this.isFuture = isFuture;
    }

    public Boolean isIsExternal() {
        return isExternal;
    }

    public void setIsExternal(Boolean isExternal) {
        this.isExternal = isExternal;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }
    
    
}
