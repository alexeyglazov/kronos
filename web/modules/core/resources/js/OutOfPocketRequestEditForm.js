/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
function OutOfPocketRequestEditForm(formData, moduleName, htmlId, successHandler, successContext) {
    this.config = {
        endpointUrl: endpointsFolder+ "OutOfPocketRequestEditForm.jsp"
    };
    this.htmlId = htmlId;
    this.successHandler = successHandler;
    this.successContext = successContext;
    this.moduleName = moduleName;
    this.enums = {
        "statuses": {
            "SUSPENDED": "Suspended",
            "ACTIVE": "Active",
            "LOCKED": "Locked",
            "CLOSED": "Closed"
        },
        "types": {
            "FULL": "100%",
            "LIMITED" : "Limited",
            "NO" : "No"
        }
    }
    this.loaded = {
        "currencies": []
    }
    this.data = {
        "mode": formData.mode,
        "id": formData.id,
        "projectCodeId": formData.projectCodeId,
        "type" : formData.type,
        "amount": formData.amount,
        "description": formData.description,
        "currencyId": formData.currencyId,
        "status": formData.status
    }
}
OutOfPocketRequestEditForm.prototype.init = function() {
    this.containerHtmlId = getNextPopupHtmlContainer();
    this.loadInitialContent();
    this.dataChanged(false);
}
OutOfPocketRequestEditForm.prototype.loadInitialContent = function() {
   var form = this;
    var data = {};
    data.command = "getInitialContent";
    data.projectCodeId = this.data.projectCodeId;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      type: "POST",
      cache: false,
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.currencies = result.currencies;
            form.show();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
OutOfPocketRequestEditForm.prototype.getHtml = function() {
    var html = '';
    html += '<table class="datagrid">';
    html += '<tr><td><label for="' + this.htmlId + '_type">Type</label></td><td><select id="' + this.htmlId + '_type"></select></td></tr>';
    html += '<tr><td><label for="' + this.htmlId + '_description">Description</label></td><td><textarea id="' + this.htmlId + '_description" style="width: 250px; height: 100px;"></textarea></td></tr>';
    html += '<tr id="' + this.htmlId + '_amountBlock"><td><label for="' + this.htmlId + '_amount">Amount</label></td><td><input type="text" id="' + this.htmlId + '_amount"></td></tr>';
    html += '<tr id="' + this.htmlId + '_currencyBlock"><td><label for="' + this.htmlId + '_currency">Currency</label></td><td><select id="' + this.htmlId + '_currency"></select></td></tr>';
    html += '<tr><td><label for="' + this.htmlId + '_status">Status</label></td><td><select id="' + this.htmlId + '_status"></select></td></tr>';
    html += '</table>';
    return html
}
OutOfPocketRequestEditForm.prototype.setHandlers = function() {
    var form = this;
    $('#' + this.htmlId + '_type').bind("change", function(event) {form.typeChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_type').bind("keyup", function(event) {form.typeChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_description').bind("change", function(event) {form.descriptionChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_amount').bind("change", function(event) {form.amountChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_currency').bind("change", function(event) {form.currencyChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_status').bind("change", function(event) {form.statusChangedHandle.call(form, event);});
}
OutOfPocketRequestEditForm.prototype.typeChangedHandle = function(event) {
    var valueTxt = event.currentTarget.value;
    if(valueTxt == '') {
        this.data.type = null;
    } else {
        this.data.type = valueTxt;
    }
    this.updateTypeView();
    this.dataChanged(true);
}
OutOfPocketRequestEditForm.prototype.descriptionChangedHandle = function(event) {
    this.data.description = jQuery.trim(event.currentTarget.value);
    this.updateDescriptionView();
    this.dataChanged(true);
}
OutOfPocketRequestEditForm.prototype.amountChangedHandle = function(event) {
    this.data.amount = jQuery.trim(event.currentTarget.value);
    this.updateAmountView();
    this.dataChanged(true);
}
OutOfPocketRequestEditForm.prototype.currencyChangedHandle = function(event) {
    var valueTxt = event.currentTarget.value;
    if(valueTxt == '') {
        this.data.currencyId = null;
    } else {
        this.data.currencyId = parseInt(valueTxt);
    }
    this.updateCurrencyView();
    this.dataChanged(true);
}
OutOfPocketRequestEditForm.prototype.statusChangedHandle = function(event) {
    this.data.status = jQuery.trim(event.currentTarget.value);
    if(this.data.status == '') {
        this.data.status = null;
    }
    this.updateStatusView();
    this.dataChanged(true);
}
OutOfPocketRequestEditForm.prototype.updateView = function(event) {
    this.updateTypeView();
    this.updateDescriptionView();
    this.updateAmountView();
    this.updateCurrencyView();
    this.updateStatusView();
}
OutOfPocketRequestEditForm.prototype.updateTypeView = function() {
    var html = '';
    html += '<option value="">...</option>';
    for(var key in this.enums.types) {
        var type = this.enums.types[key];
        var isSelected = "";
        if(key == this.data.type) {
           isSelected = "selected";
        }
        html += '<option value="' + key + '" ' + isSelected + '>' + type + '</option>';
    }
    $('#' + this.htmlId + '_type').html(html);
    if(this.data.type == 'LIMITED') {
        $('#' + this.htmlId + '_amountBlock').show('fast');
        $('#' + this.htmlId + '_currencyBlock').show('fast');
    } else {
        $('#' + this.htmlId + '_amountBlock').hide('fast');
        $('#' + this.htmlId + '_currencyBlock').hide('fast');        
    }
}
OutOfPocketRequestEditForm.prototype.updateDescriptionView = function() {
    $('#' + this.htmlId + '_description').val(this.data.description);
}
OutOfPocketRequestEditForm.prototype.updateAmountView = function() {
    $('#' + this.htmlId + '_amount').val(this.data.amount);
}
OutOfPocketRequestEditForm.prototype.updateCurrencyView = function() {
    var html = '';
    html += '<option value="">...</option>';
    for(var key in this.loaded.currencies) {
        var currency = this.loaded.currencies[key];
        var isSelected = "";
        if(currency.id == this.data.currencyId) {
           isSelected = "selected";
        }
        html += '<option value="' + currency.id + '" ' + isSelected + '>' + currency.code + '</option>';
    }
    $('#' + this.htmlId + '_currency').html(html);    
}
OutOfPocketRequestEditForm.prototype.updateStatusView = function() {
    var html = '';
    //html += '<option value="" >...</option>';
    for(var key in this.enums.statuses) {
        var status = this.enums.statuses[key];
        var isSelected = "";
        if(key == this.data.status) {
           isSelected = "selected";
        }
        html += '<option value="' + key + '" ' + isSelected + '>' + status + '</option>';
    }
    $('#' + this.htmlId + '_status').html(html);
}
OutOfPocketRequestEditForm.prototype.show = function() {
    var title = 'Update OOP Request';
    if(this.data.mode == 'CREATE') {
        title = 'Create OOP Request';
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
OutOfPocketRequestEditForm.prototype.validate = function() {
    var errors = [];
    var integerRE = /^[0-9]*$/;
    var float2digitsRE = /^[0-9]*\.?[0-9]{0,2}$/;
    //if(this.data.projectCodeId == null) {
    //    errors.push("Project Code is not set");
    //}
    if(this.data.type === null) {
        errors.push("Type is not set");
    } else if(this.data.type == "LIMITED") {
        if(this.data.amount == null || this.data.amount == "") {
            errors.push("Amount is not set");
        } else if(!float2digitsRE.test(this.data.amount)) {
            errors.push("Amount has incorrect format. Digits, decimal point and two digits after the point are allowed only.");
        }
        if(this.data.currencyId == null) {
            errors.push("Currency is not set");
        }
    }
    if(this.data.description == null || this.data.description == "") {
        errors.push("Description is not set");
    } else if (this.data.description.length > 4096) {
        errors.push("Description is too long");
    }
    if(this.data.status === null) {
        errors.push("Status is not set");
    } else if(this.data.status == 'CLOSED' || this.data.status == 'LOCKED') {
        errors.push("Saving request with LOCKED or CLOSED status is not allowed");
    } 
    return errors;
}
OutOfPocketRequestEditForm.prototype.save = function() {
    var errors = this.validate();
    if(errors.length > 0) {
        showErrors(errors);
        return;
    }
    var serverFormatData = clone(this.data);
    if(this.data.type != "LIMITED") {
        serverFormatData.amount = null;
        serverFormatData.currencyId = null;
    }
    var form = this;
    var data = {};
    data.command = "saveOutOfPocketRequest";
    data.outOfPocketRequestEditForm = getJSON(serverFormatData);
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            doAlert("Info", "Data have been successfully saved", form, form.afterSave);
            form.dataChanged(false);
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
OutOfPocketRequestEditForm.prototype.afterSave = function() {
    $('#' + this.containerHtmlId).dialog("close");
    this.successHandler.call(this.successContext);
}
OutOfPocketRequestEditForm.prototype.dataChanged = function(value) {
    dataChanged = value;
}




//==================================================

function OutOfPocketRequestDeleteForm(outOfPocketRequestId, successHandler, successContext) {
    this.config = {
        endpointUrl: endpointsFolder+ "OutOfPocketRequestEditForm.jsp"
    };
    this.successHandler = successHandler;
    this.successContext = successContext;
    this.data = {
        "id": outOfPocketRequestId
    }
}
OutOfPocketRequestDeleteForm.prototype.init = function() {
    this.checkDependencies();
}
OutOfPocketRequestDeleteForm.prototype.checkDependencies = function() {
    var form = this;
    var data = {};
    data.command = "checkOutOfPocketRequestDependencies";
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
OutOfPocketRequestDeleteForm.prototype.analyzeDependencies = function(dependencies) {
    if(dependencies.hasClosedStatusInHistory == true) {
        var html = 'This Out of pocket request was once closed. So it can not be deleted.';
        doAlert("Alert", html, null, null);
    } else  {
        this.show();
    }
}
OutOfPocketRequestDeleteForm.prototype.show = function() {
  doConfirm("Confirm", "Proceed to delete this Out of pocket request?", this, function() {this.doDeleteOutOfPocketRequest()}, null, null);
}
OutOfPocketRequestDeleteForm.prototype.doDeleteOutOfPocketRequest = function() {
    var form = this;
    var data = {};
    data.command = "deleteOutOfPocketRequest";
    data.id = this.data.id;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            doAlert("Info", "OutOfPocketRequest has been successfully deleted", form, form.afterSave);
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
OutOfPocketRequestDeleteForm.prototype.afterSave = function() {
    this.successHandler.call(this.successContext);
}
