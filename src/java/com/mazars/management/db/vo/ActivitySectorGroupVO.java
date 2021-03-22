package com.mazars.management.db.vo;
import com.mazars.management.db.domain.*;
import java.util.LinkedList;
import java.util.List;

public class ActivitySectorGroupVO {
    private Long id;
    private String name;
    private String description;

    public ActivitySectorGroupVO() {}

    public ActivitySectorGroupVO(ActivitySectorGroup activitySectorGroup) {
        this.id = activitySectorGroup.getId();
        this.name = activitySectorGroup.getName();
        this.description = activitySectorGroup.getDescription();
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

    public static List<ActivitySectorGroupVO> getList(List<ActivitySectorGroup> activitySectorGroups) {
        List<ActivitySectorGroupVO> activitySectorGroupVOs = new LinkedList<ActivitySectorGroupVO>();
        if(activitySectorGroups == null) {
            return null;
        }
        for(ActivitySectorGroup activitySectorGroup : activitySectorGroups) {
           activitySectorGroupVOs.add(new ActivitySectorGroupVO(activitySectorGroup));
        }
        return activitySectorGroupVOs;
    }
}
