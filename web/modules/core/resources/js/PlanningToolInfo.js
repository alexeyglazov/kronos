/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
function PlanningToolInfo() {
    this.positions = [];
    this.standardPositions = [];
    this.employees = [];
    this.clients = [];
    this.projectCodes = [];
    this.tasks = [];
    this.inChargePersons = [];
    this.subdepartments = [];
    this.planningItems = [];
    this.planningGroups = [];
    this.planningTypes = [];
    
    this.index = {};
}

PlanningToolInfo.prototype.getEmployee = function(employeeId) {
    for(var key in this.employees) {
        var employee = this.employees[key];
        if(employeeId == employee.id) {
            return employee;
        }
    }
    return null;
}
PlanningToolInfo.prototype.getInChargePerson = function(inChargePersonId) {
    for(var key in this.inChargePersons) {
        var inChargePerson = this.inChargePersons[key];
        if(inChargePersonId == inChargePerson.id) {
            return inChargePerson;
        }
    }
    return null;    
}
PlanningToolInfo.prototype.getClient = function(clientId) {
    for(var key in this.clients) {
        var client = this.clients[key];
        if(clientId == client.id) {
            return client;
        }
    }
    return null;    
}
PlanningToolInfo.prototype.getSubdepartment = function(subdepartmentId) {
    for(var key in this.subdepartments) {
        var subdepartment = this.subdepartments[key];
        if(subdepartmentId == subdepartment.subdepartmentId) {
            return subdepartment;
        }
    }
    return null;
}
PlanningToolInfo.prototype.getProjectCode = function(projectCodeId) {
    for(var key in this.projectCodes) {
        var projectCode = this.projectCodes[key];
        if(projectCodeId == projectCode.id) {
            return projectCode;
        }
    }
    return null;
}
PlanningToolInfo.prototype.getTask = function(taskId) {
    for(var key in this.tasks) {
        var task = this.tasks[key];
        if(taskId == task.id) {
            return task;
        }
    }
    return null;
}
PlanningToolInfo.prototype.getPosition = function(positionId) {
    for(var key in this.positions) {
        var position = this.positions[key];
        if(position.id == positionId) {
            return position;
        }
    }
    return null;
}
PlanningToolInfo.prototype.getStandardPosition = function(standardPositionId) {
    for(var key in this.standardPositions) {
        var standardPosition = this.standardPositions[key];
        if(standardPosition.id == standardPositionId) {
            return standardPosition;
        }
    }
    return null;
}
PlanningToolInfo.prototype.getPlanningItem = function(planningItemId) {
    for(var key in this.planningItems) {
        var planningItem = this.planningItems[key];
        if(planningItem.id == planningItemId) {
            return planningItem;
        }
    }
    return null;
}
PlanningToolInfo.prototype.getPlanningItemIndex = function(planningItemId) {
    for(var key in this.planningItems) {
        if(this.planningItems[key].id == planningItemId) {
            return key;
        }
    }
    return null;
}
PlanningToolInfo.prototype.getPlanningGroup = function(planningGroupId) {
    for(var key in this.planningGroups) {
        var planningGroup = this.planningGroups[key];
        if(planningGroup.id == planningGroupId) {
            return planningGroup;
        }
    }
    return null;
}
PlanningToolInfo.prototype.getPlanningType = function(planningTypeId) {
    for(var key in this.planningTypes) {
        var planningType = this.planningTypes[key];
        if(planningType.id == planningTypeId) {
            return planningType;
        }
    }
    return null;
}
PlanningToolInfo.prototype.getPlanningGroupIndex = function(planningGroupId) {
    for(var key in this.planningGroups) {
        if(this.planningGroups[key].id == planningGroupId) {
            return key;
        }
    }
    return null;
}
PlanningToolInfo.prototype.getPlanningGroupByIndex = function(index) {
    return this.planningGroups[index];
}

