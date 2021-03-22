/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

BudgetInfo = function(htmlId, containerHtmlId) {
    this.config = {
        endpointUrl: endpointsFolder+ "BudgetManager.jsp"
    }
    this.moduleName = "Financial Information";
    this.loaded = {
        "projectCode": null,
        "feesItem": null,
        "outOfPocketItem": null,
        "agreement": null,
        "positionQuotations": [],
        "feesAdvances" : [],
        "feesInvoices": [],
        "feesPayments": [],
        "feesActs": [],
        "outOfPocketInvoices": [],
        "outOfPocketPayments": [],
        "outOfPocketActs": [],
        "invoiceRequestPackets": [],
        "outOfPocketRequest": [],
        "currencies": [],
        "mainCurrency" : null,
        "positions": []
    }
    this.htmlId = htmlId;
    this.containerHtmlId = containerHtmlId;
    this.projectCodeId = null;
    this.tabs = ['invoiceRequests', 'fees', 'oop', 'agreement'];
    this.selected = {
        "invoiceRequestIds": [],
        "tab": 0
    }
}
BudgetInfo.prototype.init = function(projectCodeId) {
    this.projectCodeId = projectCodeId;
    this.loadAll(projectCodeId);
}
BudgetInfo.prototype.refreshInfo = function() {
    this.selected.invoiceRequestIds = [];
    this.loadAll(this.projectCodeId);
}
BudgetInfo.prototype.loadAll = function(id) {
    var form = this;
    var data = {};
    data.command = "getBudgetInfo";
    data.projectCodeId = id;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: 'post',
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.projectCode = result.projectCode;
            form.loaded.feesItem = result.feesItem;
            form.loaded.outOfPocketItem = result.outOfPocketItem;
            form.loaded.agreement = result.agreement;
            form.loaded.positionQuotations = result.positionQuotations;
            for(var key in form.loaded.positionQuotations) {
                var budgetPositionTime = form.loaded.positionQuotations[key];
                budgetPositionTime.time = budgetPositionTime.time / 60;
            }
            form.loaded.standardSellingRateBlock = result.standardSellingRateBlock;
            form.loaded.feesAdvances = result.feesAdvances;
            form.loaded.feesInvoices = result.feesInvoices;
            form.loaded.feesPayments = result.feesPayments;
            form.loaded.feesActs = result.feesActs;
            
            form.loaded.outOfPocketInvoices = result.outOfPocketInvoices;
            form.loaded.outOfPocketPayments = result.outOfPocketPayments;
            form.loaded.outOfPocketActs = result.outOfPocketActs;
            
            form.loaded.invoiceRequestPackets = result.invoiceRequestPackets;
            form.loaded.outOfPocketRequest = result.outOfPocketRequest;
            
            form.loaded.currencies = result.currencies;
            form.loaded.positions = result.positions;
            form.loaded.mainCurrency = result.mainCurrency;
            form.show();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
BudgetInfo.prototype.show = function() {
  $('#' + this.containerHtmlId).html(this.getHtml());
  var form = this;
  $('#' + this.htmlId + '_tabs').tabs({
          activate: function( event, ui ) {form.tabActivatedHandle(event, ui )}
      });
  this.updateView();
}
BudgetInfo.prototype.getHtml = function() {
    var html = '';
    html += '<div id="' + this.htmlId + '_layout_projectCode' + '"></div>';
    html += '<div id="' + this.htmlId + '_tabs' + '">';
    html += '<ul>';
    html += '<li><a href="#' + this.htmlId + '_tabs_invoiceRequests' + '">Invoice requests</a></li>';
    html += '<li><a href="#' + this.htmlId + '_tabs_fees' + '">Fees</a></li>';
    html += '<li><a href="#' + this.htmlId + '_tabs_oop' + '">Out of pocket</a></li>';
    html += '<li><a href="#' + this.htmlId + '_tabs_agreement' + '">Agreement</a></li>';
    html += '</ul>';
    html += '<div id="' + this.htmlId + '_tabs_invoiceRequests' + '">';
    html += '<div id="' + this.htmlId + '_layout_invoiceRequests"></div>';
    html += '</div>';
    html += '<div id="' + this.htmlId + '_tabs_fees' + '">';
        html += '<div id="' + this.htmlId + '_layout_feesItem"></div>';
        html += '<div id="' + this.htmlId + '_layout_positionQuotations"></div>';
        html += '<div id="' + this.htmlId + '_layout_feesAdvances"></div>';
        html += '<div id="' + this.htmlId + '_layout_feesInvoices"></div>';
        html += '<div id="' + this.htmlId + '_layout_feesPayments"></div>';
        html += '<div id="' + this.htmlId + '_layout_feesActs"></div>';
    html += '</div>';
    html += '<div id="' + this.htmlId + '_tabs_oop' + '">';
        html += '<div id="' + this.htmlId + '_layout_outOfPocketItem"></div>';
        html += '<div id="' + this.htmlId + '_layout_outOfPocketInvoices"></div>';
        html += '<div id="' + this.htmlId + '_layout_outOfPocketPayments"></div>';
        html += '<div id="' + this.htmlId + '_layout_outOfPocketActs"></div>';
    html += '</div>';
    html += '<div id="' + this.htmlId + '_tabs_agreement' + '">';
        html += '<div id="' + this.htmlId + '_layout_agreement"></div>';
    html += '</div>';
    html += '</div>';
    return html;
}
BudgetInfo.prototype.updateView = function() {
    this.updateTabsView();
    this.updateProjectCodeView();
    this.updateFeesItemView();
    this.updateOutOfPocketItemView();
    this.updateAgreementView();
    this.updatePositionQuotationsView();
    this.updateFeesAdvancesView();
    this.updateFeesInvoicesView();
    this.updateFeesPaymentsView();
    this.updateFeesActsView();
    this.updateOutOfPocketInvoicesView();
    this.updateOutOfPocketPaymentsView();
    this.updateOutOfPocketActsView();
    this.invoiceRequestsList = new InvoiceRequestsList({
        "projectCodeId": this.projectCodeId,
        "invoiceRequests": this.loaded.invoiceRequests,
        "actRequests": this.loaded.actRequests,
        "taxInvoiceRequests": this.loaded.taxInvoiceRequests,
        "outOfPocketRequest": this.loaded.outOfPocketRequest
    }, this.htmlId + '_invoiceRequestsList', this.htmlId + '_layout_invoiceRequests');
    this.invoiceRequestsList.init();
}
BudgetInfo.prototype.updateTabsView = function() {
    $('#' + this.htmlId + '_tabs').tabs( 'option', 'active', this.selected.tab);
}
BudgetInfo.prototype.updateProjectCodeView = function() {
    var html = '';
    html += '<div class="label1">' + this.loaded.projectCode.code + '</div>';
    html += '<div class="comment1">' + this.loaded.projectCode.comment + '</div>';
    html += '<div class="comment1">' + this.loaded.projectCode.description + '</div>';
    if(this.loaded.projectCode.isDead) {
        html += getErrorHtml('<strong>Attention</strong> This project code is marked as <strong>dead</strong>');
    }
    html += '<a href="../../code/code_management/index.jsp?code=' + escape(this.loaded.projectCode.code) + '">Code management</a> ';
    html += '<a href="../../reports/code/code_detail/index.jsp?code=' + escape(this.loaded.projectCode.code) + '">Code detail report</a><br />';
    $('#' + this.htmlId + "_layout_projectCode").html(html);
}
BudgetInfo.prototype.updateFeesItemView = function() {
    var form = this;
    if(this.loaded.feesItem != null) {
        var rows = [];
        var advanceCurrency = this.getElementById(this.loaded.feesItem.feesAdvanceCurrencyId, this.loaded.currencies);
        var invoiceCurrency = this.getElementById(this.loaded.feesItem.feesInvoiceCurrencyId, this.loaded.currencies);
        var paymentCurrency = this.getElementById(this.loaded.feesItem.feesPaymentCurrencyId, this.loaded.currencies);
        var actCurrency = this.getElementById(this.loaded.feesItem.feesActCurrencyId, this.loaded.currencies);
        this.loaded.feesItem.feesAdvanceCurrencyName = advanceCurrency != null ? advanceCurrency.code : "";
        this.loaded.feesItem.feesInvoiceCurrencyName = invoiceCurrency != null ? invoiceCurrency.code : "";
        this.loaded.feesItem.feesPaymentCurrencyName = paymentCurrency != null ? paymentCurrency.code : "";
        this.loaded.feesItem.feesActCurrencyName = actCurrency != null ? actCurrency.code : "";
        rows.push({"name": "Type", "property": "type"});
        rows.push({"name": "Invoice To Issue Currency", "property": "feesAdvanceCurrencyName"});
        rows.push({"name": "Invoice Issued Currency", "property": "feesInvoiceCurrencyName"});
        rows.push({"name": "Payment Currency", "property": "feesPaymentCurrencyName"});
        rows.push({"name": "Act Currency", "property": "feesActCurrencyName"});
        rows.push({"name": "VAT", "property": "vat"});
        rows.push({"name": "Comment", "property": "comment"});
        var controls = [];
        controls.push({"id": "edit", "text": "Edit", "icon": imagePath+"/icons/edit.png", "click": {"handler": this.editFeesItem, "context": this}});
        controls.push({"id": "delete", "text": "Delete", "click": {"handler": this.deleteFeesItem, "context": this}});
        var propertyGrid = new PropertyGrid("feesItem", this.loaded.feesItem, rows, "Fees", controls);
        propertyGrid.show(this.htmlId + "_layout_feesItem"); 
    } else {
        var html = '';
        html += 'Fees Item has not been created for this Project Code<br />';
        html += '<span class="link" id="' + this.htmlId + '_feesItem_create">Create Fees Item</span>';
        $('#' + this.htmlId + "_layout_feesItem").html(html);
        $('#' + this.htmlId + '_feesItem_create').bind("click", function(event) {form.createFeesItem.call(form)});
    }
}
BudgetInfo.prototype.updateOutOfPocketItemView = function() {
    var form = this;
    if(this.loaded.outOfPocketItem != null) {
        var rows = [];
        rows.push({"name": "Type", "property": "type"});
        if(this.loaded.outOfPocketItem.type != "NO") {
            var invoiceCurrency = this.getElementById(this.loaded.outOfPocketItem.outOfPocketInvoiceCurrencyId, this.loaded.currencies);
            var paymentCurrency = this.getElementById(this.loaded.outOfPocketItem.outOfPocketPaymentCurrencyId, this.loaded.currencies);
            var actCurrency = this.getElementById(this.loaded.outOfPocketItem.outOfPocketActCurrencyId, this.loaded.currencies);
            this.loaded.outOfPocketItem.outOfPocketInvoiceCurrencyName = invoiceCurrency != null ? invoiceCurrency.code : "";
            this.loaded.outOfPocketItem.outOfPocketPaymentCurrencyName = paymentCurrency != null ? paymentCurrency.code : "";
            this.loaded.outOfPocketItem.outOfPocketActCurrencyName = actCurrency != null ? actCurrency.code : "";
            rows.push({"name": "Invoice Issued Currency", "property": "outOfPocketInvoiceCurrencyName"});
            rows.push({"name": "Payment Currency", "property": "outOfPocketPaymentCurrencyName"});
            rows.push({"name": "Act Currency", "property": "outOfPocketActCurrencyName"});
        }
        if(this.loaded.outOfPocketItem.type == "LIMITED") {
            rows.push({"name": "Amount", "property": "amount"});
            var currency = this.getElementById(this.loaded.outOfPocketItem.currencyId, this.loaded.currencies);
            this.loaded.outOfPocketItem.currencyName = currency != null ? currency.code : "";
            rows.push({"name": "Currency", "property": "currencyName"});
        }

        var controls = [];
        controls.push({"id": "edit", "text": "Edit", "icon": imagePath+"/icons/edit.png", "click": {"handler": this.editOutOfPocketItem, "context": this}});
        controls.push({"id": "delete", "text": "Delete", "click": {"handler": this.deleteOutOfPocketItem, "context": this}});
        var propertyGrid = new PropertyGrid("outOfPocketItem", this.loaded.outOfPocketItem, rows, "Out Of Pocket", controls);
        propertyGrid.show(this.htmlId + "_layout_outOfPocketItem"); 
    } else {
        var html = '';
        html += 'Out of Pocket Item has not been created for this Project Code<br />';
        if(this.loaded.feesItem != null) {
            html += '<span class="link" id="' + this.htmlId + '_outOfPocketItem_create">Create Out Of Pocket Item</span>';
        }
        $('#' + this.htmlId + "_layout_outOfPocketItem").html(html);
        $('#' + this.htmlId + '_outOfPocketItem_create').bind("click", function(event) {form.createOutOfPocketItem.call(form)});
    }
}
BudgetInfo.prototype.updateAgreementView = function() {
    var form = this;
    if(this.loaded.agreement != null) {
        var rows = [];
        rows.push({"name": "Number", "property": "number"});
        rows.push({"name": "Signed", "property": "isSigned", visualizer: booleanVisualizer});
        rows.push({"name": "Date", "property": "date", "visualizer": calendarVisualizer});
        rows.push({"name": "Type", "property": "type"});
        rows.push({"name": "Renewal", "property": "isRenewal", visualizer: booleanVisualizer});
        rows.push({"name": "Comment", "property": "comment"});
        var controls = [];
        controls.push({"id": "edit", "text": "Edit", "icon": imagePath+"/icons/edit.png", "click": {"handler": this.editAgreement, "context": this}});
        controls.push({"id": "delete", "text": "Delete", "click": {"handler": this.deleteAgreement, "context": this}});
        var propertyGrid = new PropertyGrid("budgetFeesInfo", this.loaded.agreement, rows, "Agreement", controls);
        propertyGrid.show(this.htmlId + "_layout_agreement");
    } else {
        var html = '';
        html += 'Agreement has not been created for this Project Code<br />';
        if(this.loaded.feesItem != null) {
            html += '<span class="link" id="' + this.htmlId + '_agreement_create">Create agreement</span>';
        }
        $('#' + this.htmlId + "_layout_agreement").html(html);
        $('#' + this.htmlId + '_agreement_create').bind("click", function(event) {form.createAgreement.call(form)});
    }
}
BudgetInfo.prototype.updatePositionQuotationsView = function() {
    var html = '';
    var feesItem = this.loaded.feesItem;
    var standardSellingRateBlock = this.loaded.standardSellingRateBlock;
    if(feesItem == null || feesItem.type != 'QUOTATION') {
        
    } else if(this.loaded.feesItem.positionQuotationIds.length == 0) {
        html += 'Position Quotations have not been created for this feesItem';
    } else if(standardSellingRateBlock == null) {
        html += 'Standard selling rates are not defined for this date ' + getStringFromYearMonthDate(feesItem.date);
    } else {
        var timeTotal = 0;
        var standardValueTotal = 0;
        var invoicingValueTotal = 0;
        var standardCurrency = this.getElementById(standardSellingRateBlock.currencyId, this.loaded.currencies);
        var invoicingCurrency = this.getElementById(feesItem.feesInvoiceCurrencyId, this.loaded.currencies);
        html += '<table class="datagrid">';
        html += '<tr class="dgHeader">';
        html += '<td colspan="8">';
        html += '<label>Invoicing currency: </label> ' + invoicingCurrency.code + ', ';
        html += '<label>Rate: </label> ' + feesItem.quotationCurrencyRate;
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
            var positionQuotation = null;
            for(var key2 in this.loaded.positionQuotations) {
               var positionQuotationTmp = this.loaded.positionQuotations[key2];
                if(positionQuotationTmp.positionId == position.id) {
                    positionQuotation = positionQuotationTmp;
                    break;
                }
            }
            var standardSellingRate = null;
            for(var key2 in standardSellingRateBlock.standardSellingRates) {
               var standardSellingRateTmp = standardSellingRateBlock.standardSellingRates[key2];
                if(standardSellingRateTmp.positionId == position.id) {
                    standardSellingRate = standardSellingRateTmp;
                    break;
                }
            }
            var time = positionQuotation != null ? positionQuotation.time : null;
            var sellingRate = standardSellingRate != null ? standardSellingRate.amount : null;
            var standardValue = time * sellingRate;
            var invoicingValue = standardValue;
            if(standardSellingRateBlock.сurrencyId != feesItem.feesInvoiceCurrencyId) {
                invoicingValue = standardValue * feesItem.quotationCurrencyRate;
            }
            timeTotal += time;
            standardValueTotal += standardValue;
            invoicingValueTotal += invoicingValue;

            html += '<tr>';
            html += '<td>' + position.standardPositionName + '</td>';
            html += '<td>' + position.positionName + '</td>';
            html += '<td>' + time + '</td>';
            html += '<td>' + sellingRate + '</td>';
            html += '<td>' + standardValue + ' ' + (standardCurrency != null ? standardCurrency.code : '') + '</td>';
            html += '<td>' + invoicingValue + ' ' + (invoicingCurrency != null ? invoicingCurrency.code : '') + '</span></td>';
            html += '<td colspan="2">&nbsp;</td>';
            html += '</tr>';
        }
        var discount = "";
        if(feesItem.quotationNegociated != null && invoicingValueTotal != null) {
            discount = (invoicingValueTotal - feesItem.quotationNegociated)/invoicingValueTotal;
        }
        html += '<tr class="dgHighlight">';
        html += '<td colspan="6">&nbsp;</td>';
        html += '<td><span class="label1">Negociated</span></td>';
        html += '<td><span class="label1">Discount</span></td>';
        html += '</tr>'
        html += '<tr>';
        html += '<td>&nbsp;</td>';
        html += '<td>&nbsp;</td>';
        html += '<td>' + timeTotal + '</span></td>';
        html += '<td>&nbsp;</td>';
        html += '<td>' + standardValueTotal + ' ' + (standardCurrency != null ? standardCurrency.code : '') + '</td>';
        html += '<td>' + invoicingValueTotal + ' ' + (invoicingCurrency != null ? invoicingCurrency.code : '') + '</td>';
        html += '<td style="white-space:nowrap;">' + feesItem.quotationNegociated + ' ' + (invoicingCurrency != null ? invoicingCurrency.code : '') + '</td>';
        html += '<td>' + getPercentHtml(discount) + '</td>';
        html += '</tr>'
        html += '</table>';
    }
    $('#' + this.htmlId + "_layout_positionQuotations").html(html);
}
BudgetInfo.prototype.updateFeesAdvancesView = function() {
    if(this.loaded.feesItem != null) {
        var advanceCurrency = this.getElementById(this.loaded.feesItem.feesAdvanceCurrencyId, this.loaded.currencies);
        var columns = [];
        columns.push({"name": "Amount (" + advanceCurrency.code + ")", "property": "amount"});
        columns.push({"name": "Advance", "property": "isAdvance", visualizer: booleanVisualizer});
        columns.push({"name": "Date", "property": "date", visualizer: calendarVisualizer});
        var extraColumns = [];
        extraColumns.push({"name": "Delete", "property": "delete", "text": "Delete",  "click": {"handler": this.deleteFeesAdvance, "context": this}});
        extraColumns.push({"name": "Edit", "property": "edit", "text": "Edit",  "click": {"handler": this.editFeesAdvance, "context": this}});
        var controls = [];
        controls.push({"text": "Add", "icon": imagePath+"/icons/add.png", "click": {"handler": this.addFeesAdvance, "context": this}});
        var extraRows = [];
        extraRows.push({
            amount : {type: 'standard', standard: 'sum', visualizer: decimalVisualizer}
        });
        var dataGrid = new DataGrid("feesAdvanceInfo", this.loaded.feesAdvances, columns, "Invoices to issue (" + advanceCurrency.code + ")", controls, extraColumns, "id", extraRows);
        dataGrid.show(this.htmlId + "_layout_feesAdvances");
    } else {
        var html = '';
        $('#' + this.htmlId + "_layout_feesPayments").html(html);
    }
}
BudgetInfo.prototype.updateFeesInvoicesView = function() {
    if(this.loaded.feesItem != null) {
        var invoiceCurrency = this.getElementById(this.loaded.feesItem.feesInvoiceCurrencyId, this.loaded.currencies);
        var columns = [];
        columns.push({"name": "Amount (" + invoiceCurrency.code + ")", "property": "amount"});
        columns.push({"name": "VAT included Amount (" + invoiceCurrency.code + ")", "property": "vatIncludedAmount"});
        columns.push({"name": "Advance", "property": "isAdvance", visualizer: booleanVisualizer});
        columns.push({"name": "Date", "property": "date", visualizer: calendarVisualizer});
        columns.push({"name": "Reference", "property": "reference"});
        var extraColumns = [];
        extraColumns.push({"name": "Delete", "property": "delete", "text": "Delete",  "click": {"handler": this.deleteFeesInvoice, "context": this}});
        extraColumns.push({"name": "Edit", "property": "edit", "text": "Edit",  "click": {"handler": this.editFeesInvoice, "context": this}});
        var controls = [];
        controls.push({"text": "Add", "icon": imagePath+"/icons/add.png", "click": {"handler": this.addFeesInvoice, "context": this}});
        var extraRows = [];
        extraRows.push({
            amount : {type: 'standard', standard: 'sum', visualizer: decimalVisualizer}
        });
        var dataGrid = new DataGrid("feesInvoicesInfo", this.loaded.feesInvoices, columns, "Invoices issued (" + invoiceCurrency.code + ")", controls, extraColumns, "id", extraRows);
        dataGrid.show(this.htmlId + "_layout_feesInvoices");
    } else {
        var html = '';
        $('#' + this.htmlId + "_layout_feesPayments").html(html);
    }
}
BudgetInfo.prototype.updateFeesPaymentsView = function() {
    if(this.loaded.feesItem != null) {
        var normalizedData = [];
        for(var key in this.loaded.feesPayments) {
            var payment = this.loaded.feesPayments[key];
            normalizedData.push({
               "id": payment.id,
               "amount": payment.amount,
               "cvAmount": (this.loaded.mainCurrency.id != this.loaded.feesItem.feesInvoiceCurrencyId) ? payment.cvAmount : payment.amount,
               "date": payment.date,
               "reference": payment.reference,
               "invoiceReference": payment.invoiceReference
            });
        }
        
        var invoiceCurrency = this.getElementById(this.loaded.feesItem.feesInvoiceCurrencyId, this.loaded.currencies);
        var paymentCurrency = this.getElementById(this.loaded.feesItem.feesPaymentCurrencyId, this.loaded.currencies);
        var mainCurrency = this.getElementById(this.loaded.mainCurrency.id, this.loaded.currencies);
        var columns = [];
        columns.push({"name": "Amount (" + invoiceCurrency.code + ")", "property": "amount"});
        columns.push({"name": "Cv Amount (" + mainCurrency.code + ")", "property": "cvAmount"});
        columns.push({"name": "Date", "property": "date", visualizer: calendarVisualizer});
        columns.push({"name": "Reference", "property": "reference"});
        columns.push({"name": "Invoice Reference", "property": "invoiceReference"});
        var extraColumns = [];
        extraColumns.push({"name": "Delete", "property": "delete", "text": "Delete",  "click": {"handler": this.deleteFeesPayment, "context": this}});
        extraColumns.push({"name": "Edit", "property": "edit", "text": "Edit",  "click": {"handler": this.editFeesPayment, "context": this}});
        var controls = [];
        controls.push({"text": "Add", "icon": imagePath+"/icons/add.png", "click": {"handler": this.addFeesPayment, "context": this}});
        var extraRows = [];
        var extraRow = {};
        extraRow['amount'] = {type: 'standard', standard: 'sum', visualizer: decimalVisualizer};
        extraRow['cvAmount'] = {type: 'standard', standard: 'sum', visualizer: decimalVisualizer};
        extraRows.push(extraRow);
        var dataGrid = new DataGrid("feesPaymentsInfo", normalizedData, columns, "Payments (" + paymentCurrency.code + ")", controls, extraColumns, "id", extraRows);
        dataGrid.show(this.htmlId + "_layout_feesPayments");
    } else {
        var html = '';
        $('#' + this.htmlId + "_layout_feesPayments").html(html);
    }
}
BudgetInfo.prototype.updateFeesActsView = function() {
    if(this.loaded.feesItem != null) {
        var normalizedData = [];
        for(var key in this.loaded.feesActs) {
            var act = this.loaded.feesActs[key];
            normalizedData.push({
               "id": act.id,
               "amount": act.amount,
               "cvAmount": (this.loaded.mainCurrency.id != this.loaded.feesItem.feesActCurrencyId) ? act.cvAmount : act.amount,
               "date": act.date,
               "reference": act.reference,
               "isSigned": act.isSigned
            });
        }
        
        var actCurrency = this.getElementById(this.loaded.feesItem.feesActCurrencyId, this.loaded.currencies);
        var mainCurrency = this.getElementById(this.loaded.mainCurrency.id, this.loaded.currencies);
        var columns = [];
        columns.push({"name": "Amount (" + actCurrency.code + ")", "property": "amount"});
        columns.push({"name": "Cv Amount (" + mainCurrency.code + ")", "property": "cvAmount"});
        columns.push({"name": "Date", "property": "date", visualizer: calendarVisualizer});
        columns.push({"name": "Reference", "property": "reference"});
        columns.push({"name": "Signed", "property": "isSigned", visualizer: booleanVisualizer});
        var extraColumns = [];
        extraColumns.push({"name": "Delete", "property": "delete", "text": "Delete",  "click": {"handler": this.deleteFeesAct, "context": this}});
        extraColumns.push({"name": "Edit", "property": "edit", "text": "Edit",  "click": {"handler": this.editFeesAct, "context": this}});
        var controls = [];
        controls.push({"text": "Add", "icon": imagePath+"/icons/add.png", "click": {"handler": this.addFeesAct, "context": this}});
        var extraRows = [];
        var extraRow = {};
        extraRow['amount'] = {type: 'standard', standard: 'sum', visualizer: decimalVisualizer};
        extraRow['cvAmount'] = {type: 'standard', standard: 'sum', visualizer: decimalVisualizer};
        extraRows.push(extraRow);
        var dataGrid = new DataGrid("feesActsInfo", normalizedData, columns, "Acts (" + actCurrency.code + ")", controls, extraColumns, "id", extraRows);
        dataGrid.show(this.htmlId + "_layout_feesActs");
    } else {
        var html = '';
        $('#' + this.htmlId + "_layout_feesActs").html(html);
    }
}
BudgetInfo.prototype.updateOutOfPocketInvoicesView = function() {
    if(this.loaded.outOfPocketItem != null) {
        var invoiceCurrency = this.getElementById(this.loaded.outOfPocketItem.outOfPocketInvoiceCurrencyId, this.loaded.currencies);
        var columns = [];
        columns.push({"name": "Amount (" + (invoiceCurrency != null ? invoiceCurrency.code : 'No currency') + ")", "property": "amount"});
        columns.push({"name": "VAT included Amount (" + (invoiceCurrency != null ? invoiceCurrency.code : 'No currency') + ")", "property": "vatIncludedAmount"});
        columns.push({"name": "Date", "property": "date", visualizer: calendarVisualizer});
        columns.push({"name": "Reference", "property": "reference"});
        var extraColumns = [];
        extraColumns.push({"name": "Delete", "property": "delete", "text": "Delete",  "click": {"handler": this.deleteOutOfPocketInvoice, "context": this}});
        extraColumns.push({"name": "Edit", "property": "edit", "text": "Edit",  "click": {"handler": this.editOutOfPocketInvoice, "context": this}});
        var controls = [];
        controls.push({"text": "Add", "icon": imagePath+"/icons/add.png", "click": {"handler": this.addOutOfPocketInvoice, "context": this}});
        var extraRows = [];
        extraRows.push({
            amount : {type: 'standard', standard: 'sum', visualizer: decimalVisualizer}
        });
        var dataGrid = new DataGrid("outOfPocketInvoicesInfo", this.loaded.outOfPocketInvoices, columns, "Invoices issued (" + (invoiceCurrency != null ? invoiceCurrency.code : 'No currency') + ")", controls, extraColumns, "id", extraRows);
        dataGrid.show(this.htmlId + "_layout_outOfPocketInvoices");
    } else {
        var html = '';
        $('#' + this.htmlId + "_layout_outOfPocketInvoices").html(html);
    }
}
BudgetInfo.prototype.updateOutOfPocketPaymentsView = function() {
    if(this.loaded.outOfPocketItem != null) {
        var normalizedData = [];
        for(var key in this.loaded.outOfPocketPayments) {
            var payment = this.loaded.outOfPocketPayments[key];
            normalizedData.push({
               "id": payment.id,
               "amount": payment.amount,
               "cvAmount": (this.loaded.mainCurrency.id != this.loaded.outOfPocketItem.outOfPocketInvoiceCurrencyId) ? payment.cvAmount : payment.amount,
               "date": payment.date,
               "reference": payment.reference,
               "invoiceReference": payment.invoiceReference
            });
        }
        
        var invoiceCurrency = this.getElementById(this.loaded.outOfPocketItem.outOfPocketInvoiceCurrencyId, this.loaded.currencies);
        var paymentCurrency = this.getElementById(this.loaded.outOfPocketItem.outOfPocketPaymentCurrencyId, this.loaded.currencies);
        var mainCurrency = this.getElementById(this.loaded.mainCurrency.id, this.loaded.currencies);
        var columns = [];
        columns.push({"name": "Amount (" + (invoiceCurrency != null ? invoiceCurrency.code : 'No currency') + ")", "property": "amount"});
        columns.push({"name": "Cv Amount (" + (mainCurrency != null ? mainCurrency.code : 'No currency') + ")", "property": "cvAmount"});
        columns.push({"name": "Date", "property": "date", visualizer: calendarVisualizer});
        columns.push({"name": "Reference", "property": "reference"});
        columns.push({"name": "Invoice Reference", "property": "invoiceReference"});
        var extraColumns = [];
        extraColumns.push({"name": "Delete", "property": "delete", "text": "Delete",  "click": {"handler": this.deleteOutOfPocketPayment, "context": this}});
        extraColumns.push({"name": "Edit", "property": "edit", "text": "Edit",  "click": {"handler": this.editOutOfPocketPayment, "context": this}});
        var controls = [];
        controls.push({"text": "Add", "icon": imagePath+"/icons/add.png", "click": {"handler": this.addOutOfPocketPayment, "context": this}});
        var extraRows = [];
        var extraRow = {};
        extraRow['amount'] = {type: 'standard', standard: 'sum', visualizer: decimalVisualizer};
        extraRow['cvAmount'] = {type: 'standard', standard: 'sum', visualizer: decimalVisualizer};
        extraRows.push(extraRow);
        var dataGrid = new DataGrid("outOfPocketPaymentsInfo", normalizedData, columns, "Payments (" + (paymentCurrency != null ? paymentCurrency.code : 'No currency') + ")", controls, extraColumns, "id", extraRows);
        dataGrid.show(this.htmlId + "_layout_outOfPocketPayments");
    } else {
        var html = '';
        $('#' + this.htmlId + "_layout_outOfPocketPayments").html(html);
    }
}
BudgetInfo.prototype.updateOutOfPocketActsView = function() {
    if(this.loaded.outOfPocketItem != null) {
        var normalizedData = [];
        for(var key in this.loaded.outOfPocketActs) {
            var act = this.loaded.outOfPocketActs[key];
            normalizedData.push({
               "id": act.id,
               "amount": act.amount,
               "cvAmount": (this.loaded.mainCurrency.id != this.loaded.outOfPocketItem.outOfPocketActCurrencyId) ? act.cvAmount : act.amount,
               "date": act.date,
               "reference": act.reference,
               "isSigned": act.isSigned
            });
        }
        
        var actCurrency = this.getElementById(this.loaded.outOfPocketItem.outOfPocketActCurrencyId, this.loaded.currencies);
        var mainCurrency = this.getElementById(this.loaded.mainCurrency.id, this.loaded.currencies);
        var columns = [];
        columns.push({"name": "Amount (" + (actCurrency != null ? actCurrency.code : 'No currency') + ")", "property": "amount"});
        columns.push({"name": "Cv Amount (" + (mainCurrency != null ? mainCurrency.code : 'No currency') + ")", "property": "cvAmount"});
        columns.push({"name": "Date", "property": "date", visualizer: calendarVisualizer});
        columns.push({"name": "Reference", "property": "reference"});
        columns.push({"name": "Signed", "property": "isSigned", visualizer: booleanVisualizer});
        var extraColumns = [];
        extraColumns.push({"name": "Delete", "property": "delete", "text": "Delete",  "click": {"handler": this.deleteOutOfPocketAct, "context": this}});
        extraColumns.push({"name": "Edit", "property": "edit", "text": "Edit",  "click": {"handler": this.editOutOfPocketAct, "context": this}});
        var controls = [];
        controls.push({"text": "Add", "icon": imagePath+"/icons/add.png", "click": {"handler": this.addOutOfPocketAct, "context": this}});
        var extraRows = [];
        var extraRow = {};
        extraRow['amount'] = {type: 'standard', standard: 'sum', visualizer: decimalVisualizer};
        extraRow['cvAmount'] = {type: 'standard', standard: 'sum', visualizer: decimalVisualizer};
        extraRows.push(extraRow);
        var dataGrid = new DataGrid("outOfPocketActsInfo", normalizedData, columns, "Acts (" + (actCurrency != null ? actCurrency.code : 'No currency') + ")", controls, extraColumns, "id", extraRows);
        dataGrid.show(this.htmlId + "_layout_outOfPocketActs");
    } else {
        var html = '';
        $('#' + this.htmlId + "_layout_outOfPocketActs").html(html);
    }
}
BudgetInfo.prototype.tabActivatedHandle = function(event, ui) {
    var htmlId = ui.newPanel[0].id;
    var parts = htmlId.split('_');
    this.selected.tab = $.inArray(parts[parts.length - 1], this.tabs);
}
BudgetInfo.prototype.createFeesItem = function(event) {
   var feesItemEditForm = new FeesItemEditForm({
        "mode": 'CREATE',
        "id": null,
        "projectCodeId": this.projectCodeId,
        "type" : null,
        "feesAdvanceCurrencyId" : null,
        "feesInvoiceCurrencyId" : null,
        "feesPaymentCurrencyId" : null,
        "feesActCurrencyId" : null,

        "positionQuotations" : [],
        "quotationCurrencyRate": null,
        "quotationNegociated": null,
        "vat": "",
        "comment": ""
    }, "feesItemEditForm", this.refreshInfo, this);
    feesItemEditForm.init();
}
BudgetInfo.prototype.createOutOfPocketItem = function(event) {
   var outOfPocketItemEditForm = new OutOfPocketItemEditForm({
        "mode": 'CREATE',
        "id": null,
        "projectCodeId": this.projectCodeId,
        "type" : null,
        "amount": null,
        "outOfPocketInvoiceCurrencyId" : null,
        "outOfPocketPaymentCurrencyId" : null,
        "outOfPocketActCurrencyId" : null
    }, "outOfPocketItemEditForm", this.refreshInfo, this);
    outOfPocketItemEditForm.init();
}
BudgetInfo.prototype.createAgreement = function(event) {
   var agreementEditForm = new AgreementEditForm({
        "mode": 'CREATE',
        "id": null,
        "projectCodeId": this.projectCodeId,
        "number" : "",
        "isSigned" : false,
        "date" : "",
        "type" : null,
        "isRenewal" : false,
        "comment" : ""
    }, "agreementEditForm", this.refreshInfo, this);
    agreementEditForm.init();
}
BudgetInfo.prototype.addFeesAdvance = function(event) {
   var feesAdvanceEditForm = new FeesAdvanceEditForm({
        "mode": 'CREATE',
        "id": null,
        "feesItemId": this.loaded.feesItem.id,
        "amount": "",
        "date": "",
        "isAdvance": false
    }, "feesAdvanceEditForm", this.refreshInfo, this);
    feesAdvanceEditForm.init();
}
BudgetInfo.prototype.addFeesInvoice = function(event) {
   var feesInvoiceEditForm = new FeesInvoiceEditForm({
        "mode": 'CREATE',
        "id": null,
        "feesItemId": this.loaded.feesItem.id,
        "amount": "",
        "vatIncludedAmount": "",
        "date": "",
        "reference": "",
        "isAdvance": false
    }, "feesInvoiceEditForm", this.refreshInfo, this);
    feesInvoiceEditForm.init();
}
BudgetInfo.prototype.addFeesPayment = function(event) {
   var feesPaymentEditForm = new FeesPaymentEditForm({
        "mode": 'CREATE',
        "id": null,
        "feesItemId": this.loaded.feesItem.id,
        "amount": "",
        "cvAmount": "",
        "reference": "",
        "invoiceReference": "",
        "date": ""
    }, "feesPaymentEditForm", this.refreshInfo, this);
    feesPaymentEditForm.init();
}
BudgetInfo.prototype.addFeesAct = function(event) {
   var feesActEditForm = new FeesActEditForm({
        "mode": 'CREATE',
        "id": null,
        "feesItemId": this.loaded.feesItem.id,
        "amount": "",
        "cvAmount": "",
        "date": "",
        "reference": "",
        "isSigned": false
    }, "feesActEditForm", this.refreshInfo, this);
    feesActEditForm.init();
}
BudgetInfo.prototype.addOutOfPocketInvoice = function(event) {
   var outOfPocketInvoiceEditForm = new OutOfPocketInvoiceEditForm({
        "mode": 'CREATE',
        "id": null,
        "outOfPocketItemId": this.loaded.outOfPocketItem.id,
        "amount": "",
        "vatIncludedAmount": "",
        "date": "",
        "reference": "",
        "isAdvance": false
    }, "outOfPocketInvoiceEditForm", this.refreshInfo, this);
    outOfPocketInvoiceEditForm.init();
}
BudgetInfo.prototype.addOutOfPocketPayment = function(event) {
   var outOfPocketPaymentEditForm = new OutOfPocketPaymentEditForm({
        "mode": 'CREATE',
        "id": null,
        "outOfPocketItemId": this.loaded.outOfPocketItem.id,
        "amount": "",
        "cvAmount": "",
        "reference": "",
        "invoiceReference": "",
        "date": ""
    }, "outOfPocketPaymentEditForm", this.refreshInfo, this);
    outOfPocketPaymentEditForm.init();
}
BudgetInfo.prototype.addOutOfPocketAct = function(event) {
   var outOfPocketActEditForm = new OutOfPocketActEditForm({
        "mode": 'CREATE',
        "id": null,
        "outOfPocketItemId": this.loaded.outOfPocketItem.id,
        "amount": "",
        "cvAmount": "",
        "date": "",
        "reference": "",
        "isSigned": false
    }, "outOfPocketActEditForm", this.refreshInfo, this);
    outOfPocketActEditForm.init();
}

