/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

function BusinessTripItemsForm(formData, htmlId, successContext, successHandler) {
    this.htmlId = htmlId;
    this.year = formData.year;
    this.month = formData.month;
    this.timeSpentItemsInfo = formData.timeSpentItemsInfo;
    this.businessTripItemsInfo = formData.businessTripItemsInfo;
    this.freedays = formData.freedays;
    this.isMonthClosed = formData.isMonthClosed;
    this.successContext = successContext;
    this.successHandler = successHandler;
    this.config = {
        endpointUrl: endpointsFolder + "BusinessTripItemsForm.jsp"
    };
    this.dataUpdated = false;
    this.days = getDays(this.year, this.month);
}
BusinessTripItemsForm.prototype.init = function() {
    this.containerHtmlId = getNextPopupHtmlContainer();
    this.show();
    this.dataChanged(false);
}

BusinessTripItemsForm.prototype.setHandlers = function() {
    var form = this;
    $('input[id^="' + this.htmlId + '_businessTripItem_"]').bind("click", function(event) {form.businessTripItemClickedHandle.call(form, event)});
}
BusinessTripItemsForm.prototype.validateBusinessTripItemClick = function(projectCodeId, dayOfMonth, checked) {
    var errors = [];
    for(var key in this.timeSpentItemsInfo.projectData.projectCodes) {
        var tmpProjectCode = this.timeSpentItemsInfo.projectData.projectCodes[key];
        if(tmpProjectCode.isClosed && this.getTimeSpentItem(tmpProjectCode.id, dayOfMonth) != null) {
            var businessTripItem = this.getBusinessTripItem(tmpProjectCode.id, dayOfMonth);
            if(businessTripItem != null && checked && tmpProjectCode.id != projectCodeId) {
                errors.push('Can not steal business trip from closed project code (' + tmpProjectCode.code + ')');
            }
        }
    }    
    return errors;
}
BusinessTripItemsForm.prototype.businessTripItemClickedHandle = function(event) {
    var id = event.currentTarget.id;
    if(id == null) {
        return;
    }
    var tmp = id.split("_");
    var projectCodeId = parseInt(tmp[tmp.length - 2]);
    var dayOfMonth = parseInt(tmp[tmp.length - 1]);        
    var checked = $('#' + this.htmlId + '_businessTripItem_' + projectCodeId + '_' + dayOfMonth).is(':checked');
    var errors = this.validateBusinessTripItemClick(projectCodeId, dayOfMonth, checked);
    if(errors.length != 0) {
        showErrors(errors);
    } else {
        for(var key in this.timeSpentItemsInfo.projectData.projectCodes) {
            var tmpProjectCode = this.timeSpentItemsInfo.projectData.projectCodes[key];
            if(this.getTimeSpentItem(tmpProjectCode.id, dayOfMonth) != null) {
                var businessTripItem = this.getBusinessTripItem(tmpProjectCode.id, dayOfMonth);
                if(businessTripItem == null && checked && tmpProjectCode.id == projectCodeId) {
                    this.addBusinessTripItem(tmpProjectCode, dayOfMonth);
                } else {
                    this.removeBusinessTripItem(tmpProjectCode, dayOfMonth);
                }
            }
        }
    }

    this.updateBusinessTripItemsView();
    this.dataChanged(true);
}
BusinessTripItemsForm.prototype.addBusinessTripItem = function(projectCode, dayOfMonth) {
    var tmpProjectCode = null;
    for(var key in this.businessTripItemsInfo.projectCodes) {
        if(this.businessTripItemsInfo.projectCodes[key].id == projectCode.id) {
            tmpProjectCode = this.businessTripItemsInfo.projectCodes[key];
            break;
        }
    }
    if(tmpProjectCode == null) {
        tmpProjectCode = {
            id: projectCode.id,
            code: projectCode.code,
            description: projectCode.description,
            businessTripItems: []
        }
        this.businessTripItemsInfo.projectCodes.push(tmpProjectCode);
    }
    tmpProjectCode.businessTripItems.push({
        id: null,
        day: {
            year: this.year,
            month: this.month,
            dayOfMonth: dayOfMonth
        }
    });
}
BusinessTripItemsForm.prototype.removeBusinessTripItem = function(projectCode, dayOfMonth) {
    var tmpProjectCode = null;
    for(var key in this.businessTripItemsInfo.projectCodes) {
        if(this.businessTripItemsInfo.projectCodes[key].id == projectCode.id) {
            tmpProjectCode = this.businessTripItemsInfo.projectCodes[key];
            break;
        }
    }
    if(tmpProjectCode != null) {
        var index = null;
        for(var key in tmpProjectCode.businessTripItems) {
            var businessTripItem = tmpProjectCode.businessTripItems[key];
            if(businessTripItem.day.year == this.year && businessTripItem.day.month == this.month && businessTripItem.day.dayOfMonth == dayOfMonth) {
                break;
            }
            index++;
        }
        tmpProjectCode.businessTripItems.splice(index, 1);
    }    
}
BusinessTripItemsForm.prototype.makeEmptyView = function() {
    var html = '';
    html += '<table id="' + this.htmlId + '" class="timeSheetGrid">';
    html += '<tr class="tsHeader">';
    html += '<td>Project code</td>';
    for(var day = 1; day <= this.days; day++) {
        var clazz = "";
        if(isOfficialFreeday(this.freedays, this.year, this.month, day)) {
            clazz = 'class="holyday"';
        }
        html += '<td ' + clazz + ' title="' + day + '">' + day + '</td>';
    }
    html += '</tr>';
    if(this.timeSpentItemsInfo.projectData.projectCodes.length > 0) {
        for(var key in this.timeSpentItemsInfo.projectData.projectCodes) {
            var projectCode = this.timeSpentItemsInfo.projectData.projectCodes[key];
            if(projectCode.id == 0) {
                continue;
            }
            html += '<tr>';
            html += '<td>' + projectCode.code + '</td>';
            for(var day = 1; day <= this.days; day++) {
                var clazz = "";
                if(isOfficialFreeday(this.freedays, this.year, this.month, day)) {
                    clazz = 'class="holyday"';
                }
                html += '<td ' + clazz + ' title="' + day + '">';
                if(this.getTimeSpentItem(projectCode.id, day) != null) {
                    html += '<input type="checkbox" id="' + this.htmlId + '_businessTripItem_' + projectCode.id + '_' + day + '"' + '>';
                }
                html += '</td>';
            }
            html += '</tr>';
        }
    } else {
        html += '<tr>';
            html += '<td colspan="' + (1 + this.days) + '">No time reported for projects</td>';
        html += '</tr>';    
    }
    html += '</table>';
    html += '<div class="comment1">Business trips can be assigned only to the days with the time that is already reported to some projects</div>';
    html += '<div class="comment1">One project only can be used to set a business trip in a day</div>';
    $('#' + this.containerHtmlId).html(html);
    this.setHandlers();
}

