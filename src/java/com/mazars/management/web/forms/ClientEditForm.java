/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.web.forms;
import com.google.gson.Gson;
import com.mazars.management.db.domain.*;
import com.mazars.management.db.domain.Client.ChannelType;
import com.mazars.management.db.domain.Client.CustomerType;
import com.mazars.management.db.vo.YearMonthDate;
import java.util.Calendar;

/**
 *
 * @author glazov
 */
public class ClientEditForm {
    public enum Mode {
        CREATE,
        UPDATE
    }
    private ClientEditForm.Mode mode;
    private Long id;
    private Long groupId;
    private Client.ClientGroup clientGroup;    
    private String name;
    private String alias;
    private String codeName;
    private Long countryId;

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
    private Long activitySector1Id;
    private Long activitySector2Id;
    private Long activitySector3Id;
    private Long activitySector4Id;
    private Long activitySector5Id;
    private Boolean isListed;
    private Boolean isReferred;
    private Client.CustomerType customerType;  
    private Client.ChannelType channelType;   
    private Long listingCountryId;
    private Boolean isActive;
    private Boolean isFuture;
    private Boolean isExternal;
    private Boolean isTransnational;

    public ClientEditForm() {
    }

    public Client.ClientGroup getClientGroup() {
        return clientGroup;
    }

    public void setClientGroup(Client.ClientGroup clientGroup) {
        this.clientGroup = clientGroup;
    }

    public String getCodeName() {
        return codeName;
    }

    public void setCodeName(String codeName) {
        this.codeName = codeName;
    }

    public String getAlias() {
        return alias;
    }

    public void setAlias(String alias) {
        this.alias = alias;
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

    public Mode getMode() {
        return mode;
    }

    public void setMode(Mode mode) {
        this.mode = mode;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Long getActivitySector1Id() {
        return activitySector1Id;
    }

    public void setActivitySector1Id(Long activitySector1Id) {
        this.activitySector1Id = activitySector1Id;
    }

    public Long getActivitySector2Id() {
        return activitySector2Id;
    }

    public void setActivitySector2Id(Long activitySector2Id) {
        this.activitySector2Id = activitySector2Id;
    }

    public Long getActivitySector3Id() {
        return activitySector3Id;
    }

    public void setActivitySector3Id(Long activitySector3Id) {
        this.activitySector3Id = activitySector3Id;
    }

    public Long getActivitySector4Id() {
        return activitySector4Id;
    }

    public void setActivitySector4Id(Long activitySector4Id) {
        this.activitySector4Id = activitySector4Id;
    }

    public Long getActivitySector5Id() {
        return activitySector5Id;
    }

    public void setActivitySector5Id(Long activitySector5Id) {
        this.activitySector5Id = activitySector5Id;
    }

    public ChannelType getChannelType() {
        return channelType;
    }

    public void setChannelType(ChannelType channelType) {
        this.channelType = channelType;
    }

    public Long getCountryId() {
        return countryId;
    }

    public void setCountryId(Long countryId) {
        this.countryId = countryId;
    }

    public CustomerType getCustomerType() {
        return customerType;
    }

    public void setCustomerType(CustomerType customerType) {
        this.customerType = customerType;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Boolean getIsListed() {
        return isListed;
    }

    public void setIsListed(Boolean isListed) {
        this.isListed = isListed;
    }

    public Boolean getIsReferred() {
        return isReferred;
    }

    public void setIsReferred(Boolean isReferred) {
        this.isReferred = isReferred;
    }

    public Long getListingCountryId() {
        return listingCountryId;
    }

    public void setListingCountryId(Long listingCountryId) {
        this.listingCountryId = listingCountryId;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
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

    public static ClientEditForm getFromJson(String json) {
        Gson gson = new Gson();
        return gson.fromJson(json, ClientEditForm.class);
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    public Boolean getIsTransnational() {
        return isTransnational;
    }

    public void setIsTransnational(Boolean isTransnational) {
        this.isTransnational = isTransnational;
    }

    public String getTaxNumber() {
        return taxNumber;
    }

    public void setTaxNumber(String taxNumber) {
        this.taxNumber = taxNumber;
    }

    public Boolean getIsFuture() {
        return isFuture;
    }

    public void setIsFuture(Boolean isFuture) {
        this.isFuture = isFuture;
    }

    public Boolean getIsExternal() {
        return isExternal;
    }

    public void setIsExternal(Boolean isExternal) {
        this.isExternal = isExternal;
    }

}
