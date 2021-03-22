/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */



EmployeeInfo = function(mainAdmin, htmlId, containerHtmlId, displayProperties) {
    this.mainAdmin = mainAdmin;
    this.htmlId = htmlId;
    this.containerHtmlId = containerHtmlId;
    this.displayProperties = displayProperties;
}
EmployeeInfo.prototype.refreshInfo = function() {
    this.showInfo(this.employee.id);
}
EmployeeInfo.prototype.showInfo = function(id) {
    var form = this;
    var data = {};
    data.command = "getEmployeeInfo";
    data.id = id;
    $.ajax({
      url: this.mainAdmin.config.endpointUrl,
      data: data,
      cache: false,
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.employee = result.employee;
            form.employeeSubdepartmentHistoryItems = result.employeeSubdepartmentHistoryItems;
            form.path = result.path;
            form.updateEmployeeView();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
EmployeeInfo.prototype.updateEmployeeView = function() {
  var html = '';
  html += '<table><tr><td id="' + this.htmlId + '_layout_path" colspan="1"></td></tr><tr><td id="' + this.htmlId + '_layout_employee" colspan="1"></td></tr><tr><td id="' + this.htmlId + '_layout_employeeSubdepartmentHistoryItems"></td></tr></table>';
  $('#' + this.containerHtmlId).html(html);

  if(this.displayProperties.employee != null) {
      var rows = [];
      rows.push({"name": "External Id (1C)", "property": "externalId"});
      rows.push({"name": "User name", "property": "userName"});
      rows.push({"name": "First Name", "property": "firstName"});
      rows.push({"name": "Last Name", "property": "lastName"});
      rows.push({"name": "First Name (Local Language)", "property": "firstNameLocalLanguage"});
      rows.push({"name": "Last Name (Local Language)", "property": "lastNameLocalLanguage"});
      rows.push({"name": "Maiden Name", "property": "maidenName"});
      rows.push({"name": "E-mail", "property": "email"});
      rows.push({"name": "Profile", "property": "profile"});
      rows.push({"name": "Active", "property": "isActive"});
      rows.push({"name": "Password To Be Changed", "property": "passwordToBeChanged"});
      var controls = [];
      if(this.displayProperties.employee.edit) {
        controls.push({"id": "edit", "text": "Edit", "icon": imagePath+"/icons/edit.png", "click": {"handler": this.editEmployee, "context": this}});
      }
      var propertyGrid = new PropertyGrid("admin_employee", this.employee, rows, "Employee", controls);
      propertyGrid.show(this.htmlId + "_layout_employee");
  }
  if(this.displayProperties.employeeSubdepartmentHistoryItems != null) {
      var columns = [];
      columns.push({"name": "Start", "property": "start", "click": {"handler": this.showSubdepartment, "context": this}});
      columns.push({"name": "End", "property": "end"});
      columns.push({"name": "Type", "property": "type"});
      var controls = [];
      var dataGrid = new DataGrid("admin_employeeSubdepartmentHistoryItems", this.employeeSubdepartmentHistoryItems, columns, "Delegated Subdepartments History", controls, null, "id");
      dataGrid.show(this.htmlId + "_layout_employeeSubdepartmentHistoryItems");
  }
  var navigation = new Navigation("path", this.htmlId + '_layout_path', this.path, this.mainAdmin.navigationClickHandle, this.mainAdmin);
  navigation.show();
}
EmployeeInfo.prototype.showSubdepartment = function(event) {
  var htmlId=event.currentTarget.id;
  var tmp = htmlId.split("_");
  this.mainAdmin.showSubdepartment(tmp[tmp.length - 1]);
}
EmployeeInfo.prototype.showProjectCode = function(event) {
  var htmlId=event.currentTarget.id;
  var tmp = htmlId.split("_");
  this.mainAdmin.showProjectCode(tmp[tmp.length - 1]);
}
EmployeeInfo.prototype.editEmployee = function(event) {
    var employeeEditForm = new EmployeeEditForm({
        "mode": 'UPDATE',
        "id": this.employee.id,
        "positionId": this.employee.positionId,
        "userName": this.employee.userName,
        "password": this.employee.password,
        "firstName": this.employee.firstName,
        "lastName": this.employee.lastName,
        "firstNameLocalLanguage": this.employee.firstNameLocalLanguage,
        "lastNameLocalLanguage": this.employee.lastNameLocalLanguage,
        "maidenName": this.employee.maidenName,
        "email": this.employee.email,
        "profile": this.employee.profile,
        "isActive": this.employee.isActive
    }, "employeeEditForm", this.mainAdmin.popupContainerId, this.refreshInfo, this);
    employeeEditForm.start();
}
EmployeeInfo.prototype.setMainPositions = function(event) {
    var mainPositionsEditForm = new MainPositionsEditForm(this.employee.id, "mainPositionsEditForm", this.mainAdmin.popupContainerId, this.refreshInfo, this);
    mainPositionsEditForm.init();
}