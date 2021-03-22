/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.reports.vo;

import com.mazars.management.db.domain.*;
import com.mazars.management.db.domain.FeesItem.Type;
import com.mazars.management.db.vo.*;
import com.mazars.management.reports.*;
import java.math.BigDecimal;
import java.util.LinkedList;
import java.util.List;
/**
 *
 * @author glazov
 */
public class CodeListReportVO {
    public class Row {
        private Long projectCodeId;
        private String projectCodeCode;
        private Long clientId;
        private String clientName;
        private Long groupId;
        private String groupName;
        
        public Row(CodeListReport.Row row) {
            this.projectCodeId = row.getProjectCode().getId();
            this.projectCodeCode = row.getProjectCode().getCode();
            this.clientId = row.getClient().getId();
            this.clientName = row.getClient().getName();
            if(row.getGroup() != null) {
                this.groupId = row.getGroup().getId();
                this.groupName = row.getGroup().getName();
            }
        }

        public Long getClientId() {
            return clientId;
        }

        public void setClientId(Long clientId) {
            this.clientId = clientId;
        }

        public String getClientName() {
            return clientName;
        }

        public void setClientName(String clientName) {
            this.clientName = clientName;
        }

        public Long getGroupId() {
            return groupId;
        }

        public void setGroupId(Long groupId) {
            this.groupId = groupId;
        }

        public String getGroupName() {
            return groupName;
        }

        public void setGroupName(String groupName) {
            this.groupName = groupName;
        }

        public Long getProjectCodeId() {
            return projectCodeId;
        }

        public void setProjectCodeId(Long projectCodeId) {
            this.projectCodeId = projectCodeId;
        }

        public String getProjectCodeCode() {
            return projectCodeCode;
        }

        public void setProjectCodeCode(String projectCodeCode) {
            this.projectCodeCode = projectCodeCode;
        }
    }

    List<Row> rows = new LinkedList<Row>();
    YearMonthDateTime createdAt;

    public YearMonthDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(YearMonthDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public List<Row> getRows() {
        return rows;
    }

    public void setRows(List<Row> rows) {
        this.rows = rows;
    }

    public CodeListReportVO(CodeListReport codeListReport) {
        this.createdAt = new YearMonthDateTime(codeListReport.getCreatedAt());
        
        for(CodeListReport.Row row : codeListReport.getRows()) {
            this.rows.add(new CodeListReportVO.Row(row));
        }
    }
}
