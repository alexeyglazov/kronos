/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.reports.vo;

import com.mazars.management.db.comparators.EmployeePositionHistoryItemComparator;
import com.mazars.management.db.domain.*;
import com.mazars.management.db.vo.*;
import com.mazars.management.reports.*;
import com.mazars.management.web.vo.CarreerItemVO;
import java.math.BigDecimal;
import java.util.Calendar;
import java.util.Collections;
import java.util.List;
import java.util.LinkedList;
import java.util.Date;
/**
 *
 * @author glazov
 */
public class IndividualPerformanceReportVO {
    public class ClientTimespentItem {
        Long clientId;
        String clientName;
        Long groupId;
        String groupName;
        Long timespent;

        public ClientTimespentItem(Client client, Group group, Long timespent) {
            if(client != null) {
                this.clientId = client.getId();
                this.clientName = client.getName();
            }
            if(group != null) {
                this.groupId = group.getId();
                this.groupName = group.getName();
            }
            this.timespent = timespent;
        }

        public Long getTimespent() {
            return timespent;
        }

        public void setTimespent(Long timespent) {
            this.timespent = timespent;
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
    }
    public class NotInternalTaskTimespentItem {
        Long taskTypeId;
        String taskTypeName;
        Long taskId;
        String taskName;
        Long timespent;

        public Long getTaskTypeId() {
            return taskTypeId;
        }

        public void setTaskTypeId(Long taskTypeId) {
            this.taskTypeId = taskTypeId;
        }

        public String getTaskTypeName() {
            return taskTypeName;
        }

        public void setTaskTypeName(String taskTypeName) {
            this.taskTypeName = taskTypeName;
        }

        public Long getTaskId() {
            return taskId;
        }

        public void setTaskId(Long taskId) {
            this.taskId = taskId;
        }

        public String getTaskName() {
            return taskName;
        }

        public void setTaskName(String taskName) {
            this.taskName = taskName;
        }

        public Long getTimespent() {
            return timespent;
        }

        public void setTimespent(Long timespent) {
            this.timespent = timespent;
        }
    }
    public class InternalTaskTimespentItem {
        Long taskId;
        String taskName;
        Long timespent;

        public Long getTaskId() {
            return taskId;
        }

        public void setTaskId(Long taskId) {
            this.taskId = taskId;
        }

        public String getTaskName() {
            return taskName;
        }

        public void setTaskName(String taskName) {
            this.taskName = taskName;
        }

        public Long getTimespent() {
            return timespent;
        }

        public void setTimespent(Long timespent) {
            this.timespent = timespent;
        }
    }
    public class EmployeeReport {
        private EmployeeWithoutPasswordVO employee;
        private List<CarreerItemVO> carreerItems = new LinkedList<CarreerItemVO>();
        private List<ClientTimespentItem> clientTimespentItems = new LinkedList<ClientTimespentItem>();
        private List<NotInternalTaskTimespentItem> notInternalTaskTimespentItems = new LinkedList<NotInternalTaskTimespentItem>();
        private List<InternalTaskTimespentItem> internalTaskTimespentItems = new LinkedList<InternalTaskTimespentItem>();

        public EmployeeReport(IndividualPerformanceReport.EmployeeReport employeeReport) {
            this.employee = new EmployeeWithoutPasswordVO(employeeReport.getEmployee());
            List<EmployeePositionHistoryItem> tmpEmployeePositionHistoryItems = new LinkedList<EmployeePositionHistoryItem>();
            tmpEmployeePositionHistoryItems.addAll(employeeReport.getEmployee().getEmployeePositionHistoryItems());
            Collections.sort(tmpEmployeePositionHistoryItems, new EmployeePositionHistoryItemComparator());
            for(EmployeePositionHistoryItem employeePositionHistoryItem : tmpEmployeePositionHistoryItems) {
                this.carreerItems.add(new CarreerItemVO(employeePositionHistoryItem));
            }
            for(Client client : employeeReport.getClientTimespentItems().keySet()) {
                Group group = client.getGroup();
                ClientTimespentItem clientTimespentItem = new ClientTimespentItem(client, client.getGroup(), employeeReport.getClientTimespentItems().get(client));        
                clientTimespentItems.add(clientTimespentItem);
            }
            for(Task task : employeeReport.getNotInternalTaskTimespentItems().keySet()) {
                TaskType taskType = task.getTaskType();
                NotInternalTaskTimespentItem notInternalTaskTimespentItem = new NotInternalTaskTimespentItem();
                notInternalTaskTimespentItem.setTaskId(task.getId());
                notInternalTaskTimespentItem.setTaskName(task.getName());
                notInternalTaskTimespentItem.setTimespent(employeeReport.getNotInternalTaskTimespentItems().get(task));
                
                notInternalTaskTimespentItem.setTaskTypeId(taskType.getId());
                notInternalTaskTimespentItem.setTaskTypeName(taskType.getName());
                
                notInternalTaskTimespentItems.add(notInternalTaskTimespentItem);
            }
            for(Task task : employeeReport.getInternalTaskTimespentItems().keySet()) {
                InternalTaskTimespentItem internalTaskTimespentItem = new InternalTaskTimespentItem();
                internalTaskTimespentItem.setTaskId(task.getId());
                internalTaskTimespentItem.setTaskName(task.getName());
                internalTaskTimespentItem.setTimespent(employeeReport.getInternalTaskTimespentItems().get(task));
                internalTaskTimespentItems.add(internalTaskTimespentItem);
            }
        }

