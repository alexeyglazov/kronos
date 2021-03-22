/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
function InvoicingReport(htmlId, containerHtmlId) {
    this.config = {
        endpointUrl: endpointsFolder + "InvoicingReport.jsp"
    }
    this.htmlId = htmlId;
    this.containerHtmlId = containerHtmlId;
    this.moduleName = "Financial Information Report";
    
    this.loaded = {
        "mainCurrency": null,
        "currencies": []
    }
    this.sorter = {
        "field": 'CODE',
        "order": 'ASC'
    };
    this.limiter = {
        "page": 0,
        "itemsPerPage": 10
    };
    this.data = {
        "currencyRates" : {},
        "filter": ProjectCodesListFilter.prototype.getDefaultFilter(),
        "invoiceRequestsFilter": InvoiceRequestsFilter.prototype.getDefaultFilter()
    }
    this.reports = {};
}
InvoicingReport.prototype.init = function() {
    contentSizeChangedEventSubscribers.push({"context": this, "function": this.normalizeContentSize});
    this.loadInitialContent();
}
InvoicingReport.prototype.loadInitialContent = function() {
    var form = this;
    var data = {};
    data.command = "getInitialContent";
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.mainCurrency = result.mainCurrency;
            form.loaded.currencies = result.currencies;
            form.show();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}

InvoicingReport.prototype.show = function() {
    $('#' + this.containerHtmlId).html(this.getHtml());
    this.makeButtons();
    this.updateView();
    this.setHandlers();
    this.normalizeContentSize();
}
InvoicingReport.prototype.getHtml = function() {
    var html = '';
    html += '<fieldset>';
    html += '<table>';
    for(var key in this.loaded.currencies) {
        var currency = this.loaded.currencies[key];
        if(currency.id == this.loaded.mainCurrency.id) {
            continue;
        }
        html += '<tr><td><span class="label1">' + this.loaded.mainCurrency.code + ' for 1 ' + currency.code + '</span></td><td><input type="text" id="' + this.htmlId + '_currencyRate_' + currency.id + '"></td></tr>';
    }
    html += '</table>';

    html += '<table>';
    html += '<tr><td id="' + this.htmlId + '_filterCell"><button id="' + this.htmlId + '_filterBtn">Project code filter</button></td><td id="' + this.htmlId + '_invoiceRequestsFilterCell"><button id="' + this.htmlId + '_invoiceRequestsFilterBtn">Invoice filter</button></td></tr>';
    html += '</table>';
    
    html += '<table>';
    html += '<tr><td><input type="button" id="' + this.htmlId + '_generateBtn' + '" value="Generate"><input type="button" id="' + this.htmlId + '_generateXLSBtn' + '" value="Generate XLS"></td></tr>';
    html += '</table>';



    html += '</fieldset>';
    html += '<div id="' + this.htmlId + '_heading"></div>';
    html += '<div id="' + this.htmlId + '_report"></div>';
    html += '<form id="' + this.htmlId + '_xlsForm' + '" target="_blank" action="' + this.config.endpointUrl + '" method="post">';
    html += '<input type="hidden" id="' + this.htmlId + '_xlsForm_command' + '" name="command" value="">';
    html += '<input type="hidden" id="' + this.htmlId + '_xlsForm_data' + '" name="invoicingReportForm" value="">';
    html += '</form>';
    html += '<div id="' + this.htmlId + '_info"></div>';
    return html;
}
InvoicingReport.prototype.makeButtons = function() {
    var form = this;
    $('#' + this.htmlId + '_filterBtn')
      .button({
        icons: {
            primary: "ui-icon-search"
        },
        text: true
        })
      .click(function( event ) {
        form.showFilter.call(form);
    });

    $('#' + this.htmlId + '_invoiceRequestsFilterBtn')
      .button({
        icons: {
            primary: "ui-icon-search"
        },
        text: true
        })
      .click(function( event ) {
        form.showInvoiceRequestsFilter.call(form);
    });
}    
InvoicingReport.prototype.setHandlers = function() {
    var form = this;
    $('input[id^="' + this.htmlId + '_currencyRate_"]').bind("change", function(event) {form.currencyRateChangedHandle.call(form, event)});

    $('#' + this.htmlId + '_generateBtn').bind("click", function(event) {form.startGenerating.call(form, event)});
    $('#' + this.htmlId + '_generateXLSBtn').bind("click", function(event) {form.startGeneratingXLS.call(form, event)});
}

