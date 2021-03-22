/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.reports.vo;

import com.mazars.management.db.domain.EmployeePositionHistoryItem;
import com.mazars.management.db.domain.EmployeePositionHistoryItem.ContractType;
import com.mazars.management.db.domain.LeavesItem.Type;
import com.mazars.management.db.vo.*;
import com.mazars.management.db.domain.LeavesItem;
import com.mazars.management.db.domain.Task;
import com.mazars.management.reports.*;
import java.util.List;
import java.util.LinkedList;
import java.util.Calendar;
import java.util.Map;
/**
 *
 * @author glazov
 */
public class ProductivityAndCompletionReportVO {
    public class Row {
        private Long employeePositionHistoryItemId;
        private Long employeeId;
        private String employeeUserName;
        private String employeeFirstName;
        private String employeeLastName;
        private String positionName;
        private String standardPositionName;
        private String subdepartmentName;
        private Long notIdleDaysCount;
        private Long projectTimespent;
        private Map<Long, Long> idleTimespentItems;
        private Long notIdleInternalTimespent;
        private LeavesItem.Type leavesItemType;
        private Calendar entryDate;
        private Calendar exitDate;
        private Integer workingDaysCount;
        private EmployeePositionHistoryItem.ContractType contractType;
        private Integer partTimePercentage;

        public Row(ProductivityAndCompletionReport.Row row) {
            this.employeePositionHistoryItemId = row.getEmployeePositionHistoryItemId();
            this.employeeId = row.getEmployeeId();
            this.employeeUserName = row.getEmployeeUserName();
            this.employeeFirstName = row.getEmployeeFirstName();
            this.employeeLastName = row.getEmployeeLastName();
            this.positionName = row.getPositionName();
            this.standardPositionName = row.getStandardPositionName();
            this.subdepartmentName = row.getSubdepartmentName();
            this.notIdleDaysCount = row.getNotIdleDaysCount();
            this.projectTimespent = row.getProjectTimespent();
            this.idleTimespentItems = row.getIdleTimespentItems();
            this.notIdleInternalTimespent = row.getNotIdleInternalTimespent();
            this.leavesItemType = row.getLeavesItemType();
            this.entryDate = row.getEntryDate();
            this.exitDate = row.getExitDate();
            this.workingDaysCount = row.getWorkingDaysCount();
            this.contractType = row.getContractType();
            this.partTimePercentage = row.getPartTimePercentage();
        }

        public ContractType getContractType() {
            return contractType;
        }

        public void setContractType(ContractType contractType) {
            this.contractType = contractType;
        }

        public Integer getPartTimePercentage() {
            return partTimePercentage;
        }

        public void setPartTimePercentage(Integer partTimePercentage) {
            this.partTimePercentage = partTimePercentage;
        }

        public Long getNotIdleDaysCount() {
            return notIdleDaysCount;
        }

        public void setNotIdleDaysCount(Long notIdleDaysCount) {
            this.notIdleDaysCount = notIdleDaysCount;
        }

        public Long getEmployeePositionHistoryItemId() {
            return employeePositionHistoryItemId;
        }

        public void setEmployeePositionHistoryItemId(Long employeePositionHistoryItemId) {
            this.employeePositionHistoryItemId = employeePositionHistoryItemId;
        }

        public String getEmployeeUserName() {
            return employeeUserName;
        }

        public void setEmployeeUserName(String employeeUserName) {
            this.employeeUserName = employeeUserName;
        }

        public Integer getWorkingDaysCount() {
            return workingDaysCount;
        }

        public void setWorkingDaysCount(Integer workingDaysCount) {
            this.workingDaysCount = workingDaysCount;
        }

        public String getEmployeeFirstName() {
            return employeeFirstName;
        }

        public void setEmployeeFirstName(String employeeFirstName) {
            this.employeeFirstName = employeeFirstName;
        }

        public Long getEmployeeId() {
            return employeeId;
        }

        public void setEmployeeId(Long employeeId) {
            this.employeeId = employeeId;
        }

        public String getEmployeeLastName() {
            return employeeLastName;
        }

        public void setEmployeeLastName(String employeeLastName) {
            this.employeeLastName = employeeLastName;
        }

        public Calendar getEntryDate() {
            return entryDate;
        }

        public void setEntryDate(Calendar entryDate) {
            this.entryDate = entryDate;
        }

        public Calendar getExitDate() {
            return exitDate;
        }

        public void setExitDate(Calendar exitDate) {
            this.exitDate = exitDate;
        }

        public Map<Long, Long> getIdleTimespentItems() {
            return idleTimespentItems;
        }

        public void setIdleTimespentItems(Map<Long, Long> idleTimespentItems) {
            this.idleTimespentItems = idleTimespentItems;
        }

        public Type getLeavesItemType() {
            return leavesItemType;
        }

        public void setLeavesItemType(Type leavesItemType) {
            this.leavesItemType = leavesItemType;
        }

        public Long getNotIdleInternalTimespent() {
            return notIdleInternalTimespent;
        }

        public void setNotIdleInternalTimespent(Long notIdleInternalTimespent) {
            this.notIdleInternalTimespent = notIdleInternalTimespent;
        }

        public String getPositionName() {
            return positionName;
        }

        public void setPositionName(String positionName) {
            this.positionName = positionName;
        }

        public Long getProjectTimespent() {
            return projectTimespent;
        }

        public void setProjectTimespent(Long projectTimespent) {
            this.projectTimespent = projectTimespent;
        }

        public String getStandardPositionName() {
            return standardPositionName;
        }

        public void setStandardPositionName(String standardPositionName) {
            this.standardPositionName = standardPositionName;
        }

        public String getSubdepartmentName() {
            return subdepartmentName;
        }

        public void setSubdepartmentName(String subdepartmentName) {
            this.subdepartmentName = subdepartmentName;
        }
    }

    List<Row> rows = new LinkedList<Row>();
    private List<TaskVO> idleTasks = new LinkedList<TaskVO>();

    public List<Row> getRows() {
        return rows;
    }

    public void setRows(List<Row> rows) {
        this.rows = rows;
    }

    public ProductivityAndCompletionReportVO(ProductivityAndCompletionReport productivityAndCompletionReport) {
        for(ProductivityAndCompletionReport.Row row : productivityAndCompletionReport.getRows()) {
            this.rows.add(new ProductivityAndCompletionReportVO.Row(row));
        }
        for(Task idleTask : productivityAndCompletionReport.getIdleTasks()) {
            this.idleTasks.add(new TaskVO(idleTask));
        }
    }
}
