/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mazars.management.web.vo;

import com.mazars.management.db.domain.Employee;
import com.mazars.management.web.content.ContentItem;
import com.mazars.management.web.content.ContentManager;

/**
 *
 * @author glazov
 */
public class ContentBranch {
    ContentItemVO root;
    public ContentBranch(ContentItem branchRootContentItem, Employee employee) {
        if(ContentManager.isResourceAccessible(branchRootContentItem, employee)) {
            root = new ContentItemVO(branchRootContentItem, employee);
        }
    }

    public ContentItemVO getRoot() {
        return root;
    }

    public void setRoot(ContentItemVO root) {
        this.root = root;
    }
}
