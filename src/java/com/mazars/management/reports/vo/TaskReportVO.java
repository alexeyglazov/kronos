/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.reports.vo;

import com.mazars.management.db.domain.Client;
import com.mazars.management.db.domain.Department;
import com.mazars.management.db.domain.Employee;
import com.mazars.management.db.domain.Group;
import com.mazars.management.db.vo.*;
import com.mazars.management.db.domain.Office;
import com.mazars.management.db.domain.Position;
import com.mazars.management.db.domain.ProjectCode;
import com.mazars.management.db.domain.Subdepartment;
import com.mazars.management.reports.*;
import java.util.List;
import java.util.LinkedList;
/**
 *
 * @author glazov
 */
public class TaskReportVO {
    public class Row {
        private Long officeId;
        private Long departmentId;
        private Long subdepartmentId;
        private Long positionId;
        private Long employeeId;
        private Long projectCodeId;
        private Long clientId;
        private Long groupId;
        private Long timeSpent;

        public Row(TaskReport.Row row) {
            this.officeId = row.getOffice().getId();
            this.departmentId = row.getDepartment().getId();
            this.subdepartmentId = row.getSubdepartment().getId();
            this.positionId = row.getPosition().getId();
            this.employeeId = row.getEmployee().getId();
            if(row.getProjectCode() != null) {
                this.projectCodeId = row.getProjectCode().getId();
            }
            if(row.getClient() != null) {
                this.clientId = row.getClient().getId();
            }
            if(row.getGroup() != null) {
                this.groupId = row.getGroup().getId();
            }
            this.timeSpent = row.getTimeSpent();
        }

        public Long getOfficeId() {
            return officeId;
        }

        public void setOfficeId(Long officeId) {
            this.officeId = officeId;
        }

        public Long getDepartmentId() {
            return departmentId;
        }

        public void setDepartmentId(Long departmentId) {
            this.departmentId = departmentId;
        }

        public Long getSubdepartmentId() {
            return subdepartmentId;
        }

        public void setSubdepartmentId(Long subdepartmentId) {
            this.subdepartmentId = subdepartmentId;
        }

        public Long getPositionId() {
            return positionId;
        }

        public void setPositionId(Long positionId) {
            this.positionId = positionId;
        }

        public Long getEmployeeId() {
            return employeeId;
        }

        public void setEmployeeId(Long employeeId) {
            this.employeeId = employeeId;
        }

        public Long getTimeSpent() {
            return timeSpent;
        }

        public void setTimeSpent(Long timeSpent) {
            this.timeSpent = timeSpent;
        }

        public Long getProjectCodeId() {
            return projectCodeId;
        }

        public void setProjectCodeId(Long projectCodeId) {
            this.projectCodeId = projectCodeId;
        }

        public Long getClientId() {
            return clientId;
        }

        public void setClientId(Long clientId) {
            this.clientId = clientId;
        }

        public Long getGroupId() {
            return groupId;
        }

        public void setGroupId(Long groupId) {
            this.groupId = groupId;
        }
    }

    List<Row> rows = new LinkedList<Row>();
    private List<OfficeVO> offices = new LinkedList<OfficeVO>();
    private List<DepartmentVO> departments = new LinkedList<DepartmentVO>();
    private List<SubdepartmentVO> subdepartments = new LinkedList<SubdepartmentVO>();
    private List<PositionVO> positions = new LinkedList<PositionVO>();
    private List<EmployeeWithoutPasswordVO> employees = new LinkedList<EmployeeWithoutPasswordVO>();
    private List<ProjectCodeVO> projectCodes = new LinkedList<ProjectCodeVO>();
    private List<ClientVO> clients = new LinkedList<ClientVO>();
    private List<GroupVO> groups = new LinkedList<GroupVO>();

    private YearMonthDateTime createdAt;
    
    private Long formTaskId;
    private String formTaskName;
    private YearMonthDate formStartDate;
    private YearMonthDate formEndDate;    

