/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.db.vo;
import com.mazars.management.db.domain.*;
import java.util.Set;
import java.util.HashSet;

public class GroupWithCountryAndListingCountryVO extends GroupVO {
    private String countryName;
    private String listingCountryName;
    public GroupWithCountryAndListingCountryVO() {}

    public GroupWithCountryAndListingCountryVO(Group group) {
        super(group);
        countryName = group.getCountry().getName();
        if(group.getListingCountry() != null) {
            listingCountryName = group.getListingCountry().getName();
        }
    }

    public String getCountryName() {
        return countryName;
    }

    public void setCountryName(String countryName) {
        this.countryName = countryName;
    }

    public String getListingCountryName() {
        return listingCountryName;
    }

    public void setListingCountryName(String listingCountryName) {
        this.listingCountryName = listingCountryName;
    }
}
