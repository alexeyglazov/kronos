/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.db.vo;
import com.mazars.management.db.domain.*;
import java.util.LinkedList;
import java.util.List;

public class GroupVO {
    private Long id;

    private String name;
    private String alias;
    private Boolean isListed;
    private Boolean isReferred;
    private Boolean isMazarsAudit;    

    public GroupVO() {}

    public GroupVO(Group group) {
        this.id = group.getId();
        this.name = group.getName();
        this.alias = group.getAlias();
        this.isListed = group.getIsListed();
        this.isReferred = group.getIsReferred();
        this.isMazarsAudit = group.getIsMazarsAudit();        
    }

    public Long getId() {
        return id;
    }

    private void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAlias() {
        return alias;
    }

    public void setAlias(String alias) {
        this.alias = alias;
    }

    public Boolean getIsListed() {
        return isListed;
    }
    
    public void setIsListed(Boolean isListed) {
        this.isListed = isListed;
    }

    public Boolean getIsReferred() {
        return isReferred;
    }

    public void setIsReferred(Boolean isReferred) {
        this.isReferred = isReferred;
    }

    public Boolean getIsMazarsAudit() {
        return isMazarsAudit;
    }

    public void setIsMazarsAudit(Boolean isMazarsAudit) {
        this.isMazarsAudit = isMazarsAudit;
    }
    public static List<GroupVO> getList(List<Group> groups) {
        List<GroupVO> groupVOs = new LinkedList<GroupVO>();
        if(groups == null) {
            return null;
        }
        for(Group group : groups) {
           groupVOs.add(new GroupVO(group));
        }
        return groupVOs;
    }
}
