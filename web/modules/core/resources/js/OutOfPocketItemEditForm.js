/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
function OutOfPocketItemEditForm(formData, htmlId, successHandler, successContext) {
    this.config = {
        endpointUrl: endpointsFolder+ "OutOfPocketItemEditForm.jsp"
    };
    this.htmlId = htmlId;
    this.successHandler = successHandler;
    this.successContext = successContext;
    this.enums = {
        "types": {
            "FULL": "100%",
            "LIMITED" : "Limited",
            "NO" : "No"
        }
    }
    this.loaded = {
        "currencies": [],
        "standardPositions": [],
        "standardSellingRateBlock": null
    }
    this.data = {
        "mode": formData.mode,
        "id": formData.id,
        "projectCodeId": formData.projectCodeId,

        "type" : formData.type,
        "amount": formData.amount,
        "currencyId": formData.currencyId,
        "outOfPocketInvoiceCurrencyId" : formData.outOfPocketInvoiceCurrencyId,
        "outOfPocketPaymentCurrencyId" : formData.outOfPocketPaymentCurrencyId,
        "outOfPocketActCurrencyId" : formData.outOfPocketActCurrencyId
    }
}
OutOfPocketItemEditForm.prototype.init = function() {
    this.containerHtmlId = getNextPopupHtmlContainer();

    this.loadInitialContent();
    this.dataChanged(false);
}
OutOfPocketItemEditForm.prototype.loadInitialContent = function() {
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
            form.loaded.projectCode = result.projectCode;
            form.loaded.standardPositions = result.standardPositions;
            form.loaded.currencies = result.currencies;
            form.show();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
OutOfPocketItemEditForm.prototype.getHtml = function() {
    var html = '';
    html += '<div class="comment1">' + calendarVisualizer.getHtml(this.loaded.projectCode.startDate) + '-' + calendarVisualizer.getHtml(this.loaded.projectCode.endDate) + ', ' + this.loaded.projectCode.description + '</div>';

    html += '<table>';
    html += '<tr>';
    html += '<td><label for="' + this.htmlId + '_type">Out of Pocket</label></td>';
    html += '<td><select id="' + this.htmlId + '_type"></select></td>';
    html += '<td>';
    html += '<div id="' + this.htmlId + '_limited">';
    html += '</div>';
    html += '</td>';
    html += '</tr>';
    html += '</table>';

    html += '<table class="datagrid" id="' + this.htmlId + '_currencyBlock' + '">';
    html += '<tr class="dgHeader"><td><label for="' + this.htmlId + '_outOfPocketInvoiceCurrency">Invoice currency</label></td><td><label for="' + this.htmlId + '_outOfPocketPaymentCurrency">Payment Currency</label></td><td><label for="' + this.htmlId + '_outOfPocketActCurrency">Act Currency</label></td></tr>';
    html += '<tr><td><select id="' + this.htmlId + '_outOfPocketInvoiceCurrency"></select></td><td><select id="' + this.htmlId + '_outOfPocketPaymentCurrency"></select></td><td><select id="' + this.htmlId + '_outOfPocketActCurrency"></select></td></tr>';
    html += '</table>';

    return html
}

OutOfPocketItemEditForm.prototype.makeDatePickers = function() {
    var form = this;
    $( '#' + this.htmlId + '_agreementDate' ).datepicker({
        dateFormat: 'dd.mm.yy',
        onSelect: function(dateText, inst) {form.agreementDateChangedHandle(dateText, inst)}
    });
}
OutOfPocketItemEditForm.prototype.setHandlers = function() {
    var form = this;
    $('#' + this.htmlId + '_type').bind("change", function(event) {form.typeChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_type').bind("keyup", function(event) {form.typeChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_outOfPocketInvoiceCurrency').bind("change", function(event) {form.outOfPocketInvoiceCurrencyChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_outOfPocketPaymentCurrency').bind("change", function(event) {form.outOfPocketPaymentCurrencyChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_outOfPocketActCurrency').bind("change", function(event) {form.outOfPocketActCurrencyChangedHandle.call(form, event);});
}
OutOfPocketItemEditForm.prototype.typeChangedHandle = function(event) {
    var valueTxt = event.currentTarget.value;
    if(valueTxt == '') {
        this.data.type = null;
    } else {
        this.data.type = valueTxt;
    }
    this.updateTypeView();
    this.dataChanged(true);
}
OutOfPocketItemEditForm.prototype.outOfPocketInvoiceCurrencyChangedHandle = function(event) {
    var valueTxt = event.currentTarget.value;
    if(valueTxt == '') {
        this.data.outOfPocketInvoiceCurrencyId = null;
    } else {
        this.data.outOfPocketInvoiceCurrencyId = parseInt(valueTxt);
    }
    this.updateOutOfPocketInvoiceCurrencyView();
    this.dataChanged(true);
}
OutOfPocketItemEditForm.prototype.outOfPocketPaymentCurrencyChangedHandle = function(event) {
    var valueTxt = event.currentTarget.value;
    if(valueTxt == '') {
        this.data.outOfPocketPaymentCurrencyId = null;
    } else {
        this.data.outOfPocketPaymentCurrencyId = parseInt(valueTxt);
    }
    this.updateOutOfPocketPaymentCurrencyView();
    this.dataChanged(true);
}
OutOfPocketItemEditForm.prototype.outOfPocketActCurrencyChangedHandle = function(event) {
    var valueTxt = event.currentTarget.value;
    if(valueTxt == '') {
        this.data.outOfPocketActCurrencyId = null;
    } else {
        this.data.outOfPocketActCurrencyId = parseInt(valueTxt);
    }
    this.updateOutOfPocketActCurrencyView();
    this.dataChanged(true);
}
OutOfPocketItemEditForm.prototype.amountChangedHandle = function(event) {
    this.data.amount = jQuery.trim(event.currentTarget.value);
    this.updateAmountView();
    this.dataChanged(true);
}
OutOfPocketItemEditForm.prototype.currencyChangedHandle = function(event) {
    var valueTxt = event.currentTarget.value;
    if(valueTxt == '') {
        this.data.currencyId = null;
    } else {
        this.data.currencyId = parseInt(valueTxt);
    }
    this.updateCurrencyView();
    this.dataChanged(true);
}

OutOfPocketItemEditForm.prototype.updateView = function(event) {
    this.updateOutOfPocketInvoiceCurrencyView();
    this.updateOutOfPocketPaymentCurrencyView();
    this.updateOutOfPocketActCurrencyView();
    this.updateTypeView();
    //this.updateAmountView();
    //this.updateCurrencyView();
}

OutOfPocketItemEditForm.prototype.updateOutOfPocketInvoiceCurrencyView = function() {
    var html = '';
    html += '<option value="" >...</option>';
    for(var key in this.loaded.currencies) {
        var currency = this.loaded.currencies[key];
        var isSelected = "";
        if(currency.id == this.data.outOfPocketInvoiceCurrencyId) {
           isSelected = "selected";
        }
        html += '<option value="' + currency.id + '" ' + isSelected + '>' + currency.code + '</option>';
    }
    $('#' + this.htmlId + '_outOfPocketInvoiceCurrency').html(html);
}
OutOfPocketItemEditForm.prototype.updateOutOfPocketPaymentCurrencyView = function() {
    var html = '';
    html += '<option value="" >...</option>';
    for(var key in this.loaded.currencies) {
        var currency = this.loaded.currencies[key];
        var isSelected = "";
        if(currency.id == this.data.outOfPocketPaymentCurrencyId) {
           isSelected = "selected";
        }
        html += '<option value="' + currency.id + '" ' + isSelected + '>' + currency.code + '</option>';
    }
    $('#' + this.htmlId + '_outOfPocketPaymentCurrency').html(html);
}
OutOfPocketItemEditForm.prototype.updateOutOfPocketActCurrencyView = function() {
    var html = '';
    html += '<option value="" >...</option>';
    for(var key in this.loaded.currencies) {
        var currency = this.loaded.currencies[key];
        var isSelected = "";
        if(currency.id == this.data.outOfPocketActCurrencyId) {
           isSelected = "selected";
        }
        html += '<option value="' + currency.id + '" ' + isSelected + '>' + currency.code + '</option>';
    }
    $('#' + this.htmlId + '_outOfPocketActCurrency').html(html);
}

OutOfPocketItemEditForm.prototype.updateTypeView = function() {
    var typeHtml = '';
    typeHtml += '<option value="">...</option>';
    for(var key in this.enums.types) {
        var type = this.enums.types[key];
        var isSelected = "";
        if(key == this.data.type) {
           isSelected = "selected";
        }
        typeHtml += '<option value="' + key + '" ' + isSelected + '>' + type + '</option>';
    }
    $('#' + this.htmlId + '_type').html(typeHtml);
    var form = this;
    if(this.data.type == 'LIMITED') {
        var html = '';
        html += '<table><tr>';
        html += '<td><label for="' + this.htmlId + '_amount">Amount</label></td><td><input type="input" id="' + this.htmlId + '_amount" style="width: 70px;"></td>';
        html += '<td><label for="' + this.htmlId + '_currency">Currency</label></td><td><select id="' + this.htmlId + '_currency"></select></td>';
        html += '</tr></table>';
        $('#' + this.htmlId + '_limited').html(html);
        $('#' + this.htmlId + '_limited').show('fast');
        $('#' + this.htmlId + '_amount').bind("change", function(event) {form.amountChangedHandle.call(form, event);});
        $('#' + this.htmlId + '_currency').bind("change", function(event) {form.currencyChangedHandle.call(form, event);});
        this.updateAmountView();
        this.updateCurrencyView();
    } else {
        $('#' + this.htmlId + '_limited').hide('fast');
        $('#' + this.htmlId + '_limited').html('');
        $('#' + this.htmlId + '_amount').bind("change", null);
        $('#' + this.htmlId + '_currency').bind("change", null);
    }
    if(this.data.type == 'FULL' || this.data.type == 'LIMITED') {
        $('#' + this.htmlId + '_currencyBlock').show('fast');
    } else {
        $('#' + this.htmlId + '_currencyBlock').hide('fast');        
    }
}
OutOfPocketItemEditForm.prototype.updateAmountView = function() {
    $('#' + this.htmlId + '_amount').val(this.data.amount);
}
OutOfPocketItemEditForm.prototype.updateCurrencyView = function() {
    var currencyHtml = '';
    currencyHtml += '<option value="">...</option>';
    for(var key in this.loaded.currencies) {
        var currency = this.loaded.currencies[key];
        var isSelected = "";
        if(currency.id == this.data.currencyId) {
           isSelected = "selected";
        }
        currencyHtml += '<option value="' + currency.id + '" ' + isSelected + '>' + currency.code + '</option>';
    }
    $('#' + this.htmlId + '_currency').html(currencyHtml);
}
OutOfPocketItemEditForm.prototype.show = function() {
    var title = 'Update Out of pocket item / ' + this.loaded.projectCode.code;
    if(this.data.mode == 'CREATE') {
        title = 'Create Out of pocket item  / ' + this.loaded.projectCode.code;
    }
    var form = this;
    $('#' + this.containerHtmlId).html(this.getHtml());
    this.updateView();
    this.setHandlers();
    $('#' + this.containerHtmlId).dialog({
        title: title,
        modal: true,
        position: 'center',
        width: 500,
        height: 300,
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
OutOfPocketItemEditForm.prototype.validate = function() {
    var errors = [];
    var integerRE = /^[0-9]*$/;
    var float2digitsRE = /^[0-9]*\.?[0-9]{0,2}$/;
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
    if(this.data.type == 'FULL' || this.data.type == 'LIMITED') {
        if(this.data.outOfPocketInvoiceCurrencyId == null) {
            errors.push("Invoice Currency is not set");
        }
        if(this.data.outOfPocketPaymentCurrencyId == null) {
            errors.push("Payment Currency is not set");
        }
        if(this.data.outOfPocketActCurrencyId == null) {
            errors.push("Act Currency is not set");
        }
    }
    return errors;
}
OutOfPocketItemEditForm.prototype.save = function() {
    var errors = this.validate();
    if(errors.length > 0) {
        showErrors(errors);
        return;
    }
    var serverFormatData = clone(this.data);
    if(this.data.type == 'NO') {
        serverFormatData.outOfPocketInvoiceCurrencyId = null;
        serverFormatData.outOfPocketPaymentCurrencyId = null;
        serverFormatData.outOfPocketActCurrencyId = null;
    }
    var form = this;
    var data = {};
    data.command = "saveOutOfPocketItem";
    data.outOfPocketItemEditForm = getJSON(serverFormatData);
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            doAlert("Info", "OutOfPocketItem has been successfully saved", form, form.afterSave);
            form.dataChanged(false);
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
OutOfPocketItemEditForm.prototype.afterSave = function() {
    $('#' + this.containerHtmlId).dialog("close");
    this.successHandler.call(this.successContext);
}
OutOfPocketItemEditForm.prototype.dataChanged = function(value) {
    dataChanged = value;
}
OutOfPocketItemEditForm.prototype.getCurrencyById = function(id) {
    for(var key in this.loaded.currencies) {
        var currency = this.loaded.currencies[key];
        if(currency.id == id) {
           return currency;
        }
    }
    return null;
}


//==================================================

function OutOfPocketItemDeleteForm(outOfPocketItemId, successHandler, successContext) {
    this.config = {
        endpointUrl: endpointsFolder+ "OutOfPocketItemEditForm.jsp"
    };
    this.successHandler = successHandler;
    this.successContext = successContext;
    this.data = {
        "id": outOfPocketItemId
    }
}
OutOfPocketItemDeleteForm.prototype.start = function() {
    this.checkDependencies();
}
OutOfPocketItemDeleteForm.prototype.checkDependencies = function() {
    var form = this;
    var data = {};
    data.command = "checkOutOfPocketItemDependencies";
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
OutOfPocketItemDeleteForm.prototype.analyzeDependencies = function(dependencies) {
    if(dependencies.outOfPocketInvoices == 0 && dependencies.outOfPocketPayments == 0 && dependencies.outOfPocketActs == 0) {
        this.show();
    } else {
        var html = 'This OutOfPocketItem has dependencies and can not be deleted<br />';
        html += 'Invoices: ' + dependencies.outOfPocketInvoices + '<br />';
        html += 'Payments: ' + dependencies.outOfPocketPayments + '<br />';
        html += 'Acts: ' + dependencies.outOfPocketActs + '<br />';
        doAlert("Dependencies found", html, null, null);
    }
}
OutOfPocketItemDeleteForm.prototype.show = function() {
  doConfirm("Confirm", "Do you really want to delete this OutOfPocketItem", this, function() {this.doDeleteOutOfPocketItem()}, null, null);
}
OutOfPocketItemDeleteForm.prototype.doDeleteOutOfPocketItem = function() {
    var form = this;
    var data = {};
    data.command = "deleteOutOfPocketItem";
    data.id = this.data.id;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            doAlert("Info", "OutOfPocketItem has been successfully deleted", form, form.afterSave);
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
OutOfPocketItemDeleteForm.prototype.afterSave = function() {
    this.successHandler.call(this.successContext);
}
