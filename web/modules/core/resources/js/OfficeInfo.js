/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */




OfficeInfo = function(mainAdmin, htmlId, containerHtmlId, displayProperties) {
    this.mainAdmin = mainAdmin;
    this.htmlId = htmlId;
    this.containerHtmlId = containerHtmlId;
    this.displayProperties = displayProperties;
}
OfficeInfo.prototype.refreshInfo = function() {
    this.showInfo(this.office.id);
}
OfficeInfo.prototype.showInfo = function(id) {
    var form = this;
    var data = {};
    data.command = "getOfficeInfo";
    data.id = id;
    $.ajax({
      url: this.mainAdmin.config.endpointUrl,
      data: data,
      cache: false,
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.office = result.office;
            form.departments = result.departments;
            form.path = result.path;
            form.updateOfficeView();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
OfficeInfo.prototype.updateOfficeView = function() {
  var html = '';
  html += '<table><tr><td id="' + this.htmlId + '_layout_path"></td></tr><tr><td id="' + this.htmlId + '_layout_office"></td></tr><tr><td id="' + this.htmlId + '_layout_departments"></td></tr></table>';
  $('#' + this.containerHtmlId).html(html);

  if(this.displayProperties.office != null) {
      var rows = [];
      rows.push({"name": "Name", "property": "name"});
      rows.push({"name": "Code Name", "property": "codeName"});
      rows.push({"name": "Description", "property": "description"});
      rows.push({"name": "Active", "property": "isActive", "visualizer": booleanVisualizer});
      var controls = [];
      if(this.displayProperties.office.edit) {
        controls.push({"id": "edit", "text": "Edit", "icon": imagePath+"/icons/edit.png", "click": {"handler": this.editOffice, "context": this}});
      }
      var propertyGrid = new PropertyGrid("admin_office", this.office, rows, "Office", controls);
      propertyGrid.show(this.htmlId + "_layout_office");
  }
  if(this.displayProperties.departments != null) {
      var columns = [];
      columns.push({"name": "Name", "property": "name", "click": {"handler": this.showDepartment, "context": this}});
      columns.push({"name": "Code Name", "property": "codeName"});
      columns.push({"name": "Description", "property": "description"});
      columns.push({"name": "Active", "property": "isActive", "visualizer": booleanVisualizer});
      columns.push({"name": "BusinessTrippable", "property": "isBusinessTrippable", "visualizer": booleanVisualizer});
      var extraColumns = [];
      if(this.displayProperties.departments["delete"]) {
          extraColumns.push({"name": "Delete", "property": "delete", "text": "Delete",  "click": {"handler": this.deleteDepartment, "context": this}});
      }
      var controls = [];
      if(this.displayProperties.departments["create"]) {
        controls.push({"text": "Add", "icon": imagePath+"/icons/add.png", "click": {"handler": this.addDepartment, "context": this}});
      }
      var dataGrid = new DataGrid("admin_departments", this.departments, columns, "Departments", controls, extraColumns, "id");
      dataGrid.show(this.htmlId + "_layout_departments");
  }
  var navigation = new Navigation("path", this.htmlId + '_layout_path', this.path, this.mainAdmin.navigationClickHandle, this.mainAdmin);
  navigation.show();
}
OfficeInfo.prototype.showDepartment = function(event) {
  var htmlId=event.currentTarget.id;
  var tmp = htmlId.split("_");
  this.mainAdmin.showDepartment(tmp[tmp.length - 1]);
}
OfficeInfo.prototype.showProjectCode = function(event) {
  var htmlId=event.currentTarget.id;
  var tmp = htmlId.split("_");
  this.mainAdmin.showProjectCode(tmp[tmp.length - 1]);
}
OfficeInfo.prototype.addDepartment = function(event) {
    var departmentEditForm = new DepartmentEditForm({
        "mode": 'CREATE',
        "id": null,
        "officeId": this.office.id,
        "name": "",
        "codeName": "",
        "description": "",
        "isActive": true,
        "isBusinessTrippable": false
    }, "departmentEditForm", this.refreshInfo, this);
    departmentEditForm.start();
}
OfficeInfo.prototype.deleteDepartment = function(event) {
  var htmlId=event.currentTarget.id;
  var tmp = htmlId.split("_");
  var departmentId = tmp[tmp.length - 1];
  var departmentDeleteForm = new DepartmentDeleteForm(departmentId, this.refreshInfo, this);
  departmentDeleteForm.start();
}
OfficeInfo.prototype.editOffice = function(event) {
    var officeEditForm = new OfficeEditForm({
        "mode": 'UPDATE',
        "id": this.office.id,
        "countryId": this.office.countryId,
        "name": this.office.name,
        "codeName": this.office.codeName,
        "description": this.office.description,
        "isActive": this.office.isActive
    }, "officeEditForm", this.refreshInfo, this);
    officeEditForm.start();
}

