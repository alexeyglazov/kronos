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
public class SubdepartmentClientLinkVO {
    private Long id;
    private Long subdepartmentId;
    private Long clientId;

    public SubdepartmentClientLinkVO() {
    }

    public SubdepartmentClientLinkVO(SubdepartmentClientLink subdepartmentClientLink) {
        this.id = subdepartmentClientLink.getId();
        if(subdepartmentClientLink.getSubdepartment()!= null) {
            this.subdepartmentId = subdepartmentClientLink.getSubdepartment().getId();
        }
        if(subdepartmentClientLink.getClient()!= null) {
            this.clientId = subdepartmentClientLink.getClient().getId();
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getSubdepartmentId() {
        return subdepartmentId;
    }

    public void setSubdepartmentId(Long subdepartmentId) {
        this.subdepartmentId = subdepartmentId;
    }

    public Long getClientId() {
        return clientId;
    }

    public void setClientId(Long clientId) {
        this.clientId = clientId;
    }
    public static List<SubdepartmentClientLinkVO> getList(List<SubdepartmentClientLink> subdepartmentClientLinks) {
        List<SubdepartmentClientLinkVO> subdepartmentClientLinkVOs = new LinkedList<SubdepartmentClientLinkVO>();
        if(subdepartmentClientLinks == null) {
            return null;
        }
        for(SubdepartmentClientLink subdepartmentClientLink : subdepartmentClientLinks) {
           subdepartmentClientLinkVOs.add(new SubdepartmentClientLinkVO(subdepartmentClientLink));
        }
        return subdepartmentClientLinkVOs;
    }    
}