BudgetInfo.prototype.editFeesItem = function(event) {
    var positionQuotations = this.loaded.positionQuotations;
    var feesItemEditForm = new FeesItemEditForm({
        "mode": 'UPDATE',
        "id": this.loaded.feesItem.id,
        "date": calendarVisualizer.getHtml(this.loaded.feesItem.date),
        "projectCodeId": this.projectCodeId,
        "type" : this.loaded.feesItem.type,
        "feesAdvanceCurrencyId": this.loaded.feesItem.feesAdvanceCurrencyId,
        "feesInvoiceCurrencyId": this.loaded.feesItem.feesInvoiceCurrencyId,
        "feesPaymentCurrencyId": this.loaded.feesItem.feesPaymentCurrencyId,
        "feesActCurrencyId": this.loaded.feesItem.feesActCurrencyId,

        "positionQuotations": positionQuotations,
        "quotationCurrencyRate": this.loaded.feesItem.quotationCurrencyRate,
        "quotationNegociated": this.loaded.feesItem.quotationNegociated,
        "vat": this.loaded.feesItem.vat,
        "comment": this.loaded.feesItem.comment
     }, "feesItemEditForm", this.refreshInfo, this);
    feesItemEditForm.init();
}
BudgetInfo.prototype.editOutOfPocketItem = function(event) {
    var outOfPocketItemEditForm = new OutOfPocketItemEditForm({
        "mode": 'UPDATE',
        "id": this.loaded.outOfPocketItem.id,
        "date": calendarVisualizer.getHtml(this.loaded.outOfPocketItem.date),
        "projectCodeId": this.projectCodeId,
        "type" : this.loaded.outOfPocketItem.type,
        "amount": this.loaded.outOfPocketItem.amount,
        "currencyId": this.loaded.outOfPocketItem.currencyId,
        "outOfPocketInvoiceCurrencyId": this.loaded.outOfPocketItem.outOfPocketInvoiceCurrencyId,
        "outOfPocketPaymentCurrencyId": this.loaded.outOfPocketItem.outOfPocketPaymentCurrencyId,
        "outOfPocketActCurrencyId": this.loaded.outOfPocketItem.outOfPocketActCurrencyId
     }, "outOfPocketItemEditForm", this.refreshInfo, this);
    outOfPocketItemEditForm.init();
}
BudgetInfo.prototype.editAgreement = function(event) {
     var agreement = this.loaded.agreement;
     var agreementEditForm = new AgreementEditForm({
        "mode": 'UPDATE',
        "id": agreement.id,
        "budgetId": agreement.budgetId,
        "number" : agreement.number,
        "isSigned" : agreement.isSigned,
        "date" : calendarVisualizer.getHtml(agreement.date),
        "type" : agreement.type,
        "isRenewal" : agreement.isRenewal,
        "comment" : agreement.comment
     }, "agreementEditForm", this.refreshInfo, this);
    agreementEditForm.init();
}

