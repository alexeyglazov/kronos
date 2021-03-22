/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
function SalaryEditForm(formData, htmlId, successHandler, successContext) {
    this.config = {
        endpointUrl: endpointsFolder+ "SalaryEditForm.jsp"
    };
    this.htmlId = htmlId;
    this.successHandler = successHandler;
    this.successContext = successContext;
    this.loaded = {
        "currencies": []
    };
    this.data = {
        "mode": formData.mode,
        "id": formData.id,
        "employeeId": formData.employeeId,
        "value": formData.value,
        "start": calendarVisualizer.getHtml(formData.start),
        "end": calendarVisualizer.getHtml(formData.end),
        "currencyId": formData.currencyId
    }
    this.selected = {
        "currencyId": this.data.currencyId
    };
}
SalaryEditForm.prototype.start = function() {
    this.containerHtmlId = getNextPopupHtmlContainer();
    this.loadInitialContent();
    this.dataChanged(false);
}
SalaryEditForm.prototype.loadInitialContent = function() {
    var form = this;
    var data = {};
    data.command = "getInitialContent";
    data.employeeId = this.data.employeeId;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      type: "POST",
      cache: false,
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.currencies = result.currencies;
            if(form.data.mode == "CREATE") {
                if(form.loaded.currencies.length > 0) {
                    form.selected.currencyId = form.loaded.currencies[0].id;
                } else {
                    form.selected.currencyId = null;
                }
                form.data.currencyId = form.selected.currencyId;
            }
            form.show();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
SalaryEditForm.prototype.getHtml = function() {
    var html = '';
    html += '<table>';
    html += '<tr><td>Salary</td><td>Currency</td></tr>';
    html += '<tr><td><input type="text" id="' + this.htmlId + '_value"></td><td><select id="' + this.htmlId + '_currency"></select></td></tr>';
    html += '<tr><td>Start</td><td>End</td></tr>';
    html += '<tr><td><input type="text" id="' + this.htmlId + '_start"></td><td><input type="text" id="' + this.htmlId + '_end"></td></tr>';
    html += '</table>';
    return html
}
SalaryEditForm.prototype.setHandlers = function() {
    var form = this;
    $('#' + this.htmlId + '_value').bind("change", function(event) {form.valueChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_start').bind("change", function(event) {form.startTextChangedHandle.call(form, event)});
    $('#' + this.htmlId + '_end').bind("change", function(event) {form.endTextChangedHandle.call(form, event)});
    $('#' + this.htmlId + '_currency').bind("change", function(event) {form.currencyChangedHandle.call(form, event);});
}
SalaryEditForm.prototype.makeDatePickers = function() {
    var form = this;
    $('#' + this.htmlId + '_start').datepicker({
        dateFormat: 'dd.mm.yy',
        onSelect: function(dateText, inst) {form.startChangedHandle(dateText, inst)}
    });
    $('#' + this.htmlId + '_end').datepicker({
        dateFormat: 'dd.mm.yy',
        onSelect: function(dateText, inst) {form.endChangedHandle(dateText, inst)}
    });
}
SalaryEditForm.prototype.valueChangedHandle = function(event) {
    this.data.value = jQuery.trim($('#' + this.htmlId + '_value').val());
    this.updateValueView();
    this.dataChanged(true);
}
SalaryEditForm.prototype.startChangedHandle = function(dateText, inst) {
    this.data.start = dateText;
    this.dataChanged(true);
}
SalaryEditForm.prototype.startTextChangedHandle = function(event) {
    this.data.start = jQuery.trim(event.currentTarget.value);
    this.updateStartView();
    this.dataChanged(true);
}
SalaryEditForm.prototype.endChangedHandle = function(dateText, inst) {
    this.data.end = dateText;
    this.dataChanged(true);
}
SalaryEditForm.prototype.endTextChangedHandle = function(event) {
    this.data.end = jQuery.trim(event.currentTarget.value);
    this.updateEndView();
    this.dataChanged(true);
}
SalaryEditForm.prototype.currencyChangedHandle = function(event) {
    this.selected.currencyId = parseInt($('#' + this.htmlId + '_currency').val());
    this.data.currencyId = this.selected.currencyId;
    this.dataChanged(true);
}

SalaryEditForm.prototype.updateView = function() {
    this.updateValueView();
    this.updateStartView();
    this.updateEndView();
    this.updateCurrencyView();
}
SalaryEditForm.prototype.updateValueView = function() {
    $('#' + this.htmlId + '_value').val(this.data.value);
}
SalaryEditForm.prototype.updateStartView = function() {
    $('#' + this.htmlId + '_start').val(this.data.start);
}
SalaryEditForm.prototype.updateEndView = function() {
    $('#' + this.htmlId + '_end').val(this.data.end);
}
SalaryEditForm.prototype.updateCurrencyView = function() {
    var html = '';
    for(var key in this.loaded.currencies) {
        var currency = this.loaded.currencies[key];
        var isSelected = "";
        if(currency.id == this.selected.currencyId) {
           isSelected = "selected";
        }
        html += '<option value="' + currency.id + '" ' + isSelected + '>' + currency.name + '</option>';
    }
    $('#' + this.htmlId + '_currency').html(html);
}
SalaryEditForm.prototype.show = function() {
    var title = 'Update Salary'
    if(this.data.mode == 'CREATE') {
        title = 'Create Salary';
    }
    var form = this;
    $('#' + this.containerHtmlId).html(this.getHtml());
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
    this.makeDatePickers();
    this.updateView();
}
SalaryEditForm.prototype.validate = function() {
    var errors = [];
    var start = null;
    var end = null;
    var valueRE = /^[0-9]*\.?[0-9]{0,2}$/;
    if(this.data.value == null ) {
        errors.push("Type is not set");
    }
    if(this.data.value == null || this.data.value == "") {
        errors.push("Value is not set");
    } else if(!valueRE.test(this.data.value)) {
      errors.push("Value has incorrect format. Digits and one decimal point are allowed only.");
    }
    if(this.data.start == null || this.data.start == "") {
        errors.push("Start date is not set");
    } else if(! isDateValid(this.data.start)) {
        errors.push("Start date has incorrect format");
    } else {
        start = parseDateString(this.data.start);
    }
    if(this.data.end == null || this.data.end == "") {
    } else if(! isDateValid(this.data.end)) {
        errors.push("End date has incorrect format");
    } else {
        end = parseDateString(this.data.end);
    }
    if(start != null && end != null && start > end) {
        errors.push("End date is less than Start date");
    }
    if(this.data.currencyId == null) {
        errors.push("Currency is not set");
    }
    return errors;
}
SalaryEditForm.prototype.save = function() {
    var errors = this.validate();
    if(errors.length > 0) {
        var message = "";
        for(var key in errors) {
            message += errors[key] + "<br />";
        }
        doAlert("Validation error", message, null, null);
        return;
    }
    var salaryEditForm = clone(this.data);
    salaryEditForm.start = getYearMonthDateFromDateString(this.data.start);
    salaryEditForm.end = getYearMonthDateFromDateString(this.data.end);
    var form = this;
    var data = {};
    data.command = "saveSalary";
    data.salaryEditForm = getJSON(salaryEditForm);
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            doAlert("Info", "This Salary has been successfully saved", form, form.afterSave);
            form.dataChanged(false);
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
SalaryEditForm.prototype.afterSave = function() {
    $('#' + this.containerHtmlId).dialog("close");
    this.successHandler.call(this.successContext);
}
SalaryEditForm.prototype.dataChanged = function(value) {
    dataChanged = value;
}



//==================================================

function SalaryDeleteForm(salaryId, successHandler, successContext) {
    this.config = {
        endpointUrl: endpointsFolder+ "SalaryEditForm.jsp"
    };
    this.successHandler = successHandler;
    this.successContext = successContext;
    this.data = {
        "id": salaryId
    }
}
SalaryDeleteForm.prototype.start = function() {
    this.show();
}
SalaryDeleteForm.prototype.show = function() {
  doConfirm("Confirm", "Do you really want to delete this Salary", this, function() {this.doDeleteSalary()}, null, null);
}
SalaryDeleteForm.prototype.doDeleteSalary = function() {
    var form = this;
    var data = {};
    data.command = "deleteSalary";
    data.id = this.data.id;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            doAlert("Info", "Salary has been successfully deleted", form, form.afterSave);
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
SalaryDeleteForm.prototype.afterSave = function() {
    this.successHandler.call(this.successContext);
}