/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.db.domain;
import com.mazars.management.db.util.HibernateUtil;
import java.util.List;
import org.hibernate.Session;

/**
 *
 * @author glazov
 */
public class ContentItem {

    private Long id;
    private ContentItem parent;
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
    public ContentItem(ContentItem parent, String name, String title, String description, String url, Module module, Boolean isNonUserAccessible, Boolean isUserAccessible, Boolean isSuperUserAccessible, Boolean isCountryAdministratorAccessible) {
        this.parent = parent;
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

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ContentItem getParent() {
        return parent;
    }

    public void setParent(ContentItem parent) {
        this.parent = parent;
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

    public static List<ContentItem> getChildlessContentItems() {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<ContentItem>)hs.createQuery("select ci2 from ContentItem as ci right join ci.parent as ci2 where ci=null").list();
    }
    public static List<ContentItem> getChildren(ContentItem contentItem) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        if(contentItem == null) {
            return (List<ContentItem>)hs.createQuery("select ci from ContentItem as ci where ci.parent=null").list();
        } else {
            return (List<ContentItem>)hs.createQuery("select ci from ContentItem as ci where ci.parent=:parent").setParameter("parent", contentItem).list();
        }
    }
    public static int deleteAll() {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        List<ContentItem> childlesContentItems = ContentItem.getChildlessContentItems();
        int level = 0;
        int count = 0;
        while(! childlesContentItems.isEmpty() && level < 100) {
            for(ContentItem contentItem : childlesContentItems) {
                hs.delete(contentItem);
                count++;
            }
            childlesContentItems = ContentItem.getChildlessContentItems();
            level++;
        }
        return count;
    }
}