BudgetInfo.prototype.editFeesAdvance = function(event) {
     var htmlId=event.currentTarget.id;
     var tmp = htmlId.split("_");
     var feesAdvanceId = tmp[tmp.length - 1];
     var feesAdvance = this.getElementById(feesAdvanceId, this.loaded.feesAdvances);
     var feesAdvanceEditForm = new FeesAdvanceEditForm({
        "mode": 'UPDATE',
        "id": feesAdvance.id,
        "feesItemId": feesAdvance.feesItemId,
        "isAdvance": feesAdvance.isAdvance,
        "amount": feesAdvance.amount,
        "date": calendarVisualizer.getHtml(feesAdvance.date)
     }, "feesAdvanceEditForm", this.refreshInfo, this);
    feesAdvanceEditForm.init();
}
BudgetInfo.prototype.editFeesInvoice = function(event) {
     var htmlId=event.currentTarget.id;
     var tmp = htmlId.split("_");
     var feesInvoiceId = tmp[tmp.length - 1];
     var feesInvoice = this.getElementById(feesInvoiceId, this.loaded.feesInvoices);
     var feesInvoiceEditForm = new FeesInvoiceEditForm({
        "mode": 'UPDATE',
        "id": feesInvoice.id,
        "feesItemId": feesInvoice.feesItemId,
        "amount": feesInvoice.amount,
        "vatIncludedAmount": feesInvoice.vatIncludedAmount,
        "date": calendarVisualizer.getHtml(feesInvoice.date),
        "reference": feesInvoice.reference,
        "isAdvance": feesInvoice.isAdvance
     }, "feesInvoiceEditForm", this.refreshInfo, this);
    feesInvoiceEditForm.init();
}
BudgetInfo.prototype.editFeesPayment = function(event) {
     var htmlId=event.currentTarget.id;
     var tmp = htmlId.split("_");
     var feesPaymentId = tmp[tmp.length - 1];
     var feesPayment = this.getElementById(feesPaymentId, this.loaded.feesPayments);;
     var feesPaymentEditForm = new FeesPaymentEditForm({
        "mode": 'UPDATE',
        "id": feesPayment.id,
        "feesItemId": feesPayment.feesItemId,
        "amount": feesPayment.amount,
        "cvAmount": feesPayment.cvAmount,
        "reference": feesPayment.reference,
        "invoiceReference": feesPayment.invoiceReference,
        "date": calendarVisualizer.getHtml(feesPayment.date)
     }, "feesPaymentEditForm", this.refreshInfo, this);
    feesPaymentEditForm.init();
}
BudgetInfo.prototype.editFeesAct = function(event) {
     var htmlId=event.currentTarget.id;
     var tmp = htmlId.split("_");
     var feesActId = tmp[tmp.length - 1];
     var feesAct = this.getElementById(feesActId, this.loaded.feesActs);;
     var feesActEditForm = new FeesActEditForm({
        "mode": 'UPDATE',
        "id": feesAct.id,
        "feesItemId": feesAct.feesItemId,
        "amount": feesAct.amount,
        "cvAmount": feesAct.cvAmount,
        "date": calendarVisualizer.getHtml(feesAct.date),
        "reference": feesAct.reference,
        "isSigned": feesAct.isSigned
     }, "feesActEditForm", this.refreshInfo, this);
    feesActEditForm.init();
}

