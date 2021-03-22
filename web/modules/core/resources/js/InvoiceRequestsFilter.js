/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
function InvoiceRequestsFilter(htmlId, moduleName, filter, callback, callbackContext) {
    this.htmlId = htmlId;
    this.containerHtmlId = null;
    this.moduleName = moduleName;
    this.callback = callback;
    this.callbackContext = callbackContext;
    if(filter != null) {
        this.filter = filter;
    } else {
        this.filter = this.getDefaultFilter();
    }  
}
InvoiceRequestsFilter.prototype.isFilterUsed = function(filter) {
    if(filter.hasRequests != null && filter.hasRequests != 'ALL') {
        return true;
    }
    if(filter.hasInvoiceRequests != null && filter.hasInvoiceRequests != 'ALL') {
        return true;
    }
    if(filter.hasActRequests != null && filter.hasActRequests != 'ALL') {
        return true;
    }
    if(filter.hasTaxInvoiceRequests != null && filter.hasTaxInvoiceRequests != 'ALL') {
        return true;
    }
    if(filter.hasSuspendedRequests != null && filter.hasSuspendedRequests != false) {
        return true;
    }
    if(filter.hasActiveRequests != null && filter.hasActiveRequests != false) {
        return true;
    }
    if(filter.hasLockedRequests != null && filter.hasLockedRequests != false) {
        return true;
    }
    if(filter.hasClosedRequests != null && filter.hasClosedRequests != false) {
        return true;
    }
    if(filter.invoiceReference != null && filter.invoiceReference != '') {
        return true;
    }
    if(filter.actReference != null && filter.actReference != '') {
        return true;
    }
    if(filter.paymentReference != null && filter.paymentReference != '') {
        return true;
    }
    if(filter.outOfPocketInvoiceReference != null && filter.outOfPocketInvoiceReference != '') {
        return true;
    }
    if(filter.outOfPocketActReference != null && filter.outOfPocketActReference != '') {
        return true;
    }
    if(filter.outOfPocketPaymentReference != null && filter.outOfPocketPaymentReference != '') {
        return true;
    }
    if(filter.startDate != null) {
        return true;
    }
    if(filter.endDate != null) {
        return true;
    }
    return false;
}
InvoiceRequestsFilter.prototype.getDefaultFilter = function() {
    return {
        "hasRequests": 'ALL',
        "hasInvoiceRequests": 'ALL',
        "hasActRequests": 'ALL',
        "hasTaxInvoiceRequests": 'ALL',
        "hasSuspendedRequests": false,
        "hasActiveRequests": false,
        "hasLockedRequests": false,
        "hasClosedRequests": false,
        "invoiceReference": '',
        "actReference": '',
        "paymentReference": '',
        "outOfPocketInvoiceReference": '',
        "outOfPocketActReference": '',
        "outOfPocketPaymentReference": '',
        "startDate" : null,
        "endDate" : null
    }
}
InvoiceRequestsFilter.prototype.normalizeFilter = function(obj) {
    return {
        "hasRequests": obj.hasRequests,
        "hasInvoiceRequests": obj.hasInvoiceRequests,
        "hasActRequests": obj.hasActRequests,
        "hasTaxInvoiceRequests": obj.hasTaxInvoiceRequests,
        "hasSuspendedRequests": obj.hasSuspendedRequests,
        "hasActiveRequests": obj.hasActiveRequests,
        "hasLockedRequests": obj.hasLockedRequests,
        "hasClosedRequests": obj.hasClosedRequests,
        "invoiceReference": obj.invoiceReference,
        "actReference": obj.actReference,
        "paymentReference": obj.paymentReference,
        "outOfPocketInvoiceReference": obj.outOfPocketInvoiceReference,
        "outOfPocketActReference": obj.outOfPocketActReference,
        "outOfPocketPaymentReference": obj.outOfPocketPaymentReference,
        "startDate" : obj.startDate,
        "endDate" : obj.endDate
    }
}
InvoiceRequestsFilter.prototype.init = function() {
    this.containerHtmlId = getNextPopupHtmlContainer();
    this.show();
}
InvoiceRequestsFilter.prototype.getLayoutHtml = function() {
    var html = '';
    html += '<table>';
    html += '<tr><td>';
    html += '<button id="' + this.htmlId + '_reset">Reset all</button>';
    html += '</td></tr>';
    html += '</table>';
    
    html += '<table class="datagrid">';
    html += '<tr class="dgHeader"><td>Field Name</td><td>Value</td></tr>';
    html += '<tr><td>Has requests</td><td><select id="' + this.htmlId + '_hasRequests"></select></td></tr>';
    html += '<tr id="' + this.htmlId + '_hasInvoiceRequestsBlock"><td>Has invoice requests</td><td><select id="' + this.htmlId + '_hasInvoiceRequests"></select></td></tr>';
    html += '<tr id="' + this.htmlId + '_hasActRequestsBlock"><td>Has act requests</td><td><select id="' + this.htmlId + '_hasActRequests"></select></td></tr>';
    html += '<tr id="' + this.htmlId + '_hasTaxInvoiceRequestsBlock"><td>Has tax invoice requests</td><td><select id="' + this.htmlId + '_hasTaxInvoiceRequests"></select></td></tr>';
    html += '<tr id="' + this.htmlId + '_hasSuspendedRequestsBlock"><td>Has suspended requests</td><td><input type="checkbox" id="' + this.htmlId + '_hasSuspendedRequests"></td></tr>';
    html += '<tr id="' + this.htmlId + '_hasActiveRequestsBlock"><td>Has active requests</td><td><input type="checkbox" id="' + this.htmlId + '_hasActiveRequests"></td></tr>';
    html += '<tr id="' + this.htmlId + '_hasLockedRequestsBlock"><td>Has locked requests</td><td><input type="checkbox" id="' + this.htmlId + '_hasLockedRequests"></td></tr>';
    html += '<tr id="' + this.htmlId + '_hasClosedRequestsBlock"><td>Has closed requests</td><td><input type="checkbox" id="' + this.htmlId + '_hasClosedRequests"></td></tr>';

    html += '<tr><td>Invoice reference</td><td><input type="text" id="' + this.htmlId + '_invoiceReference"><br /><span class="comment1">Use the asterisk (*) wildcard character to search</span></td></tr>';
    html += '<tr><td>Act reference</td><td><input type="text" id="' + this.htmlId + '_actReference"></td></tr>';
    html += '<tr><td>Payment reference</td><td><input type="text" id="' + this.htmlId + '_paymentReference"></td></tr>';
    html += '<tr><td>OOP invoice reference</td><td><input type="text" id="' + this.htmlId + '_outOfPocketInvoiceReference"></td></tr>';
    html += '<tr><td>OOP act reference</td><td><input type="text" id="' + this.htmlId + '_outOfPocketActReference"></td></tr>';
    html += '<tr><td>OOP payment reference</td><td><input type="text" id="' + this.htmlId + '_outOfPocketPaymentReference"></td></tr>';

    html += '<tr id="' + this.htmlId + '_startDateBlock"><td>Start date</td><td><input type="text" id="' + this.htmlId + '_startDate"></td></tr>';
    html += '<tr id="' + this.htmlId + '_endDateBlock"><td>End date</td><td><input type="text" id="' + this.htmlId + '_endDate"></td></tr>';
    html += '</table>';
    return html;
}
InvoiceRequestsFilter.prototype.show = function() {
    var title = 'Filter data'
    var form = this;
    $('#' + this.containerHtmlId).html(this.getLayoutHtml());
    this.setHandlers();
    this.makeButtons();
    this.makeDatePickers();
    //this.makeButtons();
    $('#' + this.containerHtmlId).dialog({
        title: title,
        modal: true,
        position: 'center',
        width: 400,
        height: 400,
        buttons: {
            OK: function() {
                form.okHandle.call(form);
                $(this).dialog( "close" );
            },
            Cancel: function() {
                $(this).dialog( "close" );
                $('#' + form.containerHtmlId).html("");
            }
	},
        close: function(event, ui) {
            releasePopupLayer();
        } 
    });
    //this.makeDatePickers();
    this.updateView();
}
InvoiceRequestsFilter.prototype.setHandlers = function() {
    var form = this;
    $('#' + this.htmlId + '_hasRequests').bind("change", function(event) {form.hasRequestsChangedHandle.call(form, event)});
    $('#' + this.htmlId + '_hasInvoiceRequests').bind("change", function(event) {form.hasInvoiceRequestsChangedHandle.call(form, event)});
    $('#' + this.htmlId + '_hasActRequests').bind("change", function(event) {form.hasActRequestsChangedHandle.call(form, event)});
    $('#' + this.htmlId + '_hasTaxInvoiceRequests').bind("change", function(event) {form.hasTaxInvoiceRequestsChangedHandle.call(form, event)});
    $('#' + this.htmlId + '_hasSuspendedRequests').bind("click", function(event) {form.hasSuspendedRequestsClickedHandle.call(form, event)});
    $('#' + this.htmlId + '_hasActiveRequests').bind("click", function(event) {form.hasActiveRequestsClickedHandle.call(form, event)});
    $('#' + this.htmlId + '_hasLockedRequests').bind("click", function(event) {form.hasLockedRequestsClickedHandle.call(form, event)});
    $('#' + this.htmlId + '_hasClosedRequests').bind("click", function(event) {form.hasClosedRequestsClickedHandle.call(form, event)});

    $('#' + this.htmlId + '_invoiceReference').bind("change", function(event) {form.invoiceReferenceChangedHandle.call(form, event)});
    $('#' + this.htmlId + '_actReference').bind("change", function(event) {form.actReferenceChangedHandle.call(form, event)});
    $('#' + this.htmlId + '_paymentReference').bind("change", function(event) {form.paymentReferenceChangedHandle.call(form, event)});
    $('#' + this.htmlId + '_outOfPocketInvoiceReference').bind("change", function(event) {form.outOfPocketInvoiceReferenceChangedHandle.call(form, event)});
    $('#' + this.htmlId + '_outOfPocketActReference').bind("change", function(event) {form.outOfPocketActReferenceChangedHandle.call(form, event)});
    $('#' + this.htmlId + '_outOfPocketPaymentReference').bind("change", function(event) {form.outOfPocketPaymentReferenceChangedHandle.call(form, event)});
    $('#' + this.htmlId + '_startDate').bind("change", function(event) {form.startDateTextChangedHandle.call(form, event)});
    $('#' + this.htmlId + '_endDate').bind("change", function(event) {form.endDateTextChangedHandle.call(form, event)});
}
InvoiceRequestsFilter.prototype.makeButtons = function() {
    var form = this;
    $('#' + this.htmlId + '_reset')
      .button({
        icons: {
            primary: "ui-icon-trash"
        },
        text: true
        })
      .click(function( event ) {
        form.reset.call(form, event);
    });
}    
InvoiceRequestsFilter.prototype.makeDatePickers = function() {
    var form = this;
    $( '#' + this.htmlId + '_startDate' ).datepicker({
        changeMonth: true,
        changeYear: true,
        dateFormat: 'dd.mm.yy',
        onSelect: function(dateText, inst) {form.startDateChangedHandle(dateText, inst)}
    });
    $( '#' + this.htmlId + '_endDate' ).datepicker({
        changeMonth: true,
        changeYear: true,
        dateFormat: 'dd.mm.yy',
        onSelect: function(dateText, inst) {form.endDateChangedHandle(dateText, inst)}
    });
}
InvoiceRequestsFilter.prototype.reset = function(event) {
    this.filter = this.getDefaultFilter();
    this.show();
}

