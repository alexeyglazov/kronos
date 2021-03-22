/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
function ConflictCheckManager(filter, htmlId, containerHtmlId) {
    this.config = {
        endpointUrl: endpointsFolder+ "ConflictCheckManager.jsp"
    }
    this.htmlId = htmlId;
    this.containerHtmlId = containerHtmlId;
    this.moduleName = "Conflict Check";
    this.loaded = {
        "projectCodes" : [],
        "conflictCheckBlock" : null
    }
    this.selected = {
        "projectCodeIds" : [],
        "projectCodeConflictIds": []
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
    
    this.sorter = {
        "field": 'CODE',
        "order": 'ASC'
    };
    this.limiter = {
        "page": 0,
        "itemsPerPage": 50
    };        
    this.data = {
        'searchConflictsOnly': true
    }
}
ConflictCheckManager.prototype.resetFilters = function() {
    this.limiter.page = 0;
    this.filter = ProjectCodesListFilter.prototype.getDefaultFilter();
    
    this.selected.projectCodeIds = [];
    var filterStr = getJSON(this.filter);
    var expire = new Date();
    expire.setTime(expire.getTime() + 1000 * 60 * 60 * 24 * 100);
    setCookie("projectCodesListFilter", filterStr, expire.toGMTString(), null);        
    this.getProjectCodeList();
}
ConflictCheckManager.prototype.init = function() {
    contentSizeChangedEventSubscribers.push({"context": this, "function": this.normalizeContentSize});
    this.getProjectCodeList();
}
ConflictCheckManager.prototype.refreshList = function() {
    this.limiter.page = 0;
    this.selected.projectCodeIds = [];   
    this.getProjectCodeList();
}
ConflictCheckManager.prototype.getProjectCodeList = function() {
    var form = this;
    var data = {};
    data.command = "getProjectCodeList";
    data.filter = getJSON(this.filter);
    data.sorter = getJSON(this.sorter);
    data.limiter = getJSON(this.limiter);
    data.searchConflictsOnly = getJSON(this.data.searchConflictsOnly);
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
            this.selected.projectCodeConflictIds = [];
            form.show();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
ConflictCheckManager.prototype.loadProjectCodeContent = function() {
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
            form.loaded.conflictCheckBlock = result.conflictCheckBlock;
            this.selected.projectCodeConflictIds = [];
            if(form.loaded.conflictCheckBlock.items.length == 1) {
                this.selected.projectCodeConflictIds.push(form.loaded.conflictCheckBlock.items[0].projectCodeConflictId);
            }
            form.updateProjectCodeConflictCheckView();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
ConflictCheckManager.prototype.detectProjectCodeConflicts = function() {
    var form = this;
    var data = {};
    data.command = "detectProjectCodeConflicts";
    data.projectCodeId = this.selected.projectCodeIds[0];
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            var count = result.projectCodeConflictsCount;
            this.selected.projectCodeConflictIds = [];
            if(form.loaded.conflictCheckBlock.items.length == 1) {
                this.selected.projectCodeConflictIds.push(form.loaded.conflictCheckBlock.items[0].projectCodeConflictId);
            }
            doAlert("Info", "New conflicts found: " + count, form, form.loadProjectCodeContent);
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
ConflictCheckManager.prototype.show = function() {
    $('#' + this.containerHtmlId).html(this.getHtml());
    this.updateView();
    this.normalizeContentSize();
    this.setHandlers();
    this.makeButtons();
}
ConflictCheckManager.prototype.getHtml = function() {
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
ConflictCheckManager.prototype.makeButtons = function() {
    var form = this;
}
ConflictCheckManager.prototype.setHandlers = function() {
    var form = this;
}
ConflictCheckManager.prototype.projectCodeClickedHandle = function(event) {
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
ConflictCheckManager.prototype.projectCodeCodeClickedHandle = function(event) {
    var idTxt = $(event.currentTarget).attr("id");
    var parts = idTxt.split('_');
    var id = parseInt(parts[parts.length - 1]);
    this.selected.projectCodeIds = [];
    this.selected.projectCodeIds.push(id);
    this.updateProjectCodesSelection();
    this.showProjectCode();
}
ConflictCheckManager.prototype.projectCodeConflictSelectionClickedHandle = function(event) {
    var idTxt = $(event.currentTarget).attr("id");
    var parts = idTxt.split('_');
    var id = parseInt(parts[parts.length - 1]);
    if($('#' + idTxt).is(':checked')) {
        this.selected.projectCodeConflictIds.push(id);
    } else {
        var index = jQuery.inArray(id, this.selected.projectCodeConflictIds);
        this.selected.projectCodeConflictIds.splice(index, 1);
    }
    this.updateProjectCodeConflictsSelection();
}
ConflictCheckManager.prototype.projectCodeConflictClickedHandle = function(event) {
    var idTxt = $(event.currentTarget).attr("id");
    var parts = idTxt.split('_');
    var id = parseInt(parts[parts.length - 1]);
    this.selected.projectCodeConflictIds = [];
    this.selected.projectCodeConflictIds.push(id);
    this.updateProjectCodeConflictsSelection();
}

ConflictCheckManager.prototype.updateView = function() {
    this.updateProjectCodesView();
}
ConflictCheckManager.prototype.updateProjectCodesView = function() {
    var html = "";
    html += '<div id="' + this.htmlId + '_projectCodesPanel"></div>';
    html += '<div id="' + this.htmlId + '_projectCodesList"></div>';
    $('#' + this.htmlId + '_projectCodes').html(html);
    
    this.updateProjectCodesPanelView();
    this.updateProjectCodesListView();
}
ConflictCheckManager.prototype.updateProjectCodesPanelView = function() {
    var html = "";
    html += '<table>';
    html += '<tr>';    
    html += '<td><button id="' + this.htmlId + '_refreshListBtn' + '">Refresh list</button></td>';
    html += '<td id="' + this.htmlId + '_filterCell"><button id="' + this.htmlId + '_showFilterBtn' + '">Filter project codes</button></td>';
    html += '<td><select id="' + this.htmlId + '_conflictStatus' + '"></select></td>';
    html += '<td><input type="checkbox" id="' + this.htmlId + '_searchConflictsOnly' + '">Conflicts only</td>';
    html += '<td><button id="' + this.htmlId + '_resetFiltersBtn' + '">Reset</button></td>';
    html += '<td><button id="' + this.htmlId + '_showProjectCodeBtn' + '">Show selected project codes</button></td>';
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

    $('#' + this.htmlId + '_showProjectCodeBtn')
      .button({
        icons: {
            primary: "ui-icon-note"
        },
        text: false
        })
      .click(function( event ) {
        form.showProjectCode.call(form);
    });
    
    $('#' + this.htmlId + '_conflictStatus').bind("change", function(event) {form.conflictStatusChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_searchConflictsOnly').bind("click", function(event) {form.searchConflictsOnlyChangedHandle.call(form, event);});

    
}
ConflictCheckManager.prototype.updateProjectCodesListView = function() {
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
    this.updateConflictStatusView();
    this.updateSearchConflictsOnlyView();
    
    var form = this;
    this.updateLimiterView();
    $('span[id^="' + this.htmlId + '_projectCode_"]').bind('click', function(event) {form.projectCodeCodeClickedHandle.call(form, event)});
    $('input[id^="' + this.htmlId + '_projectCodeSelect_"]').bind('click', function(event) {form.projectCodeClickedHandle.call(form, event)});
    $('#' + this.htmlId + '_projectCodes').tooltip();
}
ConflictCheckManager.prototype.updateProjectCodesSelection = function() {
    for(var key in this.loaded.projectCodes) {
        var projectCode = this.loaded.projectCodes[key];
        var isSelected = false;
        if(jQuery.inArray(projectCode.id, this.selected.projectCodeIds) != -1) {
            isSelected = true;
        }
        $('#' + this.htmlId + '_projectCodeSelect_' + projectCode.id).prop('checked', isSelected);
    }
}
ConflictCheckManager.prototype.updateProjectCodeConflictsSelection = function() {
    for(var key in this.loaded.conflictCheckBlock.items) {
        var item = this.loaded.conflictCheckBlock.items[key];
        var isSelected = false;
        if(jQuery.inArray(item.projectCodeConflictId, this.selected.projectCodeConflictIds) != -1) {
            isSelected = true;
        }
        $('#' + this.htmlId + '_projectCodeConflictSelect_' + item.projectCodeConflictId).prop('checked', isSelected);
    }
}
ConflictCheckManager.prototype.updateFilterSelectionView = function() {
    if(ProjectCodesListFilter.prototype.isFilterUsed(this.filter)) {
        $('#' + this.htmlId + '_filterCell').css('border-left', '3px solid #009900');
    } else {
        $('#' + this.htmlId + '_filterCell').css('border-left', '0px');
    }
}
ConflictCheckManager.prototype.updateConflictStatusView = function() {
    var options = {"": "All", "NOT_DETECTED": "Not detected", "DETECTED": "Detected", "IRRESOLVABLE": "Irresolvable", "RESOLVED": "Resolved"}
    var html = '';
    for(var key in options) {
        var isSelected = '';
        if(key == this.filter.projectCodeConflictStatus) {
            isSelected = 'selected';
        }
        html += '<option ' + isSelected + ' value="' + key + '">' + options[key] + '</option>';
    }
    $("#" + this.htmlId + '_conflictStatus').html(html);
}
ConflictCheckManager.prototype.updateSearchConflictsOnlyView = function() {
    $('#' + this.htmlId + '_searchConflictsOnly').attr("checked", this.data.searchConflictsOnly);
}
ConflictCheckManager.prototype.updateLimiterView = function() {
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
ConflictCheckManager.prototype.updateProjectCodeConflictCheckView = function() {
    var html = '';
    html += '<div id="' + this.htmlId + '_projectCodeProperties"></div>';
    html += '<div id="' + this.htmlId + '_projectCodeConflictCheckPanel"></div>';
    html += '<div id="' + this.htmlId + '_projectCodeConflictCheckBlock"></div>';     
    $('#' + this.htmlId + '_info').html(html);
    
    this.updateProjectCodePropertiesView();
    this.updateProjectCodeConflictCheckPanelView();
    this.updateProjectCodeConflictCheckBlockView();
}
ConflictCheckManager.prototype.updateProjectCodePropertiesView = function() {
    var html = '';
    html += '<div class="label1">' + this.loaded.conflictCheckBlock.projectCode.code + '</div>';
    html += '<div class="comment1">' + this.loaded.conflictCheckBlock.projectCode.comment + '</div>';
    html += '<div class="comment1">' + this.loaded.conflictCheckBlock.projectCode.description + '</div>';
    html += '<div class="label1">Conflict status: ' + this.loaded.conflictCheckBlock.projectCode.conflictStatus + '</div>';
    html += '<div>Subdepartment: ' + this.loaded.conflictCheckBlock.subdepartment.officeName + ' / ' + this.loaded.conflictCheckBlock.subdepartment.departmentName + ' / ' + this.loaded.conflictCheckBlock.subdepartment.subdepartmentName + '</div>';
    html += '<div>Created: ';
    if(this.loaded.conflictCheckBlock.projectCode.createdAt != null) {
        html += ' ' + yearMonthDateTimeVisualizer.getHtml(this.loaded.conflictCheckBlock.projectCode.createdAt);
    }
    if(this.loaded.conflictCheckBlock.createdBy != null) {
        html += ' ' + this.loaded.conflictCheckBlock.createdBy.firstName + ' ' + this.loaded.conflictCheckBlock.createdBy.lastName;
    }
    html += '</div>';

    html += '<div>Person in charge: ';
    if(this.loaded.conflictCheckBlock.inChargePerson != null) {
        html += ' ' + this.loaded.conflictCheckBlock.inChargePerson.firstName + ' ' + this.loaded.conflictCheckBlock.inChargePerson.lastName;
    }
    html += '</div>';

    html += '<div>Partner in charge: ';
    if(this.loaded.conflictCheckBlock.inChargePartner != null) {
        html += ' ' + this.loaded.conflictCheckBlock.inChargePartner.firstName + ' ' + this.loaded.conflictCheckBlock.inChargePartner.lastName;
    }
    html += '</div>';

    html += '<div>Closed: ';
    html += booleanVisualizer.getHtml(this.loaded.conflictCheckBlock.projectCode.isClosed);
    if(this.loaded.conflictCheckBlock.projectCode.closedAt != null) {
        html += ' ' + yearMonthDateTimeVisualizer.getHtml(this.loaded.conflictCheckBlock.projectCode.closedAt);
    }
    if(this.loaded.conflictCheckBlock.closedBy != null) {
        html += ' ' + this.loaded.conflictCheckBlock.closedBy.firstName + ' ' + this.loaded.conflictCheckBlock.closedBy.lastName;
    }
    html += '</div>';
    
    html += '<table><tr>';
    html += '<td><a href="../code_management/index.jsp?code=' + escape(this.loaded.conflictCheckBlock.projectCode.code) + '">Code management</a></td>';
    html += '<td> | <span class="link"><a href="../../financial_information/fees/index.jsp?code=' + escape(this.loaded.conflictCheckBlock.projectCode.code) + '">Budget management</a></span></td>';
    html += '<td> | <span class="link"><a href="../../reports/code/code_detail/index.jsp?code=' + escape(this.loaded.conflictCheckBlock.projectCode.code) + '">Code detail report</a></span></td>';
    html += '</tr></table>';
    $('#' + this.htmlId + '_projectCodeProperties').html(html);    
}
ConflictCheckManager.prototype.updateProjectCodeConflictCheckPanelView = function() {
    var html = '';
    html += '<table>';
    html += '<tr>';    
    html += '<td><button id="' + this.htmlId + '_detectProjectCodeConflictsBtn' + '">Check</button></td>';
    html += '<td><button id="' + this.htmlId + '_showHistoryBtn' + '">Show history</button></td>';
    html += '<td><button id="' + this.htmlId + '_changeConflictStatusBtn' + '">Change</button></td>';
    html += '</tr>';
    html += '</table>';
    $('#' + this.htmlId + '_projectCodeConflictCheckPanel').html(html);

    var form = this;
    $('#' + this.htmlId + '_detectProjectCodeConflictsBtn')
      .button({
        icons: {
            primary: "ui-icon-star"
        },
        text: true
        })
      .click(function( event ) {
        form.detectProjectCodeConflicts.call(form);
    });    

    
    $('#' + this.htmlId + '_showHistoryBtn')
      .button({
        icons: {
            primary: "ui-icon-comment"
        },
        text: true
        })
      .click(function( event ) {
        form.showHistory.call(form);
    });    

    $('#' + this.htmlId + '_changeConflictStatusBtn')
      .button({
        icons: {
            primary: "ui-icon-gear"
        },
        text: true
        })
      .click(function( event ) {
        form.changeConflictStatus.call(form);
    });

}
ConflictCheckManager.prototype.updateProjectCodeConflictCheckBlockView = function() {
var html = '';
    html += '<table class="datagrid">';
    html += '<tr class="dgHeader">';    
    html += '<td></td>';
    html += '<td>Office</td>';
    html += '<td>Department</td>';
    html += '<td>Subedpartment</td>';
    html += '<td>Status</td>';
    html += '<td>Last modified by</td>';
    html += '<td>Last modified at</td>';
    html += '</tr>';
    for(var key in this.loaded.conflictCheckBlock.items) {
        var item = this.loaded.conflictCheckBlock.items[key];
        html += '<tr>';    
        html += '<td><input type="checkbox" id="' + this.htmlId + '_projectCodeConflictSelect_' + item.projectCodeConflictId + '" ' + '></td>';
        html += '<td>' + item.checkingSubdepartment.officeName + '</td>';
        html += '<td>' + item.checkingSubdepartment.departmentName + '</td>';
        html += '<td>' + item.checkingSubdepartment.subdepartmentName + '</td>';
        html += '<td><span id="' + this.htmlId + '_projectCodeConflict_' + item.projectCodeConflictId + '" class="link">' + item.status + '</span></td>';
        html += '<td>' + item.modifiedBy.firstName + ' ' + item.modifiedBy.lastName + '</td>';
        html += '<td>' + yearMonthDateTimeVisualizer.getHtml(item.modifiedAt) + '</td>';
        html += '</tr>';
    }
    html += '</table>';
    $('#' + this.htmlId + '_projectCodeConflictCheckBlock').html(html);
    var form = this;
    $('span[id^="' + this.htmlId + '_projectCodeConflict_"]').bind('click', function(event) {form.projectCodeConflictClickedHandle.call(form, event)});
    $('input[id^="' + this.htmlId + '_projectCodeConflictSelect_"]').bind('click', function(event) {form.projectCodeConflictSelectionClickedHandle.call(form, event)});
    this.updateProjectCodeConflictsSelection();
}
ConflictCheckManager.prototype.showProjectCode = function() {
    if(this.selected.projectCodeIds.length == 0) {
        doAlert('Alert', 'Please select a project code', null, null);
    } else if(this.selected.projectCodeIds.length > 1) {
        doAlert('Alert', 'Please select one project code', null, null);
    } else {
        this.loadProjectCodeContent();       
    }   
}
ConflictCheckManager.prototype.showFilter = function() {
    this.filterForm = new ProjectCodesListFilter("projectCodesListFilter", this.moduleName, this.filter, this.acceptFilterData, this);

    this.filterForm.disabled.office = true;
    this.filterForm.disabled.department = true;
    this.filterForm.disabled.subdepartment = true;
    this.filterForm.disabled.activity = true;
    
    this.filterForm.init(); 
}
ConflictCheckManager.prototype.rememberFilterData = function(filter) {
    var filterStr = getJSON(this.filter);
    var expire = new Date();
    expire.setTime(expire.getTime() + 1000 * 60 * 60 * 24 * 100);
    setCookie("projectCodesListFilter", filterStr, expire.toGMTString(), null);        
}
ConflictCheckManager.prototype.acceptFilterData = function(filter) {
    this.limiter.page = 0;
    this.filter = filter;
    this.selected.projectCodeIds = [];
    this.rememberFilterData();        
    this.getProjectCodeList();
}
ConflictCheckManager.prototype.conflictStatusChangedHandle = function(event) {
    var value = $('#' + this.htmlId + '_conflictStatus').val();
    if(value == '') {
        this.filter.projectCodeConflictStatus = null;
    } else {
        this.filter.projectCodeConflictStatus = value;
    }
    this.limiter.page = 0;
    this.selected.projectCodeIds = [];
    this.rememberFilterData();
    this.getProjectCodeList();
}
ConflictCheckManager.prototype.searchConflictsOnlyChangedHandle = function(event) {
    this.data.searchConflictsOnly = $(event.currentTarget).is(":checked");
   
    this.limiter.page = 0;
    this.selected.projectCodeIds = [];
    this.getProjectCodeList();
}
ConflictCheckManager.prototype.pageClickHandle = function(event) {
    var htmlId = $(event.currentTarget).attr("id");
    var tmp = htmlId.split("_");
    var page = parseInt(tmp[tmp.length - 1]);
    this.limiter.page = page;
    this.selected.projectCodeIds = [];
    this.getProjectCodeList();
}
ConflictCheckManager.prototype.normalizeContentSize = function() {
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
ConflictCheckManager.prototype.showHistory = function() {
    if(this.selected.projectCodeConflictIds.length == 0) {
        doAlert('Alert', 'Please select a conflict', null, null);
    } else if(this.selected.projectCodeConflictIds.length > 1) {
        doAlert('Alert', 'Please select one conflict', null, null);
    } else {
        this.showHistoryPopup();       
    }
}    
ConflictCheckManager.prototype.showHistoryPopup = function() {
    var projectCodeConflictId = this.selected.projectCodeConflictIds[0];
    var item = null;
    for(var key in this.loaded.conflictCheckBlock.items) {
        var tmpItem = this.loaded.conflictCheckBlock.items[key];
        if(tmpItem.projectCodeConflictId == projectCodeConflictId) {
            item = tmpItem;
            break;
        }
    }
    var message = '';
    message += '<table class="datagrid">';
    message += '<tr class="dgHeader">';
    message += '<td>Status</td>';
    message += '<td>Comment</td>';
    message += '<td>Time</td>';
    message += '<td>Employee</td>';
    message += '</tr>';
    for(var key in item.historyItems) {
        var historyItem = item.historyItems[key];
        message += '<tr>';
        message += '<td>' + historyItem.status + '</td>';
        message += '<td>' + historyItem.comment + '</td>';
        message += '<td>' + yearMonthDateTimeVisualizer.getHtml(historyItem.modifiedAt) + '</td>';
        message += '<td>' + (historyItem.modifiedBy.firstName + ' ' + historyItem.modifiedBy.lastName) + '</td>';
        message += '</tr>';
    }
    message += '</table>';
    showPopup('Conflict check history', message, 600, 400, null, null);     
}
ConflictCheckManager.prototype.changeConflictStatus = function() {
    if(this.selected.projectCodeConflictIds.length != 1) {
        doAlert('Alert', 'Please select one conflict', null, null);
    } else {
        var projectCodeConflictId = this.selected.projectCodeConflictIds[0];
        var item = null;
        for(var key in this.loaded.conflictCheckBlock.items) {
            var tmpItem = this.loaded.conflictCheckBlock.items[key];
            if(tmpItem.projectCodeConflictId == projectCodeConflictId) {
                item = tmpItem;
                break;
            }
        }
        var projectCodeConflictEditForm = new ProjectCodeConflictEditForm({
            "id": item.projectCodeConflictId,
            "projectCodeId": this.loaded.conflictCheckBlock.projectCode.id,
            "checkingSubdepartmentId": item.checkingSubdepartment.subdepartmentId,
            "status": item.status,
            "comment": "Status changed"
        }, "projectCodeConflictEditForm", this.loadProjectCodeContent, this);
        projectCodeConflictEditForm.init();        
    }
}
