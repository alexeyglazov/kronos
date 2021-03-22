/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
function BudgetManager(filter, htmlId, containerHtmlId) {
    this.config = {
        endpointUrl: endpointsFolder+ "BudgetManager.jsp"
    }
    this.htmlId = htmlId;
    this.containerHtmlId = containerHtmlId;
    this.moduleName = "Financial Information";
    this.loaded = {
        "clients" : [],
        "projectCodes" : [],
        "feesItem": null
    }
    this.selected = {
        "projectCodeIds" : []
    }
    this.filter = {};
    this.invoiceRequestsFilter = InvoiceRequestsFilter.prototype.getDefaultFilter();
    
    this.filter = ProjectCodesListFilter.prototype.getDefaultFilter();    
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
    
    this.sorter = {
        "field": 'CODE',
        "order": 'ASC'
    };
    this.limiter = {
        "page": 0,
        "itemsPerPage": 50
    };        
    this.data = {}
    this.reports = {};
}
BudgetManager.prototype.resetFilters = function() {
    this.limiter.page = 0;
    this.filter = ProjectCodesListFilter.prototype.getDefaultFilter();
    this.invoiceRequestsFilter = InvoiceRequestsFilter.prototype.getDefaultFilter();
    this.selected.projectCodeIds = [];
    var filterStr = getJSON(this.filter);
    var expire = new Date();
    expire.setTime(expire.getTime() + 1000 * 60 * 60 * 24 * 100);
    setCookie("projectCodesListFilter", filterStr, expire.toGMTString(), null);        
    this.getProjectCodeList();
}
BudgetManager.prototype.init = function() {
    contentSizeChangedEventSubscribers.push({"context": this, "function": this.normalizeContentSize});
    this.getProjectCodeList();
}
BudgetManager.prototype.refreshList = function() {
    this.limiter.page = 0;
    this.selected.projectCodeIds = [];   
    this.getProjectCodeList();
}
BudgetManager.prototype.getProjectCodeList = function() {
    var form = this;
    var data = {};
    data.command = "getProjectCodeList";
    data.filter = getJSON(this.filter);
    data.sorter = getJSON(this.sorter);
    data.limiter = getJSON(this.limiter);
    data.invoiceRequestsFilter = getJSON(this.invoiceRequestsFilter);
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.count = result.count;
            form.loaded.projectCodes = result.projectCodes;
            if(form.loaded.projectCodes.length == 1) {
                form.selected.projectCodeIds.push(form.loaded.projectCodes[0].id);
            }
            form.show();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
BudgetManager.prototype.loadProjectCodeContent = function() {
    var form = this;
    var data = {};
    data.command = "getProjectCodeContent";
    data.projectCodeId = this.selected.projectCodeId;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.feesItem = result.feesItem;
            form.showBudget();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}

BudgetManager.prototype.show = function() {
    $('#' + this.containerHtmlId).html(this.getHtml());
    this.updateView();
    this.normalizeContentSize();
    this.setHandlers();
    this.makeButtons();
}
BudgetManager.prototype.getHtml = function() {
    var html = '';
    html += '<table id="' + this.htmlId + '_layout' + '">';
    html += '<tr>';
    html += '<td id="' + this.htmlId + '_projectCodes' + '">';
    
    html += '</td>';
    html += '<td id="' + this.htmlId + '_info' + '"></td>';
    html += '</tr>';
    html += '</table>';
    return html;
}
BudgetManager.prototype.makeButtons = function() {
    var form = this;
}
BudgetManager.prototype.setHandlers = function() {
    var form = this;
}
BudgetManager.prototype.clientChangedHandle = function(event) {
    var idTxt = $('#' + this.htmlId + '_client').val();
    if(idTxt == 'ALL') {
        this.selected.clientId = null;
    } else {
        this.selected.clientId = parseInt(idTxt);
    }
    if(this.selected.clientId == null) {
        this.loadInitialContent();
    } else {
        this.loadClientContent();
    }
}
BudgetManager.prototype.projectCodeClickedHandle = function(event) {
    var idTxt = $(event.currentTarget).attr("id");
    var parts = idTxt.split('_');
    var id = parseInt(parts[parts.length - 1]);
    if($('#' + idTxt).is(':checked')) {
        this.selected.projectCodeIds.push(id);
    } else {
        var index = jQuery.inArray(id, this.selected.projectCodeIds);
        this.selected.projectCodeIds.splice(index, 1);
    }
    this.updateProjectCodesSelection();
}
BudgetManager.prototype.projectCodeCodeClickedHandle = function(event) {
    var idTxt = $(event.currentTarget).attr("id");
    var parts = idTxt.split('_');
    var id = parseInt(parts[parts.length - 1]);
    this.selected.projectCodeIds = [];
    this.selected.projectCodeIds.push(id);
    this.updateProjectCodesSelection();
    this.showBudget();
}
BudgetManager.prototype.updateView = function() {
    this.updateProjectCodesView();
}
BudgetManager.prototype.updateProjectCodesView = function() {
    var html = "";
    html += '<table>';
    html += '<tr>';    
    html += '<td><button id="' + this.htmlId + '_refreshListBtn' + '">Refresh list</button></td>';
    html += '<td id="' + this.htmlId + '_filterCell"><button id="' + this.htmlId + '_showFilterBtn' + '">Filter project codes</button></td>';
    html += '<td id="' + this.htmlId + '_invoiceRequestsFilterCell"><button id="' + this.htmlId + '_showInvoiceRequestsFilterBtn' + '">Filter invoice requests</button></td>';
    html += '<td><button id="' + this.htmlId + '_resetFiltersBtn' + '">Reset</button></td>';
    html += '<td><button id="' + this.htmlId + '_showBudgetBtn' + '">Show selected project codes</button></td>';
    html += '</tr>';
    html += '</table>';
    
    html += '<div id="' + this.htmlId + '_projectCodes_scroll' + '" style="overflow: auto;">';
    if(this.loaded.projectCodes.length > 0) {
        html += '<table class="datagrid">';
        for(var key in this.loaded.projectCodes) {
            var projectCode = this.loaded.projectCodes[key];
            var title = '';
            if(projectCode.description != null && projectCode.description != '') {
                title += projectCode.description;
            }
            if(projectCode.comment != null && projectCode.comment != '') {
                title += '\n' + projectCode.comment;
            }
            html += '<tr>';
            html += '<td><input type="checkbox" id="' + this.htmlId + '_projectCodeSelect_' + projectCode.id + '" ' + '></td>';
            html += '<td><span title="' + title + '" class="link" id="' + this.htmlId + '_projectCode_' + projectCode.id + '">' + projectCode.code + '</span></td>';
            html += '</tr>';
        }
        html += '</table>';
    } else {
        html += 'No project codes found';
    }
    html += '</div>'
    html += '<span id="' + this.htmlId + '_limiter"></span>';

    $('#' + this.htmlId + '_projectCodes').html(html);
    this.updateProjectCodesSelection();
    this.updateFilterSelectionView();
    
    var form = this;
    this.updateLimiterView();
    $('span[id^="' + this.htmlId + '_projectCode_"]').bind('click', function(event) {form.projectCodeCodeClickedHandle.call(form, event)});
    $('input[id^="' + this.htmlId + '_projectCodeSelect_"]').bind('click', function(event) {form.projectCodeClickedHandle.call(form, event)});
    $('#' + this.htmlId + '_projectCodes').tooltip();
    
    $('#' + this.htmlId + '_refreshListBtn')
      .button({
        icons: {
            primary: "ui-icon-refresh"
        },
        text: false
        })
      .click(function( event ) {
        form.refreshList.call(form);
    });

    $('#' + this.htmlId + '_showFilterBtn')
      .button({
        icons: {
            primary: "ui-icon-search"
        },
        text: false
        })
      .click(function( event ) {
        form.showFilter.call(form);
    });
    
    $('#' + this.htmlId + '_showInvoiceRequestsFilterBtn')
      .button({
        icons: {
            primary: "ui-icon-zoomin"
        },
        text: false
        })
      .click(function( event ) {
        form.showInvoiceRequestsFilter.call(form);
    });
    
    $('#' + this.htmlId + '_resetFiltersBtn')
      .button({
        icons: {
            primary: "ui-icon-arrowthick-1-w"
        },
        text: true
        })
      .click(function( event ) {
        form.resetFilters.call(form);
    });

    $('#' + this.htmlId + '_showBudgetBtn')
      .button({
        icons: {
            primary: "ui-icon-note"
        },
        text: false
        })
      .click(function( event ) {
        form.showBudget.call(form);
    });    
}
BudgetManager.prototype.updateProjectCodesSelection = function() {
    for(var key in this.loaded.projectCodes) {
        var projectCode = this.loaded.projectCodes[key];
        var isSelected = false;
        if(jQuery.inArray(projectCode.id, this.selected.projectCodeIds) != -1) {
            isSelected = true;
        }
        $('#' + this.htmlId + '_projectCodeSelect_' + projectCode.id).prop('checked', isSelected);
    }
}
BudgetManager.prototype.updateFilterSelectionView = function() {
    if(ProjectCodesListFilter.prototype.isFilterUsed(this.filter)) {
        $('#' + this.htmlId + '_filterCell').css('border-left', '3px solid #009900');
    } else {
        $('#' + this.htmlId + '_filterCell').css('border-left', '0px');
    }
    if(InvoiceRequestsFilter.prototype.isFilterUsed(this.invoiceRequestsFilter)) {
        $('#' + this.htmlId + '_invoiceRequestsFilterCell').css('border-left', '3px solid #009900');
    } else {
        $('#' + this.htmlId + '_invoiceRequestsFilterCell').css('border-left', '0px');
    }
}
BudgetManager.prototype.updateLimiterView = function() {
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
BudgetManager.prototype.showBudget = function() {
  if(this.selected.projectCodeIds.length == 0) {
      doAlert('Alert', 'Please select a project code', null, null);
  } else if(this.selected.projectCodeIds.length > 1) {
      doAlert('Alert', 'Please select one project code', null, null);
  } else {
      var budgetInfo = new BudgetInfo("budgetInfo", this.htmlId + '_info');
      budgetInfo.init(this.selected.projectCodeIds[0]);       
  }   
}
BudgetManager.prototype.showFilter = function() {
    this.filterForm = new ProjectCodesListFilter("projectCodesListFilter", this.moduleName, this.filter, this.acceptFilterData, this);
    this.filterForm.init(); 
}
BudgetManager.prototype.showInvoiceRequestsFilter = function() {
    this.invoiceRequestsFilterForm = new InvoiceRequestsFilter("invoiceRequestsFilter", this.moduleName, this.invoiceRequestsFilter, this.acceptInvoiceRequestsFilterData, this);
    this.invoiceRequestsFilterForm.init(); 
}
BudgetManager.prototype.acceptFilterData = function(filter) {
    this.limiter.page = 0;
    this.filter = filter;
    this.selected.projectCodeIds = [];
    var filterStr = getJSON(this.filter);
    var expire = new Date();
    expire.setTime(expire.getTime() + 1000 * 60 * 60 * 24 * 100);
    setCookie("projectCodesListFilter", filterStr, expire.toGMTString(), null);        
    this.getProjectCodeList();
}
BudgetManager.prototype.acceptInvoiceRequestsFilterData = function(invoiceRequestsFilter) {
    this.limiter.page = 0;
    this.invoiceRequestsFilter = invoiceRequestsFilter;
    this.selected.projectCodeIds = [];
//    var filterStr = getJSON(this.filter);
//    var expire = new Date();
//    expire.setTime(expire.getTime() + 1000 * 60 * 60 * 24 * 100);
//    setCookie("projectCodesListFilter", filterStr, expire.toGMTString(), null);        
    this.getProjectCodeList();
}

BudgetManager.prototype.pageClickHandle = function(event) {
    var htmlId = $(event.currentTarget).attr("id");
    var tmp = htmlId.split("_");
    var page = parseInt(tmp[tmp.length - 1]);
    this.limiter.page = page;
    this.selected.projectCodeIds = [];
    this.getProjectCodeList();
}
BudgetManager.prototype.normalizeContentSize = function() {
    var layoutWidth = contentWidth - 40;
    var layoutHeight = contentHeight - 100;
    var projectCodeWidth = layoutWidth * 0.2;
    if(projectCodeWidth > 300) {
        projectCodeWidth = 300;
    }
    var infoWidth = layoutWidth - projectCodeWidth;
    $('#' + this.htmlId + '_layout').height(layoutHeight);
    $('#' + this.htmlId + '_projectCodes').width(projectCodeWidth);
    $('#' + this.htmlId + '_projectCodes').height(layoutHeight);
    $('#' + this.htmlId + '_projectCodes_scroll').height(layoutHeight - 0);
    $('#' + this.htmlId + '_info').width(infoWidth);
    $('#' + this.htmlId + '_info').height(layoutHeight);
}