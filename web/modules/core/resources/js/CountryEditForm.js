/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
function CountryEditForm(formData, htmlId, successHandler, successContext) {
    this.config = {
        endpointUrl: endpointsFolder+ "CountryEditForm.jsp"
    };
    this.htmlId = htmlId;
    this.containerHtmlId = null;
    this.successHandler = successHandler;
    this.successContext = successContext;
    this.data = {
        "mode": formData.mode,
        "id": formData.id,
        "name": formData.name,
        "description": formData.description
    }
}
CountryEditForm.prototype.start = function() {
    this.containerHtmlId = getNextPopupHtmlContainer();
    if(this.data.mode == "UPDATE") {
        this.checkDependencies();
    } else {
       this.show();
    }
    this.dataChanged(false);
}
CountryEditForm.prototype.checkDependencies = function() {
    var form = this;
    var data = {};
    data.command = "checkCountryDependencies";
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
CountryEditForm.prototype.analyzeDependencies = function(dependencies) {
    if(dependencies.offices == 0) {
        this.show();
    } else {
        var html = 'This Country has dependencies and can not be updated<br />';
        html += 'Offices: ' + dependencies.offices + '<br />';
        doAlert("Dependencies found", html, null, null);
    }
}
CountryEditForm.prototype.getHtml = function() {
    var html = '';
    html += '<table>';
    html += '<tr><td>Name</td><td><input type="text" id="' + this.htmlId + '_name"></td></tr>';
    html += '<tr><td>Description</td><td><input type="text" id="' + this.htmlId + '_description"></td></tr>';
    html += '</table>';
    return html
}
CountryEditForm.prototype.setHandlers = function() {
    var form = this;
    $('#' + this.htmlId + '_name').bind("change", function(event) {form.nameChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_description').bind("change", function(event) {form.descriptionChangedHandle.call(form, event);});
}
CountryEditForm.prototype.nameChangedHandle = function(event) {
    this.data.name = jQuery.trim(event.currentTarget.value);
    this.updateView();
    this.dataChanged(true);
}
CountryEditForm.prototype.descriptionChangedHandle = function(event) {
    this.data.description = jQuery.trim(event.currentTarget.value);
    this.updateView();
    this.dataChanged(true);
}
CountryEditForm.prototype.updateView = function(event) {
    $('#' + this.htmlId + '_name').val(this.data.name);
    $('#' + this.htmlId + '_description').val(this.data.description);
}

CountryEditForm.prototype.show = function() {
    var title = 'Update Country'
    if(this.data.mode == 'CREATE') {
        title = 'Create Country';
    }
    var form = this;
    $('#' + this.containerHtmlId).html(this.getHtml());
    this.updateView();
    this.setHandlers();
    $('#' + this.containerHtmlId).dialog({
        title: title,
        modal: true,
        position: 'center',
        width: 400,
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
CountryEditForm.prototype.validate = function() {
    var errors = [];
    if(this.data.name == null || this.data.name == "") {
        errors.push("Name is not set");
    }
    if(this.data.description.length > 255) {
        errors.push("Description is too long. It must not exceed 255 characters.");
    }
    return errors;
}
CountryEditForm.prototype.save = function() {
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
    data.command = "saveCountry";
    data.countryEditForm = getJSON(this.data);
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            doAlert("Info", "Country has been successfully saved", form, form.afterSave);
            form.dataChanged(false);
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
CountryEditForm.prototype.afterSave = function() {
    $('#' + this.containerHtmlId).dialog("close");
    this.successHandler.call(this.successContext);
}
CountryEditForm.prototype.dataChanged = function(value) {
    dataChanged = value;
}



//==================================================

function CountryDeleteForm(countryId, successHandler, successContext) {
    this.config = {
        endpointUrl: endpointsFolder+ "CountryEditForm.jsp"
    };
    this.successHandler = successHandler;
    this.successContext = successContext;
    this.data = {
        "id": countryId
    }
}
CountryDeleteForm.prototype.start = function() {
    this.checkDependencies();
}
CountryDeleteForm.prototype.checkDependencies = function() {
    var form = this;
    var data = {};
    data.command = "checkCountryDependencies";
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
CountryDeleteForm.prototype.analyzeDependencies = function(dependencies) {
    if(dependencies.offices == 0) {
        this.show();
    } else {
        var html = 'This Country has dependencies and can not be deleted<br />';
        html += 'Offices: ' + dependencies.offices + '<br />';
        doAlert("Dependencies found", html, null, null);
    }
}
CountryDeleteForm.prototype.show = function() {
  doConfirm("Confirm", "Do you really want to delete this Country", this, function() {this.doDeleteCountry()}, null, null);
}
CountryDeleteForm.prototype.doDeleteCountry = function() {
    var form = this;
    var data = {};
    data.command = "deleteCountry";
    data.id = this.data.id;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            doAlert("Info", "Country has been successfully deleted", form, form.afterSave);
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
CountryDeleteForm.prototype.afterSave = function() {
    this.successHandler.call(this.successContext);
}


