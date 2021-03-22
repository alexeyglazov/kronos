/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
function TaskEditForm(formData, htmlId, successHandler, successContext) {
    this.config = {
        endpointUrl: endpointsFolder + "TaskEditForm.jsp"
    };
    this.htmlId = htmlId;
    this.containerHtmlId = null;
    this.successHandler = successHandler;
    this.successContext = successContext;
    this.disabled = {
        "name": true,
        "isActive": true,
        "isTraining": true,
        "description": true
    };
    this.data = {
        "mode": formData.mode,
        "id": formData.id,
        "taskTypeId": formData.taskTypeId,
        "name": formData.name,
        "isActive": formData.isActive,
        "isIdle": formData.isIdle,
        "isTraining": formData.isTraining,
        "description": formData.description
    }
}
TaskEditForm.prototype.start = function() {
    this.containerHtmlId = getNextPopupHtmlContainer();
    if(this.data.mode == "UPDATE") {
        this.checkDependencies();
    } else {
       this.disabled = {
        "name": false,
        "isActive": false,
        "isIdle": false,
        "isTraining": false,
        "description": false
       };
       this.show();
    }
    this.dataChanged(false);
}
TaskEditForm.prototype.checkDependencies = function() {
    var form = this;
    var data = {};
    data.command = "checkTaskDependencies";
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
TaskEditForm.prototype.analyzeDependencies = function(dependencies) {
    if(dependencies.timeSpentItems == 0) {
        this.disabled = {
            "name": false,
            "isActive": false,
            "isIdle": false,
            "isTraining": false,
            "description": false
        };
        this.show();
    } else {
        var html = 'This Task has dependencies. Only "Active" "Training" and "Description" properties are updatable.<br />';
        html += 'Time Spent Items: ' + dependencies.timeSpentItems + '<br />';
        this.disabled = {
            "name": true,
            "isActive": false,
            "isIdle": true,
            "isTraining": false,
            "description": false
        };
        doAlert("Dependencies found", html, this, this.show);
    }
}
TaskEditForm.prototype.getHtml = function() {
    var html = '';
    html += '<table>';
    html += '<tr><td><span class="label1">Name</span></td><td><input type="text" id="' + this.htmlId + '_name"></td></tr>';
    html += '<tr><td><span class="label1">Active</span></td><td><input type="checkbox" id="' + this.htmlId + '_isActive"></td></tr>';
    html += '<tr><td><span class="label1">Idle</span></td><td><input type="checkbox" id="' + this.htmlId + '_isIdle"></td></tr>';
    html += '<tr><td><span class="label1">Training</span></td><td><input type="checkbox" id="' + this.htmlId + '_isTraining"></td></tr>';
    html += '<tr><td><span class="label1">Description</span></td><td><textarea id="' + this.htmlId + '_description" style="width: 200px; height: 100px;"></textarea></td></tr>';
    html += '</table>';
    return html;
}
TaskEditForm.prototype.setHandlers = function() {
    var form = this;
    $('#' + this.htmlId + '_name').bind("change", function(event) {form.nameChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_isActive').bind("click", function(event) {form.isActiveChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_isIdle').bind("click", function(event) {form.isIdleChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_isTraining').bind("click", function(event) {form.isTrainingChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_description').bind("change", function(event) {form.descriptionChangedHandle.call(form, event);});
}
TaskEditForm.prototype.nameChangedHandle = function(event) {
    this.data.name = jQuery.trim(event.currentTarget.value);
    this.updateView();
    this.dataChanged(true);
}
TaskEditForm.prototype.isActiveChangedHandle = function(event) {
    this.data.isActive = $(event.currentTarget).is(':checked');
    this.updateView();
    this.dataChanged(true);
}
TaskEditForm.prototype.isIdleChangedHandle = function(event) {
    this.data.isIdle = $(event.currentTarget).is(':checked');
    this.updateView();
    this.dataChanged(true);
}
TaskEditForm.prototype.isTrainingChangedHandle = function(event) {
    this.data.isTraining = $(event.currentTarget).is(':checked');
    this.updateView();
    this.dataChanged(true);
}
TaskEditForm.prototype.descriptionChangedHandle = function(event) {
    this.data.description = jQuery.trim(event.currentTarget.value);
    this.updateView();
    this.dataChanged(true);
}

TaskEditForm.prototype.updateView = function(event) {
    $('#' + this.htmlId + '_name').val(this.data.name);
    $('#' + this.htmlId + '_isActive').prop("checked", this.data.isActive);
    $('#' + this.htmlId + '_isIdle').prop("checked", this.data.isIdle);
    $('#' + this.htmlId + '_isTraining').prop("checked", this.data.isTraining);
    $('#' + this.htmlId + '_description').html(this.data.description);
    $('#' + this.htmlId + '_name').attr("disabled", this.disabled.name);
    $('#' + this.htmlId + '_isActive').attr("disabled", this.disabled.isActive);
    $('#' + this.htmlId + '_isIdle').attr("disabled", this.disabled.isIdle);
    $('#' + this.htmlId + '_isTraining').attr("disabled", this.disabled.isTraining);
    $('#' + this.htmlId + '_description').attr("disabled", this.disabled.description);
}
TaskEditForm.prototype.show = function() {
    var title = 'Update Task'
    if(this.data.mode == 'CREATE') {
        title = 'Create Task';
    }
    var form = this;
    $('#' + this.containerHtmlId).html(this.getHtml());
    this.updateView();
    this.setHandlers();
    $('#' + this.containerHtmlId).dialog({
        title: title,
        modal: true,
        position: 'center',
        width: 600,
        height: 400,
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
}
TaskEditForm.prototype.validate = function() {
    var errors = [];
    if(this.data.name == null || this.data.name == "") {
        errors.push("Name is not set");
    }
    if(this.data.description == null || this.data.description == "") {
        errors.push("Description is not set");
    } else if (this.data.description.length > 1024) {
        errors.push("Description is too long");
    }
    return errors;
}
TaskEditForm.prototype.save = function() {
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
    data.command = "saveTask";
    data.taskEditForm = getJSON(this.data);
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            doAlert("Info", "Task has been successfully saved", form, form.afterSave);
            form.dataChanged(false);
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
TaskEditForm.prototype.afterSave = function() {
    $('#' + this.containerHtmlId).dialog("close");
    this.successHandler.call(this.successContext);
}

TaskEditForm.prototype.dataChanged = function(value) {
    dataChanged = value;
}




//==================================================

function TaskDeleteForm(taskId, successHandler, successContext) {
    this.config = {
        endpointUrl: endpointsFolder + "TaskEditForm.jsp"
    };
    this.successHandler = successHandler;
    this.successContext = successContext;
    this.data = {
        "id": taskId
    }
}
TaskDeleteForm.prototype.start = function() {
    this.checkDependencies();
}
TaskDeleteForm.prototype.checkDependencies = function() {
    var form = this;
    var data = {};
    data.command = "checkTaskDependencies";
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
TaskDeleteForm.prototype.analyzeDependencies = function(dependencies) {
    if(dependencies.timeSpentItems == 0) {
        this.show();
    } else {
        var html = 'This Task has dependencies and can not be deleted<br />';
        html += 'Time Spent Items: ' + dependencies.timeSpentItems + '<br />';
         doAlert("Dependencies found", html, null, null);
    }
}
TaskDeleteForm.prototype.show = function() {
  doConfirm("Confirm", "Do you really want to delete this Task", this, function() {this.doDeleteTask()}, null, null);
}
TaskDeleteForm.prototype.doDeleteTask = function() {
    var form = this;
    var data = {};
    data.command = "deleteTask";
    data.id = this.data.id;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            doAlert("Info", "Task has been successfully deleted", form, form.afterSave);
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
TaskDeleteForm.prototype.afterSave = function() {
    this.successHandler.call(this.successContext);
}