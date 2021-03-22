/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
function EmployeeInSubdepartmentPicker(options) {
    //{
    //    htmlId
    //    okHandler
    //    okHandlerContext
    //    moduleName
    //    subdepartmentId
    //    startDate
    //    endDate
    //}
    this.config = {
        endpointUrl: endpointsFolder + "EmployeeInSubdepartmentPicker.jsp"
    }
    this.htmlId = options.htmlId;
    this.containerHtmlId = null;
    this.okHandler = options.okHandler;
    this.okHandlerContext = options.okHandlerContext;
    this.moduleName = options.moduleName;
    this.subdepartmentId = options.subdepartmentId;
    this.startDate = options.startDate;
    this.endDate = options.endDate;
    this.loaded = {
        "office": null,
        "department": null,
        "subdepartment": null,
        "positions": [],
        "employees": []
    }
    this.data = {
        employeeFilter: ''
    }    
    this.selected = {
        "positionId": null,
        "employeeId": null
    }
}
EmployeeInSubdepartmentPicker.prototype.init = function() {
    this.containerHtmlId = getNextPopupHtmlContainer();
    this.loadInitialContent();
}
EmployeeInSubdepartmentPicker.prototype.loadInitialContent = function() {
    var form = this;
    var data = {};
    data.command = "getInitialContent";
    data.moduleName = this.moduleName;
    data.subdepartmentId = this.subdepartmentId;
    data.startDate = getJSON(this.startDate);
    data.endDate = getJSON(this.endDate);
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      type: "POST",
      cache: false,
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.office = result.office;
            form.loaded.department = result.department;
            form.loaded.subdepartment = result.subdepartment;
            form.loaded.positions = result.positions;
            form.loaded.employees = result.employees;
            form.selected.positionId = null;
            form.selected.employeeId = null;
            form.show();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
EmployeeInSubdepartmentPicker.prototype.loadPositionContent = function() {
    var form = this;
    var data = {};
    data.command = "getPositionContent";
    data.positionId = this.selected.positionId;
    data.startDate = getJSON(this.startDate);
    data.endDate = getJSON(this.endDate);    
    data.moduleName = this.moduleName;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: 'POST',
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.employees = result.employees;
            form.selected.employeeId = null;
            form.updateView();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}

EmployeeInSubdepartmentPicker.prototype.getHtml = function() {
    var html = '';
    html += '<div class="label1" id="' + this.htmlId + '_subdepartment' + '"></div>';
    html += '<table>';
    html += '<tr>';
    html += '<td><span class="label1">Position</span></td><td><select id="' + this.htmlId + '_position"></select></td>';
    html += '</tr>';
    html += '</table>';
    html += '<table>';
    html += '<tr><td><span class="label1">Employee</span></td></tr>';
    html += '<tr><td><span class="label1">Filter</span> <input type="text" id="' + this.htmlId + '_employeeFilter"><br /><select id="' + this.htmlId + '_employee" size="12" style="width: 400px;"></select></td></tr>';
    html += '</table>';
    return html;
}
EmployeeInSubdepartmentPicker.prototype.updateView = function() {
    this.updateSubdepartmentView();
    this.updatePositionView();
    this.updateEmployeeFilterView();
    this.updateEmployeeView();
}
EmployeeInSubdepartmentPicker.prototype.updateSubdepartmentView = function() {
    var html = '';
    html += this.loaded.office.name + ' / ' + this.loaded.department.name + ' / ' + this.loaded.subdepartment.name + ' / ';
    html += getStringFromRange(this.startDate, this.endDate);
    $('#' + this.htmlId + '_subdepartment').html(html);
}
EmployeeInSubdepartmentPicker.prototype.updatePositionView = function() {
    var html = '';
    html += '<option value="ALL">ALL</option>';
    for(var key in this.loaded.positions) {
        var position = this.loaded.positions[key];
        var isSelected = "";
        if(position.id == this.selected.positionId) {
           isSelected = "selected";
        }
        html += '<option value="' + position.id + '" ' + isSelected + '>' + position.name + '</option>';
    }
    $('#' + this.htmlId + '_position').html(html);
}
EmployeeInSubdepartmentPicker.prototype.updateEmployeeFilterView = function() {
    $('#' + this.htmlId + '_employeeFilter').val(this.data.employeeFilter);
}

EmployeeInSubdepartmentPicker.prototype.updateEmployeeView = function() {
    var html = '';
    var filter = null;
    if(this.data.employeeFilter != null && this.data.employeeFilter != '') {
        filter = this.data.employeeFilter.toLowerCase();
    }
    for(var key in this.loaded.employees) {
        var employee = this.loaded.employees[key];
        var found = true;
        if(filter != null) {
            found = false;
            if(employee.firstName.toLowerCase().indexOf(filter) != -1 ) {
                found = true;
            } else if(employee.lastName.toLowerCase().indexOf(filter) != -1 ) {
                found = true;
            } else if(employee.userName.toLowerCase().indexOf(filter) != -1 ) {
                found = true;
            } else if(employee.firstNameLocalLanguage != null && employee.firstNameLocalLanguage.toLowerCase().indexOf(filter) != -1 ) {
                found = true;
            } else if(employee.lastNameLocalLanguage != null && employee.lastNameLocalLanguage.toLowerCase().indexOf(filter) != -1 ) {
                found = true;
            }
        }
        if(! found) {
            continue;
        }        
        var isSelected = "";
        if(employee.id == this.selected.employeeId) {
           isSelected = "selected";
        }
        html += '<option value="' + employee.id + '" ' + isSelected + '>' + employee.firstName + ' ' + employee.lastName + '</option>';
    }
    $('#' + this.htmlId + '_employee').html(html);
}
EmployeeInSubdepartmentPicker.prototype.setHandlers = function() {
    var form = this;
    $('#' + this.htmlId + '_position').bind("change", function(event) {form.positionChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_employeeFilter').bind("keyup", function(event) {form.employeeFilterChangedHandle.call(form, event);});
    $('#' + this.htmlId + '_employee').bind("change", function(event) {form.employeeChangedHandle.call(form, event);});
}
EmployeeInSubdepartmentPicker.prototype.positionChangedHandle = function(event) {
    var idTxt = $('#' + this.htmlId + '_position').val();
    if(idTxt == 'ALL') {
        this.selected.positionId = null;
    } else {
        this.selected.positionId = parseInt(idTxt);
    }
    if(this.selected.positionId == null) {
        this.loadInitialContent();
    } else {
        this.loadPositionContent();
    }
}
EmployeeInSubdepartmentPicker.prototype.employeeFilterChangedHandle = function(event) {
    var value = $('#' + this.htmlId + '_employeeFilter').val();
    value = $.trim(value);
    if(value != this.data.employeeFilter) {
        this.data.employeeFilter = value;
        this.selected.employeeId = null;
        this.updateEmployeeView();
    }
    this.updateEmployeeFilterView();
}
EmployeeInSubdepartmentPicker.prototype.employeeChangedHandle = function(event) {
    var htmlId = $('#' + this.htmlId + '_employee').val();
    if(htmlId == null || htmlId == '') {
        this.selected.employeeId = null;
    } else {
        this.selected.employeeId = parseInt(htmlId);
    }
}
EmployeeInSubdepartmentPicker.prototype.show = function() {
    var title = 'Pick Employee'
    var form = this;
    $("#" + this.containerHtmlId).html(this.getHtml());
    this.setHandlers();
    $("#" + this.containerHtmlId).dialog({
        title: title,
        modal: true,
        position: 'center',
        width: 500,
        height: 400,
        buttons: {
            Ok: function() {
                $(this).dialog( "close" );
                form.okClickHandle();
            },
            Cancel: function() {
                $(this).dialog( "close" );
            }
	},
        close: function(event, ui) {
            releasePopupLayer();
        } 
    });
    this.updateView();
}
EmployeeInSubdepartmentPicker.prototype.okClickHandle = function() {
    var employee = null;
    if(this.selected.employeeId != null) {
        for(var key in this.loaded.employees) {
            if(this.loaded.employees[key].id == this.selected.employeeId) {
                employee = this.loaded.employees[key];
            }
        }
    }
    this.okHandler.call(this.okHandlerContext, employee);
}