InvoiceRequestsFilter.prototype.hasRequestsChangedHandle = function() {
    this.filter.hasRequests = $('#' + this.htmlId + '_hasRequests').val();
    if(this.filter.hasRequests != 'TRUE') {
        this.filter.hasInvoiceRequests = 'ALL';
        this.filter.hasActRequests = 'ALL';
        this.filter.hasTaxInvoiceRequests = 'ALL';
        this.filter.hasSuspendedRequests = false;
        this.filter.hasActiveRequests = false;
        this.filter.hasLockedRequests = false;
        this.filter.hasClosedRequests = false;  
        this.filter.startDate = null;
        this.filter.endDate = null;
    }
    this.updateView();
}
InvoiceRequestsFilter.prototype.hasInvoiceRequestsChangedHandle = function() {
    this.filter.hasInvoiceRequests = $('#' + this.htmlId + '_hasInvoiceRequests').val();
    this.updateHasInvoiceRequestsView();
}
InvoiceRequestsFilter.prototype.hasActRequestsChangedHandle = function() {
    this.filter.hasActRequests = $('#' + this.htmlId + '_hasActRequests').val();
    this.updateHasActRequestsView();
}
InvoiceRequestsFilter.prototype.hasTaxInvoiceRequestsChangedHandle = function() {
    this.filter.hasTaxInvoiceRequests = $('#' + this.htmlId + '_hasTaxInvoiceRequests').val();
    this.updateHasTaxInvoiceRequestsView();
}
InvoiceRequestsFilter.prototype.hasSuspendedRequestsClickedHandle = function(event) {
    var isChecked = $(event.currentTarget).is(":checked");
    if(isChecked) {
        this.filter.hasSuspendedRequests = true;
    } else {
        this.filter.hasSuspendedRequests = false;
    }    
    this.updateHasSuspendedRequestsView();
}
InvoiceRequestsFilter.prototype.hasActiveRequestsClickedHandle = function(event) {
    var isChecked = $(event.currentTarget).is(":checked");
    if(isChecked) {
        this.filter.hasActiveRequests = true;
    } else {
        this.filter.hasActiveRequests = false;
    }    
    this.updateHasActiveRequestsView();
}
InvoiceRequestsFilter.prototype.hasLockedRequestsClickedHandle = function(event) {
    var isChecked = $(event.currentTarget).is(":checked");
    if(isChecked) {
        this.filter.hasLockedRequests = true;
    } else {
        this.filter.hasLockedRequests = false;
    }    
    this.updateHasLockedRequestsView();
}
InvoiceRequestsFilter.prototype.hasClosedRequestsClickedHandle = function(event) {
    var isChecked = $(event.currentTarget).is(":checked");
    if(isChecked) {
        this.filter.hasClosedRequests = true;
    } else {
        this.filter.hasClosedRequests = false;
    }    
    this.updateHasClosedRequestsView();
}
InvoiceRequestsFilter.prototype.invoiceReferenceChangedHandle = function(event) {
    this.filter.invoiceReference = jQuery.trim(event.currentTarget.value);
    this.updateInvoiceReferenceView();
}
InvoiceRequestsFilter.prototype.actReferenceChangedHandle = function(event) {
    this.filter.actReference = jQuery.trim(event.currentTarget.value);
    this.updateActReferenceView();
}
InvoiceRequestsFilter.prototype.paymentReferenceChangedHandle = function(event) {
    this.filter.paymentReference = jQuery.trim(event.currentTarget.value);
    this.updatePaymentReferenceView();
}
InvoiceRequestsFilter.prototype.outOfPocketInvoiceReferenceChangedHandle = function(event) {
    this.filter.outOfPocketInvoiceReference = jQuery.trim(event.currentTarget.value);
    this.updateOutOfPocketInvoiceReferenceView();
}
InvoiceRequestsFilter.prototype.outOfPocketActReferenceChangedHandle = function(event) {
    this.filter.outOfPocketActReference = jQuery.trim(event.currentTarget.value);
    this.updateOutOfPocketActReferenceView();
}
InvoiceRequestsFilter.prototype.outOfPocketPaymentReferenceChangedHandle = function(event) {
    this.filter.outOfPocketPaymentReference = jQuery.trim(event.currentTarget.value);
    this.updateOutOfPocketPaymentReferenceView();
}

