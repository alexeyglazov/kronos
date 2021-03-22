/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mazars.management.web.vo;

import com.mazars.management.db.domain.Client;
import com.mazars.management.db.domain.Employee;
import com.mazars.management.db.domain.EmployeePositionHistoryItem;
import com.mazars.management.db.domain.PlanningGroup;
import com.mazars.management.db.domain.PlanningItem;
import com.mazars.management.db.domain.PlanningType;
import com.mazars.management.db.domain.Position;
import com.mazars.management.db.domain.ProjectCode;
import com.mazars.management.db.domain.StandardPosition;
import com.mazars.management.db.domain.Subdepartment;
import com.mazars.management.db.domain.Task;
import com.mazars.management.db.util.EmployeePositionHistoryItemUtils;
import com.mazars.management.db.util.EmployeePositionHistoryItemUtils.DescribedCarreerItem;
import com.mazars.management.db.util.PlanningItemUtil.DescribedPlanningItem;
import com.mazars.management.db.vo.YearMonthDate;
import java.math.BigDecimal;
import java.util.Calendar;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

/**
 *
 * @author glazov
 */
public class PlanningToolInfo {
    public static class PlanningItemVO {
        private Long id;
        private Long planningGroupId;
        private Long targetSubdepartmentId;
        private Long sourceSubdepartmentId;
        private Long employeeId;
        private String description;
        private String location;
        private YearMonthDate startDate;
        private YearMonthDate endDate;
        private Map<YearMonthDate, BigDecimal> times = new HashMap<YearMonthDate, BigDecimal>();

        public PlanningItemVO() {
        }
        public BigDecimal getTime(YearMonthDate date) {
            for(YearMonthDate d : times.keySet()) {
                if(d.equals(date)) {
                    return times.get(d);
                }
            }
            return null;
        }
        public PlanningItemVO(PlanningItem planningItem, PlanningGroup planningGroup, Subdepartment sourceSubdepartment, Subdepartment targetSubdepartment, Employee employee) {
            this.setId(planningItem.getId());
            this.setDescription(planningItem.getDescription());
            this.setLocation(planningItem.getLocation());
            this.setStartDate(new YearMonthDate(planningItem.getStartDate()));
            this.setEndDate(new YearMonthDate(planningItem.getEndDate()));
            this.setEmployeeId(employee.getId());
            this.setTargetSubdepartmentId(targetSubdepartment.getId());
            this.setSourceSubdepartmentId(sourceSubdepartment.getId());
            if(planningGroup != null) {
                this.setPlanningGroupId(planningGroup.getId());
            }
        }
        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public Map<YearMonthDate, BigDecimal> getTimes() {
            return times;
        }

        public void setTimes(Map<YearMonthDate, BigDecimal> times) {
            this.times = times;
        }

        public Long getPlanningGroupId() {
            return planningGroupId;
        }

        public void setPlanningGroupId(Long planningGroupId) {
            this.planningGroupId = planningGroupId;
        }

        public Long getTargetSubdepartmentId() {
            return targetSubdepartmentId;
        }

        public void setTargetSubdepartmentId(Long targetSubdepartmentId) {
            this.targetSubdepartmentId = targetSubdepartmentId;
        }

        public Long getSourceSubdepartmentId() {
            return sourceSubdepartmentId;
        }

        public void setSourceSubdepartmentId(Long sourceSubdepartmentId) {
            this.sourceSubdepartmentId = sourceSubdepartmentId;
        }

        public Long getEmployeeId() {
            return employeeId;
        }

        public void setEmployeeId(Long employeeId) {
            this.employeeId = employeeId;
        }

        public String getLocation() {
            return location;
        }

        public void setLocation(String location) {
            this.location = location;
        }

        public String getDescription() {
            return description;
        }

