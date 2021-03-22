/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.db.domain;
/**
 *
 * @author glazov
 */
public class ClientActivitySectorLink {
    private Long id;
    private Client client;
    private ActivitySector activitySector;
    private Integer sortValue;
    public ClientActivitySectorLink() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Client getClient() {
        return client;
    }

    public void setClient(Client client) {
        this.client = client;
    }

    public ActivitySector getActivitySector() {
        return activitySector;
    }

    public void setActivitySector(ActivitySector activitySector) {
        this.activitySector = activitySector;
    }

    public Integer getSortValue() {
        return sortValue;
    }

    public void setSortValue(Integer sortValue) {
        this.sortValue = sortValue;
    }
}
