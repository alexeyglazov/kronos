/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

ModuleInfo = function(mainAdmin, htmlId, containerHtmlId, displayProperties) {
    this.mainAdmin = mainAdmin;
    this.htmlId = htmlId;
    this.containerHtmlId = containerHtmlId;
    this.displayProperties = displayProperties;
}
ModuleInfo.prototype.refreshInfo = function() {
    this.showInfo(this.module.id);
}

ModuleInfo.prototype.showInfo = function(id) {
    var form = this;
    var data = {};
    data.command = "getModuleInfo";
    data.id = id;
    $.ajax({
      url: this.mainAdmin.config.endpointUrl,
      data: data,
      cache: false,
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.module = result.module;
            form.path = result.path;
            form.updateModuleView();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
ModuleInfo.prototype.updateModuleView = function() {
  var html = '';
  html += '<table><tr><td id="' + this.htmlId + '_layout_path"></td></tr><tr><td id="' + this.htmlId + '_layout_module"></td></tr></table>';
  $('#' + this.containerHtmlId).html(html);
  if(this.displayProperties.module != null) {
      var rows = [];
      rows.push({"name": "Name", "property": "name"});
      rows.push({"name": "Report", "property": "isReport", visualizer: booleanVisualizer});
      rows.push({"name": "Description", "property": "description"});
      var controls = [];
      if(this.displayProperties.module.edit) {
          controls.push({"id": "edit", "text": "Edit", "icon": imagePath+"/icons/edit.png", "click": {"handler": this.editModule, "context": this}});
      }
      var propertyGrid = new PropertyGrid("admin_module", this.module, rows, "Module", controls);
      propertyGrid.show(this.htmlId + "_layout_module");
  }
  var navigation = new Navigation("path", this.htmlId + '_layout_path', this.path, this.mainAdmin.navigationClickHandle, this.mainAdmin);
  navigation.show();
}

ModuleInfo.prototype.editModule = function(event) {
    var moduleEditForm = new ModuleEditForm({
        "mode": 'UPDATE',
        "id": this.module.id,
        "name": this.module.name,
        "isReport": this.module.isReport,
        "description": this.module.description
    }, "moduleEditForm", this.refreshInfo, this);
    moduleEditForm.start();
}