BudgetInfo.prototype.editOutOfPocketInvoice = function(event) {
     var htmlId=event.currentTarget.id;
     var tmp = htmlId.split("_");
     var outOfPocketInvoiceId = tmp[tmp.length - 1];
     var outOfPocketInvoice = this.getElementById(outOfPocketInvoiceId, this.loaded.outOfPocketInvoices);
     var outOfPocketInvoiceEditForm = new OutOfPocketInvoiceEditForm({
        "mode": 'UPDATE',
        "id": outOfPocketInvoice.id,
        "outOfPocketItemId": outOfPocketInvoice.outOfPocketItemId,
        "amount": outOfPocketInvoice.amount,
        "vatIncludedAmount": outOfPocketInvoice.vatIncludedAmount,
        "date": calendarVisualizer.getHtml(outOfPocketInvoice.date),
        "reference": outOfPocketInvoice.reference
     }, "outOfPocketInvoiceEditForm", this.refreshInfo, this);
    outOfPocketInvoiceEditForm.init();
}
BudgetInfo.prototype.editOutOfPocketPayment = function(event) {
     var htmlId=event.currentTarget.id;
     var tmp = htmlId.split("_");
     var outOfPocketPaymentId = tmp[tmp.length - 1];
     var outOfPocketPayment = this.getElementById(outOfPocketPaymentId, this.loaded.outOfPocketPayments);;
     var outOfPocketPaymentEditForm = new OutOfPocketPaymentEditForm({
        "mode": 'UPDATE',
        "id": outOfPocketPayment.id,
        "outOfPocketItemId": outOfPocketPayment.outOfPocketItemId,
        "amount": outOfPocketPayment.amount,
        "cvAmount": outOfPocketPayment.cvAmount,
        "date": calendarVisualizer.getHtml(outOfPocketPayment.date),
        "reference": outOfPocketPayment.reference,
        "invoiceReference": outOfPocketPayment.invoiceReference
     }, "outOfPocketPaymentEditForm", this.refreshInfo, this);
    outOfPocketPaymentEditForm.init();
}
BudgetInfo.prototype.editOutOfPocketAct = function(event) {
     var htmlId=event.currentTarget.id;
     var tmp = htmlId.split("_");
     var outOfPocketActId = tmp[tmp.length - 1];
     var outOfPocketAct = this.getElementById(outOfPocketActId, this.loaded.outOfPocketActs);;
     var outOfPocketActEditForm = new OutOfPocketActEditForm({
        "mode": 'UPDATE',
        "id": outOfPocketAct.id,
        "feesItemId": outOfPocketAct.feesItemId,
        "amount": outOfPocketAct.amount,
        "cvAmount": outOfPocketAct.cvAmount,
        "date": calendarVisualizer.getHtml(outOfPocketAct.date),
        "reference": outOfPocketAct.reference,
        "isSigned": outOfPocketAct.isSigned
     }, "outOfPocketActEditForm", this.refreshInfo, this);
    outOfPocketActEditForm.init();
}
BudgetInfo.prototype.deleteFeesItem = function(event) {
    var feesItemDeleteForm = new FeesItemDeleteForm(this.loaded.feesItem.id, this.refreshInfo, this);
    feesItemDeleteForm.start();
}
BudgetInfo.prototype.deleteOutOfPocketItem = function(event) {
    var outOfPocketDeleteForm = new OutOfPocketItemDeleteForm(this.loaded.outOfPocketItem.id, this.refreshInfo, this);
    outOfPocketDeleteForm.start();
}
BudgetInfo.prototype.deleteAgreement = function(event) {
    var agreementDeleteForm = new AgreementDeleteForm(this.loaded.agreement.id, this.refreshInfo, this);
    agreementDeleteForm.start();
}