InvoicingReport.prototype.currencyRateChangedHandle = function(event) {
    var currencyRateRE = /^[0-9]*[\.]?[0-9]*$/;
    var id = event.currentTarget.id;
    var tmp = id.split("_");
    var currencyId = tmp[tmp.length - 1];
    var value = jQuery.trim(event.currentTarget.value);
    if(value == "") {
        this.data.currencyRates[currencyId] = null;
    } else if(currencyRateRE.test(value)) {
        this.data.currencyRates[currencyId] = parseFloat(value);
    } else {
    }
    this.updateCurrencyRatesView();
}
InvoicingReport.prototype.showFilter = function() {
    this.filterForm = new ProjectCodesListFilter("projectCodesListFilter", this.moduleName, this.data.filter, this.acceptFilterData, this);
    this.filterForm.init();
}
InvoicingReport.prototype.showInvoiceRequestsFilter = function() {
    this.invoiceRequestsFilterForm = new InvoiceRequestsFilter("invoiceRequestsFilter", this.moduleName, this.data.invoiceRequestsFilter, this.acceptInvoiceRequestsFilterData, this);
    this.invoiceRequestsFilterForm.init(); 
}
InvoicingReport.prototype.acceptFilterData = function(filter) {
    this.limiter.page = 0;
    this.data.filter = filter;
    var filterStr = getJSON(this.data.filter);
    var expire = new Date();
    expire.setTime(expire.getTime() + 1000 * 60 * 60 * 24 * 100);
    setCookie("projectCodesListFilter", filterStr, expire.toGMTString(), null);
    this.updateFilterSelectionView();
}
InvoicingReport.prototype.acceptInvoiceRequestsFilterData = function(invoiceRequestsFilter) {
    this.limiter.page = 0;
    this.data.invoiceRequestsFilter = invoiceRequestsFilter;
//    var filterStr = getJSON(this.filter);
//    var expire = new Date();
//    expire.setTime(expire.getTime() + 1000 * 60 * 60 * 24 * 100);
//    setCookie("projectCodesListFilter", filterStr, expire.toGMTString(), null);
    this.updateFilterSelectionView();
}


InvoicingReport.prototype.updateView = function() {
   this.updateCurrencyRatesView();
   this.updateFilterSelectionView();
}

