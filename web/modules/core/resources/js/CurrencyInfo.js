/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

CurrencyInfo = function(mainAdmin, htmlId, containerHtmlId, displayProperties) {
    this.mainAdmin = mainAdmin;
    this.htmlId = htmlId;
    this.containerHtmlId = containerHtmlId;
    this.displayProperties = displayProperties;
}
CurrencyInfo.prototype.refreshInfo = function() {
    this.showInfo(this.currency.id);
}

CurrencyInfo.prototype.showInfo = function(id) {
    var form = this;
    var data = {};
    data.command = "getCurrencyInfo";
    data.id = id;
    $.ajax({
      url: this.mainAdmin.config.endpointUrl,
      data: data,
      cache: false,
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.currency = result.currency;
            form.path = result.path;
            form.updateCurrencyView();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
CurrencyInfo.prototype.updateCurrencyView = function() {
  var html = '';
  html += '<table><tr><td id="' + this.htmlId + '_layout_path"></td></tr><tr><td id="' + this.htmlId + '_layout_currency"></td></tr></table>';
  $('#' + this.containerHtmlId).html(html);
  if(this.displayProperties.currency != null) {
      var rows = [];
      rows.push({"name": "Name", "property": "name"});
      rows.push({"name": "Code", "property": "code"});
      var controls = [];
      if(this.displayProperties.currency.edit) {
          controls.push({"id": "edit", "text": "Edit", "icon": imagePath+"/icons/edit.png", "click": {"handler": this.editCurrency, "context": this}});
      }
      var propertyGrid = new PropertyGrid("admin_currency", this.currency, rows, "Currency", controls);
      propertyGrid.show(this.htmlId + "_layout_currency");
  }
  var navigation = new Navigation("path", this.htmlId + '_layout_path', this.path, this.mainAdmin.navigationClickHandle, this.mainAdmin);
  navigation.show();
}

CurrencyInfo.prototype.editCurrency = function(event) {
    var currencyEditForm = new CurrencyEditForm({
        "mode": 'UPDATE',
        "id": this.currency.id,
        "name": this.currency.name,
        "code": this.currency.code
    }, "currencyEditForm", this.refreshInfo, this);
    currencyEditForm.start();
}