/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
function GlobalManagement(htmlId, containerHtmlId) {
   this.config = {
        endpointUrl: endpointsFolder + "GlobalManagement.jsp"
   };
   this.htmlId = htmlId;
   this.containerHtmlId = containerHtmlId;
   this.moduleName = "Admin";
   this.countryInfo = new CountryInfo(this, "countryInfo", this.htmlId + '_content', {
        "country": {"edit": true},
        "currencies": {
            "bind": true,
            "unbind": true,
            "setMain": true
        }
   });
   this.taskTypeInfo = new TaskTypeInfo(this, "taskTypeInfo", this.htmlId + '_content', {
        "taskType": {"edit": true},
        "tasks": {
            "create": true,
            "delete": true
        }
   }, this.moduleName);
   this.taskInfo = new TaskInfo(this, "taskInfo", this.htmlId + '_content', {
        "task": {"edit": true}
   });
   this.standardPositionInfo = new StandardPositionInfo(this, "standardPositionInfo", this.htmlId + '_content', {
        "standardPosition": {"edit": true}
   });
   this.moduleInfo = new ModuleInfo(this, "moduleInfo", this.htmlId + '_content', {
        "module": {"edit": true}
   });
   this.isoCountryInfo = new ISOCountryInfo(this, "isoCountryInfo", this.htmlId + '_content', {
        "isoCountry": {"edit": true}
   });
   this.currencyInfo = new CurrencyInfo(this, "currencyInfo", this.htmlId + '_content', {
        "currency": {"edit": true}
   });
}
GlobalManagement.prototype.init = function() {
    this.makeLayout();
    this.showMenu();
    this.showCountries();
}
GlobalManagement.prototype.makeLayout = function() {
    var html = '<div id="' + this.htmlId + '_menu"></div><div id="' + this.htmlId + '_content"></div>';
    $('#' + this.containerHtmlId).html(html);
}
GlobalManagement.prototype.showCountries = function() {
    var form = this;
    var data = {};
    data.command = "getCountries";
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      type: "POST",
      cache: false,
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.countries = result.countries;
            form.updateCountriesView();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
GlobalManagement.prototype.showStandardPositions = function() {
    var form = this;
    var data = {};
    data.command = "getStandardPositions";
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      type: "POST",
      cache: false,
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.standardPositions = result.standardPositions;
            form.updateStandardPositionsView();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
GlobalManagement.prototype.showCommonTaskTypes = function() {
    var form = this;
    var data = {};
    data.command = "getCommonTaskTypes";
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      type: "POST",
      cache: false,
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.commonTaskTypes = result.commonTaskTypes;
            form.updateCommonTaskTypesView();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
GlobalManagement.prototype.showModules = function() {
    var form = this;
    var data = {};
    data.command = "getModules";
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      type: "POST",
      cache: false,
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.modules = result.modules;
            form.updateModulesView();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
GlobalManagement.prototype.showISOCountries = function() {
    var form = this;
    var data = {};
    data.command = "getISOCountries";
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      type: "POST",
      cache: false,
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.isoCountries = result.isoCountries;
            form.updateISOCountriesView();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
GlobalManagement.prototype.showCurrencies = function() {
    var form = this;
    var data = {};
    data.command = "getCurrencies";
    $.ajax({
      url: this.config.endpointUrl,
      data: data,
      type: "POST",
      cache: false,
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.currencies = result.currencies;
            form.updateCurrenciesView();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
GlobalManagement.prototype.countryClickHandle = function(event) {
  var htmlId=event.currentTarget.id;
  var tmp = htmlId.split("_");
  var id = tmp[tmp.length - 1];
  this.showCountry(id);
}
GlobalManagement.prototype.standardPositionClickHandle = function(event) {
  var htmlId=event.currentTarget.id;
  var tmp = htmlId.split("_");
  var id = tmp[tmp.length - 1];
  this.showStandardPosition(id);
}
GlobalManagement.prototype.commonTaskTypeClickHandle = function(event) {
  var htmlId=event.currentTarget.id;
  var tmp = htmlId.split("_");
  var id = tmp[tmp.length - 1];
  this.showTaskType(id);
}
GlobalManagement.prototype.moduleClickHandle = function(event) {
  var htmlId=event.currentTarget.id;
  var tmp = htmlId.split("_");
  var id = tmp[tmp.length - 1];
  this.showModule(id);
}
GlobalManagement.prototype.isoCountryClickHandle = function(event) {
  var htmlId=event.currentTarget.id;
  var tmp = htmlId.split("_");
  var id = tmp[tmp.length - 1];
  this.showISOCountry(id);
}
GlobalManagement.prototype.currencyClickHandle = function(event) {
  var htmlId=event.currentTarget.id;
  var tmp = htmlId.split("_");
  var id = tmp[tmp.length - 1];
  this.showCurrency(id);
}
GlobalManagement.prototype.showCountry = function(id) {
    this.countryInfo.showInfo(id);
}
GlobalManagement.prototype.showTaskType = function(id) {
  this.taskTypeInfo.showInfo(id);
}
GlobalManagement.prototype.showTask = function(id) {
  this.taskInfo.showInfo(id);
}
GlobalManagement.prototype.showStandardPosition = function(id) {
  this.standardPositionInfo.showInfo(id);
}
GlobalManagement.prototype.showModule = function(id) {
  this.moduleInfo.showInfo(id);
}
GlobalManagement.prototype.showISOCountry = function(id) {
  this.isoCountryInfo.showInfo(id);
}
GlobalManagement.prototype.showCurrency = function(id) {
  this.currencyInfo.showInfo(id);
}
GlobalManagement.prototype.showPosition = function(id) {
  this.positionInfo.showInfo(id);
}
GlobalManagement.prototype.showMenu = function() {
    var html = '';
    html += '<span id="' + this.htmlId + '_menu_countries" class="link">Countries</span>| ';
    html += '<span id="' + this.htmlId + '_menu_standardPositions" class="link">Standard Positions</span>| ';
    html += '<span id="' + this.htmlId + '_menu_commonTaskTypes" class="link">Common Task Types</span>| ';
    html += '<span id="' + this.htmlId + '_menu_modules" class="link">Modules</span>| ';
    html += '<span id="' + this.htmlId + '_menu_isoCountries" class="link">ISO Countries</span>| ';
    html += '<span id="' + this.htmlId + '_menu_currencies" class="link">Currencies</span> ';
    $('#' + this.htmlId + '_menu').html(html);
    var form = this;
    $('#' + this.htmlId + '_menu_countries').bind('click', function(event) {form.showCountries.call(form)});
    $('#' + this.htmlId + '_menu_standardPositions').bind('click', function(event) {form.showStandardPositions.call(form)});
    $('#' + this.htmlId + '_menu_commonTaskTypes').bind('click', function(event) {form.showCommonTaskTypes.call(form)});
    $('#' + this.htmlId + '_menu_modules').bind('click', function(event) {form.showModules.call(form)});
    $('#' + this.htmlId + '_menu_isoCountries').bind('click', function(event) {form.showISOCountries.call(form)});
    $('#' + this.htmlId + '_menu_currencies').bind('click', function(event) {form.showCurrencies.call(form)});
}
GlobalManagement.prototype.updateCountriesView = function() {
  var html = '';
  html += '<table><tr><td id="' + this.htmlId + '_content_countries"></td></tr></table>';
  $('#' + this.htmlId + '_content').html(html);
  var columns = [];
  columns.push({"name": "Name", "property": "name", "click": {"handler": this.countryClickHandle, "context": this}});
  columns.push({"name": "Description", "property": "description"});
  var extraColumns = [];
  extraColumns.push({"name": "Delete", "property": "delete", "text": "Delete",  "click": {"handler": this.deleteCountry, "context": this}});

  var controls = [];
  controls.push({"text": "Add", "icon": imagePath+"/icons/add.png", "click": {"handler": this.addCountry, "context": this}});
  var dataGrid = new DataGrid(this.htmlId + '_countries', this.countries, columns, "Countries", controls, extraColumns, "id");
  dataGrid.show(this.htmlId + '_content_countries');
}
GlobalManagement.prototype.updateStandardPositionsView = function() {
  var html = '';
  html += '<table><tr><td id="' + this.htmlId + '_content_standardPositions"></td></tr></table>';
  $('#' + this.htmlId + '_content').html(html);
  var columns = [];
  columns.push({"name": "Name", "property": "name", "click": {"handler": this.standardPositionClickHandle, "context": this}});
  columns.push({"name": "Sort", "property": "sortValue"});
  var extraColumns = [];
  extraColumns.push({"name": "Delete", "property": "delete", "text": "Delete",  "click": {"handler": this.deleteStandardPosition, "context": this}});
  var controls = [];
  controls.push({"text": "Add", "icon": imagePath+"/icons/add.png", "click": {"handler": this.addStandardPosition, "context": this}});
  var dataGrid = new DataGrid(this.htmlId + '_standardPositions', this.standardPositions, columns, "Standard Positions", controls, extraColumns, "id");
  dataGrid.show(this.htmlId + '_content_standardPositions');
}
GlobalManagement.prototype.updateCommonTaskTypesView = function() {
  var html = '';
  html += '<table><tr><td id="' + this.htmlId + '_content_commonTaskTypes"></td></tr></table>';
  $('#' + this.htmlId + '_content').html(html);
  var columns = [];
  columns.push({"name": "Name", "property": "name", "click": {"handler": this.commonTaskTypeClickHandle, "context": this}});
  columns.push({"name": "Active", "property": "isActive"});
  columns.push({"name": "Internal", "property": "isInternal"});
  var extraColumns = [];
  extraColumns.push({"name": "Delete", "property": "delete", "text": "Delete",  "click": {"handler": this.deleteCommonTaskType, "context": this}});

  var controls = [];
  controls.push({"text": "Add", "icon": imagePath+"/icons/add.png", "click": {"handler": this.addCommonTaskType, "context": this}});
  var dataGrid = new DataGrid(this.htmlId + '_commonTaskTypes', this.commonTaskTypes, columns, "Common Task Types", controls, extraColumns, "id");
  dataGrid.show(this.htmlId + '_content_commonTaskTypes');
}
GlobalManagement.prototype.updateModulesView = function() {
  var html = '';
  html += '<table><tr><td id="' + this.htmlId + '_content_modules"></td></tr></table>';
  $('#' + this.htmlId + '_content').html(html);
  var columns = [];
  columns.push({"name": "Name", "property": "name", "click": {"handler": this.moduleClickHandle, "context": this}});
  columns.push({"name": "Description", "property": "description"});
  columns.push({"name": "Report", "property": "isReport", "visualizer": booleanVisualizer});
  var extraColumns = [];
  extraColumns.push({"name": "Delete", "property": "delete", "text": "Delete",  "click": {"handler": this.deleteModule, "context": this}});
  var controls = [];
  controls.push({"text": "Add", "icon": imagePath+"/icons/add.png", "click": {"handler": this.addModule, "context": this}});
  var dataGrid = new DataGrid(this.htmlId + '_modules', this.modules, columns, "Modules", controls, extraColumns, "id");
  dataGrid.show(this.htmlId + '_content_modules');
}
GlobalManagement.prototype.updateISOCountriesView = function() {
  var html = '';
  html += '<table><tr><td id="' + this.htmlId + '_content_isoCountries"></td></tr></table>';
  $('#' + this.htmlId + '_content').html(html);
  var columns = [];
  columns.push({"name": "Name", "property": "name", "click": {"handler": this.isoCountryClickHandle, "context": this}});
  columns.push({"name": "Alpha2Code", "property": "alpha2Code"});
  columns.push({"name": "Alpha3Code", "property": "alpha3Code"});
  columns.push({"name": "Numeric Code", "property": "numericCode"});
  var extraColumns = [];
  extraColumns.push({"name": "Delete", "property": "delete", "text": "Delete",  "click": {"handler": this.deleteISOCountry, "context": this}});
  var controls = [];
  controls.push({"text": "Add", "icon": imagePath+"/icons/add.png", "click": {"handler": this.addISOCountry, "context": this}});
  var dataGrid = new DataGrid(this.htmlId + '_isoCountries', this.isoCountries, columns, "ISOCountries", controls, extraColumns, "id");
  dataGrid.show(this.htmlId + '_content_isoCountries');
}
GlobalManagement.prototype.updateCurrenciesView = function() {
  var html = '';
  html += '<table><tr><td id="' + this.htmlId + '_content_currencies"></td></tr></table>';
  $('#' + this.htmlId + '_content').html(html);
  var columns = [];
  columns.push({"name": "Name", "property": "name", "click": {"handler": this.currencyClickHandle, "context": this}});
  columns.push({"name": "Code", "property": "code"});
  var extraColumns = [];
  extraColumns.push({"name": "Delete", "property": "delete", "text": "Delete",  "click": {"handler": this.deleteCurrency, "context": this}});
  var controls = [];
  controls.push({"text": "Add", "icon": imagePath+"/icons/add.png", "click": {"handler": this.addCurrency, "context": this}});
  var dataGrid = new DataGrid(this.htmlId + '_currencies', this.currencies, columns, "Currencies", controls, extraColumns, "id");
  dataGrid.show(this.htmlId + '_content_currencies');
}
GlobalManagement.prototype.addCountry = function(event) {
    var countryEditForm = new CountryEditForm({
        "mode": 'CREATE',
        "id": null,
        "name": "",
        "description": ""
    }, "countryEditForm", this.showCountries, this);
    countryEditForm.start();
}
GlobalManagement.prototype.deleteCountry = function(event) {
  var htmlId=event.currentTarget.id;
  var tmp = htmlId.split("_");
  var countryId = tmp[tmp.length - 1];
  var countryDeleteForm = new CountryDeleteForm(countryId, this.showCountries, this);
  countryDeleteForm.start();
}
GlobalManagement.prototype.addStandardPosition = function(event) {
    var standardPositionEditForm = new StandardPositionEditForm({
        "mode": 'CREATE',
        "id": null,
        "name": "",
        "sortValue": ""
    }, "standardPositionEditForm", this.showStandardPositions, this);
    standardPositionEditForm.start();
}
GlobalManagement.prototype.deleteStandardPosition = function(event) {
  var htmlId=event.currentTarget.id;
  var tmp = htmlId.split("_");
  var standardPositionId = tmp[tmp.length - 1];
  var standardPositionDeleteForm = new StandardPositionDeleteForm(standardPositionId, this.showStandardPositions, this);
  standardPositionDeleteForm.start();
}
GlobalManagement.prototype.addModule = function(event) {
    var moduleEditForm = new ModuleEditForm({
        "mode": 'CREATE',
        "id": null,
        "name": "",
        "description": "",
        "isReport": false
    }, "standardPositionEditForm", this.showModules, this);
    moduleEditForm.start();
}
GlobalManagement.prototype.deleteModule = function(event) {
  var htmlId=event.currentTarget.id;
  var tmp = htmlId.split("_");
  var moduleId = tmp[tmp.length - 1];
  var moduleDeleteForm = new ModuleDeleteForm(moduleId, this.showModules, this);
  moduleDeleteForm.start();
}

GlobalManagement.prototype.addISOCountry = function(event) {
    var isoCountryEditForm = new ISOCountryEditForm({
        "mode": 'CREATE',
        "id": null,
        "name": "",
        "alpha2Code": "",
        "alpha3Code": "",
        "numericCode": ""
    }, "isoCountryEditForm", this.showISOCountries, this);
    isoCountryEditForm.start();
}
GlobalManagement.prototype.deleteISOCountry = function(event) {
  var htmlId=event.currentTarget.id;
  var tmp = htmlId.split("_");
  var isoCountryId = tmp[tmp.length - 1];
  var isoCountryDeleteForm = new ISOCountryDeleteForm(isoCountryId, this.showISOCountries, this);
  isoCountryDeleteForm.start();
}

GlobalManagement.prototype.addCurrency = function(event) {
    var currencyEditForm = new CurrencyEditForm({
        "mode": 'CREATE',
        "id": null,
        "name": "",
        "code": ""
    }, "currencyEditForm", this.showCurrencies, this);
    currencyEditForm.start();
}
GlobalManagement.prototype.deleteCurrency = function(event) {
  var htmlId=event.currentTarget.id;
  var tmp = htmlId.split("_");
  var currencyId = tmp[tmp.length - 1];
  var currencyDeleteForm = new CurrencyDeleteForm(currencyId, this.showCurrencies, this);
  currencyDeleteForm.start();
}

GlobalManagement.prototype.addCommonTaskType = function(event) {
    var taskTypeEditForm = new TaskTypeEditForm({
        "mode": 'CREATE',
        "kind": 'COMMON',
        "id": null,
        "name": "",
        "isActive": true,
        "isInternal": true
    }, "taskTypeEditForm", this.showCommonTaskTypes, this, this.moduleName);
    taskTypeEditForm.start();
}
GlobalManagement.prototype.deleteCommonTaskType = function(event) {
  var htmlId=event.currentTarget.id;
  var tmp = htmlId.split("_");
  var commonTaskTypeId = tmp[tmp.length - 1];
  var commonTaskTypeDeleteForm = new TaskTypeDeleteForm(commonTaskTypeId, this.showCommonTaskTypes, this);
  commonTaskTypeDeleteForm.start();
}
GlobalManagement.prototype.navigationClickHandle = function(type, id) {
    if(type == 'country') {
        this.showCountry(id);
    } else if(type == 'office') {
        this.showOffice(id);
    } else if(type == 'department') {
        this.showDepartment(id);
    } else if(type == 'subdepartment') {
        this.showSubdepartment(id);
    } else if(type == 'activity') {
        this.showActivity(id);
    } else if(type == 'taskType') {
        this.showTaskType(id);
    } else if(type == 'task') {
        this.showTask(id);
    };
}
