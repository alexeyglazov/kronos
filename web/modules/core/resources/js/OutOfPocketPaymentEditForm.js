/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
function OutOfPocketPaymentEditForm(formData, htmlId, successHandler, successContext) {
    this.config = {
        endpointUrl: endpointsFolder + "OutOfPocketPaymentEditForm.jsp"
    };
    this.htmlId = htmlId;
    this.successHandler = successHandler;
    this.successContext = successContext;

    this.data = {
        "mode": formData.mode,
        "id": formData.id,
        "invoiceReference": formData.invoiceReference,
        "outOfPocketItemId": formData.outOfPocketItemId,
        "amount": formData.amount,
        "cvAmount": formData.cvAmount,
        "date": formData.date,
        "reference": formData.reference
    }
    this.loaded = {
        "mainCurrency": null,
        "outOfPocketItem": null
    }
}
OutOfPocketPaymentEditForm.prototype.init = function() {
    this.containerHtmlId = getNextPopupHtmlContainer();
    this.loadInitialContent();
    this.dataChanged(false);
}
OutOfPocketPaymentEditForm.prototype.loadInitialContent = function() {
    var form = this;
    var data = {};
    data.command = "getInitialContent";
    data.mode = this.data.mode;
    if('CREATE' == this.data.mode) {
        data.outOfPocketItemId = this.data.outOfPocketItemId;
    } else if('UPDATE' == this.data.mode) {
        data.id = this.data.id;
    }
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: 'post',
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.outOfPocketItem = result.outOfPocketItem;
            form.loaded.mainCurrency = result.mainCurrency;
            form.show();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
OutOfPocketPaymentEditForm.prototype.getHtml = function() {
    var html = '';
    html += '<table>';
    html += '<tr><td>Invoice Reference</td><td><input type="text" id="' + this.htmlId + '_invoiceReference"></td></tr>';
    html += '<tr><td>Amount</td><td><input type="text" id="' + this.htmlId + '_amount"></td></tr>';
    html += '<tr><td>CV Amount</td><td><input type="text" id="' + this.htmlId + '_cvAmount"></td></tr>';
    html += '<tr><td>Date</td><td><input type="text" id="' + this.htmlId + '_date"></td></tr>';
    html += '<tr><td>Reference</td><td><input type="text" id="' + this.htmlId + '_reference"></td></tr>';
    html += '</table>';
    return html
}
OutOfPocketPaymentEditForm.prototype.makeDatePickers = function() {
    var form = this;
    $( '#' + this.htmlId + '_date' ).datepicker({
        dateFormat: 'dd.mm.yy',
        onSelect: function(dateText, inst) {form.dateChangedHandle(dateText, inst)}
    });
}
OutOfPocketPaymentEditForm.prototype.setHandlers = function() {
    var form = this;
    $('#' + this.htmlId + '_invoiceReference').bind("change", function(event) {form.invoiceReferenceChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_amount').bind("change", function(event) {form.amountChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_cvAmount').bind("change", function(event) {form.cvAmountChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_date').bind("change", function(event) {form.dateTextChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_reference').bind("change", function(event) {form.referenceChangedHandle.call(form, event);});
}
OutOfPocketPaymentEditForm.prototype.amountChangedHandle = function(event) {
    this.data.amount = jQuery.trim(event.currentTarget.value);
    this.updateAmountView();
    this.updateCvAmountView();
    this.dataChanged(true);
}
OutOfPocketPaymentEditForm.prototype.cvAmountChangedHandle = function(event) {
    this.data.cvAmount = jQuery.trim(event.currentTarget.value);
    this.updateCvAmountView();
    this.dataChanged(true);
}
OutOfPocketPaymentEditForm.prototype.dateChangedHandle = function(dateText, inst) {
    this.data.date = dateText;
    this.updateDateView();
    this.dataChanged(true);
}
OutOfPocketPaymentEditForm.prototype.dateTextChangedHandle = function(event) {
    this.data.date = jQuery.trim(event.currentTarget.value);
    this.updateDateView();
    this.dataChanged(true);
}
OutOfPocketPaymentEditForm.prototype.referenceChangedHandle = function(event) {
    this.data.reference = jQuery.trim(event.currentTarget.value);
    this.updateReferenceView();
    this.dataChanged(true);
}
OutOfPocketPaymentEditForm.prototype.invoiceReferenceChangedHandle = function(event) {
    this.data.invoiceReference = jQuery.trim(event.currentTarget.value);
    this.updateInvoiceReferenceView();
    this.dataChanged(true);
}

OutOfPocketPaymentEditForm.prototype.updateView = function() {
    this.updateAmountView();
    this.updateCvAmountView();
    this.updateDateView();
    this.updateReferenceView();
    this.updateInvoiceReferenceView();
}
OutOfPocketPaymentEditForm.prototype.updateAmountView = function() {
    $('#' + this.htmlId + '_amount').val(this.data.amount);
}
OutOfPocketPaymentEditForm.prototype.updateCvAmountView = function() {
    if(this.loaded.mainCurrency.id == this.loaded.outOfPocketItem.outOfPocketInvoiceCurrencyId) {
        $('#' + this.htmlId + '_cvAmount').attr('disabled', true);
        $('#' + this.htmlId + '_cvAmount').val(this.data.amount);
    } else {
        $('#' + this.htmlId + '_cvAmount').attr('disabled', false);
        $('#' + this.htmlId + '_cvAmount').val(this.data.cvAmount);
    }
    
}
OutOfPocketPaymentEditForm.prototype.updateDateView = function() {
    $('#' + this.htmlId + '_date').val(this.data.date);
}
OutOfPocketPaymentEditForm.prototype.updateReferenceView = function() {
    $('#' + this.htmlId + '_reference').val(this.data.reference);
}
OutOfPocketPaymentEditForm.prototype.updateInvoiceReferenceView = function() {
    $('#' + this.htmlId + '_invoiceReference').val(this.data.invoiceReference);
}

OutOfPocketPaymentEditForm.prototype.show = function() {
    var title = 'Update OutOfPocketPayment'
    if(this.data.mode == 'CREATE') {
        title = 'Create OutOfPocketPayment';
    }
    var form = this;
    $('#' + this.containerHtmlId).html(this.getHtml());
    this.makeDatePickers();
    this.setHandlers();
    $('#' + this.containerHtmlId).dialog({
        title: title,
        modal: true,
        position: 'center',
        width: 250,
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
OutOfPocketPaymentEditForm.prototype.validate = function() {
    var errors = [];
    var float2digitsRE = /^[0-9]*\.?[0-9]{0,2}$/;
    if(this.data.amount == null || this.data.amount == "") {
        errors.push("Amount is not set");
    } else if(!float2digitsRE.test(this.data.amount)) {
        errors.push("Amount has incorrect format. Digits, decimal point and two digits after the point are allowed only.");
    }
    if(this.loaded.mainCurrency.id != this.loaded.outOfPocketItem.outOfPocketInvoiceCurrencyId) {
        if(this.data.cvAmount == null || this.data.cvAmount == "") {
            errors.push("CV Amount is not set");
        } else if(!float2digitsRE.test(this.data.cvAmount)) {
            errors.push("CV Amount has incorrect format. Digits, decimal point and two digits after the point are allowed only.");
        }
    }
    if(this.data.date == null || this.data.date == "") {
        errors.push("Date is not set");
    } else if(! isDateValid(this.data.date)) {
        errors.push("Date has incorrect format");
    }
    return errors;
}
OutOfPocketPaymentEditForm.prototype.save = function() {
    var errors = this.validate();
    if(errors.length > 0) {
        showErrors(errors);
        return;
    }
    var serverFormatData = clone(this.data);
    serverFormatData.date = getYearMonthDateFromDateString(this.data.date);
    if(this.loaded.mainCurrency.id == this.loaded.outOfPocketItem.outOfPocketInvoiceCurrencyId) {
        serverFormatData.cvAmount = null;
    };
    var form = this;
    var data = {};
    data.command = "saveOutOfPocketPayment";
    data.outOfPocketPaymentEditForm = getJSON(serverFormatData);
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            doAlert("Info", "OutOfPocketPayment has been successfully saved", form, form.afterSave);
            form.dataChanged(false);
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
OutOfPocketPaymentEditForm.prototype.afterSave = function() {
    $('#' + this.containerHtmlId).dialog("close");
    this.successHandler.call(this.successContext);
}

OutOfPocketPaymentEditForm.prototype.dataChanged = function(value) {
    dataChanged = value;
}



//==================================================

function OutOfPocketPaymentDeleteForm(outOfPocketPaymentId, successHandler, successContext) {
    this.config = {
        endpointUrl: endpointsFolder + "OutOfPocketPaymentEditForm.jsp"
    };
    this.successHandler = successHandler;
    this.successContext = successContext;
    this.data = {
        "id": outOfPocketPaymentId
    }
}
OutOfPocketPaymentDeleteForm.prototype.start = function() {
    this.checkDependencies();
}
OutOfPocketPaymentDeleteForm.prototype.checkDependencies = function() {
    var form = this;
    var data = {};
    data.command = "checkOutOfPocketPaymentDependencies";
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
OutOfPocketPaymentDeleteForm.prototype.analyzeDependencies = function(dependencies) {
  // there are no dependant entities now at all
    if(true) {
        this.show();
    } else {
        var html = 'This OutOfPocketPayment has dependencies and can not be deleted<br />';
        doAlert("Dependencies found", html, null, null);
    }
}
OutOfPocketPaymentDeleteForm.prototype.show = function() {
  doConfirm("Confirm", "Do you really want to delete this OutOfPocketPayment", this, function() {this.doDeleteOutOfPocketPayment()}, null, null);
}
OutOfPocketPaymentDeleteForm.prototype.doDeleteOutOfPocketPayment = function() {
    var form = this;
    var data = {};
    data.command = "deleteOutOfPocketPayment";
    data.id = this.data.id;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            doAlert("Info", "OutOfPocketPayment has been successfully deleted", form, form.afterSave);
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
OutOfPocketPaymentDeleteForm.prototype.afterSave = function() {
    this.successHandler.call(this.successContext);
}