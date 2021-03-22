/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.db.vo;
import com.mazars.management.db.domain.*;
import java.util.LinkedList;
import java.util.List;

/**
 *
 * @author glazov
 */
public class ProjectCodeCommentVO {
    private Long id;
    private String content;
    public ProjectCodeCommentVO() {};

    public ProjectCodeCommentVO(ProjectCodeComment projectCodeComment) {
        this.id = projectCodeComment.getId();
        this.content = projectCodeComment.getContent();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public static List<ProjectCodeCommentVO> getList(List<ProjectCodeComment> projectCodeComments) {
        List<ProjectCodeCommentVO> projectCodeCommentVOs = new LinkedList<ProjectCodeCommentVO>();
        if(projectCodeComments == null) {
            return null;
        }
        for(ProjectCodeComment projectCodeComment : projectCodeComments) {
           projectCodeCommentVOs.add(new ProjectCodeCommentVO(projectCodeComment));
        }
        return projectCodeCommentVOs;
    }
}