InvoiceRequestsFilter.prototype.startDateChangedHandle = function(dateText, inst) {
    if(isDateValid(dateText)) {
        this.filter.startDate = getYearMonthDateFromDateString(dateText);
    }
    this.updateStartDateView();
}
InvoiceRequestsFilter.prototype.startDateTextChangedHandle = function(event) {
    var dateText = jQuery.trim(event.currentTarget.value);
    if(dateText == '') {
        this.filter.startDate = null;
    } else if(isDateValid(dateText)) {
        this.filter.startDate = getYearMonthDateFromDateString(dateText);
    }
    this.updateStartDateView();
}
InvoiceRequestsFilter.prototype.endDateChangedHandle = function(dateText, inst) {
    if(isDateValid(dateText)) {
        this.filter.endDate = getYearMonthDateFromDateString(dateText);
    }
    this.updateEndDateView();
}
InvoiceRequestsFilter.prototype.endDateTextChangedHandle = function(event) {
    var dateText = jQuery.trim(event.currentTarget.value);
    if(dateText == '') {
        this.filter.endDate = null;
    } else if(isDateValid(dateText)) {
        this.filter.endDate = getYearMonthDateFromDateString(dateText);
    }
    this.updateEndDateView();
}

InvoiceRequestsFilter.prototype.updateView = function() {
    this.updateHasRequestsView();
    this.updateHasInvoiceRequestsView();
    this.updateHasActRequestsView();
    this.updateHasTaxInvoiceRequestsView();
    this.updateHasSuspendedRequestsView();
    this.updateHasActiveRequestsView();
    this.updateHasLockedRequestsView();
    this.updateHasClosedRequestsView();
    
    this.updateInvoiceReferenceView();
    this.updateActReferenceView();
    this.updatePaymentReferenceView();
    this.updateOutOfPocketInvoiceReferenceView();
    this.updateOutOfPocketActReferenceView();
    this.updateOutOfPocketPaymentReferenceView();
    this.updateStartDateView();
    this.updateEndDateView();    
}
InvoiceRequestsFilter.prototype.updateHasRequestsView = function() {
    var options = {"ALL": "All", "TRUE": "Yes", "FALSE": "No"}
    this.updateSelectorView(this.htmlId + '_hasRequests', this.filter.hasRequests, options);
}
InvoiceRequestsFilter.prototype.updateHasInvoiceRequestsView = function() {
    var options = {"ALL": "All", "TRUE": "Yes", "FALSE": "No"}
    this.updateSelectorView(this.htmlId + '_hasInvoiceRequests', this.filter.hasInvoiceRequests, options);
    if(this.filter.hasRequests != 'TRUE') {
        $('#' + this.htmlId + '_hasInvoiceRequestsBlock').hide();
    } else {
        $('#' + this.htmlId + '_hasInvoiceRequestsBlock').show();        
    }
}
InvoiceRequestsFilter.prototype.updateHasActRequestsView = function() {
    var options = {"ALL": "All", "TRUE": "Yes", "FALSE": "No"}
    this.updateSelectorView(this.htmlId + '_hasActRequests', this.filter.hasActRequests, options);
    if(this.filter.hasRequests != 'TRUE') {
        $('#' + this.htmlId + '_hasActRequestsBlock').hide();
    } else {
        $('#' + this.htmlId + '_hasActRequestsBlock').show();        
    }    
}
InvoiceRequestsFilter.prototype.updateHasTaxInvoiceRequestsView = function() {
    var options = {"ALL": "All", "TRUE": "Yes", "FALSE": "No"}
    this.updateSelectorView(this.htmlId + '_hasTaxInvoiceRequests', this.filter.hasTaxInvoiceRequests, options);
    if(this.filter.hasRequests != 'TRUE') {
        $('#' + this.htmlId + '_hasTaxInvoiceRequestsBlock').hide();
    } else {
        $('#' + this.htmlId + '_hasTaxInvoiceRequestsBlock').show();        
    }    
}
InvoiceRequestsFilter.prototype.updateHasSuspendedRequestsView = function() {
    $('#' + this.htmlId + '_hasSuspendedRequests').attr("checked", this.filter.hasSuspendedRequests);
    if(this.filter.hasRequests != 'TRUE') {
        $('#' + this.htmlId + '_hasSuspendedRequestsBlock').hide();
    } else {
        $('#' + this.htmlId + '_hasSuspendedRequestsBlock').show();        
    }
}
InvoiceRequestsFilter.prototype.updateHasActiveRequestsView = function() {
    $('#' + this.htmlId + '_hasActiveRequests').attr("checked", this.filter.hasActiveRequests);
    if(this.filter.hasRequests != 'TRUE') {
        $('#' + this.htmlId + '_hasActiveRequestsBlock').hide();
    } else {
        $('#' + this.htmlId + '_hasActiveRequestsBlock').show();        
    }
}
InvoiceRequestsFilter.prototype.updateHasLockedRequestsView = function() {
    $('#' + this.htmlId + '_hasLockedRequests').attr("checked", this.filter.hasLockedRequests);
    if(this.filter.hasRequests != 'TRUE') {
        $('#' + this.htmlId + '_hasLockedRequestsBlock').hide();
    } else {
        $('#' + this.htmlId + '_hasLockedRequestsBlock').show();        
    }
}
InvoiceRequestsFilter.prototype.updateHasClosedRequestsView = function() {
    $('#' + this.htmlId + '_hasClosedRequests').attr("checked", this.filter.hasClosedRequests);
    if(this.filter.hasRequests != 'TRUE') {
        $('#' + this.htmlId + '_hasClosedRequestsBlock').hide();
    } else {
        $('#' + this.htmlId + '_hasClosedRequestsBlock').show();        
    }
}
InvoiceRequestsFilter.prototype.updateInvoiceReferenceView = function() {
    $('#' + this.htmlId + '_invoiceReference').val(this.filter.invoiceReference);
}
InvoiceRequestsFilter.prototype.updateActReferenceView = function() {
    $('#' + this.htmlId + '_actReference').val(this.filter.actReference);    
}
InvoiceRequestsFilter.prototype.updatePaymentReferenceView = function() {
    $('#' + this.htmlId + '_paymentReference').val(this.filter.paymentReference);    
}
InvoiceRequestsFilter.prototype.updateOutOfPocketInvoiceReferenceView = function() {
    $('#' + this.htmlId + '_outOfPocketInvoiceReference').val(this.filter.outOfPocketInvoiceReference);
}
InvoiceRequestsFilter.prototype.updateOutOfPocketActReferenceView = function() {
    $('#' + this.htmlId + '_outOfPocketActReference').val(this.filter.outOfPocketActReference);
}
InvoiceRequestsFilter.prototype.updateOutOfPocketPaymentReferenceView = function() {
    $('#' + this.htmlId + '_outOfPocketPaymentReference').val(this.filter.outOfPocketPaymentReference);
}
InvoiceRequestsFilter.prototype.updateStartDateView = function() {
    $('#' + this.htmlId + '_startDate').val(getStringFromYearMonthDate(this.filter.startDate));
    if(this.filter.hasRequests != 'TRUE') {
        $('#' + this.htmlId + '_startDateBlock').hide();
    } else {
        $('#' + this.htmlId + '_startDateBlock').show();        
    }
}
InvoiceRequestsFilter.prototype.updateEndDateView = function() {
    $('#' + this.htmlId + '_endDate').val(getStringFromYearMonthDate(this.filter.endDate));
    if(this.filter.hasRequests != 'TRUE') {
        $('#' + this.htmlId + '_endDateBlock').hide();
    } else {
        $('#' + this.htmlId + '_endDateBlock').show();        
    }    
}

InvoiceRequestsFilter.prototype.updateSelectorView = function(id, value, options) {
    var html = '';
    for(var key in options) {
        var isSelected = '';
        if(key == value) {
            isSelected = 'selected';
        }
        html += '<option ' + isSelected + ' value="' + key + '">' + options[key] + '</option>';
    }
    $("#" + id).html(html);
}
InvoiceRequestsFilter.prototype.okHandle = function() {
    this.callback.call(this.callbackContext, this.filter);
}