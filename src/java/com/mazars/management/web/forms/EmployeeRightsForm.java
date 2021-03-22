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
public class EmployeeRightsForm {
    public static class RightsItem {
        private Long id;
        private Long subdepartmentId;
        private Long moduleId;
        private Long employeeId;

        public RightsItem() {
        }

        public Long getEmployeeId() {
            return employeeId;
        }

        public void setEmployeeId(Long employeeId) {
            this.employeeId = employeeId;
        }

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public Long getModuleId() {
            return moduleId;
        }

        public void setModuleId(Long moduleId) {
            this.moduleId = moduleId;
        }

        public Long getSubdepartmentId() {
            return subdepartmentId;
        }

        public void setSubdepartmentId(Long subdepartmentId) {
            this.subdepartmentId = subdepartmentId;
        }

    }
    private Long employeeId;
    private List<RightsItem> rightsItems = new LinkedList<RightsItem>();

    public EmployeeRightsForm() {
    }

    public Long getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(Long employeeId) {
        this.employeeId = employeeId;
    }

    public List<RightsItem> getRightsItems() {
        return rightsItems;
    }

    public void setRightsItems(List<RightsItem> rightsItems) {
        this.rightsItems = rightsItems;
    }

    public static EmployeeRightsForm getFromJson(String json) {
        Gson gson = new Gson();
        return gson.fromJson(json, EmployeeRightsForm.class);
    }
}
