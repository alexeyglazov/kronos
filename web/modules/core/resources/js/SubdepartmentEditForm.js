/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
function SubdepartmentEditForm(formData, htmlId, successHandler, successContext) {
    this.config = {
        endpointUrl: endpointsFolder + "SubdepartmentEditForm.jsp"
    };
    this.htmlId = htmlId;
    this.containerHtmlId = null;
    this.successHandler = successHandler;
    this.successContext = successContext;
    this.disabled = {
        "name": true,
        "codeName": true,
        "description": true,
        "isActive": true
    };
    this.data = {
        "mode": formData.mode,
        "id": formData.id,
        "departmentId": formData.departmentId,
        "name": formData.name,
        "codeName": formData.codeName,
        "description": formData.description,
        "isActive": formData.isActive
    }
}
SubdepartmentEditForm.prototype.start = function() {
    this.containerHtmlId = getNextPopupHtmlContainer();
    if(this.data.mode == "UPDATE") {
        this.checkDependencies();
    } else {
       this.disabled = {
        "name": false,
        "codeName": false,
        "description": false,
        "isActive": false
       };
       this.show();
    }
    this.dataChanged(false);
}
SubdepartmentEditForm.prototype.checkDependencies = function() {
    var form = this;
    var data = {};
    data.command = "checkSubdepartmentDependencies";
    data.id = this.data.id;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.analyzeDependencies(result);
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
SubdepartmentEditForm.prototype.analyzeDependencies = function(dependencies) {
    if(dependencies.positions == 0 && dependencies.activities == 0 && dependencies.projectCodes == 0 && dependencies.taskTypes == 0) {
        this.disabled = {
            "name": false,
            "codeName": false,
            "description": false,
            "isActive": false
        };
        this.show();
    } else {
        var html = 'This Subdepartment has dependencies. Only "Active" property is updatable.<br />';
        html += 'Positions: ' + dependencies.positions + '<br />';
        html += 'Activities: ' + dependencies.activities + '<br />';
        html += 'Project Codes: ' + dependencies.projectCodes + '<br />';
        html += 'Task Types: ' + dependencies.taskTypes + '<br />';
        this.disabled = {
            "name": true,
            "codeName": true,
            "description": true,
            "isActive": false
        };
        doAlert("Dependencies found", html, this, this.show);
    }
}
SubdepartmentEditForm.prototype.getHtml = function() {
    var html = '';
    html += '<table>';
    html += '<tr><td>Name</td><td><input type="text" id="' + this.htmlId + '_name"></td></tr>';
    html += '<tr><td>Code Name</td><td><input type="text" id="' + this.htmlId + '_codeName"></td></tr>';
    html += '<tr><td>Description</td><td><input type="text" id="' + this.htmlId + '_description"></td></tr>';
    html += '<tr><td>Active</td><td><input type="checkbox" id="' + this.htmlId + '_isActive"></td></tr>';
    html += '</table>';
    return html
}
SubdepartmentEditForm.prototype.setHandlers = function() {
    var form = this;
    $('#' + this.htmlId + '_name').bind("change", function(event) {form.nameChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_codeName').bind("change", function(event) {form.codeNameChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_description').bind("change", function(event) {form.descriptionChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_isActive').bind("click", function(event) {form.isActiveChangedHandle.call(form, event);});
}
SubdepartmentEditForm.prototype.nameChangedHandle = function(event) {
    this.data.name = jQuery.trim(event.currentTarget.value);
    this.updateView();
    this.dataChanged(true);
}
SubdepartmentEditForm.prototype.codeNameChangedHandle = function(event) {
    this.data.codeName = jQuery.trim(event.currentTarget.value);
    this.updateView();
    this.dataChanged(true);
}
SubdepartmentEditForm.prototype.descriptionChangedHandle = function(event) {
    this.data.description = jQuery.trim(event.currentTarget.value);
    this.updateView();
    this.dataChanged(true);
}
SubdepartmentEditForm.prototype.isActiveChangedHandle = function(event) {
    this.data.isActive = $(event.currentTarget).is(':checked');
    this.updateView();
    this.dataChanged(true);
}
SubdepartmentEditForm.prototype.updateView = function(event) {
    $('#' + this.htmlId + '_name').val(this.data.name);
    $('#' + this.htmlId + '_codeName').val(this.data.codeName);
    $('#' + this.htmlId + '_description').val(this.data.description);
    $('#' + this.htmlId + '_isActive').attr("checked", this.data.isActive);
    $('#' + this.htmlId + '_name').attr("disabled", this.disabled.name);
    $('#' + this.htmlId + '_codeName').attr("disabled", this.disabled.codeName);
    $('#' + this.htmlId + '_description').attr("disabled", this.disabled.description);
    $('#' + this.htmlId + '_isActive').attr("disabled", this.disabled.isActive);
}

SubdepartmentEditForm.prototype.show = function() {
    var title = 'Update Subdepartment'
    if(this.data.mode == 'CREATE') {
        title = 'Create Subdepartment';
    }
    var form = this;
    $('#' + this.containerHtmlId).html(this.getHtml());
    this.setHandlers();
    $('#' + this.containerHtmlId).dialog({
        title: title,
        modal: true,
        position: 'center',
        width: 400,
        height: 250,
        buttons: {
            Ok: function() {
                form.save();
            },
            Cancel: function() {
                $(this).dialog( "close" );
                form.dataChanged(false);
            }
	},
        close: function(event, ui) {
            releasePopupLayer();
        } 
    });
    this.updateView();
}
SubdepartmentEditForm.prototype.validate = function() {
    var errors = [];
    var nameRE = /^[a-zA-Z0-9-+&]*/;
    var codeNameRE = /^[A-Z0-9-+&]*$/;
    if(this.data.name == null || this.data.name == "") {
        errors.push("Name is not set");
    } else if(!nameRE.test(this.data.name)) {
      errors.push("Name has incorrect format. Letters, numerals, +, -, & are allowed only.");
    }

    if(this.data.codeName == null || this.data.codeName == "") {
        errors.push("Code Name is not set");
    } else if(!codeNameRE.test(this.data.codeName)) {
      errors.push("Code Name has incorrect format. Capital letters, numerals, +, -, & are allowed only.");
    }
    if(this.data.description.length > 255) {
        errors.push("Description is too long. It must not exceed 255 characters.");
    }
    return errors;
}
SubdepartmentEditForm.prototype.save = function() {
    var errors = this.validate();
    if(errors.length > 0) {
        var message = "";
        for(var key in errors) {
            message += errors[key] + "<br />";
        }
        doAlert("Validation error", message, null, null);
        return;
    }
    var form = this;
    var data = {};
    data.command = "saveSubdepartment";
    data.subdepartmentEditForm = getJSON(this.data);
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            doAlert("Info", "Subdepartment has been successfully saved", form, form.afterSave);
            form.dataChanged(false);
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
SubdepartmentEditForm.prototype.afterSave = function() {
    $('#' + this.containerHtmlId).dialog("close");
    this.successHandler.call(this.successContext);
}

SubdepartmentEditForm.prototype.dataChanged = function(value) {
    dataChanged = value;
}



//==================================================

function SubdepartmentDeleteForm(subdepartmentId, successHandler, successContext) {
    this.config = {
        endpointUrl: endpointsFolder + "SubdepartmentEditForm.jsp"
    };
    this.successHandler = successHandler;
    this.successContext = successContext;
    this.data = {
        "id": subdepartmentId
    }
}
SubdepartmentDeleteForm.prototype.start = function() {
    this.checkDependencies();
}
SubdepartmentDeleteForm.prototype.checkDependencies = function() {
    var form = this;
    var data = {};
    data.command = "checkSubdepartmentDependencies";
    data.id = this.data.id;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.analyzeDependencies(result);
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
SubdepartmentDeleteForm.prototype.analyzeDependencies = function(dependencies) {
    if(
        dependencies.positions == 0 &&
        dependencies.activities == 0 &&
        dependencies.projectCodes == 0 &&
        dependencies.taskTypes == 0 &&
        dependencies.rightsItems == 0 &&
        dependencies.standardSellingRateGroups == 0 &&
        dependencies.standardCostGroups == 0 &&
        dependencies.employeeSubdepartmentHistoryItems == 0
    ) {
        this.show();
    } else {
        var html = 'This Subdepartment has dependencies and can not be deleted<br />';
        html += 'Positions: ' + dependencies.positions + '<br />';
        html += 'Activities: ' + dependencies.activities + '<br />';
        html += 'Project Codes: ' + dependencies.projectCodes + '<br />';
        html += 'Task Types: ' + dependencies.taskTypes + '<br />';
        html += 'Rights Items: ' + dependencies.rightsItems + '<br />';
        html += 'Standard Selling Rate Groups: ' + dependencies.standardSellingRateGroups + '<br />';
        html += 'Standard Cost Groups: ' + dependencies.standardCostGroups + '<br />';
        html += 'Employee Subdepartment History Items: ' + dependencies.employeeSubdepartmentHistoryItems + '<br />';
        doAlert("Dependencies found", html, null, null);
    }
}
SubdepartmentDeleteForm.prototype.show = function() {
  doConfirm("Confirm", "Do you really want to delete this Subdepartment", this, function() {this.doDeleteSubdepartment()}, null, null);
}
SubdepartmentDeleteForm.prototype.doDeleteSubdepartment = function() {
    var form = this;
    var data = {};
    data.command = "deleteSubdepartment";
    data.id = this.data.id;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            doAlert("Info", "Subdepartment has been successfully deleted", form, form.afterSave);
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
SubdepartmentDeleteForm.prototype.afterSave = function() {
    this.successHandler.call(this.successContext);
}