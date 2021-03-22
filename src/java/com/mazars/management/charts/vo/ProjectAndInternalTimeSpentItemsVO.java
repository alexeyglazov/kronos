/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mazars.management.charts.vo;

import com.mazars.management.charts.data.ProjectAndInternalTimeSpentItems;
import com.mazars.management.charts.data.ProjectAndInternalTimeSpentItems.View;
import com.mazars.management.db.domain.ProjectCode;
import com.mazars.management.db.domain.Task;
import com.mazars.management.db.vo.EmployeeWithoutPasswordVO;
import java.util.Calendar;
import java.util.LinkedList;
import java.util.List;
/**
 *
 * @author Glazov
 */
public class ProjectAndInternalTimeSpentItemsVO {
    public class ProjectTimeSpentItem {
        Long projectCodeId;
        String projectCodeCode;
        Long timeSpent;

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

        public Long getTimeSpent() {
            return timeSpent;
        }

        public void setTimeSpent(Long timeSpent) {
            this.timeSpent = timeSpent;
        }
    }
    public class InternalTimeSpentItem {
        Long taskId;
        String taskName;
        Long timeSpent;

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

        public Long getTimeSpent() {
            return timeSpent;
        }

        public void setTimeSpent(Long timeSpent) {
            this.timeSpent = timeSpent;
        }
    }
    private EmployeeWithoutPasswordVO employee;
    private Calendar startDate;
    private Calendar endDate;
    private ProjectAndInternalTimeSpentItems.View view;
    private List<ProjectTimeSpentItem> projectTimeSpentItems = new LinkedList<ProjectTimeSpentItem>();
    private List<InternalTimeSpentItem> internalTimeSpentItems = new LinkedList<InternalTimeSpentItem>();

    public ProjectAndInternalTimeSpentItemsVO(ProjectAndInternalTimeSpentItems projectAndInternalTimeSpentItems) {
        this.employee = new EmployeeWithoutPasswordVO(projectAndInternalTimeSpentItems.getEmployee());
        this.startDate = projectAndInternalTimeSpentItems.getStartDate();
        this.endDate = projectAndInternalTimeSpentItems.getEndDate();
        this.view = projectAndInternalTimeSpentItems.getView();
        for(ProjectCode projectCode : projectAndInternalTimeSpentItems.getProjectTimeSpentItems().keySet()) {
            Long timeSpent = projectAndInternalTimeSpentItems.getProjectTimeSpentItems().get(projectCode);
            ProjectTimeSpentItem projectTimeSpentItem = new ProjectTimeSpentItem();
            projectTimeSpentItem.setProjectCodeId(projectCode.getId());
            projectTimeSpentItem.setProjectCodeCode(projectCode.getCode());
            projectTimeSpentItem.setTimeSpent(timeSpent);
            this.projectTimeSpentItems.add(projectTimeSpentItem);
        }
        for(Task task : projectAndInternalTimeSpentItems.getInternalTimeSpentItems().keySet()) {
            Long timeSpent = projectAndInternalTimeSpentItems.getInternalTimeSpentItems().get(task);
            InternalTimeSpentItem internalTimeSpentItem = new InternalTimeSpentItem();
            internalTimeSpentItem.setTaskId(task.getId());
            internalTimeSpentItem.setTaskName(task.getName());
            internalTimeSpentItem.setTimeSpent(timeSpent);
            this.internalTimeSpentItems.add(internalTimeSpentItem);
        }
    }

    public View getView() {
        return view;
    }

    public void setView(View view) {
        this.view = view;
    }

    public EmployeeWithoutPasswordVO getEmployee() {
        return employee;
    }

    public void setEmployee(EmployeeWithoutPasswordVO employee) {
        this.employee = employee;
    }

    public Calendar getStartDate() {
        return startDate;
    }

    public void setStartDate(Calendar startDate) {
        this.startDate = startDate;
    }

    public Calendar getEndDate() {
        return endDate;
    }

    public void setEndDate(Calendar endDate) {
        this.endDate = endDate;
    }

    public List<ProjectTimeSpentItem> getProjectTimeSpentItems() {
        return projectTimeSpentItems;
    }

    public void setProjectTimeSpentItems(List<ProjectTimeSpentItem> projectTimeSpentItems) {
        this.projectTimeSpentItems = projectTimeSpentItems;
    }

    public List<InternalTimeSpentItem> getInternalTimeSpentItems() {
        return internalTimeSpentItems;
    }

    public void setInternalTimeSpentItems(List<InternalTimeSpentItem> internalTimeSpentItems) {
        this.internalTimeSpentItems = internalTimeSpentItems;
    }
    
}
