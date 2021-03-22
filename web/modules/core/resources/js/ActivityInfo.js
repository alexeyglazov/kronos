/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

ActivityInfo = function(mainAdmin, htmlId, containerHtmlId, displayProperties) {
    this.mainAdmin = mainAdmin;
    this.htmlId = htmlId;
    this.containerHtmlId = containerHtmlId;
    this.displayProperties = displayProperties;
}
ActivityInfo.prototype.refreshInfo = function() {
    this.showInfo(this.activity.id);
}

ActivityInfo.prototype.showInfo = function(id) {
    var form = this;
    var data = {};
    data.command = "getActivityInfo";
    data.id = id;
    $.ajax({
      url: this.mainAdmin.config.endpointUrl,
      data: data,
      cache: false,
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.activity = result.activity;
            form.projectCodes = result.projectCodes;
            form.path = result.path;
            form.updateActivityView();
        })  
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
ActivityInfo.prototype.updateActivityView = function() {
  var html = '';
  html += '<table><tr><td id="' + this.htmlId + '_layout_path"></td></tr><tr><td id="' + this.htmlId + '_layout_activity"></td></tr><tr><td id="' + this.htmlId + '_layout_projectCodes"></td></tr></table>';
  $('#' + this.containerHtmlId).html(html);

  if(this.displayProperties.activity != null) {
      var rows = [];
      rows.push({"name": "Name", "property": "name"});
      rows.push({"name": "Code Name", "property": "codeName"});
      rows.push({"name": "Active", "property": "isActive", "visualizer": booleanVisualizer});
      rows.push({"name": "Conflict check", "property": "isConflictCheck", "visualizer": booleanVisualizer});
      var controls = [];
      if(this.displayProperties.activity.edit) {
        controls.push({"id": "edit", "text": "Edit", "icon": imagePath+"/icons/edit.png", "click": {"handler": this.editActivity, "context": this}});
      }
      var propertyGrid = new PropertyGrid("admin_activity", this.activity, rows, "Activity", controls);
      propertyGrid.show(this.htmlId + "_layout_activity");
  }

  if(this.displayProperties.projectCodes != null) {
      var columns = [];
      columns.push({"name": "Code", "property": "code", "click": {"handler": this.showProjectCode, "context": this}});
      columns.push({"name": "Description", "property": "description"});
      var dataGrid = new DataGrid("admin_projectCodes", this.projectCodes, columns, "Project Codes", null, null, "id");
      dataGrid.show(this.htmlId + "_layout_projectCodes");
  }
  var navigation = new Navigation("path", this.htmlId + '_layout_path', this.path, this.mainAdmin.navigationClickHandle, this.mainAdmin);
  navigation.show();
}
ActivityInfo.prototype.showProjectCode = function(event) {
  var htmlId=event.currentTarget.id;
  var tmp = htmlId.split("_");
  this.mainAdmin.showProjectCode(tmp[tmp.length - 1]);
}
ActivityInfo.prototype.editActivity = function(event) {
    var activityEditForm = new ActivityEditForm({
        "mode": 'UPDATE',
        "id": this.activity.id,
        "subdepartmentId": this.activity.subdepartmentId,
        "name": this.activity.name,
        "codeName": this.activity.codeName,
        "isActive": this.activity.isActive,
        "isConflictCheck": this.activity.isConflictCheck
    }, "activityEditForm", this.refreshInfo, this);
    activityEditForm.start();
}