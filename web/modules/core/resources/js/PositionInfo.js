/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


PositionInfo = function(mainAdmin, htmlId, containerHtmlId, displayProperties) {
    this.mainAdmin = mainAdmin;
    this.htmlId = htmlId;
    this.containerHtmlId = containerHtmlId;
    this.displayProperties = displayProperties;
}
PositionInfo.prototype.refreshInfo = function() {
    this.showInfo(this.position.id);
}
PositionInfo.prototype.showInfo = function(id) {
    var form = this;
    var data = {};
    data.command = "getPositionInfo";
    data.id = id;
    $.ajax({
      url: this.mainAdmin.config.endpointUrl,
      data: data,
      cache: false,
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.position = result.position;
            form.employees = result.employees;
            form.path = result.path;
            form.updatePositionView();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
PositionInfo.prototype.updatePositionView = function() {
  var html = '';
  html += '<table><tr><td id="' + this.htmlId + '_layout_path"></td></tr><tr><td id="' + this.htmlId + '_layout_position"></td></tr><tr><td id="' + this.htmlId + '_layout_employees"></td></table>';
  $('#' + this.containerHtmlId).html(html);

  if(this.displayProperties.position != null) {
      var rows = [];
      rows.push({"name": "Name", "property": "name"});
      rows.push({"name": "Local language name", "property": "localLanguageName"});
      rows.push({"name": "Visit card name", "property": "visitCardName"});
      rows.push({"name": "Local language visit card name", "property": "localLanguageVisitCardName"});
      rows.push({"name": "Active", "property": "isActive", "visualizer": booleanVisualizer});
      var controls = [];
      if(this.displayProperties.position.edit) {
        controls.push({"id": "edit", "text": "Edit", "icon": imagePath+"/icons/edit.png", "click": {"handler": this.editPosition, "context": this}});
      }
      var propertyGrid = new PropertyGrid("admin_position", this.position, rows, "Position", controls);
      propertyGrid.show(this.htmlId + "_layout_position");
  }
  if(this.displayProperties.employees != null) {
      var columns = [];
      columns.push({"name": "User Name", "property": "userName", "click": {"handler": this.showEmployee, "context": this}});
      columns.push({"name": "First Name", "property": "firstName"});
      columns.push({"name": "Last Name", "property": "lastName"});
      columns.push({"name": "First Name (Local Language)", "property": "firstNameLocalLanguage"});
      columns.push({"name": "Last Name (Local Language)", "property": "lastNameLocalLanguage"});
      columns.push({"name": "Maiden Name", "property": "maidenName"});
      columns.push({"name": "E-mail", "property": "email"});
      columns.push({"name": "Profile", "property": "profile"});
      columns.push({"name": "Active", "property": "isActive", "visualizer": booleanVisualizer});
      var extraColumns = [];
      if(this.displayProperties.employees["delete"]) {
        extraColumns.push({"name": "Delete", "property": "delete", "text": "Delete",  "click": {"handler": this.deleteEmployee, "context": this}});
      }
      if(this.displayProperties.employees["unbind"]) {
        extraColumns.push({"name": "Unbind", "property": "unbind", "text": "Unbind",  "click": {"handler": this.unbindEmployee, "context": this}});
      }
      var controls = [];
      if(this.displayProperties.employees["create"]) {
        controls.push({"id": "create", "text": "Create", "icon": imagePath+"/icons/add.png", "click": {"handler": this.createEmployee, "context": this}});
      }
      if(this.displayProperties.employees["bind"]) {
        controls.push({"id": "bind", "text": "Bind", "icon": null, "click": {"handler": this.bindEmployee, "context": this}});
      }
      var dataGrid = new DataGrid("admin_employees", this.employees, columns, "Current Employees", controls, extraColumns, "id");
      dataGrid.show(this.htmlId + "_layout_employees");
  }
  var navigation = new Navigation("path", this.htmlId + '_layout_path', this.path, this.mainAdmin.navigationClickHandle, this.mainAdmin);
  navigation.show();
}

PositionInfo.prototype.editPosition = function(event) {
    var positionEditForm = new PositionEditForm({
        "mode": 'UPDATE',
        "id": this.position.id,
        "subdepartmentId": this.position.subdepartmentId,
        "standardPositionId": this.position.standardPositionId,
        "name": this.position.name,
        "localLanguageName": this.position.localLanguageName,
        "visitCardName": this.position.visitCardName,
        "localLanguageVisitCardName": this.position.localLanguageVisitCardName,
        "isActive": this.position.isActive
    }, "positionEditForm", this.refreshInfo, this);
    positionEditForm.start();
}
PositionInfo.prototype.showEmployee = function(event) {
  var htmlId=event.currentTarget.id;
  var tmp = htmlId.split("_");
  this.mainAdmin.showEmployee(tmp[tmp.length - 1]);
}
PositionInfo.prototype.createEmployee = function(event) {
    var employeeEditForm = new EmployeeEditForm({
        "mode": 'CREATE',
        "id": null,
        "positionId": this.position.id,
        "userName": "",
        "firstName": "",
        "lastName": "",
        "firstNameLocalLanguage": "",
        "lastNameLocalLanguage": "",
        "maidenName": "",
        "email": "",
        "profile": "USER",
        "isActive": true
    }, "employeeEditForm", this.refreshInfo, this);
    employeeEditForm.start();
}
PositionInfo.prototype.bindEmployee = function(event) {
    var employeeBindForm = new EmployeeBindForm({
        "positionId": this.position.id
    }, "employeeBindForm", this.refreshInfo, this);
    employeeBindForm.start();
}
PositionInfo.prototype.deleteEmployee = function(event) {
  var htmlId=event.currentTarget.id;
  var tmp = htmlId.split("_");
  var employeeId = tmp[tmp.length - 1];
  var employeeDeleteForm = new EmployeeDeleteForm(employeeId, this.refreshInfo, this);
  employeeDeleteForm.start();
}
PositionInfo.prototype.unbindEmployee = function(event) {
  var htmlId=event.currentTarget.id;
  var tmp = htmlId.split("_");
  var employeeId = tmp[tmp.length - 1];
  var employeeUnbindForm = new EmployeeUnbindForm({
        "positionId": this.position.id,
        "employeeId": employeeId
    }, this.refreshInfo, this);
  employeeUnbindForm.start();
}
