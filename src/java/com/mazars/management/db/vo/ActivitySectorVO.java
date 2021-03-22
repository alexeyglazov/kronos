package com.mazars.management.db.vo;
import com.mazars.management.db.domain.*;
import java.util.LinkedList;
import java.util.List;

public class ActivitySectorVO {
    private Long id;
    private String name;
    private String description;

    public ActivitySectorVO() {}

    public ActivitySectorVO(ActivitySector activitySector) {
        this.id = activitySector.getId();
        this.name = activitySector.getName();
        this.description = activitySector.getDescription();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public static List<ActivitySectorVO> getList(List<ActivitySector> activitySectors) {
        List<ActivitySectorVO> activitySectorVOs = new LinkedList<ActivitySectorVO>();
        if(activitySectors == null) {
            return null;
        }
        for(ActivitySector activitySector : activitySectors) {
           activitySectorVOs.add(new ActivitySectorVO(activitySector));
        }
        return activitySectorVOs;
    }
}
