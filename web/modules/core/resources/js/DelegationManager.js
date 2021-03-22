/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
function DelegationManager(htmlId, containerHtmlId) {
   this.config = {
        endpointUrl: endpointsFolder + "DelegationManager.jsp"
   };
   this.htmlId = htmlId;
   this.containerHtmlId = containerHtmlId;
   this.loaded = {
       "subdepartmentOffices": [],
       "subdepartmentDepartments": [],
       "subdepartments": [],
       "employeeOffices": [],
       "employeeDepartments": [],
       "employeeSubdepartments": [],
       "employees": [],
       "employeeSubdepartmentHistoryItemWithEmployeeAndSubdepartmentInfo": []
   }
   this.selected = {
       subdepartmentOfficeId: null,
       subdepartmentDepartmentId: null,
       subdepartmentId: null,
       employeeOfficeId: null,
       employeeDepartmentId: null,
       employeeSubdepartmentId: null
   }
   this.data = {
       startDate: null,
       endDate: null,
       subdepartmentOfficeId: null,
       subdepartmentDepartmentId: null,
       subdepartmentId: null,
       employeeOfficeId: null,
       employeeDepartmentId: null,
       employeeSubdepartmentId: null,
       employeeId: null
   }
}
DelegationManager.prototype.init = function() {
    var now = new Date();
    this.loadInitialContent();
}
DelegationManager.prototype.loadInitialContent = function() {
    var form = this; 
    var data = {};
    data.command = "getInitialContent";
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.subdepartmentOffices = result.subdepartmentOffices;
            form.loaded.employeeOffices = result.employeeOffices;
            form.show();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
DelegationManager.prototype.loadSubdepartmentOfficeContent = function() {
    var form = this;
    var data = {};
    data.command = "getSubdepartmentOfficeContent";
    data.subdepartmentOfficeId = this.selected.subdepartmentOfficeId;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.subdepartmentDepartments = result.subdepartmentDepartments;
            form.loaded.subdepartments = [];
            form.selected.subdepartmentDepartmentId = null;
            form.selected.subdepartmentId = null;          
            form.updateSubdepartmentDepartmentView();
            form.updateSubdepartmentView();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
DelegationManager.prototype.loadSubdepartmentDepartmentContent = function() {
    var form = this;
    var data = {};
    data.command = "getSubdepartmentDepartmentContent";
    data.subdepartmentDepartmentId = this.selected.subdepartmentDepartmentId;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.subdepartments = result.subdepartments;
            form.selected.subdepartmentId = null;             
            form.updateSubdepartmentView();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
DelegationManager.prototype.loadEmployeeOfficeContent = function() {
    var form = this;
    var data = {};
    data.command = "getEmployeeOfficeContent";
    data.employeeOfficeId = this.selected.employeeOfficeId;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.employeeDepartments = result.employeeDepartments;
            form.loaded.employeeSubdepartments = [];
            form.loaded.employees = [];
            form.selected.employeeDepartmentId = null;
            form.selected.employeeSubdepartmentId = null;
            form.selected.employeeId = null;
            form.updateEmployeeDepartmentView();
            form.updateEmployeeSubdepartmentView();
            form.updateEmployeeView();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });  
}
DelegationManager.prototype.loadEmployeeDepartmentContent = function() {
    var form = this;
    var data = {};
    data.command = "getEmployeeDepartmentContent";
    data.employeeDepartmentId = this.selected.employeeDepartmentId;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.employeeSubdepartments = result.employeeSubdepartments;
            form.loaded.employees = [];
            form.selected.employeeSubdepartmentId = null;
            form.selected.employeeId = null;
            form.updateEmployeeSubdepartmentView();
            form.updateEmployeeView();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });    
}
DelegationManager.prototype.loadEmployeeSubdepartmentContent = function() {
    var form = this;
    var data = {};
    data.command = "getEmployeeSubdepartmentContent";
    data.employeeSubdepartmentId = this.selected.employeeSubdepartmentId;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      cache: false,
      type: "POST",
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.employees = result.employees;
            form.selected.employeeId = null;
            form.updateEmployeeView();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });      
}
DelegationManager.prototype.loadEmployeeSubdepartmentHistoryItemWithEmployeeAndSubdepartmentInfo = function() {
    var serverFormatData = {
        "subdepartmentOfficeId" : this.selected.subdepartmentOfficeId,
        "subdepartmentDepartmentId" : this.selected.subdepartmentDepartmentId,
        "subdepartmentId" : this.selected.subdepartmentId,
        "employeeOfficeId" : this.selected.employeeOfficeId,
        "employeeDepartmentId" : this.selected.employeeDepartmentId,
        "employeeSubdepartmentId" : this.selected.employeeSubdepartmentId,
        "employeeId" : this.selected.employeeId,
        "startDate": getYearMonthDateFromDateString(this.data.startDate),
        "endDate": getYearMonthDateFromDateString(this.data.endDate)
    };
    var form = this;
    var data = {};
    data.command = "getEmployeeSubdepartmentHistoryItemWithEmployeeAndSubdepartmentInfo";
    data.delegationManagerFilterForm = getJSON(serverFormatData);
    $.ajax({
        url: this.config.endpointUrl,
        data: data,
        cache: false,
        type: "POST",
        success: function(data){
            ajaxResultHandle(data, form, function(result) {
                form.loaded.employeeSubdepartmentHistoryItemWithEmployeeAndSubdepartmentInfo = result.employeeSubdepartmentHistoryItemWithEmployeeAndSubdepartmentInfo;
                form.updateEmployeeSubdepartmentHistoryItemWithEmployeeAndSubdepartmentInfoView();
            })
        },
        error: function(jqXHR, textStatus, errorThrown) {
            ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
        }
    });
}
DelegationManager.prototype.show = function() {
    $('#' + this.containerHtmlId).html(this.getHtml());
    $( '#' + this.htmlId + '_accordion').accordion();
    this.makeDatePickers();
    this.makeButtons();
    this.updateView();
    this.setHandlers();
}
DelegationManager.prototype.getHtml = function() {
    var html = '';
    html += '<div id="' + this.htmlId + '_accordion">';
    
    html += '<h3>Employee</h3>';
    html += '<div>';
    html += '<table>';
    html += '<tr>';
    html += '<td><span class="label1">Office</span></td>';
    html += '<td><span class="label1">Department</span></td>';
    html += '<td><span class="label1">Subdepartment</span></td>';
    html += '<td><span class="label1">Employee</span></td>';
    html += '</tr>';
    html += '<tr>';
    html += '<td><select id="' + this.htmlId + '_employeeOffice' + '"></select></td>';
    html += '<td><select id="' + this.htmlId + '_employeeDepartment' + '"></select></td>';
    html += '<td><select id="' + this.htmlId + '_employeeSubdepartment' + '"></select></td>';
    html += '<td><select id="' + this.htmlId + '_employee' + '"></select></td>';
    html += '</tr>';
    html += '</table>';
    html += '<span class="comment1">Select employee (subdepartment, department, office) to restrict the list of displayed access items. Access items to these employees will be displayed. All filter fields are not mandatory.</span>';
    html += '</div>';
    
    html += '<h3>Subdepartment</h3>';
    html += '<div>';
    html += '<table>';
    html += '<tr>';
    html += '<td><span class="label1">Office</span></td>';
    html += '<td><span class="label1">Department</span></td>';
    html += '<td><span class="label1">Subdepartment</span></td>';
    html += '</tr>';
    html += '<tr>';
    html += '<td><select id="' + this.htmlId + '_subdepartmentOffice' + '"></select></td>';
    html += '<td><select id="' + this.htmlId + '_subdepartmentDepartment' + '"></select></td>';
    html += '<td><select id="' + this.htmlId + '_subdepartment' + '"></select></td>';
    html += '</tr>';
    html += '</table>';
    html += '<span class="comment1">Select subdepartment (department, office) to restrict the list of displayed access items. Access items on these subdepartments will be displayed. All filter fields are not mandatory.</span>';
    html += '</div>';
       
    html += '<h3>Period</h3>';
    html += '<div>';
    html += '<table>';
    html += '<tr><td><span class="label1">From</span></td><td><span class="label1">To</span></td></tr>';
    html += '<tr><td><input type="text" id="' + this.htmlId + '_startDate' + '"></td><td><input type="text" id="' + this.htmlId + '_endDate' + '"></td></tr>';
    html += '</table>';
    html += '<span class="comment1">Select dates to restrict the list of displayed access items. Access items connected to this period will be displayed. All filter fields are not mandatory.</span>';
    html += '</div>';
    
    html += '</div>';
    html += '<button id="' + this.htmlId + '_showBtn">Show</button>';
    html += '<button id="' + this.htmlId + '_addBtn">Add</button>';

    html += '<div id="' + this.htmlId + '_employeeSubdepartmentHistoryItemWithEmployeeAndSubdepartmentInfo"></div>';
    return html;
}
DelegationManager.prototype.makeDatePickers = function() {
    var form = this;
    $( '#' + this.htmlId + '_startDate' ).datepicker({
        changeMonth: true,
        changeYear: true,
        dateFormat: 'dd.mm.yy',
        onSelect: function(dateText, inst) {form.startDateChangedHandle(dateText, inst)}
    });
    $( '#' + this.htmlId + '_endDate' ).datepicker({
        changeMonth: true,
        changeYear: true,
        dateFormat: 'dd.mm.yy',
        onSelect: function(dateText, inst) {form.endDateChangedHandle(dateText, inst)}
    });
}
DelegationManager.prototype.makeButtons = function() {
    var form = this;
    $('#' + this.htmlId + '_showBtn')
      .button({

      })
      .click(function(event) {
          form.startLoadingEmployeeSubdepartmentHistoryItemWithEmployeeAndSubdepartmentInfo.call(form);
      });
    $('#' + this.htmlId + '_addBtn')
      .button({

      })
      .click(function(event) {
          form.startAddingEmployeeSubdepartmentHistoryItem.call(form);
      });
}
DelegationManager.prototype.setHandlers = function() {
    var form = this;
    $('#' + this.htmlId + '_subdepartmentOffice').bind("change", function(event) {form.subdepartmentOfficeChangedHandle.call(form)});
    $('#' + this.htmlId + '_subdepartmentDepartment').bind("change", function(event) {form.subdepartmentDepartmentChangedHandle.call(form)});
    $('#' + this.htmlId + '_subdepartment').bind("change", function(event) {form.subdepartmentChangedHandle.call(form)});
    $('#' + this.htmlId + '_employeeOffice').bind("change", function(event) {form.employeeOfficeChangedHandle.call(form)});
    $('#' + this.htmlId + '_employeeDepartment').bind("change", function(event) {form.employeeDepartmentChangedHandle.call(form)});
    $('#' + this.htmlId + '_employeeSubdepartment').bind("change", function(event) {form.employeeSubdepartmentChangedHandle.call(form)});
    $('#' + this.htmlId + '_employee').bind("change", function(event) {form.employeeChangedHandle.call(form)});
    $('#' + this.htmlId + '_startDate').bind("change", function(event) {form.startDateTextChangedHandle.call(form, event)});
    $('#' + this.htmlId + '_endDate').bind("change", function(event) {form.endDateTextChangedHandle.call(form, event)});
}
DelegationManager.prototype.updateView = function() {
    this.updateSubdepartmentOfficeView();
    this.updateSubdepartmentDepartmentView();
    this.updateSubdepartmentView();    
    this.updateEmployeeOfficeView();
    this.updateEmployeeDepartmentView();
    this.updateEmployeeSubdepartmentView();    
    this.updateEmployeeView();    
    this.updateStartDateView();
    this.updateEndDateView();
}
DelegationManager.prototype.updateSubdepartmentOfficeView = function() {
   var html = "";
   html += '<option value="">ALL</option>';
    for(var key in this.loaded.subdepartmentOffices) {
        var office = this.loaded.subdepartmentOffices[key];
        var isSelected = "";
        if(office.id == this.selected.subdepartmentOfficeId) {
           isSelected = "selected";
        }
        html += '<option value="'+ office.id +'" ' + isSelected + '>' + office.name + '</option>';
    }
    $('#' + this.htmlId + '_subdepartmentOffice').html(html);
}
DelegationManager.prototype.updateSubdepartmentDepartmentView = function() {
   var html = "";
   html += '<option value="">ALL</option>';
    for(var key in this.loaded.subdepartmentDepartments) {
        var department = this.loaded.subdepartmentDepartments[key];
        var isSelected = "";
        if(department.id == this.selected.subdepartmentDepartmentId) {
           isSelected = "selected";
        }
        html += '<option value="'+ department.id +'" ' + isSelected + '>' + department.name + '</option>';
    }
    $('#' + this.htmlId + '_subdepartmentDepartment').html(html);
}
DelegationManager.prototype.updateSubdepartmentView = function() {
    var html = "";
    html += '<option value="">ALL</option>';
    for(var key in this.loaded.subdepartments) {
        var subdepartment = this.loaded.subdepartments[key];
        var isSelected = "";
        if(subdepartment.id == this.selected.subdepartmentId) {
           isSelected = "selected";
        }
        html += '<option value="'+ subdepartment.id +'" ' + isSelected + '>' + subdepartment.name + '</option>';
    }
    $('#' + this.htmlId + '_subdepartment').html(html);
}
DelegationManager.prototype.updateEmployeeOfficeView = function() {
   var html = "";
   html += '<option value="">ALL</option>';
    for(var key in this.loaded.employeeOffices) {
        var office = this.loaded.employeeOffices[key];
        var isSelected = "";
        if(office.id == this.selected.employeeOfficeId) {
           isSelected = "selected";
        }
        html += '<option value="'+ office.id +'" ' + isSelected + '>' + office.name + '</option>';
    }
    $('#' + this.htmlId + '_employeeOffice').html(html);
}
DelegationManager.prototype.updateEmployeeDepartmentView = function() {
   var html = "";
   html += '<option value="">ALL</option>';
    for(var key in this.loaded.employeeDepartments) {
        var department = this.loaded.employeeDepartments[key];
        var isSelected = "";
        if(department.id == this.selected.employeeDepartmentId) {
           isSelected = "selected";
        }
        html += '<option value="'+ department.id +'" ' + isSelected + '>' + department.name + '</option>';
    }
    $('#' + this.htmlId + '_employeeDepartment').html(html);
}
DelegationManager.prototype.updateEmployeeSubdepartmentView = function() {
    var html = "";
    html += '<option value="">ALL</option>';
    for(var key in this.loaded.employeeSubdepartments) {
        var subdepartment = this.loaded.employeeSubdepartments[key];
        var isSelected = "";
        if(subdepartment.id == this.selected.employeeSubdepartmentId) {
           isSelected = "selected";
        }
        html += '<option value="'+ subdepartment.id +'" ' + isSelected + '>' + subdepartment.name + '</option>';
    }
    $('#' + this.htmlId + '_employeeSubdepartment').html(html);
}
DelegationManager.prototype.updateEmployeeView = function() {
    var html = "";
    html += '<option value="">ALL</option>';
    for(var key in this.loaded.employees) {
        var employee = this.loaded.employees[key];
        var isSelected = "";
        if(employee.id == this.selected.employeeId) {
           isSelected = "selected";
        }
        html += '<option value="'+ employee.id +'" ' + isSelected + '>' + employee.lastName + ' ' + employee.firstName + ' (' + employee.userName + ')' + '</option>';
    }
    $('#' + this.htmlId + '_employee').html(html);
}
DelegationManager.prototype.updateStartDateView = function() {
    $('#' + this.htmlId + '_startDate').val(this.data.startDate);
}
DelegationManager.prototype.updateEndDateView = function() {
    $('#' + this.htmlId + '_endDate').val(this.data.endDate);
}
DelegationManager.prototype.updateEmployeeSubdepartmentHistoryItemWithEmployeeAndSubdepartmentInfoView = function() {
    var html = '';
    html += '<table class="datagrid">';
    html += '<tr class="dgHeader"><td colspan="4">Employee</td><td></td><td colspan="3">Subdepartment</td><td colspan="2">Period</td><td colspan="2"></td></tr>';
    html += '<tr class="dgHeader"><td>Office</td><td>Department</td><td>Subdepartment</td><td>Employee</td><td>Type</td><td>Office</td><td>Department</td><td>Subdepartment</td><td>Start</td><td>End</td><td>Update</td><td>Delete</td></tr>';
    for(var key in this.loaded.employeeSubdepartmentHistoryItemWithEmployeeAndSubdepartmentInfo) {
        var item = this.loaded.employeeSubdepartmentHistoryItemWithEmployeeAndSubdepartmentInfo[key];
        html += '<tr>';
        html += '<td>' + item.employeeOfficeName + '</td>';
        html += '<td>' + item.employeeDepartmentName + '</td>';
        html += '<td>' + item.employeeSubdepartmentName + '</td>';
        html += '<td>' + item.employeeUserName + '</td>';
        html += '<td>' + item.type + '</td>';
        html += '<td>' + item.subdepartmentOfficeName + '</td>';
        html += '<td>' + item.subdepartmentDepartmentName + '</td>';
        html += '<td>' + item.subdepartmentName + '</td>';
        html += '<td>' + getStringFromYearMonthDate(item.start) + '</td>';
        html += '<td>' + getStringFromYearMonthDate(item.end) + '</td>';
        html += '<td><span class="link" id="' + this.htmlId + '_employeeSubdepartmentHistoryItem_update_' + item.id + '">Update</span></td>';
        html += '<td><span class="link" id="' + this.htmlId + '_employeeSubdepartmentHistoryItem_delete_' + item.id + '">Delete</span></td>';
        html += '</tr>';
    }
    html += '</table>';
    $('#' + this.htmlId + '_employeeSubdepartmentHistoryItemWithEmployeeAndSubdepartmentInfo').html(html);
    var form = this;
    $('span[id^="' + this.htmlId + '_employeeSubdepartmentHistoryItem_update_"]').bind('click', function(event) {form.startUpdatingEmployeeSubdepartmentHistoryItem.call(form, event)});
    $('span[id^="' + this.htmlId + '_employeeSubdepartmentHistoryItem_delete_"]').bind('click', function(event) {form.startDeletingEmployeeSubdepartmentHistoryItem.call(form, event)});
}
DelegationManager.prototype.subdepartmentOfficeChangedHandle = function() {
    var idTxt = $('#' + this.htmlId + '_subdepartmentOffice').val();
    if(idTxt == '') {
        this.selected.subdepartmentOfficeId = null;
    } else {
        this.selected.subdepartmentOfficeId = parseInt(idTxt);
    }
    if(this.selected.subdepartmentOfficeId == null) {
        this.selected.subdepartmentDepartmentId = null;
        this.selected.subdepartmentId = null;
        this.loaded.subdepartmentDepartments = [];
        this.loaded.subdepartments = [];
        this.updateSubdepartmentDepartmentView();
        this.updateSubdepartmentView();
    } else {
        this.loadSubdepartmentOfficeContent();
    }
    $('#' + this.htmlId + '_employeeSubdepartmentHistoryItemWithEmployeeAndSubdepartmentInfo').html('');
}
DelegationManager.prototype.subdepartmentDepartmentChangedHandle = function() {
    var idTxt = $('#' + this.htmlId + '_subdepartmentDepartment').val();
    if(idTxt == '') {
        this.selected.subdepartmentDepartmentId = null;
    } else {
        this.selected.subdepartmentDepartmentId = parseInt(idTxt);
    }
    if(this.selected.subdepartmentDepartmentId == null) {
        this.selected.subdepartmentId = null;
        this.loaded.subdepartments = [];
        this.updateSubdepartmentView();
    } else {
        this.loadSubdepartmentDepartmentContent();
    }
    $('#' + this.htmlId + '_employeeSubdepartmentHistoryItemWithEmployeeAndSubdepartmentInfo').html('');    
}
DelegationManager.prototype.subdepartmentChangedHandle = function() {
    var idTxt = $('#' + this.htmlId + '_subdepartment').val();
    if(idTxt == '') {
        this.selected.subdepartmentId = null;
    } else {
        this.selected.subdepartmentId = parseInt(idTxt);
    }
    $('#' + this.htmlId + '_employeeSubdepartmentHistoryItemWithEmployeeAndSubdepartmentInfo').html('');    
}
DelegationManager.prototype.employeeOfficeChangedHandle = function() {
    var idTxt = $('#' + this.htmlId + '_employeeOffice').val();
    if(idTxt == '') {
        this.selected.employeeOfficeId = null;
    } else {
        this.selected.employeeOfficeId = parseInt(idTxt);
    }
    if(this.selected.employeeOfficeId == null) {
        this.selected.employeeDepartmentId = null;
        this.selected.employeeSubdepartmentId = null;
        this.selected.employeeId = null;
        this.loaded.employeeDepartments = [];
        this.loaded.employeeSubdepartments = [];
        this.loaded.employees = [];
        this.updateEmployeeDepartmentView();
        this.updateEmployeeSubdepartmentView();
        this.updateEmployeeView();
    } else {
        this.loadEmployeeOfficeContent();
    }
    $('#' + this.htmlId + '_employeeSubdepartmentHistoryItemWithEmployeeAndSubdepartmentInfo').html('');    
}
DelegationManager.prototype.employeeDepartmentChangedHandle = function() {
    var idTxt = $('#' + this.htmlId + '_employeeDepartment').val();
    if(idTxt == '') {
        this.selected.employeeDepartmentId = null;
    } else {
        this.selected.employeeDepartmentId = parseInt(idTxt);
    }
    if(this.selected.employeeDepartmentId == null) {
        this.selected.employeeSubdepartmentId = null;
        this.selected.employeeId = null;
        this.loaded.employeeSubdepartments = [];
        this.loaded.employees = [];
        this.updateEmployeeSubdepartmentView();
        this.updateEmployeeView();
    } else {
        this.loadEmployeeDepartmentContent();
    }
    $('#' + this.htmlId + '_employeeSubdepartmentHistoryItemWithEmployeeAndSubdepartmentInfo').html('');    
}
DelegationManager.prototype.employeeSubdepartmentChangedHandle = function() {
    var idTxt = $('#' + this.htmlId + '_employeeSubdepartment').val();
    if(idTxt == '') {
        this.selected.employeeSubdepartmentId = null;
    } else {
        this.selected.employeeSubdepartmentId = parseInt(idTxt);
    }
    if(this.selected.employeeSubdepartmentId == null) {
        this.selected.employeeId = null;
        this.loaded.employees = [];
        this.updateEmployeeView();
    } else {
        this.loadEmployeeSubdepartmentContent();
    }
    $('#' + this.htmlId + '_employeeSubdepartmentHistoryItemWithEmployeeAndSubdepartmentInfo').html('');    
}
DelegationManager.prototype.employeeChangedHandle = function() {
    var idTxt = $('#' + this.htmlId + '_employee').val();
    if(idTxt == '') {
        this.selected.employeeId = null;
    } else {
        this.selected.employeeId = parseInt(idTxt);
    }
    $('#' + this.htmlId + '_employeeSubdepartmentHistoryItemWithEmployeeAndSubdepartmentInfo').html('');    
}
DelegationManager.prototype.startDateChangedHandle = function(dateText, inst) {
    this.data.startDate = dateText;
    $('#' + this.htmlId + '_employeeSubdepartmentHistoryItemWithEmployeeAndSubdepartmentInfo').html('');    
}
DelegationManager.prototype.startDateTextChangedHandle = function(event) {
    this.data.startDate = jQuery.trim(event.currentTarget.value);
    $('#' + this.htmlId + '_employeeSubdepartmentHistoryItemWithEmployeeAndSubdepartmentInfo').html('');    
}
DelegationManager.prototype.endDateChangedHandle = function(dateText, inst) {
    this.data.endDate = dateText;
    $('#' + this.htmlId + '_employeeSubdepartmentHistoryItemWithEmployeeAndSubdepartmentInfo').html('');    
}
DelegationManager.prototype.endDateTextChangedHandle = function(event) {
    this.data.endDate = jQuery.trim(event.currentTarget.value);
    $('#' + this.htmlId + '_employeeSubdepartmentHistoryItemWithEmployeeAndSubdepartmentInfo').html('');    
}
DelegationManager.prototype.validate = function() {
    var errors = [];
    var warnings = [];
    var startDate = null;
    var endDate = null;
    if(this.data.startDate == null || this.data.startDate == "") {
        //errors.push("Start date is not set");
    } else if(! isDateValid(this.data.startDate)) {
        errors.push("Start date has incorrect format");
    } else {
        startDate = parseDateString(this.data.startDate);
    }
    if(this.data.endDate == null || this.data.endDate == "") {
        //errors.push("End date is not set");
    } else if(! isDateValid(this.data.endDate)) {
        errors.push("End date has incorrect format");
    } else {
        endDate = parseDateString(this.data.endDate);
    }
    if(startDate != null && endDate != null && startDate > endDate) {
        errors.push("End date is less than Start date");
    }
    return {
     "errors": errors,
     "warnings": warnings
    };
}
DelegationManager.prototype.startLoadingEmployeeSubdepartmentHistoryItemWithEmployeeAndSubdepartmentInfo = function() {
    var result = this.validate();
    if(result.errors.length > 0) {
        showErrors(result.errors);
    } else {
        this.loadEmployeeSubdepartmentHistoryItemWithEmployeeAndSubdepartmentInfo();
    }
}
DelegationManager.prototype.startAddingEmployeeSubdepartmentHistoryItem = function() {
    var employeeSubdepartmentHistoryItemEditForm = new EmployeeSubdepartmentHistoryItemEditForm(
    {
        "mode": 'CREATE',
        "id": null,
        "type": null,
        "employeeId": null,
        "subdepartmentId": null,
        "start": null,
        "end": null
    },
    "employeeSubdepartmentHistoryItemEditForm",
    this.startLoadingEmployeeSubdepartmentHistoryItemWithEmployeeAndSubdepartmentInfo,
    this
    );
    employeeSubdepartmentHistoryItemEditForm.start();
}
DelegationManager.prototype.startUpdatingEmployeeSubdepartmentHistoryItem = function(event) {
    var idTxt = event.currentTarget.id;
    var tmp = idTxt.split('_');
    var employeeSubdepartmentHistoryItemId = parseInt(tmp[tmp.length - 1]);
    
    var employeeSubdepartmentHistoryItemItemWithEmployeeAndSubdepartment = null;
    for(var key in this.loaded.employeeSubdepartmentHistoryItemWithEmployeeAndSubdepartmentInfo) {
        var itemTmp = this.loaded.employeeSubdepartmentHistoryItemWithEmployeeAndSubdepartmentInfo[key];
        if(itemTmp.id == employeeSubdepartmentHistoryItemId) {
            employeeSubdepartmentHistoryItemItemWithEmployeeAndSubdepartment = itemTmp;
            break;
        }
    }
    var employeeSubdepartmentHistoryItemEditForm = new EmployeeSubdepartmentHistoryItemEditForm({
        "mode": 'UPDATE',
        "type": employeeSubdepartmentHistoryItemItemWithEmployeeAndSubdepartment.type,
        "id": employeeSubdepartmentHistoryItemItemWithEmployeeAndSubdepartment.id,
        "subdepartmentId": employeeSubdepartmentHistoryItemItemWithEmployeeAndSubdepartment.subdepartmentId,
        "employeeId": employeeSubdepartmentHistoryItemItemWithEmployeeAndSubdepartment.employeeId,
        "start": employeeSubdepartmentHistoryItemItemWithEmployeeAndSubdepartment.start,
        "end": employeeSubdepartmentHistoryItemItemWithEmployeeAndSubdepartment.end
    }, "employeeSubdepartmentHistoryItemEditForm", this.startLoadingEmployeeSubdepartmentHistoryItemWithEmployeeAndSubdepartmentInfo, this);
    employeeSubdepartmentHistoryItemEditForm.start();
}
DelegationManager.prototype.startDeletingEmployeeSubdepartmentHistoryItem = function(event) {
    var idTxt = event.currentTarget.id;
    var tmp = idTxt.split('_');
    var employeeSubdepartmentHistoryItemId = parseInt(tmp[tmp.length - 1]);
    var employeeSubdepartmentHistoryItemDeleteForm = new EmployeeSubdepartmentHistoryItemDeleteForm(employeeSubdepartmentHistoryItemId, this.startLoadingEmployeeSubdepartmentHistoryItemWithEmployeeAndSubdepartmentInfo, this);
    employeeSubdepartmentHistoryItemDeleteForm.start();    
}