/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mazars.management.web.vo;

import com.mazars.management.db.domain.ProjectCode;
import com.mazars.management.db.domain.Task;
import com.mazars.management.db.domain.TaskType;
import com.mazars.management.db.domain.TimeSpentItem;
import com.mazars.management.db.util.TimeSpentItemUtil.DescribedTimeSpentItem;
import com.mazars.management.db.vo.YearMonthDate;
import java.util.LinkedList;
import java.util.List;

/**
 *
 * @author glazov
 */
public class DescribedTimeSpentItemsInfo {
    public static class ProjectDataVO {
        private List<ProjectCodeVO> projectCodes = new LinkedList<ProjectCodeVO>();

        public ProjectDataVO() {
        }
        public ProjectCodeVO getProjectCode(Long projectCodeId) {
            for(ProjectCodeVO projectCode : this.getProjectCodes()) {
                if(projectCode.getId().equals(projectCodeId)) {
                    return projectCode;
                }
            }
            return null;
        }        
        public List<ProjectCodeVO> getProjectCodes() {
            return projectCodes;
        }

        public void setProjectCodes(List<ProjectCodeVO> projectCodes) {
            this.projectCodes = projectCodes;
        }
    }
    public static class InternalDataVO {
        private List<TaskTypeVO> taskTypes = new LinkedList<TaskTypeVO>();

        public InternalDataVO() {
        }
        public TaskTypeVO getTaskType(Long taskTypeId) {
            for(TaskTypeVO taskType : this.getTaskTypes()) {
                if(taskType.getId().equals(taskTypeId)) {
                    return taskType;
                }
            }
            return null;
        }        

        public List<TaskTypeVO> getTaskTypes() {
            return taskTypes;
        }

        public void setTaskTypes(List<TaskTypeVO> taskTypes) {
            this.taskTypes = taskTypes;
        }
    }
    public static class ProjectCodeVO {
        private Long id;
        private String code;
        private String description;
        private Boolean isClosed;
        private List<TaskTypeVO> taskTypes = new LinkedList<TaskTypeVO>();

        public ProjectCodeVO(ProjectCode projectCode) {
            this.id = projectCode.getId();
            this.code = projectCode.getCode();
            this.description = projectCode.getDescription();
            this.isClosed = projectCode.getIsClosed();
        }
        public TaskTypeVO getTaskType(Long taskTypeId) {
            for(TaskTypeVO taskType : this.getTaskTypes()) {
                if(taskType.getId().equals(taskTypeId)) {
                    return taskType;
                }
            }
            return null;
        }        

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public Boolean isIsClosed() {
            return isClosed;
        }

        public void setIsClosed(Boolean isClosed) {
            this.isClosed = isClosed;
        }

        public String getCode() {
            return code;
        }

        public void setCode(String code) {
            this.code = code;
        }

        public String getDescription() {
            return description;
        }

        public void setDescription(String description) {
            this.description = description;
        }

        public List<TaskTypeVO> getTaskTypes() {
            return taskTypes;
        }

        public void setTaskTypes(List<TaskTypeVO> taskTypes) {
            this.taskTypes = taskTypes;
        }
    }
    public static class TaskTypeVO {
        private Long id;
        private String name;
        private List<TaskVO> tasks = new LinkedList<TaskVO>();

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public List<TaskVO> getTasks() {
            return tasks;
        }

        public void setTasks(List<TaskVO> tasks) {
            this.tasks = tasks;
        }

 
        public TaskTypeVO(TaskType taskType) {
            this.id = taskType.getId();
            this.name = taskType.getName();
        }
        public TaskVO getTask(Long taskId) {
            for(TaskVO task : this.getTasks()) {
                if(task.getId().equals(taskId)) {
                    return task;
                }
            }
            return null;
        }        
    }
    public static class TaskVO {
        private Long id;
        private String name;
        private List<TimeSpentItemVO> timeSpentItems = new LinkedList<TimeSpentItemVO>();

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public List<TimeSpentItemVO> getTimeSpentItems() {
            return timeSpentItems;
        }

