/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
function FeesItemEditForm(formData, htmlId, successHandler, successContext) {
    this.config = {
        endpointUrl: endpointsFolder+ "FeesItemEditForm.jsp"
    };
    this.htmlId = htmlId;
    this.successHandler = successHandler;
    this.successContext = successContext;
    this.enums = {
        "types": {
            "FLAT_FEE": "Flat Fee",
            "TIMESPENT": "Timespent",
            "QUOTATION": "Quotation"
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
        "date": formData.date,
        "projectCodeId": formData.projectCodeId,

        "type" : formData.type,
        "feesAdvanceCurrencyId" : formData.feesAdvanceCurrencyId,
        "feesInvoiceCurrencyId" : formData.feesInvoiceCurrencyId,
        "feesPaymentCurrencyId" : formData.feesPaymentCurrencyId,
        "feesActCurrencyId" : formData.feesActCurrencyId,

        "positionQuotations": formData.positionQuotations,
        "quotationCurrencyRate": formData.quotationCurrencyRate,
        "quotationNegociated": formData.quotationNegociated,

        "vat": formData.vat,
        "comment": formData.comment
    }
}
FeesItemEditForm.prototype.init = function() {
    this.containerHtmlId = getNextPopupHtmlContainer();

    this.loadInitialContent();
    this.dataChanged(false);
}
FeesItemEditForm.prototype.loadInitialContent = function() {
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
            form.loaded.positions = result.positions;
            form.loaded.currencies = result.currencies;
            form.loaded.standardSellingRateBlock = result.standardSellingRateBlock;
            form.show();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
FeesItemEditForm.prototype.getHtml = function() {
    var html = '';
    html += '<div class="comment1">' + calendarVisualizer.getHtml(this.loaded.projectCode.startDate) + '-' + calendarVisualizer.getHtml(this.loaded.projectCode.endDate) + ', ' + this.loaded.projectCode.description + '</div>';

    html += '<table>';
    html += '<tr><td><label for="' + this.htmlId + '_type">Type</label></td><td><select id="' + this.htmlId + '_type"></select></td></tr>';
    html += '</table>';
    html += '<table class="datagrid">';
    html += '<tr class="dgHeader"><td><label for="' + this.htmlId + '_advanceCurrency">Invoice to Issue Currency</label></td><td><label for="' + this.htmlId + '_invoiceCurrency">Invoice Issued Currency</label></td><td><label for="' + this.htmlId + '_paymentCurrency">Payment Currency</label></td><td><label for="' + this.htmlId + '_actCurrency">Act Currency</label></td></tr>';
    html += '<tr><td><select id="' + this.htmlId + '_feesAdvanceCurrency"></select></td><td><select id="' + this.htmlId + '_feesInvoiceCurrency"></select></td><td><select id="' + this.htmlId + '_feesPaymentCurrency"></select></td><td><select id="' + this.htmlId + '_feesActCurrency"></select></td></tr>';
    html += '</table>';
    html += '<div id="' + this.htmlId + '_nonQuotationData"></div>'
    html += '<div id="' + this.htmlId + '_quotationData"></div>'
    
    html += '<table>';
    html += '<tr>';
    html += '<td><label for="' + this.htmlId + '_vat">VAT</label></td>';
    html += '<td><input type="input" id="' + this.htmlId + '_vat" style="width: 50px;">%</td>';
    html += '</tr>';
    html += '</table>';

    html += '<table>';
    html += '<tr><td><label for="' + this.htmlId + '_comment">Comment</label></td></tr><tr><td><textarea type="input" id="' + this.htmlId + '_comment" style="width: 350px; height: 100px;"></textarea></td></tr>';
    html += '</table>';
    return html
}
FeesItemEditForm.prototype.updateNonQuotationDataView = function() {
    var html = '';
    $('#' + this.htmlId + '_nonQuotationData').html(html);
}
FeesItemEditForm.prototype.updateQuotationDataView = function() {
    var html = '';
    html += '<table class="datagrid">';
    html += '<tr class="dgHeader">';
    html += '<td colspan="7">';
    html += '<label for="' + this.htmlId + '_quotationInvoicingCurrency">Invoicing Currency: </label> <span id="' + this.htmlId + '_quotationInvoicingCurrency"></span>, ';
    html += '<input id="' + this.htmlId + '_quotationCurrencyRate" style="width: 50px;"> <label id="' + this.htmlId + '_quotationCurrencyRateComment"></label> ';
    html += '</td>';
    html += '</tr>';
    html += '<tr class="dgHeader">';
    html += '<td><span class="label1">Standard Position</span></td>';
    html += '<td><span class="label1">Position</span></td>';
    html += '<td><span class="label1">Time</span></td>';
    html += '<td><span class="label1">Rate</span></td>';
    html += '<td><span class="label1">Total (Standard)</span></td>';
    html += '<td><span class="label1">Total (Invoicing)</span></td>';
    html += '<td colspan="2">&nbsp;</td>';
    html += '</tr>'
    for(var key in this.loaded.positions) {
        var position = this.loaded.positions[key];
        html += '<tr>';
        html += '<td>' + position.standardPositionName + '</td>';
        html += '<td>' + position.positionName + '</td>';
        html += '<td><input type="input" id="' + this.htmlId + '_quotationTime_' + position.id + '" style="width: 50px;"></td>';
        html += '<td><span id="' + this.htmlId + '_quotationSellingRate_' + position.id + '"></span></td>';
        html += '<td><span id="' + this.htmlId + '_quotationStandardValue_' + position.id + '"></span></td>';
        html += '<td><span id="' + this.htmlId + '_quotationInvoicingValue_' + position.id + '"></span></td>';
        html += '<td colspan="2">&nbsp;</td>';
        html += '</tr>';
    }
    html += '<tr class="dgHighlight">';
    html += '<td colspan="5">&nbsp;</td>';
    html += '<td><span class="label1">Negociated</span></td>';
    html += '<td><span class="label1">Discount</span></td>';
    html += '</tr>'
    html += '<tr>';
    html += '<td>&nbsp;</td>';
    html += '<td>&nbsp;</td>';
    html += '<td><span id="' + this.htmlId + '_quotationTime"></span></td>';
    html += '<td><span id="' + this.htmlId + '_quotationStandardValue"></span></td>';
    html += '<td><span id="' + this.htmlId + '_quotationInvoicingValue"></span></td>';
    html += '<td style="white-space:nowrap;"><input type="input" id="' + this.htmlId + '_quotationNegociated" style="width: 50px;"><span id="' + this.htmlId + '_quotationNegociatedCurrency"></span></td>';
    html += '<td><span id="' + this.htmlId + '_quotationDiscount"></span></td>';
    html += '</tr>'
    html += '</table>';
    $('#' + this.htmlId + '_quotationData').html(html);
}
FeesItemEditForm.prototype.makeDatePickers = function() {
    var form = this;
    $( '#' + this.htmlId + '_agreementDate' ).datepicker({
        dateFormat: 'dd.mm.yy',
        onSelect: function(dateText, inst) {form.agreementDateChangedHandle(dateText, inst)}
    });
}
FeesItemEditForm.prototype.setHandlers = function() {
    var form = this;
    $('#' + this.htmlId + '_type').bind("change", function(event) {form.typeChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_type').bind("keyup", function(event) {form.typeChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_feesAdvanceCurrency').bind("change", function(event) {form.feesAdvanceCurrencyChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_feesInvoiceCurrency').bind("change", function(event) {form.feesInvoiceCurrencyChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_feesPaymentCurrency').bind("change", function(event) {form.feesPaymentCurrencyChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_feesActCurrency').bind("change", function(event) {form.feesActCurrencyChangedHandle.call(form, event);});

    $('#' + this.htmlId + '_quotationInvoicingCurrency').bind("change", function(event) {form.quotationInvoicingCurrencyChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_quotationCurrencyRate').bind("change", function(event) {form.quotationCurrencyRateChangedHandle.call(form, event);});
    $('input[id^="' + this.htmlId + '_quotationTime_"]').bind("change", function(event) {form.quotationTimeChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_quotationNegociated').bind("change", function(event) {form.quotationNegociatedChangedHandle.call(form, event);});

    $('#' + this.htmlId + '_vat').bind("change", function(event) {form.vatChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_comment').bind("change", function(event) {form.commentChangedHandle.call(form, event);});
}
FeesItemEditForm.prototype.typeChangedHandle = function(event) {
    var valueTxt = event.currentTarget.value;
    if(valueTxt == '') {
        this.data.type = null;
    } else {
        this.data.type = valueTxt;
    }
    if(this.data.type == 'QUOTATION' && (this.loaded.standardSellingRateBlock.currencyId == this.data.feesInvoiceCurrencyId)) {
        this.data.quotationCurrencyRate =  1.0;
    }
    this.updateTypeView();
    this.updateQuotationView();
    this.dataChanged(true);
}
FeesItemEditForm.prototype.feesAdvanceCurrencyChangedHandle = function(event) {
    var valueTxt = event.currentTarget.value;
    if(valueTxt == '') {
        this.data.feesAdvanceCurrencyId = null;
    } else {
        this.data.feesAdvanceCurrencyId = parseInt(valueTxt);
    }
    this.updateFeesAdvanceCurrencyView();
    this.dataChanged(true);
}
FeesItemEditForm.prototype.feesInvoiceCurrencyChangedHandle = function(event) {
    var valueTxt = event.currentTarget.value;
    if(valueTxt == '') {
        this.data.feesInvoiceCurrencyId = null;
    } else {
        this.data.feesInvoiceCurrencyId = parseInt(valueTxt);
    }
    if(this.loaded.standardSellingRateBlock.currencyId == this.data.feesInvoiceCurrencyId) {
        this.data.quotationCurrencyRate = 1.0;
    }
    this.updateFeesInvoiceCurrencyView();
    this.updateQuotationView();
    this.dataChanged(true);
}
FeesItemEditForm.prototype.feesPaymentCurrencyChangedHandle = function(event) {
    var valueTxt = event.currentTarget.value;
    if(valueTxt == '') {
        this.data.feesPaymentCurrencyId = null;
    } else {
        this.data.feesPaymentCurrencyId = parseInt(valueTxt);
    }
    this.updateFeesPaymentCurrencyView();
    this.dataChanged(true);
}
FeesItemEditForm.prototype.feesActCurrencyChangedHandle = function(event) {
    var valueTxt = event.currentTarget.value;
    if(valueTxt == '') {
        this.data.feesActCurrencyId = null;
    } else {
        this.data.feesActCurrencyId = parseInt(valueTxt);
    }
    this.updateFeesActCurrencyView();
    this.dataChanged(true);
}
FeesItemEditForm.prototype.quotationCurrencyRateChangedHandle = function(event) {
    var test = parseFloat(jQuery.trim(event.currentTarget.value));
    if(! isNaN(test)) {
        this.data.quotationCurrencyRate = test;
    }
    this.updateQuotationView();
    this.dataChanged(true);
}
FeesItemEditForm.prototype.quotationTimeChangedHandle = function(event) {
    var htmlId=event.currentTarget.id;
    var parts = htmlId.split("_");
    var positionId = parseInt(parts[parts.length - 1]);
    var item = this.getPositionQuotationByPositionId(positionId);
    if(item == null) {
        item = {
            id: null,
            positionId: positionId,
            time: 0
        }
        this.data.positionQuotations.push(item);
    }
    var test = parseFloat(jQuery.trim(event.currentTarget.value));
    if(! isNaN(test)) {
        if(parseInt(test/0.25)!=parseFloat(test/0.25)) {
            item.time = 0.25 * parseInt(test/0.25);
        }else {
            item.time = test;
        }
    }
    
    this.updateQuotationView();
    this.dataChanged(true);
}
FeesItemEditForm.prototype.quotationNegociatedChangedHandle = function(event) {
    var test = jQuery.trim(event.currentTarget.value);
    if(test == "") {
        this.data.quotationNegociated = null;
    } else if(! isNaN(parseFloat(test))) {
        this.data.quotationNegociated = 0.25 * parseInt(test / 0.25);
    }
    this.updateQuotationView();
    this.dataChanged(true);
}
FeesItemEditForm.prototype.vatChangedHandle = function(event) {
    var test = parseFloat(jQuery.trim(event.currentTarget.value));
    if(! isNaN(test)) {
        this.data.vat = test;
    }
    this.updateVatView();
    this.dataChanged(true);
}
FeesItemEditForm.prototype.commentChangedHandle = function(event) {
    this.data.comment = jQuery.trim(event.currentTarget.value);
    this.updateCommentView();
    this.dataChanged(true);
}

FeesItemEditForm.prototype.updateView = function(event) {
    this.updateNonQuotationDataView();
    this.updateQuotationDataView();

    this.updateFeesAdvanceCurrencyView();
    this.updateFeesInvoiceCurrencyView();
    this.updateFeesPaymentCurrencyView();
    this.updateFeesActCurrencyView();
    this.updateQuotationView();
    this.updateVatView();
    this.updateCommentView();

    this.updateTypeView();
}

FeesItemEditForm.prototype.updateQuotationView = function() {
    var timeTotal = 0;
    var standardValueTotal = 0;
    var invoicingValueTotal = 0;
    var standardCurrency = this.getCurrencyById(this.loaded.standardSellingRateBlock.currencyId);
    var invoicingCurrency = this.getCurrencyById(this.data.feesInvoiceCurrencyId);
    var standardCurrencyCode = standardCurrency != null ? standardCurrency.code : null;
    var invoicingCurrencyCode = invoicingCurrency != null ? invoicingCurrency.code : null;;
    if(invoicingCurrency != null) {
        $('#' + this.htmlId + '_quotationInvoicingCurrency').html(invoicingCurrencyCode);
        $('#' + this.htmlId + '_quotationCurrencyRateComment').html(invoicingCurrencyCode + ' for 1 ' + standardCurrencyCode);
    } else {
        $('#' + this.htmlId + '_quotationInvoicingCurrency').html('-');
        $('#' + this.htmlId + '_quotationCurrencyRateComment').html('- for 1 ' + standardCurrencyCode);
    }   
    
    $('#' + this.htmlId + '_quotationCurrencyRate').val(this.data.quotationCurrencyRate);
    $('#' + this.htmlId + '_quotationCurrencyRate').attr("disabled", this.loaded.standardSellingRateBlock.currencyId == this.data.feesInvoiceCurrencyId);
    
    for(var key in this.loaded.positions) {
        var position = this.loaded.positions[key];
        var standardSellingRateItem = this.getStandardSellingRateItemByPositionId(position.id);
        var sellingRate = standardSellingRateItem != null ? standardSellingRateItem.amount : null;
        var positionQuotation = this.getPositionQuotationByPositionId(position.id);
        if(positionQuotation == null) {
            $('#' + this.htmlId + '_quotationTime_' + position.id).val('');
            $('#' + this.htmlId + '_quotationSellingRate_' + position.id).html(sellingRate != null ? sellingRate : '-');
            $('#' + this.htmlId + '_quotationStandardValue_' + position.id).html('-');
            $('#' + this.htmlId + '_quotationInvoicingValue_' + position.id).html('-');
        } else {
            var time = positionQuotation.time;
            var standardValue = time * sellingRate;
            var invoicingValue = standardValue;
            if(this.loaded.standardSellingRateBlock.currencyId != this.data.feesInvoiceCurrencyId) {
                invoicingValue = standardValue * this.data.quotationCurrencyRate;
            }
            $('#' + this.htmlId + '_quotationTime_' + position.id).val(time);
            $('#' + this.htmlId + '_quotationSellingRate_' + position.id).html(sellingRate);
            $('#' + this.htmlId + '_quotationStandardValue_' + position.id).html(standardValue + ' ' + (standardCurrency != null ? standardCurrency.code : ''));
            $('#' + this.htmlId + '_quotationInvoicingValue_' + position.id).html(invoicingValue + ' ' + (invoicingCurrency != null ? invoicingCurrency.code : ''));
            timeTotal += time;
            standardValueTotal += standardValue;
            invoicingValueTotal += invoicingValue;
        }       
    }
    var discount = "";
    if(this.data.quotationNegociated != null && invoicingValueTotal != null) {
        discount = (invoicingValueTotal - this.data.quotationNegociated)/invoicingValueTotal;
    }
    $('#' + this.htmlId + '_quotationTime').html(timeTotal);
    $('#' + this.htmlId + '_quotationStandardValue').html(standardValueTotal + ' ' + (standardCurrency != null ? standardCurrency.code : ''));
    $('#' + this.htmlId + '_quotationInvoicingValue').html(invoicingValueTotal + ' ' + (invoicingCurrency != null ? invoicingCurrency.code : ''));
    $('#' + this.htmlId + '_quotationNegociated').val(this.data.quotationNegociated);
    $('#' + this.htmlId + '_quotationNegociatedCurrency').html(invoicingCurrency != null ? invoicingCurrency.code : '');
    $('#' + this.htmlId + '_quotationDiscount').html(getPercentHtml(discount));
}
FeesItemEditForm.prototype.updateTypeView = function() {
    var html = '';
    html += '<option value="" >...</option>';
    for(var key in this.enums.types) {
        var type = this.enums.types[key];
        var isSelected = "";
        if(key == this.data.type) {
           isSelected = "selected";
        }
        html += '<option value="' + key + '" ' + isSelected + '>' + type + '</option>';
    }
    $('#' + this.htmlId + '_type').html(html);
    if(this.data.type == 'QUOTATION') {
        $('#' + this.htmlId + '_nonQuotationData').hide();
        $('#' + this.htmlId + '_quotationData').show("fast");
    } else {
        $('#' + this.htmlId + '_quotationData').hide();
        $('#' + this.htmlId + '_nonQuotationData').show("fast");
    }
}
FeesItemEditForm.prototype.updateFeesAdvanceCurrencyView = function() {
    var html = '';
    html += '<option value="" >...</option>';
    for(var key in this.loaded.currencies) {
        var currency = this.loaded.currencies[key];
        var isSelected = "";
        if(currency.id == this.data.feesAdvanceCurrencyId) {
           isSelected = "selected";
        }
        html += '<option value="' + currency.id + '" ' + isSelected + '>' + currency.code + '</option>';
    }
    $('#' + this.htmlId + '_feesAdvanceCurrency').html(html);
}
FeesItemEditForm.prototype.updateFeesInvoiceCurrencyView = function() {
    var html = '';
    html += '<option value="" >...</option>';
    for(var key in this.loaded.currencies) {
        var currency = this.loaded.currencies[key];
        var isSelected = "";
        if(currency.id == this.data.feesInvoiceCurrencyId) {
           isSelected = "selected";
        }
        html += '<option value="' + currency.id + '" ' + isSelected + '>' + currency.code + '</option>';
    }
    $('#' + this.htmlId + '_feesInvoiceCurrency').html(html);
}
FeesItemEditForm.prototype.updateFeesPaymentCurrencyView = function() {
    var html = '';
    html += '<option value="" >...</option>';
    for(var key in this.loaded.currencies) {
        var currency = this.loaded.currencies[key];
        var isSelected = "";
        if(currency.id == this.data.feesPaymentCurrencyId) {
           isSelected = "selected";
        }
        html += '<option value="' + currency.id + '" ' + isSelected + '>' + currency.code + '</option>';
    }
    $('#' + this.htmlId + '_feesPaymentCurrency').html(html);
}
FeesItemEditForm.prototype.updateFeesActCurrencyView = function() {
    var html = '';
    html += '<option value="" >...</option>';
    for(var key in this.loaded.currencies) {
        var currency = this.loaded.currencies[key];
        var isSelected = "";
        if(currency.id == this.data.feesActCurrencyId) {
           isSelected = "selected";
        }
        html += '<option value="' + currency.id + '" ' + isSelected + '>' + currency.code + '</option>';
    }
    $('#' + this.htmlId + '_feesActCurrency').html(html);
}
FeesItemEditForm.prototype.updateVatView = function() {
    $('#' + this.htmlId + '_vat').val(this.data.vat);
}
FeesItemEditForm.prototype.updateCommentView = function() {
    $('#' + this.htmlId + '_comment').val(this.data.comment);
}
FeesItemEditForm.prototype.show = function() {
    var title = 'Update Fees / ' + this.loaded.projectCode.code;
    if(this.data.mode == 'CREATE') {
        title = 'Create Fees / ' + this.loaded.projectCode.code;
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
        width: 700,
        height: 600,
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
FeesItemEditForm.prototype.validate = function() {
    var errors = [];
    var integerRE = /^[0-9]*$/;
    var float2digitsRE = /^[0-9]*\.?[0-9]{0,2}$/;
    var vatRE = /^[0-9]{0,2}$/;
    var agreementNumberRE = /^[A-Za-z0-9]*$/;
    if(this.data.type === null) {
        errors.push("Type is not set");
    }
    if(this.data.feesAdvanceCurrencyId === null) {
        errors.push("Advance Currency is not set");
    }
    if(this.data.feesInvoiceCurrencyId === null) {
        errors.push("Invoice Currency is not set");
    }
    if(this.data.feesPaymentCurrencyId === null) {
        errors.push("Payment Currency is not set");
    }
    if(this.data.feesActCurrencyId === null) {
        errors.push("Act Currency is not set");
    }
    if(this.data.type == "FLAT_FEE" || this.data.type == "TIMESPENT") {

    } else {
        // validate times???
        if(this.data.positionQuotations == null || this.data.positionQuotations.length == 0) {
            errors.push("Quotation Items are not set");
        }
        if(this.data.quotationCurrencyRate == null || this.data.quotationCurrencyRate == "") {
            errors.push("Quotation Currency Rate is not set");
        }
        if(this.data.quotationNegociated == null || this.data.quotationNegociated == "") {
            errors.push("Negociated value is not set");
        } else if(!integerRE.test(this.data.quotationNegociated)) {
            errors.push("Negociated value has incorrect format. Digits are allowed only.");
        } else if(parseInt(this.data.quotationNegociated) == 0) {
            errors.push("Negociated value must be greater that 0");
        }
    }
    if(this.data.vat === null || this.data.vat === "") {
        errors.push("VAT is not set");
    } else if(!float2digitsRE.test(this.data.vat)) {
        errors.push("VAT has incorrect format. It must be a number with up to 2 digits after decimal point.");
    } else if(parseInt(this.data.vat) < 0) {
            errors.push("VAT must be greater or equal 0");
    } else if(parseFloat(this.data.vat) >= 100) {
            errors.push("VAT must be less than 100");
    }

    return errors;
}
FeesItemEditForm.prototype.save = function() {
    var errors = this.validate();
    if(errors.length > 0) {
        showErrors(errors);
        return;
    }
    var serverFormatData = clone(this.data);
    serverFormatData.date = getYearMonthDateFromDateString(serverFormatData.date);
    var positionQuotations = [];
    for(var key in this.loaded.positions) {
        var position = this.loaded.positions[key];
        var positionQuotation = this.getPositionQuotationByPositionId(position.id);
        if(positionQuotation != null) {
            // convert client's hours into server's minutes
            positionQuotation.time = positionQuotation.time * 60;
            positionQuotations.push(positionQuotation);
        }
    }
    serverFormatData.positionQuotations = positionQuotations;
    
    var form = this;
    var data = {};
    data.command = "saveFeesItem";
    data.feesItemEditForm = getJSON(serverFormatData);
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            doAlert("Info", "FeesItem has been successfully saved", form, form.afterSave);
            form.dataChanged(false);
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
FeesItemEditForm.prototype.afterSave = function() {
    $('#' + this.containerHtmlId).dialog("close");
    this.successHandler.call(this.successContext);
}
FeesItemEditForm.prototype.dataChanged = function(value) {
    dataChanged = value;
}
FeesItemEditForm.prototype.getPositionQuotationByPositionId = function(positionId) {
    for(var key in this.data.positionQuotations) {
        var positionQuotation = this.data.positionQuotations[key];
        if(positionQuotation.positionId == positionId) {
            return positionQuotation;
        }
    }
    return null;
}
FeesItemEditForm.prototype.getStandardSellingRateItemByPositionId = function(positionId) {
    for(var key in this.loaded.standardSellingRateBlock.standardSellingRates) {
        var standardSellingRate = this.loaded.standardSellingRateBlock.standardSellingRates[key];
        if(standardSellingRate.positionId == positionId) {
            return standardSellingRate;
        }
    }
    return null;
}
FeesItemEditForm.prototype.getCurrencyById = function(id) {
    for(var key in this.loaded.currencies) {
        var currency = this.loaded.currencies[key];
        if(currency.id == id) {
           return currency;
        }
    }
    return null;
}


//==================================================

function FeesItemDeleteForm(feesItemId, successHandler, successContext) {
    this.config = {
        endpointUrl: endpointsFolder+ "FeesItemEditForm.jsp"
    };
    this.successHandler = successHandler;
    this.successContext = successContext;
    this.data = {
        "id": feesItemId
    }
}
FeesItemDeleteForm.prototype.start = function() {
    this.checkDependencies();
}
FeesItemDeleteForm.prototype.checkDependencies = function() {
    var form = this;
    var data = {};
    data.command = "checkFeesItemDependencies";
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
FeesItemDeleteForm.prototype.analyzeDependencies = function(dependencies) {
    if(dependencies.feesAdvances == 0 && dependencies.feesInvoices == 0 && dependencies.feesPayments == 0 && dependencies.feesActs == 0 && dependencies.outOfPocketItem == false && dependencies.agreement == false) {
        this.show();
    } else {
        var html = 'This FeesItem has dependencies and can not be deleted<br />';
        html += 'Advances: ' + dependencies.feesAdvances + '<br />';
        html += 'Invoices: ' + dependencies.feesInvoices + '<br />';
        html += 'Payments: ' + dependencies.feesPayments + '<br />';
        html += 'Acts: ' + dependencies.feesActs + '<br />';
        html += 'Out of Pocket Item: ' + dependencies.outOfPocketItem + '<br />';
        html += 'Agreement: ' + dependencies.agreement + '<br />';
        doAlert("Dependencies found", html, null, null);
    }
}
FeesItemDeleteForm.prototype.show = function() {
  doConfirm("Confirm", "Do you really want to delete this FeesItem", this, function() {this.doDeleteFeesItem()}, null, null);
}
FeesItemDeleteForm.prototype.doDeleteFeesItem = function() {
    var form = this;
    var data = {};
    data.command = "deleteFeesItem";
    data.id = this.data.id;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            doAlert("Info", "FeesItem has been successfully deleted", form, form.afterSave);
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
FeesItemDeleteForm.prototype.afterSave = function() {
    this.successHandler.call(this.successContext);
}
