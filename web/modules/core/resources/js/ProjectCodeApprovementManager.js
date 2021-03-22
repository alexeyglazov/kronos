/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
function ProjectCodeApprovementManager(filter, htmlId, containerHtmlId) {
    this.config = {
        endpointUrl: endpointsFolder+ "ProjectCodeApprovementManager.jsp"
    }
    this.htmlId = htmlId;
    this.containerHtmlId = containerHtmlId;
    this.moduleName = "Code Report";
    this.loaded = {
        "projectCodes" : [],
        "feesItem": null
    }
    this.selected = {
        "projectCodeIds" : [],
        "projectCodeApprovementIndexes": []
    }
    this.filter = {};
    
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

    this.projectCodeApprovementFilter = {
        noApprovement: 'NO_PRIMARY_APPROVEMENT'
    };
    if(this.filter.isClosed != 'FALSE') { 
        this.projectCodeApprovementFilter.noApprovement = 'ALL';
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
ProjectCodeApprovementManager.prototype.resetFilters = function() {
    this.limiter.page = 0;
    this.filter = ProjectCodesListFilter.prototype.getDefaultFilter();
    this.filter.isClosed = 'FALSE';
    
    this.projectCodeApprovementFilter = {
        noApprovement: 'NO_PRIMARY_APPROVEMENT'
    };
    
    this.selected.projectCodeIds = [];
    var filterStr = getJSON(this.filter);
    var expire = new Date();
    expire.setTime(expire.getTime() + 1000 * 60 * 60 * 24 * 100);
    setCookie("projectCodesListFilter", filterStr, expire.toGMTString(), null);        
    this.getProjectCodeList();
}
ProjectCodeApprovementManager.prototype.init = function() {
    contentSizeChangedEventSubscribers.push({"context": this, "function": this.normalizeContentSize});
    this.getProjectCodeList();
}
ProjectCodeApprovementManager.prototype.refreshList = function() {
    this.limiter.page = 0;
    this.selected.projectCodeIds = [];   
    this.getProjectCodeList();
}
ProjectCodeApprovementManager.prototype.getProjectCodeList = function() {
    var form = this;
    var data = {};
    data.command = "getProjectCodeList";
    data.filter = getJSON(this.filter);
    data.projectCodeApprovementFilter = getJSON(this.projectCodeApprovementFilter);
    data.sorter = getJSON(this.sorter);
    data.limiter = getJSON(this.limiter);
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
ProjectCodeApprovementManager.prototype.loadProjectCodeContent = function() {
    var form = this;
    var data = {};
    data.command = "getProjectCodeContent";
    data.projectCodeId = this.selected.projectCodeIds[0];
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.standardPosition = result.standardPosition;
            form.loaded.projectCodeApprovementBlock = result.projectCodeApprovementBlock;
            form.updateProjectCodeApprovementInfoView();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
ProjectCodeApprovementManager.prototype.loadTimesheet = function() {
    var form = this;
    var codeDetailReportForm = {
        "projectCodeIds" : [],
        "start" : null,
        "end" : null,
        "view": null,
        "reportCurrencyId" : null,
        "currencyRates" : {},
        "isRateInfoVisible" : "false"        
    };
    codeDetailReportForm.projectCodeIds.push(this.selected.projectCodeIds[0]);
    var month = this.loaded.projectCodeApprovementBlock.items[this.selected.projectCodeApprovementIndexes[0]].month;
    var start = {
        year: month.year,
        month: month.month,
        dayOfMonth: 1
    };
    var endTmp = {
        year: month.year,
        month: month.month + 1,
        dayOfMonth: 1
    };
    if(month.month == 11) {
        endTmp.year = month.year + 1;
        endTmp.month = 0;
    }
    var end = getShiftedYearMonthDate(endTmp, -1);
    codeDetailReportForm.start = start;
    codeDetailReportForm.end = end;
    var data = {};
    data.command = "getTimesheet";
    data.codeDetailReportForm = getJSON(codeDetailReportForm);
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.codeDetailReport = result.codeDetailReport;
            form.updateTimesheetView();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });    
}
ProjectCodeApprovementManager.prototype.doApplyApprovementAction = function() {
    var months = [];
    for(var key in this.selected.projectCodeApprovementIndexes) {
        var index = this.selected.projectCodeApprovementIndexes[key];
        months.push(this.loaded.projectCodeApprovementBlock.items[index].month);
    }
    var projectCodeApprovementForm = {
        projectCodeId : this.selected.projectCodeIds[0],
        approvementAction : this.approvementAction,
        months : months
    }
    var form = this;
    var data = {};
    data.command = "applyApprovementAction";
    data.projectCodeApprovementForm = getJSON(projectCodeApprovementForm);
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            this.selected.projectCodeApprovementIndexes = [];
            doAlert("Info", "Approvement has been done", form, form.loadProjectCodeContent);
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });    
}
ProjectCodeApprovementManager.prototype.show = function() {
    $('#' + this.containerHtmlId).html(this.getHtml());
    this.updateView();
    this.normalizeContentSize();
    this.setHandlers();
    this.makeButtons();
}
ProjectCodeApprovementManager.prototype.getHtml = function() {
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
ProjectCodeApprovementManager.prototype.makeButtons = function() {
    var form = this;
}
ProjectCodeApprovementManager.prototype.setHandlers = function() {
    var form = this;
}
ProjectCodeApprovementManager.prototype.projectCodeClickedHandle = function(event) {
    var idTxt = $(event.currentTarget).attr("id");
    var parts = idTxt.split('_');
    var id = parseInt(parts[parts.length - 1]);
    if($('#' + idTxt).is(':checked')) {
        this.selected.projectCodeIds.push(id);
    } else {
        var index = jQuery.inArray(id, this.selected.projectCodeIds);
        this.selected.projectCodeIds.splice(index, 1);
    }
    this.selected.projectCodeApprovementIndexes = [];
    this.updateProjectCodesSelection();
}
ProjectCodeApprovementManager.prototype.projectCodeCodeClickedHandle = function(event) {
    var idTxt = $(event.currentTarget).attr("id");
    var parts = idTxt.split('_');
    var id = parseInt(parts[parts.length - 1]);
    this.selected.projectCodeIds = [];
    this.selected.projectCodeIds.push(id);
    this.updateProjectCodesSelection();
    this.selected.projectCodeApprovementIndexes = [];
    this.showBudget();
}
ProjectCodeApprovementManager.prototype.projectCodeApprovementSelectionClickedHandle = function(event) {
    var idTxt = $(event.currentTarget).attr("id");
    var parts = idTxt.split('_');
    var id = parseInt(parts[parts.length - 1]);
    if($('#' + idTxt).is(':checked')) {
        this.selected.projectCodeApprovementIndexes.push(id);
    } else {
        var index = jQuery.inArray(id, this.selected.projectCodeApprovementIndexes);
        this.selected.projectCodeApprovementIndexes.splice(index, 1);
    }
    this.updateProjectCodeApprovementsSelection();
    this.cleanTimesheetView();    
}
ProjectCodeApprovementManager.prototype.projectCodeApprovementClickedHandle = function(event) {
    var idTxt = $(event.currentTarget).attr("id");
    var parts = idTxt.split('_');
    var id = parseInt(parts[parts.length - 1]);
    this.selected.projectCodeApprovementIndexes = [];
    this.selected.projectCodeApprovementIndexes.push(id);
    this.updateProjectCodeApprovementsSelection();
    this.cleanTimesheetView();
}
ProjectCodeApprovementManager.prototype.approvementActionChangedHandle = function(event) {
    var action = jQuery.trim(event.currentTarget.value);
    if(action == '') {
        this.approvementAction = null;
    } else {
        this.approvementAction = action;
    }
    this.updateApprovementActionView();
}
ProjectCodeApprovementManager.prototype.updateView = function() {
    this.updateProjectCodesView();
}
ProjectCodeApprovementManager.prototype.updateProjectCodesView = function() {
    var html = "";
    html += '<div id="' + this.htmlId + '_projectCodesPanel"></div>';
    html += '<div id="' + this.htmlId + '_projectCodesList"></div>';
    $('#' + this.htmlId + '_projectCodes').html(html);
    
    this.updateProjectCodesPanelView();
    this.updateProjectCodesListView();
}
ProjectCodeApprovementManager.prototype.updateProjectCodesPanelView = function() {
    var html = "";
    html += '<table>';
    html += '<tr>';    
    html += '<td><button id="' + this.htmlId + '_refreshListBtn' + '">Refresh list</button></td>';
    html += '<td id="' + this.htmlId + '_filterCell"><button id="' + this.htmlId + '_showFilterBtn' + '">Filter project codes</button></td>';
    html += '<td id="' + this.htmlId + '_projectCodeApprovementFilterCell"><select id="' + this.htmlId + '_projectCodeApprovementFilter' + '"></select><div class="comment1">Available for open project codes only</div></td>';
    html += '<td><button id="' + this.htmlId + '_resetFiltersBtn' + '">Reset</button></td>';
    html += '<td><button id="' + this.htmlId + '_showBudgetBtn' + '">Show selected project codes</button></td>';
    html += '</tr>';
    html += '</table>';
    $('#' + this.htmlId + '_projectCodesPanel').html(html);
    
    var form = this;
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
    
    $('#' + this.htmlId + '_projectCodeApprovementFilter').bind("change", function(event) {form.projectCodeApprovementFilterChangedHandle.call(form)});

    this.updateProjectCodeApprovementFilterView();
}
ProjectCodeApprovementManager.prototype.updateProjectCodeApprovementFilterView = function() {
    var options = {"ALL": "All", "NO_PRIMARY_APPROVEMENT": "No primary approvement", "NO_SECONDARY_APPROVEMENT": "No secondary approvement"}
    this.updateSelectorView(this.htmlId + '_projectCodeApprovementFilter', this.projectCodeApprovementFilter.noApprovement, options);
    if(this.filter.isClosed != 'FALSE') {
        $('#' + this.htmlId + '_projectCodeApprovementFilter').attr("disabled", true);
    } else {
        $('#' + this.htmlId + '_projectCodeApprovementFilter').attr("disabled", false);
    }
}

ProjectCodeApprovementManager.prototype.updateProjectCodesListView = function() {
    var html = "";
    
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

    $('#' + this.htmlId + '_projectCodesList').html(html);
    this.updateProjectCodesSelection();
    this.updateFilterSelectionView();
    
    var form = this;
    this.updateLimiterView();
    $('span[id^="' + this.htmlId + '_projectCode_"]').bind('click', function(event) {form.projectCodeCodeClickedHandle.call(form, event)});
    $('input[id^="' + this.htmlId + '_projectCodeSelect_"]').bind('click', function(event) {form.projectCodeClickedHandle.call(form, event)});
    $('#' + this.htmlId + '_projectCodes').tooltip();
}
ProjectCodeApprovementManager.prototype.updateProjectCodesSelection = function() {
    for(var key in this.loaded.projectCodes) {
        var projectCode = this.loaded.projectCodes[key];
        var isSelected = false;
        if(jQuery.inArray(projectCode.id, this.selected.projectCodeIds) != -1) {
            isSelected = true;
        }
        $('#' + this.htmlId + '_projectCodeSelect_' + projectCode.id).prop('checked', isSelected);
    }
}
ProjectCodeApprovementManager.prototype.updateFilterSelectionView = function() {
    if(ProjectCodesListFilter.prototype.isFilterUsed(this.filter)) {
        $('#' + this.htmlId + '_filterCell').css('border-left', '3px solid #009900');
    } else {
        $('#' + this.htmlId + '_filterCell').css('border-left', '0px');
    }
}
ProjectCodeApprovementManager.prototype.updateLimiterView = function() {
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
ProjectCodeApprovementManager.prototype.updateProjectCodeApprovementInfoView = function() {
    var html = '';
    html += '<div id="' + this.htmlId + '_projectCodeProperties"></div>';
    html += '<div id="' + this.htmlId + '_projectCodeApprovementPanel"></div>';
    html += '<div id="' + this.htmlId + '_projectCodeApprovements"></div>';   
    html += '<div id="' + this.htmlId + '_codeDetailReport"></div>';   
    $('#' + this.htmlId + '_info').html(html);
    
    this.updateProjectCodePropertiesView();
    this.updateProjectCodeApprovementPanelView();
    this.updateProjectCodeApprovementsView();
}
ProjectCodeApprovementManager.prototype.updateProjectCodePropertiesView = function() {
    var html = '';
    html += '<div class="label1">' + this.loaded.projectCodeApprovementBlock.projectCode.code + '</div>';
    html += '<div class="comment1">' + this.loaded.projectCodeApprovementBlock.projectCode.comment + '</div>';
    html += '<div class="comment1">' + this.loaded.projectCodeApprovementBlock.projectCode.description + '</div>';
    html += '<div>Created: ';
    if(this.loaded.projectCodeApprovementBlock.projectCode.createdAt != null) {
        html += ' ' + yearMonthDateTimeVisualizer.getHtml(this.loaded.projectCodeApprovementBlock.projectCode.createdAt);
    }
    if(this.loaded.projectCodeApprovementBlock.createdBy != null) {
        html += ' ' + this.loaded.projectCodeApprovementBlock.createdBy.firstName + ' ' + this.loaded.projectCodeApprovementBlock.createdBy.lastName;
    }
    html += '</div>';

    html += '<div>Person in charge: ';
    if(this.loaded.projectCodeApprovementBlock.inChargePerson != null) {
        html += ' ' + this.loaded.projectCodeApprovementBlock.inChargePerson.firstName + ' ' + this.loaded.projectCodeApprovementBlock.inChargePerson.lastName;
    }
    html += '</div>';

    html += '<div>Partner in charge: ';
    if(this.loaded.projectCodeApprovementBlock.inChargePartner != null) {
        html += ' ' + this.loaded.projectCodeApprovementBlock.inChargePartner.firstName + ' ' + this.loaded.projectCodeApprovementBlock.inChargePartner.lastName;
    }
    html += '</div>';

    html += '<div>Closed: ';
    html += booleanVisualizer.getHtml(this.loaded.projectCodeApprovementBlock.projectCode.isClosed);
    if(this.loaded.projectCodeApprovementBlock.projectCode.closedAt != null) {
        html += ' ' + yearMonthDateTimeVisualizer.getHtml(this.loaded.projectCodeApprovementBlock.projectCode.closedAt);
    }
    if(this.loaded.projectCodeApprovementBlock.closedBy != null) {
        html += ' ' + this.loaded.projectCodeApprovementBlock.closedBy.firstName + ' ' + this.loaded.projectCodeApprovementBlock.closedBy.lastName;
    }
    html += '</div>';
    
    html += '<table><tr>';
    html += '<td><a href="../../../code/code_management/index.jsp?code=' + escape(this.loaded.projectCodeApprovementBlock.projectCode.code) + '">Code management</a></td>';
    html += '<td> | <span class="link"><a href="../../../financial_information/fees/index.jsp?code=' + escape(this.loaded.projectCodeApprovementBlock.projectCode.code) + '">Budget management</a></span></td>';
    html += '<td> | <span class="link"><a href="../../code/code_detail/index.jsp?code=' + escape(this.loaded.projectCodeApprovementBlock.projectCode.code) + '">Code detail report</a></span></td>';
    html += '</tr></table>';
    $('#' + this.htmlId + '_projectCodeProperties').html(html);    
    
}
ProjectCodeApprovementManager.prototype.updateProjectCodeApprovementPanelView = function() {
    var html = '';
    html += '<table>';
    html += '<tr>';    
    html += '<td><button id="' + this.htmlId + '_showTimesheetBtn' + '">Show timesheet</button></td>';
    html += '<td><select id="' + this.htmlId + '_approvementAction' + '"></select></td>';
    html += '<td><button id="' + this.htmlId + '_applyApprovementActionBtn' + '">Apply</button></td>';
    html += '</tr>';
    html += '</table>';
    $('#' + this.htmlId + '_projectCodeApprovementPanel').html(html);

    $('#' + this.htmlId + '_approvementAction').bind("change", function(event) {form.approvementActionChangedHandle.call(form, event);});
    
    var form = this;
    $('#' + this.htmlId + '_showTimesheetBtn')
      .button({
        icons: {
            primary: "ui-icon-clock"
        },
        text: true
        })
      .click(function( event ) {
        form.showTimesheet.call(form);
    });    

    $('#' + this.htmlId + '_applyApprovementActionBtn')
      .button({
        icons: {
            primary: "ui-icon-check"
        },
        text: true
        })
      .click(function( event ) {
        form.applyApprovementAction.call(form);
    });
    this.updateApprovementActionView();
}
ProjectCodeApprovementManager.prototype.updateApprovementActionView = function() {
    var standardPosition = this.loaded.standardPosition;

    var options = {};
    if(standardPosition.sortValue <=4) {
        options['SET_PRIMARY_APPROVEMENT'] = 'Set primary approvement';
        options['UNSET_PRIMARY_APPROVEMENT'] = 'Unset primary approvement';
    }
    if(standardPosition.sortValue <=3) {
        options['SET_SECONDARY_APPROVEMENT'] = 'Set secondary approvement';
        options['UNSET_SECONDARY_APPROVEMENT'] = 'Unset secondary approvement';
    }
    var html = '';
    html += '<option value="" >...</option>';
    for(var key in options) {
        var option = options[key];
        var isSelected = "";
        if(key == this.approvementAction) {
           isSelected = "selected";
        }
        html += '<option value="' + key + '" ' + isSelected + '>' + option + '</option>';
    }
    $('#' + this.htmlId + '_approvementAction').html(html);    
}
ProjectCodeApprovementManager.prototype.updateProjectCodeApprovementsView = function() {
    var months = new Array("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec")
    var html = '';

    html += '<table class="datagrid">';
    html += '<tr class="dgHeader">';
    html += '<td colspan="6"></td>';
    html += '<td colspan="2">Primary</td>';
    html += '<td colspan="2">Secondary</td>';
    html += '<td></td>';
    html += '</tr>';

    html += '<tr class="dgHeader">';
    html += '<td></td>';
    html += '<td>Year</td>';
    html += '<td>Month</td>';
    html += '<td>Closed</td>';
    html += '<td>Spent</td>';
    html += '<td>Last modified at</td>';
    html += '<td>Approved by</td>';
    html += '<td>Approved at</td>';
    html += '<td>Approved by</td>';
    html += '<td>Approved at</td>';
    html += '<td>Comment</td>';
    html += '</tr>';
    if(this.loaded.projectCodeApprovementBlock.items == null || this.loaded.projectCodeApprovementBlock.items.length == 0) {
        html += '<tr><td colspan="11">No time reported for this project</td></tr>';
    } else {
        for(var key in this.loaded.projectCodeApprovementBlock.items) {
            var comment = '';
            var item = this.loaded.projectCodeApprovementBlock.items[key];
            var isTimeCorrect = null;
            var isPrimaryApprovementCorrect = null;
            var isSecondaryApprovementCorrect = null;
            if(item.lastModifiedAt == null) {
                isTimeCorrect = false;
                isPrimaryApprovementCorrect = false;
                isSecondaryApprovementCorrect = false;
                comment = 'No timesheet. Old approvement exists';
            } else {
                if(item.primaryApprovedAt == null) {
                    isPrimaryApprovementCorrect = false;
                    isSecondaryApprovementCorrect = false;
                    comment = 'No primary approvement';
                } else if(compareYearMonthDateTime(item.primaryApprovedAt, item.lastModifiedAt) < 0) {
                    isPrimaryApprovementCorrect = false;
                    isSecondaryApprovementCorrect = false;
                    comment = 'Primary approvement was done before last modification';
                } else {
                    isPrimaryApprovementCorrect = true;
                    if(item.secondaryApprovedAt == null) {
                        isSecondaryApprovementCorrect = false;
                        comment = 'No secondary approvement';
                    } else if(compareYearMonthDateTime(item.secondaryApprovedAt, item.primaryApprovedAt) < 0) {
                        isSecondaryApprovementCorrect = false;
                        comment = 'Secondary approvement was done before primary approvement';
                    } else {
                        isSecondaryApprovementCorrect = true;
                    }
                }    
            }
            
            var timeClass = "";
            var primaryApprovementClass = "";
            var secondaryApprovementClass = "";
            if(isTimeCorrect == null) {
                timeClass = '';
            } else if(isTimeCorrect) {
                timeClass = 'class="good"';
            } else if(! isTimeCorrect) {
                timeClass = 'class="bad"';
            }
            if(isPrimaryApprovementCorrect == null) {
                primaryApprovementClass = '';
            } else if(isPrimaryApprovementCorrect) {
                primaryApprovementClass = 'class="good"';
            } else if(! isPrimaryApprovementCorrect) {
                primaryApprovementClass = 'class="bad"';
            }
            if(isSecondaryApprovementCorrect == null) {
                secondaryApprovementClass = '';
            } else if(isSecondaryApprovementCorrect) {
                secondaryApprovementClass = 'class="good"';
            } else if(! isSecondaryApprovementCorrect) {
                secondaryApprovementClass = 'class="bad"';
            }
            
            html += '<tr>';
            html += '<td><input type="checkbox" id="' + this.htmlId + '_projectCodeApprovementSelect_' + key + '" ' + '></td>';
            html += '<td>' + item.month.year + '</td>';
            html += '<td><span id="' + this.htmlId + '_projectCodeApprovement_' + key + '" class="link">' + months[item.month.month] + '</span></td>';
            html += '<td>' + booleanVisualizer.getHtml(item.isClosed) + '</td>';
            html += '<td>' + minutesAsHoursVisualizer.getHtml(item.timeSpent) + '</td>';
            html += '<td ' + timeClass + '>' + yearMonthDateTimeVisualizer.getHtml(item.lastModifiedAt) + '</td>';
            html += '<td ' + primaryApprovementClass + '>' + (item.primaryApprovedBy != null ? item.primaryApprovedBy.firstName + ' ' + item.primaryApprovedBy.lastName : '' ) + '</td>';
            html += '<td ' + primaryApprovementClass + '>' + yearMonthDateTimeVisualizer.getHtml(item.primaryApprovedAt) + '</td>';
            html += '<td ' + secondaryApprovementClass + '>' + (item.secondaryApprovedBy != null ? item.secondaryApprovedBy.firstName + ' ' + item.secondaryApprovedBy.lastName : '' ) + '</td>';
            html += '<td ' + secondaryApprovementClass + '>' + yearMonthDateTimeVisualizer.getHtml(item.secondaryApprovedAt) + '</td>';
            html += '<td>' + comment + '</td>';
            html += '</tr>';
        }
    }
    html += '</table>';
    $('#' + this.htmlId + '_projectCodeApprovements').html(html);
    var form = this;
    $('span[id^="' + this.htmlId + '_projectCodeApprovement_"]').bind('click', function(event) {form.projectCodeApprovementClickedHandle.call(form, event)});
    $('input[id^="' + this.htmlId + '_projectCodeApprovementSelect_"]').bind('click', function(event) {form.projectCodeApprovementSelectionClickedHandle.call(form, event)});

    this.updateProjectCodeApprovementsSelection();
}
ProjectCodeApprovementManager.prototype.updateProjectCodeApprovementsSelection = function() {
    for(var key in this.loaded.projectCodeApprovementBlock.items) {
        var item = this.loaded.projectCodeApprovementBlock.items[key];
        var index = parseInt(key);
        var isSelected = false;
        if(jQuery.inArray(index, this.selected.projectCodeApprovementIndexes) != -1) {
            isSelected = true;
        }
        $('#' + this.htmlId + '_projectCodeApprovementSelect_' + key).prop('checked', isSelected);
    }
}
ProjectCodeApprovementManager.prototype.updateTimesheetView = function() {
    var html = '';
    html += '<table class="datagrid">';
    html += '<tr class="dgHeader">';
    html += '<td>First Name</td><td>Last Name</td><td>Position</td><td>Task Type</td><td>Task</td><td>Time Spent</td>';
    html += '<td>Description</td><td>Record Date</td><td>Modified At</td></tr>';
    for(var key in this.loaded.codeDetailReport.rows) {
        var row = this.loaded.codeDetailReport.rows[key];
        html += '<tr>';
        html += '<td>' + row.employeeFirstName + '</td>';
        html += '<td>' + row.employeeLastName + '</td>';
        html += '<td>' + row.positionName + '</td>';
        html += '<td>' + row.taskTypeName + '</td>';
        html += '<td>' + row.taskName + '</td>';
        html += '<td>' + minutesAsHoursVisualizer.getHtml(row.timeSpent) + '</td>';
        html += '<td>' + row.description + '</td>';
        html += '<td>' + calendarVisualizer.getHtml(row.day) + '</td>';
        html += '<td>' + getStringFromYearMonthDateTime(row.modifiedAt) + '</td>';
        html += '</tr>';
    }
    html += '</table>';
    $('#' + this.htmlId + '_codeDetailReport').html(html);
}
ProjectCodeApprovementManager.prototype.cleanTimesheetView = function() {
    $('#' + this.htmlId + '_codeDetailReport').html('');    
}
ProjectCodeApprovementManager.prototype.showBudget = function() {
    if(this.selected.projectCodeIds.length == 0) {
        doAlert('Alert', 'Please select a project code', null, null);
    } else if(this.selected.projectCodeIds.length > 1) {
        doAlert('Alert', 'Please select one project code', null, null);
    } else {
        this.loadProjectCodeContent();       
    }   
}
ProjectCodeApprovementManager.prototype.showTimesheet = function() {
    if(this.selected.projectCodeApprovementIndexes.length == 0) {
        doAlert('Alert', 'Please select a month', null, null);
    } else if(this.selected.projectCodeApprovementIndexes.length > 1) {
        doAlert('Alert', 'Please select one month', null, null);
    } else {
        this.loadTimesheet();       
    }   
}
ProjectCodeApprovementManager.prototype.applyApprovementAction = function() {
    if(this.approvementAction == null) {
        doAlert('Alert', 'Please select action', null, null);
    } else if(this.approvementAction == 'SET_PRIMARY_APPROVEMENT' || this.approvementAction == 'SET_SECONDARY_APPROVEMENT') {
        if(this.selected.projectCodeApprovementIndexes.length == 0) {
            doAlert('Alert', 'Please select a month', null, null);
        } else {
            doConfirm('Confirm', 'Proceed with setting approvement?', this, this.doApplyApprovementAction, null, null);
        }    
    } else {
        if(this.selected.projectCodeApprovementIndexes.length != 1) {
            doAlert('Alert', 'Please select one month', null, null);
        } else {
            doConfirm('Confirm', 'Proceed with unsetting approvement?', this, this.doApplyApprovementAction, null, null);
        } 
    }
}
ProjectCodeApprovementManager.prototype.showFilter = function() {
    this.filterForm = new ProjectCodesListFilter("projectCodesListFilter", this.moduleName, this.filter, this.acceptFilterData, this);
    this.filterForm.init(); 
}
ProjectCodeApprovementManager.prototype.acceptFilterData = function(filter) {
    this.limiter.page = 0;
    this.filter = filter;
    if(this.filter.isClosed != 'FALSE') {
        this.projectCodeApprovementFilter.noApprovement = 'ALL';
    };        
    this.selected.projectCodeIds = [];
    var filterStr = getJSON(this.filter);
    var expire = new Date();
    expire.setTime(expire.getTime() + 1000 * 60 * 60 * 24 * 100);
    setCookie("projectCodesListFilter", filterStr, expire.toGMTString(), null);        
    this.getProjectCodeList();
}
ProjectCodeApprovementManager.prototype.projectCodeApprovementFilterChangedHandle = function(event) {
    this.projectCodeApprovementFilter.noApprovement = $('#' + this.htmlId + '_projectCodeApprovementFilter').val();
    this.updateProjectCodeApprovementFilterView();
    this.getProjectCodeList();
}

ProjectCodeApprovementManager.prototype.pageClickHandle = function(event) {
    var htmlId = $(event.currentTarget).attr("id");
    var tmp = htmlId.split("_");
    var page = parseInt(tmp[tmp.length - 1]);
    this.limiter.page = page;
    this.selected.projectCodeIds = [];
    this.getProjectCodeList();
}
ProjectCodeApprovementManager.prototype.normalizeContentSize = function() {
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
ProjectCodeApprovementManager.prototype.updateSelectorView = function(id, value, options) {
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
