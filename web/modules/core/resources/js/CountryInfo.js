/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


CountryInfo = function(mainAdmin, htmlId, containerHtmlId, displayProperties) {
    this.mainAdmin = mainAdmin;
    this.htmlId = htmlId;
    this.containerHtmlId = containerHtmlId;
    this.displayProperties = displayProperties;
}
CountryInfo.prototype.refreshInfo = function() {
    this.showInfo(this.country.id);
}
CountryInfo.prototype.showInfo = function(id) {
    var form = this;
    var data = {};
    data.command = "getCountryInfo";
    data.id = id;
    $.ajax({
      url: this.mainAdmin.config.endpointUrl,
      data: data,
      cache: false,
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.country = result.country;
            form.offices = result.offices;
            form.countryCurrencies = result.countryCurrencies;
            form.currencies = result.currencies;
            form.updateCountryView();          
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
CountryInfo.prototype.updateCountryView = function() {
  var html = '';
  html += '<table>';
  html += '<tr><td id="' + this.htmlId + '_layout_country" colspan="2"></td></tr>';
  html += '<tr>';
  if(this.displayProperties.offices != null) {
    html += '<td id="' + this.htmlId + '_layout_offices"></td>';
  }
  if(this.displayProperties.currencies != null) {
      html += '<td id="' + this.htmlId + '_layout_currencies"></td>';
  }
  html += '</tr></table>';
  $('#' + this.containerHtmlId).html(html);

  if(this.displayProperties.country != null) {
      var rows = [];
      rows.push({"name": "Name", "property": "name"});
      rows.push({"name": "Description", "property": "description"});
      var controls = [];
      if(this.displayProperties.country.edit) {
        controls.push({"id": "edit", "text": "Edit", "icon": imagePath+"/icons/edit.png", "click": {"handler": this.editCountry, "context": this}});
      }
      var propertyGrid = new PropertyGrid("admin_group", this.country, rows, "Country", controls);
      propertyGrid.show(this.htmlId + "_layout_country");
  }

  if(this.displayProperties.offices != null) {
      var columns = [];
      columns.push({"name": "Name", "property": "name", "click": {"handler": this.showOffice, "context": this}});
      columns.push({"name": "Code Name", "property": "codeName"});
      columns.push({"name": "Description", "property": "description"});
      columns.push({"name": "Active", "property": "isActive", "visualizer": booleanVisualizer});
      var extraColumns = [];
      if(this.displayProperties.offices["delete"]) {
        extraColumns.push({"name": "Delete", "property": "delete", "text": "Delete",  "click": {"handler": this.deleteOffice, "context": this}});
      }
      var controls = [];
      if(this.displayProperties.offices["create"]) {
        controls.push({"text": "Add", "icon": imagePath+"/icons/add.png", "click": {"handler": this.addOffice, "context": this}});
      }
      var dataGrid = new DataGrid("admin_offices", this.offices, columns, "Offices", controls, extraColumns, "id");
      dataGrid.show(this.htmlId + "_layout_offices");
  }
  if(this.displayProperties.currencies != null) {
      var data = [];
      for(var key in this.countryCurrencies) {
          var countryCurrency = this.countryCurrencies[key];
          var currency = null;
          for(var keyCurrency in this.currencies) {
              var currencyTmp = this.currencies[keyCurrency];
              if(currencyTmp.id == countryCurrency.currencyId) {
                  currency = currencyTmp;
                  break;
              }
          }
          data.push({
              "id": countryCurrency.id,
              "currencyName": currency.name,
              "currencyCode": currency.code,
              "countryCurrencyIsMain": countryCurrency.isMain
          });
      }
      var columns = [];
      columns.push({"name": "Name", "property": "currencyName"});
      columns.push({"name": "Code", "property": "currencyCode"});
      columns.push({"name": "Main", "property": "countryCurrencyIsMain", "visualizer": booleanVisualizer});
      var extraColumns = [];
      if(this.displayProperties.currencies["unbind"]) {
        extraColumns.push({"name": "Unbind", "property": "unbind", "text": "Unbind",  "click": {"handler": this.unbindCurrency, "context": this}});
      }
      var controls = [];
      if(this.displayProperties.currencies["bind"]) {
        controls.push({"id": "bind", "text": "Bind", "icon": imagePath+"/icons/add.png", "click": {"handler": this.bindCurrency, "context": this}});
      }
      if(this.displayProperties.currencies["setMain"]) {
        controls.push({"id": "setMain", "text": "Set main", "click": {"handler": this.setMainCurrency, "context": this}});
      }
      var dataGrid = new DataGrid("admin_currencies", data, columns, "Currencies", controls, extraColumns, "id");
      dataGrid.show(this.htmlId + "_layout_currencies");
  }
}
CountryInfo.prototype.editCountry = function(event) {
    var countryEditForm = new CountryEditForm({
        "mode": 'UPDATE',
        "id": this.country.id,
        "name": this.country.name,
        "description": this.country.description
    }, "countryEditForm", this.refreshInfo, this);
    countryEditForm.start();
}
CountryInfo.prototype.showOffice = function(event) {
  var htmlId=event.currentTarget.id;
  var tmp = htmlId.split("_");
  this.mainAdmin.showOffice(tmp[tmp.length - 1]);
}
CountryInfo.prototype.showTaskType = function(event) {
  var htmlId=event.currentTarget.id;
  var tmp = htmlId.split("_");
  this.mainAdmin.showTaskType(tmp[tmp.length - 1]);
}
CountryInfo.prototype.addOffice = function(event) {
    var officeEditForm = new OfficeEditForm({
        "mode": 'CREATE',
        "id": null,
        "countryId": this.country.id,
        "name": "",
        "codeName": "",
        "description": "",
        "isActive": true
    }, "officeEditForm", this.refreshInfo, this);
    officeEditForm.start();
}

CountryInfo.prototype.deleteOffice = function(event) {
  var htmlId=event.currentTarget.id;
  var tmp = htmlId.split("_");
  var officeId = tmp[tmp.length - 1];
  var officeDeleteForm = new OfficeDeleteForm(officeId, this.refreshInfo, this);
  officeDeleteForm.start();
}
CountryInfo.prototype.bindCurrency = function(event) {
    var currencyBindForm = new CurrencyBindForm({
        "countryId": this.country.id
    }, "currencyBindForm", this.refreshInfo, this);
    currencyBindForm.start();
}

CountryInfo.prototype.unbindCurrency = function(event) {
  var htmlId=event.currentTarget.id;
  var tmp = htmlId.split("_");
  var countryCurrencyId = tmp[tmp.length - 1];
  var currencyUnbindForm = new CurrencyUnbindForm(countryCurrencyId, this.refreshInfo, this);
  currencyUnbindForm.start();
}

CountryInfo.prototype.setMainCurrency = function(event) {
  var currencySetMainForm = new CurrencySetMainForm("currencySetMainForm", this.refreshInfo, this);
  currencySetMainForm.loaded.countryCurrencies = this.countryCurrencies;
  currencySetMainForm.loaded.currencies = this.currencies;
  currencySetMainForm.start();
}

