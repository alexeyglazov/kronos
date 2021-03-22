/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
function ClientPlanningViewer(formData, htmlId, containerHtmlId) {
    this.config = {
        endpointUrl: endpointsFolder + "ClientPlanningViewer.jsp"
    };
    this.htmlId = htmlId;
    this.containerHtmlId = containerHtmlId;
    this.moduleName = "Planning Read";
    this.data = {
        startDate: formData.null,
        endDate: formData.null,
        groupId: formData.groupId,
        clientId: formData.clientId,
        subdepartmentId: formData.subdepartmentId
    }
    var now = new Date();
    this.data.startDate = {
        year: now.getFullYear(),
        month: 8,
        dayOfMonth: 1
    }
    this.data.endDate = {
        year: now.getFullYear() + 1,
        month: 7,
        dayOfMonth: 31
    }
    this.selected = {
        planningItemId: null,
        planningGroupId: null,
    }
    this.loaded = {
        subdepartments: [],
        groups: [],
        clients: [],
    }
}
ClientPlanningViewer.prototype.init = function() {
    this.loadInitialContent();
}
ClientPlanningViewer.prototype.loadInitialContent = function() {
    var form = this;
    var data = {};
    data.command = "getInitialContent";
    data.subdepartmentId = this.data.subdepartmentId;
    data.groupId = this.data.groupId;
    data.clientId = this.data.clientId;
    $.ajax({
        url: this.config.endpointUrl,
        data: data,
        cache: false,
        type: "POST",
        success: function(data){
            ajaxResultHandle(data, form, function(result) {
                form.loaded.clients = result.clients;
                form.loaded.groups = result.groups;
                form.loaded.subdepartments = result.subdepartments;
                form.checkInitialData();
                form.show();
                contentSizeChangedEventSubscribers.push({"context": this, "function": this.normalizeContentSize});
                form.normalizeContentSize();        
            })
        },
        error: function(jqXHR, textStatus, errorThrown) {
            ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
        }
    });
}
ClientPlanningViewer.prototype.checkInitialData = function() {
    if(this.data.groupId != null) {
        var groupIdCorrect = false;
        for(var key in this.loaded.groups) {
            if(this.loaded.groups[key].id == this.data.groupId) {
                groupIdCorrect = true;
                break;
            }
        }
        if(! groupIdCorrect) {
            this.data.groupId = null;
        }
    }
    if(this.data.clientId != null) {
        var clientIdCorrect = false;
        for(var key in this.loaded.clients) {
            if(this.loaded.clients[key].id == this.data.clientId) {
                clientIdCorrect = true;
                break;
            }
        }
        if(! clientIdCorrect) {
            this.data.clientId = null;
        }
    }
    if(this.data.subdepartmentId != null) {
        var subdepartmentIdCorrect = false;
        for(var key in this.loaded.subdepartments) {
            if(this.loaded.subdepartments[key].subdepartmentId == this.data.subdepartmentId) {
                subdepartmentIdCorrect = true;
                break;
            }
        }
        if(! subdepartmentIdCorrect) {
            this.data.subdepartmentId = null;
        }
    }
}
ClientPlanningViewer.prototype.loadGroupContent = function() {
    var form = this;
    var data = {};
    data.command = "getGroupContent";
    data.groupId = this.data.groupId;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      type: "POST",
      cache: false,
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.clients = result.clients;

            form.data.clientId = null;
            form.updateClientView();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
ClientPlanningViewer.prototype.loadNoGroupContent = function() {
    var form = this;
    var data = {};
    data.command = "getNoGroupContent";
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      type: "POST",
      cache: false,
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.clients = result.clients;
            form.data.clientId = null;
            form.updateClientView();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
ClientPlanningViewer.prototype.show = function() {
    $('#' + this.containerHtmlId).html(this.getHtml());
    this.makeButtons();
    this.makeDatePickers();
    this.updateView();
    this.setHandlers();
}
ClientPlanningViewer.prototype.getHtml = function() {
    var html = '';
    html += '<table>';
    html += '<tr><td><span class="label1">Subdepartment</span></td><td><span class="label1">Group</span></td><td colspan="3"><span class="label1">Client</span></td><td></td></tr>';
    html += '<tr>';
    html += '<td><select id="' + this.htmlId + '_subdepartment"></select></td>';
    html += '<td><select id="' + this.htmlId + '_group"></select></td>';
    html += '<td><select id="' + this.htmlId + '_client"></select></td>';
    html += '</tr>';
    html += '</table>';

    html += '<table>';
    html += '<tr><td><span class="label1">From</span></td><td><span class="label1">To</span></td><td></td></tr>';
    html += '<tr>';
    html += '<td><input type="text" id="' + this.htmlId + '_startDate' + '"></td>';
    html += '<td><input type="text" id="' + this.htmlId + '_endDate' + '"></td>';
    html += '<td colspan="2"><button id="' + this.htmlId + '_showBtn' + '">Show</button></td>';
    html += '</tr>';
    html += '</table>';
    html += '<table><tr>';
    html += '<td><div id="' + this.htmlId + '_layoutResult" style="overflow: auto;"></div></td>';
    html += '<td><div id="' + this.htmlId + '_layoutInfo" style="overflow: auto;"></div></td>';
    html += '</tr></table>';
    return html;
}
ClientPlanningViewer.prototype.makeDatePickers = function() {
    var form = this;
    $('#' + this.htmlId + '_startDate').datepicker({
        dateFormat: 'dd.mm.yy',
        changeMonth: true,
        changeYear: true,
        onSelect: function(dateText, inst) {
            form.startDateChangedHandle(dateText, inst)
        }
    });
    $('#' + this.htmlId + '_endDate').datepicker({
        dateFormat: 'dd.mm.yy',
        changeMonth: true,
        changeYear: true,
        onSelect: function(dateText, inst) {
            form.endDateChangedHandle(dateText, inst)
        }
    });
}
ClientPlanningViewer.prototype.makeButtons = function() {
    var form = this;
    $('#' + this.htmlId + '_showBtn')
            .button({
                icons: {
                    primary: "ui-icon-document"
                },
                text: true
            })
            .click(function(event) {
                form.showPlanningInfo.call(form);
            });
}
ClientPlanningViewer.prototype.updateView = function() {
    this.updateSubdepartmentView();
    this.updateGroupView();
    this.updateClientView();
    this.updateStartDateView();
    this.updateEndDateView();
}
ClientPlanningViewer.prototype.setHandlers = function() {
    var form = this;
    $('#' + this.htmlId + '_startDate').bind("change", function(event) {
        form.startDateTextChangedHandle.call(form, event);
    });
    $('#' + this.htmlId + '_endDate').bind("change", function(event) {
        form.endDateTextChangedHandle.call(form, event);
    });
    $('#' + this.htmlId + '_group').bind("change", function(event) {form.groupChangedHandle.call(form)});
    $('#' + this.htmlId + '_client').bind("change", function(event) {form.clientChangedHandle.call(form)});
    $('#' + this.htmlId + '_subdepartment').bind("change", function(event) {form.subdepartmentChangedHandle.call(form)});

}

ClientPlanningViewer.prototype.startDateChangedHandle = function(dateText, inst) {
    var date = dateText;
    this.startDateStringChangedHandle(date);
}
ClientPlanningViewer.prototype.startDateTextChangedHandle = function(event) {
    var date = jQuery.trim(event.currentTarget.value);
    this.startDateStringChangedHandle(date);
}
ClientPlanningViewer.prototype.startDateStringChangedHandle = function(date) {
    if(date == null || $.trim(date) == '') {
        this.data.startDate = null;
    } if (isDateValid(date)) {
        this.data.startDate = getYearMonthDateFromDateString(date);
    }
    this.updateStartDateView();
    this.clearView();
}

ClientPlanningViewer.prototype.endDateChangedHandle = function(dateText, inst) {
    var date = dateText;
    this.endDateStringChangedHandle(date);
}
ClientPlanningViewer.prototype.endDateTextChangedHandle = function(event) {
    var date = jQuery.trim(event.currentTarget.value);
    this.endDateStringChangedHandle(date);
}
ClientPlanningViewer.prototype.endDateStringChangedHandle = function(date) {
    if(date == null || $.trim(date) == '') {
        this.data.endDate = null;
    } if (isDateValid(date)) {
        this.data.endDate = getYearMonthDateFromDateString(date);
    }
    this.updateEndDateView();
    this.clearView();
}

ClientPlanningViewer.prototype.subdepartmentChangedHandle = function() {
    var idTxt = $('#' + this.htmlId + '_subdepartment').val();
    if(idTxt == '') {
        this.data.subdepartmentId = null;
    } else {
        this.data.subdepartmentId = parseInt(idTxt);
    }
}
ClientPlanningViewer.prototype.groupChangedHandle = function() {
    var idTxt = $('#' + this.htmlId + '_group').val();
    if(idTxt == '') {
        this.data.groupId = null;
    } else {
        this.data.groupId = parseInt(idTxt);
    }
    if(this.data.groupId == null) {
        this.loadNoGroupContent();
    } else {
        this.loadGroupContent();
    }
}
ClientPlanningViewer.prototype.clientChangedHandle = function() {
    var idTxt = $('#' + this.htmlId + '_client').val();
    if(idTxt == '') {
        this.data.clientId = null;
    } else {
        this.data.clientId = parseInt(idTxt);
    }
}

ClientPlanningViewer.prototype.updateSubdepartmentView = function() {
    var html = "";
    html += '<option value="">...</option>';
    for(var key in this.loaded.subdepartments) {
        var subdepartment = this.loaded.subdepartments[key];
        var isSelected = "";
        if(subdepartment.subdepartmentId == this.data.subdepartmentId) {
           isSelected = "selected";
        }
        html += '<option value="'+ subdepartment.subdepartmentId +'" ' + isSelected + '>' + subdepartment.officeName + ' / ' + subdepartment.departmentName + ' / ' + subdepartment.subdepartmentName + '</option>';
    }
    $('#' + this.htmlId + '_subdepartment').html(html);
}
ClientPlanningViewer.prototype.updateGroupView = function() {
    var html = "";
    html += '<option value="">...</option>';
    for(var key in this.loaded.groups) {
        var group = this.loaded.groups[key];
        var isSelected = "";
        if(group.id == this.data.groupId) {
           isSelected = "selected";
        }
        html += '<option value="'+ group.id +'" ' + isSelected + '>' + group.name + '</option>';
    }
    $('#' + this.htmlId + '_group').html(html);
}
ClientPlanningViewer.prototype.updateClientView = function() {
    var html = "";
    html += '<option value="">...</option>';
    for(var key in this.loaded.clients) {
        var client = this.loaded.clients[key];
        var isSelected = "";
        if(client.id == this.data.clientId) {
           isSelected = "selected";
        }
        html += '<option value="'+ client.id +'" ' + isSelected + '>' + client.name + '</option>';
    }
    $('#' + this.htmlId + '_client').html(html);
}

ClientPlanningViewer.prototype.updateStartDateView = function() {
    $('#' + this.htmlId + '_startDate').val(getStringFromYearMonthDate(this.data.startDate));
}
ClientPlanningViewer.prototype.updateEndDateView = function() {
    $('#' + this.htmlId + '_endDate').val(getStringFromYearMonthDate(this.data.endDate));
}
ClientPlanningViewer.prototype.validate = function() {
    var errors = [];
    if(this.data.startDate == null) {
        errors.push("Start date is not set");
    }
    if(this.data.endDate == null) {
        errors.push("End date is not set");
    }
    if(this.data.startDate != null && this.data.endDate != null && compareYearMonthDate(this.data.startDate, this.data.endDate) > 0) {
        errors.push("End date is less than Start date");
    }
    if(this.data.startDate != null && this.data.endDate != null && (this.data.endDate.year - this.data.startDate.year) > 1) {
        errors.push("Period is too big");
    }
    if(this.data.groupId == null && this.data.clientId == null) {
        errors.push("Group or client is not selected");
    }
    if(this.data.subdepartmentId == null) {
        errors.push("Subdepartment is not selected");
    }
    return errors;
}
ClientPlanningViewer.prototype.showPlanningInfo = function() {
    var errors = this.validate();
    if(errors.length > 0) {
        showErrors(errors);
    } else {
        this.getPlanningInfo();
    }
}
ClientPlanningViewer.prototype.getPlanningInfo = function() {
    var serverFormatData = {
        "startDate" : this.data.startDate,
        "endDate" : this.data.endDate,
        "subdepartmentId" : this.data.subdepartmentId,
        "groupId" : this.data.groupId,
        "clientId" : this.data.clientId
    };
    var form = this;
    var data = {};
    data.command = "getPlanningInfo";
    data.clientPlanningViewerForm = getJSON(serverFormatData);
    $.ajax({
        url: this.config.endpointUrl,
        data: data,
        cache: false,
        type: "POST",
        success: function(data){
            ajaxResultHandle(data, form, function(result) {
                form.clientPlanningReport = result.clientPlanningReport;
                form.updatePlanningInfoView();
            })
        },
        error: function(jqXHR, textStatus, errorThrown) {
            ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
        }
    });
}
ClientPlanningViewer.prototype.clearView = function() {
    $('#' + this.htmlId + '_layoutResult').html('');
    $('#' + this.htmlId + '_layoutInfo').html('');
}    

ClientPlanningViewer.prototype.updatePlanningInfoView = function() {
    var html = '';
    for(var key in this.clientPlanningReport.subreports) {
        var subreport = this.clientPlanningReport.subreports[key];
        var cols = 4 + 2*subreport.planningTypes.length + 2;
        html += '<table class="datagrid">';
        html += '<tr class="dgHeader">';
        html += '<td colspan="' + cols + '">' + subreport.client.name + '</td>';
        html += '<tr class="dgHeader">';
        html += '<td>Standard position</td>'
        html += '<td>Position</td>'
        html += '<td>Rate</td>'
        html += '<td>Period</td>'
        for(var planningTypeKey in subreport.planningTypes) {
            var planningType = subreport.planningTypes[planningTypeKey];
            html += '<td colspan="2">' + planningType.name + '</td>'
        }
        html += '<td colspan="2">TOTAL</td>'
        html += '</tr>';
        if(subreport.rows.length > 0) {
            for(var rowKey in subreport.rows) {
                var row = subreport.rows[rowKey];
                var totalTime = 0;
                var totalCost = 0;
                var currencyCode = '';
                if(row.standardSellingRateAmount != null) {
                    for(var currencyKey in subreport.currencies) {
                        if(subreport.currencies[currencyKey].id == row.currencyId) {
                            currencyCode = subreport.currencies[currencyKey].code;
                            break;
                        }
                    }
                }
                html += '<tr>';
                html += '<td>' + (row.standardPosition != null ? row.standardPosition.name : 'Not defined') + '</td>';
                html += '<td>' + (row.position != null ? row.position.name : 'Not defined') + '</td>';
                html += '<td>' + (row.standardSellingRateAmount != null ? (row.standardSellingRateAmount + ' ' + currencyCode) : 'Not defined') + '</td>';
                html += '<td>' + (row.standardSellingRateAmount != null ? getStringFromRange(row.startDate, row.endDate) : '') + '</td>';
                for(var planningTypeKey in subreport.planningTypes) {
                    var planningType = subreport.planningTypes[planningTypeKey];
                    var time = row.timeItems[planningType.id];
                    if(time != null) {
                        totalTime += time;
                    }
                    var cost = null;
                    if(row.standardSellingRateAmount != null && time != null) {
                        cost = row.standardSellingRateAmount * time;
                        totalCost += cost;
                    }
                    html += '<td>' + (time != null ? decimalVisualizer.getHtml(time) : '') + '</td>';
                    html += '<td>' + (cost != null ? (decimalVisualizer.getHtml(cost) + ' ' + currencyCode) : '') + '</td>';
                }
                html += '<td class="dgHighlight">' + (totalTime != null ? decimalVisualizer.getHtml(totalTime) : '') + '</td>';
                html += '<td class="dgHighlight">' + (totalCost != null ? (decimalVisualizer.getHtml(totalCost) + ' ' + currencyCode) : '') + '</td>';

                html += '</tr>';
            }
            
            var total = this.getTotal(subreport);
            for(var totalKey in total) {
                var totalRow = total[totalKey];
                var currencyCode = 'No currency';
                for(var currencyKey in subreport.currencies) {
                    if(subreport.currencies[currencyKey].id == totalRow.currencyId) {
                        currencyCode = subreport.currencies[currencyKey].code;
                        break;
                    }
                }          
                html += '<tr class="dgHighlight">';
                html += '<td colspan="2">Total (' + currencyCode + ')</td>';
                html += '<td>' + (totalRow.totalCost != null && totalRow.totalTime != null ? decimalVisualizer.getHtml(totalRow.totalCost/totalRow.totalTime) : '') +'</td>';
                html += '<td></td>';
                for(var planningTypeKey in subreport.planningTypes) {
                    var planningType = subreport.planningTypes[planningTypeKey];
                    var time = totalRow.timeItems[planningType.id];
                    var cost = totalRow.costs[planningType.id];;
                    html += '<td>' + (time != null ? decimalVisualizer.getHtml(time) : '') + '</td>';
                    html += '<td>' + (cost != null ? decimalVisualizer.getHtml(cost) : '') + '</td>';
                }
                html += '<td>' + (totalRow.totalTime != null ? decimalVisualizer.getHtml(totalRow.totalTime) : '') + '</td>';
                html += '<td>' + (totalRow.totalCost != null ? (decimalVisualizer.getHtml(totalRow.totalCost)) : '') + '</td>';
                
                html += '</tr>';
            }
        } else {
            html += '<tr><td colspan="' + cols + '">No data</td></tr>';
        }
        html += '</tr>';
        html += '</table>'        
    }
    $('#' + this.htmlId + '_layoutResult').html(html);
}
ClientPlanningViewer.prototype.getTotal = function(subreport) {
    var totalInfo = []; // array of tRows
    //{
    //    currencyId: ,
    //    timeItems: {},
    //    costs: {},
    //    totalTime,
    //    totalCost
    //}
    for(var rowKey in subreport.rows) {
        var row = subreport.rows[rowKey];
        var currencyId = row.currencyId;
        var tRows = jQuery.grep(totalInfo, function( n, i ) {
            return (n.currencyId == currencyId);
        });
        var tRow = null;
        if(tRows.length == 0) {
            tRow = {
                currencyId: currencyId,
                timeItems: {},
                costs: {},
                totalTime: 0,
                totalCost: 0
            };
            totalInfo.push(tRow);
        } else {
            tRow = tRows[0];
        }
        for(var planningTypeKey in subreport.planningTypes) {
            var planningType = subreport.planningTypes[planningTypeKey];
            var time = row.timeItems[planningType.id];
            if(time != null) {
                if(tRow.timeItems[planningType.id] == null) {
                    tRow.timeItems[planningType.id] = time; 
                } else {
                    tRow.timeItems[planningType.id] = tRow.timeItems[planningType.id] + time;
                }
                tRow.totalTime += time;
            }
            if(row.standardSellingRateAmount != null && time != null) {
                var cost = row.standardSellingRateAmount * time;
                if(tRow.costs[planningType.id] == null) {
                    tRow.costs[planningType.id] = cost; 
                } else {
                    tRow.costs[planningType.id] = tRow.costs[planningType.id] + cost;
                }
                tRow.totalCost += cost;
            }
            
        }            
    }
    return totalInfo;
}
ClientPlanningViewer.prototype.normalizeContentSize = function() { 
    jQuery('#' + this.htmlId + '_layoutResult').width(contentWidth - 350);
    jQuery('#' + this.htmlId + '_layoutResult').height(contentHeight - 170);

    jQuery('#' + this.htmlId + '_layoutInfo').width(270);
    jQuery('#' + this.htmlId + '_layoutInfo').height(contentHeight - 170);
}