        public EmployeeWithoutPasswordVO getEmployee() {
            return employee;
        }

        public void setEmployee(EmployeeWithoutPasswordVO employee) {
            this.employee = employee;
        }

        public List<InternalTaskTimespentItem> getInternalTaskTimespentItems() {
            return internalTaskTimespentItems;
        }

        public void setInternalTaskTimespentItems(List<InternalTaskTimespentItem> internalTaskTimespentItems) {
            this.internalTaskTimespentItems = internalTaskTimespentItems;
        }

        public List<NotInternalTaskTimespentItem> getNotInternalTaskTimespentItems() {
            return notInternalTaskTimespentItems;
        }

        public void setNotInternalTaskTimespentItems(List<NotInternalTaskTimespentItem> notInternalTaskTimespentItems) {
            this.notInternalTaskTimespentItems = notInternalTaskTimespentItems;
        }

        public List<CarreerItemVO> getCarreerItems() {
            return carreerItems;
        }

        public void setCarreerItems(List<CarreerItemVO> carreerItems) {
            this.carreerItems = carreerItems;
        }

        public List<ClientTimespentItem> getClientTimespentItems() {
            return clientTimespentItems;
        }

        public void setClientTimespentItems(List<ClientTimespentItem> clientTimespentItems) {
            this.clientTimespentItems = clientTimespentItems;
        }
    }

    List<EmployeeReport> employeeReports = new LinkedList<EmployeeReport>();
    private Date createdAt;

    private String formOfficeName;
    private String formDepartmentName;
    private String formSubdepartmentName;
    private String formEmployeeUserName;
    private YearMonthDate formStartDate;
    private YearMonthDate formEndDate;

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public String getFormEmployeeUserName() {
        return formEmployeeUserName;
    }

    public void setFormEmployeeUserName(String formEmployeeUserName) {
        this.formEmployeeUserName = formEmployeeUserName;
    }

    public String getFormDepartmentName() {
        return formDepartmentName;
    }

    public void setFormDepartmentName(String formDepartmentName) {
        this.formDepartmentName = formDepartmentName;
    }

    public YearMonthDate getFormEndDate() {
        return formEndDate;
    }

    public void setFormEndDate(YearMonthDate formEndDate) {
        this.formEndDate = formEndDate;
    }

    public String getFormOfficeName() {
        return formOfficeName;
    }

    public void setFormOfficeName(String formOfficeName) {
        this.formOfficeName = formOfficeName;
    }

    public YearMonthDate getFormStartDate() {
        return formStartDate;
    }

    public void setFormStartDate(YearMonthDate formStartDate) {
        this.formStartDate = formStartDate;
    }

    public String getFormSubdepartmentName() {
        return formSubdepartmentName;
    }

    public void setFormSubdepartmentName(String formSubdepartmentName) {
        this.formSubdepartmentName = formSubdepartmentName;
    }

    public List<EmployeeReport> getEmployeeReports() {
        return employeeReports;
    }

    public void setEmployeeReports(List<EmployeeReport> employeeReports) {
        this.employeeReports = employeeReports;
    }


    public IndividualPerformanceReportVO(IndividualPerformanceReport individualPerformanceReport) {
        this.createdAt = individualPerformanceReport.getCreatedAt();

        if(individualPerformanceReport.getFormOffice() != null) {
            this.formOfficeName = individualPerformanceReport.getFormOffice().getName();
        }
        if(individualPerformanceReport.getFormDepartment() != null) {
            this.formDepartmentName = individualPerformanceReport.getFormDepartment().getName();
        }
        if(individualPerformanceReport.getFormSubdepartment() != null) {
            this.formSubdepartmentName = individualPerformanceReport.getFormSubdepartment().getName();
        }
        if(individualPerformanceReport.getFormEmployee() != null) {
            this.formEmployeeUserName = individualPerformanceReport.getFormEmployee().getUserName();
        }
        this.formStartDate = individualPerformanceReport.getFormStartDate();
        this.formEndDate = individualPerformanceReport.getFormEndDate();

        for(IndividualPerformanceReport.EmployeeReport employeeReport : individualPerformanceReport.getEmployeeReports()) {
            this.employeeReports.add(new IndividualPerformanceReportVO.EmployeeReport(employeeReport));
        }
    }
}
