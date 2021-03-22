/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
function NotificationManagement(htmlId, containerHtmlId) {
   this.config = {
        endpointUrl: endpointsFolder + "NotificationManagement.jsp"
   };
   this.htmlId = htmlId;
   this.containerHtmlId = containerHtmlId;
   this.moduleName = "Admin";
   this.popupContainerId = "notificationManagement_popup";
   this.loaded = {
       "notificationItems": [],
       "employees": []
   }
   this.events = [
        "EMPLOYEE_CREATED",
        "EMPLOYEE_UPDATED",
        "EMPLOYEE_DELETED"
   ]
}
NotificationManagement.prototype.init = function() {
    this.makeLayout();
    this.setHandlers();
    this.loadInitialContent();
}
NotificationManagement.prototype.loadInitialContent = function() {
   var form = this;
    var data = {};
    data.command = "getInitialContent";
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      type: "POST",
      cache: false,
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.notificationItems = result.notificationItems;
            form.loaded.employees = result.employees;
            form.updateView();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
NotificationManagement.prototype.makeLayout = function() {
  var html = '';
  html += '<table>';
  html += '<tr><td id="' + this.htmlId + '_notificationItems"></td></tr>';
  html += '</table>';
  html += '<input type="button" id="' + this.htmlId + '_saveBtn" value="Save">';
  html += '<div id="' + this.htmlId + '_popup"></div>';
  $('#' + this.containerHtmlId).html(html);
}
NotificationManagement.prototype.updateView = function() {
    this.updateNotificationItemsView();
}
NotificationManagement.prototype.setHandlers = function() {
    var form = this;
    $('#' + this.htmlId + '_saveBtn').bind('click', function(event) {form.save.call(form, event)});
}
NotificationManagement.prototype.updateNotificationItemsView = function() {
    var html = '';
    html += '<table class="datagrid">';
    html += '<tr class="dgHeader">';
    html += '<td>Employee</td>';
    for(var key in this.events) {
        var event = this.events[key];
         html += '<td>' + event + '</td>';
    }
    html += '</tr>';
    if(this.loaded.employees.length > 0) {
        for(var employeeKey in this.loaded.employees) {
            var employee = this.loaded.employees[employeeKey];
            html += '<tr><td>' + employee.userName + '</td>';
            for(var eventKey in this.events) {
                var event = this.events[eventKey];
                 html += '<td><input type="checkbox" id="' + this.htmlId + '_notificationItem_' +  employee.id + '_' + eventKey + '"></td>';
            }
            html += '</tr>';
        }
    } else {
        html += '<tr><td colspan="' + (this.events.length + 2) + '">No data</td></tr>';
    }
    html += '<tr><td colspan="' + (this.events.length + 2) + '"><span class="link" id="' + this.htmlId + '_pickEmployee">Add employee</span></td></tr>';
    html += '</table>';
    $('#' + this.htmlId + '_notificationItems').html(html);
    var form = this;
    $('#' + this.htmlId + '_pickEmployee').bind("click", function(event) {form.openEmployeePicker.call(form, event);});
    $('input[id^="' + this.htmlId + '_notificationItem_"]').bind('click', function(event) {form.notificationItemClickHandler.call(form, event)});
    
    for(var employeeKey in this.loaded.employees) {
        var employee = this.loaded.employees[employeeKey];
        for(var eventKey in this.events) {
            var event = this.events[eventKey];
            var index = this.getNotificationItemIndexByEmployeeIdAndEvent(employee.id, event);
            var checked = true;
            if(index == null) {
                checked = false;
            }
            $('#' + this.htmlId + '_notificationItem_' +  employee.id + '_' + eventKey).attr("checked", checked);
        }
    }
}

NotificationManagement.prototype.openEmployeePicker = function(event) {
    var employeePicker = new EmployeePicker("employeePicker", this.pickEmployee, this, "Admin");
    employeePicker.init();
}
NotificationManagement.prototype.pickEmployee = function(employee) {
    for(var key in this.loaded.employees) {
        var employeeTmp = this.loaded.employees[key];
        if(employeeTmp.id == employee.id) {
            return;
        }
    }
    this.loaded.employees.push(employee);
    this.updateView();
}

NotificationManagement.prototype.notificationItemClickHandler = function(event) {
    var htmlId=event.currentTarget.id;
    var tmp = htmlId.split("_");
    var employeeId = parseInt(tmp[tmp.length - 2]);
    var eventIndex = parseInt(tmp[tmp.length - 1]);
    var event =  this.events[eventIndex];
    var index = this.getNotificationItemIndexByEmployeeIdAndEvent(employeeId, event);
    if(index == null) {
        this.loaded.notificationItems.push({
            "id": null,
            "employeeId": employeeId,
            "event": event
        });
    } else {
        this.loaded.notificationItems.splice(index, 1);
    }
    this.dataChanged(true);
}
NotificationManagement.prototype.getNotificationItemIndexByEmployeeIdAndEvent = function(employeeId, event) {
    for(var key in this.loaded.notificationItems) {
        var notificationItem = this.loaded.notificationItems[key];
        if(notificationItem.employeeId == employeeId && notificationItem.event == event) {
            return key;
        }
    }
    return null;
}
NotificationManagement.prototype.validate = function() {
    var errors = [];
    return errors;
}
NotificationManagement.prototype.save = function() {
    var errors = this.validate();
    if(errors.length > 0) {
        showErrors(errors);
        return;
    }
    var form = this;
    var data = {};
    data.command = "saveNotificationItems";
    data.notificationItemsForm = getJSON({
        "items": this.loaded.notificationItems
    })
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            doAlert("Info", "Notification items have been successfully saved", form, form.afterSave);
            form.dataChanged(false);
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
NotificationManagement.prototype.afterSave = function() {
    this.init();
}
NotificationManagement.prototype.dataChanged = function(value) {
    dataChanged = value;
}
