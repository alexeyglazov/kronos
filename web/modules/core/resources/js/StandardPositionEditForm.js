/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
function StandardPositionEditForm(formData, htmlId, successHandler, successContext) {
    this.config = {
        endpointUrl: endpointsFolder + "StandardPositionEditForm.jsp"
    };
    this.htmlId = htmlId;
    this.containerHtmlId = null;
    this.successHandler = successHandler;
    this.successContext = successContext;
    this.disabled = {
        "name": true,
        "sortValue": true
    };
    this.data = {
        "mode": formData.mode,
        "id": formData.id,
        "name": formData.name,
        "sortValue": formData.sortValue
    }
}
StandardPositionEditForm.prototype.start = function() {
    this.containerHtmlId = getNextPopupHtmlContainer();
    //if(this.data.mode == "UPDATE") {
    //    this.checkDependencies();
    //} else {
       this.disabled = {
        "name": false,
        "sortValue": false
       };
       this.show();
    //}
    this.dataChanged(false);
}
StandardPositionEditForm.prototype.checkDependencies = function() {
    var form = this;
    var data = {};
    data.command = "checkStandardPositionDependencies";
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
StandardPositionEditForm.prototype.analyzeDependencies = function(dependencies) {
    if(dependencies.positions == 0) {
        this.disabled = {
            "name": false,
            "sortValue": false
        };
        this.show();
    } else {
        var html = 'This StandardPosition has dependencies. Only "sortValue" properties are updatable.<br />';
        html += 'Positions: ' + dependencies.positions + '<br />';
        this.disabled = {
            "name": true,
            "sortValue": false
        };
        doAlert("Dependencies found", html, this, this.show);
    }
}
StandardPositionEditForm.prototype.getHtml = function() {
    var html = '';
    html += '<table>';
    html += '<tr><td><span class="label1">Name</span></td><td><input type="text" id="' + this.htmlId + '_name"></td></tr>';
    html += '<tr><td><span class="label1">Sort value</span></td><td><input type="text" id="' + this.htmlId + '_sortValue"></td></tr>';
    html += '</table>';
    return html;
}
StandardPositionEditForm.prototype.setHandlers = function() {
    var form = this;
    $('#' + this.htmlId + '_name').bind("change", function(event) {form.nameChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_sortValue').bind("change", function(event) {form.sortValueChangedHandle.call(form, event);});
}
StandardPositionEditForm.prototype.nameChangedHandle = function(event) {
    this.data.name = jQuery.trim(event.currentTarget.value);
    this.updateView();
    this.dataChanged(true);
}
StandardPositionEditForm.prototype.sortValueChangedHandle = function(event) {
    this.data.sortValue = jQuery.trim(event.currentTarget.value);
    this.updateView();
    this.dataChanged(true);
}

StandardPositionEditForm.prototype.updateView = function(event) {
    $('#' + this.htmlId + '_name').val(this.data.name);
    $('#' + this.htmlId + '_sortValue').val(this.data.sortValue);
    $('#' + this.htmlId + '_name').attr("disabled", this.disabled.name);
    $('#' + this.htmlId + '_sortValue').attr("disabled", this.disabled.sortValue);
}
StandardPositionEditForm.prototype.show = function() {
    var title = 'Update StandardPosition'
    if(this.data.mode == 'CREATE') {
        title = 'Create StandardPosition';
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
StandardPositionEditForm.prototype.validate = function() {
    var errors = [];
    var integerRE = /^[0-9]+$/;
    if(this.data.name == null || this.data.name == "") {
        errors.push("Name is not set");
    }
    if(this.data.sortValue == null || this.data.sortValue == "") {
        errors.push("Sort Value is not set");
    } else if (!integerRE.test(this.data.sortValue)) {
        errors.push("SortValue must be a digit");
    }
    return errors;
}
StandardPositionEditForm.prototype.save = function() {
    var errors = this.validate();
    if(errors.length > 0) {
        showErrors(errors);
        return;
    }
    var form = this;
    var data = {};
    data.command = "saveStandardPosition";
    data.standardPositionEditForm = getJSON(this.data);
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            doAlert("Info", "StandardPosition has been successfully saved", form, form.afterSave);
            form.dataChanged(false);
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
StandardPositionEditForm.prototype.afterSave = function() {
    $('#' + this.containerHtmlId).dialog("close");
    this.successHandler.call(this.successContext);
}

StandardPositionEditForm.prototype.dataChanged = function(value) {
    dataChanged = value;
}




//==================================================

function StandardPositionDeleteForm(standardPositionId, successHandler, successContext) {
    this.config = {
        endpointUrl: endpointsFolder + "StandardPositionEditForm.jsp"
    };
    this.successHandler = successHandler;
    this.successContext = successContext;
    this.data = {
        "id": standardPositionId
    }
}
StandardPositionDeleteForm.prototype.start = function() {
    this.checkDependencies();
}
StandardPositionDeleteForm.prototype.checkDependencies = function() {
    var form = this;
    var data = {};
    data.command = "checkStandardPositionDependencies";
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
StandardPositionDeleteForm.prototype.analyzeDependencies = function(dependencies) {
    if(dependencies.positions == 0) {
        this.show();
    } else {
        var html = 'This StandardPosition has dependencies and can not be deleted<br />';
        html += 'Positions: ' + dependencies.positions + '<br />';
         doAlert("Dependencies found", html, null, null);
    }
}
StandardPositionDeleteForm.prototype.show = function() {
  doConfirm("Confirm", "Do you really want to delete this StandardPosition", this, function() {this.doDeleteStandardPosition()}, null, null);
}
StandardPositionDeleteForm.prototype.doDeleteStandardPosition = function() {
    var form = this;
    var data = {};
    data.command = "deleteStandardPosition";
    data.id = this.data.id;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            doAlert("Info", "StandardPosition has been successfully deleted", form, form.afterSave);
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
StandardPositionDeleteForm.prototype.afterSave = function() {
    this.successHandler.call(this.successContext);
}