BusinessTripItemsForm.prototype.updateView = function() {
    this.updateBusinessTripItemsView();
}
BusinessTripItemsForm.prototype.updateBusinessTripItemsView = function() {
    for(var key in this.timeSpentItemsInfo.projectData.projectCodes) {
        var projectCode = this.timeSpentItemsInfo.projectData.projectCodes[key];
        for(var dayOfMonth = 1; dayOfMonth <= this.days; dayOfMonth++) {
            if(this.getTimeSpentItem(projectCode.id, dayOfMonth) != null) {
                var businessTripItem = this.getBusinessTripItem(projectCode.id, dayOfMonth);
                var checked = businessTripItem != null;
                var disabled = (projectCode.isClosed || this.isMonthClosed)? true : false;
                $('#' + this.htmlId + '_businessTripItem_' + projectCode.id + '_' + dayOfMonth).attr("checked", checked);
                $('#' + this.htmlId + '_businessTripItem_' + projectCode.id + '_' + dayOfMonth).attr("disabled", disabled);
            }
        }
    }
}

BusinessTripItemsForm.prototype.show = function() {
    this.makeEmptyView();
    this.updateView();
    var form = this;
    var title = "Set business trip items";
        $('#' + this.containerHtmlId).dialog({
        title: title,
        modal: true,
        position: 'center',
        width: 1000,
        height: 400,
        buttons: {
            Ok : function() {
                form.save();
            },
            Cancel : function() {
                $(this).dialog( "close" );
                form.dataChanged(false);
            }
        },
        close: function(event, ui) {
            releasePopupLayer();
            if(form.successHandler != null && form.successContext != null) {
                form.successHandler.call(form.successContext, form.dataUpdated);
            }            
        } 
    }
    );
}
BusinessTripItemsForm.prototype.validate = function() {
    var errors = [];
    if(this.isMonthClosed) {
        errors.push("This month is closed");
    }
    return errors;
}
BusinessTripItemsForm.prototype.save = function() {
    var errors = this.validate();
    if(errors.length > 0) {
        showErrors(errors);
        return;
    }
    var businessTripItemsForm = {
        "items" : this.getBusinessTripItems(),
        "year" : this.year,
        "month" : this.month
    };
    
    var data = {};
    data.command = "saveBusinessTripItemsForm";
    data.businessTripItemsForm = getJSON(businessTripItemsForm);
    var form = this;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "post",
        success: function(data){
            ajaxResultHandle(data, form, function(result) {
                //doAlert("Info", "Time spent info has been successfully saved", form, form.afterSave);
                form.dataChanged(false);
                form.dataUpdated = true;
                $.sticky('Business trip info has been successfully saved');
                form.afterSave();
            })
        },
        error: function(jqXHR, textStatus, errorThrown) {
            ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
        }
    });
}
BusinessTripItemsForm.prototype.afterSave = function() {
    $('#' + this.containerHtmlId).dialog("close");
}

