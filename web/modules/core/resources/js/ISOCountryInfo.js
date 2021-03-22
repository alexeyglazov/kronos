/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

ISOCountryInfo = function(mainAdmin, htmlId, containerHtmlId, displayProperties) {
    this.mainAdmin = mainAdmin;
    this.htmlId = htmlId;
    this.containerHtmlId = containerHtmlId;
    this.displayProperties = displayProperties;
}
ISOCountryInfo.prototype.refreshInfo = function() {
    this.showInfo(this.isoCountry.id);
}

ISOCountryInfo.prototype.showInfo = function(id) {
    var form = this;
    var data = {};
    data.command = "getISOCountryInfo";
    data.id = id;
    $.ajax({
      url: this.mainAdmin.config.endpointUrl,
      data: data,
      cache: false,
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.isoCountry = result.isoCountry;
            form.path = result.path;
            form.updateISOCountryView();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
ISOCountryInfo.prototype.updateISOCountryView = function() {
  var html = '';
  html += '<table><tr><td id="' + this.htmlId + '_layout_path"></td></tr><tr><td id="' + this.htmlId + '_layout_isoCountry"></td></tr></table>';
  $('#' + this.containerHtmlId).html(html);
  if(this.displayProperties.isoCountry != null) {
      var rows = [];
      rows.push({"name": "Name", "property": "name"});
      rows.push({"name": "Alpha2Code", "property": "alpha2Code"});
      rows.push({"name": "Alpha3Code", "property": "alpha3Code"});
      rows.push({"name": "NumericCode", "property": "numericCode"});
      var controls = [];
      if(this.displayProperties.isoCountry.edit) {
          controls.push({"id": "edit", "text": "Edit", "icon": imagePath+"/icons/edit.png", "click": {"handler": this.editISOCountry, "context": this}});
      }
      var propertyGrid = new PropertyGrid("admin_isoCountry", this.isoCountry, rows, "ISOCountry", controls);
      propertyGrid.show(this.htmlId + "_layout_isoCountry");
  }
  var navigation = new Navigation("path", this.htmlId + '_layout_path', this.path, this.mainAdmin.navigationClickHandle, this.mainAdmin);
  navigation.show();
}

ISOCountryInfo.prototype.editISOCountry = function(event) {
    var isoCountryEditForm = new ISOCountryEditForm({
        "mode": 'UPDATE',
        "id": this.isoCountry.id,
        "name": this.isoCountry.name,
        "alpha2Code": this.isoCountry.alpha2Code,
        "alpha3Code": this.isoCountry.alpha3Code,
        "numericCode": this.isoCountry.numericCode,
    }, "isoCountryEditForm", this.refreshInfo, this);
    isoCountryEditForm.start();
}