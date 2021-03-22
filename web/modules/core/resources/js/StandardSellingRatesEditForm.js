/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
function StandardSellingRatesEditForm(formData, htmlId, successHandler, successContext) {
    this.config = {
        endpointUrl: endpointsFolder+ "StandardSellingRatesEditForm.jsp"
    };
    this.htmlId = htmlId;
    this.containerHtmlId = null;
    this.successHandler = successHandler;
    this.successContext = successContext;
    this.loaded = {
        "currencies": [],
        "standardPositions": []
    }
    this.data = formData;
    //"mode"
    //"standardSellingRateGroupId"
    //"subdepartmentId",
    //"currencyId"
    //"start"
    //"end"
    //"standardSellingRates" 
}
StandardSellingRatesEditForm.prototype.init = function() {
    this.containerHtmlId = getNextPopupHtmlContainer();
    this.loadInitialContent();
    this.dataChanged(false);
}
StandardSellingRatesEditForm.prototype.loadInitialContent = function() {
   var form = this;
    var data = {};
    data.command = "getInitialContent";
    data.subdepartmentId = this.data.subdepartmentId;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      type: "POST",
      cache: false,
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.currencies = result.currencies;
            form.loaded.positions = result.positions;
            form.show();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
StandardSellingRatesEditForm.prototype.getHtml = function() {
    var html = '';
    html += '<table>';
    html += '<tr><td><span class="label1">Currency</span></td><td><select id="' + this.htmlId + '_currency"></select></td></tr>';
    html += '<tr><td><span class="label1">Start</span></td><td><input type="input" id="' + this.htmlId + '_start"></td></tr>';
    html += '<tr><td><span class="label1">End</span></td><td><input type="input" id="' + this.htmlId + '_end"></td></tr>';
    html += '</table>';
    html += '<table class="datagrid">';
    html += '<tr class="dgHeader"><td>Standard Position</td><td>Position</td><td>Amount</td></tr>';
    for(var key in this.loaded.positions) {
        var position = this.loaded.positions[key];
        html += '<tr>';
        html += '<td>' + position.standardPositionName + '</td>';
        html += '<td>' + position.positionName + '</td>';
        html += '<td><input type="input" id="' + this.htmlId + '_amount_' + position.id + '"></td>';
        html += '</tr>';
    }
    html += '</table>';
    return html
}
StandardSellingRatesEditForm.prototype.makeDatePickers = function() {
    var form = this;
    $( '#' + this.htmlId + '_start' ).datepicker({
        dateFormat: 'dd.mm.yy',
        onSelect: function(dateText, inst) {form.startChangedHandle(dateText, inst)}
    });
    $( '#' + this.htmlId + '_end' ).datepicker({
        dateFormat: 'dd.mm.yy',
        onSelect: function(dateText, inst) {form.endChangedHandle(dateText, inst)}
    });
}
StandardSellingRatesEditForm.prototype.setHandlers = function() {
    var form = this;
    $('#' + this.htmlId + '_start').bind("change", function(event) {form.startTextChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_end').bind("change", function(event) {form.endTextChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_currency').bind("change", function(event) {form.currencyChangedHandle.call(form, event);});
    $('input[id^="' + this.htmlId + '_amount_"]').bind('change', function(event) {form.amountChangedHandle.call(form, event)});
}
StandardSellingRatesEditForm.prototype.startChangedHandle = function(dateText, inst) {
    this.data.start = dateText;
}
StandardSellingRatesEditForm.prototype.startTextChangedHandle = function(event) {
    this.data.start = jQuery.trim(event.currentTarget.value);
}
StandardSellingRatesEditForm.prototype.endChangedHandle = function(dateText, inst) {
    this.data.end = dateText;
}
StandardSellingRatesEditForm.prototype.endTextChangedHandle = function(event) {
    this.data.end = jQuery.trim(event.currentTarget.value);
}
StandardSellingRatesEditForm.prototype.amountChangedHandle = function(event) {
    var htmlId=event.currentTarget.id;
    var parts = htmlId.split("_");
    var positionId = parts[parts.length - 1];
    var amount = jQuery.trim(event.currentTarget.value);
    var standardSellingRate = null;
    for(var key in this.data.standardSellingRates) {
        if(this.data.standardSellingRates[key].positionId == positionId) {
            standardSellingRate = this.data.standardSellingRates[key];
            break;
        }
    }
    if(standardSellingRate == null) {
        standardSellingRate = {
            "id": null,
            "positionId" : positionId,
            "amount": amount
        };
        this.data.standardSellingRates.push(standardSellingRate);
    } else {
        standardSellingRate.amount = amount;
    }
    this.updateAmountView();
}
StandardSellingRatesEditForm.prototype.currencyChangedHandle = function(event) {
    var idTxt = $('#' + this.htmlId + '_currency').val();
    if(idTxt == '') {
        this.data.currencyId = null;
    } else {
        this.data.currencyId = parseInt(idTxt);
    }
}
StandardSellingRatesEditForm.prototype.updateView = function(event) {
    this.updateStartView();
    this.updateEndView();
    this.updateCurrencyView();
    this.updateAmountView();
}
StandardSellingRatesEditForm.prototype.updateStartView = function() {
    $('#' + this.htmlId + '_start').val(this.data.start);
}
StandardSellingRatesEditForm.prototype.updateEndView = function() {
    $('#' + this.htmlId + '_end').val(this.data.end);
}
StandardSellingRatesEditForm.prototype.updateCurrencyView = function() {
    var html = '';
    html += '<option value="">...</option>';
    for(var key in this.loaded.currencies) {
        var currency = this.loaded.currencies[key];
        var isSelected = "";
        if(currency.id == this.data.currencyId) {
           isSelected = "selected";
        }
        html += '<option value="' + currency.id + '" ' + isSelected + '>' + currency.name + '</option>';
    }
    $('#' + this.htmlId + '_currency').html(html);
}
StandardSellingRatesEditForm.prototype.updateAmountView = function() {
    for(var key in this.loaded.positions) {
        var position = this.loaded.positions[key];
        var amount = null;
        for(var key2 in this.data.standardSellingRates) {
            if(this.data.standardSellingRates[key2].positionId == position.id) {
                amount = this.data.standardSellingRates[key2].amount;
                break;
            }
        }
        $('#' + this.htmlId + '_amount_' + position.id).val(amount);
    }
}
StandardSellingRatesEditForm.prototype.show = function() {
    var title = 'Update'
    if(this.data.mode == 'CREATE') {
        title = 'Create';
    }
    var form = this;
    $('#' + this.containerHtmlId).html(this.getHtml());
    this.makeDatePickers();
    this.updateView();
    this.setHandlers();
    $('#' + this.containerHtmlId).dialog({
        title: title,
        modal: true,
        position: 'center',
        width: 450,
        height: 380,
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
StandardSellingRatesEditForm.prototype.validate = function() {
    var errors = [];
    var amountRE = /^[0-9]+[.]?[0-9]*$/;

    if(this.data.currencyId == null) {
        errors.push("Currency is not set");
    }
    if(this.data.start == null || this.data.start == "") {
        errors.push("Start date is not set");
    } else if(! isDateValid(this.data.start)) {
        errors.push("Start date has incorrect format");
    }
    if(this.data.end == null || this.data.end == "") {
        //errors.push("End date is not set");
    } else if(! isDateValid(this.data.end)) {
        errors.push("End date has incorrect format");
    }
    for(var key in this.loaded.positions) {
        var position = this.loaded.positions[key];
        var amount = null;
        for(var key2 in this.data.standardSellingRates) {
            if(this.data.standardSellingRates[key2].positionId == position.id) {
                amount = this.data.standardSellingRates[key2].amount;
                break;
            }
        }
        if(amount == null || amount == "") {
            errors.push('Amount for position ' + position.positionName + ' is empty.');
        } else if(! amountRE.test(amount)) {
            errors.push('Amount for position ' + position.positionName + ' has incorrect format. Digits and one decimal point are allowed only.');
        }
    }
    return errors;
}
StandardSellingRatesEditForm.prototype.save = function() {
    var errors = this.validate();
    if(errors.length > 0) {
        var message = "";
        for(var key in errors) {
            message += errors[key] + "<br />";
        }
        doAlert("Validation error", message, null, null);
        return;
    }
    var serverFormatData = clone(this.data);
    serverFormatData.start = getYearMonthDateFromDateString(this.data.start);
    serverFormatData.end = getYearMonthDateFromDateString(this.data.end);

    var form = this;
    var data = {};
    data.command = "saveStandardSellingRates";
    data.standardSellingRatesEditForm = getJSON(serverFormatData);
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            doAlert("Info", "Standard Selling Rates has been successfully saved", form, form.afterSave);
            form.dataChanged(false);
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
StandardSellingRatesEditForm.prototype.afterSave = function() {
    $('#' + this.containerHtmlId).dialog("close");
    this.successHandler.call(this.successContext);
}
StandardSellingRatesEditForm.prototype.dataChanged = function(value) {
    dataChanged = value;
}



//==================================================

function StandardSellingRatesDeleteForm(standardSellingRateGroupId, successHandler, successContext) {
    this.config = {
        endpointUrl: endpointsFolder+ "StandardSellingRatesEditForm.jsp"
    };
    this.successHandler = successHandler;
    this.successContext = successContext;
    this.data = {
        "id": standardSellingRateGroupId
    }
}
StandardSellingRatesDeleteForm.prototype.init = function() {
    //this.checkDependencies();
    this.show();
}
StandardSellingRatesDeleteForm.prototype.checkDependencies = function() {
    var form = this;
    var data = {};
    data.command = "checkStandardSellingRateDependencies";
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
StandardSellingRatesDeleteForm.prototype.analyzeDependencies = function(dependencies) {
//    if(dependencies.invoices == 0) {
        this.show();
//    } else {
//        var html = 'This StandardSellingRateGroup has dependencies and can not be deleted<br />';
//        html += 'Invoices: ' + dependencies.invoices + '<br />';
//        doAlert("Dependencies found", html, null, null);
//    }
}
StandardSellingRatesDeleteForm.prototype.show = function() {
  doConfirm("Confirm", "Do you really want to delete this Standard Selling Rate", this, function() {this.doDeleteStandardSellingRate()}, null, null);
}
StandardSellingRatesDeleteForm.prototype.doDeleteStandardSellingRate = function() {
    var form = this;
    var data = {};
    data.command = "deleteStandardSellingRate";
    data.id = this.data.id;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            doAlert("Info", "Standard Selling Rate has been successfully deleted", form, form.afterSave);
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
StandardSellingRatesDeleteForm.prototype.afterSave = function() {
    this.successHandler.call(this.successContext);
}