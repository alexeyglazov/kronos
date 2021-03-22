/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

TaskTypeInfo = function(mainAdmin, htmlId, containerHtmlId, displayProperties, moduleName) {
    this.mainAdmin = mainAdmin;
    this.htmlId = htmlId;
    this.containerHtmlId = containerHtmlId;
    this.displayProperties = displayProperties;
    this.moduleName = moduleName;
}
TaskTypeInfo.prototype.refreshInfo = function() {
    this.showInfo(this.taskType.id);
}
TaskTypeInfo.prototype.showInfo = function(id) {
    var form = this;
    var data = {};
    data.command = "getTaskTypeInfo";
    data.id = id;
    $.ajax({
      url: this.mainAdmin.config.endpointUrl,
      data: data,
      cache: false,
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.taskType = result.taskType;
            form.tasks = result.tasks;
            form.path = result.path;
            form.updateTaskTypeView();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
TaskTypeInfo.prototype.updateTaskTypeView = function() {
  var html = '';
  html += '<table><tr><td id="' + this.htmlId + '_layout_path"></td></tr><tr><td id="' + this.htmlId + '_layout_taskType"></td></tr><tr><td id="' + this.htmlId + '_layout_tasks"></td></tr></table>';
  $('#' + this.containerHtmlId).html(html);
  if(this.displayProperties.taskType != null) {
      var rows = [];
      rows.push({"name": "Name", "property": "name"});
      rows.push({"name": "Active", "property": "isActive"});
      rows.push({"name": "Internal", "property": "isInternal"});
      var controls = [];
      if(this.displayProperties.taskType.edit) {
          controls.push({"id": "edit", "text": "Edit", "icon": imagePath+"/icons/edit.png", "click": {"handler": this.editTaskType, "context": this}});
      }
      var propertyGrid = new PropertyGrid("admin_taskType", this.taskType, rows, "Task Type", controls);
      propertyGrid.show(this.htmlId + "_layout_taskType");
  }
  if(this.displayProperties.tasks != null) {
      var columns = [];
      columns.push({"name": "Name", "property": "name", "click": {"handler": this.showTask, "context": this}});
      columns.push({"name": "Active", "property": "isActive", visualizer: booleanVisualizer});
      columns.push({"name": "Idle", "property": "isIdle", visualizer: booleanVisualizer});
      columns.push({"name": "Training", "property": "isTraining", visualizer: booleanVisualizer});
      columns.push({"name": "Description", "property": "description"});
      var extraColumns = [];
      if(this.displayProperties.tasks["delete"]) {
        extraColumns.push({"name": "Delete", "property": "delete", "text": "Delete",  "click": {"handler": this.deleteTask, "context": this}});
      }
      var controls = [];
      if(this.displayProperties.tasks["create"]) {
        controls.push({"text": "Add", "icon": imagePath+"/icons/add.png", "click": {"handler": this.addTask, "context": this}});
      }
      var dataGrid = new DataGrid("admin_tasks", this.tasks, columns, "Tasks", controls, extraColumns, "id");
      dataGrid.show(this.htmlId + "_layout_tasks");
  }
  var navigation = new Navigation("path", this.htmlId + '_layout_path', this.path, this.mainAdmin.navigationClickHandle, this.mainAdmin);
  navigation.show();
}
TaskTypeInfo.prototype.showTask = function(event) {
  var htmlId=event.currentTarget.id;
  var tmp = htmlId.split("_");
  this.mainAdmin.showTask(tmp[tmp.length - 1]);
}
TaskTypeInfo.prototype.addTask = function(event) {
    var taskEditForm = new TaskEditForm({
        "mode": 'CREATE',
        "id": null,
        "taskTypeId": this.taskType.id,
        "name": "",
        "isActive": true,
        "isIdle": false,
        "isTraining": false,
        "description": ''
    }, "taskEditForm", this.refreshInfo, this);
    taskEditForm.start();
}
TaskTypeInfo.prototype.deleteTask = function(event) {
  var htmlId=event.currentTarget.id;
  var tmp = htmlId.split("_");
  var taskId = tmp[tmp.length - 1];
  var taskDeleteForm = new TaskDeleteForm(taskId, this.refreshInfo, this);
  taskDeleteForm.start();
}
TaskTypeInfo.prototype.editTaskType = function(event) {
    var kind = 'SUBDEPARTMENT_COUNTRY';
    if(this.taskType.subdepartmentId == null && this.taskType.countryId == null) {
        kind = 'COMMON';
    }
    var taskTypeEditForm = new TaskTypeEditForm({
        "mode": 'UPDATE',
        "kind": kind,
        "id": this.taskType.id,
        "subdepartmentId": this.taskType.subdepartmentId,
        "name": this.taskType.name,
        "isActive": this.taskType.isActive,
        "isInternal": this.taskType.isInternal
    }, "taskTypeEditForm", this.refreshInfo, this, this.moduleName);
    taskTypeEditForm.start();
}
