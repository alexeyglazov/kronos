package com.mazars.management.db.vo;
import com.mazars.management.db.domain.*;
import java.util.Date;

public class GroupHistoryItemVO {
    private Long id;
    private String name;
    private String countryName;
    private YearMonthDateTime createdAt;

    public GroupHistoryItemVO() {}

    public GroupHistoryItemVO(GroupHistoryItem groupHistoryItem) {
        this.id = groupHistoryItem.getId();
        this.countryName = groupHistoryItem.getCountryName();
        if(groupHistoryItem.getCreatedAt() != null) {
            this.createdAt = new YearMonthDateTime(groupHistoryItem.getCreatedAt());
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCountryName() {
        return countryName;
    }

    public void setCountryName(String countryName) {
        this.countryName = countryName;
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
