/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.web.forms;
import com.google.gson.Gson;
import com.mazars.management.db.vo.YearMonthDate;
import com.mazars.management.service.StringUtils;
import java.util.LinkedList;
import java.util.List;

/**
 *
 * @author glazov
 */
public class ProjectCodeBatchEditForm { 
    public static class Item {
        private Long id;
        private Integer financialYear;
        private Long inChargePersonId;
        private Long inChargePartnerId;
        private String comment;
        private String description;

        public Item() {
        }

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public Integer getFinancialYear() {
            return financialYear;
        }

        public void setFinancialYear(Integer financialYear) {
            this.financialYear = financialYear;
        }

        public Long getInChargePersonId() {
            return inChargePersonId;
        }

        public void setInChargePersonId(Long inChargePersonId) {
            this.inChargePersonId = inChargePersonId;
        }

        public Long getInChargePartnerId() {
            return inChargePartnerId;
        }

        public void setInChargePartnerId(Long inChargePartnerId) {
            this.inChargePartnerId = inChargePartnerId;
        }

        public String getComment() {
            return comment;
        }

        public void setComment(String comment) {
            this.comment = comment;
        }

        public String getDescription() {
            return description;
        }

        public void setDescription(String description) {
            this.description = description;
        }
    }

    public ProjectCodeBatchEditForm() {
    }
    
    private List<Item> items = new LinkedList<Item>();

    public List<Item> getItems() {
        return items;
    }

    public void setItems(List<Item> items) {
        this.items = items;
    }
    
    public static ProjectCodeBatchEditForm getFromJson(String json) {
        Gson gson = new Gson();
        return gson.fromJson(json, ProjectCodeBatchEditForm.class);
    }
    public void normalize() {
        for(ProjectCodeBatchEditForm.Item item : items) {
            item.comment = StringUtils.stripNonValidXMLCharacters(item.comment);
            item.description = StringUtils.stripNonValidXMLCharacters(item.description);
        }
    }
}
