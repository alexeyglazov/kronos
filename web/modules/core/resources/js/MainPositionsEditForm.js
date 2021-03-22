/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
function MainPositionsEditForm(employeeId, htmlId, containerHtmlId, successHandler, successContext) {
    this.config = {
        endpointUrl: endpointsFolder + "MainPositionsEditForm.jsp"
    };
    this.employeeId = employeeId;
    this.htmlId = htmlId;
    this.containerHtmlId = containerHtmlId;
    this.successHandler = successHandler;
    this.successContext = successContext;
    this.loaded = {
        "subdepartments" : [],
        "positions": [],
        "employeePositionHistoryItems": []
    }
    this.data = {
        "employeeId" : this.employeeId,
        "mainEmployeePositionHistoryItemIds": []
    }
}
MainPositionsEditForm.prototype.init = function() {
    this.loadAll();
    this.dataChanged(false);
}
MainPositionsEditForm.prototype.loadAll = function() {
    var form = this;
    var data = {};
    data.command = "getSubdepartmentsPositionsEmployeePositionHistoryItems";
    data.employeeId = this.employeeId;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: 'POST',
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.subdepartments = result.subdepartments;
            form.loaded.positions = result.positions;
            form.loaded.employeePositionHistoryItems = result.employeePositionHistoryItems;
            for(var key in form.loaded.employeePositionHistoryItems) {
                var employeePositionHistoryItem = form.loaded.employeePositionHistoryItems[key];
                if(employeePositionHistoryItem.isMain) {
                    form.data.mainEmployeePositionHistoryItemIds.push(employeePositionHistoryItem.id);
                }
            }
            form.show();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
MainPositionsEditForm.prototype.getHtml = function() {
    var html = '';
    html += '<table class="datagrid">';
    html += '<tr class="dgHeader"><td>Subdepartment</td><td>Position</td><td>Main</td></tr>';
    for(var key1 in this.loaded.employeePositionHistoryItems) {
        var employeePositionHistoryItem = this.loaded.employeePositionHistoryItems[key1];
        var position = null;
        var subdepartment = null;
        for(var key2 in this.loaded.positions) {
            var positionTmp = this.loaded.positions[key2];
            if(positionTmp.id == employeePositionHistoryItem.positionId) {
                position = positionTmp;
                break;
            }
        }
        for(var key3 in this.loaded.subdepartments) {
            var subdepartmentTmp = this.loaded.subdepartments[key3];
            if(subdepartmentTmp.id == position.subdepartmentId) {
                subdepartment = subdepartmentTmp;
                break;
            }
        }
        html += '<tr><td>' + subdepartment.name + '</td><td>' + position.name + '</td><td><input type="checkbox" id="' + this.htmlId + '_employeePositionHistoryItem_' + employeePositionHistoryItem.id + '"></td></tr>';
    }
    html += '</table>';
    return html;
}
MainPositionsEditForm.prototype.show = function() {
    var form = this;
    $('#' + this.containerHtmlId).html(this.getHtml());
    this.setHandlers();
    $('#' + this.containerHtmlId).dialog({
        title: "Set main subdepartments",
        modal: true,
        position: 'center',
        width: 500,
        height: 300,
        buttons: {
            Ok: function() {
                form.save();
            },
            Cancel: function() {
                $(this).dialog( "close" );
                form.dataChanged(false);
            }
	}
    });
    this.updateView();
}
MainPositionsEditForm.prototype.updateView = function() {
    this.updateMainPositionsView();
}
MainPositionsEditForm.prototype.updateMainPositionsView = function() {
    for(var key in this.loaded.employeePositionHistoryItems) {
        var employeePositionHistoryItem = this.loaded.employeePositionHistoryItems[key];
        if(jQuery.inArray(employeePositionHistoryItem.id, this.data.mainEmployeePositionHistoryItemIds) == -1) {
            $('#' + this.htmlId + '_employeePositionHistoryItem_'+ employeePositionHistoryItem.id).attr("checked", false);
        } else {
            $('#' + this.htmlId + '_employeePositionHistoryItem_'+ employeePositionHistoryItem.id).attr("checked", true);
        }
    }
}
MainPositionsEditForm.prototype.setHandlers = function() {
    var form = this;
    $('input[id^="' + this.htmlId + '_employeePositionHistoryItem_"]').bind("click", function(event) {form.mainPositionClickedHandle(event);});
}

MainPositionsEditForm.prototype.mainPositionClickedHandle = function(event) {
    var htmlId=event.currentTarget.id;
    var tmp = htmlId.split("_");
    var employeePositionHistoryItemId = parseInt(tmp[tmp.length - 1]);
    var index = jQuery.inArray(employeePositionHistoryItemId, this.data.mainEmployeePositionHistoryItemIds);
    if($('#' + this.htmlId + '_employeePositionHistoryItem_'+ employeePositionHistoryItemId).is(':checked')) {
        if(index == -1) {
            this.data.mainEmployeePositionHistoryItemIds.push(employeePositionHistoryItemId);
        }
    } else {
        if(index != -1) {
            this.data.mainEmployeePositionHistoryItemIds.splice(index, 1);
        }
    }
    this.updateMainPositionsView();
    this.dataChanged(true);
}


MainPositionsEditForm.prototype.validate = function() {
    var errors = [];
    if(this.data.mainEmployeePositionHistoryItemIds.length == 0 ) {
        errors.push("Employee must have at least one main subdepartment");
    }
    return errors;
}
MainPositionsEditForm.prototype.save = function() {
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
    data.command = "setMainPositions";
    data.mainPositionsEditForm = getJSON(this.data);
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            doAlert("Info", "Main Positions has been successfully set to this employee", form, form.afterSave);
            form.dataChanged(false);
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
MainPositionsEditForm.prototype.afterSave = function() {
    $('#' + this.containerHtmlId).dialog("close");
    this.successHandler.call(this.successContext);
}
MainPositionsEditForm.prototype.dataChanged = function(value) {
    dataChanged = value;
}