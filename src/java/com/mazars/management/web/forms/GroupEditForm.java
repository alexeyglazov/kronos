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
public class GroupEditForm {
    public enum Mode {
        CREATE,
        UPDATE
    }
    private GroupEditForm.Mode mode;
    private Long id;
    private String name;
    private String alias;
    private Long countryId;
    private Boolean isListed;
    private Long listingCountryId;
    private Boolean isReferred;
    private Boolean isMazarsAudit;
    
    public GroupEditForm() {
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

    public Long getCountryId() {
        return countryId;
    }

    public void setCountryId(Long countryId) {
        this.countryId = countryId;
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

    public Boolean getIsMazarsAudit() {
        return isMazarsAudit;
    }

    public void setIsMazarsAudit(Boolean isMazarsAudit) {
        this.isMazarsAudit = isMazarsAudit;
    }

    public static GroupEditForm getFromJson(String json) {
        Gson gson = new Gson();
        return gson.fromJson(json, GroupEditForm.class);
    }

}
