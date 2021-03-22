/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.web.forms;
import com.google.gson.Gson;
import com.mazars.management.service.StringUtils;

/**
 *
 * @author glazov
 */
public class ProjectCodeCommentEditForm {
    public enum Mode {
        CREATE,
        UPDATE
    }
    private ProjectCodeCommentEditForm.Mode mode;
    private Long id;
    private Long subdepartmentId;
    private String content;

    public ProjectCodeCommentEditForm() {
    }

    public Long getSubdepartmentId() {
        return subdepartmentId;
    }

    public void setSubdepartmentId(Long subdepartmentId) {
        this.subdepartmentId = subdepartmentId;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Mode getMode() {
        return mode;
    }

    public void setMode(Mode mode) {
        this.mode = mode;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public static ProjectCodeCommentEditForm getFromJson(String json) {
        Gson gson = new Gson();
        return gson.fromJson(json, ProjectCodeCommentEditForm.class);
    }
    public void normalize() {
        content = StringUtils.stripNonValidXMLCharacters(content);
    }
}
