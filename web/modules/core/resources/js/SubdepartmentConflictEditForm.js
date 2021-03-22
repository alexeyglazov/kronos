/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
function SubdepartmentConflictEditForm(formData, htmlId, successHandler, successContext) {
    this.config = {
        endpointUrl: endpointsFolder+ "SubdepartmentConflictEditForm.jsp"
    };
    this.htmlId = htmlId;
    this.containerHtmlId = null;
    this.moduleName = "Clients";
    this.successHandler = successHandler;
    this.successContext = successContext;
    this.loaded = {
        subdepartments: []
    }
    this.data = {
        "mode": formData.mode,
        "id": formData.id,
        "checkingSubdepartmentId": formData.checkingSubdepartmentId,
        "checkedSubdepartmentId": formData.checkedSubdepartmentId
    }
}
SubdepartmentConflictEditForm.prototype.init = function() {
    this.containerHtmlId = getNextPopupHtmlContainer();
    this.loadInitialContent();
    this.dataChanged(false);
}
SubdepartmentConflictEditForm.prototype.loadInitialContent = function() {
    var form = this;
    var data = {};
    data.command = "getInitialContent";
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.subdepartments = result.subdepartments;
            form.show();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
SubdepartmentConflictEditForm.prototype.getHtml = function() {
    var html = '';
    html += '<table>';
    html += '<tr>';
    html += '<td><span class="label1">Checking subdepartment</span></td>';
    html += '<td><select id="' + this.htmlId + '_checkingSubdepartment"></select></td>';
    html += '</tr>';
    html += '<tr>';
    html += '<td><span class="label1">Checked subdepartment</span></td>';
    html += '<td><select id="' + this.htmlId + '_checkedSubdepartment"></select></td>';
    html += '</tr>';
    html += '</table>';
    return html;
}
SubdepartmentConflictEditForm.prototype.setHandlers = function() {
    var form = this;
    $('#' + this.htmlId + '_checkingSubdepartment').bind("change", function(event) {form.checkingSubdepartmentChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_checkedSubdepartment').bind("change", function(event) {form.checkedSubdepartmentChangedHandle.call(form, event);});
}

SubdepartmentConflictEditForm.prototype.checkingSubdepartmentChangedHandle = function(event) {
    var idTxt = $('#' + this.htmlId + '_checkingSubdepartment').val();
    if(idTxt == '') {
        this.data.checkingSubdepartmentId = null;
    } else {
        this.data.checkingSubdepartmentId = parseInt(idTxt);
    }
    this.updateCheckingSubdepartmentView();
}
SubdepartmentConflictEditForm.prototype.checkedSubdepartmentChangedHandle = function(event) {
    var idTxt = $('#' + this.htmlId + '_checkedSubdepartment').val();
    if(idTxt == '') {
        this.data.checkedSubdepartmentId = null;
    } else {
        this.data.checkedSubdepartmentId = parseInt(idTxt);
    }
    this.updateCheckedSubdepartmentView();
}

SubdepartmentConflictEditForm.prototype.updateView = function() {
    this.updateCheckingSubdepartmentView();
    this.updateCheckedSubdepartmentView();
}
SubdepartmentConflictEditForm.prototype.updateCheckedSubdepartmentView = function() {
    var html = "";
    html += '<option value="">...</option>';
    for(var key in this.loaded.subdepartments) {
        var subdepartment = this.loaded.subdepartments[key];
        var isSelected = "";
        if(subdepartment.subdepartmentId == this.data.checkedSubdepartmentId) {
           isSelected = "selected";
        }
        html += '<option value="'+ subdepartment.subdepartmentId +'" ' + isSelected + '>' + subdepartment.officeName + '/' + subdepartment.departmentName + '/' + subdepartment.subdepartmentName + '</option>';
    }
    $('#' + this.htmlId + '_checkedSubdepartment').html(html); 
}
SubdepartmentConflictEditForm.prototype.updateCheckingSubdepartmentView = function() {
    var html = "";
    html += '<option value="">...</option>';
    for(var key in this.loaded.subdepartments) {
        var subdepartment = this.loaded.subdepartments[key];
        var isSelected = "";
        if(subdepartment.subdepartmentId == this.data.checkingSubdepartmentId) {
           isSelected = "selected";
        }
        html += '<option value="'+ subdepartment.subdepartmentId +'" ' + isSelected + '>' + subdepartment.officeName + '/' + subdepartment.departmentName + '/' + subdepartment.subdepartmentName + '</option>';
    }
    $('#' + this.htmlId + '_checkingSubdepartment').html(html); 
}

SubdepartmentConflictEditForm.prototype.show = function() {
    var title = 'Update Subdepartment Conflict';
    if(this.data.mode == 'CREATE') {
        title = 'Create Subdepartment Conflict';
    }    
    var form = this;
    $('#' + this.containerHtmlId).html(this.getHtml());
    this.setHandlers();
    $('#' + this.containerHtmlId).dialog({
        title: title,
        modal: true,
        position: 'center',
        width: 600,
        height: 200,
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
SubdepartmentConflictEditForm.prototype.validate = function() {
    var errors = [];
    var emailRE = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if(this.data.checkingSubdepartmentId == null) {
        errors.push("Checking subdepartment is not set");
    }
    if(this.data.checkedSubdepartmentId == null) {
        errors.push("Checked subdepartment is not set");
    }
    if(this.data.checkingSubdepartmentId != null && this.data.checkedSubdepartmentId != null && this.data.checkingSubdepartmentId == this.data.checkedSubdepartmentId) {
        errors.push("Checking subdepartment is the same as Checked subdepartment");
    }
    return errors;
}
SubdepartmentConflictEditForm.prototype.save = function() {
    var errors = this.validate();
    if(errors.length > 0) {
        showErrors(errors);
        return;
    }
    var serverFormData = clone(this.data);

    var form = this;
    var data = {};
    data.command = "saveSubdepartmentConflict";
    data.subdepartmentConflictEditForm = getJSON(serverFormData);
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            doAlert("Info", "Subdepartment Conflict has been successfully saved", form, form.afterSave);
            form.dataChanged(false);
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
SubdepartmentConflictEditForm.prototype.afterSave = function() {
    $('#' + this.containerHtmlId).dialog("close");
    this.successHandler.call(this.successContext);
}
SubdepartmentConflictEditForm.prototype.dataChanged = function(value) {
    dataChanged = value;
}





//==================================================

function SubdepartmentConflictDeleteForm(subdepartmentConflictId, successHandler, successContext) {
    this.config = {
        endpointUrl: endpointsFolder+ "SubdepartmentConflictEditForm.jsp"
    };
    this.successHandler = successHandler;
    this.successContext = successContext;
    this.data = {
        "id": subdepartmentConflictId
    }
}
SubdepartmentConflictDeleteForm.prototype.init = function() {
    //this.checkDependencies();
    this.show();
}
SubdepartmentConflictDeleteForm.prototype.checkDependencies = function() {
    var form = this;
    var data = {};
    data.command = "checkSubdepartmentConflictIdDependencies";
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
SubdepartmentConflictDeleteForm.prototype.analyzeDependencies = function(dependencies) {
    //if(dependencies.projectCodes == 0) {
        this.show();
    //} else {
    //    var html = 'This EmployeeContactLink has dependencies and can not be deleted<br />';
    //    html += 'EmployeeContactLinks: ' + dependencies.projectCodes + '<br />';
    //    doAlert("Dependencies found", html, null, null);
    //}
}
SubdepartmentConflictDeleteForm.prototype.show = function() {
  doConfirm("Confirm", "Proceed with deletion this Subdepartment Conflict", this, function() {this.doDeleteSubdepartmentConflict()}, null, null);
}
SubdepartmentConflictDeleteForm.prototype.doDeleteSubdepartmentConflict = function() {
    var form = this;
    var data = {};
    data.command = "deleteSubdepartmentConflict";
    data.id = this.data.id;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function() {
            doAlert("Info", "Subdepartment Conflict has been successfully deleted", form, form.afterSave);
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
SubdepartmentConflictDeleteForm.prototype.afterSave = function() {
    this.successHandler.call(this.successContext);
}