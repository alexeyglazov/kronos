/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */





DepartmentInfo = function(mainAdmin, htmlId, containerHtmlId, displayProperties) {
    this.mainAdmin = mainAdmin;
    this.htmlId = htmlId;
    this.containerHtmlId = containerHtmlId;
    this.displayProperties = displayProperties;
}
DepartmentInfo.prototype.refreshInfo = function() {
    this.showInfo(this.department.id);
}
DepartmentInfo.prototype.showInfo = function(id) {
    var form = this;
    var data = {};
    data.command = "getDepartmentInfo";
    data.id = id;
    $.ajax({
      url: this.mainAdmin.config.endpointUrl,
      data: data,
      cache: false,
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.department = result.department;
            form.subdepartments = result.subdepartments;
            form.path = result.path;
            form.updateDepartmentView();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
DepartmentInfo.prototype.updateDepartmentView = function() {
  var html = '';
  html += '<table><tr><td id="' + this.htmlId + '_layout_path"></td></tr><tr><td id="' + this.htmlId + '_layout_department" colspan="1"></td></tr><tr><td id="' + this.htmlId + '_layout_subdepartments"></td></tr></table>';
  $('#' + this.containerHtmlId).html(html);

   if(this.displayProperties.department != null) {
      var rows = [];
      rows.push({"name": "Name", "property": "name"});
      rows.push({"name": "Code Name", "property": "codeName"});
      rows.push({"name": "Description", "property": "description"});
      rows.push({"name": "Active", "property": "isActive", "visualizer": booleanVisualizer});
      rows.push({"name": "BusinessTrippable", "property": "isBusinessTrippable", "visualizer": booleanVisualizer});
      var controls = [];
      if(this.displayProperties.department.edit) {
        controls.push({"id": "edit", "text": "Edit", "icon": imagePath+"/icons/edit.png", "click": {"handler": this.editDepartment, "context": this}});
      }
      var propertyGrid = new PropertyGrid("admin_department", this.department, rows, "Department", controls);
      propertyGrid.show(this.htmlId + "_layout_department");
   }
   if(this.displayProperties.subdepartments != null) {
      var columns = [];
      columns.push({"name": "Name", "property": "name", "click": {"handler": this.showSubdepartment, "context": this}});
      columns.push({"name": "Code Name", "property": "codeName"});
      columns.push({"name": "Description", "property": "description"});
      columns.push({"name": "Active", "property": "isActive", "visualizer": booleanVisualizer});
      var extraColumns = [];
      if(this.displayProperties.subdepartments["delete"]) {
        extraColumns.push({"name": "Delete", "property": "delete", "text": "Delete",  "click": {"handler": this.deleteSubdepartment, "context": this}});
      }
      var controls = [];
      if(this.displayProperties.subdepartments["create"]) {
        controls.push({"text": "Add", "icon": imagePath+"/icons/add.png", "click": {"handler": this.addSubdepartment, "context": this}});
      }
      var dataGrid = new DataGrid("admin_subdepartments", this.subdepartments, columns, "Subdepartments", controls, extraColumns, "id");
      dataGrid.show(this.htmlId + "_layout_subdepartments");
   }
  var navigation = new Navigation("path", this.htmlId + '_layout_path', this.path, this.mainAdmin.navigationClickHandle, this.mainAdmin);
  navigation.show();
}
DepartmentInfo.prototype.showSubdepartment = function(event) {
  var htmlId=event.currentTarget.id;
  var tmp = htmlId.split("_");
  this.mainAdmin.showSubdepartment(tmp[tmp.length - 1]);
}
DepartmentInfo.prototype.showOffice = function(event) {
  var htmlId=event.currentTarget.id;
  var tmp = htmlId.split("_");
  this.mainAdmin.showOffice(tmp[tmp.length - 1]);
}
DepartmentInfo.prototype.addSubdepartment = function(event) {
   var subdepartmentEditForm = new SubdepartmentEditForm({
        "mode": 'CREATE',
        "id": null,
        "departmentId": this.department.id,
        "name": "",
        "codeName": "",
        "description": "",
        "isActive": true
    }, "subdepartmentEditForm", this.refreshInfo, this);
    subdepartmentEditForm.start();
}
DepartmentInfo.prototype.deleteSubdepartment = function(event) {
  var htmlId=event.currentTarget.id;
  var tmp = htmlId.split("_");
  var subdepartmentId = tmp[tmp.length - 1];
  var subdepartmentDeleteForm = new SubdepartmentDeleteForm(subdepartmentId, this.refreshInfo, this);
  subdepartmentDeleteForm.start();
}
DepartmentInfo.prototype.editDepartment = function(event) {
    var departmentEditForm = new DepartmentEditForm({
        "mode": 'UPDATE',
        "id": this.department.id,
        "officeId": this.department.officeId,
        "name": this.department.name,
        "codeName": this.department.codeName,
        "description": this.department.description,
        "isActive": this.department.isActive,
        "isBusinessTrippable": this.department.isBusinessTrippable
    }, "departmentEditForm", this.refreshInfo, this);
    departmentEditForm.start();
}