PlanningToolInfo.prototype.pushEmployee = function(employee) {
    if(employee != null && this.getEmployee(employee.id) == null) {
        this.employees.push(employee);
    }
}
PlanningToolInfo.prototype.pushInChargePerson = function(inChargePerson) {
    if(inChargePerson != null && this.getInChargePerson(inChargePerson.id) == null) {
        this.inChargePersons.push(inChargePerson);
    }
}
PlanningToolInfo.prototype.pushClient = function(client) {
    if(client != null && this.getClient(client.id) == null) {
        this.clients.push(client);
    }
}
PlanningToolInfo.prototype.pushSubdepartment = function(subdepartment) {
    if(subdepartment != null && this.getSubdepartment(subdepartment.id) == null) {
        this.subdepartments.push(subdepartment);
    }
}
PlanningToolInfo.prototype.pushProjectCode = function(projectCode) {
    if(projectCode != null && this.getProjectCode(projectCode.id) == null) {
        this.projectCodes.push(projectCode);
    }
}
PlanningToolInfo.prototype.pushTask = function(task) {
    if(task != null && this.getTask(task.id) == null) {
        this.tasks.push(task);
    }
}
PlanningToolInfo.prototype.pushPlanningType = function(planningType) {
    if(planningType != null && this.getPlanningType(planningType.id) == null) {
        this.planningTypes.push(planningType);
    }
}
PlanningToolInfo.prototype.pushPosition = function(position) {
    if(position != null && this.getPosition(position.id) == null) {
        this.positions.push(position);
    }
}
PlanningToolInfo.prototype.pushStandardPosition = function(standardPosition) {
    if(standardPosition != null && this.getStandardPosition(standardPosition.id) == null) {
        this.standardPositions.push(standardPosition);
    }
}
PlanningToolInfo.prototype.pushPlanningItem = function(planningItem) {
    if(planningItem != null) {
        var index = this.getPlanningItemIndex(planningItem.id);
        if(index == null) {
            this.planningItems.push(planningItem);
        } else {
            this.planningItems[index] = planningItem;
        }
    }
}
PlanningToolInfo.prototype.pushPlanningGroup = function(planningGroup) {
    if(planningGroup != null) {
        var index = this.getPlanningGroupIndex(planningGroup.id);
        if(index == null) {
            this.planningGroups.push(planningGroup);
        } else {
            this.planningGroups[index] = planningGroup;
        }
    }
}
PlanningToolInfo.prototype.pushDescribedCarreersInfo = function(describedCarreersInfo) {
    for(var key in describedCarreersInfo.standardPositions) {
        this.pushStandardPosition(describedCarreersInfo.standardPositions[key]);
    }
    for(var key in describedCarreersInfo.positions) {
        this.pushPosition(describedCarreersInfo.positions[key]);
    }
    for(var key in describedCarreersInfo.employees) {
        this.pushEmployee(describedCarreersInfo.employees[key]);
    }
}
PlanningToolInfo.prototype.pushPlanningToolInfo = function(planningToolInfo) {
    if(planningToolInfo == null) {
        return;
    }
    for(var key in planningToolInfo.standardPositions) {
        this.pushStandardPosition(planningToolInfo.standardPositions[key]);
    }
    for(var key in planningToolInfo.positions) {
        this.pushPosition(planningToolInfo.positions[key]);
    }
    for(var key in planningToolInfo.employees) {
        this.pushEmployee(planningToolInfo.employees[key]);
    }
       
    for(var key in planningToolInfo.clients) {
        this.pushClient(planningToolInfo.clients[key]);
    }
    for(var key in planningToolInfo.projectCodes) {
        this.pushProjectCode(planningToolInfo.projectCodes[key]);
    }
    for(var key in planningToolInfo.tasks) {
        this.pushTask(planningToolInfo.tasks[key]);
    }
    for(var key in planningToolInfo.inChargePersons) {
        this.pushInChargePerson(planningToolInfo.inChargePersons[key]);
    }
    for(var key in planningToolInfo.subdepartments) {
        this.pushSubdepartment(planningToolInfo.subdepartments[key]);
    }
    for(var key in planningToolInfo.planningItems) {
        this.pushPlanningItem(planningToolInfo.planningItems[key]);
    }
    for(var key in planningToolInfo.planningGroups) {
        this.pushPlanningGroup(planningToolInfo.planningGroups[key]);
    }
    for(var key in planningToolInfo.planningTypes) {
        this.pushPlanningType(planningToolInfo.planningTypes[key]);
    }
}

