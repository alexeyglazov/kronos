/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.web.forms;
import com.google.gson.Gson;

/**
 *
 * @author glazov
 */
public class ClientListFilter {
    private Long id;
    private Long groupId;
    private Long officeId;
    private Long departmentId;
    private Long subdepartmentId;
    private Boolean isCountryDefined;
    private Long countryId;
    private String name;
    private Long activitySectorGroupId;
    private Long activitySectorId;
    private Boolean isListed;
    private Boolean isReferred;
    private Boolean isActive;
    private Boolean isFuture;
    private Boolean isExternal;
    private Boolean isTransnational;

    public ClientListFilter() {
    }
    public static ClientListFilter getFromJson(String json) {
        Gson gson = new Gson();
        return gson.fromJson(json, ClientListFilter.class);
    }


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getGroupId() {
        return groupId;
    }

    public void setGroupId(Long groupId) {
        this.groupId = groupId;
    }

    public Boolean getIsCountryDefined() {
        return isCountryDefined;
    }

    public void setIsCountryDefined(Boolean isCountryDefined) {
        this.isCountryDefined = isCountryDefined;
    }

    public Long getCountryId() {
        return countryId;
    }

    public void setCountryId(Long countryId) {
        this.countryId = countryId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Long getOfficeId() {
        return officeId;
    }

    public void setOfficeId(Long officeId) {
        this.officeId = officeId;
    }

    public Long getDepartmentId() {
        return departmentId;
    }

    public void setDepartmentId(Long departmentId) {
        this.departmentId = departmentId;
    }

    public Long getSubdepartmentId() {
        return subdepartmentId;
    }

    public void setSubdepartmentId(Long subdepartmentId) {
        this.subdepartmentId = subdepartmentId;
    }

    public Long getActivitySectorGroupId() {
        return activitySectorGroupId;
    }

    public void setActivitySectorGroupId(Long activitySectorGroupId) {
        this.activitySectorGroupId = activitySectorGroupId;
    }

    public Long getActivitySectorId() {
        return activitySectorId;
    }

    public void setActivitySectorId(Long activitySectorId) {
        this.activitySectorId = activitySectorId;
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

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
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

    public Boolean getIsTransnational() {
        return isTransnational;
    }

    public void setIsTransnational(Boolean isTransnational) {
        this.isTransnational = isTransnational;
    }

    private Boolean isBooleanUsed(Boolean field) {
        if(Boolean.TRUE.equals(field) || Boolean.FALSE.equals(field)) {
            return true;
        }
        return false;
    }
    private Boolean isStringUsed(String field) {
        if(field == null || field.trim().equals("")) {
            return false;
        }
        return true;
    }

    public Boolean isIdUsed() {
        if(id != null) {
            return true;
        } else {
            return false;
        }
    }
    public Boolean isCountryDefinedUsed() {
        return isBooleanUsed(isCountryDefined);
    }
    public Boolean isCountryIdUsed() {
        if(countryId != null) {
            return true;
        } else {
            return false;
        }
    }
    public Boolean isGroupIdUsed() {
        if(groupId != null) {
            return true;
        } else {
            return false;
        }
    }
    public Boolean isOfficeIdUsed() {
        if(officeId != null) {
            return true;
        } else {
            return false;
        }
    }
    public Boolean isDepartmentIdUsed() {
        if(departmentId != null) {
            return true;
        } else {
            return false;
        }
    }
    public Boolean isSubdepartmentIdUsed() {
        if(subdepartmentId != null) {
            return true;
        } else {
            return false;
        }
    }
    public Boolean isNameUsed() {
        return isStringUsed(name);
    }
    public Boolean isActivitySectorGroupIdUsed() {
        if(activitySectorGroupId != null) {
            return true;
        } else {
            return false;
        }
    }
    public Boolean isActivitySectorIdUsed() {
        if(activitySectorId != null) {
            return true;
        } else {
            return false;
        }
    }
    public Boolean isListedUsed() {
        return isBooleanUsed(isListed);
    }
    public Boolean isReferredUsed() {
        return isBooleanUsed(isReferred);
    }
    public Boolean isActiveUsed() {
        return isBooleanUsed(isActive);
    }
    public Boolean isFutureUsed() {
        return isBooleanUsed(isFuture);
    }
    public Boolean isExternalUsed() {
        return isBooleanUsed(isExternal);
    }
    public Boolean isTransnationalUsed() {
        return isBooleanUsed(isTransnational);
    }

    ///////////////////
    public Boolean isUsed() {
       return isIdUsed() ||
        isGroupIdUsed() || 
        isOfficeIdUsed() ||
        isDepartmentIdUsed() ||
        isSubdepartmentIdUsed() ||
        isCountryDefinedUsed() || 
        isCountryIdUsed() ||       
        isActivitySectorIdUsed() ||
        isListedUsed() ||
        isReferredUsed() ||
        isActiveUsed()||
        isFutureUsed() ||
        isExternalUsed() ||
        isTransnationalUsed();
    }
}
