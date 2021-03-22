package com.mazars.management.db.vo;
import com.mazars.management.db.comparators.ClientActivitySectorLinkComparator;
import com.mazars.management.db.domain.*;
import java.util.Collections;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.List;
import java.util.Set;

public class ClientVOH extends ClientVO {
    private Long groupId;
    private Long countryId;
    private Long legalCountryId;
    private Long postalCountryId;
    private Long listingCountryId;
    private List<Long> activitySectorIds = new LinkedList<Long>();
    private Set<Long> clientHistoryItemIds = new HashSet<Long>();
    private Set<Long> projectCodeIds = new HashSet<Long>();

    public ClientVOH() {}

    public ClientVOH(Client client) {
        super(client);
        if(client.getGroup() != null) {
            this.groupId = client.getGroup().getId();
        }
        if(client.getCountry() != null) {
            this.countryId = client.getCountry().getId();
        }
        if(client.getLegalCountry() != null) {
            this.legalCountryId = client.getLegalCountry().getId();
        }
        if(client.getPostalCountry() != null) {
            this.postalCountryId = client.getPostalCountry().getId();
        }
        if(client.getListingCountry() != null) {
            this.listingCountryId = client.getListingCountry().getId();
        }
        
        if(client.getClientActivitySectorLinks() != null) {
            List<ClientActivitySectorLink> clientActivitySectorLinks = new LinkedList<>(client.getClientActivitySectorLinks());
            Collections.sort(clientActivitySectorLinks, new ClientActivitySectorLinkComparator());
            for(ClientActivitySectorLink clientActivitySectorLink : clientActivitySectorLinks) {
                this.activitySectorIds.add(clientActivitySectorLink.getActivitySector().getId());
            }
        }      
        for(ClientHistoryItem clientHistoryItem : client.getClientHistoryItems()) {
            this.clientHistoryItemIds.add(clientHistoryItem.getId());
        }
        for(ProjectCode projectCode : client.getProjectCodes()) {
            this.projectCodeIds.add(projectCode.getId());
        }
    }

    public List<Long> getActivitySectorIds() {
        return activitySectorIds;
    }

    public void setActivitySectorIds(List<Long> activitySectorIds) {
        this.activitySectorIds = activitySectorIds;
    }

    public Set<Long> getClientHistoryItemIds() {
        return clientHistoryItemIds;
    }

    public void setClientHistoryItemIds(Set<Long> clientHistoryItemIds) {
        this.clientHistoryItemIds = clientHistoryItemIds;
    }

    public Long getGroupId() {
        return groupId;
    }

    public void setGroupId(Long groupId) {
        this.groupId = groupId;
    }

    public Set<Long> getProjectCodeIds() {
        return projectCodeIds;
    }

    public void setProjectCodeIds(Set<Long> projectCodeIds) {
        this.projectCodeIds = projectCodeIds;
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

    public Long getLegalCountryId() {
        return legalCountryId;
    }

    public void setLegalCountryId(Long legalCountryId) {
        this.legalCountryId = legalCountryId;
    }

    public Long getPostalCountryId() {
        return postalCountryId;
    }

    public void setPostalCountryId(Long postalCountryId) {
        this.postalCountryId = postalCountryId;
    }
}
