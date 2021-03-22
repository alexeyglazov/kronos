/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
function InvoiceRequestPacketCreationForm(formData, moduleName, htmlId, successHandler, successContext) {
    this.config = {
        endpointUrl: endpointsFolder+ "InvoiceRequestPacketCreationForm.jsp"
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
        }
    }
    this.loaded = {
        "projectCode": null,
        "client": null,
        "currencies": []
    }
    this.picked = {
        "client": null
    }
    this.data = {
        "mode": formData.mode,
        "id": formData.id,
        "projectCodeId": formData.projectCodeId,
        "createActRequest": false,
        "createTaxInvoiceRequest": false,
        "clientId" : formData.clientId,
        "description" : formData.description,
        "date" : formData.date,
        "invoiceCurrencyId" : formData.invoiceCurrencyId,
        "paymentCurrencyId": formData.paymentCurrencyId,
        "status": formData.status,
        "withVAT": formData.withVAT,
        "comment": formData.comment,
        "invoiceRequestItems": formData.invoiceRequestItems
    }
}
InvoiceRequestPacketCreationForm.prototype.init = function() {
    this.containerHtmlId = getNextPopupHtmlContainer();
    this.loadInitialContent();
    this.dataChanged(false);
}
InvoiceRequestPacketCreationForm.prototype.loadInitialContent = function() {
   var form = this;
    var data = {};
    data.command = "getInitialContent";
    data.projectCodeId = this.data.projectCodeId;
    if(this.data.clientId != null) {
        data.clientId = this.data.clientId;
    }
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      type: "POST",
      cache: false,
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.projectCode = result.projectCode;
            form.loaded.currencies = result.currencies;
            form.picked.client = result.client;
            form.data.clientId = result.client.id;
            form.loaded.feesItem = result.feesItem;
            form.loaded.feesAdvances = result.feesAdvances;
            form.data.description = form.loaded.projectCode.description;
            for(var key in form.data.invoiceRequestItems) {
                form.data.invoiceRequestItems[key].name = form.loaded.projectCode.description;
            }
            if(result.feesItem != null) {
                form.data.invoiceCurrencyId = result.feesItem.feesAdvanceCurrencyId;
                form.data.paymentCurrencyId = result.feesItem.feesPaymentCurrencyId;
            }
            if(result.feesAdvances.length == 1 && form.data.invoiceRequestItems.length > 0) {
                form.data.invoiceRequestItems[0].amount = result.feesAdvances[0].amount;
            }
            if(result.feesAdvances.length == 1) {
                form.data.date = calendarVisualizer.getHtml(result.feesAdvances[0].date);
            }
            form.show();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
InvoiceRequestPacketCreationForm.prototype.getHtml = function() {
    var html = '';
    html += '<table class="datagrid">';
    html += '<tr><td><label for="' + this.htmlId + '_actRequest">Act</label></td><td><div class="comment1" id="' + this.htmlId + '_actRequest_info' + '"></div></td></tr>';
    html += '<tr><td><label for="' + this.htmlId + '_description">Description</label></td><td><textarea id="' + this.htmlId + '_description" style="height: 120px; width: 450px;"></textarea></td></tr>';
    html += '<tr><td><label for="' + this.htmlId + '_invoiceCurrency">Invoice currency</label></td><td><select id="' + this.htmlId + '_invoiceCurrency"></select></td></tr>';
    html += '<tr><td><label for="' + this.htmlId + '_paymentCurrency">Payment currency</label></td><td><select id="' + this.htmlId + '_paymentCurrency"></select></td></tr>';
    html += '<tr><td><label for="' + this.htmlId + '_client">Client</label></td><td><input id="' + this.htmlId + '_client"><button id="' + this.htmlId + '_clientPickBtn' + '">Pick</button><button id="' + this.htmlId + '_clientClearBtn' + '">Reset</button></td></tr>';
    html += '<tr><td><label for="' + this.htmlId + '_date">Date</label></td><td><input id="' + this.htmlId + '_date"></td></tr>';
    html += '<tr><td><label for="' + this.htmlId + '_status">Status</label></td><td><select id="' + this.htmlId + '_status"></select></td></tr>';
    html += '<tr><td><label for="' + this.htmlId + '_withVAT">With VAT</label></td><td><input type="checkbox" id="' + this.htmlId + '_withVAT"></td></tr>';
    html += '<tr><td><label for="' + this.htmlId + '_comment">Internal comment</label></td><td><textarea id="' + this.htmlId + '_comment" style="width: 300px; height: 75px;"></textarea></td></tr>';
    html += '</table>';
    
    html += '<div id="' + this.htmlId + '_invoiceRequestItems' + '"></div>';
    html += '<button id="' + this.htmlId + '_showFeesAdvancesBtn' + '">Show invoices to issue (' + this.loaded.feesAdvances.length + ')</button>';
    return html
}
InvoiceRequestPacketCreationForm.prototype.makeDatePickers = function() {
    var form = this;
    $( '#' + this.htmlId + '_date' ).datepicker({
        dateFormat: 'dd.mm.yy',
        onSelect: function(dateText, inst) {form.dateChangedHandle(dateText, inst)}
    });
}
InvoiceRequestPacketCreationForm.prototype.makeButtons = function() {
    var form = this;
    $('#' + this.htmlId + '_clientPickBtn')
      .button({
        icons: {
            primary: "ui-icon-search"
        },
        text: false
        })
      .click(function( event ) {
        form.clientPickHandle.call(form);
    });    
    $('#' + this.htmlId + '_clientClearBtn')
      .button({
        icons: {
            primary: "ui-icon-trash"
        },
        text: false
        })
      .click(function( event ) {
        form.clientClearHandle.call(form);
    });
    $('#' + this.htmlId + '_showFeesAdvancesBtn')
      .button({
        icons: {
            primary: "ui-icon-comment"
        },
        text: true
        })
      .click(function( event ) {
        form.showFeesAdvances.call(form);
    }); 
}
InvoiceRequestPacketCreationForm.prototype.setHandlers = function() {
    var form = this;
    $('#' + this.htmlId + '_actRequest').bind("change", function(event) {form.actRequestChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_description').bind("change", function(event) {form.descriptionChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_invoiceCurrency').bind("change", function(event) {form.invoiceCurrencyChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_paymentCurrency').bind("change", function(event) {form.paymentCurrencyChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_date').bind("change", function(event) {form.dateTextChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_status').bind("change", function(event) {form.statusChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_comment').bind("change", function(event) {form.commentChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_withVAT').bind("click", function(event) {form.withVATClickedHandle.call(form, event);});
}
InvoiceRequestPacketCreationForm.prototype.actRequestChangedHandle = function(event) {
    var valueTxt = event.currentTarget.value;
    if(valueTxt == '') {
        this.data.actRequestId = null;
    } else {
        this.data.actRequestId = parseInt(valueTxt);
        this.data.createActRequest = false;
        this.data.createTaxInvoiceRequest = false;
    }
    this.updateActRequestView();
    this.dataChanged(true);
}
InvoiceRequestPacketCreationForm.prototype.createActRequestClickHandle = function(event) {
    var isChecked = $(event.currentTarget).is(":checked");
    if(isChecked) {
        this.data.createActRequest = true;
    } else {
        this.data.createActRequest = false;
        this.data.createTaxInvoiceRequest = false;
    }
    this.updateActRequestView();
}
InvoiceRequestPacketCreationForm.prototype.createTaxInvoiceRequestClickHandle = function(event) {
    var isChecked = $(event.currentTarget).is(":checked");
    if(isChecked) {
        this.data.createTaxInvoiceRequest = true;
    } else {
        this.data.createTaxInvoiceRequest = false;
    }
    this.updateActRequestView();
}
InvoiceRequestPacketCreationForm.prototype.descriptionChangedHandle = function(event) {
    this.data.description = jQuery.trim(event.currentTarget.value);
    this.updateDescriptionView();
    this.dataChanged(true);
}
InvoiceRequestPacketCreationForm.prototype.commentChangedHandle = function(event) {
    this.data.comment = jQuery.trim(event.currentTarget.value);
    this.updateCommentView();
    this.dataChanged(true);
}
InvoiceRequestPacketCreationForm.prototype.invoiceCurrencyChangedHandle = function(event) {
    var valueTxt = event.currentTarget.value;
    if(valueTxt == '') {
        this.data.invoiceCurrencyId = null;
    } else {
        this.data.invoiceCurrencyId = parseInt(valueTxt);
    }
    this.updateInvoiceCurrencyView();
    this.makeInvoiceRequestItemsLayout();
    this.updateInvoiceRequestItemNamesView();
    this.updateInvoiceRequestItemAmountsView();
    this.dataChanged(true);
}
InvoiceRequestPacketCreationForm.prototype.paymentCurrencyChangedHandle = function(event) {
    var valueTxt = event.currentTarget.value;
    if(valueTxt == '') {
        this.data.paymentCurrencyId = null;
    } else {
        this.data.paymentCurrencyId = parseInt(valueTxt);
    }
    this.updatePaymentCurrencyView();
    this.makeInvoiceRequestItemsLayout();
    this.updateInvoiceRequestItemNamesView();
    this.updateInvoiceRequestItemAmountsView();
    this.dataChanged(true);
}
InvoiceRequestPacketCreationForm.prototype.dateChangedHandle = function(dateText, inst) {
    this.data.date = dateText;
    this.updateDateView();
    this.dataChanged(true);
}
InvoiceRequestPacketCreationForm.prototype.dateTextChangedHandle = function(event) {
    this.data.date = jQuery.trim(event.currentTarget.value);
    this.updateDateView();
    this.dataChanged(true);
}
InvoiceRequestPacketCreationForm.prototype.statusChangedHandle = function(event) {
    this.data.status = jQuery.trim(event.currentTarget.value);
    if(this.data.status == '') {
        this.data.status = null;
    }    
    this.updateStatusView();
    this.dataChanged(true);
}
InvoiceRequestPacketCreationForm.prototype.withVATClickedHandle = function(event) {
    this.data.withVAT = $(event.currentTarget).is(":checked");
    this.updateWithVATView();
    this.dataChanged(true);
}
InvoiceRequestPacketCreationForm.prototype.clientPickHandle = function() {
    var formData = {
        "mode": 'SINGLE'
    };
    this.clientPicker = new ClientPicker(formData, "clientPicker", this.clientPicked, this, this.moduleName);
    this.clientPicker.init();
}
InvoiceRequestPacketCreationForm.prototype.clientPicked = function(client) {
    this.picked.client = client;
    this.data.clientId = client.id;
    this.updateClientView();
}
InvoiceRequestPacketCreationForm.prototype.clientClearHandle = function() {
    this.picked.client = null;
    this.data.clientId = null;
    this.updateClientView();
}
InvoiceRequestPacketCreationForm.prototype.invoiceRequestItemNameChangedHandle = function(event) {
    var idTxt = $(event.currentTarget).attr("id");
    var parts = idTxt.split('_');
    var index = parseInt(parts[parts.length - 1]);
    var value = jQuery.trim($(event.currentTarget).val());
    this.data.invoiceRequestItems[index].name = value;
    this.updateInvoiceRequestItemNamesView();
}
InvoiceRequestPacketCreationForm.prototype.invoiceRequestItemAmountChangedHandle = function(event) {
    var idTxt = $(event.currentTarget).attr("id");
    var parts = idTxt.split('_');
    var index = parseInt(parts[parts.length - 1]);
    var value = jQuery.trim($(event.currentTarget).val());
    value = value.getReducedToNumber();
    this.data.invoiceRequestItems[index].amount = value;
    this.updateInvoiceRequestItemAmountsView();
}
InvoiceRequestPacketCreationForm.prototype.addInvoiceRequestItem = function(event) {
    this.data.invoiceRequestItems.push({"name": null, "amount": null});
    this.makeInvoiceRequestItemsLayout();
    this.updateInvoiceRequestItemNamesView();
    this.updateInvoiceRequestItemAmountsView();
}
InvoiceRequestPacketCreationForm.prototype.removeInvoiceRequestItem = function(event) {
    var idTxt = $(event.currentTarget).attr("id");
    var parts = idTxt.split('_');
    var index = parseInt(parts[parts.length - 1]);
    this.data.invoiceRequestItems.splice(index, 1);
    this.makeInvoiceRequestItemsLayout();
    this.updateInvoiceRequestItemNamesView();
    this.updateInvoiceRequestItemAmountsView();
}
InvoiceRequestPacketCreationForm.prototype.showFeesAdvances = function(event) {
    var message = '';
    var currencyCode = null;
    if(this.loaded.feesItem != null) {
        for(var key in this.loaded.currencies) {
            var currency = this.loaded.currencies[key];
            if(currency.id == this.loaded.feesItem.feesAdvanceCurrencyId) {
                currencyCode = currency.code;
            }
        }
    }
    message += '<table class="datagrid">';
    message += '<tr class="dgHeader">';
    message += '<td>Amount' + (currencyCode != null ? ' (' + currencyCode + ')' : '') + '</td>';
    message += '<td>Advance</td>';
    message += '<td>Date</td>';
    message += '</tr>';
    if(this.loaded.feesAdvances.length > 0) {
        for(var key in this.loaded.feesAdvances) {
            var feesAdvance = this.loaded.feesAdvances[key];
            message += '<tr>';
            message += '<td>' + feesAdvance.amount + '</td>';
            message += '<td>' + booleanVisualizer.getHtml(feesAdvance.isAdvance) + '</td>';
            message += '<td>' + calendarVisualizer.getHtml(feesAdvance.date) + '</td>';
            message += '</tr>';
        }
    } else {
        message += '<tr><td colspan="3">No data</td></tr>';
    }
    message += '</table>';
    showPopup('Invoices to issue', message, 300, 250, null, null)    
}
InvoiceRequestPacketCreationForm.prototype.updateView = function(event) {
    this.updateActRequestView();
    this.updateInvoiceCurrencyView();
    this.updatePaymentCurrencyView();
    this.updateClientView();
    this.updateDescriptionView();
    this.updateDateView();
    this.updateStatusView();
    this.updateCommentView();
    this.updateWithVATView();
    this.makeInvoiceRequestItemsLayout();
    this.updateInvoiceRequestItemNamesView();
    this.updateInvoiceRequestItemAmountsView();
}
InvoiceRequestPacketCreationForm.prototype.updateActRequestView = function() {
    var actRequestInfo = ''
    actRequestInfo += '<label for="' + this.htmlId + '_createActRequest">Create Act</label> <input type="checkbox" id="' + this.htmlId + '_createActRequest"><br />';
    if(this.data.createActRequest) {
        actRequestInfo += '<label for="' + this.htmlId + '_createTaxInvoiceRequest">Create Tax Invoice</label> <input type="checkbox" id="' + this.htmlId + '_createTaxInvoiceRequest"><div class="comment1" id="' + this.htmlId + '_actRequest_info1' + '"></div><br />';
    }
    $('#' + this.htmlId + '_actRequest_info').html(actRequestInfo);
    var form = this;
    $('#' + this.htmlId + '_createActRequest').bind("click", function(event) {form.createActRequestClickHandle.call(form, event);});
    $('#' + this.htmlId + '_createTaxInvoiceRequest').bind("click", function(event) {form.createTaxInvoiceRequestClickHandle.call(form, event);});
    
    $('#' + this.htmlId + '_createActRequest').attr("checked", this.data.createActRequest);
    $('#' + this.htmlId + '_createTaxInvoiceRequest').attr("checked", this.data.createTaxInvoiceRequest);
}
InvoiceRequestPacketCreationForm.prototype.updateInvoiceCurrencyView = function() {
    var html = '';
    html += '<option value="" >...</option>';
    for(var key in this.loaded.currencies) {
        var currency = this.loaded.currencies[key];
        var isSelected = "";
        if(currency.id == this.data.invoiceCurrencyId) {
           isSelected = "selected";
        }
        html += '<option value="' + currency.id + '" ' + isSelected + '>' + currency.code + '</option>';
    }
    $('#' + this.htmlId + '_invoiceCurrency').html(html);
}
InvoiceRequestPacketCreationForm.prototype.updatePaymentCurrencyView = function() {
    var html = '';
    html += '<option value="" >...</option>';
    for(var key in this.loaded.currencies) {
        var currency = this.loaded.currencies[key];
        var isSelected = "";
        if(currency.id == this.data.paymentCurrencyId) {
           isSelected = "selected";
        }
        html += '<option value="' + currency.id + '" ' + isSelected + '>' + currency.code + '</option>';
    }
    $('#' + this.htmlId + '_paymentCurrency').html(html);
}
InvoiceRequestPacketCreationForm.prototype.makeInvoiceRequestItemsLayout = function() {
    var html = '';
    var currency = null;
    if(this.data.invoiceCurrencyId != null) {
        for(var key in this.loaded.currencies) {
            if(this.loaded.currencies[key].id == this.data.invoiceCurrencyId) {
                currency = this.loaded.currencies[key];
                break;
            }
        }
    }
    html += '<table class="datagrid">';
    html += '<tr class="dgHeader"><td>Name</td><td>Amount ' + ((currency != null) ? (' (' + currency.code) + ')' : '') + '</td><td></td></tr>';
    if(this.data.invoiceRequestItems != null && this.data.invoiceRequestItems.length > 0) {
        for(var key in this.data.invoiceRequestItems) {
            //var invoiceRequestItem = this.data.invoiceRequestItems[key];
            html += '<tr>';
            html += '<td><textarea type="text" id="' + this.htmlId + '_invoiceRequestItem_name_' + key + '" style="width: 450px; height: 120px;"></textarea></td>';
            html += '<td><input type="text" id="' + this.htmlId + '_invoiceRequestItem_amount_' + key + '" style="width: 70px;"></td>';
            html += '<td><button id="' + this.htmlId + '_removeInvoiceRequestItemBtn_' + key + '">Remove</button></td>';
            html += '</tr>';
        }
    } else {
        html += '<tr><td colspan="3">No items</td></tr>';
    }
    html += '<tr><td>Total</td><td><span id="' + this.htmlId + '_totalAmount"></span></td><td></td></tr>';
    html += '<tr><td colspan="3"><button id="' + this.htmlId + '_addInvoiceRequestItemBtn">Add</button></td></tr>';
    html += '</table>';
    $('#' + this.htmlId + '_invoiceRequestItems').html(html);
    
    var form = this;
    $('#' + this.htmlId + '_addInvoiceRequestItemBtn')
      .button({
        icons: {
            primary: "ui-icon-plus"
        },
        text: true
        })
      .click(function( event ) {
        form.addInvoiceRequestItem.call(form);
    });    
    
    $('button[id^="' + this.htmlId + '_removeInvoiceRequestItemBtn_"]')
      .button({
        icons: {
            primary: "ui-icon-trash"
        },
        text: false
        })
      .click(function( event ) {
        form.removeInvoiceRequestItem.call(form, event);
    });    
    
    $('textarea[id^="' + this.htmlId + '_invoiceRequestItem_name_"]').bind("change", function(event) {form.invoiceRequestItemNameChangedHandle.call(form, event);});
    $('input[id^="' + this.htmlId + '_invoiceRequestItem_amount_"]').bind("change", function(event) {form.invoiceRequestItemAmountChangedHandle.call(form, event);});
}
InvoiceRequestPacketCreationForm.prototype.updateClientView = function() {
    $('#' + this.htmlId + '_client').attr("disabled", true);
    if(this.picked.client != null) {
        $('#' + this.htmlId + '_client').val(this.picked.client.name);
    } else {
        $('#' + this.htmlId + '_client').val('');
    }
}
InvoiceRequestPacketCreationForm.prototype.updateDescriptionView = function() {
    $('#' + this.htmlId + '_description').val(this.data.description);
}
InvoiceRequestPacketCreationForm.prototype.updateCommentView = function() {
    $('#' + this.htmlId + '_comment').val(this.data.comment);
}
InvoiceRequestPacketCreationForm.prototype.updateDateView = function() {
    $('#' + this.htmlId + '_date').val(this.data.date);
}
InvoiceRequestPacketCreationForm.prototype.updateStatusView = function() {
    var html = '';
    html += '<option value="" >...</option>';
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
InvoiceRequestPacketCreationForm.prototype.updateWithVATView = function() {
    $('#' + this.htmlId + '_withVAT').attr("checked", this.data.withVAT);
}
InvoiceRequestPacketCreationForm.prototype.updateInvoiceRequestItemNamesView = function() {
    for(var key in this.data.invoiceRequestItems) {
        var invoiceRequestItem = this.data.invoiceRequestItems[key];
        $('#' + this.htmlId + '_invoiceRequestItem_name_' + key).val(invoiceRequestItem.name);
    }
}
InvoiceRequestPacketCreationForm.prototype.updateInvoiceRequestItemAmountsView = function() {
    var totalAmount = 0;
    var hasBadValue = false;
    for(var key in this.data.invoiceRequestItems) {
        var invoiceRequestItem = this.data.invoiceRequestItems[key];
        $('#' + this.htmlId + '_invoiceRequestItem_amount_' + key).val(invoiceRequestItem.amount);
        if(invoiceRequestItem.amount == null || isNaN(invoiceRequestItem.amount)) {
            hasBadValue = true;
        } else {
            totalAmount += parseFloat(invoiceRequestItem.amount);
        }
    }
    if(! hasBadValue) {
        $('#' + this.htmlId + '_totalAmount').html(totalAmount);
    } else {
        $('#' + this.htmlId + '_totalAmount').html('NaN');
    }
}
InvoiceRequestPacketCreationForm.prototype.show = function() {
    var title = 'Create Invoice Request Packet';
    var form = this;
    $('#' + this.containerHtmlId).html(this.getHtml());
    this.makeDatePickers();
    this.makeButtons();
    this.setHandlers();
    this.updateView();   
    $('#' + this.containerHtmlId).dialog({
        title: title,
        modal: true,
        position: 'center',
        width: 800,
        height: 700,
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
InvoiceRequestPacketCreationForm.prototype.validate = function() {
    var errors = [];
    var integerRE = /^[0-9]*$/;
    var float2digitsRE = /^[0-9]*\.?[0-9]{0,2}$/;
    if(this.data.clientId == null) {
        errors.push("Client is not set");
    }
    if(this.data.status === null) {
        errors.push("Status is not set");
    } else if(this.data.status == 'CLOSED' || this.data.status == 'LOCKED') {
        errors.push("Saving request with LOCKED or CLOSED status is not allowed");
    }
    if(this.data.description == null || this.data.description == "") {
        errors.push("Description is not set");
    }
    if(this.data.invoiceCurrencyId === null) {
        errors.push("Invoice Currency is not set");
    }
    if(this.data.paymentCurrencyId === null) {
        errors.push("Payment Currency is not set");
    }
    if(this.data.date == null || this.data.date == "") {
        errors.push("Date is not set");
    } else if(! isDateValid(this.data.date)) {
        errors.push("Date has incorrect format");
    }
    if(this.data.invoiceRequestItems == null || this.data.invoiceRequestItems.length == 0) {
        errors.push("At least one invoice request item should be defined");
    } else {
        for(var key in this.data.invoiceRequestItems) {
            var invoiceRequestItem = this.data.invoiceRequestItems[key];
            if(invoiceRequestItem.name == null || invoiceRequestItem.name == "") {
                errors.push('Name for item ' + key + ' is not set');
            }
            if(invoiceRequestItem.amount == null || invoiceRequestItem.amount == "") {
                errors.push('Amount for item ' + key + ' is not set');
            } else if(!float2digitsRE.test(invoiceRequestItem.amount)) {
                errors.push('Amount for item ' + key + ' has incorrect format. Digits, decimal point and two digits after the point are allowed only.');
            }
        }
    }
    return errors;
}
InvoiceRequestPacketCreationForm.prototype.save = function() {
    var errors = this.validate();
    if(errors.length > 0) {
        showErrors(errors);
        return;
    }
    var serverFormatData = clone(this.data);
    serverFormatData.date = getYearMonthDateFromDateString(serverFormatData.date);
    var form = this;
    var data = {};
    data.command = "saveInvoiceRequestPacket";
    data.invoiceRequestPacketCreationForm = getJSON(serverFormatData);
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
InvoiceRequestPacketCreationForm.prototype.afterSave = function() {
    $('#' + this.containerHtmlId).dialog("close");
    this.successHandler.call(this.successContext);
}
InvoiceRequestPacketCreationForm.prototype.dataChanged = function(value) {
    dataChanged = value;
}




//==================================================

function InvoiceRequestPacketDeleteForm(invoiceRequestPacketId, successHandler, successContext) {
    this.config = {
        endpointUrl: endpointsFolder+ "InvoiceRequestPacketCreationForm.jsp"
    };
    this.successHandler = successHandler;
    this.successContext = successContext;
    this.data = {
        "id": invoiceRequestPacketId
    }
}
InvoiceRequestPacketDeleteForm.prototype.init = function() {
    this.checkDependencies();
}
InvoiceRequestPacketDeleteForm.prototype.checkDependencies = function() {
    var form = this;
    var data = {};
    data.command = "checkInvoiceRequestPacketDependencies";
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
InvoiceRequestPacketDeleteForm.prototype.analyzeDependencies = function(dependencies) {
    if(dependencies.hasClosedStatusInHistory == true) {
        var html = 'This Invoice Request Packet was once closed. So it can not be deleted.';
        doAlert("Alert", html, null, null);
    } else  {
        this.show();
    }
}
InvoiceRequestPacketDeleteForm.prototype.show = function() {
  doConfirm("Confirm", "Proceed to delete this Invoice Request Packet?", this, function() {this.doDeleteInvoiceRequestPacket()}, null, null);
}
InvoiceRequestPacketDeleteForm.prototype.doDeleteInvoiceRequestPacket = function() {
    var form = this;
    var data = {};
    data.command = "deleteInvoiceRequestPacket";
    data.id = this.data.id;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            doAlert("Info", "InvoiceRequestPacket has been successfully deleted", form, form.afterSave);
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
InvoiceRequestPacketDeleteForm.prototype.afterSave = function() {
    this.successHandler.call(this.successContext);
}
