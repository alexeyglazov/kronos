/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

PlanningTypeInfo = function(mainAdmin, htmlId, containerHtmlId, displayProperties, moduleName) {
    this.mainAdmin = mainAdmin;
    this.htmlId = htmlId;
    this.containerHtmlId = containerHtmlId;
    this.displayProperties = displayProperties;
    this.moduleName = moduleName;
}
PlanningTypeInfo.prototype.refreshInfo = function() {
    this.showInfo(this.planningType.id);
}
PlanningTypeInfo.prototype.showInfo = function(id) {
    var form = this;
    var data = {};
    data.command = "getPlanningTypeInfo";
    data.id = id;
    $.ajax({
      url: this.mainAdmin.config.endpointUrl,
      data: data,
      cache: false,
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.planningType = result.planningType;
            form.path = result.path;
            form.updatePlanningTypeView();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
PlanningTypeInfo.prototype.updatePlanningTypeView = function() {
  var html = '';
  html += '<table><tr><td id="' + this.htmlId + '_layout_path"></td></tr><tr><td id="' + this.htmlId + '_layout_planningType"></td></tr></table>';
  $('#' + this.containerHtmlId).html(html);
  if(this.displayProperties.planningType != null) {
      var rows = [];
      rows.push({"name": "Name", "property": "name"});
      rows.push({"name": "Active", "property": "isActive", visualizer: booleanVisualizer});
      rows.push({"name": "Internal", "property": "isInternal", visualizer: booleanVisualizer});
      var controls = [];
      if(this.displayProperties.planningType.edit) {
          controls.push({"id": "edit", "text": "Edit", "icon": imagePath+"/icons/edit.png", "click": {"handler": this.editPlanningType, "context": this}});
      }
      var propertyGrid = new PropertyGrid("admin_planningType", this.planningType, rows, "Planning Type", controls);
      propertyGrid.show(this.htmlId + "_layout_planningType");
  }
  var navigation = new Navigation("path", this.htmlId + '_layout_path', this.path, this.mainAdmin.navigationClickHandle, this.mainAdmin);
  navigation.show();
}
PlanningTypeInfo.prototype.editPlanningType = function(event) {
    var planningTypeEditForm = new PlanningTypeEditForm({
        "mode": 'UPDATE',
        "id": this.planningType.id,
        "subdepartmentId": this.planningType.subdepartmentId,
        "name": this.planningType.name,
        "isActive": this.planningType.isActive,
        "isInternal": this.planningType.isInternal
    }, "planningTypeEditForm", this.refreshInfo, this, this.moduleName);
    planningTypeEditForm.start();
}
