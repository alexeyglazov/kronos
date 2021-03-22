/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
function PositionEditForm(formData, htmlId, successHandler, successContext) {
    this.config = {
        endpointUrl: endpointsFolder + "PositionEditForm.jsp"
    };
    this.htmlId = htmlId;
    this.containerHtmlId = null;
    this.successHandler = successHandler;
    this.successContext = successContext;
    this.loaded = {
        "standardPositions": []
    }
    this.disabled = {
        "name": true,
        "isActive": true,
        "standardPosition": true
    };
    this.data = {
        "mode": formData.mode,
        "id": formData.id,
        "subdepartmentId": formData.subdepartmentId,
        "standardPositionId": formData.standardPositionId,
        "name": formData.name,
        "localLanguageName": formData.localLanguageName,
        "visitCardName": formData.visitCardName,
        "localLanguageVisitCardName": formData.localLanguageVisitCardName,
        "isActive": formData.isActive
    }
    this.dataChanged(false);
}
PositionEditForm.prototype.start = function() {
    this.containerHtmlId = getNextPopupHtmlContainer();
    if(this.data.mode == "UPDATE") {
        this.checkDependencies();
    } else {
       this.disabled = {
        "name": false,
        "isActive": false,
        "standardPosition": false
       };
       this.loadAll();
    }
}
PositionEditForm.prototype.checkDependencies = function() {
    var form = this;
    var data = {};
    data.command = "checkPositionDependencies";
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
PositionEditForm.prototype.analyzeDependencies = function(dependencies) {
    if(dependencies.employeePositionHistoryItems == 0) {
        this.disabled = {
            "name": false,
            "localLanguageName": false,
            "visitCardName": false,
            "localLanguageVisitCardName": false,
            "isActive": false,
            "standardPosition": false
        };
        this.loadAll();
    } else {
        var html = 'This Position has dependencies. Only "Active", Local language name, Visit card name, Local language visit card name, Standard Position properties are updatable.<br />';
        html += 'Employee Position History Items: ' + dependencies.employeePositionHistoryItems + '<br />';
        this.disabled = {
            "name": true,
            "localLanguageName": false,
            "visitCardName": false,
            "localLanguageVisitCardName": false,
            "isActive": false,
            "standardPosition": false
        };
        doAlert("Dependencies found", html, this, this.loadAll);
    }
}
PositionEditForm.prototype.loadAll = function() {
    var form = this;
    var data = {};
    data.command = "getStandardPositions";
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.standardPositions = result.standardPositions;
            form.afterLoadHandle.call(form);
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
PositionEditForm.prototype.afterLoadHandle = function() {
    if(this.loaded.standardPositions.length > 0 && this.data.standardPositionId == null) {
        this.data.standardPositionId = this.loaded.standardPositions[0].id;
    }
    this.show();
}
PositionEditForm.prototype.getHtml = function() {
    var html = '';
    html += '<table>';
    html += '<tr><td>Name</td><td><input type="text" id="' + this.htmlId + '_name"></td></tr>';
    html += '<tr><td>Local language name</td><td><input type="text" id="' + this.htmlId + '_localLanguageName"></td></tr>';
    html += '<tr><td>Visit card name</td><td><input type="text" id="' + this.htmlId + '_visitCardName"></td></tr>';
    html += '<tr><td>Local language visit card name</td><td><input type="text" id="' + this.htmlId + '_localLanguageVisitCardName"></td></tr>';
    html += '<tr><td>Standard Position</td><td><select id="' + this.htmlId + '_standardPosition"></select></td></tr>';
    html += '<tr><td>Active</td><td><input type="checkbox" id="' + this.htmlId + '_isActive"></td></tr>';
    html += '</table>';
    return html
}
PositionEditForm.prototype.setHandlers = function() {
    var form = this;
    $('#' + this.htmlId + '_name').bind("change", function(event) {form.nameChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_localLanguageName').bind("change", function(event) {form.localLanguageNameChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_visitCardName').bind("change", function(event) {form.visitCardNameChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_localLanguageVisitCardName').bind("change", function(event) {form.localLanguageVisitCardNameChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_standardPosition').bind("change", function(event) {form.standardPositionChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_isActive').bind("click", function(event) {form.isActiveChangedHandle.call(form, event);});
}
PositionEditForm.prototype.nameChangedHandle = function(event) {
    this.data.name = jQuery.trim(event.currentTarget.value);
    this.updateView();
    this.dataChanged(true);
}
PositionEditForm.prototype.localLanguageNameChangedHandle = function(event) {
    this.data.localLanguageName = jQuery.trim(event.currentTarget.value);
    this.updateView();
    this.dataChanged(true);
}
PositionEditForm.prototype.visitCardNameChangedHandle = function(event) {
    this.data.visitCardName = jQuery.trim(event.currentTarget.value);
    this.updateView();
    this.dataChanged(true);
}
PositionEditForm.prototype.localLanguageVisitCardNameChangedHandle = function(event) {
    this.data.localLanguageVisitCardName = jQuery.trim(event.currentTarget.value);
    this.updateView();
    this.dataChanged(true);
}
PositionEditForm.prototype.standardPositionChangedHandle = function(event) {
    this.data.standardPositionId = event.currentTarget.value;
    this.updateView();
    this.dataChanged(true);
}
PositionEditForm.prototype.isActiveChangedHandle = function(event) {
    this.data.isActive = $(event.currentTarget).is(':checked');
    this.updateView();
    this.dataChanged(true);
}
PositionEditForm.prototype.updateView = function() {
    $('#' + this.htmlId + '_name').val(this.data.name);
    $('#' + this.htmlId + '_localLanguageName').val(this.data.localLanguageName);
    $('#' + this.htmlId + '_visitCardName').val(this.data.visitCardName);
    $('#' + this.htmlId + '_localLanguageVisitCardName').val(this.data.localLanguageVisitCardName);
    $('#' + this.htmlId + '_isActive').attr("checked", this.data.isActive);
    $('#' + this.htmlId + '_name').attr("disabled", this.disabled.name);
    $('#' + this.htmlId + '_localLanguageName').attr("disabled", this.disabled.localLanguageName);
    $('#' + this.htmlId + '_visitCardName').attr("disabled", this.disabled.visitCardName);
    $('#' + this.htmlId + '_localLanguageVisitCardName').attr("disabled", this.disabled.localLanguageVisitCardName);
    $('#' + this.htmlId + '_isActive').attr("disabled", this.disabled.isActive);
    this.updateStandardPositionView();
}
PositionEditForm.prototype.updateStandardPositionView = function() {
    var html = '';
    for(var key in this.loaded.standardPositions) {
        var standardPosition = this.loaded.standardPositions[key];
        var isSelected = "";
        if(standardPosition.id == this.data.standardPositionId) {
           isSelected = "selected";
        }
        html += '<option value="'+ standardPosition.id +'" ' + isSelected + '>' + standardPosition.name + '</option>';
    }
    $('#' + this.htmlId + '_standardPosition').html(html);
    $('#' + this.htmlId + '_standardPosition').attr("disabled", this.disabled.standardPosition);
}
PositionEditForm.prototype.show = function() {
    var title = 'Update Position'
    if(this.data.mode == 'CREATE') {
        title = 'Create Position';
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
PositionEditForm.prototype.validate = function() {
    var errors = [];
    if(this.data.name == null || this.data.name == "") {
        errors.push("Name is not set");
    }
    return errors;
}
PositionEditForm.prototype.save = function() {
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
    data.command = "savePosition";
    data.positionEditForm = getJSON(this.data);
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            doAlert("Info", "Position has been successfully saved", form, form.afterSave);
            form.dataChanged(false);
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
PositionEditForm.prototype.afterSave = function() {
    $('#' + this.containerHtmlId).dialog("close");
    this.successHandler.call(this.successContext);
}
PositionEditForm.prototype.dataChanged = function(value) {
    dataChanged = value;
}



//==================================================

function PositionDeleteForm(positionId, successHandler, successContext) {
    this.config = {
        endpointUrl: endpointsFolder + "PositionEditForm.jsp"
    };
    this.successHandler = successHandler;
    this.successContext = successContext;
    this.data = {
        "id": positionId
    }
}
PositionDeleteForm.prototype.start = function() {
    this.checkDependencies();
}
PositionDeleteForm.prototype.checkDependencies = function() {
    var form = this;
    var data = {};
    data.command = "checkPositionDependencies";
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
PositionDeleteForm.prototype.analyzeDependencies = function(dependencies) {
    if(dependencies.employeePositionHistoryItems == 0) {
        this.show();
    } else {
        var html = 'This Position has dependencies and can not be deleted<br />';
        html += 'Employee Position History Items: ' + dependencies.employeePositionHistoryItems + '<br />';
        doAlert("Dependencies found", html, null, null);
    }
}
PositionDeleteForm.prototype.show = function() {
  doConfirm("Confirm", "Do you really want to delete this Position", this, function() {this.doDeletePosition()}, null, null);
}
PositionDeleteForm.prototype.doDeletePosition = function() {
    var form = this;
    var data = {};
    data.command = "deletePosition";
    data.id = this.data.id;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            doAlert("Info", "Position has been successfully deleted", form, form.afterSave);
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
PositionDeleteForm.prototype.afterSave = function() {
    $('#' + this.containerHtmlId).dialog("close");
    this.successHandler.call(this.successContext);
}
