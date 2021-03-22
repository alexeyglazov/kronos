/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
function DepartmentEditForm(formData, htmlId, successHandler, successContext) {
    this.config = {
        endpointUrl: endpointsFolder + "DepartmentEditForm.jsp"
    };
    this.htmlId = htmlId;
    this.containerHtmlId = null;
    this.successHandler = successHandler;
    this.successContext = successContext;
    this.disabled = {
        "name": true,
        "codeName": true,
        "description": true,
        "isActive": true,
        "isBusinessTrippable": true
    };
    this.data = {
        "mode": formData.mode,
        "id": formData.id,
        "officeId": formData.officeId,
        "name": formData.name,
        "codeName": formData.codeName,
        "description": formData.description,
        "isActive": formData.isActive,
        "isBusinessTrippable": formData.isBusinessTrippable
    }
}
DepartmentEditForm.prototype.start = function() {
    this.containerHtmlId = getNextPopupHtmlContainer();
    if(this.data.mode == "UPDATE") {
        this.checkDependencies();
    } else {
       this.disabled = {
        "name": false,
        "codeName": false,
        "description": false,
        "isActive": false,
        "isBusinessTrippable": false
       };
       this.show();
    }
    this.dataChanged(false);
}
DepartmentEditForm.prototype.checkDependencies = function() {
    var form = this;
    var data = {};
    data.command = "checkDepartmentDependencies";
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
DepartmentEditForm.prototype.analyzeDependencies = function(dependencies) {
    if(dependencies.subdepartments == 0) {
        this.disabled = {
            "name": false,
            "codeName": false,
            "description": false,
            "isActive": false,
            "isBusinessTrippable": false
        };
        this.show();
    } else {
        var html = 'This Department has dependencies. Only "Active" and "Business Trippable" properties are updatable.<br />';
        html += 'Subdepartments: ' + dependencies.subdepartments + '<br />';
        this.disabled = {
            "name": true,
            "codeName": true,
            "description": true,
            "isActive": false,
            "isBusinessTrippable": false
        };
        doAlert("Dependencies found", html, this, this.show);
    }
}
DepartmentEditForm.prototype.getHtml = function() {
    var html = '';
    html += '<table>';
    html += '<tr><td>Name</td><td><input type="text" id="' + this.htmlId + '_name"></td></tr>';
    html += '<tr><td>Code Name</td><td><input type="text" id="' + this.htmlId + '_codeName"></td></tr>';
    html += '<tr><td>Description</td><td><input type="text" id="' + this.htmlId + '_description"></td></tr>';
    html += '<tr><td>Active</td><td><input type="checkbox" id="' + this.htmlId + '_isActive"></td></tr>';
    html += '<tr><td>Business Trippable</td><td><input type="checkbox" id="' + this.htmlId + '_isBusinessTrippable"></td></tr>';
    html += '</table>';
    return html
}
DepartmentEditForm.prototype.setHandlers = function() {
    var form = this;
    $('#' + this.htmlId + '_name').bind("change", function(event) {form.nameChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_codeName').bind("change", function(event) {form.codeNameChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_description').bind("change", function(event) {form.descriptionChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_isActive').bind("click", function(event) {form.isActiveChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_isBusinessTrippable').bind("click", function(event) {form.isBusinessTrippableChangedHandle.call(form, event);});
}
DepartmentEditForm.prototype.nameChangedHandle = function(event) {
    this.data.name = jQuery.trim(event.currentTarget.value);
    this.updateView();
    this.dataChanged(true);
}
DepartmentEditForm.prototype.codeNameChangedHandle = function(event) {
    this.data.codeName = jQuery.trim(event.currentTarget.value);
    this.updateView();
    this.dataChanged(true);
}
DepartmentEditForm.prototype.descriptionChangedHandle = function(event) {
    this.data.description = jQuery.trim(event.currentTarget.value);
    this.updateView();
    this.dataChanged(true);
}
DepartmentEditForm.prototype.isActiveChangedHandle = function(event) {
    this.data.isActive = $(event.currentTarget).is(':checked');
    this.updateView();
    this.dataChanged(true);
}
DepartmentEditForm.prototype.isBusinessTrippableChangedHandle = function(event) {
    this.data.isBusinessTrippable = $(event.currentTarget).is(':checked');
    this.updateView();
    this.dataChanged(true);
}
DepartmentEditForm.prototype.updateView = function(event) {
    $('#' + this.htmlId + '_name').val(this.data.name);
    $('#' + this.htmlId + '_codeName').val(this.data.codeName);
    $('#' + this.htmlId + '_description').val(this.data.description);
    $('#' + this.htmlId + '_isActive').attr("checked", this.data.isActive);
    $('#' + this.htmlId + '_isBusinessTrippable').attr("checked", this.data.isBusinessTrippable);
    $('#' + this.htmlId + '_name').attr("disabled", this.disabled.name);
    $('#' + this.htmlId + '_codeName').attr("disabled", this.disabled.codeName);
    $('#' + this.htmlId + '_description').attr("disabled", this.disabled.description);
    $('#' + this.htmlId + '_isActive').attr("disabled", this.disabled.isActive);
    $('#' + this.htmlId + '_isBusinessTrippable').attr("disabled", this.disabled.isBusinessTrippable);
}

DepartmentEditForm.prototype.show = function() {
    var title = 'Update Department'
    if(this.data.mode == 'CREATE') {
        title = 'Create Department';
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
DepartmentEditForm.prototype.validate = function() {
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
    //if(this.data.description.length > 255) {
    //    errors.push("Description is too long. It must not exceed 255 characters.");
    //}
    return errors;
}
DepartmentEditForm.prototype.save = function() {
    var errors = this.validate();
    if(errors.length > 0) {
        showErrors(errors);
        return;
    }
    var form = this;
    var data = {};
    data.command = "saveDepartment";
    data.departmentEditForm = getJSON(this.data);
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            doAlert("Info", "Department has been successfully saved", form, form.afterSave);
            form.dataChanged(false);
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
DepartmentEditForm.prototype.afterSave = function() {
    $('#' + this.containerHtmlId).dialog("close");
    this.successHandler.call(this.successContext);
}

DepartmentEditForm.prototype.dataChanged = function(value) {
    dataChanged = value;
}

//==================================================

function DepartmentDeleteForm(departmentId, successHandler, successContext) {
    this.config = {
        endpointUrl: endpointsFolder + "DepartmentEditForm.jsp"
    };
    this.successHandler = successHandler;
    this.successContext = successContext;
    this.data = {
        "id": departmentId
    }
}
DepartmentDeleteForm.prototype.start = function() {
    this.checkDependencies();
}
DepartmentDeleteForm.prototype.checkDependencies = function() {
    var form = this;
    var data = {};
    data.command = "checkDepartmentDependencies";
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
DepartmentDeleteForm.prototype.analyzeDependencies = function(dependencies) {
    if(dependencies.subdepartments == 0) {
        this.show();
    } else {
        var html = 'This Department has dependencies and can not be deleted<br />';
        html += 'Subdepartments: ' + dependencies.subdepartments + '<br />';
        doAlert("Dependencies found", html, null, null);
    }
}
DepartmentDeleteForm.prototype.show = function() {
  doConfirm("Confirm", "Do you really want to delete this Department", this, function() {this.doDeleteDepartment()}, null, null);
}
DepartmentDeleteForm.prototype.doDeleteDepartment = function() {
    var form = this;
    var data = {};
    data.command = "deleteDepartment";
    data.id = this.data.id;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            doAlert("Info", "Department has been successfully deleted", form, form.afterSave);
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
DepartmentDeleteForm.prototype.afterSave = function() {
    this.successHandler.call(this.successContext);
}