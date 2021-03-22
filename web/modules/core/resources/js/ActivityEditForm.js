/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
function ActivityEditForm(formData, htmlId, successHandler, successContext) {
    this.config = {
        endpointUrl: endpointsFolder+ "ActivityEditForm.jsp"
    };
    this.htmlId = htmlId;
    this.containerHtmlId = null;
    this.successHandler = successHandler;
    this.successContext = successContext;
    this.data = {
        "mode": formData.mode,
        "id": formData.id,
        "subdepartmentId": formData.subdepartmentId,
        "name": formData.name,
        "codeName": formData.codeName,
        "isActive": formData.isActive,
        "isConflictCheck": formData.isConflictCheck
    }
}
ActivityEditForm.prototype.start = function() {
    this.containerHtmlId = getNextPopupHtmlContainer();
    if(this.data.mode == "UPDATE") {
        this.checkDependencies();
    } else {
       this.show();
    }
    this.dataChanged(false);
}
ActivityEditForm.prototype.checkDependencies = function() {
    var form = this;
    var data = {};
    data.command = "checkActivityDependencies";
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
ActivityEditForm.prototype.analyzeDependencies = function(dependencies) {
    if(dependencies.projectCodes == 0) {
        this.show();
    } else {
        var html = 'This Activity has dependencies<br />';
        html += 'Project Codes: ' + dependencies.projectCodes + '<br />';
        html += 'Proceed with update?';
        doConfirm("Dependencies found", html, this, this.show, null, null);
    }
}
ActivityEditForm.prototype.getHtml = function() {
    var html = '';
    html += '<table>';
    html += '<tr><td>Name</td><td><input type="text" id="' + this.htmlId + '_name"></td></tr>';
    html += '<tr><td>Code Name</td><td><input type="text" id="' + this.htmlId + '_codeName"></td></tr>';
    html += '<tr><td>Active</td><td><input type="checkbox" id="' + this.htmlId + '_isActive"></td></tr>';
    html += '<tr><td>Conflict check</td><td><input type="checkbox" id="' + this.htmlId + '_isConflictCheck"></td></tr>';
    html += '</table>';
    return html
}
ActivityEditForm.prototype.setHandlers = function() {
    var form = this;
    $('#' + this.htmlId + '_name').bind("change", function(event) {form.nameChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_codeName').bind("change", function(event) {form.codeNameChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_isActive').bind("click", function(event) {form.isActiveChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_isConflictCheck').bind("click", function(event) {form.isConflictCheckChangedHandle.call(form, event);});
}
ActivityEditForm.prototype.nameChangedHandle = function(event) {
    this.data.name = jQuery.trim(event.currentTarget.value);
    this.updateView();
    this.dataChanged(true);
}
ActivityEditForm.prototype.codeNameChangedHandle = function(event) {
    this.data.codeName = jQuery.trim(event.currentTarget.value);
    this.updateView();
    this.dataChanged(true);
}
ActivityEditForm.prototype.isActiveChangedHandle = function(event) {
    this.data.isActive = $(event.currentTarget).is(':checked');
    this.updateView();
    this.dataChanged(true);
}
ActivityEditForm.prototype.isConflictCheckChangedHandle = function(event) {
    this.data.isConflictCheck = $(event.currentTarget).is(':checked');
    this.updateView();
    this.dataChanged(true);
}
ActivityEditForm.prototype.updateView = function(event) {
    $('#' + this.htmlId + '_name').val(this.data.name);
    $('#' + this.htmlId + '_codeName').val(this.data.codeName);
    if(this.data.mode == 'UPDATE') {
        $('#' + this.htmlId + '_codeName').attr("disabled", true);
    } else { 
        $('#' + this.htmlId + '_codeName').attr("disabled", false);
    }
    $('#' + this.htmlId + '_isActive').attr("checked", this.data.isActive);
    $('#' + this.htmlId + '_isConflictCheck').attr("checked", this.data.isConflictCheck);
}

ActivityEditForm.prototype.show = function() {
    var title = 'Update Activity'
    if(this.data.mode == 'CREATE') {
        title = 'Create Activity';
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
        height: 600,
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
ActivityEditForm.prototype.validate = function() {
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
    return errors;
}
ActivityEditForm.prototype.save = function() {
    var errors = this.validate();
    if(errors.length > 0) {
        showErrors(errors);
        return;
    }
    var form = this;
    var data = {};
    data.command = "saveActivity";
    data.activityEditForm = getJSON(this.data);
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function() {
            doAlert("Info", "Activity has been successfully saved", form, form.afterSave);
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
ActivityEditForm.prototype.afterSave = function() {
    this.dataChanged(false);
    $('#' + this.containerHtmlId).dialog("close");
    this.successHandler.call(this.successContext);
}
ActivityEditForm.prototype.dataChanged = function(value) {
    dataChanged = value;
}



//==================================================

function ActivityDeleteForm(activityId, successHandler, successContext) {
    this.config = {
        endpointUrl: endpointsFolder+ "ActivityEditForm.jsp"
    };
    this.successHandler = successHandler;
    this.successContext = successContext;
    this.data = {
        "id": activityId
    }
}
ActivityDeleteForm.prototype.start = function() {
    this.checkDependencies();
}
ActivityDeleteForm.prototype.checkDependencies = function() {
    var form = this;
    var data = {};
    data.command = "checkActivityDependencies";
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
ActivityDeleteForm.prototype.analyzeDependencies = function(dependencies) {
    if(dependencies.projectCodes == 0) {
        this.show();
    } else {
        var html = 'This Activity has dependencies and can not be deleted<br />';
        html += 'Project Codes: ' + dependencies.projectCodes + '<br />';
        doAlert("Dependencies found", html, null, null);
    }
}
ActivityDeleteForm.prototype.show = function() {
  doConfirm("Confirm", "Do you really want to delete this Activity", this, function() {this.doDeleteActivity()}, null, null);
}
ActivityDeleteForm.prototype.doDeleteActivity = function() {
    var form = this;
    var data = {};
    data.command = "deleteActivity";
    data.id = this.data.id;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function() {
            doAlert("Info", "Activity has been successfully deleted", form, form.afterSave);
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
ActivityDeleteForm.prototype.afterSave = function() {
    this.successHandler.call(this.successContext);
}