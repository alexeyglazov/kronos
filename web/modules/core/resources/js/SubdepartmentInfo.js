/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

SubdepartmentInfo = function(mainAdmin, htmlId, containerHtmlId, displayProperties, moduleName) {
    this.mainAdmin = mainAdmin;
    this.htmlId = htmlId;
    this.containerHtmlId = containerHtmlId;
    this.displayProperties = displayProperties;
    this.moduleName = moduleName;
}
SubdepartmentInfo.prototype.refreshInfo = function() {
    this.showInfo(this.subdepartment.id);
}
SubdepartmentInfo.prototype.showInfo = function(id) {
    var form = this;
    var data = {};
    data.command = "getSubdepartmentInfo";
    data.id = id;
    $.ajax({
      url: this.mainAdmin.config.endpointUrl,
      data: data,
      cache: false,
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.subdepartment = result.subdepartment;
            form.employeeSubdepartmentHistoryItems = result.employeeSubdepartmentHistoryItems;
            form.positions = result.positions;
            form.taskTypes = result.taskTypes;
            form.planningTypes = result.planningTypes;
            form.activities = result.activities;
            form.projectCodeComments = result.projectCodeComments;
            form.checkedSubdepartments = result.checkedSubdepartments;
            form.checkingSubdepartments = result.checkingSubdepartments;
            form.subdepartmentConflicts = result.subdepartmentConflicts;
            form.path = result.path;
            form.updateSubdepartmentView();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
SubdepartmentInfo.prototype.saveSortedPositions = function(ids) {
    var form = this;
    var data = {};
    data.command = "saveSortedPositions";
    data.positionIds = getJSON({"list": ids});
    $.ajax({
      url: this.mainAdmin.config.endpointUrl,
      data: data,
      cache: false,
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.refreshInfo();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
SubdepartmentInfo.prototype.updateSubdepartmentView = function() {
    var html = '';
    html += '<table>';
    html += '<tr><td id="' + this.htmlId + '_layout_path" colspan="5"></td></tr>';
    html += '<tr><td id="' + this.htmlId + '_layout_subdepartment" colspan="5"></td></tr>';
    html += '<tr><td id="' + this.htmlId + '_layout_positions"></td><td id="' + this.htmlId + '_layout_taskTypes"></td><td id="' + this.htmlId + '_layout_activities"></td><td id="' + this.htmlId + '_layout_planningTypes"></td></tr>';
    html += '<tr><td id="' + this.htmlId + '_layout_projectCodeComments"></td><td id="' + this.htmlId + '_layout_checkedSubdepartments"></td><td id="' + this.htmlId + '_layout_checkingSubdepartments"></td><td colspan="2"></td></tr>';
    html += '</table>';
    $('#' + this.containerHtmlId).html(html);
    if(this.displayProperties.subdepartment != null) {
        var rows = [];
        rows.push({"name": "Name", "property": "name"});
        rows.push({"name": "Code Name", "property": "codeName"});
        rows.push({"name": "Description", "property": "description"});
        rows.push({"name": "Active", "property": "isActive", "visualizer": booleanVisualizer});
        var controls = [];
        if(this.displayProperties.subdepartment.edit) {
          controls.push({"id": "edit", "text": "Edit", "icon": imagePath+"/icons/edit.png", "click": {"handler": this.editSubdepartment, "context": this}});
        }
        var propertyGrid = new PropertyGrid("admin_subdepartment", this.subdepartment, rows, "Subdepartment", controls);
        propertyGrid.show(this.htmlId + "_layout_subdepartment");
    }
    if(this.displayProperties.employeeSubdepartmentHistoryItems != null) {
        var columns = [];
        columns.push({"name": "Employee", "property": "employeeUserName"});
        columns.push({"name": "Start", "property": "start", "visualizer": calendarVisualizer});
        columns.push({"name": "End", "property": "end", "visualizer": calendarVisualizer});
        columns.push({"name": "Type", "property": "type"});
        var extraColumns = [];
        if(this.displayProperties.employeeSubdepartmentHistoryItems["update"]) {
          extraColumns.push({"name": "Update", "property": "update", "text": "Update",  "click": {"handler": this.updateEmployeeSubdepartmentHistoryItem, "context": this}});
        }
        if(this.displayProperties.employeeSubdepartmentHistoryItems["delete"]) {
          extraColumns.push({"name": "Delete", "property": "delete", "text": "Delete",  "click": {"handler": this.deleteEmployeeSubdepartmentHistoryItem, "context": this}});
        }
        var controls = [];
        if(this.displayProperties.employeeSubdepartmentHistoryItems["create"]) {
          controls.push({"id": "create", "text": "Create", "icon": imagePath+"/icons/add.png", "click": {"handler": this.createEmployeeSubdepartmentHistoryItem, "context": this}});
        }
        var dataGrid = new DataGrid("admin_employeeSubdepartmentHistoryItems", this.employeeSubdepartmentHistoryItems, columns, "Employee Delegation History Items", controls, extraColumns, "id");
        dataGrid.show(this.htmlId + "_layout_employees");
    }
    if(this.displayProperties.positions != null) {
        var columns = [];
        columns.push({"name": "Name", "property": "positionName", "click": {"handler": this.showPosition, "context": this}});
        columns.push({"name": "Active", "property": "positionIsActive", "visualizer": booleanVisualizer});
        columns.push({"name": "Standard Position", "property": "standardPositionName"});
        var extraColumns = [];
        if(this.displayProperties.positions["delete"]) {
          extraColumns.push({"name": "Delete", "property": "delete", "text": "Delete",  "click": {"handler": this.deletePosition, "context": this}});
        }
        var controls = [];
        if(this.displayProperties.positions["create"]) {
          controls.push({"text": "Add", "icon": imagePath+"/icons/add.png", "click": {"handler": this.addPosition, "context": this}, "id": 'add'});
        }
        if(this.displayProperties.positions["sort"]) {
          controls.push({"text": "Sort", "icon": null, "click": {"handler": this.sortPositions, "context": this}, "id": 'sort'});
        }      
        var dataGrid = new DataGrid("admin_positions", this.positions, columns, "Positions", controls, extraColumns, "id");
        dataGrid.show(this.htmlId + "_layout_positions");
    }
    if(this.displayProperties.taskTypes != null) {
        var columns = [];
        columns.push({"name": "Name", "property": "name", "click": {"handler": this.showTaskType, "context": this}});
        columns.push({"name": "Active", "property": "isActive", "visualizer": booleanVisualizer});
        columns.push({"name": "Internal", "property": "isInternal", "visualizer": booleanVisualizer});
        var extraColumns = [];
        if(this.displayProperties.taskTypes["delete"]) {
          extraColumns.push({"name": "Delete", "property": "delete", "text": "Delete",  "click": {"handler": this.deleteTaskType, "context": this}});
        }
        var controls = [];
        if(this.displayProperties.taskTypes["create"]) {
          controls.push({"text": "Add", "icon": imagePath+"/icons/add.png", "click": {"handler": this.addTaskType, "context": this}});
        }
        var dataGrid = new DataGrid("admin_taskTypes", this.taskTypes, columns, "Task Types", controls, extraColumns, "id");
        dataGrid.show(this.htmlId + "_layout_taskTypes");
    }
    if(this.displayProperties.activities != null) {
        var columns = [];
        columns.push({"name": "Name", "property": "name", "click": {"handler": this.showActivity, "context": this}});
        columns.push({"name": "Code Name", "property": "codeName"});
        columns.push({"name": "Active", "property": "isActive", "visualizer": booleanVisualizer});
        columns.push({"name": "Conflict check", "property": "isConflictCheck", "visualizer": booleanVisualizer});
        var extraColumns = [];
        if(this.displayProperties.activities["delete"]) {
            extraColumns.push({"name": "Delete", "property": "delete", "text": "Delete",  "click": {"handler": this.deleteActivity, "context": this}});
        }
        var controls = [];
        if(this.displayProperties.activities["create"]) {
            controls.push({"text": "Add", "icon": imagePath+"/icons/add.png", "click": {"handler": this.addActivity, "context": this}});
        }
        var dataGrid = new DataGrid("admin_activities", this.activities, columns, "Activities", controls, extraColumns, "id");
        dataGrid.show(this.htmlId + "_layout_activities");
    }
    if(this.displayProperties.planningTypes != null) {
        var columns = [];
        columns.push({"name": "Name", "property": "name", "click": {"handler": this.showPlanningType, "context": this}});
        columns.push({"name": "Active", "property": "isActive", "visualizer": booleanVisualizer});
        columns.push({"name": "Internal", "property": "isInternal", "visualizer": booleanVisualizer});
        var extraColumns = [];
        if(this.displayProperties.planningTypes["delete"]) {
          extraColumns.push({"name": "Delete", "property": "delete", "text": "Delete",  "click": {"handler": this.deletePlanningType, "context": this}});
        }
        var controls = [];
        if(this.displayProperties.planningTypes["create"]) {
          controls.push({"text": "Add", "icon": imagePath+"/icons/add.png", "click": {"handler": this.addPlanningType, "context": this}});
        }
        var dataGrid = new DataGrid("admin_planningTypes", this.planningTypes, columns, "Planning Types", controls, extraColumns, "id");
        dataGrid.show(this.htmlId + "_layout_planningTypes");
    }
    if(this.displayProperties.projectCodeComments != null) {
        var columns = [];
        columns.push({"name": "Content", "property": "content"});
        var extraColumns = [];
        if(this.displayProperties.projectCodeComments["edit"]) {
          extraColumns.push({"name": "Edit", "property": "edit", "text": "Edit",  "click": {"handler": this.editProjectCodeComment, "context": this}});
        }
        if(this.displayProperties.projectCodeComments["delete"]) {
          extraColumns.push({"name": "Delete", "property": "delete", "text": "Delete",  "click": {"handler": this.deleteProjectCodeComment, "context": this}});
        }
        var controls = [];
        if(this.displayProperties.projectCodeComments["create"]) {
          controls.push({"text": "Add", "icon": imagePath+"/icons/add.png", "click": {"handler": this.addProjectCodeComment, "context": this}});
        }
        var dataGrid = new DataGrid("admin_projectCodeComments", this.projectCodeComments, columns, "Project Code Comment", controls, extraColumns, "id");
        dataGrid.show(this.htmlId + "_layout_projectCodeComments");
    }  
    if(this.displayProperties.checkedSubdepartments != null) {
      var columns = [];
      columns.push({"name": "Office", "property": "officeName"});
      columns.push({"name": "Department", "property": "departmentName"});
      columns.push({"name": "Subdepartment", "property": "subdepartmentName"});
      var extraColumns = [];
      if(this.displayProperties.checkedSubdepartments["edit"]) {
        extraColumns.push({"name": "Edit", "property": "edit", "text": "Edit",  "click": {"handler": this.editCheckedSubdepartment, "context": this}});
      }
      if(this.displayProperties.checkedSubdepartments["delete"]) {
        extraColumns.push({"name": "Delete", "property": "delete", "text": "Delete",  "click": {"handler": this.deleteCheckedSubdepartment, "context": this}});
      }
      var controls = [];
      if(this.displayProperties.checkedSubdepartments["create"]) {
        controls.push({"text": "Add", "icon": imagePath+"/icons/add.png", "click": {"handler": this.addCheckedSubdepartment, "context": this}, "id": 'add'});
      }
      var dataGrid = new DataGrid("admin_checkedSubdepartments", this.checkedSubdepartments, columns, "Checked subdepartments", controls, extraColumns, "subdepartmentId");
      dataGrid.show(this.htmlId + "_layout_checkedSubdepartments");
    }
    if(this.displayProperties.checkingSubdepartments != null) {
        var columns = [];
        columns.push({"name": "Office", "property": "officeName"});
        columns.push({"name": "Department", "property": "departmentName"});
        columns.push({"name": "Subdepartment", "property": "subdepartmentName"});
        var extraColumns = [];
        if(this.displayProperties.checkingSubdepartments["edit"]) {
          extraColumns.push({"name": "Edit", "property": "edit", "text": "Edit",  "click": {"handler": this.editCheckingSubdepartment, "context": this}});
        }     
        if(this.displayProperties.checkingSubdepartments["delete"]) {
          extraColumns.push({"name": "Delete", "property": "delete", "text": "Delete",  "click": {"handler": this.deleteCheckingSubdepartment, "context": this}});
        }
        var controls = [];
        if(this.displayProperties.checkingSubdepartments["create"]) {
          controls.push({"text": "Add", "icon": imagePath+"/icons/add.png", "click": {"handler": this.addCheckingSubdepartment, "context": this}, "id": 'add'});
        }
        var dataGrid = new DataGrid("admin_checkingSubdepartments", this.checkingSubdepartments, columns, "Checking subdepartments", controls, extraColumns, "subdepartmentId");
        dataGrid.show(this.htmlId + "_layout_checkingSubdepartments");
    }

  var navigation = new Navigation("path", this.htmlId + '_layout_path', this.path, this.mainAdmin.navigationClickHandle, this.mainAdmin);
  navigation.show();
}
SubdepartmentInfo.prototype.showPosition = function(event) {
  var htmlId=event.currentTarget.id;
  var tmp = htmlId.split("_");
  this.mainAdmin.showPosition(tmp[tmp.length - 1]);
}
SubdepartmentInfo.prototype.showActivity = function(event) {
  var htmlId=event.currentTarget.id;
  var tmp = htmlId.split("_");
  this.mainAdmin.showActivity(tmp[tmp.length - 1]);
}
SubdepartmentInfo.prototype.showTaskType = function(event) {
  var htmlId=event.currentTarget.id;
  var tmp = htmlId.split("_");
  this.mainAdmin.showTaskType(tmp[tmp.length - 1]);
}
SubdepartmentInfo.prototype.showPlanningType = function(event) {
  var htmlId=event.currentTarget.id;
  var tmp = htmlId.split("_");
  this.mainAdmin.showPlanningType(tmp[tmp.length - 1]);
}
SubdepartmentInfo.prototype.addActivity = function(event) {
   var activityEditForm = new ActivityEditForm({
        "mode": 'CREATE',
        "id": null,
        "subdepartmentId": this.subdepartment.id,
        "name": "",
        "codeName": "",
        "isActive": true,
        "isConflictCheck": false
    }, "activityEditForm", this.refreshInfo, this);
    activityEditForm.start();
}
SubdepartmentInfo.prototype.deleteActivity = function(event) {
  var htmlId=event.currentTarget.id;
  var tmp = htmlId.split("_");
  var activityId = tmp[tmp.length - 1];
  var activityDeleteForm = new ActivityDeleteForm(activityId, this.refreshInfo, this);
  activityDeleteForm.start();
}
SubdepartmentInfo.prototype.addPosition = function(event) {
   var positionEditForm = new PositionEditForm({
        "mode": 'CREATE',
        "id": null,
        "subdepartmentId": this.subdepartment.id,
        "standardPositionId": null,
        "name": "",
        "localLanguageName": "",
        "visitCardName": "",
        "localLanguageVisitCardName": "",       
        "codeName": "",
        "isActive": true
    }, "positionEditForm", this.refreshInfo, this);
    positionEditForm.start();
}
SubdepartmentInfo.prototype.sortPositions = function(event) {
    var items = [];
    for(var key in this.positions) {
        var position = this.positions[key];
        items.push({
            id: position.id,
            text: position.standardPositionName + ' / ' + position.positionName
        });
    }
    var positionSortForm = new Sorter({
        "items": items
    }, "positionSorterForm", this.saveSortedPositions, this);
    positionSortForm.init();
}
SubdepartmentInfo.prototype.deletePosition = function(event) {
  var htmlId=event.currentTarget.id;
  var tmp = htmlId.split("_");
  var positionId = tmp[tmp.length - 1];
  var positionDeleteForm = new PositionDeleteForm(positionId, this.refreshInfo, this);
  positionDeleteForm.start();
}
SubdepartmentInfo.prototype.addTaskType = function(event) {
   var taskTypeEditForm = new TaskTypeEditForm({
        "mode": 'CREATE',
        "kind": 'SUBDEPARTMENT_COUNTRY',
        "id": null,
        "subdepartmentId": this.subdepartment.id,
        "name": "",
        "isActive": true,
        "isInternal": false
    }, "taskTypeEditForm", this.refreshInfo, this, this.moduleName);
    taskTypeEditForm.start();
}
SubdepartmentInfo.prototype.deleteTaskType = function(event) {
  var htmlId=event.currentTarget.id;
  var tmp = htmlId.split("_");
  var taskTypeId = tmp[tmp.length - 1];
  var taskTypeDeleteForm = new TaskTypeDeleteForm(taskTypeId, this.refreshInfo, this);
  taskTypeDeleteForm.start();
}
SubdepartmentInfo.prototype.addPlanningType = function(event) {
   var planningTypeEditForm = new PlanningTypeEditForm({
        "mode": 'CREATE',
        "id": null,
        "subdepartmentId": this.subdepartment.id,
        "name": "",
        "isActive": true,
        "isInternal": false
    }, "planningTypeEditForm", this.refreshInfo, this, this.moduleName);
    planningTypeEditForm.start();
}
SubdepartmentInfo.prototype.deletePlanningType = function(event) {
  var htmlId=event.currentTarget.id;
  var tmp = htmlId.split("_");
  var planningTypeId = tmp[tmp.length - 1];
  var planningTypeDeleteForm = new PlanningTypeDeleteForm(planningTypeId, this.refreshInfo, this);
  planningTypeDeleteForm.start();
}
SubdepartmentInfo.prototype.editSubdepartment = function(event) {
    var subdepartmentEditForm = new SubdepartmentEditForm({
        "mode": 'UPDATE',
        "id": this.subdepartment.id,
        "departmentId": this.subdepartment.countryId,
        "name": this.subdepartment.name,
        "codeName": this.subdepartment.codeName,
        "description": this.subdepartment.description,
        "isActive": this.subdepartment.isActive
    }, "subdepartmentEditForm", this.refreshInfo, this);
    subdepartmentEditForm.start();
}
SubdepartmentInfo.prototype.createEmployeeSubdepartmentHistoryItem = function() {
   var employeeSubdepartmentHistoryItemEditForm = new EmployeeSubdepartmentHistoryItemEditForm({
        "mode": 'CREATE',
        "type": 'PROJECT_ACCESS',
        "id": null,
        "subdepartmentId": this.subdepartment.id,
        "employeeId": null,
        "start": null,
        "end": null
    }, "employeeSubdepartmentHistoryItemEditForm", this.refreshInfo, this);
    employeeSubdepartmentHistoryItemEditForm.start();
}
SubdepartmentInfo.prototype.updateEmployeeSubdepartmentHistoryItem = function(event) {
    var htmlId=event.currentTarget.id;
    var tmp = htmlId.split("_");
    var employeeSubdepartmentHistoryItemId = parseInt(tmp[tmp.length - 1]);
    var employeeSubdepartmentHistoryItem = null;
    var employee = null;
    for(var key in this.employeeSubdepartmentHistoryItems) {
        var employeeSubdepartmentHistoryItemTmp = this.employeeSubdepartmentHistoryItems[key];
        if(employeeSubdepartmentHistoryItemTmp.id == employeeSubdepartmentHistoryItemId) {
            employeeSubdepartmentHistoryItem = employeeSubdepartmentHistoryItemTmp;
            break;
        }
    }
    for(var key in this.employees) {
        var employeeTmp = this.positions[key];
        if(employeeTmp.id == employeeSubdepartmentHistoryItem.employeeId) {
            employee = employeeTmp;
            break;
        }
    }
    var employeeSubdepartmentHistoryItemEditForm = new EmployeeSubdepartmentHistoryItemEditForm({
        "mode": 'UPDATE',
        "type": employeeSubdepartmentHistoryItem.type,
        "id": employeeSubdepartmentHistoryItem.id,
        "subdepartmentId": this.subdepartment.id,
        "employeeId": employeeSubdepartmentHistoryItem.employeeId,
        "start": employeeSubdepartmentHistoryItem.start,
        "end": employeeSubdepartmentHistoryItem.end
    }, "employeeSubdepartmentHistoryItemEditForm", this.refreshInfo, this);
    employeeSubdepartmentHistoryItemEditForm.start();
}
SubdepartmentInfo.prototype.deleteEmployeeSubdepartmentHistoryItem = function(event) {
    var htmlId=event.currentTarget.id;
    var tmp = htmlId.split("_");
    var employeeSubdepartmentHistoryItemId = parseInt(tmp[tmp.length - 1]);
    var employeeSubdepartmentHistoryItemDeleteForm = new EmployeeSubdepartmentHistoryItemDeleteForm(employeeSubdepartmentHistoryItemId, this.refreshInfo, this);
    employeeSubdepartmentHistoryItemDeleteForm.start();
}

SubdepartmentInfo.prototype.addProjectCodeComment = function(event) {
    var projectCodeCommentEditForm = new ProjectCodeCommentEditForm({
        "mode": 'CREATE',
        "id": null,
        "subdepartmentId": this.subdepartment.id,
        "content": ""
    }, "projectCodeCommentEditForm", this.refreshInfo, this);
    projectCodeCommentEditForm.start();
}
SubdepartmentInfo.prototype.editProjectCodeComment = function(event) {
  var htmlId=event.currentTarget.id;
  var tmp = htmlId.split("_");
  var projectCodeCommentId = tmp[tmp.length - 1];
  var projectCodeComment = null;
  for(var key in this.projectCodeComments) {
      var tmpProjectCodeComment = this.projectCodeComments[key];
      if(tmpProjectCodeComment.id == projectCodeCommentId) {
          projectCodeComment = tmpProjectCodeComment;
          break;
      }
  }
  var projectCodeCommentEditForm = new ProjectCodeCommentEditForm({
        "mode": 'UPDATE',
        "id": projectCodeCommentId,
        "subdepartmentId": this.subdepartment.id,
        "content": projectCodeComment.content
    }, "projectCodeCommentEditForm", this.refreshInfo, this);
  projectCodeCommentEditForm.start();
}
SubdepartmentInfo.prototype.deleteProjectCodeComment = function(event) {
  var htmlId=event.currentTarget.id;
  var tmp = htmlId.split("_");
  var projectCodeCommentId = tmp[tmp.length - 1];
  var projectCodeCommentDeleteForm = new ProjectCodeCommentDeleteForm(projectCodeCommentId, this.refreshInfo, this);
  projectCodeCommentDeleteForm.start();
}


SubdepartmentInfo.prototype.addCheckedSubdepartment = function(event) {
    var subdepartmentConflictEditForm = new SubdepartmentConflictEditForm({
        "mode": 'CREATE',
        "id": null,
        "checkedSubdepartmentId": null,
        "checkingSubdepartmentId": this.subdepartment.id
    }, "subdepartmentConflictEditForm", this.refreshInfo, this);
    subdepartmentConflictEditForm.init();
}
SubdepartmentInfo.prototype.editCheckedSubdepartment = function(event) {
    var htmlId=event.currentTarget.id;
    var tmp = htmlId.split("_");
    var checkedSubdepartmentId = tmp[tmp.length - 1];
    var subdepartmentConflict = null;
    for(var key in this.subdepartmentConflicts) {
        var tmpSubdepartmentConflict = this.subdepartmentConflicts[key];
        if(tmpSubdepartmentConflict.checkedSubdepartmentId == checkedSubdepartmentId && tmpSubdepartmentConflict.checkingSubdepartmentId == this.subdepartment.id) {
            subdepartmentConflict = tmpSubdepartmentConflict;
            break;
        }
    }
    var subdepartmentConflictEditForm = new SubdepartmentConflictEditForm({
          "mode": 'UPDATE',
          "id": subdepartmentConflict.id,
          "checkedSubdepartmentId": subdepartmentConflict.checkedSubdepartmentId,
          "checkingSubdepartmentId": subdepartmentConflict.checkingSubdepartmentId
    }, "subdepartmentConflictEditForm", this.refreshInfo, this);
    subdepartmentConflictEditForm.init();
}
SubdepartmentInfo.prototype.deleteCheckedSubdepartment = function(event) {
    var htmlId=event.currentTarget.id;
    var tmp = htmlId.split("_");
    var checkedSubdepartmentId = tmp[tmp.length - 1];
    var subdepartmentConflict = null;
    for(var key in this.subdepartmentConflicts) {
        var tmpSubdepartmentConflict = this.subdepartmentConflicts[key];
        if(tmpSubdepartmentConflict.checkedSubdepartmentId == checkedSubdepartmentId && tmpSubdepartmentConflict.checkingSubdepartmentId == this.subdepartment.id) {
            subdepartmentConflict = tmpSubdepartmentConflict;
            break;
        }
    }
    var subdepartmentConflictDeleteForm = new SubdepartmentConflictDeleteForm(subdepartmentConflict.id, this.refreshInfo, this);
    subdepartmentConflictDeleteForm.init();
}


SubdepartmentInfo.prototype.addCheckingSubdepartment = function(event) {
    var subdepartmentConflictEditForm = new SubdepartmentConflictEditForm({
        "mode": 'CREATE',
        "id": null,
        "checkedSubdepartmentId": this.subdepartment.id,
        "checkingSubdepartmentId": null
    }, "subdepartmentConflictEditForm", this.refreshInfo, this);
    subdepartmentConflictEditForm.init();
}
SubdepartmentInfo.prototype.editCheckingSubdepartment = function(event) {
    var htmlId=event.currentTarget.id;
    var tmp = htmlId.split("_");
    var checkingSubdepartmentId = tmp[tmp.length - 1];
    var subdepartmentConflict = null;
    for(var key in this.subdepartmentConflicts) {
        var tmpSubdepartmentConflict = this.subdepartmentConflicts[key];
        if(tmpSubdepartmentConflict.checkingSubdepartmentId == checkingSubdepartmentId && tmpSubdepartmentConflict.checkedSubdepartmentId == this.subdepartment.id) {
            subdepartmentConflict = tmpSubdepartmentConflict;
            break;
        }
    }
    var subdepartmentConflictEditForm = new SubdepartmentConflictEditForm({
          "mode": 'UPDATE',
          "id": subdepartmentConflict.id,
          "checkedSubdepartmentId": subdepartmentConflict.checkedSubdepartmentId,
          "checkingSubdepartmentId": subdepartmentConflict.checkingSubdepartmentId
    }, "subdepartmentConflictEditForm", this.refreshInfo, this);
    subdepartmentConflictEditForm.init();
}
SubdepartmentInfo.prototype.deleteCheckingSubdepartment = function(event) {
    var htmlId=event.currentTarget.id;
    var tmp = htmlId.split("_");
    var checkingSubdepartmentId = tmp[tmp.length - 1];
    var subdepartmentConflict = null;
    for(var key in this.subdepartmentConflicts) {
        var tmpSubdepartmentConflict = this.subdepartmentConflicts[key];
        if(tmpSubdepartmentConflict.checkingSubdepartmentId == checkingSubdepartmentId && tmpSubdepartmentConflict.checkedSubdepartmentId == this.subdepartment.id) {
            subdepartmentConflict = tmpSubdepartmentConflict;
            break;
        }
    }
    var subdepartmentConflictDeleteForm = new SubdepartmentConflictDeleteForm(subdepartmentConflict.id, this.refreshInfo, this);
    subdepartmentConflictDeleteForm.init();
}

SubdepartmentInfo.prototype.addEmployeeSubdepartmentLink = function(event) {
    var employeeSubdepartmentLinkEditForm = new EmployeeSubdepartmentLinkEditForm({
        "mode": 'CREATE',
        "id": null,
        "employeeId": null,
        "subdepartmentId": this.subdepartment.id,
        "type": null
    }, "employeeSubdepartmentLinkEditForm", this.refreshInfo, this);
    employeeSubdepartmentLinkEditForm.init();
}
SubdepartmentInfo.prototype.editEmployeeSubdepartmentLink = function(event) {
    var htmlId=event.currentTarget.id;
    var tmp = htmlId.split("_");
    var id = tmp[tmp.length - 1];
    var employeeSubdepartmentLink = null;
    for(var key in this.employeeSubdepartmentLinks) {
        var tmpEmployeeSubdepartmentLink = this.employeeSubdepartmentLinks[key];
        if(tmpEmployeeSubdepartmentLink.id == id) {
            employeeSubdepartmentLink = tmpEmployeeSubdepartmentLink;
            break;
        }
    }
    var employeeSubdepartmentLinkEditForm = new EmployeeSubdepartmentLinkEditForm({
          "mode": 'UPDATE',
          "id": employeeSubdepartmentLink.id,
          "employeeId": employeeSubdepartmentLink.employeeId,
          "subdepartmentId": employeeSubdepartmentLink.subdepartmentId,
          "type": employeeSubdepartmentLink.type
    }, "employeeSubdepartmentLinkEditForm", this.refreshInfo, this);
    employeeSubdepartmentLinkEditForm.init();
}
SubdepartmentInfo.prototype.deleteEmployeeSubdepartmentLink = function(event) {
    var htmlId=event.currentTarget.id;
    var tmp = htmlId.split("_");
    var id = tmp[tmp.length - 1];
    var employeeSubdepartmentLinkDeleteForm = new EmployeeSubdepartmentLinkDeleteForm(id, this.refreshInfo, this);
    employeeSubdepartmentLinkDeleteForm.init();
}
