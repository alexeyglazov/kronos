/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
function FeesInvoiceEditForm(formData, htmlId, successHandler, successContext) {
    this.config = {
        endpointUrl: endpointsFolder + "FeesInvoiceEditForm.jsp"
    };
    this.htmlId = htmlId;
    this.successHandler = successHandler;
    this.successContext = successContext;

    this.data = {
        "mode": formData.mode,
        "id": formData.id,
        "feesItemId": formData.feesItemId,
        "amount": formData.amount,
        "vatIncludedAmount": formData.vatIncludedAmount,
        "date": formData.date,
        "reference": formData.reference,
        "isAdvance": formData.isAdvance
    }
}
FeesInvoiceEditForm.prototype.init = function() {
    this.containerHtmlId = getNextPopupHtmlContainer();
    this.show();
    this.dataChanged(false);
}
FeesInvoiceEditForm.prototype.getHtml = function() {
    var html = '';
    html += '<table>';
    html += '<tr><td>Advance</td><td><input type="checkbox" id="' + this.htmlId + '_isAdvance"></td></tr>';
    html += '<tr><td>Amount</td><td><input type="text" id="' + this.htmlId + '_amount"></td></tr>';
    html += '<tr><td>VAT included amount</td><td><input type="text" id="' + this.htmlId + '_vatIncludedAmount"></td></tr>';
    html += '<tr><td>Date</td><td><input type="text" id="' + this.htmlId + '_date"></td></tr>';
    html += '<tr><td>Reference</td><td><input type="text" id="' + this.htmlId + '_reference"></td></tr>';
    html += '</table>';
    return html
}
FeesInvoiceEditForm.prototype.makeDatePickers = function() {
    var form = this;
    $( '#' + this.htmlId + '_date' ).datepicker({
        dateFormat: 'dd.mm.yy',
        onSelect: function(dateText, inst) {form.dateChangedHandle(dateText, inst)}
    });
}
FeesInvoiceEditForm.prototype.setHandlers = function() {
    var form = this;
    $('#' + this.htmlId + '_isAdvance').bind("click", function(event) {form.isAdvanceChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_amount').bind("change", function(event) {form.amountChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_vatIncludedAmount').bind("change", function(event) {form.vatIncludedAmountChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_date').bind("change", function(event) {form.dateTextChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_reference').bind("change", function(event) {form.referenceChangedHandle.call(form, event);});
}
FeesInvoiceEditForm.prototype.isAdvanceChangedHandle = function(event) {
    this.data.isAdvance = $(event.currentTarget).is(':checked');
    this.updateIsAdvanceView();
    this.dataChanged(true);
}
FeesInvoiceEditForm.prototype.amountChangedHandle = function(event) {
    this.data.amount = jQuery.trim(event.currentTarget.value);
    this.updateAmountView();
    this.dataChanged(true);
}
FeesInvoiceEditForm.prototype.vatIncludedAmountChangedHandle = function(event) {
    this.data.vatIncludedAmount = jQuery.trim(event.currentTarget.value);
    this.updateVatIncludedAmountView();
    this.dataChanged(true);
}
FeesInvoiceEditForm.prototype.dateChangedHandle = function(dateText, inst) {
    this.data.date = dateText;
    this.updateDateView();
    this.dataChanged(true);
}
FeesInvoiceEditForm.prototype.dateTextChangedHandle = function(event) {
    this.data.date = jQuery.trim(event.currentTarget.value);
    this.updateDateView();
    this.dataChanged(true);
}
FeesInvoiceEditForm.prototype.referenceChangedHandle = function(event) {
    this.data.reference = jQuery.trim(event.currentTarget.value);
    this.updateReferenceView();
    this.dataChanged(true);
}
FeesInvoiceEditForm.prototype.updateView = function() {
    this.updateIsAdvanceView();
    this.updateAmountView();
    this.updateVatIncludedAmountView();
    this.updateDateView();
    this.updateReferenceView();
}
FeesInvoiceEditForm.prototype.updateIsAdvanceView = function() {
    $('#' + this.htmlId + '_isAdvance').attr("checked", this.data.isAdvance);
}
FeesInvoiceEditForm.prototype.updateAmountView = function() {
    $('#' + this.htmlId + '_amount').val(this.data.amount);
}
FeesInvoiceEditForm.prototype.updateVatIncludedAmountView = function() {
    $('#' + this.htmlId + '_vatIncludedAmount').val(this.data.vatIncludedAmount);
}
FeesInvoiceEditForm.prototype.updateDateView = function() {
    $('#' + this.htmlId + '_date').val(this.data.date);
}
FeesInvoiceEditForm.prototype.updateReferenceView = function() {
    $('#' + this.htmlId + '_reference').val(this.data.reference);
}

FeesInvoiceEditForm.prototype.show = function() {
    var title = 'Update FeesInvoice'
    if(this.data.mode == 'CREATE') {
        title = 'Create FeesInvoice';
    }
    var form = this;
    $('#' + this.containerHtmlId).html(this.getHtml());
    this.makeDatePickers();
    this.setHandlers();
    $('#' + this.containerHtmlId).dialog({
        title: title,
        modal: true,
        position: 'center',
        width: 400,
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
FeesInvoiceEditForm.prototype.validate = function() {
    var errors = [];
    var float2digitsRE = /^[0-9]*\.?[0-9]{0,2}$/;
    var referenceRE = /^[A-Za-z0-9]*$/;
    if(this.data.amount == null || this.data.amount == "") {
        errors.push("Amount is not set");
    } else if(!float2digitsRE.test(this.data.amount)) {
        errors.push("Amount has incorrect format. Digits, decimal point and two digits after the point are allowed only.");
    }
    if(this.data.vatIncludedAmount == null || this.data.vatIncludedAmount == "") {
        errors.push("VAT Included Amount is not set");
    } else if(!float2digitsRE.test(this.data.vatIncludedAmount)) {
        errors.push("VAT Included Amount has incorrect format. Digits, decimal point and two digits after the point are allowed only.");
    }
    if(this.data.reference == null || this.data.reference == "") {
        errors.push("Reference is not set");
    } else if(!referenceRE.test(this.data.referernce)) {
        errors.push("Reference has incorrect format. Alphanumeric characters are allowed only.");
    }
    if(this.data.date == null || this.data.date == "") {
        errors.push("Date is not set");
    } else if(! isDateValid(this.data.date)) {
        errors.push("Date has incorrect format");
    }
    return errors;
}
FeesInvoiceEditForm.prototype.save = function() {
    var errors = this.validate();
    if(errors.length > 0) {
        showErrors(errors);
        return;
    }
    var serverFormatData = clone(this.data);
    serverFormatData.date = getYearMonthDateFromDateString(this.data.date);
    var form = this;
    var data = {};
    data.command = "saveFeesInvoice";
    data.feesInvoiceEditForm = getJSON(serverFormatData);
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            doAlert("Info", "FeesInvoice has been successfully saved", form, form.afterSave);
            form.dataChanged(false);
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
FeesInvoiceEditForm.prototype.afterSave = function() {
    $('#' + this.containerHtmlId).dialog("close");
    this.successHandler.call(this.successContext);
}

FeesInvoiceEditForm.prototype.dataChanged = function(value) {
    dataChanged = value;
}



//==================================================

function FeesInvoiceDeleteForm(feesInvoiceId, successHandler, successContext) {
    this.config = {
        endpointUrl: endpointsFolder + "FeesInvoiceEditForm.jsp"
    };
    this.successHandler = successHandler;
    this.successContext = successContext;
    this.data = {
        "id": feesInvoiceId
    }
}
FeesInvoiceDeleteForm.prototype.start = function() {
    this.checkDependencies();
}
FeesInvoiceDeleteForm.prototype.checkDependencies = function() {
    var form = this;
    var data = {};
    data.command = "checkFeesInvoiceDependencies";
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
FeesInvoiceDeleteForm.prototype.analyzeDependencies = function(dependencies) {
  // there are no dependant entities now at all
    if(true) {
        this.show();
    } else {
        var html = 'This FeesInvoice has dependencies and can not be deleted<br />';
        doAlert("Dependencies found", html, null, null);
    }
}
FeesInvoiceDeleteForm.prototype.show = function() {
  doConfirm("Confirm", "Do you really want to delete this FeesInvoice", this, function() {this.doDeleteFeesInvoice()}, null, null);
}
FeesInvoiceDeleteForm.prototype.doDeleteFeesInvoice = function() {
    var form = this;
    var data = {};
    data.command = "deleteFeesInvoice";
    data.id = this.data.id;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            doAlert("Info", "FeesInvoice has been successfully deleted", form, form.afterSave);
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
FeesInvoiceDeleteForm.prototype.afterSave = function() {
    this.successHandler.call(this.successContext);
}