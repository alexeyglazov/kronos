/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mazars.management.web.content;

import com.mazars.management.db.domain.Module;
import java.util.LinkedList;
import java.util.List;

/**
 *
 * @author glazov
 */
public class ContentItem {
    private ContentItem parent;
    private List<ContentItem> children = new LinkedList<ContentItem>();
    private String name;
    private String title;
    private String description;
    private String url;
    private Module module;
    private Boolean isNonUserAccessible;
    private Boolean isUserAccessible;
    private Boolean isSuperUserAccessible;
    private Boolean isCountryAdministratorAccessible;

    public ContentItem() {
    }

    public ContentItem(ContentItem parent, List<ContentItem> children, String name, String title, String description, String url, Module module, Boolean isNonUserAccessible, Boolean isUserAccessible, Boolean isSuperUserAccessible, Boolean isCountryAdministratorAccessible) {
        this.parent = parent;
        this.children = children;
        this.name = name;
        this.title = title;
        this.description = description;
        this.url = url;
        this.module = module;
        this.isNonUserAccessible = isNonUserAccessible;
        this.isUserAccessible = isUserAccessible;
        this.isSuperUserAccessible = isSuperUserAccessible;
        this.isCountryAdministratorAccessible = isCountryAdministratorAccessible;
    }

    public ContentItem getParent() {
        return parent;
    }

    public void setParent(ContentItem parent) {
        this.parent = parent;
    }

    public List<ContentItem> getChildren() {
        return children;
    }

    public void setChildren(List<ContentItem> children) {
        this.children = children;
    }
    
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
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

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public Module getModule() {
        return module;
    }

    public void setModule(Module module) {
        this.module = module;
    }


    public Boolean getIsNonUserAccessible() {
        return isNonUserAccessible;
    }

    public void setIsNonUserAccessible(Boolean isNonUserAccessible) {
        this.isNonUserAccessible = isNonUserAccessible;
    }

    public Boolean getIsUserAccessible() {
        return isUserAccessible;
    }

    public void setIsUserAccessible(Boolean isUserAccessible) {
        this.isUserAccessible = isUserAccessible;
    }

    public Boolean getIsSuperUserAccessible() {
        return isSuperUserAccessible;
    }

    public void setIsSuperUserAccessible(Boolean isSuperUserAccessible) {
        this.isSuperUserAccessible = isSuperUserAccessible;
    }

    public Boolean getIsCountryAdministratorAccessible() {
        return isCountryAdministratorAccessible;
    }

    public void setIsCountryAdministratorAccessible(Boolean isCountryAdministratorAccessible) {
        this.isCountryAdministratorAccessible = isCountryAdministratorAccessible;
    }
    
    public String getPath() {
        String link = "/" + this.getName() + "/";
        ContentItem parent = this.getParent();
        while(parent != null) {
            link = "/" + parent.getName() + link;
            parent = parent.getParent();
        }
        return link;
    }
    public boolean belongsTo(ContentItem testContentItem) {
        ContentItem tmpContentItem = this;
        while(tmpContentItem != null) {
            if(tmpContentItem == testContentItem) {
                return true;
            }
            tmpContentItem = tmpContentItem.getParent();
        }
        return false;
    }
}
