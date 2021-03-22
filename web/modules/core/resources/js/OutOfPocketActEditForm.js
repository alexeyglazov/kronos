/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
function OutOfPocketActEditForm(formData, htmlId, successHandler, successContext) {
    this.config = {
        endpointUrl: endpointsFolder + "OutOfPocketActEditForm.jsp"
    };
    this.htmlId = htmlId;
    this.successHandler = successHandler;
    this.successContext = successContext;

    this.data = {
        "mode": formData.mode,
        "id": formData.id,
        "outOfPocketItemId": formData.outOfPocketItemId,
        "amount": formData.amount,
        "cvAmount": formData.cvAmount,
        "date": formData.date,
        "reference": formData.reference,
        "isSigned": formData.isSigned
    }
    this.loaded = {
        "mainCurrency": null,
        "outOfPocketItem": null
    }
}
OutOfPocketActEditForm.prototype.init = function() {
    this.containerHtmlId = getNextPopupHtmlContainer();
    this.loadInitialContent();
    this.dataChanged(false);
}
OutOfPocketActEditForm.prototype.loadInitialContent = function() {
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
OutOfPocketActEditForm.prototype.getHtml = function() {
    var html = '';
    html += '<table>';
    html += '<tr><td>Amount</td><td><input type="text" id="' + this.htmlId + '_amount"></td></tr>';
    html += '<tr><td>CV Amount</td><td><input type="text" id="' + this.htmlId + '_cvAmount"></td></tr>';
    html += '<tr><td>Date</td><td><input type="text" id="' + this.htmlId + '_date"></td></tr>';
    html += '<tr><td>Reference</td><td><input type="text" id="' + this.htmlId + '_reference"></td></tr>';
    html += '<tr><td>Signed</td><td><input type="checkbox" id="' + this.htmlId + '_isSigned"></td></tr>';
    html += '</table>';
    return html
}
OutOfPocketActEditForm.prototype.makeDatePickers = function() {
    var form = this;
    $( '#' + this.htmlId + '_date' ).datepicker({
        dateFormat: 'dd.mm.yy',
        onSelect: function(dateText, inst) {form.dateChangedHandle(dateText, inst)}
    });
}
OutOfPocketActEditForm.prototype.setHandlers = function() {
    var form = this;
    $('#' + this.htmlId + '_amount').bind("change", function(event) {form.amountChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_cvAmount').bind("change", function(event) {form.cvAmountChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_date').bind("change", function(event) {form.dateTextChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_reference').bind("change", function(event) {form.referenceChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_isSigned').bind("click", function(event) {form.isSignedChangedHandle.call(form, event);});
}
OutOfPocketActEditForm.prototype.amountChangedHandle = function(event) {
    this.data.amount = jQuery.trim(event.currentTarget.value);
    this.updateAmountView();
    this.updateCvAmountView();
    this.dataChanged(true);
}
OutOfPocketActEditForm.prototype.cvAmountChangedHandle = function(event) {
    this.data.cvAmount = jQuery.trim(event.currentTarget.value);
    this.updateCvAmountView();
    this.dataChanged(true);
}
OutOfPocketActEditForm.prototype.dateChangedHandle = function(dateText, inst) {
    this.data.date = dateText;
    this.updateDateView();
    this.dataChanged(true);
}
OutOfPocketActEditForm.prototype.dateTextChangedHandle = function(event) {
    this.data.date = jQuery.trim(event.currentTarget.value);
    this.updateDateView();
    this.dataChanged(true);
}
OutOfPocketActEditForm.prototype.isSignedChangedHandle = function(event) {
    this.data.isSigned = $(event.currentTarget).is(':checked');
    this.updateIsSignedView();
    this.dataChanged(true);
}
OutOfPocketActEditForm.prototype.referenceChangedHandle = function(event) {
    this.data.reference = jQuery.trim(event.currentTarget.value);
    this.updateReferenceView();
    this.dataChanged(true);
}
OutOfPocketActEditForm.prototype.updateView = function() {
    this.updateAmountView();
    this.updateCvAmountView();
    this.updateDateView();
    this.updateReferenceView();
    this.updateIsSignedView();
}
OutOfPocketActEditForm.prototype.updateAmountView = function() {
    $('#' + this.htmlId + '_amount').val(this.data.amount);
}
OutOfPocketActEditForm.prototype.updateCvAmountView = function() {
    if(this.loaded.mainCurrency.id == this.loaded.outOfPocketItem.outOfPocketActCurrencyId) {
        $('#' + this.htmlId + '_cvAmount').attr('disabled', true);
        $('#' + this.htmlId + '_cvAmount').val(this.data.amount);
    } else {
        $('#' + this.htmlId + '_cvAmount').attr('disabled', false);
        $('#' + this.htmlId + '_cvAmount').val(this.data.cvAmount);
    }
    
}
OutOfPocketActEditForm.prototype.updateDateView = function() {
    $('#' + this.htmlId + '_date').val(this.data.date);
}
OutOfPocketActEditForm.prototype.updateReferenceView = function() {
    $('#' + this.htmlId + '_reference').val(this.data.reference);
}
OutOfPocketActEditForm.prototype.updateIsSignedView = function() {
    $('#' + this.htmlId + '_isSigned').attr("checked", this.data.isSigned);
}
OutOfPocketActEditForm.prototype.show = function() {
    var title = 'Update OutOfPocketAct'
    if(this.data.mode == 'CREATE') {
        title = 'Create OutOfPocketAct';
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
OutOfPocketActEditForm.prototype.validate = function() {
    var errors = [];
    var float2digitsRE = /^[0-9]*\.?[0-9]{0,2}$/;
    var referenceRE = /^[A-Za-z0-9]*$/;
    if(this.data.amount == null || this.data.amount == "") {
        errors.push("Amount is not set");
    } else if(!float2digitsRE.test(this.data.amount)) {
        errors.push("Amount has incorrect format. Digits, decimal point and two digits after the point are allowed only.");
    }
    if(this.loaded.mainCurrency.id != this.loaded.outOfPocketItem.outOfPocketActCurrencyId) {
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
    if(this.data.reference == null || this.data.reference == "") {
        errors.push("Reference is not set");
    } else if(!referenceRE.test(this.data.referernce)) {
        errors.push("Reference has incorrect format. Alphanumeric characters are allowed only.");
    }    
    return errors;
}
OutOfPocketActEditForm.prototype.save = function() {
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
    serverFormatData.date = getYearMonthDateFromDateString(this.data.date);
    if(this.loaded.mainCurrency.id == this.loaded.outOfPocketItem.outOfPocketActCurrencyId) {
        serverFormatData.cvAmount = null;
    };
    var form = this;
    var data = {};
    data.command = "saveOutOfPocketAct";
    data.outOfPocketActEditForm = getJSON(serverFormatData);
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            doAlert("Info", "OutOfPocketAct has been successfully saved", form, form.afterSave);
            form.dataChanged(false);
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
OutOfPocketActEditForm.prototype.afterSave = function() {
    $('#' + this.containerHtmlId).dialog("close");
    this.successHandler.call(this.successContext);
}

OutOfPocketActEditForm.prototype.dataChanged = function(value) {
    dataChanged = value;
}



//==================================================

function OutOfPocketActDeleteForm(outOfPocketActId, successHandler, successContext) {
    this.config = {
        endpointUrl: endpointsFolder + "OutOfPocketActEditForm.jsp"
    };
    this.successHandler = successHandler;
    this.successContext = successContext;
    this.data = {
        "id": outOfPocketActId
    }
}
OutOfPocketActDeleteForm.prototype.start = function() {
    this.checkDependencies();
}
OutOfPocketActDeleteForm.prototype.checkDependencies = function() {
    var form = this;
    var data = {};
    data.command = "checkOutOfPocketActDependencies";
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
OutOfPocketActDeleteForm.prototype.analyzeDependencies = function(dependencies) {
  // there are no dependant entities now at all
    if(true) {
        this.show();
    } else {
        var html = 'This OutOfPocketAct has dependencies and can not be deleted<br />';
        doAlert("Dependencies found", html, null, null);
    }
}
OutOfPocketActDeleteForm.prototype.show = function() {
  doConfirm("Confirm", "Do you really want to delete this OutOfPocketAct", this, function() {this.doDeleteOutOfPocketAct()}, null, null);
}
OutOfPocketActDeleteForm.prototype.doDeleteOutOfPocketAct = function() {
    var form = this;
    var data = {};
    data.command = "deleteOutOfPocketAct";
    data.id = this.data.id;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            doAlert("Info", "OutOfPocketAct has been successfully deleted", form, form.afterSave);
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
OutOfPocketActDeleteForm.prototype.afterSave = function() {
    this.successHandler.call(this.successContext);
}