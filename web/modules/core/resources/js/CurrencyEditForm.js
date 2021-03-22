/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
function CurrencyEditForm(formData, htmlId, successHandler, successContext) {
    this.config = {
        endpointUrl: endpointsFolder + "CurrencyEditForm.jsp"
    };
    this.htmlId = htmlId;
    this.containerHtmlId = null;
    this.successHandler = successHandler;
    this.successContext = successContext;
    this.disabled = {
        "name": true,
        "code": true
    };
    this.data = {
        "mode": formData.mode,
        "id": formData.id,
        "name": formData.name,
        "code": formData.code
    }
}
CurrencyEditForm.prototype.start = function() {
    this.containerHtmlId = getNextPopupHtmlContainer();
    //if(this.data.mode == "UPDATE") {
    //    this.checkDependencies();
    //} else {
       this.disabled = {
        "name": false,
        "code": false
       };
       this.show();
    //}
    this.dataChanged(false);
}
CurrencyEditForm.prototype.checkDependencies = function() {
    var form = this;
    var data = {};
    data.command = "checkCurrencyDependencies";
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
CurrencyEditForm.prototype.analyzeDependencies = function(dependencies) {
    if(dependencies.countries == 0) {
        this.disabled = {
            "name": false,
            "code": false
        };
        this.show();
    } else {
        var html = 'This Currency has dependencies. Only "code" properties are updatable.<br />';
        html += 'Countries: ' + dependencies.countries + '<br />';
        this.disabled = {
            "name": true,
            "code": false
        };
        doAlert("Dependencies found", html, this, this.show);
    }
}
CurrencyEditForm.prototype.getHtml = function() {
    var html = '';
    html += '<table>';
    html += '<tr><td><span class="label1">Name</span></td><td><input type="text" id="' + this.htmlId + '_name"></td></tr>';
    html += '<tr><td><span class="label1">Code</span></td><td><input type="text" id="' + this.htmlId + '_code"></td></tr>';
    html += '</table>';
    return html;
}
CurrencyEditForm.prototype.setHandlers = function() {
    var form = this;
    $('#' + this.htmlId + '_name').bind("change", function(event) {form.nameChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_code').bind("change", function(event) {form.codeChangedHandle.call(form, event);});
}
CurrencyEditForm.prototype.nameChangedHandle = function(event) {
    this.data.name = jQuery.trim(event.currentTarget.value);
    this.updateView();
    this.dataChanged(true);
}
CurrencyEditForm.prototype.codeChangedHandle = function(event) {
    this.data.code = jQuery.trim(event.currentTarget.value);
    this.updateView();
    this.dataChanged(true);
}

CurrencyEditForm.prototype.updateView = function(event) {
    $('#' + this.htmlId + '_name').val(this.data.name);
    $('#' + this.htmlId + '_code').val(this.data.code);
    $('#' + this.htmlId + '_name').attr("disabled", this.disabled.name);
    $('#' + this.htmlId + '_code').attr("disabled", this.disabled.code);
}
CurrencyEditForm.prototype.show = function() {
    var title = 'Update Currency'
    if(this.data.mode == 'CREATE') {
        title = 'Create Currency';
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
CurrencyEditForm.prototype.validate = function() {
    var errors = [];
    var integerRE = /^[0-9]+$/;
    if(this.data.name == null || this.data.name == "") {
        errors.push("Name is not set");
    }
    if(this.data.code == null || this.data.code == "") {
        errors.push("Code is not set");
    }
    return errors;
}
CurrencyEditForm.prototype.save = function() {
    var errors = this.validate();
    if(errors.length > 0) {
        showErrors(errors);
        return;
    }
    var form = this;
    var data = {};
    data.command = "saveCurrency";
    data.currencyEditForm = getJSON(this.data);
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            doAlert("Info", "Currency has been successfully saved", form, form.afterSave);
            form.dataChanged(false);
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
CurrencyEditForm.prototype.afterSave = function() {
    $('#' + this.containerHtmlId).dialog("close");
    this.successHandler.call(this.successContext);
}

CurrencyEditForm.prototype.dataChanged = function(value) {
    dataChanged = value;
}




//==================================================

function CurrencyDeleteForm(currencyId, successHandler, successContext) {
    this.config = {
        endpointUrl: endpointsFolder + "CurrencyEditForm.jsp"
    };
    this.successHandler = successHandler;
    this.successContext = successContext;
    this.data = {
        "id": currencyId
    }
}
CurrencyDeleteForm.prototype.start = function() {
    this.checkDependencies();
}
CurrencyDeleteForm.prototype.checkDependencies = function() {
    var form = this;
    var data = {};
    data.command = "checkCurrencyDependencies";
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
CurrencyDeleteForm.prototype.analyzeDependencies = function(dependencies) {
    if(dependencies.countries == 0) {
        this.show();
    } else {
        var html = 'This Currency has dependencies and can not be deleted<br />';
        html += 'Countries: ' + dependencies.countries + '<br />';
         doAlert("Dependencies found", html, null, null);
    }
}
CurrencyDeleteForm.prototype.show = function() {
  doConfirm("Confirm", "Do you really want to delete this Currency", this, function() {this.doDeleteCurrency()}, null, null);
}
CurrencyDeleteForm.prototype.doDeleteCurrency = function() {
    var form = this;
    var data = {};
    data.command = "deleteCurrency";
    data.id = this.data.id;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            doAlert("Info", "Currency has been successfully deleted", form, form.afterSave);
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
CurrencyDeleteForm.prototype.afterSave = function() {
    this.successHandler.call(this.successContext);
}