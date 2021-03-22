/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
function ModuleEditForm(formData, htmlId, successHandler, successContext) {
    this.config = {
        endpointUrl: endpointsFolder + "ModuleEditForm.jsp"
    };
    this.htmlId = htmlId;
    this.containerHtmlId = null;
    this.successHandler = successHandler;
    this.successContext = successContext;
    this.disabled = {
        "name": true,
        "discription": true,
        "isReport": true
    };
    this.data = {
        "mode": formData.mode,
        "id": formData.id,
        "name": formData.name,
        "description": formData.description,
        "isReport": formData.isReport
    }
}
ModuleEditForm.prototype.start = function() {
    this.containerHtmlId = getNextPopupHtmlContainer();
    //if(this.data.mode == "UPDATE") {
    //    this.checkDependencies();
    //} else {
       this.disabled = {
        "name": false,
        "description": false,
        "isReport": false
       };
       this.show();
    //}
    this.dataChanged(false);
}
ModuleEditForm.prototype.checkDependencies = function() {
    var form = this;
    var data = {};
    data.command = "checkModuleDependencies";
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
ModuleEditForm.prototype.analyzeDependencies = function(dependencies) {
    if(dependencies.rightsItems == 0) {
        this.disabled = {
            "name": false,
            "description": false,
            "isReport": false
        };
        this.show();
    } else {
        var html = 'This Module has dependencies. Only "Description" properties are updatable.<br />';
        html += 'Time Spent Items: ' + dependencies.rightsItems + '<br />';
        this.disabled = {
            "name": true,
            "description": false,
            "isReport": true
        };
        doAlert("Dependencies found", html, this, this.show);
    }
}
ModuleEditForm.prototype.getHtml = function() {
    var html = '';
    html += '<table>';
    html += '<tr><td><span class="label1">Name</span></td><td><input type="text" id="' + this.htmlId + '_name"></td></tr>';
    html += '<tr><td><span class="label1">Description</span></td><td><textarea id="' + this.htmlId + '_description" style="width: 200px; height: 100px;"></textarea></td></tr>';
    html += '<tr><td><span class="label1">isReport</span></td><td><input type="checkbox" id="' + this.htmlId + '_isReport"></td></tr>';
    html += '</table>';
    return html;
}
ModuleEditForm.prototype.setHandlers = function() {
    var form = this;
    $('#' + this.htmlId + '_name').bind("change", function(event) {form.nameChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_isReport').bind("click", function(event) {form.isReportChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_description').bind("change", function(event) {form.descriptionChangedHandle.call(form, event);});
}
ModuleEditForm.prototype.nameChangedHandle = function(event) {
    this.data.name = jQuery.trim(event.currentTarget.value);
    this.updateView();
    this.dataChanged(true);
}
ModuleEditForm.prototype.isReportChangedHandle = function(event) {
    this.data.isReport = $(event.currentTarget).is(':checked');
    this.updateView();
    this.dataChanged(true);
}
ModuleEditForm.prototype.descriptionChangedHandle = function(event) {
    this.data.description = jQuery.trim(event.currentTarget.value);
    this.updateView();
    this.dataChanged(true);
}

ModuleEditForm.prototype.updateView = function(event) {
    $('#' + this.htmlId + '_name').val(this.data.name);
    $('#' + this.htmlId + '_isReport').prop("checked", this.data.isReport);
    $('#' + this.htmlId + '_description').html(this.data.description);
    $('#' + this.htmlId + '_name').attr("disabled", this.disabled.name);
    $('#' + this.htmlId + '_isReport').attr("disabled", this.disabled.isReport);
    $('#' + this.htmlId + '_description').attr("disabled", this.disabled.description);
}
ModuleEditForm.prototype.show = function() {
    var title = 'Update Module'
    if(this.data.mode == 'CREATE') {
        title = 'Create Module';
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
ModuleEditForm.prototype.validate = function() {
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
ModuleEditForm.prototype.save = function() {
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
    data.command = "saveModule";
    data.moduleEditForm = getJSON(this.data);
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            doAlert("Info", "Module has been successfully saved", form, form.afterSave);
            form.dataChanged(false);
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
ModuleEditForm.prototype.afterSave = function() {
    $('#' + this.containerHtmlId).dialog("close");
    this.successHandler.call(this.successContext);
}

ModuleEditForm.prototype.dataChanged = function(value) {
    dataChanged = value;
}




//==================================================

function ModuleDeleteForm(moduleId, successHandler, successContext) {
    this.config = {
        endpointUrl: endpointsFolder + "ModuleEditForm.jsp"
    };
    this.successHandler = successHandler;
    this.successContext = successContext;
    this.data = {
        "id": moduleId
    }
}
ModuleDeleteForm.prototype.start = function() {
    this.checkDependencies();
}
ModuleDeleteForm.prototype.checkDependencies = function() {
    var form = this;
    var data = {};
    data.command = "checkModuleDependencies";
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
ModuleDeleteForm.prototype.analyzeDependencies = function(dependencies) {
    if(dependencies.rightsItems == 0) {
        this.show();
    } else {
        var html = 'This Module has dependencies and can not be deleted<br />';
        html += 'Rights Items: ' + dependencies.rightsItems + '<br />';
         doAlert("Dependencies found", html, null, null);
    }
}
ModuleDeleteForm.prototype.show = function() {
  doConfirm("Confirm", "Do you really want to delete this Module", this, function() {this.doDeleteModule()}, null, null);
}
ModuleDeleteForm.prototype.doDeleteModule = function() {
    var form = this;
    var data = {};
    data.command = "deleteModule";
    data.id = this.data.id;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            doAlert("Info", "Module has been successfully deleted", form, form.afterSave);
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
ModuleDeleteForm.prototype.afterSave = function() {
    this.successHandler.call(this.successContext);
}