BudgetInfo.prototype.deleteFeesAdvance = function(event) {
    var htmlId=event.currentTarget.id;
    var tmp = htmlId.split("_");
    var feesAdvanceId = tmp[tmp.length - 1];
    var feesAdvanceDeleteForm = new FeesAdvanceDeleteForm(feesAdvanceId, this.refreshInfo, this);
    feesAdvanceDeleteForm.start();
}
BudgetInfo.prototype.deleteFeesInvoice = function(event) {
  var htmlId=event.currentTarget.id;
  var tmp = htmlId.split("_");
  var feesInvoiceId = tmp[tmp.length - 1];
  var feesInvoiceDeleteForm = new FeesInvoiceDeleteForm(feesInvoiceId, this.refreshInfo, this);
  feesInvoiceDeleteForm.start();
}
BudgetInfo.prototype.deleteFeesPayment = function(event) {
    var htmlId=event.currentTarget.id;
    var tmp = htmlId.split("_");
    var feesPaymentId = tmp[tmp.length - 1];
    var feesPaymentDeleteForm = new FeesPaymentDeleteForm(feesPaymentId, this.refreshInfo, this);
    feesPaymentDeleteForm.start();
}
BudgetInfo.prototype.deleteFeesAct = function(event) {
    var htmlId=event.currentTarget.id;
    var tmp = htmlId.split("_");
    var feesActId = tmp[tmp.length - 1];
    var feesActDeleteForm = new FeesActDeleteForm(feesActId, this.refreshInfo, this);
    feesActDeleteForm.start();
}