InvoicingReport.prototype.updateCurrencyRatesView = function() {
    for(var key in this.loaded.currencies) {
        var currency = this.loaded.currencies[key];
        if(currency.id == this.loaded.mainCurrency.id) {
            continue;
        }
        $('#' + this.htmlId + '_currencyRate_' + currency.id).val(this.data.currencyRates[currency.id]);
    }
}
InvoicingReport.prototype.updateFilterSelectionView = function() {
    if(ProjectCodesListFilter.prototype.isFilterUsed(this.data.filter)) {
        $('#' + this.htmlId + '_filterCell').css('border-left', '3px solid #009900');
    } else {
        $('#' + this.htmlId + '_filterCell').css('border-left', '0px');
    }
    if(InvoiceRequestsFilter.prototype.isFilterUsed(this.data.invoiceRequestsFilter)) {
        $('#' + this.htmlId + '_invoiceRequestsFilterCell').css('border-left', '3px solid #009900');
    } else {
        $('#' + this.htmlId + '_invoiceRequestsFilterCell').css('border-left', '0px');
    }
}
InvoicingReport.prototype.validate = function() {
    var errors = [];
    var numberRE = /^[0-9]*[\.]?[0-9]*$/;
    for(var key in this.loaded.currencies) {
        var currency = this.loaded.currencies[key];
        if(currency.id == this.loaded.mainCurrency.id) {
            continue;
        }
        var rate = this.data.currencyRates[currency.id];
        if(rate == null || jQuery.trim(rate) == '') {
            errors.push('Rate for ' + currency.code + ' is not set');
        } else if(! numberRE.test(rate)) {
            errors.push('Rate for ' + currency.code + ' is not a number');
        } else if(isNaN(parseFloat(rate))) {
            errors.push('Rate for ' + currency.code + ' is not a number');
        } else if(parseFloat(rate) <= 0) {
            errors.push('Rate for ' + currency.code + ' must be a positive number');
        }
    }
    //if(! ProjectCodesListFilter.prototype.isFilterUsed(this.data.filter)) {
    //    errors.push('Filter is empty');
    //}
    return errors;
}
InvoicingReport.prototype.startGeneratingXLS = function() {
    var errors = this.validate();
    if(errors.length > 0) {
        showErrors(errors);
    } else {
      this.generateXLSReport();
    }
}
InvoicingReport.prototype.generateXLSReport = function() {
    $('#' + this.htmlId + '_xlsForm_command').val('generateXLSReport');
    $('#' + this.htmlId + '_xlsForm_data').val(getJSON(this.data));
    $('#' + this.htmlId + '_xlsForm').submit();
}
InvoicingReport.prototype.startGenerating = function() {
    var errors = this.validate();
    if(errors.length > 0) {
        showErrors(errors);
    } else {
      this.generateReport();
    }
}
InvoicingReport.prototype.generateReport = function() {
    var form = this;
    var data = {};
    data.command = "generateReport";
    data.invoicingReportForm = getJSON(this.data);
    $.ajax({
        url: this.config.endpointUrl,
        data: data,
        cache: false,
        type: "POST",
        success: function(data){
            ajaxResultHandle(data, form, function(result) {
                form.invoicingReport = result.invoicingReport;
                form.updateReportView();
            })
        },
        error: function(jqXHR, textStatus, errorThrown) {
            ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
        }
    });
}
InvoicingReport.prototype.updateReportView = function() {
    this.updateReportHeaderView();
    this.updateReportBodyView();
}
InvoicingReport.prototype.updateReportHeaderView = function(financialYear) {
    var headingHtml = '';
    headingHtml += '<table class="datagrid">';
    for(var key in this.invoicingReport.currencies) {
        var currency = this.invoicingReport.currencies[key];
        if(currency.id == this.invoicingReport.mainCurrency.id) {
            continue;
        }
        headingHtml += '<tr><td>' + currency.code + ' / ' + this.invoicingReport.mainCurrency.code + '</td><td>' + this.invoicingReport.formCurrencyRates[currency.id] + '</td></tr>';
    }
    headingHtml += '<tr><td>Project code filter is used</td><td>' + booleanVisualizer.getHtml(this.invoicingReport.isFilterUsed) + '</td></tr>';
    headingHtml += '<tr><td>Invoice requests filter is used</td><td>' + booleanVisualizer.getHtml(this.invoicingReport.isInvoiceRequestsFilterUsed) + '</td></tr>';
    headingHtml += '<tr><td>Report generated at</td><td>' + getStringFromYearMonthDateTime(this.invoicingReport.createdAt) + '</td></tr>';
    headingHtml += '</table>';
    $('#' + this.htmlId + '_heading').html(headingHtml);    
}
InvoicingReport.prototype.updateReportBodyView = function(financialYear) {
    var html = "";
    html += '<table class="datagrid nowrap" id="' + this.htmlId + '_report_body"></table>';
    $('#' + this.htmlId + '_report').html(html);
    var normalizedData = [];
    for(var key in this.invoicingReport.rows) {
        var row = this.invoicingReport.rows[key];
        var normalizedRow = {
            'officeName' : row.officeName,
            'departmentName' : row.departmentName,
            'subdepartmentName' : row.subdepartmentName,
            'groupName' : row.groupName,
            'clientName' : row.clientName,
            'projectCodeCode' : row.projectCodeCode,
            'projectCodeDescription' : row.projectCodeDescription,
            'projectCodeInChargePerson' : row.projectCodeInChargePerson,
            'projectCodeInChargePartner' : row.projectCodeInChargePartner,
            'projectCodeFinancialYear' : this.getFinancialYearView(row.projectCodeFinancialYear),
            'lastFillingDay' : calendarVisualizer.getHtml(row.lastFillingDay),
            'timeSpent' : row.timeSpent /60.0,
            'projectCodeIsClosed' : booleanVisualizer.getHtml(row.projectCodeClosedAt),
            'projectCodeClosedAt' : getStringFromYearMonthDateTime(row.projectCodeClosedAt),
            'projectCodeCreatedAt' : getStringFromYearMonthDateTime(row.projectCodeCreatedAt),
            'projectCodeIsDead' : booleanVisualizer.getHtml(row.projectCodeIsDead)
        };
        if(row.feesItem != null) {
            normalizedRow['feesAdvance_' + row.feesItem.feesAdvanceCurrencyId] = row.feesAdvanceTotalAmount;
            normalizedRow['feesInvoice_' + row.feesItem.feesInvoiceCurrencyId] = row.feesInvoiceTotalAmount;
            normalizedRow['feesVatIncludedInvoice_' + row.feesItem.feesInvoiceCurrencyId] = row.feesInvoiceTotalVatIncludedAmount;
            normalizedRow['feesPayment_' + row.feesItem.feesInvoiceCurrencyId] = row.feesPaymentTotalAmount;
            normalizedRow['feesAct_' + row.feesItem.feesActCurrencyId] = row.feesActTotalAmount;
            if(row.feesItem.feesAdvanceCurrencyId != this.invoicingReport.mainCurrency.id) {
                normalizedRow['feesAdvanceCv'] = row.feesAdvanceTotalAmount * this.invoicingReport.formCurrencyRates[row.feesItem.feesAdvanceCurrencyId];
            } else {
                normalizedRow['feesAdvanceCv'] = row.feesAdvanceTotalAmount;
            }
            if(row.feesItem.feesInvoiceCurrencyId != this.invoicingReport.mainCurrency.id) {
                normalizedRow['feesInvoiceCv'] = row.feesInvoiceTotalAmount * this.invoicingReport.formCurrencyRates[row.feesItem.feesInvoiceCurrencyId];
            } else {
                normalizedRow['feesInvoiceCv'] = row.feesInvoiceTotalAmount;
            }
            if(row.feesItem.feesInvoiceCurrencyId != this.invoicingReport.mainCurrency.id) {
                normalizedRow['feesVatIncludedInvoiceCv'] = row.feesInvoiceTotalVatIncludedAmount * this.invoicingReport.formCurrencyRates[row.feesItem.feesInvoiceCurrencyId];
            } else {
                normalizedRow['feesVatIncludedInvoiceCv'] = row.feesInvoiceTotalVatIncludedAmount;
            }
            if(row.feesItem.feesInvoiceCurrencyId != this.invoicingReport.mainCurrency.id) {
                normalizedRow['feesPaymentCv'] = row.feesPaymentTotalCvAmount;
            } else {
                normalizedRow['feesPaymentCv'] = row.feesPaymentTotalAmount;
            }
            if(row.feesItem.feesActCurrencyId != this.invoicingReport.mainCurrency.id) {
                normalizedRow['feesActCv'] = row.feesActTotalCvAmount;
            } else {
                normalizedRow['feesActCv'] = row.feesActTotalAmount;
            }
        }
        normalizedRow['feesActIsSigned'] = row.feesActIsSigned;
        if(row.outOfPocketItem != null) {
            normalizedRow['outOfPocketInvoice_' + row.outOfPocketItem.outOfPocketInvoiceCurrencyId] = row.outOfPocketInvoiceTotalAmount;
            normalizedRow['outOfPocketVatIncludedInvoice_' + row.outOfPocketItem.outOfPocketInvoiceCurrencyId] = row.outOfPocketInvoiceTotalVatIncludedAmount;
            normalizedRow['outOfPocketPayment_' + row.outOfPocketItem.outOfPocketInvoiceCurrencyId] = row.outOfPocketPaymentTotalAmount;
            normalizedRow['outOfPocketAct_' + row.outOfPocketItem.outOfPocketActCurrencyId] = row.outOfPocketActTotalAmount;
            if(row.outOfPocketItem.outOfPocketInvoiceCurrencyId != this.invoicingReport.mainCurrency.id) {
                normalizedRow['outOfPocketInvoiceCv'] = row.outOfPocketInvoiceTotalAmount * this.invoicingReport.formCurrencyRates[row.outOfPocketItem.outOfPocketInvoiceCurrencyId];
            } else {
                normalizedRow['outOfPocketInvoiceCv'] = row.outOfPocketInvoiceTotalAmount;
            }
            if(row.outOfPocketItem.outOfPocketInvoiceCurrencyId != this.invoicingReport.mainCurrency.id) {
                normalizedRow['outOfPocketVatIncludedInvoiceCv'] = row.outOfPocketInvoiceTotalVatIncludedAmount * this.invoicingReport.formCurrencyRates[row.outOfPocketItem.outOfPocketInvoiceCurrencyId];
            } else {
                normalizedRow['outOfPocketVatIncludedInvoiceCv'] = row.outOfPocketInvoiceTotalVatIncludedAmount;
            }
            if(row.outOfPocketItem.outOfPocketInvoiceCurrencyId != this.invoicingReport.mainCurrency.id) {
                normalizedRow['outOfPocketPaymentCv'] = row.outOfPocketPaymentTotalCvAmount;
            } else {
                normalizedRow['outOfPocketPaymentCv'] = row.outOfPocketPaymentTotalAmount;
            }
            if(row.outOfPocketItem.outOfPocketActCurrencyId != this.invoicingReport.mainCurrency.id) {
                normalizedRow['outOfPocketActCv'] = row.outOfPocketActTotalCvAmount;
            } else {
                normalizedRow['outOfPocketActCv'] = row.outOfPocketActTotalAmount;
            }
        }
        normalizedRow['outOfPocketActIsSigned'] = row.outOfPocketActIsSigned;
        normalizedData.push(normalizedRow);
    }
    
    jQuery('#' + this.htmlId + '_report_body').jqGrid('clearGridData');
    var colNames = ['Office', 'Department', 'Subdepartment', 'Group', 'Client', 'Project', 'Description', 'Person in charge', 'Partner in charge', 'Financial Period', 'Last Day of TS filling', 'Hours', 'Closed', 'Closed At', 'Created At', 'Dead'];
    var colModel = [
            {name:'officeName',index:'officeName', width: 80, frozen: false},
            {name:'departmentName',index:'departmentName', width: 80},
            {name:'subdepartmentName',index:'subdepartmentName', width: 80},
            {name:'groupName',index:'groupName', width: 80},
            {name:'clientName',index:'clientName', width: 80},
            {name:'projectCodeCode',index:'projectCodeCode', width: 80},
            {name:'projectCodeDescription',index:'projectCodeDescription', width: 80},
            {name:'projectCodeInChargePerson',index:'projectCodeInChargePerson', width: 80},
            {name:'projectCodeInChargePartner',index:'projectCodeInChargePartner', width: 80},
            {name:'projectCodeFinancialYear',index:'projectCodeFinancialYear', width: 80},
            {name:'lastFillingDay',index:'lastFillingDay', width: 80},
            {name:'timeSpent',index:'timeSpent', width: 80, formatter: 'number'},
            {name:'projectCodeIsClosed',index:'projectCodeIsClosed', width: 80},
            {name:'projectCodeClosedAt',index:'projectCodeClosedAt', width: 80},
            {name:'projectCodeCreatedAt',index:'projectCodeCreatedAt', width: 80},
            {name:'projectCodeIsDead',index:'projectCodeIsDead', width: 80}
    ];

    for(var key in this.invoicingReport.currencies) {
        var currency = this.invoicingReport.currencies[key];
        colNames.push('Budget (' + currency.code + ')');
        colModel.push({name:'feesAdvance_' + currency.id, index:'feesAdvance_' + currency.id, width: 80});
    }
    colNames.push('Budget Cv' + this.invoicingReport.mainCurrency.code);
    colModel.push({name:'feesAdvanceCv', index:'feesAdvanceCv', width: 80});

    for(var key in this.invoicingReport.currencies) {
        var currency = this.invoicingReport.currencies[key];
        colNames.push('Invoice (' + currency.code + ')');
        colModel.push({name:'feesInvoice_' + currency.id, index:'feesInvoice_' + currency.id, width: 80});
    }
    colNames.push('Invoice Cv' + this.invoicingReport.mainCurrency.code);
    colModel.push({name:'feesInvoiceCv', index:'feesInvoiceCv', width: 80});

    for(var key in this.invoicingReport.currencies) {
        var currency = this.invoicingReport.currencies[key];
        colNames.push('VAT Invoice (' + currency.code + ')');
        colModel.push({name:'feesVatIncludedInvoice_' + currency.id, index:'feesVatIncludedInvoice_' + currency.id, width: 80});
    }
    colNames.push('VAT Invoice Cv' + this.invoicingReport.mainCurrency.code);
    colModel.push({name:'feesVatIncludedInvoiceCv', index:'feesVatIncludedInvoiceCv', width: 80});

    for(var key in this.invoicingReport.currencies) {
        var currency = this.invoicingReport.currencies[key];
        colNames.push('Payment (' + currency.code + ')');
        colModel.push({name:'feesPayment_' + currency.id, index:'feesPayment_' + currency.id, width: 80});
    }
    colNames.push('Payment Cv' + this.invoicingReport.mainCurrency.code);
    colModel.push({name:'feesPaymentCv', index:'feesPaymentCv', width: 80});

    for(var key in this.invoicingReport.currencies) {
        var currency = this.invoicingReport.currencies[key];
        colNames.push('Act (' + currency.code + ')');
        colModel.push({name:'feesAct_' + currency.id, index:'feesAct_' + currency.id, width: 80});
    }
    colNames.push('Act Cv' + this.invoicingReport.mainCurrency.code);
    colModel.push({name:'feesActCv', index:'feesActCv', width: 80});

    colNames.push('Fees Acts Signed');
    colModel.push({name:'feesActIsSigned', index:'feesActIsSigned', width: 80});

    for(var key in this.invoicingReport.currencies) {
        var currency = this.invoicingReport.currencies[key];
        colNames.push('OOP Invoice (' + currency.code + ')');
        colModel.push({name:'outOfPocketInvoice_' + currency.id, index:'outOfPocketInvoice_' + currency.id, width: 80});
    }
    colNames.push('OOP Invoice Cv' + this.invoicingReport.mainCurrency.code);
    colModel.push({name:'outOfPocketInvoiceCv', index:'outOfPocketInvoiceCv', width: 80});

    for(var key in this.invoicingReport.currencies) {
        var currency = this.invoicingReport.currencies[key];
        colNames.push('OOP VAT Invoice (' + currency.code + ')');
        colModel.push({name:'outOfPocketVatIncludedInvoice_' + currency.id, index:'outOfPocketVatIncludedInvoice_' + currency.id, width: 80});
    }
    colNames.push('OOP VAT Invoice Cv' + this.invoicingReport.mainCurrency.code);
    colModel.push({name:'outOfPocketVatIncludedInvoiceCv', index:'outOfPocketVatIncludedInvoiceCv', width: 80});

    for(var key in this.invoicingReport.currencies) {
        var currency = this.invoicingReport.currencies[key];
        colNames.push('OOP Payment (' + currency.code + ')');
        colModel.push({name:'outOfPocketPayment_' + currency.id, index:'outOfPocketPayment_' + currency.id, width: 80});
    }
    colNames.push('OOP Payment Cv' + this.invoicingReport.mainCurrency.code);
    colModel.push({name:'outOfPocketPaymentCv', index:'outOfPocketPaymentCv', width: 80});

    for(var key in this.invoicingReport.currencies) {
        var currency = this.invoicingReport.currencies[key];
        colNames.push('OOP Act (' + currency.code + ')');
        colModel.push({name:'outOfPocketAct_' + currency.id, index:'outOfPocketAct_' + currency.id, width: 80});
    }
    colNames.push('OOP Act Cv' + this.invoicingReport.mainCurrency.code);
    colModel.push({name:'outOfPocketActCv', index:'outOfPocketActCv', width: 80});

    colNames.push('OOP Acts Signed');
    colModel.push({name:'outOfPocketActIsSigned', index:'outOfPocketActIsSigned', width: 80});

    jQuery('#' + this.htmlId + '_report_body').jqGrid({
        data: normalizedData,
        datatype: "local",
        height: '400',
        width: '600',
        colNames: colNames,
        colModel: colModel,
        rowNum:5000,
        multiselect: false,
        shrinkToFit: false
        //caption: "Invoicing"
    });
    this.normalizeContentSize();
}

InvoicingReport.prototype.getFinancialYearView = function(financialYear) {
    if(financialYear == null) {
        return null;
    }
    return financialYear + '-' + (financialYear + 1)
}
InvoicingReport.prototype.normalizeContentSize = function() {
    var layoutWidth = contentWidth - 10;
    var layoutHeight = contentHeight - 100;
    
    jQuery('#' + this.htmlId + '_report_body').jqGrid('setGridWidth', layoutWidth -50);
    jQuery('#' + this.htmlId + '_report_body').jqGrid('setGridHeight', layoutHeight - 75);
}