        public void setDescription(String description) {
            this.description = description;
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
    public static class EmployeeVO {
        private Long id;
        private String userName;
        private String firstName;
        private String lastName;
        private List<EmployeePositionHistoryItemVO> employeePositionHistoryItems = new LinkedList<EmployeePositionHistoryItemVO>();

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public String getUserName() {
            return userName;
        }

        public void setUserName(String userName) {
            this.userName = userName;
        }

        public String getFirstName() {
            return firstName;
        }

        public void setFirstName(String firstName) {
            this.firstName = firstName;
        }

        public String getLastName() {
            return lastName;
        }

        public void setLastName(String lastName) {
            this.lastName = lastName;
        }

        public List<EmployeePositionHistoryItemVO> getEmployeePositionHistoryItems() {
            return employeePositionHistoryItems;
        }

        public void setEmployeePositionHistoryItems(List<EmployeePositionHistoryItemVO> employeePositionHistoryItems) {
            this.employeePositionHistoryItems = employeePositionHistoryItems;
        }

        public EmployeeVO(Employee employee) {
            this.id = employee.getId();
            this.userName = employee.getUserName();
            this.firstName = employee.getFirstName();
            this.lastName = employee.getLastName();
        }
        public EmployeeVO(PlanningToolInfo.EmployeeVO employee) {
            this.id = employee.getId();
            this.userName = employee.getUserName();
            this.firstName = employee.getFirstName();
            this.lastName = employee.getLastName();
        }
        public EmployeePositionHistoryItemVO getEmployeePositionHistoryItem(Long employeePositionHistoryItemId) {
            for(EmployeePositionHistoryItemVO employeePositionHistoryItem : employeePositionHistoryItems) {
                if(employeePositionHistoryItem.getId().equals(employeePositionHistoryItemId)) {
                    return employeePositionHistoryItem;
                }
            }
            return null;
        }
    } 
    public static class EmployeePositionHistoryItemVO {
        private Long id;
        private YearMonthDate startDate;
        private YearMonthDate endDate;
        private com.mazars.management.db.domain.EmployeePositionHistoryItem.ContractType contractType;
        private Integer partTimePercentage;
        private Long positionId;

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

        public EmployeePositionHistoryItem.ContractType getContractType() {
            return contractType;
        }

        public void setContractType(EmployeePositionHistoryItem.ContractType contractType) {
            this.contractType = contractType;
        }

        public Integer getPartTimePercentage() {
            return partTimePercentage;
        }

        public void setPartTimePercentage(Integer partTimePercentage) {
            this.partTimePercentage = partTimePercentage;
        }

        public EmployeePositionHistoryItemVO(EmployeePositionHistoryItem employeePositionHistoryItem) {
            this.id = employeePositionHistoryItem.getId();
            if(employeePositionHistoryItem.getStart() != null) {
                this.startDate = new YearMonthDate(employeePositionHistoryItem.getStart());
            }
            if(employeePositionHistoryItem.getEnd() != null) {
                this.endDate = new YearMonthDate(employeePositionHistoryItem.getEnd());
            }
            this.contractType = employeePositionHistoryItem.getContractType();
            this.partTimePercentage = employeePositionHistoryItem.getPartTimePercentage();
        }
    }    
    public static class StandardPositionVO {
        private Long id;
        private String name;
        private Integer sortValue;

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

        public Integer getSortValue() {
            return sortValue;
        }

        public void setSortValue(Integer sortValue) {
            this.sortValue = sortValue;
        }

        public StandardPositionVO(StandardPosition standardPosition) {
            this.id = standardPosition.getId();
            this.name = standardPosition.getName();
            this.sortValue = standardPosition.getSortValue();
        }       
    }
    public static class PositionVO {
        private Long id;
        private String name;
        private Integer sortValue;
        private Long standardPositionId;
        private Long subdepartmentId;
        
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

        public Integer getSortValue() {
            return sortValue;
        }

        public void setSortValue(Integer sortValue) {
            this.sortValue = sortValue;
        }

        public Long getStandardPositionId() {
            return standardPositionId;
        }

        public void setStandardPositionId(Long standardPositionId) {
            this.standardPositionId = standardPositionId;
        }

        public Long getSubdepartmentId() {
            return subdepartmentId;
        }

        public void setSubdepartmentId(Long subdepartmentId) {
            this.subdepartmentId = subdepartmentId;
        }

        public PositionVO(Position position) {
            this.id = position.getId();
            this.name = position.getName();
            this.sortValue = position.getSortValue();
        }       
    }    
    public static class ClientVO {
        private Long id;
        private String name;
        private String alias;
        private String color;

        public ClientVO() {
        }

        public ClientVO(Client client) {
            this.id = client.getId();
            this.name = client.getName();
            this.alias = client.getAlias();
            this.color = client.getColor();
        }

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

        public String getAlias() {
            return alias;
        }

        public void setAlias(String alias) {
            this.alias = alias;
        }

        public String getColor() {
            return color;
        }

        public void setColor(String color) {
            this.color = color;
        }
    }
    public static class ProjectCodeVO {
        private Long id;
        private String code;
        private String description;

        public ProjectCodeVO() {
        }

        public ProjectCodeVO(ProjectCode projectCode) {
            this.id = projectCode.getId();
            this.code = projectCode.getCode();
            this.description = projectCode.getDescription();
        }

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
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

    }        
    public static class TaskVO {
        private Long id;
        private String name;
        private String color;

        public TaskVO() {
        }

        public TaskVO(Task task) {
            this.id = task.getId();
            this.name = task.getName();
            this.color = task.getColor();
        }

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

        public String getColor() {
            return color;
        }

        public void setColor(String color) {
            this.color = color;
        }
        
    }            
    public static class PlanningGroupVO {
        private Long id;
        private String description;
        private Boolean isApproved;
        private Long targetSubdepartmentId;
        private Long inChargePersonId;
        private Long clientId;
        private List<Long> projectCodeIds = new LinkedList<Long>();
        private Long taskId;
        private Long planningTypeId;
        
        public PlanningGroupVO() {
        }

        public PlanningGroupVO(PlanningGroup planningGroup, Subdepartment targetSubdepartment, Employee inChargePerson, Client client, List<ProjectCode> projectCodes, Task task, PlanningType planningType) {
            this.id = planningGroup.getId();
            this.planningTypeId = planningType.getId();
            this.description = planningGroup.getDescription();
            this.isApproved = planningGroup.getIsApproved();
            if(inChargePerson != null) {
                this.setInChargePersonId(inChargePerson.getId());
            }
            this.setTargetSubdepartmentId(targetSubdepartment.getId());
            if(client != null) {
                this.setClientId(client.getId());
            }
            if(projectCodes != null) {
                List<Long> ids = new LinkedList<Long>();
                for(ProjectCode projectCode : projectCodes) {
                    ids.add(projectCode.getId());
                }
                this.setProjectCodeIds(ids);
            }
            if(task != null) {
                this.setTaskId(task.getId());
            }            
        }

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public Long getTaskId() {
            return taskId;
        }

        public void setTaskId(Long taskId) {
            this.taskId = taskId;
        }

        public Long getPlanningTypeId() {
            return planningTypeId;
        }

        public void setPlanningTypeId(Long planningTypeId) {
            this.planningTypeId = planningTypeId;
        }

        public String getDescription() {
            return description;
        }

        public void setDescription(String description) {
            this.description = description;
        }

        public Boolean getIsApproved() {
            return isApproved;
        }

        public void setIsApproved(Boolean isApproved) {
            this.isApproved = isApproved;
        }

        public Long getTargetSubdepartmentId() {
            return targetSubdepartmentId;
        }

        public void setTargetSubdepartmentId(Long targetSubdepartmentId) {
            this.targetSubdepartmentId = targetSubdepartmentId;
        }

        public Long getInChargePersonId() {
            return inChargePersonId;
        }

        public void setInChargePersonId(Long inChargePersonId) {
            this.inChargePersonId = inChargePersonId;
        }

        public Long getClientId() {
            return clientId;
        }

        public void setClientId(Long clientId) {
            this.clientId = clientId;
        }

        public List<Long> getProjectCodeIds() {
            return projectCodeIds;
        }

        public void setProjectCodeIds(List<Long> projectCodeIds) {
            this.projectCodeIds = projectCodeIds;
        }
    }        
    public static class PlanningTypeVO {
        private Long id;
        private String name;
        private Boolean isInternal;
       
        public PlanningTypeVO() {
        }

        public PlanningTypeVO(PlanningType planningType) {
            this.id = planningType.getId();
            this.name = planningType.getName();
            this.isInternal = planningType.getIsInternal();
        }

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

        public Boolean getIsInternal() {
            return isInternal;
        }

        public void setIsInternal(Boolean isInternal) {
            this.isInternal = isInternal;
        }
    }            
    private List<EmployeeVO> employees = new LinkedList<EmployeeVO>();
    private List<PositionVO> positions = new LinkedList<PositionVO>();
    private List<StandardPositionVO> standardPositions = new LinkedList<StandardPositionVO>();
    private List<PlanningItemVO> planningItems = new LinkedList<PlanningItemVO>();
    private List<ClientVO> clients = new LinkedList<ClientVO>();
    private List<ProjectCodeVO> projectCodes = new LinkedList<ProjectCodeVO>();
    private List<TaskVO> tasks = new LinkedList<TaskVO>();
    private List<OfficeDepartmentSubdepartment> subdepartments = new LinkedList<OfficeDepartmentSubdepartment>();
    private List<EmployeeVO> inChargePersons = new LinkedList<EmployeeVO>();
    private List<PlanningGroupVO> planningGroups = new LinkedList<PlanningGroupVO>();
    private List<PlanningTypeVO> planningTypes = new LinkedList<PlanningTypeVO>();

    public PlanningToolInfo() {
    }
    public PlanningToolInfo(List<DescribedCarreerItem> describedCarreerItems, List<DescribedPlanningItem> describedPlanningItems, Calendar start, Calendar end) {
        this.addDescribedCarreersItems(describedCarreerItems);
        this.addDescribedPlanningItems(describedPlanningItems, start, end);
    }

    public List<EmployeeVO> getEmployees() {
        return employees;
    }

    public void setEmployees(List<EmployeeVO> employees) {
        this.employees = employees;
    }

    public List<PositionVO> getPositions() {
        return positions;
    }

    public void setPositions(List<PositionVO> positions) {
        this.positions = positions;
    }

    public List<StandardPositionVO> getStandardPositions() {
        return standardPositions;
    }

    public void setStandardPositions(List<StandardPositionVO> standardPositions) {
        this.standardPositions = standardPositions;
    }

    public List<PlanningItemVO> getPlanningItems() {
        return planningItems;
    }

    public void setPlanningItems(List<PlanningItemVO> planningItems) {
        this.planningItems = planningItems;
    }

    public List<ClientVO> getClients() {
        return clients;
    }

    public void setClients(List<ClientVO> clients) {
        this.clients = clients;
    }

    public List<ProjectCodeVO> getProjectCodes() {
        return projectCodes;
    }

    public void setProjectCodes(List<ProjectCodeVO> projectCodes) {
        this.projectCodes = projectCodes;
    }

    public List<TaskVO> getTasks() {
        return tasks;
    }

    public void setTasks(List<TaskVO> tasks) {
        this.tasks = tasks;
    }

    public List<PlanningTypeVO> getPlanningTypes() {
        return planningTypes;
    }

    public void setPlanningTypes(List<PlanningTypeVO> planningTypes) {
        this.planningTypes = planningTypes;
    }

    public List<OfficeDepartmentSubdepartment> getSubdepartments() {
        return subdepartments;
    }

    public void setSubdepartments(List<OfficeDepartmentSubdepartment> subdepartments) {
        this.subdepartments = subdepartments;
    }

    public List<EmployeeVO> getInChargePersons() {
        return inChargePersons;
    }

    public void setInChargePersons(List<EmployeeVO> inChargePersons) {
        this.inChargePersons = inChargePersons;
    }

    public List<PlanningGroupVO> getPlanningGroups() {
        return planningGroups;
    }

    public void setPlanningGroups(List<PlanningGroupVO> planningGroups) {
        this.planningGroups = planningGroups;
    }
    
    public void addDescribedCarreersItems(List<DescribedCarreerItem> describedCarreerItems) {
        for(DescribedCarreerItem describedCarreerItem : describedCarreerItems) {
            StandardPosition standardPosition = describedCarreerItem.getStandardPosition();
            Position position = describedCarreerItem.getPosition();
            Employee employee = describedCarreerItem.getEmployee();
            EmployeePositionHistoryItem employeePositionHistoryItem = describedCarreerItem.getEmployeePositionHistoryItem();
            Subdepartment subdepartment = describedCarreerItem.getSubdepartment();
            
            if(employee != null) {
                EmployeeVO employeeVO = getEmployee(employee.getId());
                if(employeeVO == null) {
                    employeeVO = new EmployeeVO(employee);
                    employees.add(employeeVO);
                }
                if(employeePositionHistoryItem != null) {
                    EmployeePositionHistoryItemVO employeePositionHistoryItemVO = employeeVO.getEmployeePositionHistoryItem(employeePositionHistoryItem.getId());
                    if(employeePositionHistoryItemVO == null) {
                        employeePositionHistoryItemVO = new EmployeePositionHistoryItemVO(employeePositionHistoryItem);
                        employeePositionHistoryItemVO.setPositionId(position.getId());
                        employeeVO.getEmployeePositionHistoryItems().add(employeePositionHistoryItemVO);
                    }
                }
            }
            
            if(position != null) {
                PositionVO positionVO = getPosition(position.getId());
                if(positionVO == null) {
                    positionVO = new PositionVO(position);
                    positionVO.setStandardPositionId(standardPosition.getId());
                    positionVO.setSubdepartmentId(subdepartment.getId());
                    positions.add(positionVO);
                }
            }

            if(standardPosition != null) {
                StandardPositionVO standardPositionVO = getStandardPosition(standardPosition.getId());
                if(standardPositionVO == null) {
                    standardPositionVO = new StandardPositionVO(standardPosition);
                    standardPositions.add(standardPositionVO);
                }
            }
            if(subdepartment != null) {
                OfficeDepartmentSubdepartment subdepartmentVO = getSubdepartment(subdepartment.getId());
                if(subdepartmentVO == null) {
                    subdepartmentVO = new OfficeDepartmentSubdepartment(subdepartment);
                    subdepartments.add(subdepartmentVO);
                }
            }
        }
    }    
    
    public void addDescribedPlanningItems(List<DescribedPlanningItem> describedPlanningItems, Calendar start, Calendar end) {
        List<Long> planningEmployeeIds = new LinkedList<Long>();
        for(DescribedPlanningItem describedPlanningItem : describedPlanningItems) {
            PlanningItem planningItem = describedPlanningItem.getPlanningItem();
            Subdepartment targetSubdepartment = describedPlanningItem.getTargetSubdepartment();
            Subdepartment sourceSubdepartment = describedPlanningItem.getSourceSubdepartment();
            Employee employee = describedPlanningItem.getEmployee();
            Employee inChargePerson = describedPlanningItem.getInChargePerson();
            Client client = describedPlanningItem.getClient();
            List<ProjectCode> tmpProjectCodes = describedPlanningItem.getProjectCodes();
            Task task = describedPlanningItem.getTask();
            PlanningGroup planningGroup = describedPlanningItem.getPlanningGroup();
            PlanningType planningType = describedPlanningItem.getPlanningType();
            
            planningItems.add(new PlanningItemVO(planningItem, planningGroup, sourceSubdepartment, targetSubdepartment, employee));
            if(planningGroup != null) {
                if(getPlanningGroup(planningGroup.getId()) == null) {
                    planningGroups.add(new PlanningGroupVO(planningGroup, targetSubdepartment, inChargePerson, client, tmpProjectCodes, task, planningType));
                }
            }
            if(planningType != null) {
                if(getPlanningType(planningType.getId()) == null) {
                    planningTypes.add(new PlanningTypeVO(planningType));
                }
            }
            if(client != null) {
                if(getClient(client.getId()) == null) {
                    clients.add(new ClientVO(client));
                }
            }
            if(tmpProjectCodes != null) {
                for(ProjectCode projectCode : tmpProjectCodes) {
                    if(getProjectCode(projectCode.getId()) == null) {
                        projectCodes.add(new ProjectCodeVO(projectCode));
                    }
                }
            }
            if(task != null) {
                if(getTask(task.getId()) == null) {
                    tasks.add(new TaskVO(task));
                }
            }
            if(inChargePerson != null) {
                if(getInChargePerson(inChargePerson.getId()) == null) {
                    inChargePersons.add(new EmployeeVO(inChargePerson));
                }
            }
            if(getSubdepartment(targetSubdepartment.getId()) == null) {
                subdepartments.add(new OfficeDepartmentSubdepartment(targetSubdepartment));
            }
            if(getSubdepartment(sourceSubdepartment.getId()) == null) {
                subdepartments.add(new OfficeDepartmentSubdepartment(sourceSubdepartment));
            }
            if(getEmployee(employee.getId()) == null) {
                planningEmployeeIds.add(employee.getId());
            }    
        }
        mergeWithEmployees(planningEmployeeIds, start, end);
    }
    public void mergeWithEmployees(List<Long> employeeIds, Calendar start, Calendar end) {
        List<Long> carreerEmployeeIds = getEmployeeIds();
        List<Long> exclusiveEmployeeIds = new LinkedList<Long>();
        for(Long employeeId : employeeIds) {
            if(carreerEmployeeIds.contains(employeeId) ) {
                continue;
            }
            exclusiveEmployeeIds.add(employeeId);
        }
        List<EmployeePositionHistoryItemUtils.DescribedCarreerItem> exclusiveCarreerItems = EmployeePositionHistoryItemUtils.getDescribedCarreerItemsWithCarreer(exclusiveEmployeeIds, start, end);
        this.addDescribedCarreersItems(exclusiveCarreerItems);
        carreerEmployeeIds = getEmployeeIds();
        List<Long> nonCarreerEmployeeIds = new LinkedList<Long>();
        for(Long employeeId : exclusiveEmployeeIds) {
            if(carreerEmployeeIds.contains(employeeId) ) {
                continue;
            }
            nonCarreerEmployeeIds.add(employeeId);
        }
        List<EmployeePositionHistoryItemUtils.DescribedCarreerItem> nonCarreerCarreerItems = EmployeePositionHistoryItemUtils.getDescribedCarreerItemsWithoutCarreer(nonCarreerEmployeeIds);
        this.addDescribedCarreersItems(nonCarreerCarreerItems);
    }  
    public void addDescribedPlanningItems(List<DescribedPlanningItem> describedPlanningItems) {
        Calendar start = null;
        Calendar end = null;
        for(DescribedPlanningItem describedPlanningItem : describedPlanningItems) {
            if(start == null || describedPlanningItem.getPlanningItem().getStartDate().before(start) ) {
                start = describedPlanningItem.getPlanningItem().getStartDate();
            }
            if(end == null || describedPlanningItem.getPlanningItem().getEndDate().after(end) ) {
                end = describedPlanningItem.getPlanningItem().getEndDate();
            }
        }
        addDescribedPlanningItems(describedPlanningItems, start, end);
    }
    public EmployeeVO getEmployee(Long employeeId) {
        for(EmployeeVO employee : employees) {
            if(employee.getId().equals(employeeId)) {
                return employee;
            }
        }
        return null;
    }
    public EmployeeVO getInChargePerson(Long employeeId) {
        for(EmployeeVO employee : inChargePersons) {
            if(employee.getId().equals(employeeId)) {
                return employee;
            }
        }
        return null;
    }
    public PositionVO getPosition(Long positionId) {
        for(PositionVO position : positions) {
            if(position.getId().equals(positionId)) {
                return position;
            }
        }
        return null;
    }
    public StandardPositionVO getStandardPosition(Long standardPositionId) {
        for(StandardPositionVO standardPosition : standardPositions) {
            if(standardPosition.getId().equals(standardPositionId)) {
                return standardPosition;
            }
        }
        return null;
    }
    public PlanningGroupVO getPlanningGroup(Long planningGroupId) {
        for(PlanningGroupVO planningGroup : planningGroups) {
            if(planningGroup.getId().equals(planningGroupId)) {
                return planningGroup;
            }
        }
        return null;
    }
    public PlanningItemVO getPlanningItem(Long planningItemId) {
        for(PlanningItemVO planningItem : planningItems) {
            if(planningItem.getId().equals(planningItemId)) {
                return planningItem;
            }
        }
        return null;
    }
    public PlanningTypeVO getPlanningType(Long planningTypeId) {
        for(PlanningTypeVO planningType : planningTypes) {
            if(planningType.getId().equals(planningTypeId)) {
                return planningType;
            }
        }
        return null;
    }
    public ClientVO getClient(Long clientId) {
        for(ClientVO client : clients) {
            if(client.getId().equals(clientId)) {
                return client;
            }
        }
        return null;
    }       
    public ProjectCodeVO getProjectCode(Long projectCodeId) {
        for(ProjectCodeVO projectCode : projectCodes) {
            if(projectCode.getId().equals(projectCodeId)) {
                return projectCode;
            }
        }
        return null;
    }
    public TaskVO getTask(Long taskId) {
        for(TaskVO task : tasks) {
            if(task.getId().equals(taskId)) {
                return task;
            }
        }
        return null;
    } 
    public OfficeDepartmentSubdepartment getSubdepartment(Long subdepartmentId) {
        for(OfficeDepartmentSubdepartment subdepartment : subdepartments) {
            if(subdepartment.getSubdepartmentId().equals(subdepartmentId)) {
                return subdepartment;
            }
        }
        return null;
    }  
    public List<Long> getEmployeeIds() {
        List<Long> employeeIds = new LinkedList<Long>();
        for(EmployeeVO employee : employees) {
            employeeIds.add(employee.getId());
        }
        return employeeIds;
    }
    public void assignTime() {
        for(PlanningItemVO planningItem : planningItems) {
            YearMonthDate startDate = planningItem.getStartDate();
            YearMonthDate endDate = planningItem.getEndDate();
            Long employeeId = planningItem.getEmployeeId();
            for(Calendar day = startDate.getCalendar(); !day.after(endDate.getCalendar()); day.add(Calendar.DAY_OF_MONTH, 1)) {
                List<PlanningItemVO> result = getPlanningItems(employeeId, new YearMonthDate(day));
                BigDecimal time = new BigDecimal(8.0 / result.size());
                planningItem.getTimes().put(new YearMonthDate(day), time);
            }
        }
    }
    public List<PlanningItemVO> getPlanningItems(Long employeeId, YearMonthDate day) {
        List<PlanningItemVO> result = new LinkedList<PlanningItemVO>();
        for(PlanningItemVO planningItem : planningItems) {
            if(planningItem.getEmployeeId().equals(employeeId) && day.compareTo(planningItem.getStartDate()) >= 0 &&  day.compareTo(planningItem.getEndDate()) <= 0) {
                result.add(planningItem);
            }
        }
        return result;
    }
    public PositionVO getPosition(Long employeeId, YearMonthDate day) {
        EmployeeVO employee = getEmployee(employeeId);
        for(EmployeePositionHistoryItemVO employeePositionHistoryItem : employee.getEmployeePositionHistoryItems()) {
            if(day.compareTo(employeePositionHistoryItem.getStartDate()) >= 0 && (employeePositionHistoryItem.getEndDate() == null || day.compareTo(employeePositionHistoryItem.getEndDate()) <= 0)) {
                PositionVO position = getPosition(employeePositionHistoryItem.getPositionId());
                return position;
            }
        }
        return null;
    }
}