BusinessTripItemsForm.prototype.getBusinessTripItem = function(projectCodeId, dayOfMonth) {
    for(var key in this.businessTripItemsInfo.projectCodes) {
        var projectCode = this.businessTripItemsInfo.projectCodes[key];
        if(projectCode.id != projectCodeId) {
            continue;
        }
        for(var key2 in projectCode.businessTripItems) {
            var businessTripItem = projectCode.businessTripItems[key2];
            if(businessTripItem.day.year == this.year && businessTripItem.day.month == this.month && businessTripItem.day.dayOfMonth == dayOfMonth) {
                return businessTripItem;
            }
        }
    }
    return null;
}
BusinessTripItemsForm.prototype.getBusinessTripItems = function() {
    var businessTripItems = [];
    for(var key in this.businessTripItemsInfo.projectCodes) {
        var projectCode = this.businessTripItemsInfo.projectCodes[key];
        for(var key2 in projectCode.businessTripItems) {
            var businessTripItem = projectCode.businessTripItems[key2];
            businessTripItems.push({
                projectCodeId: projectCode.id,
                dayOfMonth: businessTripItem.day.dayOfMonth
            });
        }
    }
    return businessTripItems;
}
BusinessTripItemsForm.prototype.getTimeSpentItem = function(projectCodeId, dayOfMonth) {
    for(var key in this.timeSpentItemsInfo.projectData.projectCodes) {
        var projectCode = this.timeSpentItemsInfo.projectData.projectCodes[key];
        if(projectCode.id != projectCodeId) {
            continue;
        }
        for(var key2 in projectCode.taskTypes) {
            var taskType = projectCode.taskTypes[key2];
            for(var key3 in taskType.tasks) {
                var task = taskType.tasks[key3];
                for(var key4 in task.timeSpentItems) {
                    var timeSpentItem = task.timeSpentItems[key4];
                    if(timeSpentItem.day.year == this.year && timeSpentItem.day.month == this.month && timeSpentItem.day.dayOfMonth == dayOfMonth) {
                       return timeSpentItem;
                    }
                }    
            }
        }
    }
    return null;
}
BusinessTripItemsForm.prototype.dataChanged = function(value) {
    dataChanged = value;
}