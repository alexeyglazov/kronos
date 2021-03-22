/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mazars.management.web.vo;

import com.mazars.management.db.domain.Employee;
import com.mazars.management.db.domain.EmployeePositionHistoryItem;
import com.mazars.management.db.domain.EmployeePositionHistoryItem.ContractType;
import com.mazars.management.db.domain.Position;
import com.mazars.management.db.domain.StandardPosition;
import com.mazars.management.db.util.EmployeePositionHistoryItemUtils;
import com.mazars.management.db.util.EmployeePositionHistoryItemUtils.DescribedCarreerItem;
import com.mazars.management.db.vo.YearMonthDate;
import java.util.Calendar;
import java.util.Comparator;
import java.util.LinkedList;
import java.util.List;

/**
 *
 * @author glazov
 */
public class DescribedCarreersInfo {
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
        private Long standardPositionId;
        
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

        public Long getStandardPositionId() {
            return standardPositionId;
        }

        public void setStandardPositionId(Long standardPositionId) {
            this.standardPositionId = standardPositionId;
        }

        public PositionVO(Position position) {
            this.id = position.getId();
            this.name = position.getName();
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
    
    private List<EmployeeVO> employees = new LinkedList<EmployeeVO>();
    private List<PositionVO> positions = new LinkedList<PositionVO>();
    private List<StandardPositionVO> standardPositions = new LinkedList<StandardPositionVO>();

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

    public DescribedCarreersInfo() {
    }

    public void addDescribedCarreersItems(List<DescribedCarreerItem> describedCarreerItems) {
        for(DescribedCarreerItem describedCarreerItem : describedCarreerItems) {
            StandardPosition standardPosition = describedCarreerItem.getStandardPosition();
            Position position = describedCarreerItem.getPosition();
            Employee employee = describedCarreerItem.getEmployee();
            EmployeePositionHistoryItem employeePositionHistoryItem = describedCarreerItem.getEmployeePositionHistoryItem();

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
        }
    }
    public void mergeWithPlaningItemsInfo(PlanningToolInfo planningToolInfo, Calendar start, Calendar end) {
        List<Long> planningEmployeeIds = planningToolInfo.getEmployeeIds();
        List<Long> carreerEmployeeIds = DescribedCarreersInfo.getEmployeeIds(this.getEmployees());
        List<Long> exclusivePlanningEmployeeIds = new LinkedList<Long>();
        for(Long planningEmployeeId : planningEmployeeIds) {
            if(carreerEmployeeIds.contains(planningEmployeeId) ) {
                continue;
            }
            exclusivePlanningEmployeeIds.add(planningEmployeeId);
        }
        List<EmployeePositionHistoryItemUtils.DescribedCarreerItem> exclusiveCarreerItems = EmployeePositionHistoryItemUtils.getDescribedCarreerItemsWithCarreer(exclusivePlanningEmployeeIds, start, end);
        this.addDescribedCarreersItems(exclusiveCarreerItems);
        carreerEmployeeIds = DescribedCarreersInfo.getEmployeeIds(this.getEmployees());
        List<Long> nonCarreerPlanningEmployeeIds = new LinkedList<Long>();
        for(Long planningEmployeeId : exclusivePlanningEmployeeIds) {
            if(carreerEmployeeIds.contains(planningEmployeeId) ) {
                continue;
            }
            nonCarreerPlanningEmployeeIds.add(planningEmployeeId);
        }
        List<EmployeePositionHistoryItemUtils.DescribedCarreerItem> nonCarreerCarreerItems = EmployeePositionHistoryItemUtils.getDescribedCarreerItemsWithoutCarreer(nonCarreerPlanningEmployeeIds);
        this.addDescribedCarreersItems(nonCarreerCarreerItems);
    }
    public EmployeeVO getEmployee(Long employeeId) {
        for(EmployeeVO employee : employees) {
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
    public static List<Long> getEmployeeIds(List<EmployeeVO> employees) {
        List<Long> employeeIds = new LinkedList<Long>();
        for(DescribedCarreersInfo.EmployeeVO employee : employees) {
            employeeIds.add(employee.getId());
        }
        return employeeIds;
    }
}
