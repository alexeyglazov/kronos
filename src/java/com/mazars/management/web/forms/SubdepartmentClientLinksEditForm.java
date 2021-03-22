/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.web.forms;
import com.google.gson.Gson;
import java.util.List;
import java.util.LinkedList;

/**
 *
 * @author glazov
 */
public class SubdepartmentClientLinksEditForm {
    public static class SubdepartmentClientLink {
        private Long id;
        private Long subdepartmentId;

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
    }
    private Long clientId;
    private List<SubdepartmentClientLink> subdepartmentClientLinks = new LinkedList<SubdepartmentClientLink>();

    public SubdepartmentClientLinksEditForm() {
    }

    public Long getClientId() {
        return clientId;
    }

    public void setClientId(Long clientId) {
        this.clientId = clientId;
    }

    public List<SubdepartmentClientLink> getSubdepartmentClientLinks() {
        return subdepartmentClientLinks;
    }

    public void setSubdepartmentClientLinks(List<SubdepartmentClientLink> subdepartmentClientLinks) {
        this.subdepartmentClientLinks = subdepartmentClientLinks;
    }

    public static SubdepartmentClientLinksEditForm getFromJson(String json) {
        Gson gson = new Gson();
        return gson.fromJson(json, SubdepartmentClientLinksEditForm.class);
    }

}