PlanningToolInfo.prototype.resetInfo = function() {
    this.positions = [];
    this.standardPositions = [];
    this.employees = [];
    this.clients = [];
    this.projectCodes = [];
    this.tasks = [];
    this.inChargePersons = [];
    this.subdepartments = [];
    this.planningItems = [];
    this.planningGroups = [];
    this.planningTypes = [];
}
PlanningToolInfo.prototype.sort = function() {
    var form = this;
    this.employees.sort(
        function(employee1, employee2) {
            var position1 = null;
            var standardPosition1 = null;
            var position2 = null;
            var standardPosition2 = null;
            if(employee1.employeePositionHistoryItems != null && employee1.employeePositionHistoryItems.length != 0) {
                var employeePositionHistoryItem1 = employee1.employeePositionHistoryItems[0];
                position1 = form.getPosition(employeePositionHistoryItem1.positionId);
                standardPosition1 = form.getStandardPosition(position1.standardPositionId);
            }
            if(employee2.employeePositionHistoryItems != null && employee2.employeePositionHistoryItems.length != 0) {
                var employeePositionHistoryItem2 = employee2.employeePositionHistoryItems[0];
                position2 = form.getPosition(employeePositionHistoryItem2.positionId);
                standardPosition2 = form.getStandardPosition(position2.standardPositionId);
            }
            
            var result = 0;
            if(standardPosition1 == null && standardPosition2 == null) {
                if(employee1.lastName < employee2.lastName) {
                    return -1;
                } else if(employee1.lastName > employee2.lastName) {
                    return 1;
                } else {
                    return 0;
                }
            } else if(standardPosition1 == null && standardPosition2 != null) {
                return 1;
            } else if(standardPosition1 != null && standardPosition2 == null) {
                return -1;
            } else {
                result = standardPosition1.sortValue - standardPosition2.sortValue;
                if(result != 0) {
                    return result;
                }
            }      
            if(position1.sortValue == null && position2.sortValue == null) {
                
            } else if(position1.sortValue == null && position2.sortValue != null) {
                return 1;
            } else if(position1.sortValue != null && position2.sortValue == null) {
                return -1;
            } else if(position1.sortValue != null && position2.sortValue != null) {
                result = position1.sortValue - position2.sortValue;
                if(result != 0) {
                    return result;
                }
            }
            if(position1.name < position2.name) {
                return 1;
            } else if(position1.name > position2.name) {
                return -1;
            }            
            if(employee1.lastName < employee2.lastName) {
                return -1;
            } else if(employee1.lastName > employee2.lastName) {
                return 1;
            } else {
                return 0;
            }
        }
    );
}
PlanningToolInfo.prototype.getPlanningItems = function(employeeId, day) {
    var planningItems = [];
    for(var key in this.planningItems) {
        var planningItem = this.planningItems[key];
        if(
                planningItem.employeeId == employeeId &&
                compareYearMonthDate(day, planningItem.startDate) >= 0 && 
                compareYearMonthDate(day, planningItem.endDate) <= 0
        ) {
            planningItems.push(planningItem);
        }
    }        
    return planningItems;
}
PlanningToolInfo.prototype.getPlanningItemsByDay = function(day) {
    var planningItems = [];
    for(var key in this.planningItems) {
        var planningItem = this.planningItems[key];
        if(
                compareYearMonthDate(day, planningItem.startDate) >= 0 && 
                compareYearMonthDate(day, planningItem.endDate) <= 0
        ) {
            planningItems.push(planningItem);
        }
    }        
    return planningItems;
}
PlanningToolInfo.prototype.getPlanningItemsOfPlanningGroup = function(planningGroupId) {
    var planningItems = [];
    for(var key in this.planningItems) {
        var planningItem = this.planningItems[key];
        if(planningItem.planningGroupId == planningGroupId) {
            planningItems.push(planningItem);
        }
    }        
    return planningItems;
}
PlanningToolInfo.prototype.getPlanningItemsOfEmployee = function(employeeId) {
    var planningItems = [];
    for(var key in this.planningItems) {
        var planningItem = this.planningItems[key];
        if(planningItem.employeeId == employeeId) {
            planningItems.push(planningItem);
        }
    }        
    return planningItems;
}

