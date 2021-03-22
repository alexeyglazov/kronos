/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mazars.management.web.vo;

import com.mazars.management.db.domain.Client;
import com.mazars.management.db.domain.Group;

/**
 *
 * @author glazov
 */
public class ClientAndGroupVO {
    private Long clientId;
    private String clientName;
    private String clientCodeName;
    private String clientColor;
    private Boolean clientIsActive;
    private Long groupId;
    private String groupName;

    public ClientAndGroupVO() {
    }

    public ClientAndGroupVO(Client client, Group group) {
        if(client != null) {
            this.clientId = client.getId();
            this.clientName = client.getName();
            this.clientCodeName = client.getCodeName();
            this.clientColor = client.getColor();
            this.clientIsActive = client.getIsActive();
        }
        if(group != null) {
            this.groupId = group.getId();
            this.groupName = group.getName();
        }
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

    public String getClientCodeName() {
        return clientCodeName;
    }

    public void setClientCodeName(String clientCodeName) {
        this.clientCodeName = clientCodeName;
    }

    public String getClientColor() {
        return clientColor;
    }

    public void setClientColor(String clientColor) {
        this.clientColor = clientColor;
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

    public Boolean isClientIsActive() {
        return clientIsActive;
    }

    public void setClientIsActive(Boolean clientIsActive) {
        this.clientIsActive = clientIsActive;
    }
}