    public List<Row> getRows() {
        return rows;
    }
    public void setRows(List<Row> rows) {
        this.rows = rows;
    }

    public YearMonthDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(YearMonthDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public List<OfficeVO> getOffices() {
        return offices;
    }

    public void setOffices(List<OfficeVO> offices) {
        this.offices = offices;
    }

    public List<DepartmentVO> getDepartments() {
        return departments;
    }

    public void setDepartments(List<DepartmentVO> departments) {
        this.departments = departments;
    }

    public List<SubdepartmentVO> getSubdepartments() {
        return subdepartments;
    }

    public void setSubdepartments(List<SubdepartmentVO> subdepartments) {
        this.subdepartments = subdepartments;
    }

    public List<PositionVO> getPositions() {
        return positions;
    }

    public void setPositions(List<PositionVO> positions) {
        this.positions = positions;
    }

    public List<EmployeeWithoutPasswordVO> getEmployees() {
        return employees;
    }

    public void setEmployees(List<EmployeeWithoutPasswordVO> employees) {
        this.employees = employees;
    }

    public List<ProjectCodeVO> getProjectCodes() {
        return projectCodes;
    }

    public void setProjectCodes(List<ProjectCodeVO> projectCodes) {
        this.projectCodes = projectCodes;
    }

    public List<ClientVO> getClients() {
        return clients;
    }

    public void setClients(List<ClientVO> clients) {
        this.clients = clients;
    }

    public List<GroupVO> getGroups() {
        return groups;
    }

    public void setGroups(List<GroupVO> groups) {
        this.groups = groups;
    }

    public Long getFormTaskId() {
        return formTaskId;
    }

    public void setFormTaskId(Long formTaskId) {
        this.formTaskId = formTaskId;
    }

    public String getFormTaskName() {
        return formTaskName;
    }

    public void setFormTaskName(String formTaskName) {
        this.formTaskName = formTaskName;
    }

    public YearMonthDate getFormStartDate() {
        return formStartDate;
    }

    public void setFormStartDate(YearMonthDate formStartDate) {
        this.formStartDate = formStartDate;
    }

    public YearMonthDate getFormEndDate() {
        return formEndDate;
    }

    public void setFormEndDate(YearMonthDate formEndDate) {
        this.formEndDate = formEndDate;
    }

    public TaskReportVO(TaskReport taskReport) {
        for(TaskReport.Row row : taskReport.getRows()) {
            this.rows.add(new TaskReportVO.Row(row));
        }
        for(Office office : taskReport.getOffices()) {
            this.offices.add(new OfficeVO(office));
        }
        for(Department department : taskReport.getDepartments()) {
            this.departments.add(new DepartmentVO(department));
        }
        for(Subdepartment subdepartment : taskReport.getSubdepartments()) {
            this.subdepartments.add(new SubdepartmentVO(subdepartment));
        }
        for(Position position : taskReport.getPositions()) {
            this.positions.add(new PositionVO(position));
        }
        for(Employee employee : taskReport.getEmployees()) {
            this.employees.add(new EmployeeWithoutPasswordVO(employee));
        }
        for(ProjectCode projectCode : taskReport.getProjectCodes()) {
            this.projectCodes.add(new ProjectCodeVO(projectCode));
        }
        for(Client client : taskReport.getClients()) {
            this.clients.add(new ClientVO(client));
        }
        for(Group group : taskReport.getGroups()) {
            this.groups.add(new GroupVO(group));
        }
        this.createdAt = new YearMonthDateTime(taskReport.getCreatedAt());
        if(taskReport.getFormTask() != null) {
            this.formTaskId = taskReport.getFormTask().getId();
            this.formTaskName = taskReport.getFormTask().getName();
        }
        if(taskReport.getFormStartDate() != null) {
            this.formStartDate = new YearMonthDate(taskReport.getFormStartDate());
        }
        if(taskReport.getFormEndDate() != null) {
            this.formEndDate = new YearMonthDate(taskReport.getFormEndDate());        
        }
    }
}
