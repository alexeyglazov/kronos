/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

StandardPositionInfo = function(mainAdmin, htmlId, containerHtmlId, displayProperties) {
    this.mainAdmin = mainAdmin;
    this.htmlId = htmlId;
    this.containerHtmlId = containerHtmlId;
    this.displayProperties = displayProperties;
}
StandardPositionInfo.prototype.refreshInfo = function() {
    this.showInfo(this.standardPosition.id);
}

StandardPositionInfo.prototype.showInfo = function(id) {
    var form = this;
    var data = {};
    data.command = "getStandardPositionInfo";
    data.id = id;
    $.ajax({
      url: this.mainAdmin.config.endpointUrl,
      data: data,
      cache: false,
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.standardPosition = result.standardPosition;
            form.path = result.path;
            form.updateStandardPositionView();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
StandardPositionInfo.prototype.updateStandardPositionView = function() {
  var html = '';
  html += '<table><tr><td id="' + this.htmlId + '_layout_path"></td></tr><tr><td id="' + this.htmlId + '_layout_standardPosition"></td></tr></table>';
  $('#' + this.containerHtmlId).html(html);
  if(this.displayProperties.standardPosition != null) {
      var rows = [];
      rows.push({"name": "Name", "property": "name"});
      rows.push({"name": "Sort value", "property": "sortValue"});
      var controls = [];
      if(this.displayProperties.standardPosition.edit) {
          controls.push({"id": "edit", "text": "Edit", "icon": imagePath+"/icons/edit.png", "click": {"handler": this.editStandardPosition, "context": this}});
      }
      var propertyGrid = new PropertyGrid("admin_standardPosition", this.standardPosition, rows, "StandardPosition", controls);
      propertyGrid.show(this.htmlId + "_layout_standardPosition");
  }
  var navigation = new Navigation("path", this.htmlId + '_layout_path', this.path, this.mainAdmin.navigationClickHandle, this.mainAdmin);
  navigation.show();
}

StandardPositionInfo.prototype.editStandardPosition = function(event) {
    var standardPositionEditForm = new StandardPositionEditForm({
        "mode": 'UPDATE',
        "id": this.standardPosition.id,
        "name": this.standardPosition.name,
        "sortValue": this.standardPosition.sortValue
    }, "standardPositionEditForm", this.refreshInfo, this);
    standardPositionEditForm.start();
}