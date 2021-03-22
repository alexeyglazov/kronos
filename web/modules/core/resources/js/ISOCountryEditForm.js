/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
function ISOCountryEditForm(formData, htmlId, successHandler, successContext) {
    this.config = {
        endpointUrl: endpointsFolder + "ISOCountryEditForm.jsp"
    };
    this.htmlId = htmlId;
    this.containerHtmlId = null;
    this.successHandler = successHandler;
    this.successContext = successContext;
    this.disabled = {
        "name": true,
        "alpha2Code": true,
        "alpha3Code": true,
        "numericCode": true
    };
    this.data = {
        "mode": formData.mode,
        "id": formData.id,
        "name": formData.name,
        "alpha2Code": formData.alpha2Code,
        "alpha3Code": formData.alpha3Code,
        "numericCode": formData.numericCode
    }
}
ISOCountryEditForm.prototype.start = function() {
    this.containerHtmlId = getNextPopupHtmlContainer();
    //if(this.data.mode == "UPDATE") {
    //    this.checkDependencies();
    //} else {
       this.disabled = {
        "name": false,
        "alpha2Code": false,
        "alpha3Code": false,
        "numericCode": false
       };
       this.show();
    //}
    this.dataChanged(false);
}
ISOCountryEditForm.prototype.checkDependencies = function() {
    var form = this;
    var data = {};
    data.command = "checkISOCountryDependencies";
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
ISOCountryEditForm.prototype.analyzeDependencies = function(dependencies) {
    if(dependencies.clients == 0) {
        this.disabled = {
            "name": false,
            "alpha2Code": false,
            "alpha3Code": false,
            "numericCode": false
        };
        this.show();
    } else {
        var html = 'This ISOCountry has dependencies. Only "numericCode" properties are updatable.<br />';
        html += 'Clients: ' + dependencies.clients + '<br />';
        this.disabled = {
            "name": true,
            "alpha2Code": true,
            "alpha3Code": true,
            "numericCode": false
        };
        doAlert("Dependencies found", html, this, this.show);
    }
}
ISOCountryEditForm.prototype.getHtml = function() {
    var html = '';
    html += '<table>';
    html += '<tr><td><span class="label1">Name</span></td><td><input type="text" id="' + this.htmlId + '_name"></td></tr>';
    html += '<tr><td><span class="label1">alpha2Code</span></td><td><input type="text" id="' + this.htmlId + '_alpha2Code"></td></tr>';
    html += '<tr><td><span class="label1">alpha3Code</span></td><td><input type="text" id="' + this.htmlId + '_alpha3Code"></td></tr>';
    html += '<tr><td><span class="label1">numericCode</span></td><td><input type="text" id="' + this.htmlId + '_numericCode"></td></tr>';
    html += '</table>';
    return html;
}
ISOCountryEditForm.prototype.setHandlers = function() {
    var form = this;
    $('#' + this.htmlId + '_name').bind("change", function(event) {form.nameChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_alpha2Code').bind("change", function(event) {form.alpha2CodeChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_alpha3Code').bind("change", function(event) {form.alpha3CodeChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_numericCode').bind("change", function(event) {form.numericCodeChangedHandle.call(form, event);});
}
ISOCountryEditForm.prototype.nameChangedHandle = function(event) {
    this.data.name = jQuery.trim(event.currentTarget.value);
    this.updateView();
    this.dataChanged(true);
}
ISOCountryEditForm.prototype.alpha2CodeChangedHandle = function(event) {
    this.data.alpha2Code = jQuery.trim(event.currentTarget.value);
    this.updateView();
    this.dataChanged(true);
}
ISOCountryEditForm.prototype.alpha3CodeChangedHandle = function(event) {
    this.data.alpha3Code = jQuery.trim(event.currentTarget.value);
    this.updateView();
    this.dataChanged(true);
}
ISOCountryEditForm.prototype.numericCodeChangedHandle = function(event) {
    this.data.numericCode = jQuery.trim(event.currentTarget.value);
    this.updateView();
    this.dataChanged(true);
}

ISOCountryEditForm.prototype.updateView = function(event) {
    $('#' + this.htmlId + '_name').val(this.data.name);
    $('#' + this.htmlId + '_alpha2Code').val(this.data.alpha2Code);
    $('#' + this.htmlId + '_alpha3Code').val(this.data.alpha3Code);
    $('#' + this.htmlId + '_numericCode').val(this.data.numericCode);
    $('#' + this.htmlId + '_name').attr("disabled", this.disabled.name);
    $('#' + this.htmlId + '_alpha2Code').attr("disabled", this.disabled.alpha2Code);
    $('#' + this.htmlId + '_alpha3Code').attr("disabled", this.disabled.alpha3Code);
    $('#' + this.htmlId + '_numericCode').attr("disabled", this.disabled.numericCode);
}
ISOCountryEditForm.prototype.show = function() {
    var title = 'Update ISOCountry'
    if(this.data.mode == 'CREATE') {
        title = 'Create ISOCountry';
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
ISOCountryEditForm.prototype.validate = function() {
    var errors = [];
    var integerRE = /^[0-9]+$/;
    if(this.data.name == null || this.data.name == "") {
        errors.push("Name is not set");
    }
    if(this.data.alpha2Code == null || this.data.alpha2Code == "") {
        errors.push("Alpha2 Code is not set");
    }
    if(this.data.alpha3Code == null || this.data.alpha3Code == "") {
        errors.push("Alpha3 Code is not set");
    }
    if(this.data.numericCode == null || this.data.numericCode == "") {
        errors.push("Numeric Code is not set");
    }

    return errors;
}
ISOCountryEditForm.prototype.save = function() {
    var errors = this.validate();
    if(errors.length > 0) {
        showErrors(errors);
        return;
    }
    var form = this;
    var data = {};
    data.command = "saveISOCountry";
    data.isoCountryEditForm = getJSON(this.data);
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            doAlert("Info", "ISOCountry has been successfully saved", form, form.afterSave);
            form.dataChanged(false);
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
ISOCountryEditForm.prototype.afterSave = function() {
    $('#' + this.containerHtmlId).dialog("close");
    this.successHandler.call(this.successContext);
}

ISOCountryEditForm.prototype.dataChanged = function(value) {
    dataChanged = value;
}




//==================================================

function ISOCountryDeleteForm(isoCountryId, successHandler, successContext) {
    this.config = {
        endpointUrl: endpointsFolder + "ISOCountryEditForm.jsp"
    };
    this.successHandler = successHandler;
    this.successContext = successContext;
    this.data = {
        "id": isoCountryId
    }
}
ISOCountryDeleteForm.prototype.start = function() {
    this.checkDependencies();
}
ISOCountryDeleteForm.prototype.checkDependencies = function() {
    var form = this;
    var data = {};
    data.command = "checkISOCountryDependencies";
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
ISOCountryDeleteForm.prototype.analyzeDependencies = function(dependencies) {
    if(dependencies.clients == 0) {
        this.show();
    } else {
        var html = 'This ISOCountry has dependencies and can not be deleted<br />';
        html += 'Clients: ' + dependencies.clients + '<br />';
         doAlert("Dependencies found", html, null, null);
    }
}
ISOCountryDeleteForm.prototype.show = function() {
  doConfirm("Confirm", "Do you really want to delete this ISOCountry", this, function() {this.doDeleteISOCountry()}, null, null);
}
ISOCountryDeleteForm.prototype.doDeleteISOCountry = function() {
    var form = this;
    var data = {};
    data.command = "deleteISOCountry";
    data.id = this.data.id;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            doAlert("Info", "ISOCountry has been successfully deleted", form, form.afterSave);
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
ISOCountryDeleteForm.prototype.afterSave = function() {
    this.successHandler.call(this.successContext);
}