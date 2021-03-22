/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
function DepartmentPicker(htmlId, okHandler, okHandlerContext, moduleName) {
    this.config = {
        endpointUrl: endpointsFolder + "DepartmentPicker.jsp"
    }
    this.htmlId = htmlId;
    this.okHandler = okHandler;
    this.okHandlerContext = okHandlerContext;
    this.moduleName = moduleName;
    this.loaded = {
        "countries": [],
        "offices": [],
        "departments": []
    }
    this.selected = {
        "countryId": null,
        "officeId": null,
        "departmentId": null
    }
}
DepartmentPicker.prototype.init = function() {
    this.containerHtmlId = getNextPopupHtmlContainer();
    this.loadInitialContent();
}
DepartmentPicker.prototype.loadInitialContent = function() {
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

            form.selected.countryId = null;
            form.selected.officeId = null;
            form.selected.departmentId = null;
            form.show();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
DepartmentPicker.prototype.loadCountryContent = function() {
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

            form.selected.officeId = null;
            form.selected.departmentId = null;
            form.updateView();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
DepartmentPicker.prototype.loadOfficeContent = function() {
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

            form.selected.departmentId = null;
            form.updateView();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
DepartmentPicker.prototype.getHtml = function() {
    var html = '';
    html += '<table>';
    html += '<tr>';
    html += '<td><span class="label1">Country</span></td>';
    html += '<td><span class="label1">Office</span></td>';
    html += '</tr>';
    html += '<tr>';
    html += '<td><select id="departmentPicker_country"></select></td>';
    html += '<td><select id="departmentPicker_office"></select></td>';
    html += '</tr>';

    html += '</table>';
    html += '<span class="label1">Department</span><br />';
    html += '<select id="departmentPicker_department" size="5" style="width: 300px;"></select>';
    return html;
}
DepartmentPicker.prototype.updateView = function() {
    this.updateCountryView();
    this.updateOfficeView();
    this.updateDepartmentView();
}
DepartmentPicker.prototype.updateCountryView = function() {
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
    $('#departmentPicker_country').html(html);
}
DepartmentPicker.prototype.updateOfficeView = function() {
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
    $('#departmentPicker_office').html(html);
}
DepartmentPicker.prototype.updateDepartmentView = function() {
    var html = '';
    for(var key in this.loaded.departments) {
        var department = this.loaded.departments[key];
        var isSelected = "";
        if(department.id == this.selected.departmentId) {
           isSelected = "selected";
        }
        html += '<option value="' + department.id + '" ' + isSelected + '>' + department.name + '</option>';
    }
    $('#departmentPicker_department').html(html);
}
DepartmentPicker.prototype.setHandlers = function() {
    var form = this;
    $("#departmentPicker_country").bind("change", function(event) {form.countryChangedHandle.call(form, event);});
    $("#departmentPicker_office").bind("change", function(event) {form.officeChangedHandle.call(form, event);});
    $("#departmentPicker_department").bind("change", function(event) {form.departmentChangedHandle.call(form, event);});
}
DepartmentPicker.prototype.countryChangedHandle = function(event) {
    var htmlId = $("#departmentPicker_country").val();
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
DepartmentPicker.prototype.officeChangedHandle = function(event) {
    var htmlId = $("#departmentPicker_office").val();
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
DepartmentPicker.prototype.departmentChangedHandle = function(event) {
    var htmlId = $("#departmentPicker_department").val();
    if(htmlId == null || htmlId == '') {
        this.selected.departmentId = null;
    } else {
        this.selected.departmentId = parseInt(htmlId);
    }
}
DepartmentPicker.prototype.show = function() {
    var title = 'Pick Department'
    var form = this;
    $("#" + this.containerHtmlId).html(this.getHtml());
    this.setHandlers();
    this.updateView();
    $("#" + this.containerHtmlId).dialog({
        title: title,
        modal: true,
        department: 'center',
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
DepartmentPicker.prototype.okClickHandle = function() {
    var department = null;
    if(this.selected.departmentId != null) {
        for(var key in this.loaded.departments) {
            if(this.loaded.departments[key].id == this.selected.departmentId) {
                department = this.loaded.departments[key];
            }
        }
    }
    this.okHandler.call(this.okHandlerContext, department);
}