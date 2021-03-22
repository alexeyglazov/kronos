/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
function TaskTypeEditForm(formData, htmlId, successHandler, successContext, moduleName) {
    this.config = {
        endpointUrl: endpointsFolder + "TaskTypeEditForm.jsp"
    };
    this.htmlId = htmlId;
    this.containerHtmlId = null;
    this.successHandler = successHandler;
    this.successContext = successContext;
    this.moduleName = moduleName;
    this.disabled = {
        "name": true,
        "isActive": true,
        "isInternal": true
    };
    this.data = {
        "mode": formData.mode,
        "kind": formData.kind,
        "id": formData.id,
        "subdepartmentId": formData.subdepartmentId,
        "name": formData.name,
        "isActive": formData.isActive,
        "isInternal": formData.isInternal
    }
}
TaskTypeEditForm.prototype.start = function() {
    this.containerHtmlId = getNextPopupHtmlContainer();
    if(this.data.mode == "UPDATE") {
        this.checkDependencies();
    } else {
       this.disabled = {
        "name": false,
        "isActive": false,
        "isInternal": false
       };
       this.show();
    }
    this.dataChanged(false);
}
TaskTypeEditForm.prototype.checkDependencies = function() {
    var form = this;
    var data = {};
    data.command = "checkTaskTypeDependencies";
    data.id = this.data.id;
    data.moduleName = this.moduleName;
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
TaskTypeEditForm.prototype.analyzeDependencies = function(dependencies) {
    if(dependencies.tasks == 0) {
        this.disabled = {
            "name": false,
            "isActive": false,
            "isInternal": false
        };
        if(this.data.kind == "COMMON") {
            this.show();
        } else {
            this.show();
        }
    } else {
        var html = 'This Task Type has dependencies. Only "Active" property is updatable.<br />';
        html += 'Tasks: ' + dependencies.tasks + '<br />';
        this.disabled = {
            "name": true,
            "isActive": false,
            "isInternal": true
        };
        doAlert("Dependencies found", html, this, this.show);
    }
}
TaskTypeEditForm.prototype.getHtml = function() {
    var html = '';
    html += '<table>';
    html += '<tr><td>Name</td><td><input type="text" id="' + this.htmlId + '_name"></td></tr>';
    html += '<tr><td>Active</td><td><input type="checkbox" id="' + this.htmlId + '_isActive"></td></tr>';
    html += '<tr><td>Internal</td><td><input type="checkbox" id="' + this.htmlId + '_isInternal"></td></tr>';
    html += '</table>';
    return html
}
TaskTypeEditForm.prototype.setHandlers = function() {
    var form = this;
    $('#' + this.htmlId + '_name').bind("change", function(event) {form.nameChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_isActive').bind("click", function(event) {form.isActiveChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_isInternal').bind("click", function(event) {form.isInternalChangedHandle.call(form, event);});
}
TaskTypeEditForm.prototype.nameChangedHandle = function(event) {
    this.data.name = jQuery.trim(event.currentTarget.value);
    this.updateView();
    this.dataChanged(true);
}
TaskTypeEditForm.prototype.isActiveChangedHandle = function(event) {
    this.data.isActive = $(event.currentTarget).is(':checked');
    this.updateView();
    this.dataChanged(true);
}
TaskTypeEditForm.prototype.isInternalChangedHandle = function(event) {
    this.data.isInternal = $(event.currentTarget).is(':checked');
    this.updateView();
    this.dataChanged(true);
}
TaskTypeEditForm.prototype.updateView = function() {
    $('#' + this.htmlId + '_name').val(this.data.name);
    $('#' + this.htmlId + '_isActive').attr("checked", this.data.isActive);
    $('#' + this.htmlId + '_isInternal').attr("checked", this.data.isInternal);
    $('#' + this.htmlId + '_name').attr("disabled", this.disabled.name);
    $('#' + this.htmlId + '_isActive').attr("disabled", this.disabled.isActive);
    $('#' + this.htmlId + '_isInternal').attr("disabled", this.disabled.isInternal);
    if(this.data.kind == "COMMON") {
        $('#' + this.htmlId + '_isInternal').attr("disabled", true);
    }
}
TaskTypeEditForm.prototype.show = function() {
    var title = 'Update Task Type'
    if(this.data.mode == 'CREATE') {
        title = 'Create Task Type';
    }
    var form = this;
    $('#' + this.containerHtmlId).html(this.getHtml());
    this.setHandlers();
    $('#' + this.containerHtmlId).dialog({
        title: title,
        modal: true,
        position: 'center',
        width: 600,
        height: 300,
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
TaskTypeEditForm.prototype.validate = function() {
    var errors = [];
    if(this.data.name == null || this.data.name == "") {
        errors.push("Name is not set");
    } else {
        if(this.data.kind != "COMMON" && this.data.name.toLowerCase() == "internal") {
            errors.push('Name of subdepartment Task Type can not be equal "Internal"');
        }
    }
    return errors;
}
TaskTypeEditForm.prototype.save = function() {
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
    data.command = "saveTaskType";
    data.taskTypeEditForm = getJSON(this.data);
    data.moduleName = this.moduleName;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            doAlert("Info", "Task Type has been successfully saved", form, form.afterSave);
            form.dataChanged(false);
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
TaskTypeEditForm.prototype.afterSave = function() {
    $('#' + this.containerHtmlId).dialog("close");
    this.successHandler.call(this.successContext);
}

TaskTypeEditForm.prototype.dataChanged = function(value) {
    dataChanged = value;
}


//==================================================

function TaskTypeDeleteForm(taskTypeId, successHandler, successContext) {
    this.config = {
        endpointUrl: endpointsFolder + "TaskTypeEditForm.jsp"
    };
    this.successHandler = successHandler;
    this.successContext = successContext;
    this.data = {
        "id": taskTypeId
    }
}
TaskTypeDeleteForm.prototype.start = function() {
    this.checkDependencies();
}
TaskTypeDeleteForm.prototype.checkDependencies = function() {
    var form = this;
    var data = {};
    data.command = "checkTaskTypeDependencies";
    data.id = this.data.id;
    data.moduleName = this.moduleName;
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
TaskTypeDeleteForm.prototype.analyzeDependencies = function(dependencies) {
    if(dependencies.tasks == 0) {
        this.show();
    } else {
        var html = 'This Task Type has dependencies and can not be deleted<br />';
        html += 'Tasks: ' + dependencies.tasks + '<br />';
         doAlert("Dependencies found", html, null, null);
    }
}
TaskTypeDeleteForm.prototype.show = function() {
  doConfirm("Confirm", "Do you really want to delete this Task Type", this, function() {this.doDeleteTaskType()}, null, null);
}
TaskTypeDeleteForm.prototype.doDeleteTaskType = function() {
    var form = this;
    var data = {};
    data.command = "deleteTaskType";
    data.id = this.data.id;
    data.moduleName = this.moduleName;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            doAlert("Info", "Task Type has been successfully deleted", form, form.afterSave);
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
TaskTypeDeleteForm.prototype.afterSave = function() {
    this.successHandler.call(this.successContext);
}