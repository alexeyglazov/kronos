/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.web.forms;
import com.google.gson.Gson;
import com.mazars.management.db.vo.*;
import com.mazars.management.db.domain.LeavesItem.Type;
import java.util.List;
import java.util.LinkedList;
/**
 *
 * @author glazov
 */
public class CarreerEditForm {
    public static class EmployeePositionHistoryItem {
        private Long id;
        private Long positionId;
        private YearMonthDate start;
        private YearMonthDate end;
        private com.mazars.management.db.domain.EmployeePositionHistoryItem.ContractType contractType;
        private Integer partTimePercentage;

        public YearMonthDate getEnd() {
            return end;
        }

        public void setEnd(YearMonthDate end) {
            this.end = end;
        }

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public Long getPositionId() {
            return positionId;
        }

        public void setPositionId(Long positionId) {
            this.positionId = positionId;
        }

        public YearMonthDate getStart() {
            return start;
        }

        public void setStart(YearMonthDate start) {
            this.start = start;
        }

        public com.mazars.management.db.domain.EmployeePositionHistoryItem.ContractType getContractType() {
            return contractType;
        }

        public void setContractType(com.mazars.management.db.domain.EmployeePositionHistoryItem.ContractType contractType) {
            this.contractType = contractType;
        }

        public Integer getPartTimePercentage() {
            return partTimePercentage;
        }

        public void setPartTimePercentage(Integer partTimePercentage) {
            this.partTimePercentage = partTimePercentage;
        }
    }
    public static class LeavesItem {
        private Long id;
        private com.mazars.management.db.domain.LeavesItem.Type type;
        private YearMonthDate start;
        private YearMonthDate end;

        public YearMonthDate getEnd() {
            return end;
        }

        public void setEnd(YearMonthDate end) {
            this.end = end;
        }

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public YearMonthDate getStart() {
            return start;
        }

        public void setStart(YearMonthDate start) {
            this.start = start;
        }

        public Type getType() {
            return type;
        }

        public void setType(Type type) {
            this.type = type;
        }
    }
    private Long employeeId;
    private List<EmployeePositionHistoryItem> employeePositionHistoryItems = new LinkedList<EmployeePositionHistoryItem>();
    private List<LeavesItem> leavesItems = new LinkedList<LeavesItem>();


    public CarreerEditForm() {
    }

    public Long getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(Long employeeId) {
        this.employeeId = employeeId;
    }

    public List<EmployeePositionHistoryItem> getEmployeePositionHistoryItems() {
        return employeePositionHistoryItems;
    }

    public void setEmployeePositionHistoryItems(List<EmployeePositionHistoryItem> employeePositionHistoryItems) {
        this.employeePositionHistoryItems = employeePositionHistoryItems;
    }

    public List<LeavesItem> getLeavesItems() {
        return leavesItems;
    }

    public void setLeavesItems(List<LeavesItem> leavesItems) {
        this.leavesItems = leavesItems;
    }

    public static CarreerEditForm getFromJson(String json) {
        Gson gson = new Gson();
        return gson.fromJson(json, CarreerEditForm.class);
    }

}
