package com.mazars.management.db.vo;
import com.mazars.management.db.domain.*;
import java.util.Date;

public class ClientHistoryItemVO {
    private Long id;
    private String name;
    private String codeName;
    private YearMonthDateTime createdAt;

    public ClientHistoryItemVO() {}

    public ClientHistoryItemVO(ClientHistoryItem clientHistoryItem) {
        this.id = clientHistoryItem.getId();
        this.name = clientHistoryItem.getName();
        this.codeName = clientHistoryItem.getCodeName();
        if(clientHistoryItem.getCreatedAt() != null) {
            this.createdAt = new YearMonthDateTime(clientHistoryItem.getCreatedAt());
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCodeName() {
        return codeName;
    }

    public void setCodeName(String codeName) {
        this.codeName = codeName;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public YearMonthDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(YearMonthDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