BudgetInfo.prototype.deleteOutOfPocketInvoice = function(event) {
  var htmlId=event.currentTarget.id;
  var tmp = htmlId.split("_");
  var outOfPocketInvoiceId = tmp[tmp.length - 1];
  var outOfPocketInvoiceDeleteForm = new OutOfPocketInvoiceDeleteForm(outOfPocketInvoiceId, this.refreshInfo, this);
  outOfPocketInvoiceDeleteForm.start();
}
BudgetInfo.prototype.deleteOutOfPocketPayment = function(event) {
    var htmlId=event.currentTarget.id;
    var tmp = htmlId.split("_");
    var outOfPocketPaymentId = tmp[tmp.length - 1];
    var outOfPocketPaymentDeleteForm = new OutOfPocketPaymentDeleteForm(outOfPocketPaymentId, this.refreshInfo, this);
    outOfPocketPaymentDeleteForm.start();
}
BudgetInfo.prototype.deleteOutOfPocketAct = function(event) {
    var htmlId=event.currentTarget.id;
    var tmp = htmlId.split("_");
    var outOfPocketActId = tmp[tmp.length - 1];
    var outOfPocketActDeleteForm = new OutOfPocketActDeleteForm(outOfPocketActId, this.refreshInfo, this);
    outOfPocketActDeleteForm.start();
}

BudgetInfo.prototype.getElementById = function(id, collection) {
    for(var key in collection) {
        var element = collection[key];
        if(element.id == id) {
            return element;
        }
    }
    return null;
}