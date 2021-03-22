/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
function ManagerReport(htmlId, containerHtmlId) {
    this.config = {
        endpointUrl: endpointsFolder + "ManagerReport.jsp"
    }
    this.htmlId = htmlId;
    this.containerHtmlId = containerHtmlId;
    this.loaded = {
        "offices" : [],
        "departments" : [],
        "mainCurrency": null,
        "currencies": [],
        "financialYears": []
    }
    this.selected = {
        "officeId" : null,
        "departmentId" : null,
        "financialYear" : null,
        "reportCurrencyId" : null
    }
    this.data = {
        "officeId" : null,
        "departmentId" : null,
        "financialYear" : null,
        "reportCurrencyId" : null,
        "grossMargin" : 50,
        "currencyRates" : {}
    }
    this.budgetTypes = {
        "FLAT_FEE": "Flat fee",
        "TIMESPENT": "Timespent",
        "QUOTATION": "Quotation"
    }
    this.managerReport = null;
    this.calculatedGrossMarginSums = {};
}
ManagerReport.prototype.init = function() {
    this.loadInitialContent();
}
ManagerReport.prototype.loadInitialContent = function() {
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
            form.loaded.offices = result.offices;
            form.loaded.departments = [];
            form.loaded.mainCurrency = result.mainCurrency;
            form.loaded.currencies = result.currencies;
            form.loaded.financialYears = result.financialYears;
            form.selected.officeId = null;
            form.selected.departmentId = null;
            form.show();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
ManagerReport.prototype.loadOfficeContent = function() {
    var form = this;
    var data = {};
    data.command = "getOfficeContent";
    data.officeId = this.selected.officeId;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.departments = result.departments;
            form.selected.departmentId = null;
            form.updateView();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
ManagerReport.prototype.show = function() {
    $('#' + this.containerHtmlId).html(this.getHtml());
    this.makeSlider();
    this.updateView();
    this.setHandlers();
}
ManagerReport.prototype.makeSlider = function() {
    var form = this;
    $('#' + this.htmlId + '_grossMarginSlider').slider({
            min: 0,
            max: 100,
            //range: "min",
            //value: 50,
            slide: function( event, ui ) {
                form.data.grossMargin = ui.value;
                form.updateGrossMarginView();
                form.paintGrossMargin();
            }
        });
}
ManagerReport.prototype.getHtml = function() {
    var html = '';
    html += '<fieldset>';
    html += '<table>';
    html += '<tr><td><span class="label1">Office</span></td><td><span class="label1">Department</span></td></tr>';
    html += '<tr><td><select id="' + this.htmlId + '_office' + '"></select></td><td><select id="' + this.htmlId + '_department' + '"></select></td></tr>';
    html += '</table>';
    html += '<table><tr><td><span class="label1">Report currency</span></select></td><td><select id="' + this.htmlId + '_reportCurrency' + '"></select></td><td></td></tr></table>';
    html += '<table>';
    for(var key in this.loaded.currencies) {
        var currency = this.loaded.currencies[key];
        html += '<tr><td><input type="text" id="' + this.htmlId + '_currencyRate_' + currency.id + '" style="width: 50px;"></td><td><span class="label1" id="' + this.htmlId + '_currencyRateLabel_' + currency.id + '"></span></td></tr>';
    }
    html += '</table>';
    html += '<table>';
    html += '<tr><td><span class="label1">Financial period</span></select></td><td><select id="' + this.htmlId + '_financialYear' + '"></select></td><td></td></tr>';
    html += '<tr><td><span class="label1">Gross margin</span></select></td><td style="width: 200px;"><div id="' + this.htmlId + '_grossMarginSlider"></div></td><td><span id="' + this.htmlId + '_grossMargin" class="label1"></span></td></tr>';
    html += '</table>';
    html += '<table>';
    html += '<tr><td colspan="2"><input type="button" id="' + this.htmlId + '_generateBtn' + '" value="Generate"><input type="button" id="' + this.htmlId + '_generateXLSBtn' + '" value="Generate XLS"></td></tr>';
    html += '</table>';
    html += '</fieldset>';
    html += '<div id="' + this.htmlId + '_report"></div>';
    html += '<form id="' + this.htmlId + '_xlsForm' + '" target="_blank" action="' + this.config.endpointUrl + '" method="post">';
    html += '<input type="hidden" id="' + this.htmlId + '_xlsForm_command' + '" name="command" value="">';
    html += '<input type="hidden" id="' + this.htmlId + '_xlsForm_data' + '" name="managerReportForm" value="">';
    html += '</form>';
    return html;
}
ManagerReport.prototype.updateView = function() {
    this.updateOfficeView();
    this.updateDepartmentView();
    this.updateGrossMarginView();
    this.updateFinancialYearView();
    this.updateReportCurrencyView();
    this.updateCurrencyRatesView();    
}
ManagerReport.prototype.setHandlers = function() {
    var form = this;
    $('#' + this.htmlId + '_office').bind("change", function(event) {form.officeChangedHandle.call(form, event)});
    $('#' + this.htmlId + '_department').bind("change", function(event) {form.departmentChangedHandle.call(form, event)});
    $('#' + this.htmlId + '_grossMargin').bind("change", function(event) {form.grossMarginChangedHandle.call(form, event)});
    $('#' + this.htmlId + '_financialYear').bind("change", function(event) {form.financialYearChangedHandle.call(form, event)});
    $('#' + this.htmlId + '_reportCurrency').bind("change", function(event) {form.reportCurrencyChangedHandle.call(form, event)});
    $('input[id^="' + this.htmlId + '_currencyRate_"]').bind("change", function(event) {form.currencyRateChangedHandle.call(form, event)});
    $('#' + this.htmlId + '_generateBtn').bind("click", function(event) {form.startGenerating.call(form, event)});
    $('#' + this.htmlId + '_generateXLSBtn').bind("click", function(event) {form.startGeneratingXLS.call(form, event)});
}
ManagerReport.prototype.officeChangedHandle = function(event) {
    var idTxt = $('#' + this.htmlId + '_office').val();
    if(idTxt == 'ALL') {
        this.selected.officeId = null;
    } else {
        this.selected.officeId = parseInt(idTxt);
    }
    this.data.officeId = this.selected.officeId;
    if(this.selected.officeId == null) {
        this.loadInitialContent();
    } else {
        this.loadOfficeContent();
    }
}
ManagerReport.prototype.departmentChangedHandle = function(event) {
    var idTxt = $('#' + this.htmlId + '_department').val();
    if(idTxt == 'ALL') {
        this.selected.departmentId = null;
    } else {
        this.selected.departmentId = parseInt(idTxt);
    }
    this.data.departmentId = this.selected.departmentId;
}
ManagerReport.prototype.financialYearChangedHandle = function(event) {
    var idTxt = $('#' + this.htmlId + '_financialYear').val();
    if(idTxt == 'ALL') {
        this.selected.financialYear = null;
    } else {
        this.selected.financialYear = parseInt(idTxt);
    }
    this.data.financialYear = this.selected.financialYear;
}
ManagerReport.prototype.reportCurrencyChangedHandle = function(event) {
    var idTxt = $('#' + this.htmlId + '_reportCurrency').val();
    if(idTxt == '') {
        this.selected.reportCurrencyId = null;
    } else {
        this.selected.reportCurrencyId = parseInt(idTxt);
    }
    this.data.reportCurrencyId = this.selected.reportCurrencyId;
    this.data.currencyRates = {};
    if(this.data.reportCurrencyId != null) {
        this.data.currencyRates[this.data.reportCurrencyId] = 1;
    }
    this.updateCurrencyRatesView();
}
ManagerReport.prototype.currencyRateChangedHandle = function(event) {
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
ManagerReport.prototype.updateOfficeView = function() {
   var html = "";
   html += '<option value="ALL">ALL</option>';
    for(var key in this.loaded.offices) {
        var office = this.loaded.offices[key];
        var isSelected = "";
        if(office.id == this.selected.officeId) {
           isSelected = "selected";
        }
        html += '<option value="'+ office.id +'" ' + isSelected + '>' + office.name + '</option>';
    }
    $('#' + this.htmlId + '_office').html(html);
}
ManagerReport.prototype.updateDepartmentView = function() {
   var html = "";
   html += '<option value="ALL">ALL</option>';
    for(var key in this.loaded.departments) {
        var department = this.loaded.departments[key];
        var isSelected = "";
        if(department.id == this.selected.departmentId) {
           isSelected = "selected";
        }
        html += '<option value="'+ department.id +'" ' + isSelected + '>' + department.name + '</option>';
    }
    $('#' + this.htmlId + '_department').html(html);
}
ManagerReport.prototype.updateGrossMarginView = function() {
    $('#' + this.htmlId + '_grossMarginSlider').slider( "value", this.data.grossMargin);
    $('#' + this.htmlId + '_grossMargin').html(this.data.grossMargin + '%');
}
ManagerReport.prototype.updateReportCurrencyView = function() {
   var html = "";
   html += '<option value="">...</option>';
    for(var key in this.loaded.currencies) {
        var currency = this.loaded.currencies[key];
        var isSelected = "";
        if(currency.id == this.selected.reportCurrencyId) {
           isSelected = "selected";
        }
        html += '<option value="'+ currency.id +'" ' + isSelected + '>' + currency.code + '</option>';
    }
    $('#' + this.htmlId + '_reportCurrency').html(html);
}
ManagerReport.prototype.updateFinancialYearView = function() {
    var html = "";
    html += '<option value="ALL">ALL</option>';
    for(var key in this.loaded.financialYears) {
        var financialYear = this.loaded.financialYears[key];
        var isSelected = "";
        if(financialYear == this.selected.financialYear) {
           isSelected = "selected";
        }
        html += '<option value="'+ financialYear +'" ' + isSelected + '>' + this.getFinancialYearView(financialYear) + '</option>';
    }
    $('#' + this.htmlId + '_financialYear').html(html);
}
ManagerReport.prototype.updateCurrencyRatesView = function() {
    var reportCurrency = null;
    if(this.data.reportCurrencyId != null) {
        for(var key in this.loaded.currencies) {
            var currency = this.loaded.currencies[key];
            if(currency.id == this.data.reportCurrencyId) {
                reportCurrency = currency;
                break;
            }
        }
    }
    for(var key in this.loaded.currencies) {
        var currency = this.loaded.currencies[key];
        if(reportCurrency == null) {
            $('#' + this.htmlId + '_currencyRate_' + currency.id).val(this.data.currencyRates[currency.id]);
            $('#' + this.htmlId + '_currencyRate_' + currency.id).attr('disabled', true);
            $('#' + this.htmlId + '_currencyRateLabel_' + currency.id).html(' - for 1 ' + currency.code);            
        } else {
            $('#' + this.htmlId + '_currencyRate_' + currency.id).val(this.data.currencyRates[currency.id]);
            if(reportCurrency.id == currency.id) {
                $('#' + this.htmlId + '_currencyRate_' + currency.id).attr('disabled', true);
            } else {
                $('#' + this.htmlId + '_currencyRate_' + currency.id).attr('disabled', false);
            }
            $('#' + this.htmlId + '_currencyRateLabel_' + currency.id).html('' + reportCurrency.code + '(s) for 1 ' + currency.code);
        }
    }
}
ManagerReport.prototype.validate = function(mode) {
    var errors = [];
    var warnings = [];
    var numberRE = /^[0-9]*[\.]?[0-9]*$/;
    var integerRE = /^[0-9]+$/;
    if(this.data.grossMargin == null || this.data.grossMargin == "") {
        warnings.push("Gross Margin is not set");
    } else {
        if(! integerRE.test(this.data.grossMargin)) {
            errors.push('Gross margin is not an integer number');
        } else if(parseInt(this.data.grossMargin) < 0 || parseInt(this.data.grossMargin) > 100 ) {
            errors.push('Gross margin must be between 0 and 100');
        }
    }
    if(this.data.reportCurrencyId == null) {
        errors.push("Report Currency is not set");
    }
    if(this.data.reportCurrencyId != null) {
        for(var key in this.loaded.currencies) {
            var currency = this.loaded.currencies[key];
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
    }
    return {
     "errors": errors,
     "warnings": warnings
    };
}
ManagerReport.prototype.startGenerating = function() {
    var mode = "HTML";
    var result = this.validate(mode);
    if(result.errors.length > 0) {
        showErrors(result.errors);
    } else if(result.warnings.length > 0) {
        showWarnings(result.warnings, this, this.generate);
    } else {
        this.generate();
    }
}
ManagerReport.prototype.startGeneratingXLS = function() {
    var mode = "XLS";
    var result = this.validate(mode);
    if(result.errors.length > 0) {
        showErrors(result.errors);
    } else if(result.warnings.length > 0) {
        showWarnings(result.warnings, this, this.generateXLS);
    } else {
        this.generateXLS();
    }
}
ManagerReport.prototype.generateXLS = function() {
    var serverFormatData = {
        "officeId" : this.data.officeId,
        "departmentId" : this.data.departmentId,
        "financialYear" : this.data.financialYear,
        "reportCurrencyId" : this.data.reportCurrencyId,
        "grossMargin": this.data.grossMargin,
        "currencyRates": this.data.currencyRates
    };
    $('#' + this.htmlId + '_xlsForm_command').val('generateXLSReport');
    $('#' + this.htmlId + '_xlsForm_data').val(getJSON(serverFormatData));
    $('#' + this.htmlId + '_xlsForm').submit();
}
ManagerReport.prototype.generate = function() {
    $('#' + this.htmlId + '_report').html("In progress...");
    var serverFormatData = {
        "officeId" : this.data.officeId,
        "departmentId" : this.data.departmentId,
        "financialYear" : this.data.financialYear,
        "reportCurrencyId" : this.data.reportCurrencyId,
        "grossMargin": this.data.grossMargin,
        "currencyRates": this.data.currencyRates
    };
    var form = this;
    var data = {};
    data.command = "generateReport";
    data.managerReportForm = getJSON(serverFormatData);
    $.ajax({
        url: this.config.endpointUrl,
        data: data,
        cache: false,
        type: "POST",
        success: function(data){
            ajaxResultHandle(data, form, function(result) {
                form.managerReport = result.report;
                form.updateReportView();
            })
        },
        error: function(jqXHR, textStatus, errorThrown) {
            ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
        }
    });
}
ManagerReport.prototype.updateReportView = function() {
    var html = '<table><tr><td id="' + this.htmlId + '_heading"></td></tr><tr><td id="' + this.htmlId + '_body" style="padding-left: 15px;"></td></tr><tr><td id="' + this.htmlId + '_comment" style="padding-left: 15px;"></td></tr></table>';
    $('#' + this.htmlId + '_report').html(html);
    this.updateReportHeaderView();
    this.updateReportBodyView();
    this.updateReportCommentView();
}
ManagerReport.prototype.updateReportHeaderView = function() {
    var headingHtml = '';
    headingHtml += '<table class="datagrid">';
    headingHtml += '<tr><td>Office</td><td>' + this.managerReport.formOfficeName + '</td></tr>';
    headingHtml += '<tr><td>Department</td><td>' + this.managerReport.formDepartmentName + '</td></tr>';
    headingHtml += '<tr><td>Report currency</td><td>' + this.managerReport.formReportCurrencyCode + '</td></tr>';
    for(var key in this.managerReport.currencies) {
        var currency = this.managerReport.currencies[key];
        headingHtml += '<tr><td>' + currency.code + ' / ' + this.managerReport.formReportCurrencyCode + '</td><td>' + this.managerReport.formCurrencyRates[currency.id] + '</td></tr>';
    }
    headingHtml += '<tr><td>Financial Period</td><td>' + this.getFinancialYearView(this.managerReport.formFinancialYear) + '</td></tr>';
    headingHtml += '<tr><td>Gross margin</td><td>' + this.managerReport.formGrossMargin + '</td></tr>';
    headingHtml += '<tr><td>Report Generated at</td><td>' + getStringFromYearMonthDateTime(this.managerReport.createdAt) + '</td></tr>';
    headingHtml += '</table>';
    $('#' + this.htmlId + '_heading').html(headingHtml);    
}
ManagerReport.prototype.updateReportBodyView = function() {
    var bodyHtml = '';
    bodyHtml += '<table id="' + this.htmlId + '_table" class="datagrid">';
    bodyHtml += '<tr class="dgHeader" id="' + this.htmlId + '_tableHeader">';
    bodyHtml += '<td>Code</td>';
    bodyHtml += '<td>Fees</td>';
    bodyHtml += '<td>Cost</td>';
    bodyHtml += '<td>Expected gross margin</td>';
    bodyHtml += '<td>Type</td>';
    bodyHtml += '<td>Budget</td>';
    bodyHtml += '<td>% Budget</td>';
    bodyHtml += '<td>Invoices</td>';
    bodyHtml += '<td>Payments</td>';
    bodyHtml += '<td>OOP Invoices</td>';
    bodyHtml += '<td>OOP Payments</td>';
    bodyHtml += '<td>Closed</td>';
    bodyHtml += '</tr>';
    for(var key in this.managerReport.offices) {
        var office = this.managerReport.offices[key];
        var officeRows = this.getOfficeRows(office.id, this.managerReport.rows);
        bodyHtml += this.showOffice(office.id, officeRows);
    }
    bodyHtml += this.showTotal();
    bodyHtml += '</table>';
    $('#' + this.htmlId + '_body').html(bodyHtml);
    $('#' + this.htmlId + '_table').treeTable({
        expandable: true
    });
    this.paintGrossMargin();
    var form = this;
    $('#' + this.htmlId + '_table tr').bind('mouseover', function(event) {
        $(this).addClass('selected')
    });
    $('#' + this.htmlId + '_table tr.dgHeader').unbind('mouseover');
    $('#' + this.htmlId + '_table tr').bind('mouseout', function(event) {
        $(this).removeClass('selected')
    });
    $('#' + this.htmlId + '_table tr.dgHeader').unbind('mouseout');
    $('span[id^="' + this.htmlId + '_pc_"]').bind("click", function(event) {form.projectCodeClickHandle.call(form, event)})
}
ManagerReport.prototype.updateReportCommentView = function() {
    var html = '';
    if(this.managerReport.noFinancialYearProjectCodesCount != null && this.managerReport.noFinancialYearProjectCodesCount != 0) {
        html += '<div>' + this.managerReport.noFinancialYearProjectCodesCount + ' codes miss financial year. <span class="link" id="' + this.htmlId + '_noFinancialYearDetailsLink">Details</span></div>';
    }
    if(this.managerReport.noBudgetProjectCodesCount != null && this.managerReport.noBudgetProjectCodesCount != 0) {
        html += '<div>' + this.managerReport.noBudgetProjectCodesCount + ' codes miss budget. <span class="link" id="' + this.htmlId + '_noBudgetDetailsLink">Details</span></div>';
    }
    if(this.managerReport.noInChargePersonProjectCodesCount != null && this.managerReport.noInChargePersonProjectCodesCount != 0) {
        html += '<div>' + this.managerReport.noInChargePersonProjectCodesCount + ' codes miss person in charge. <span class="link" id="' + this.htmlId + '_noInChargePersonDetailsLink">Details</span></div>';
    }

    $('#' + this.htmlId + '_comment').html(html);
    var form = this;
    $('#' + this.htmlId + '_noFinancialYearDetailsLink').bind('click', function(event) {form.noFinancialYearDetailsClickedHandle.call(form, event)} );
    $('#' + this.htmlId + '_noBudgetDetailsLink').bind('click', function(event) {form.noBudgetDetailsClickedHandle.call(form, event)} );
    $('#' + this.htmlId + '_noInChargePersonDetailsLink').bind('click', function(event) {form.noInChargePersonDetailsClickedHandle.call(form, event)} );
}
ManagerReport.prototype.noFinancialYearDetailsClickedHandle = function(event) {
    var form = this;
    var serverFormatData = {
        "officeId" : this.managerReport.formOfficeId,
        "departmentId" : this.managerReport.formDepartmentId,
        "financialYear" : this.managerReport.formFinancialYear,
        "grossMargin": this.data.grossMargin,
        "currencyRates": this.data.currencyRates
    };
    var form = this;
    var data = {};
    data.command = "getNoFinancialYearDetails";
    data.managerReportForm = getJSON(serverFormatData);
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.showNoFinancialYearDetails(result);
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
ManagerReport.prototype.noBudgetDetailsClickedHandle = function(event) {
    var form = this;
    var serverFormatData = {
        "officeId" : this.managerReport.formOfficeId,
        "departmentId" : this.managerReport.formDepartmentId,
        "financialYear" : this.managerReport.formFinancialYear,
        "grossMargin": this.data.grossMargin,
        "currencyRates": this.data.currencyRates
    };
    var form = this;
    var data = {};
    data.command = "getNoBudgetDetails";
    data.managerReportForm = getJSON(serverFormatData);
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.showNoBudgetDetails(result);
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    }); 
}
ManagerReport.prototype.noInChargePersonDetailsClickedHandle = function(event) {
    var form = this;
    var serverFormatData = {
        "officeId" : this.managerReport.formOfficeId,
        "departmentId" : this.managerReport.formDepartmentId,
        "financialYear" : this.managerReport.formFinancialYear,
        "grossMargin": this.data.grossMargin,
        "currencyRates": this.data.currencyRates
    };
    var form = this;
    var data = {};
    data.command = "getNoInChargePersonDetails";
    data.managerReportForm = getJSON(serverFormatData);
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.showNoInChargePersonDetails(result);
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
ManagerReport.prototype.showNoFinancialYearDetails = function(result) {
  var html = '<table class="datagrid">';
  html += '<tr class="dgHeader"><td>Project Codes</td></tr>';
  for(var key in result.noFinancialYearProjectCodes) {
      var code = result.noFinancialYearProjectCodes[key];
      html += '<tr><td>' + code + '</td></tr>';
  }
  html += '</table>';
  
  var title = "Project codes without financial year";
  showPopup(title, html, 500, 400, null, null);
}
ManagerReport.prototype.showNoBudgetDetails = function(result) {
  var html = '<table class="datagrid">';
  html += '<tr class="dgHeader"><td>Project Codes</td></tr>';
  for(var key in result.noBudgetProjectCodes) {
      var code = result.noBudgetProjectCodes[key];
      html += '<tr><td>' + code + '</td></tr>';
  }
  html += '</table>';
  
  var title = "Project codes without budget";
  showPopup(title, html, 500, 400, null, null);
}
ManagerReport.prototype.showNoInChargePersonDetails = function(result) {
  var html = '<table class="datagrid">';
  html += '<tr class="dgHeader"><td>Project Codes</td></tr>';
  for(var key in result.noInChargePersonProjectCodes) {
      var code = result.noInChargePersonProjectCodes[key];
      html += '<tr><td>' + code + '</td></tr>';
  }
  html += '</table>';
  
  var title = "Project codes without person in charge";
  showPopup(title, html, 500, 400, null, null);
}
ManagerReport.prototype.showOffice = function(officeId, officeRows) {
    var html = '';
    var row = this.getSumRow(officeRows);
    var grossMargin = null;
    if(row.feesAmount != null && row.costAmount != null) {
        grossMargin = (row.feesAmount - row.costAmount) / row.feesAmount;
    }
    this.calculatedGrossMarginSums['' + officeId] = grossMargin;
    var office = this.getOffice(officeId);
    html += '<tr id="' + this.htmlId + '_row_' + officeId + '" class="child-of-' + this.htmlId + '_tableHeader">';
    html += '<td>' + office.name + '</td>';
    html += '<td>' + (row.feesAmount != null ? thousandSeparatorVisualizer.getHtml(row.feesAmount) : '') + '</td>';
    html += '<td>' + (row.costAmount != null ? thousandSeparatorVisualizer.getHtml(row.costAmount) : '') + '</td>';
    html += '<td id="' + this.htmlId + '_gm_' + officeId + '">' + (grossMargin != null ? getPercentHtml(grossMargin) : '') + '</td>';
    html += '<td></td>';
    html += '<td>' + (row.budgetAmount != null ? thousandSeparatorVisualizer.getHtml(row.budgetAmount) : '') + '</td>';
    html += '<td>' + (row.budgetAmount != null ? percentVisualizer.getHtml(row.feesAmount / row.budgetAmount) : '') + '</td>';
    html += '<td>' + (row.feesInvoiceAmount != null ? thousandSeparatorVisualizer.getHtml(row.feesInvoiceAmount) : '') + '</td>';
    html += '<td>' + (row.feesPaymentAmount != null ? thousandSeparatorVisualizer.getHtml(row.feesPaymentAmount) : '') + '</td>';
    html += '<td>' + (row.outOfPocketInvoiceAmount != null ? thousandSeparatorVisualizer.getHtml(row.outOfPocketInvoiceAmount) : '') + '</td>';
    html += '<td>' + (row.outOfPocketPaymentAmount != null ? thousandSeparatorVisualizer.getHtml(row.outOfPocketPaymentAmount) : '') + '</td>';
    html += '<td></td>';
    html += '</tr>';
    var departmentIds = this.getDepartmentIds(officeRows);
    for(var key in departmentIds) {
        var departmentId = departmentIds[key];
        var departmentRows = this.getDepartmentRows(departmentId, officeRows);
        html += this.showDepartment(officeId, departmentId, departmentRows);
    }
    return html;
}
ManagerReport.prototype.showDepartment = function(officeId, departmentId, departmentRows) {
    var html = '';
    var row = this.getSumRow(departmentRows);
    var grossMargin = null;
    if(row.feesAmount != null && row.costAmount != null) {
        grossMargin = (row.feesAmount - row.costAmount) / row.feesAmount;
    }
    this.calculatedGrossMarginSums['' + officeId + '_' + departmentId] = grossMargin;
    var department = this.getDepartment(departmentId);
    html += '<tr id="' + this.htmlId + '_row_' + officeId + '_' + departmentId + '" class="child-of-' + this.htmlId + '_row_' + officeId + '">';
    html += '<td>' + department.name + '</td>';
    html += '<td>' + (row.feesAmount != null ? thousandSeparatorVisualizer.getHtml(row.feesAmount) : '') + '</td>';
    html += '<td>' + (row.costAmount != null ? thousandSeparatorVisualizer.getHtml(row.costAmount) : '') + '</td>';
    html += '<td id="' + this.htmlId + '_gm_' + officeId + '_' + departmentId + '">' + (grossMargin != null ? getPercentHtml(grossMargin) : '') + '</td>';
    html += '<td></td>';
    html += '<td>' + (row.budgetAmount != null ? thousandSeparatorVisualizer.getHtml(row.budgetAmount) : '') + '</td>';
    html += '<td>' + (row.budgetAmount != null ? percentVisualizer.getHtml(row.feesAmount / row.budgetAmount) : '') + '</td>';
    html += '<td>' + (row.feesInvoiceAmount != null ? thousandSeparatorVisualizer.getHtml(row.feesInvoiceAmount) : '') + '</td>';
    html += '<td>' + (row.feesPaymentAmount != null ? thousandSeparatorVisualizer.getHtml(row.feesPaymentAmount) : '') + '</td>';
    html += '<td>' + (row.outOfPocketInvoiceAmount != null ? thousandSeparatorVisualizer.getHtml(row.outOfPocketInvoiceAmount) : '') + '</td>';
    html += '<td>' + (row.outOfPocketPaymentAmount != null ? thousandSeparatorVisualizer.getHtml(row.outOfPocketPaymentAmount) : '') + '</td>';
    html += '<td></td>';
    html += '</tr>';
    var inChargePersonIds = this.getInChargePersonIds(departmentRows);
    for(var key in inChargePersonIds) {
        var inChargePersonId = inChargePersonIds[key];
        var inChargePersonRows = this.getInChargePersonRows(inChargePersonId, departmentRows);
        html += this.showInChargePerson(officeId, departmentId, inChargePersonId, inChargePersonRows);
    }
    return html;        
}
ManagerReport.prototype.showInChargePerson = function(officeId, departmentId, inChargePersonId, inChargePersonRows) {
    var html = '';
    var row = this.getSumRow(inChargePersonRows);
    var grossMargin = null;
    if(row.feesAmount != null && row.costAmount != null) {
        grossMargin = (row.feesAmount - row.costAmount) / row.feesAmount;
    }
    this.calculatedGrossMarginSums['' + officeId + '_' + departmentId + '_' + inChargePersonId] = grossMargin;
    var inChargePerson = this.getInChargePerson(inChargePersonId);
    html += '<tr id="' + this.htmlId + '_row_' + officeId + '_' + departmentId + '_' + inChargePersonId + '" class="child-of-' + this.htmlId + '_row_' + officeId + '_' + departmentId + '">';
    html += '<td>' + (inChargePerson != null ? (inChargePerson.firstName + ' ' + inChargePerson.lastName) : 'No person in charge') + '</td>';
    html += '<td>' + (row.feesAmount != null ? thousandSeparatorVisualizer.getHtml(row.feesAmount) : '') + '</td>';
    html += '<td>' + (row.costAmount != null ? thousandSeparatorVisualizer.getHtml(row.costAmount) : '') + '</td>';
    html += '<td id="' + this.htmlId + '_gm_' + officeId + '_' + departmentId + '_' + inChargePersonId + '">' + (grossMargin != null ? getPercentHtml(grossMargin) : '') + '</td>';
    html += '<td></td>';
    html += '<td>' + (row.budgetAmount != null ? thousandSeparatorVisualizer.getHtml(row.budgetAmount) : '') + '</td>';
    html += '<td>' + (row.budgetAmount != null ? percentVisualizer.getHtml(row.feesAmount / row.budgetAmount) : '') + '</td>';
    html += '<td>' + (row.feesInvoiceAmount != null ? thousandSeparatorVisualizer.getHtml(row.feesInvoiceAmount) : '') + '</td>';
    html += '<td>' + (row.feesPaymentAmount != null ? thousandSeparatorVisualizer.getHtml(row.feesPaymentAmount) : '') + '</td>';
    html += '<td>' + (row.outOfPocketInvoiceAmount != null ? thousandSeparatorVisualizer.getHtml(row.outOfPocketInvoiceAmount) : '') + '</td>';
    html += '<td>' + (row.outOfPocketPaymentAmount != null ? thousandSeparatorVisualizer.getHtml(row.outOfPocketPaymentAmount) : '') + '</td>';
    html += '<td></td>';
    html += '</tr>';
    var clientIds = this.getClientIds(inChargePersonRows);
    for(var key in clientIds) {
        var clientId = clientIds[key];
        var clientRows = this.getClientRows(clientId, inChargePersonRows);
        html += this.showClient(officeId, departmentId, inChargePersonId, clientId, clientRows);
    }        
    return html;
}
ManagerReport.prototype.showClient = function(officeId, departmentId, inChargePersonId, clientId, clientRows) {
    var html = '';
    var row = this.getSumRow(clientRows);
    var grossMargin = null;
    if(row.feesAmount != null && row.costAmount != null) {
        grossMargin = (row.feesAmount - row.costAmount) / row.feesAmount;
    }
    this.calculatedGrossMarginSums['' + officeId + '_' + departmentId + '_' + inChargePersonId + '_' + clientId] = grossMargin;
    var client = this.getClient(clientId);
    html += '<tr id="' + this.htmlId + '_row_' + officeId + '_' + departmentId + '_' + inChargePersonId + '_' + clientId + '" class="child-of-' + this.htmlId + '_row_' + officeId + '_' + departmentId + '_' + inChargePersonId + '">';
    html += '<td>' + client.name + '</td>';
    html += '<td>' + (row.feesAmount != null ? thousandSeparatorVisualizer.getHtml(row.feesAmount) : '') + '</td>';
    html += '<td>' + (row.costAmount != null ? thousandSeparatorVisualizer.getHtml(row.costAmount) : '') + '</td>';
    html += '<td id="' + this.htmlId + '_gm_' + officeId + '_' + departmentId + '_' + inChargePersonId + '_' + clientId + '">' + (grossMargin != null ? getPercentHtml(grossMargin) : '') + '</td>';
    html += '<td></td>';
    html += '<td>' + (row.budgetAmount != null ? thousandSeparatorVisualizer.getHtml(row.budgetAmount) : '') + '</td>';
    html += '<td>' + (row.budgetAmount != null ? percentVisualizer.getHtml(row.feesAmount / row.budgetAmount) : '') + '</td>';
    html += '<td>' + (row.feesInvoiceAmount != null ? thousandSeparatorVisualizer.getHtml(row.feesInvoiceAmount) : '') + '</td>';
    html += '<td>' + (row.feesPaymentAmount != null ? thousandSeparatorVisualizer.getHtml(row.feesPaymentAmount) : '') + '</td>';
    html += '<td>' + (row.outOfPocketInvoiceAmount != null ? thousandSeparatorVisualizer.getHtml(row.outOfPocketInvoiceAmount) : '') + '</td>';
    html += '<td>' + (row.outOfPocketPaymentAmount != null ? thousandSeparatorVisualizer.getHtml(row.outOfPocketPaymentAmount) : '') + '</td>';
    html += '<td></td>';
    html += '</tr>';
    for(var key in clientRows) {
        var projectCodeRow = clientRows[key];
        html += this.showProjectCode(officeId, departmentId, inChargePersonId, clientId, projectCodeRow);
    }            
    return html;
}
ManagerReport.prototype.showProjectCode = function(officeId, departmentId, inChargePersonId, clientId, row) {
    var html = '';
    var grossMargin = null;
    if(row.feesAmount != null && row.costAmount != null) {
        grossMargin = (row.feesAmount - row.costAmount) / row.feesAmount;
    }
    this.calculatedGrossMarginSums['' + officeId + '_' + departmentId + '_' + inChargePersonId + '_' + clientId+ '_' + row.projectCodeId] = grossMargin;
    html += '<tr id="' + this.htmlId + '_row_' + officeId + '_' + departmentId + '_' + inChargePersonId + '_' + clientId + '_' + row.projectCodeId + '" class="child-of-' + this.htmlId + '_row_' + officeId + '_' + departmentId + '_' + inChargePersonId + '_' + clientId + '">';
    html += '<td><span  id="' + this.htmlId + '_pc_' + row.projectCodeId + '" class="link">' + row.projectCodeCode + '</span></td>';
    html += '<td>' + (row.feesAmount != null ? thousandSeparatorVisualizer.getHtml(row.feesAmount) : '') + '</td>';
    html += '<td>' + (row.costAmount != null ? thousandSeparatorVisualizer.getHtml(row.costAmount) : '') + '</td>';
    html += '<td id="' + this.htmlId + '_gm_' + officeId + '_' + departmentId + '_' + inChargePersonId + '_' + clientId+ '_' + row.projectCodeId + '">' + (grossMargin != null ? getPercentHtml(grossMargin) : '') + '</td>';
    html += '<td>' + ((row.type != null) ? this.budgetTypes[row.type] : '') + '</td>';
    html += '<td>' + (row.budgetAmount != null ? thousandSeparatorVisualizer.getHtml(row.budgetAmount) : '') + '</td>';
    html += '<td>' + (row.budgetAmount != null ? percentVisualizer.getHtml(row.feesAmount / row.budgetAmount) : '') + '</td>';
    html += '<td>' + (row.feesInvoiceAmount != null ? thousandSeparatorVisualizer.getHtml(row.feesInvoiceAmount) : '') + '</td>';
    html += '<td>' + (row.feesPaymentAmount != null ? thousandSeparatorVisualizer.getHtml(row.feesPaymentAmount) : '') + '</td>';
    html += '<td>' + (row.outOfPocketInvoiceAmount != null ? thousandSeparatorVisualizer.getHtml(row.outOfPocketInvoiceAmount) : '') + '</td>';
    html += '<td>' + (row.outOfPocketPaymentAmount != null ? thousandSeparatorVisualizer.getHtml(row.outOfPocketPaymentAmount) : '') + '</td>';
    html += '<td>' + booleanVisualizer.getHtml(row.projectCodeIsClosed) + '</td>';
    html += '</tr>';        
    return html;
}
ManagerReport.prototype.showTotal = function() {
    var html = '';
    var row = this.getSumRow(this.managerReport.rows);
    var grossMargin = null;
    if(row.feesAmount != null && row.costAmount != null) {
        grossMargin = (row.feesAmount - row.costAmount) / row.feesAmount;
    }
    this.calculatedGrossMarginSums['total'] = grossMargin;
    html += '<tr id="' + this.htmlId + '_row_total" class="dgHighlight">';
    html += '<td>Total</td>';
    html += '<td>' + (row.feesAmount != null ? thousandSeparatorVisualizer.getHtml(row.feesAmount) : '') + '</td>';
    html += '<td>' + (row.costAmount != null ? thousandSeparatorVisualizer.getHtml(row.costAmount) : '') + '</td>';
    html += '<td id="' + this.htmlId + '_gm_total">' + (grossMargin != null ? getPercentHtml(grossMargin) : '') + '</td>';
    html += '<td></td>';
    html += '<td>' + (row.budgetAmount != null ? thousandSeparatorVisualizer.getHtml(row.budgetAmount) : '') + '</td>';
    html += '<td>' + (row.budgetAmount != null ? percentVisualizer.getHtml(row.feesAmount / row.budgetAmount) : '') + '</td>';
    html += '<td>' + (row.feesInvoiceAmount != null ? thousandSeparatorVisualizer.getHtml(row.feesInvoiceAmount) : '') + '</td>';
    html += '<td>' + (row.feesPaymentAmount != null ? thousandSeparatorVisualizer.getHtml(row.feesPaymentAmount) : '') + '</td>';
    html += '<td>' + (row.outOfPocketInvoiceAmount != null ? thousandSeparatorVisualizer.getHtml(row.outOfPocketInvoiceAmount) : '') + '</td>';
    html += '<td>' + (row.outOfPocketPaymentAmount != null ? thousandSeparatorVisualizer.getHtml(row.outOfPocketPaymentAmount) : '') + '</td>';
    html += '<td></td>';
    html += '</tr>';
    return html;
}
ManagerReport.prototype.getOfficeRows = function(officeId, rows) {
    var officeRows = [];
    for(var key in rows) {
        var row = rows[key];
        if(row.officeId == officeId) {
            officeRows.push(row);
        }
    }
    return officeRows;
}
ManagerReport.prototype.getDepartmentRows = function(departmentId, rows) {
    var departmentRows = [];
    for(var key in rows) {
        var row = rows[key];
        if(row.departmentId == departmentId) {
            departmentRows.push(row);
        }
    }
    return departmentRows;    
}
ManagerReport.prototype.getInChargePersonRows = function(inChargePersonId, rows) {
    var inChargePersonRows = [];
    for(var key in rows) {
        var row = rows[key];
        if(row.inChargePersonId == inChargePersonId) {
            inChargePersonRows.push(row);
        }
    }
    return inChargePersonRows;    
}
ManagerReport.prototype.getClientRows = function(clientId, rows) {
    var clientRows = [];
    for(var key in rows) {
        var row = rows[key];
        if(row.clientId == clientId) {
            clientRows.push(row);
        }
    }
    return clientRows;    
}
ManagerReport.prototype.getOfficeIds = function(rows) {
    var officeIds = [];
    for(var key in rows) {
        var row = rows[key];
        if(jQuery.inArray(row.officeId, officeIds) == -1) {
            officeIds.push(row.officeId);
        }
    }
    return officeIds;
}
ManagerReport.prototype.getDepartmentIds = function(rows) {
    var departmentIds = [];
    for(var key in rows) {
        var row = rows[key];
        if(jQuery.inArray(row.departmentId, departmentIds) == -1) {
            departmentIds.push(row.departmentId);
        }
    }
    return departmentIds;    
}
ManagerReport.prototype.getInChargePersonIds = function(rows) {
    var inChargePersonIds = [];
    for(var key in rows) {
        var row = rows[key];
        if(jQuery.inArray(row.inChargePersonId, inChargePersonIds) == -1) {
            inChargePersonIds.push(row.inChargePersonId);
        }
    }
    return inChargePersonIds;     
}
ManagerReport.prototype.getClientIds = function(rows) {
    var clientIds = [];
    for(var key in rows) {
        var row = rows[key];
        if(jQuery.inArray(row.clientId, clientIds) == -1) {
            clientIds.push(row.clientId);
        }
    }
    return clientIds;     
}
ManagerReport.prototype.getOffice = function(officeId) {
    for(var key in this.managerReport.offices) {
        var office = this.managerReport.offices[key];
        if(office.id == officeId) {
            return office;
        }
    }
    return null;
}
ManagerReport.prototype.getDepartment = function(departmentId) {
    for(var key in this.managerReport.departments) {
        var department = this.managerReport.departments[key];
        if(department.id == departmentId) {
            return department;
        }
    }
    return null;    
}
ManagerReport.prototype.getInChargePerson = function(inChargePersonId) {
    for(var key in this.managerReport.inChargePersons) {
        var inChargePerson = this.managerReport.inChargePersons[key];
        if(inChargePerson.id == inChargePersonId) {
            return inChargePerson;
        }
    }
    return null;  
}
ManagerReport.prototype.getClient = function(clientId) {
    for(var key in this.managerReport.clients) {
        var client = this.managerReport.clients[key];
        if(client.id == clientId) {
            return client;
        }
    }
    return null; 
}
ManagerReport.prototype.getFinancialYearView = function(financialYear) {
    if(financialYear == null) {
        return null;
    }
    return financialYear + '-' + (financialYear + 1);
}
ManagerReport.prototype.getEmployeeFullName = function(employee) {
    if(employee == null) {
        return null;
    }
    return employee.firstName + ' ' + employee.lastName;
}
ManagerReport.prototype.getSumRow = function(rows) {
    var sumRow = {
        "feesAmount" : null,
        "costAmount" : null,
        "grossMargin" : null,
        //"type" : null,
        "budgetAmount" : null,
        "feesInvoiceAmount" : null,
        "feesPaymentAmount" : null,
        "outOfPocketInvoiceAmount" : null,
        "outOfPocketPaymentAmount" : null
        
    };
    for(var key in rows) {
        var row = rows[key];
        if(row.feesAmount != null) {
            if(sumRow.feesAmount == null) {
                sumRow.feesAmount = row.feesAmount;
            } else {
                sumRow.feesAmount += row.feesAmount;
            }
        }
        if(row.costAmount != null) {
            if(sumRow.costAmount == null) {
                sumRow.costAmount = row.costAmount;
            } else {
                sumRow.costAmount += row.costAmount;
            }
        }
        if(row.budgetAmount != null) {
            if(sumRow.budgetAmount == null) {
                sumRow.budgetAmount = row.budgetAmount;
            } else {
                sumRow.budgetAmount += row.budgetAmount;
            }
        }
        if(row.feesInvoiceAmount != null) {
            if(sumRow.feesInvoiceAmount == null) {
                sumRow.feesInvoiceAmount = row.feesInvoiceAmount;
            } else {
                sumRow.feesInvoiceAmount += row.feesInvoiceAmount;
            }
        }
        if(row.feesPaymentAmount != null) {
            if(sumRow.feesPaymentAmount == null) {
                sumRow.feesPaymentAmount = row.feesPaymentAmount;
            } else {
                sumRow.feesPaymentAmount += row.feesPaymentAmount;
            }
        }
        if(row.outOfPocketInvoiceAmount != null) {
            if(sumRow.outOfPocketInvoiceAmount == null) {
                sumRow.outOfPocketInvoiceAmount = row.outOfPocketInvoiceAmount;
            } else {
                sumRow.outOfPocketInvoiceAmount += row.outOfPocketInvoiceAmount;
            }
        }
        if(row.outOfPocketPaymentAmount != null) {
            if(sumRow.outOfPocketPaymentAmount == null) {
                sumRow.outOfPocketPaymentAmount = row.outOfPocketPaymentAmount;
            } else {
                sumRow.outOfPocketPaymentAmount += row.outOfPocketPaymentAmount;
            }
        }
    }
    return sumRow;
}
ManagerReport.prototype.paintGrossMargin = function() {
    if(this.managerReport == null || this.managerReport.rows == null || this.managerReport.rows.length == 0 ) {
        return;
    }
    for(var key in this.calculatedGrossMarginSums) {
        var grossMargin = this.calculatedGrossMarginSums[key];
        if(grossMargin == null) {
            continue;
        }
        if((grossMargin * 100) > this.data.grossMargin) {
            $('#' +  this.htmlId + '_gm_' + key).addClass('good');
            $('#' +  this.htmlId + '_gm_' + key).removeClass('bad');            
        } else {
            $('#' +  this.htmlId + '_gm_' + key).addClass('bad');
            $('#' +  this.htmlId + '_gm_' + key).removeClass('good');             
        }
    }
}
ManagerReport.prototype.projectCodeClickHandle = function(event) {
    var id = event.currentTarget.id;
    var tmp = id.split("_");
    var projectCodeId = tmp[tmp.length - 1];
    this.loadProjectCodeDetails(projectCodeId);
}
ManagerReport.prototype.loadProjectCodeDetails = function(projectCodeId) {
    var form = this;
    var data = {};
    data.command = "getProjectCode";
    data.id = projectCodeId;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.showProjectCodeDetails(result);            
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
ManagerReport.prototype.showProjectCodeDetails = function(result) {
    var projectCode = result.projectCode;
    var createdBy = result.createdBy;
    var closedBy = result.closedBy;
    var inChargePerson = result.inChargePerson;
    var html = '<table class="datagrid">';
    html += '<tr><td>Code</td><td>' + projectCode.code + '</td></tr>';
    html += '<tr><td>Type</td><td>' + projectCode.periodType + '</td></tr>';
    if(projectCode.periodType == 'QUARTER') {
        html += '<tr><td>Quarter</td><td>' + projectCode.periodQuarter + '</td></tr>';
    } else if(projectCode.periodType == 'MONTH') {
        html += '<tr><td>Month</td><td>' + projectCode.periodMonth + '</td></tr>';
    } else if(projectCode.periodType == 'DATE') {
        html += '<tr><td>Date</td><td>' + projectCode.periodDate + '</td></tr>';
    } else if(projectCode.periodType == 'COUNTER') {
        html += '<tr><td>Counter</td><td>' + projectCode.periodCounter + '</td></tr>';
    }
    html += '<tr><td>Year</td><td>' + projectCode.year + '</td></tr>';
    html += '<tr><td>Financial year</td><td>' + this.getFinancialYearView(projectCode.financialYear) + '</td></tr>';
    html += '<tr><td>Description</td><td>' + projectCode.description + '</td></tr>';
    html += '<tr><td>Comment</td><td>' + projectCode.comment + '</td></tr>';
    html += '<tr><td>Created at</td><td>' + yearMonthDateTimeVisualizer.getHtml(projectCode.createdAt) + '</td></tr>';
    html += '<tr><td>Created by</td><td>' + this.getEmployeeFullName(createdBy) + '</td></tr>';
    html += '<tr><td>Closed</td><td>' + booleanVisualizer.getHtml(projectCode.isClosed) + '</td></tr>';
    html += '<tr><td>Closed at</td><td>' + yearMonthDateTimeVisualizer.getHtml(projectCode.closedAt) + '</td></tr>';
    html += '<tr><td>Closed by</td><td>' + this.getEmployeeFullName(closedBy) + '</td></tr>';
    html += '<tr><td>Start</td><td>' + (projectCode.startDate != null ? getStringFromYearMonthDate(projectCode.startDate) : '') + '</td></tr>';
    html += '<tr><td>End</td><td>' + (projectCode.endDate != null ? getStringFromYearMonthDate(projectCode.endDate) : '') + '</td></tr>';
    html += '<tr><td>Future</td><td>' + booleanVisualizer.getHtml(projectCode.isFuture) + '</td></tr>';
    html += '<tr><td>Dead</td><td>' + booleanVisualizer.getHtml(projectCode.isDead) + '</td></tr>';
    html += '<tr><td>Person in charge</td><td>' + this.getEmployeeFullName(inChargePerson) + '</td></tr>';
    html += '</table>';
  var title = "Project code";
  showPopup(title, html, 500, 450, null, null);
}