        public void setTimeSpentItems(List<TimeSpentItemVO> timeSpentItems) {
            this.timeSpentItems = timeSpentItems;
        }
       public TaskVO(Task task) {
            this.id = task.getId();
            this.name = task.getName();
        }
        public TimeSpentItemVO getTimeSpentItem(Long timeSpentItemId) {
            for(TimeSpentItemVO timeSpentItem : this.getTimeSpentItems()) {
                if(timeSpentItem.getId().equals(timeSpentItemId)) {
                    return timeSpentItem;
                }
            }
            return null;
        }      
    }
    public static class TimeSpentItemVO {
        private Long id;
        private YearMonthDate day;
        private Integer timeSpent;

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public YearMonthDate getDay() {
            return day;
        }

        public void setDay(YearMonthDate day) {
            this.day = day;
        }

        public Integer getTimeSpent() {
            return timeSpent;
        }

        public void setTimeSpent(Integer timeSpent) {
            this.timeSpent = timeSpent;
        }

        public TimeSpentItemVO(TimeSpentItem timeSpentItem) {
            this.id = timeSpentItem.getId();
            this.day = new YearMonthDate(timeSpentItem.getDay());
            this.timeSpent = timeSpentItem.getTimeSpent();
        }
        
    }
    private ProjectDataVO projectData = new DescribedTimeSpentItemsInfo.ProjectDataVO();
    private InternalDataVO internalData = new DescribedTimeSpentItemsInfo.InternalDataVO();

    public ProjectDataVO getProjectData() {
        return projectData;
    }

    public void setProjectData(ProjectDataVO projectData) {
        this.projectData = projectData;
    }

    public InternalDataVO getInternalData() {
        return internalData;
    }

    public void setInternalData(InternalDataVO internalData) {
        this.internalData = internalData;
    }

    public DescribedTimeSpentItemsInfo(List<DescribedTimeSpentItem> describedTimeSpentItems) {
        for(DescribedTimeSpentItem describedTimeSpentItem : describedTimeSpentItems) {
            ProjectCode projectCode = describedTimeSpentItem.getProjectCode();
            TaskType taskType = describedTimeSpentItem.getTaskType();
            Task task = describedTimeSpentItem.getTask();
            TimeSpentItem timeSpentItem = describedTimeSpentItem.getTimeSpentItem();
            
            TaskTypeVO taskTypeVO = null;
            if(projectCode != null) {
                ProjectCodeVO projectCodeVO = projectData.getProjectCode(projectCode.getId());
                if(projectCodeVO == null) {
                    projectCodeVO = new ProjectCodeVO(projectCode);
                    projectData.getProjectCodes().add(projectCodeVO);
                }
                taskTypeVO = projectCodeVO.getTaskType(taskType.getId());
                if(taskTypeVO == null) {
                    taskTypeVO = new TaskTypeVO(taskType);
                    projectCodeVO.getTaskTypes().add(taskTypeVO);
                }                            
            } else {
                taskTypeVO = internalData.getTaskType(taskType.getId());
                if(taskTypeVO == null) {
                    taskTypeVO = new TaskTypeVO(taskType);
                    internalData.getTaskTypes().add(taskTypeVO);
                }
            }

            TaskVO taskVO = taskTypeVO.getTask(task.getId());
            if(taskVO == null) {
                taskVO = new TaskVO(task);
                taskTypeVO.getTasks().add(taskVO);
            } 

            TimeSpentItemVO timeSpentItemVO = taskVO.getTimeSpentItem(timeSpentItem.getId());
            if(timeSpentItemVO == null) {
                timeSpentItemVO = new TimeSpentItemVO(timeSpentItem);
                taskVO.getTimeSpentItems().add(timeSpentItemVO);
            }
        }
    }
}
