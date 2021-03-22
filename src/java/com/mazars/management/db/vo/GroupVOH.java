/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.db.vo;
import com.mazars.management.db.domain.*;
import java.util.Set;
import java.util.HashSet;

public class GroupVOH extends GroupVO {
    private Long countryId;
    private Long listingCountryId;
    private Set<Long> clientIds = new HashSet<Long>();
    private Long workCountryId;
    public GroupVOH() {}

    public GroupVOH(Group group) {
        super(group);
        for(Client client : group.getClients()) {
            this.clientIds.add(client.getId());
        }
        if(group.getCountry() != null) {
            countryId = group.getCountry().getId();
        }
        if(group.getListingCountry() != null) {
            listingCountryId = group.getListingCountry().getId();
        }
        workCountryId = group.getWorkCountry().getId();
    }

    public Set<Long> getClientIds() {
        return clientIds;
    }

    public void setClientIds(Set<Long> clientIds) {
        this.clientIds = clientIds;
    }

    public Long getCountryId() {
        return countryId;
    }

    public void setCountryId(Long countryId) {
        this.countryId = countryId;
    }

    public Long getListingCountryId() {
        return listingCountryId;
    }

    public void setListingCountryId(Long listingCountryId) {
        this.listingCountryId = listingCountryId;
    }

    public Long getWorkCountryId() {
        return workCountryId;
    }

    public void setWorkCountryId(Long workCountryId) {
        this.workCountryId = workCountryId;
    }

}
