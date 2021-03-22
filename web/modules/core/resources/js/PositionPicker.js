/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
function PositionPicker(htmlId, okHandler, okHandlerContext, moduleName) {
    this.config = {
        endpointUrl: endpointsFolder + "PositionPicker.jsp"
    }
    this.htmlId = htmlId;
    this.okHandler = okHandler;
    this.okHandlerContext = okHandlerContext;
    this.moduleName = moduleName;
    this.loaded = {
        "countries": [],
        "offices": [],
        "departments": [],
        "subdepartments": [],
        "positions": []
    }
    this.selected = {
        "countryId": null,
        "officeId": null,
        "departmentId": null,
        "subdepartmentId": null,
        "positionId": null
    }
}
PositionPicker.prototype.init = function() {
    this.containerHtmlId = getNextPopupHtmlContainer();
    this.loadInitialContent();
}
PositionPicker.prototype.loadInitialContent = function() {
    var form = this;
    var data = {};
    data.command = "getInitialContent";
    data.moduleName = this.moduleName;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      type: "POST",
      cache: false,
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.countries = result.countries;
            form.loaded.offices = [];
            form.loaded.departments = [];
            form.loaded.subdepartments = [];
            form.loaded.positions = [];

            form.selected.countryId = null;
            form.selected.officeId = null;
            form.selected.departmentId = null;
            form.selected.subdepartmentId = null;
            form.selected.positionId = null;
            form.show();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
PositionPicker.prototype.loadCountryContent = function() {
    var form = this;
    var data = {};
    data.command = "getCountryContent";
    data.moduleName = this.moduleName;
    data.countryId = this.selected.countryId;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      type: "POST",
      cache: false,
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.offices = result.offices;
            form.loaded.departments = [];
            form.loaded.subdepartments = [];
            form.loaded.positions = [];

            form.selected.officeId = null;
            form.selected.departmentId = null;
            form.selected.subdepartmentId = null;
            form.selected.positionId = null;
            form.updateView();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
PositionPicker.prototype.loadOfficeContent = function() {
    var form = this;
    var data = {};
    data.command = "getOfficeContent";
    data.moduleName = this.moduleName;
    data.officeId = this.selected.officeId;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      type: "POST",
      cache: false,
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.departments = result.departments;
            form.loaded.subdepartments = [];
            form.loaded.positions = [];

            form.selected.departmentId = null;
            form.selected.subdepartmentId = null;
            form.selected.positionId = null;
            form.updateView();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
PositionPicker.prototype.loadDepartmentContent = function() {
    var form = this;
    var data = {};
    data.command = "getDepartmentContent";
    data.moduleName = this.moduleName;
    data.departmentId = this.selected.departmentId;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      type: "POST",
      cache: false,
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.subdepartments = result.subdepartments;
            form.loaded.positions = [];

            form.selected.subdepartmentId = null;
            form.selected.positionId = null;
            form.updateView();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
PositionPicker.prototype.loadSubdepartmentContent = function() {
    var form = this;
    var data = {};
    data.command = "getSubdepartmentContent";
    data.moduleName = this.moduleName;
    data.subdepartmentId = this.selected.subdepartmentId;
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      type: "POST",
      cache: false,
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.loaded.positions = result.positions;

            form.selected.positionId = null;
            form.updateView();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
PositionPicker.prototype.getHtml = function() {
    var html = '';
    html += '<table>';
    html += '<tr>';
    html += '<td><span class="label1">Country</span></td>';
    html += '<td><span class="label1">Office</span></td>';
    html += '<td><span class="label1">Department</span></td>';
    html += '<td><span class="label1">Subdepartment</span></td>';
    html += '</tr>';
    html += '<tr>';
    html += '<td><select id="positionPicker_country"></select></td>';
    html += '<td><select id="positionPicker_office"></select></td>';
    html += '<td><select id="positionPicker_department"></select></td>';
    html += '<td><select id="positionPicker_subdepartment"></select></td>';
    html += '</tr>';

    html += '</table>';
    html += '<span class="label1">Position</span><br />';
    html += '<select id="positionPicker_position" size="5" style="width: 300px;"></select>';
    return html;
}
PositionPicker.prototype.updateView = function() {
    this.updateCountryView();
    this.updateOfficeView();
    this.updateDepartmentView();
    this.updateSubdepartmentView();
    this.updatePositionView();
}
PositionPicker.prototype.updateCountryView = function() {
    var html = '';
    html += '<option value="" >...</option>';
    for(var key in this.loaded.countries) {
        var country = this.loaded.countries[key];
        var isSelected = "";
        if(country.id == this.selected.countryId) {
           isSelected = "selected";
        }
        html += '<option value="' + country.id + '" ' + isSelected + '>' + country.name + '</option>';
    }
    $('#positionPicker_country').html(html);
}
PositionPicker.prototype.updateOfficeView = function() {
    var html = '';
    html += '<option value="" >...</option>';
    for(var key in this.loaded.offices) {
        var office = this.loaded.offices[key];
        var isSelected = "";
        if(office.id == this.selected.officeId) {
           isSelected = "selected";
        }
        html += '<option value="' + office.id + '" ' + isSelected + '>' + office.name + '</option>';
    }
    $('#positionPicker_office').html(html);
}
PositionPicker.prototype.updateDepartmentView = function() {
    var html = '';
    html += '<option value="" >...</option>';
    for(var key in this.loaded.departments) {
        var department = this.loaded.departments[key];
        var isSelected = "";
        if(department.id == this.selected.departmentId) {
           isSelected = "selected";
        }
        html += '<option value="' + department.id + '" ' + isSelected + '>' + department.name + '</option>';
    }
    $('#positionPicker_department').html(html);
}
PositionPicker.prototype.updateSubdepartmentView = function() {
    var html = '';
    html += '<option value="" >...</option>';
    for(var key in this.loaded.subdepartments) {
        var subdepartment = this.loaded.subdepartments[key];
        var isSelected = "";
        if(subdepartment.id == this.selected.subdepartmentId) {
           isSelected = "selected";
        }
        html += '<option value="' + subdepartment.id + '" ' + isSelected + '>' + subdepartment.name + '</option>';
    }
    $('#positionPicker_subdepartment').html(html);
}
PositionPicker.prototype.updatePositionView = function() {
    var html = '';
    for(var key in this.loaded.positions) {
        var position = this.loaded.positions[key];
        var isSelected = "";
        if(position.id == this.selected.positionId) {
           isSelected = "selected";
        }
        html += '<option value="' + position.id + '" ' + isSelected + '>' + position.name + '</option>';
    }
    $('#positionPicker_position').html(html);
}
PositionPicker.prototype.setHandlers = function() {
    var form = this;
    $("#positionPicker_country").bind("change", function(event) {form.countryChangedHandle.call(form, event);});
    $("#positionPicker_office").bind("change", function(event) {form.officeChangedHandle.call(form, event);});
    $("#positionPicker_department").bind("change", function(event) {form.departmentChangedHandle.call(form, event);});
    $("#positionPicker_subdepartment").bind("change", function(event) {form.subdepartmentChangedHandle.call(form, event);});
    $("#positionPicker_position").bind("change", function(event) {form.positionChangedHandle.call(form, event);});
}
PositionPicker.prototype.countryChangedHandle = function(event) {
    var htmlId = $("#positionPicker_country").val();
    if(htmlId == '') {
        this.selected.countryId = null;
    } else {
        this.selected.countryId = parseInt(htmlId);
    }
    if(this.selected.countryId == null) {
        this.loadInitialContent();
    } else {
        this.loadCountryContent();
    }
}
PositionPicker.prototype.officeChangedHandle = function(event) {
    var htmlId = $("#positionPicker_office").val();
    if(htmlId == '') {
        this.selected.officeId = null;
    } else {
        this.selected.officeId = parseInt(htmlId);
    }
    if(this.selected.officeId == null) {
        this.loadCountryContent();
    } else {
        this.loadOfficeContent();
    }
}
PositionPicker.prototype.departmentChangedHandle = function(event) {
    var htmlId = $("#positionPicker_department").val();
    if(htmlId == '') {
        this.selected.departmentId = null;
    } else {
        this.selected.departmentId = parseInt(htmlId);
    }
    if(this.selected.departmentId == null) {
        this.loadOfficeContent();
    } else {
        this.loadDepartmentContent();
    }
}
PositionPicker.prototype.subdepartmentChangedHandle = function(event) {
    var htmlId = $("#positionPicker_subdepartment").val();
    if(htmlId == '') {
        this.selected.subdepartmentId = null;
    } else {
        this.selected.subdepartmentId = parseInt(htmlId);
    }
    if(this.selected.subdepartmentId == null) {
        this.loadDepartmentContent();
    } else {
        this.loadSubdepartmentContent();
    }
}
PositionPicker.prototype.positionChangedHandle = function(event) {
    var htmlId = $("#positionPicker_position").val();
    if(htmlId == null || htmlId == '') {
        this.selected.positionId = null;
    } else {
        this.selected.positionId = parseInt(htmlId);
    }
}
PositionPicker.prototype.show = function() {
    var title = 'Pick Position'
    var form = this;
    $("#" + this.containerHtmlId).html(this.getHtml());
    this.setHandlers();
    this.updateView();
    $("#" + this.containerHtmlId).dialog({
        title: title,
        modal: true,
        position: 'center',
        width: 600,
        height: 300,
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
}
PositionPicker.prototype.okClickHandle = function() {
    var position = null;
    if(this.selected.positionId != null) {
        for(var key in this.loaded.positions) {
            if(this.loaded.positions[key].id == this.selected.positionId) {
                position = this.loaded.positions[key];
            }
        }
    }
    this.okHandler.call(this.okHandlerContext, position);
}