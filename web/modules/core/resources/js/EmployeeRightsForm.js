/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

function EmployeeRightsForm(employee, htmlId, successHandler, successContext) {
    this.htmlId = htmlId;
    this.containerHtmlId = null;
    this.config = {
        endpointUrl: endpointsFolder + "EmployeeRightsForm.jsp"
    };
    this.loaded = {
        "modules" : [],
        "rightsItems" : [],
        "subdepartments" : []
    };
    this.selected = {
        "tabsIndex": 0,
        "moduleIds": []
    };
    this.employee = employee;
    this.data = {
        "employeeId": employee.id,
        "rightsItems": []
    }
}
EmployeeRightsForm.prototype.init = function() {
    this.containerHtmlId = getNextPopupHtmlContainer();
    this.loadInitialContent();
    this.dataChanged(false);
}
EmployeeRightsForm.prototype.loadInitialContent = function() {
    var form = this;
    var data = {};
    data.command = "getInitialContent";
    data.employeeId = this.data.employeeId;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: 'POST',
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.modules = result.modules;
            form.loaded.rightsItems = result.rightsItems;
            form.loaded.subdepartments = result.subdepartments;
            form.data.rightsItems = form.loaded.rightsItems;
            form.show();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
EmployeeRightsForm.prototype.show = function() {
    this.updateHtml();
    var form = this;
    var title = "Rights";
    $('#' + this.containerHtmlId).dialog({
        title: title,
        modal: true,
        position: 'center',
        width: 900,
        height: 500,
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
    }
    );
}
EmployeeRightsForm.prototype.setHandlers = function() {
    var form = this;
    $('input[id^="' + this.htmlId +'_rightsItem_"]').bind("click", function(event) {form.rightsItemClickedHandle.call(form, event)});
}
EmployeeRightsForm.prototype.getHtml = function() {
    var html = '';
    html +=  '<span class="label1">' + this.employee.firstName + ' ' + this.employee.lastName + ' (' + this.employee.userName + ')' + '</span>';
    html += '<div id="' + this.htmlId +'_tabs">';
    html += '<ul>';
    html += '<li><a href="#' + this.htmlId + '_tabs_1">Module Rights</a></li>';
    html += '<li><a href="#' + this.htmlId + '_tabs_2">Reports Rights</a></li>';
    html += '</ul>';
    html += '<div id="' + this.htmlId +'_tabs_1">';
    html += this.getHtmlForRights(false);
    html += '</div>';
    html += '<div id="' + this.htmlId +'_tabs_2">';
    html += this.getHtmlForRights(true);
    html += '</div>';
    html += '</div>';

    return html;
}
EmployeeRightsForm.prototype.getHtmlForRights= function(isReport) {
    var html = '';
    html += '<table class="datagrid">';
    html += '<tr class="dgHeader">';
    html += '<td></td>';
    html += '<td></td>';
    html += '<td></td>';
    for(var key in this.loaded.modules) {
        var module = this.loaded.modules[key];
        if(module.isReport != isReport) {
            continue;
        }
        html += '<td>' + module.name + '</td>'
    }
    html += '</tr>';

    html += '<tr class="dgHeader">';
    html += '<td>Office</td>';
    html += '<td>Department</td>';
    html += '<td>Subdepartment</td>';
    for(var key in this.loaded.modules) {
        var module = this.loaded.modules[key];
        if(module.isReport != isReport) {
            continue;
        }
        html += '<td></td>'
    }
    html += '</tr>';

    for(var key in this.loaded.subdepartments) {
        var subdepartment = this.loaded.subdepartments[key];
        html += '<tr>';
        html += '<td>' + subdepartment.officeName + '</td>';
        html += '<td>' + subdepartment.departmentName + '</td>';
        html += '<td>' + subdepartment.name + '</td>';
        for(var key in this.loaded.modules) {
            var module = this.loaded.modules[key];
            if(module.isReport != isReport) {
                continue;
            }
            if(this.getRightsItem(subdepartment.id, module.id, this.data.employeeId) == null) {
                html += '<td><input type="checkbox" id="' + this.htmlId +'_rightsItem_' + subdepartment.id + '_' + module.id +  '"></td>';
            } else {
                html += '<td><input type="checkbox" id="' + this.htmlId +'_rightsItem_' + subdepartment.id + '_' + module.id +  '" checked></td>';
            }
        }
        html += '</tr>';
    }
    html += '</table>';
    return html;
}

EmployeeRightsForm.prototype.updateHtml= function() {
    $('#' + this.containerHtmlId).html(this.getHtml());
    this.makeTabs();
    this.updateView();
    this.setHandlers();
}
EmployeeRightsForm.prototype.makeTabs = function() {
    var form = this;
    $( '#' + this.htmlId + '_tabs' ).tabs({
        select: function(event, ui) {form.isReportChanged.call(form, event, ui)}
    });
}
EmployeeRightsForm.prototype.updateView = function() {
    this.updateTabsView();
}
EmployeeRightsForm.prototype.updateTabsView = function() {
    $( '#' + this.htmlId + '_tabs' ).tabs( "option", "active", this.selected.tabsIndex);
}
EmployeeRightsForm.prototype.isReportChanged = function(event, ui){
    this.selected.tabsIndex = ui.index;
}
EmployeeRightsForm.prototype.getRightsItem = function(subdepartmentId, moduleId, employeeId) {
    for(var key in this.data.rightsItems) {
        var rightsItem = this.data.rightsItems[key];
        if(rightsItem.subdepartmentId == subdepartmentId && rightsItem.moduleId == moduleId && rightsItem.employeeId == employeeId) {
            return rightsItem;
        }
    }
    return null;
}

EmployeeRightsForm.prototype.rightsItemClickedHandle = function(event) {
    var htmlId = event.currentTarget.id;
    var tmp = htmlId.split("_");
    var subdepartmentId = parseInt(tmp[tmp.length - 2]);
    var moduleId = parseInt(tmp[tmp.length - 1]);
    if($(event.currentTarget).is(':checked')) {
        if(this.getRightsItem(subdepartmentId, moduleId, this.data.employeeId) == null) {
            this.data.rightsItems.push({
             "id": null,
             "subdepartmentId": subdepartmentId,
             "moduleId": moduleId,
             "employeeId": this.data.employeeId
            });
        }
    } else {
        for(var key in this.data.rightsItems) {
            var rightsItem = this.data.rightsItems[key];
            if(rightsItem.subdepartmentId == subdepartmentId && rightsItem.moduleId == moduleId && rightsItem.employeeId == this.data.employeeId) {
                this.data.rightsItems.splice(key, 1);
                break;
            }
        }
    }
    //this.updateHtml();
    this.dataChanged(true);
}
EmployeeRightsForm.prototype.validate = function() {
    var errors = [];
    return errors;
}
EmployeeRightsForm.prototype.save = function() {
    var errors = this.validate();
    if(errors.length > 0) {
        var message = "";
        for(var key in errors) {
            message += errors[key] + "<br />";
        }
        doAlert("Validation error", message, null, null);
        return;
    }
    var form = this;
    var data = {};
    data.command = "saveRights";
    data.employeeRightsForm = getJSON(this.data);
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            doAlert("Info", "The Rights info has been successfully saved.", form, form.afterSave);
            form.dataChanged(false);
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
EmployeeRightsForm.prototype.afterSave = function() {
    $('#' + this.containerHtmlId).dialog("close");
    if(this.successHandler != null && this.successContext != null) {
        this.successHandler.call(this.successContext);
    }
}

EmployeeRightsForm.prototype.dataChanged = function(value) {
    dataChanged = value;
}