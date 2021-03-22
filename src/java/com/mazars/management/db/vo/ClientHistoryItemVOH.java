package com.mazars.management.db.vo;
import com.mazars.management.db.domain.*;

public class ClientHistoryItemVOH extends ClientHistoryItemVO {
    private Long clientId;
    private Long createdById;
    private Long groupId;

    public ClientHistoryItemVOH() {}

    public ClientHistoryItemVOH(ClientHistoryItem clientHistoryItem) {
        super(clientHistoryItem);
        this.clientId = clientHistoryItem.getClient().getId();
        this.createdById = clientHistoryItem.getCreatedBy().getId();
        if(clientHistoryItem.getGroup() != null) {
            this.groupId = clientHistoryItem.getGroup().getId();
        }
    }

    public Long getClientId() {
        return clientId;
    }

    public void setClientId(Long clientId) {
        this.clientId = clientId;
    }

    public Long getCreatedById() {
        return createdById;
    }

    public void setCreatedById(Long createdById) {
        this.createdById = createdById;
    }

    public Long getGroupId() {
        return groupId;
    }

    public void setGroupId(Long groupId) {
        this.groupId = groupId;
    }
}
