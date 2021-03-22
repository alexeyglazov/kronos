/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

TaskInfo = function(mainAdmin, htmlId, containerHtmlId, displayProperties) {
    this.mainAdmin = mainAdmin;
    this.htmlId = htmlId;
    this.containerHtmlId = containerHtmlId;
    this.displayProperties = displayProperties;
}
TaskInfo.prototype.refreshInfo = function() {
    this.showInfo(this.task.id);
}

TaskInfo.prototype.showInfo = function(id) {
    var form = this;
    var data = {};
    data.command = "getTaskInfo";
    data.id = id;
    $.ajax({
      url: this.mainAdmin.config.endpointUrl,
      data: data,
      cache: false,
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.task = result.task;
            form.path = result.path;
            form.updateTaskView();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
TaskInfo.prototype.updateTaskView = function() {
  var html = '';
  html += '<table><tr><td id="' + this.htmlId + '_layout_path"></td></tr><tr><td id="' + this.htmlId + '_layout_task"></td></tr></table>';
  $('#' + this.containerHtmlId).html(html);
  if(this.displayProperties.task != null) {
      var rows = [];
      rows.push({"name": "Name", "property": "name"});
      rows.push({"name": "Active", "property": "isActive", visualizer: booleanVisualizer});
      rows.push({"name": "Idle", "property": "isIdle", visualizer: booleanVisualizer});
      rows.push({"name": "Training", "property": "isTraining", visualizer: booleanVisualizer});
      rows.push({"name": "Description", "property": "description"});
      var controls = [];
      if(this.displayProperties.task.edit) {
          controls.push({"id": "edit", "text": "Edit", "icon": imagePath+"/icons/edit.png", "click": {"handler": this.editTask, "context": this}});
      }
      var propertyGrid = new PropertyGrid("admin_task", this.task, rows, "Task", controls);
      propertyGrid.show(this.htmlId + "_layout_task");
  }
  var navigation = new Navigation("path", this.htmlId + '_layout_path', this.path, this.mainAdmin.navigationClickHandle, this.mainAdmin);
  navigation.show();
}

TaskInfo.prototype.editTask = function(event) {
    var taskEditForm = new TaskEditForm({
        "mode": 'UPDATE',
        "id": this.task.id,
        "taskTypeId": this.task.taskTypeId,
        "name": this.task.name,
        "isActive": this.task.isActive,
        "isIdle": this.task.isIdle,
        "isTraining": this.task.isTraining,
        "description": this.task.description
    }, "taskEditForm", this.refreshInfo, this);
    taskEditForm.start();
}