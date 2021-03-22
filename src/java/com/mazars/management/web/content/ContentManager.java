/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mazars.management.web.content;

import com.mazars.management.db.domain.Employee;
import com.mazars.management.db.domain.Module;
import com.mazars.management.db.domain.RightsItem;
import java.util.Collections;
import java.util.LinkedList;
import java.util.List;
import javax.servlet.ServletContext;

/**
 *
 * @author Glazov
 */
public class ContentManager {
    private static ServletContext servletContext = null;
    private static ContentItem rootContentItem = null;
    
    public static void init(ServletContext context) throws Exception {
        ContentManager.servletContext = context;
        readDatabase();
    }
    public static void readDatabase() throws Exception {
        List<com.mazars.management.db.domain.ContentItem> roots = com.mazars.management.db.domain.ContentItem.getChildren(null);
        if(roots.isEmpty()) {
            throw new Exception("No root ContentItem element in database");
        } else if(roots.size() > 1) {
            throw new Exception("More than one root ContentItem element in database");
        }
        com.mazars.management.db.domain.ContentItem root = roots.get(0);
        rootContentItem = new ContentItem();
        rootContentItem.setParent(null);
        populateItemAndChildren(rootContentItem, root);
    }
    private static void populateItemAndChildren(ContentItem webItem, com.mazars.management.db.domain.ContentItem domainItem) {
        webItem.setName(domainItem.getName());
        webItem.setTitle(domainItem.getTitle());
        webItem.setDescription(domainItem.getDescription());
        webItem.setUrl(domainItem.getUrl());
        // to prevent lazy load
        // content will loaded and saved as cache. object will be detached
        if(domainItem.getModule() != null) {
            domainItem.getModule().getName();
        }
        webItem.setModule(domainItem.getModule());
        webItem.setIsNonUserAccessible(domainItem.getIsNonUserAccessible());
        webItem.setIsUserAccessible(domainItem.getIsUserAccessible());
        webItem.setIsSuperUserAccessible(domainItem.getIsSuperUserAccessible());
        webItem.setIsCountryAdministratorAccessible(domainItem.getIsCountryAdministratorAccessible());
        for(com.mazars.management.db.domain.ContentItem domainItemChild : com.mazars.management.db.domain.ContentItem.getChildren(domainItem)) {
            ContentItem webItemChild = new ContentItem();
            webItem.getChildren().add(webItemChild);
            webItemChild.setParent(webItem);
            populateItemAndChildren(webItemChild, domainItemChild);
        }
    }
    public static void setRootContentItem(ContentItem rootContentItem) {
        ContentManager.rootContentItem = rootContentItem;
    }

    public static ContentItem getRootContentItem() {
        return rootContentItem;
    }
    public static String link(String resource) {
        String link = "";
        if(servletContext.getContextPath() == "/") {
            link = resource;
        } else {
            link += servletContext.getContextPath() + resource;
        }
        return link;
    }
    public static String getNavigationUrl(ContentItem contentItem) {
	String navURL = ContentManager.link(contentItem.getPath());
	if(contentItem.getUrl() != null && ! "".equals(contentItem.getUrl())) {
		if(contentItem.getUrl().startsWith("http://") || contentItem.getUrl().startsWith("https://")) {
			navURL = contentItem.getUrl();
		} else {
			navURL = ContentManager.link(contentItem.getUrl());
		}
	}
	return navURL;
    }
    public static Boolean isResourceAccessible(ContentItem contentItem, Employee user) {
        if(user == null) {
            return false;
        }
        if(contentItem.getPath().startsWith("/pages/en/admin/global_management/")) {
            if(user.getIsAdministrator()) {
                return true;
            } else {
                return false;
            }
        }
        if(Employee.Profile.NON_USER.equals(user.getProfile()) && contentItem.getIsNonUserAccessible()) {
            return true;
        } else if(Employee.Profile.USER.equals(user.getProfile()) && contentItem.getIsUserAccessible()) {
            return true;
        } if(Employee.Profile.SUPER_USER.equals(user.getProfile()) && contentItem.getIsSuperUserAccessible()) {
            Module module = contentItem.getModule();
            if(module == null) {
                if(contentItem.getChildren() != null) {
                    for(ContentItem subItem : contentItem.getChildren()) {
                        if(ContentManager.isResourceAccessible(subItem, user)) {
                            return true;
                        }
                    }
                }
                return false;
            }
            if(! RightsItem.isAvailable(user, module)) {
                return false;
            }
            return true;
        } if(Employee.Profile.COUNTRY_ADMINISTRATOR.equals(user.getProfile()) && contentItem.getIsCountryAdministratorAccessible()) {
            Module module = contentItem.getModule();
            if(module != null && ("Salary Report".equals(module.getName()) || "Salary".equals(module.getName()))) {
                return false;
            } else {
                return true;
            }
        }
        return false;
    }
    public static ContentItem getContentItem(String link) {
        // For URLs like
        // /contextname/pages/en/timesheets/fill/ or
        // /contextname/pages/en/timesheets/fill/test.jsp?q=25 
        // returns element with name "fill"
        // where "pages" is the root content items
        if(! link.startsWith(servletContext.getContextPath() + "/" + rootContentItem.getName() + "/")) {
            return null;
        }
        String[] tmp = link.split("/");
        List<String> folders = new LinkedList<String>();
        int limit = tmp.length - 1;
        if(link.endsWith("/")) {
            limit = tmp.length;
        }
        for(int i = 3; i < limit; i++) {
            folders.add(tmp[i]);
        }
        ContentItem rci = ContentManager.getRootContentItem();
        boolean isFailed = false;
        for(String folder : folders) {
            boolean isFound = false;
            for(ContentItem contentItem : rci.getChildren()) {
                if(folder.equals(contentItem.getName())) {
                    rci = contentItem;
                    isFound = true;
                    break;
                }
            }
            if(! isFound) {
                isFailed = true;
                break;
            }
        }
        if(isFailed) {
            return null;
        } else {
            return rci;
        }
    }
    public static List<ContentItem> getPath(ContentItem contentItem) {
        List<ContentItem> path = new LinkedList<ContentItem>();
        path.add(contentItem);
        ContentItem contentItemTmp = contentItem;
        while(contentItemTmp.getParent() != null) {
            path.add(contentItemTmp.getParent());
            contentItemTmp = contentItemTmp.getParent();
        }
        Collections.reverse(path);
        return path;
    }
}