PlanningToolInfo.prototype.getIntersectingPlanningItemIds = function(planningItemId) {
    var ids = new Array();
    var planningItemMain = this.getPlanningItem(planningItemId);
    for(var key in this.planningItems) {
        var planningItem = this.planningItems[key];
        if(planningItemMain.employeeId != planningItem.employeeId ||
           compareYearMonthDate(planningItemMain.startDate, planningItem.endDate) > 0 ||
           compareYearMonthDate(planningItemMain.endDate, planningItem.startDate) < 0 ||
           planningItemId == planningItem.id
            ) {
            continue;
        }
        ids.push(key);
    }        
    return ids;
}
PlanningToolInfo.prototype.getEmployeePositionHistoryItem = function(employeePositionHistoryItems, day) {
    for(var key in employeePositionHistoryItems) {
        var employeePositionHistoryItem = employeePositionHistoryItems[key];
        if(compareYearMonthDate(day, employeePositionHistoryItem.startDate) >= 0 && (employeePositionHistoryItem.endDate == null || compareYearMonthDate(day, employeePositionHistoryItem.endDate) <= 0)) {
            return employeePositionHistoryItem;
        }
    }
    return null;
}
PlanningToolInfo.prototype.removePlanningItem = function(planningItemId) {
    for(var key in this.planningItems) {
        var planningItem = this.planningItems[key];
        if(planningItem.id == planningItemId) {
            this.planningItems.splice(key, 1);
            return;
        }
    }
    
}
PlanningToolInfo.prototype.buildLevelInfo = function() {
    for(var key in this.employees) {
        var employee = this.employees[key];
        this.buildEmployeeLevelInfo(employee.id);
    }
}
PlanningToolInfo.prototype.buildEmployeeLevelInfo = function(employeeId) {
    var planningItems = this.getPlanningItemsOfEmployee(employeeId);
    for(var key in planningItems) {
        var planningItem = planningItems[key];
        planningItem.level = null;
    }    
    for(var key in planningItems) {
        var planningItem = planningItems[key];
        var intersected = false;
        var level = 0;
        do {
            intersected = false;
            var levelItems = jQuery.grep(planningItems, function(n, i ) {
                return (n.level == level);
            });
            for(var key2 in levelItems) {
                var levelItem = levelItems[key2];
                if(isIntersected(planningItem.startDate, planningItem.endDate, levelItem.startDate, levelItem.endDate)) {
                    intersected = true;
                    break;
                }
            }
            if(! intersected) {
                planningItem.level = level;
            }
            level++;
        } while (intersected)
    }    
}
PlanningToolInfo.prototype.getMaxLevelOfEmployee = function(employeeId) {
    var maxLevel = 0;
    var planningItems = this.getPlanningItemsOfEmployee(employeeId);
    for(var key in planningItems) {
        var planningItem = planningItems[key];
        if(planningItem.level > maxLevel) {
           maxLevel = planningItem.level;
        }
    }
    return maxLevel;
}