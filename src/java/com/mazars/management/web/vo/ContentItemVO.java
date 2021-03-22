/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.web.vo;

import com.mazars.management.db.domain.*;
import com.mazars.management.db.domain.EmployeeSubdepartmentHistoryItem.Type;
import com.mazars.management.web.content.ContentItem;
import com.mazars.management.web.content.ContentManager;
import java.util.Calendar;
import java.util.LinkedList;
import java.util.List;

/**
 *
 * @author Glazov
 */
public class ContentItemVO {
    private String name;
    private String path;
    private String title;
    private String description;
    private String navigationUrl;
    private List<ContentItemVO> children = new LinkedList<ContentItemVO>();
    
    public ContentItemVO() {
    }
    public ContentItemVO(ContentItem contentItem, Employee employee) {
        name = contentItem.getName();
        path = contentItem.getPath();
        title = contentItem.getTitle();
        description = contentItem.getDescription();
        navigationUrl = ContentManager.getNavigationUrl(contentItem);
        if(contentItem.getChildren() != null) {
            for(ContentItem child : contentItem.getChildren()) {
                if(ContentManager.isResourceAccessible(child, employee)) {
                    children.add(new ContentItemVO(child, employee));
                }
            }
        }
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getNavigationUrl() {
        return navigationUrl;
    }

    public void setNavigationUrl(String navigationUrl) {
        this.navigationUrl = navigationUrl;
    }

    public List<ContentItemVO> getChildren() {
        return children;
    }

    public void setChildren(List<ContentItemVO> children) {
        this.children = children;
    }
}
