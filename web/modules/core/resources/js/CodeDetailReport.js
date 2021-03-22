/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
function CodeDetailReport(filter, htmlId, containerHtmlId) {
    this.config = {
        endpointUrl: endpointsFolder+ "CodeDetailReport.jsp"
    }
    this.htmlId = htmlId;
    this.containerHtmlId = containerHtmlId;
    this.moduleName = 'Code Report';
    this.loaded = {
        "clients": [],
        "projectCodes": [],
        "mainCurrency": null,
        "currencies": []
    }
    this.isRateInfoVisibleOptions = {
        "false" : "Hide",
        "true" : "Show"
    }
    this.selected = {
        "projectCodeIds" : [],
        "isRateInfoVisible" : "false"
    }
    this.data = {
        "projectCodeIds" : [],
        "view": null,
        "reportCurrencyId" : null,
        "currencyRates" : {},
        "isRateInfoVisible" : "false"
    }
    this.reports = {};

    this.filterForm = null;
    this.filter = ProjectCodesListFilter.prototype.getDefaultFilter();
    this.clientFilter = ClientsListFilter.prototype.getDefaultFilter();
    this.invoiceRequestsFilter = InvoiceRequestsFilter.prototype.getDefaultFilter();
    
    var filterIsUsed = false;
    if(filter != null) {
        if(filter.code != null && filter.code != '') {
            this.filter.code = filter.code;
            filterIsUsed = true;
        }
    }
    if(! filterIsUsed) {
        var filterStr = getCookie("projectCodesListFilter");
        if(filterStr != null) {
            try{
                this.filter = ProjectCodesListFilter.prototype.normalizeFilter(jQuery.parseJSON(filterStr));
            } catch (e) {
                deleteCookie("projectCodesListFilter");
            }
        }
    }
    var clientFilterIsUsed = false;
    if(! clientFilterIsUsed) {
        var clientFilterStr = getCookie("clientsListFilter");
        if(clientFilterStr != null) {
            try{
                this.clientFilter = ClientsListFilter.prototype.normalizeFilter(jQuery.parseJSON(clientFilterStr));
            } catch (e) {
                deleteCookie("clientsListFilter");
            }
        }
    }
    
    this.sorter = {
        "field": 'CODE',
        "order": 'ASC'
    };
    this.limiter = {
        "page": 0,
        "itemsPerPage": 50
    };
    
}
CodeDetailReport.prototype.init = function() {
    this.loadInitialContent();
}
CodeDetailReport.prototype.loadInitialContent = function() {
    var form = this;
    var data = {};
    data.command = "getInitialContent";
    data.filter = getJSON(this.filter);
    data.sorter = getJSON(this.sorter);
    data.limiter = getJSON(this.limiter);
    data.clientFilter = getJSON(this.clientFilter);
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.clients = result.clients;
            form.loaded.count = result.count;
            form.loaded.projectCodes = result.projectCodes;
            form.selected.projectCodeIds = [];
            form.data.projectCodeIds = form.selected.projectCodeIds;
            if(form.loaded.projectCodes.length == 1) {
                form.selected.projectCodeIds.push(form.loaded.projectCodes[0].id);
                form.data.projectCodeIds = form.selected.projectCodeIds;
            }
            form.loaded.mainCurrency = result.mainCurrency;
            form.loaded.currencies = result.currencies;
            form.loaded.useRequisites = result.useRequisites;
            form.show();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
CodeDetailReport.prototype.getClientAndProjectCodeList = function() {
    var form = this;
    var data = {};
    data.command = "getClientAndProjectCodesList";
    data.filter = getJSON(this.filter);
    data.sorter = getJSON(this.sorter);
    data.limiter = getJSON(this.limiter);
    data.clientFilter = getJSON(this.clientFilter);
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      type: "POST",
      cache: false,
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.count = result.count;
            form.loaded.clients = result.clients;
            form.loaded.projectCodes = result.projectCodes;
            if(form.loaded.projectCodes.length == 1) {
                form.selected.projectCodeIds.push(form.loaded.projectCodes[0].id);
                form.data.projectCodeIds = form.selected.projectCodeIds;
            }
            form.updateClientView();
            form.updateProjectCodeView();
            form.updateLimiterView();
            form.updateProjectCodeCommentView();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
CodeDetailReport.prototype.getProjectCodeList = function() {
    var form = this;
    var data = {};
    data.command = "getProjectCodesList";
    data.filter = getJSON(this.filter);
    data.sorter = getJSON(this.sorter);
    data.limiter = getJSON(this.limiter);
    data.clientFilter = getJSON(this.clientFilter);
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      type: "POST",
      cache: false,
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.count = result.count;
            form.loaded.projectCodes = result.projectCodes;
            if(form.loaded.projectCodes.length == 1) {
                form.selected.projectCodeIds.push(form.loaded.projectCodes[0].id);
                form.data.projectCodeIds = form.selected.projectCodeIds;
            }
            form.updateProjectCodeView();
            form.updateLimiterView();
            form.updateProjectCodeCommentView();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
CodeDetailReport.prototype.show = function() {
    $('#' + this.containerHtmlId).html(this.getHtml());
    this.updateView();
    this.setHandlers();
    this.makeButtons();
}
CodeDetailReport.prototype.getHtml = function() {
    var html = '';
    html += '<table>';
    html += '<tr>';
    html += '<td id="' + this.htmlId + '_clientFilterCell"><span id="' + this.htmlId + '_clientFilterBtn" title="Client filter">Client filter</span></td>';
    html += '<td id="' + this.htmlId + '_filterCell"><span id="' + this.htmlId + '_filterBtn" title="Project code filter">Project code filter</span></td>';
    html += '</tr>';
    html += '<tr>';
    html += '<td><select id="' + this.htmlId + '_client" size="15" style="width: 400px;"></select></td>';
    html += '<td><div id="' + this.htmlId + '_projectCode" style="height: 220px; overflow: auto;"></div><br /><span id="' + this.htmlId + '_limiter"></span> <span id="' + this.htmlId + '_selectorCount"></span></td>';
    html += '</tr>'
    html += '</table>';
    
    html += '<table>';
    html += '<tr>';
    html += '<td>';
        html += '<table><tr><td><span class="label1">Show Rate info</span></select></td><td><select id="' + this.htmlId + '_isRateInfoVisible' + '"></select></td></tr></table>';
        html += '<div id="' + this.htmlId + '_rateInfo">';
        html += '<table><tr><td><span class="label1">Report currency</span></select></td><td><select id="' + this.htmlId + '_reportCurrency' + '"></select></td></tr></table>';
        html += '<table>';
        for(var key in this.loaded.currencies) {
            var currency = this.loaded.currencies[key];
            html += '<tr><td><input type="text" id="' + this.htmlId + '_currencyRate_' + currency.id + '" style="width: 50px;"></td><td><span class="label1" id="' + this.htmlId + '_currencyRateLabel_' + currency.id + '"></span></td></tr>';
        }
        html += '</table>';
        html += '</div>';
    html += '</td>';
    html += '<td><div id="' + this.htmlId + '_projectCodeComment" class="comment1"></div></td>';
    html += '</tr>';
    html += '</table>';
    
    html += '<table>';
    html += '<tr><td>';
    html += '<input type="button" id="' + this.htmlId + '_generateHTMLBtn' + '" value="Generate"> ';
    html += '<input type="button" id="' + this.htmlId + '_generateXLSBtn' + '" value="Generate XLS"> ';
    if(this.loaded.useRequisites) {
        html += '<input type="button" id="' + this.htmlId + '_generateXLSWithRequisitesBtn' + '" value="Generate XLS with requisites">';
    }
    html += '</td><tr>';
    html += '</table>';

    html += '<div id="' + this.htmlId + '_report"></div>';
    html += '<form id="' + this.htmlId + '_xlsForm' + '" target="_blank" action="' + this.config.endpointUrl + '" method="post">';
    html += '<input type="hidden" id="' + this.htmlId + '_xlsForm_command' + '" name="command" value="">';
    html += '<input type="hidden" id="' + this.htmlId + '_xlsForm_data' + '" name="codeDetailReportForm" value="">';
    html += '</form>';
    return html;
}
CodeDetailReport.prototype.makeButtons = function() {
    var form = this;
    $('#' + this.htmlId + '_filterBtn').button({
        icons: {
            primary: "ui-icon-search"
        }
    }).click(function(event) {
        form.showFilter.call(form);
    });
    $('#' + this.htmlId + '_clientFilterBtn').button({
        icons: {
            primary: "ui-icon-search"
        }
    }).click(function(event) {
        form.showClientFilter.call(form);
    });
}    
CodeDetailReport.prototype.setHandlers = function() {
    var form = this;
    $('#' + this.htmlId + '_client').bind("change", function(event) {form.clientChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_isRateInfoVisible').bind("change", function(event) {form.isRateInfoVisibleChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_reportCurrency').bind("change", function(event) {form.reportCurrencyChangedHandle.call(form, event)});
    $('input[id^="' + this.htmlId + '_currencyRate_"]').bind("change", function(event) {form.currencyRateChangedHandle.call(form, event)});

    $('#' + this.htmlId + '_generateHTMLBtn').bind("click", function(event) {form.startGeneratingHTML.call(form, event)});
    $('#' + this.htmlId + '_generateXLSBtn').bind("click", function(event) {form.startGeneratingXLS.call(form, event)});
    $('#' + this.htmlId + '_generateXLSWithRequisitesBtn').bind("click", function(event) {form.startGeneratingXLSWithRequisites.call(form, event)});
}
CodeDetailReport.prototype.showFilter = function(event) {
    this.filterForm = new ProjectCodesListFilter("projectCodesListFilter", this.moduleName, this.filter, this.acceptFilterData, this);
    this.filterForm.init();
}
CodeDetailReport.prototype.acceptFilterData = function(filter) {
    this.limiter.page = 0;
    this.filter = filter;
    this.selected.projectCodeIds = [];
    this.data.projectCodeIds = this.selected.projectCodeIds;
    this.getProjectCodeList();
    this.updateClientView();
    this.updateFilterSelectionView();
}
CodeDetailReport.prototype.showClientFilter = function(event) {
    this.clientFilterForm = new ClientsListFilter("clientsListFilter", this.moduleName, this.clientFilter, this.acceptClientFilterData, this);
    this.clientFilterForm.init();
}
CodeDetailReport.prototype.acceptClientFilterData = function(clientFilter) {
    this.limiter.page = 0;
    this.clientFilter = clientFilter;
    this.selected.clientId = [];
    this.selected.projectCodeIds = [];
    this.data.projectCodeIds = this.selected.projectCodeIds;    
    this.getClientAndProjectCodeList();
    this.updateFilterSelectionView();
}
CodeDetailReport.prototype.pageClickHandle = function(event) {
    var htmlId = $(event.currentTarget).attr("id");
    var tmp = htmlId.split("_");
    var page = parseInt(tmp[tmp.length - 1]);
    this.limiter.page = page;
    this.selected.projectCodeIds = [];
    this.data.projectCodeIds = this.selected.projectCodeIds;
    this.getProjectCodeList();
}
CodeDetailReport.prototype.clientChangedHandle = function(event) {
    var htmlId = $('#' + this.htmlId + '_client').val();
    var clientId = null;
    if(htmlId != '') {
        clientId = parseInt(htmlId);
    }
    this.filter.clientId = clientId;
    this.selected.projectCodeIds = [];
    this.data.projectCodeIds = this.selected.projectCodeIds;
    this.getProjectCodeList();
    this.updateFilterSelectionView();
}
CodeDetailReport.prototype.projectCodeClickedHandle = function(event) {
    var idTxt = $(event.currentTarget).attr("id");
    var parts = idTxt.split('_');
    var id = parseInt(parts[parts.length - 1]);
    this.selected.projectCodeIds = [];
    this.selected.projectCodeIds.push(id); 
    this.data.projectCodeIds = this.selected.projectCodeIds;
    this.updateProjectCodesSelection();
    this.updateProjectCodeCommentView();
}
CodeDetailReport.prototype.projectCodeSelectorClickedHandle = function(event) {
    var idTxt = $(event.currentTarget).attr("id");
    var parts = idTxt.split('_');
    var id = parseInt(parts[parts.length - 1]);
    var index = jQuery.inArray(id, this.selected.projectCodeIds);
    if(index == -1) {
        this.selected.projectCodeIds.push(id); 
    } else {
        this.selected.projectCodeIds.splice(index, 1);
    }
    this.data.projectCodeIds = this.selected.projectCodeIds;
    this.updateProjectCodesSelection();
    this.updateProjectCodeCommentView();   
}
CodeDetailReport.prototype.selectAllProjectCodes = function(event) {
    if(this.selected.projectCodeIds.length == 0) {
        this.selected.projectCodeIds = [];
        for(var key in this.loaded.projectCodes) {
            var projectCode = this.loaded.projectCodes[key];
            this.selected.projectCodeIds.push(projectCode.id);
        }
    } else {
        this.selected.projectCodeIds = [];
    }
    this.data.projectCodeIds = this.selected.projectCodeIds;
    this.updateProjectCodesSelection();
    this.updateProjectCodeCommentView();
}
CodeDetailReport.prototype.isRateInfoVisibleChangedHandle = function(event) {
    var idTxt = $('#' + this.htmlId + '_isRateInfoVisible').val();
    if(idTxt == '') {
        this.selected.isRateInfoVisible = null;
    } else {
        this.selected.isRateInfoVisible = idTxt;
    }
    this.data.isRateInfoVisible = this.selected.isRateInfoVisible;
    this.updateRateInfoView();
}
CodeDetailReport.prototype.reportCurrencyChangedHandle = function(event) {
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
CodeDetailReport.prototype.currencyRateChangedHandle = function(event) {
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
CodeDetailReport.prototype.updateView = function() {
    this.updateFilterSelectionView();
    this.updateClientView();
    this.updateProjectCodeView();
    this.updateLimiterView();
    this.updateProjectCodeCommentView();
    this.updateIsRateInfoVisibleView();
    this.updateRateInfoView();
    this.updateReportCurrencyView();
    this.updateCurrencyRatesView();
}
CodeDetailReport.prototype.updateFilterSelectionView = function() {
    if(ProjectCodesListFilter.prototype.isFilterUsed(this.filter)) {
        $('#' + this.htmlId + '_filterCell').css('border-left', '3px solid #009900');
    } else {
        $('#' + this.htmlId + '_filterCell').css('border-left', '0px');
    }
    if(ClientsListFilter.prototype.isFilterUsed(this.clientFilter)) {
        $('#' + this.htmlId + '_clientFilterCell').css('border-left', '3px solid #009900');
    } else {
        $('#' + this.htmlId + '_clientFilterCell').css('border-left', '0px');
    }
}
CodeDetailReport.prototype.updateClientView = function() {
    var html = '';
    html += '<option value="">...</option>';
    for(var key in this.loaded.clients) {
        var client = this.loaded.clients[key];
        var isSelected = "";
        if(this.filter.client != null && client.id == this.filter.client.id) {
           isSelected = "selected";
        }
        html += '<option value="' + client.id + '" ' + isSelected + '>' + client.name + '</option>';
    }
    $('#' + this.htmlId + '_client').html(html);
}
CodeDetailReport.prototype.updateProjectCodeView = function() {
    var html = '';
    if(this.loaded.projectCodes != null && this.loaded.projectCodes.length > 0) {
        html += '<table class="datagrid">';
        html += '<tr class="dgHeader">';
        html += '<td><button id="' + this.htmlId + '_selectAll">Check</button></td>';
        html += '<td>Code</td>';
        html += '<td>Description</td>';
        html += '</tr>';

        for(var key in this.loaded.projectCodes) {
            var projectCode = this.loaded.projectCodes[key];
            html += '<tr>';
            html += '<td><input type="checkbox"  id="' + this.htmlId + '_projectCodeSelect_' + projectCode.id +'"></td>';
            html += '<td><span class="link" id="' + this.htmlId + '_projectCode_' + projectCode.id + '">' + projectCode.code + '</span></td>';
            html += '<td>' + projectCode.description + '</td>';
            html += '</tr>';
        }
        html += '</table>';
    } else {
        html += 'No project codes found for this filter settings';
    }
    $('#' + this.htmlId + '_projectCode').html(html);
    this.updateProjectCodesSelection();
    var form = this;
    $('span[id^="' + this.htmlId + '_projectCode_"]').bind("click", function(event) {form.projectCodeClickedHandle.call(form, event);});
    $('input[id^="' + this.htmlId + '_projectCodeSelect_"]').bind("click", function(event) {form.projectCodeSelectorClickedHandle.call(form, event);});
    $('#' + this.htmlId + '_selectAll')
      .button({
        icons: {
            primary: "ui-icon-check"
        },
        text: false
        })
      .click(function( event ) {
        form.selectAllProjectCodes.call(form);
    });    
}
CodeDetailReport.prototype.updateProjectCodesSelection = function() {
    for(var key in this.loaded.projectCodes) {
        var projectCode = this.loaded.projectCodes[key];
        var value = false;
        if(jQuery.inArray(projectCode.id, this.selected.projectCodeIds) != -1) {
        //if(projectCode.id == this.selected.projectCodeId) {
            value = true;
        }
        $('#' + this.htmlId + '_projectCodeSelect_' + projectCode.id).prop("checked", value);
    }
    var html = '';
    html += 'Selected: ' + this.selected.projectCodeIds.length;
    $('#' + this.htmlId + '_selectorCount').html(html);
}
CodeDetailReport.prototype.updateLimiterView = function() {
    var pagesCount = parseInt(this.loaded.count / this.limiter.itemsPerPage) + 1;
    var html = 'Found: ' + this.loaded.count + '. ';
    if(pagesCount > 1) {
        for(var i = 0; i < pagesCount; i++) {
            if(this.limiter.page - i > 5) {
                continue;
            }
            if(i - this.limiter.page > 5) {
                break;
            }
            if(i == this.limiter.page) {
                html += '<span>' + (i + 1) + '</span>';
            } else {
                html += '<span class="link" id="' + this.htmlId + '_limiter_page_' + i + '">' + (i + 1) + '</span>';
            }
        }
    }
    $('#' + this.htmlId + '_limiter').html(html);
    var form = this;
    $('span[id^="' + this.htmlId + '_limiter_page_"]').bind("click", function(event) {form.pageClickHandle.call(form, event)});
}

CodeDetailReport.prototype.updateProjectCodeCommentView = function() {
   var html = "";
   var projectCode = null;
    if(this.selected.projectCodeIds.length == 1) {
        for(var key in this.loaded.projectCodes) {
            var projectCodeTmp = this.loaded.projectCodes[key];
            if(projectCodeTmp.id == this.selected.projectCodeIds[0]) {
                projectCode = projectCodeTmp;
                break;
            }
        }
    }
    if(projectCode != null) {
        html += '<a href="../../../code/code_management/index.jsp?code=' + escape(projectCode.code) + '">Code management</a><br />';
        html += '<a href="../../../financial_information/fees/index.jsp?code=' + escape(projectCode.code) + '">Budget management</a>';

    }
    $('#' + this.htmlId + '_projectCodeComment').html(html);
}
CodeDetailReport.prototype.updateIsRateInfoVisibleView = function() {
   var html = "";
    for(var key in this.isRateInfoVisibleOptions) {
        var option = this.isRateInfoVisibleOptions[key];
        var isSelected = "";
        if(key == this.selected.isRateInfoVisible) {
           isSelected = "selected";
        }
        html += '<option value="'+ key +'" ' + isSelected + '>' + option + '</option>';
    }
    $('#' + this.htmlId + '_isRateInfoVisible').html(html);
}
CodeDetailReport.prototype.updateReportCurrencyView = function() {
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
CodeDetailReport.prototype.updateCurrencyRatesView = function() {
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
CodeDetailReport.prototype.updateRateInfoView = function() {
    if(this.data.isRateInfoVisible == 'true') {
        $('#' + this.htmlId + '_rateInfo').show('fast');
    } else {
        $('#' + this.htmlId + '_rateInfo').hide('fast');
    }
}
CodeDetailReport.prototype.validate = function() {
    var errors = [];
    var numberRE = /^[0-9]*[\.]?[0-9]*$/;
    var integerRE = /^[0-9]+$/;
    if(this.data.projectCodeIds.length == 0) {
        errors.push("Select one or more Project Codes");
    }
    
    if(this.data.isRateInfoVisible == null) {
        errors.push("Rate info visibility is not set");
    } else if(this.data.isRateInfoVisible == "true") {
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
    }
    
    return errors;
}
CodeDetailReport.prototype.startGeneratingXLS = function() {
    var errors = this.validate();
    if(errors.length > 0) {
        showErrors(errors);
    } else {
      this.data.view = "EXCEL_SIMPLE";
      this.generateXLS();
    }
}
CodeDetailReport.prototype.startGeneratingXLSWithRequisites = function() {
    var errors = this.validate();
    if(errors.length > 0) {
        showErrors(errors);
    } else {
      this.data.view = "EXCEL_WITH_REQUISITES";
      this.generateXLS();
    }
}
CodeDetailReport.prototype.generateXLS = function() {
    $('#' + this.htmlId + '_xlsForm_command').val('generateXLSReport');
    $('#' + this.htmlId + '_xlsForm_data').val(getJSON(this.data));
    $('#' + this.htmlId + '_xlsForm').submit();
}
CodeDetailReport.prototype.startGeneratingHTML = function() {
    var errors = this.validate();
    if(errors.length > 0) {
        showErrors(errors);
    } else {
      this.generateHTML();
    }
}
CodeDetailReport.prototype.generateHTML = function() {
    var form = this;
    var data = {};
    this.data.view = "SITE";
    data.command = "generateReport";
    data.codeDetailReportForm = getJSON(this.data);
    $.ajax({
        url: this.config.endpointUrl,
        data: data,
        cache: false,
        type: "POST",
        success: function(data){
            ajaxResultHandle(data, form, function(result) {
                form.report = result.report;
                form.updateReportView();
            })
        },
        error: function(jqXHR, textStatus, errorThrown) {
            ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
        }
    });
}

CodeDetailReport.prototype.updateReportView = function() {
    var html = '<table><tr><td id="' + this.htmlId + '_heading"></td></tr><tr><td id="' + this.htmlId + '_body"></td></tr></table>';
    $('#' + this.htmlId + '_report').html(html);
    this.updateHeadingView();
    this.updateBodyView();
}
CodeDetailReport.prototype.updateHeadingView = function() {  
    var headingHtml = '';
    headingHtml += '<table class="datagrid">';
    headingHtml += '<tr class="dgHeader">';
    headingHtml += '<td>Code</td>';
    headingHtml += '<td>Description</td>';
    headingHtml += '<td>Person in charge</td>';
    headingHtml += '<td>Closed</td>';
    headingHtml += '<td>Dead</td>';
    headingHtml += '<td>Sub-Department</td>';
    headingHtml += '<td>Client</td>';
    headingHtml += '</tr>';
    for(var key in this.report.describedProjectCodes) {
        var describedProjectCode = this.report.describedProjectCodes[key];
        var inChargePersonFullName = '';
        if(describedProjectCode.inChargePerson != null) {
            inChargePersonFullName = describedProjectCode.inChargePerson.firstName + ' ' + describedProjectCode.inChargePerson.lastName;
        }
        headingHtml += '<tr>';
        headingHtml += '<td>' + describedProjectCode.projectCode.code + '</td>';
        headingHtml += '<td>' + describedProjectCode.projectCode.description + '</td>';
        headingHtml += '<td>' + inChargePersonFullName + '</td>';
        headingHtml += '<td>' + booleanVisualizer.getHtml(describedProjectCode.projectCode.isClosed) + '</td>';
        headingHtml += '<td>' + booleanVisualizer.getHtml(describedProjectCode.projectCode.isDead) + '</td>';
        headingHtml += '<td>' + describedProjectCode.subdepartment.name + '</td>';
        headingHtml += '<td>' + describedProjectCode.client.name + '</td>';
        headingHtml += '</tr>';
    }
    headingHtml += '</table>';
    
    headingHtml += '<table class="datagrid">';
    if(this.report.formIsRateInfoVisible) {
        headingHtml += '<tr><td>Report currency</td><td>' + this.report.formReportCurrency.code + '</td></tr>';
        for(var key in this.report.currencies) {
            var currency = this.report.currencies[key];
            headingHtml += '<tr><td>' + currency.code + ' / ' + this.report.formReportCurrency.code + '</td><td>' + this.report.formCurrencyRates[currency.id] + '</td></tr>';
        }
    }
    headingHtml += '<tr><td>Generated at</td><td>' + getStringFromYearMonthDateTime(this.report.createdAt) + '</td></tr>';
    headingHtml += '</table>';
    $('#' + this.htmlId + '_heading').html(headingHtml);
}
CodeDetailReport.prototype.updateBodyView = function() { 
    var bodyHtml = '';
    var cols = 10;
    if(this.report.describedProjectCodes.length > 1) {
        cols++;
    }
    if(this.report.formIsRateInfoVisible) {
        cols += this.report.currencies.length + 2;
    }
    bodyHtml += '<table class="datagrid">';
    bodyHtml += '<tr class="dgHeader"><td colspan="' + cols + '">Code Detail Report</td></tr>';
    bodyHtml += '<tr class="dgHeader">';
    if(this.report.describedProjectCodes.length > 1) {
        bodyHtml += '<td>Project code</td>';
    }
    bodyHtml += '<td>First Name</td><td>Last Name</td><td>Position</td><td>Standard position</td><td>Task Type</td><td>Task</td><td>Time Spent</td>';
    if(this.report.formIsRateInfoVisible) {
        for(var key in this.report.currencies) {
            var currency = this.report.currencies[key];
            bodyHtml += '<td>Rate (' + currency.code + ')</td>';
        }
        bodyHtml += '<td>CvRate (' + this.report.formReportCurrency.code + ')</td>';
        bodyHtml += '<td>Amount (' + this.report.formReportCurrency.code + ')</td>';
    }
    bodyHtml += '<td>Description</td><td>Record Date</td><td>Modified At</td></tr>';
    var totalTimeSpent = 0;
    var totalAmount = 0;
    for(var key in this.report.rows) {
        var row = this.report.rows[key];
        totalTimeSpent += row.timeSpent;
        bodyHtml += '<tr>';
        if(this.report.describedProjectCodes.length > 1) {
            bodyHtml += '<td>' + row.projectCodeCode + '</td>';
        }
        bodyHtml += '<td>' + row.employeeFirstName + '</td>';
        bodyHtml += '<td>' + row.employeeLastName + '</td>';
        bodyHtml += '<td>' + (row.positionName != null? row.positionName : '') + '</td>';
        bodyHtml += '<td>' + (row.standardPositionName != null? row.standardPositionName : '') + '</td>';
        bodyHtml += '<td>' + row.taskTypeName + '</td>';
        bodyHtml += '<td>' + row.taskName + '</td>';
        bodyHtml += '<td>' + minutesAsHoursVisualizer.getHtml(row.timeSpent) + '</td>';
        if(this.report.formIsRateInfoVisible) {
            var rateAmount = row.standardSellingRateAmount;
            var cvRateAmount = null;
            var amount = null;
            if(rateAmount != null) {
                cvRateAmount = rateAmount * this.report.formCurrencyRates[row.standardSellingRateGroupCurrencyId];
                amount = row.timeSpent * cvRateAmount / 60.0;
                totalAmount += amount;
            }
            for(var key in this.report.currencies) {
                var currency = this.report.currencies[key];
                if(currency.id == row.standardSellingRateGroupCurrencyId) {
                    bodyHtml += '<td>' + decimalVisualizer.getHtml(rateAmount) + '</td>';
                } else {
                    bodyHtml += '<td></td>';
                }
            }
            bodyHtml += '<td>' + decimalVisualizer.getHtml(cvRateAmount) + '</td>';
            bodyHtml += '<td>' + decimalVisualizer.getHtml(amount) + '</td>';
        }
        bodyHtml += '<td>' + row.description + '</td>';
        bodyHtml += '<td>' + calendarVisualizer.getHtml(row.day) + '</td>';
        bodyHtml += '<td>' + getStringFromYearMonthDateTime(row.modifiedAt) + '</td>';
        bodyHtml += '</tr>';
    }
    var footer1Cols = 6;
    if(this.report.describedProjectCodes.length > 1) {
        footer1Cols++;
    }
    
    bodyHtml += '<tr class="dgHighlight"><td colspan="' + footer1Cols + '" style="text-align: center;">&Sigma;</td>';
    bodyHtml += '<td>' + minutesAsHoursVisualizer.getHtml(totalTimeSpent) + '</td>';
    if(this.report.formIsRateInfoVisible) {
        var averageCvRateAmount = totalAmount / (totalTimeSpent/60.0);
        bodyHtml += '<td colspan="' + this.report.currencies.length + '"></td>';
        bodyHtml += '<td>' + decimalVisualizer.getHtml(averageCvRateAmount) + '</td><td>' + decimalVisualizer.getHtml(totalAmount) + '</td>';
    }
    bodyHtml += '<td colspan="3"></td></tr>';
    bodyHtml += '</table>';
    $('#' + this.htmlId + '_body').html(bodyHtml);
}
