/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.reports.vo;

import com.mazars.management.db.domain.*;
import com.mazars.management.db.domain.FeesItem.Type;
import com.mazars.management.db.vo.*;
import com.mazars.management.reports.*;
import com.mazars.management.web.vo.ConciseEmployee;
import java.math.BigDecimal;
import java.util.Calendar;
import java.util.LinkedList;
import java.util.List;
/**
 *
 * @author glazov
 */
public class OutOfOfficeReportVO {
    public class Row {
        private Long employeeId;
        private YearMonthDate startDate;
        private YearMonthDate endDate;
        public Row() {
            
        }
        public Row(OutOfOfficeReport.Row row) {
            this.employeeId = row.getEmployee().getId();
            this.startDate = new YearMonthDate(row.getStartDate());
            this.endDate = new YearMonthDate(row.getEndDate());
        }

        public Long getEmployeeId() {
            return employeeId;
        }

        public void setEmployeeId(Long employeeId) {
            this.employeeId = employeeId;
        }

        public YearMonthDate getStartDate() {
            return startDate;
        }

        public void setStartDate(YearMonthDate startDate) {
            this.startDate = startDate;
        }

        public YearMonthDate getEndDate() {
            return endDate;
        }

        public void setEndDate(YearMonthDate endDate) {
            this.endDate = endDate;
        }
    }
    public class TaskRow extends Row {
        private Long taskId;

        public TaskRow() {
        }

        public TaskRow(OutOfOfficeReport.TaskRow taskRow) {
            super(taskRow);
            this.taskId = taskRow.getTask().getId();;
        }

        public Long getTaskId() {
            return taskId;
        }

        public void setTaskId(Long taskId) {
            this.taskId = taskId;
        }

    }
    public class BusinessTripRow extends Row {
        private Long projectCodeId;

        public BusinessTripRow() {
        }

        public BusinessTripRow(OutOfOfficeReport.BusinessTripRow businessTripRow) {
            super(businessTripRow);
            this.projectCodeId = businessTripRow.getProjectCode().getId();
        }

        public Long getProjectCodeId() {
            return projectCodeId;
        }

        public void setProjectCodeId(Long projectCodeId) {
            this.projectCodeId = projectCodeId;
        }
        
    }

    List<Row> rows = new LinkedList<Row>();
    List<TaskVO> tasks = new LinkedList<TaskVO>();
    List<ProjectCodeVO> projectCodes = new LinkedList<ProjectCodeVO>();
    List<ConciseEmployee> employees = new LinkedList<ConciseEmployee>();
    YearMonthDateTime createdAt;

    private OfficeVO formOffice;
    private DepartmentVO formDepartment;
    private SubdepartmentVO formSubdepartment;
    private YearMonthDate formStartDate;
    private YearMonthDate formEndDate;


    public YearMonthDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(YearMonthDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public YearMonthDate getFormEndDate() {
        return formEndDate;
    }

    public void setFormEndDate(YearMonthDate formEndDate) {
        this.formEndDate = formEndDate;
    }


    public YearMonthDate getFormStartDate() {
        return formStartDate;
    }

    public void setFormStartDate(YearMonthDate formStartDate) {
        this.formStartDate = formStartDate;
    }

    public List<Row> getRows() {
        return rows;
    }

    public void setRows(List<Row> rows) {
        this.rows = rows;
    }



    public OfficeVO getFormOffice() {
        return formOffice;
    }

    public void setFormOffice(OfficeVO formOffice) {
        this.formOffice = formOffice;
    }

    public DepartmentVO getFormDepartment() {
        return formDepartment;
    }

    public void setFormDepartment(DepartmentVO formDepartment) {
        this.formDepartment = formDepartment;
    }

    public SubdepartmentVO getFormSubdepartment() {
        return formSubdepartment;
    }

    public void setFormSubdepartment(SubdepartmentVO formSubdepartment) {
        this.formSubdepartment = formSubdepartment;
    }

    public OutOfOfficeReportVO(OutOfOfficeReport outOfOfficeReport) {
        this.createdAt = new YearMonthDateTime(outOfOfficeReport.getCreatedAt());
        if(outOfOfficeReport.getFormOffice() != null) {
            this.formOffice = new OfficeVO(outOfOfficeReport.getFormOffice());
        }
        if(outOfOfficeReport.getFormDepartment() != null) {
            this.formDepartment = new DepartmentVO(outOfOfficeReport.getFormDepartment());
        }
        if(outOfOfficeReport.getFormSubdepartment() != null) {
            this.formSubdepartment = new SubdepartmentVO(outOfOfficeReport.getFormSubdepartment());
        }
        this.formStartDate = outOfOfficeReport.getFormStartDate();
        this.formEndDate = outOfOfficeReport.getFormEndDate();
        
        for(OutOfOfficeReport.Row row : outOfOfficeReport.getRows())  {
            if(row instanceof OutOfOfficeReport.BusinessTripRow) {
                this.rows.add(new OutOfOfficeReportVO.BusinessTripRow((OutOfOfficeReport.BusinessTripRow)row));
            } else if(row instanceof OutOfOfficeReport.TaskRow) {
                this.rows.add(new OutOfOfficeReportVO.TaskRow((OutOfOfficeReport.TaskRow)row));
            }
        }
        
        List<Task> tasks = new LinkedList<Task>();
        List<ProjectCode> projectCodes = new LinkedList<ProjectCode>();
        List<Employee> employees = new LinkedList<Employee>();
        for(OutOfOfficeReport.Row row : outOfOfficeReport.getRows()) {
            if(row instanceof OutOfOfficeReport.TaskRow) {
                Task task = ((OutOfOfficeReport.TaskRow)row).getTask();
                boolean isFound = false;
                for(Task tmpTask : tasks) {
                    if(tmpTask.getId().equals(task.getId())) {
                        isFound = true;
                        break;
                    }
                }
                if(! isFound) {
                    tasks.add(task);
                }
            } else if(row instanceof OutOfOfficeReport.BusinessTripRow) {
                ProjectCode projectCode = ((OutOfOfficeReport.BusinessTripRow)row).getProjectCode();
                boolean isFound = false;
                for(ProjectCode tmpProjectCode : projectCodes) {
                    if(tmpProjectCode.getId().equals(projectCode.getId())) {
                        isFound = true;
                        break;
                    }
                }
                if(! isFound) {
                    projectCodes.add(projectCode);
                }            
            }
            Employee employee = row.getEmployee();
            boolean isFound = false;
            for(Employee tmpEmployee : employees) {
                if(tmpEmployee.getId().equals(employee.getId())) {
                    isFound = true;
                    break;
                }
            }
            if(! isFound) {
                employees.add(employee);
            }                        
        }
        this.tasks = TaskVO.getList(tasks);
        this.projectCodes = ProjectCodeVO.getList(projectCodes);
        this.employees = ConciseEmployee.getList(employees);
    }    
}
