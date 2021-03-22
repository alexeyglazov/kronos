/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.web.forms;
import com.google.gson.Gson;

/**
 *
 * @author glazov
 */
public class ProjectCodeListLimiter {
    private Integer page;
    private Integer itemsPerPage;

    public ProjectCodeListLimiter() {
    }

    public static ProjectCodeListLimiter getFromJson(String json) {
        Gson gson = new Gson();
        return gson.fromJson(json, ProjectCodeListLimiter.class);
    }

    public Integer getItemsPerPage() {
        return itemsPerPage;
    }

    public void setItemsPerPage(Integer itemsPerPage) {
        this.itemsPerPage = itemsPerPage;
    }

    public Integer getPage() {
        return page;
    }

    public void setPage(Integer page) {
        this.page = page;
    }
 }
