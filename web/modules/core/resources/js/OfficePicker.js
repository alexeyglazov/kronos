/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
function OfficePicker(htmlId, okHandler, okHandlerContext, moduleName) {
    this.config = {
        endpointUrl: endpointsFolder + "OfficePicker.jsp"
    }
    this.htmlId = htmlId;
    this.okHandler = okHandler;
    this.okHandlerContext = okHandlerContext;
    this.moduleName = moduleName;
    this.loaded = {
        "countries": [],
        "offices": []
    }
    this.selected = {
        "countryId": null,
        "officeId": null
    }
}
OfficePicker.prototype.init = function() {
    this.containerHtmlId = getNextPopupHtmlContainer();
    this.loadInitialContent();
}
OfficePicker.prototype.loadInitialContent = function() {
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

            form.selected.countryId = null;
            form.selected.officeId = null;
            form.show();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
OfficePicker.prototype.loadCountryContent = function() {
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

            form.selected.officeId = null;
            form.updateView();
        })
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
OfficePicker.prototype.getHtml = function() {
    var html = '';
    html += '<table>';
    html += '<tr>';
    html += '<td><span class="label1">Country</span></td>';
    html += '</tr>';
    html += '<tr>';
    html += '<td><select id="officePicker_country"></select></td>';
    html += '</tr>';

    html += '</table>';
    html += '<span class="label1">Office</span><br />';
    html += '<select id="officePicker_office" size="5" style="width: 300px;"></select>';
    return html;
}
OfficePicker.prototype.updateView = function() {
    this.updateCountryView();
    this.updateOfficeView();
}
OfficePicker.prototype.updateCountryView = function() {
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
    $('#officePicker_country').html(html);
}
OfficePicker.prototype.updateOfficeView = function() {
    var html = '';
    for(var key in this.loaded.offices) {
        var office = this.loaded.offices[key];
        var isSelected = "";
        if(office.id == this.selected.officeId) {
           isSelected = "selected";
        }
        html += '<option value="' + office.id + '" ' + isSelected + '>' + office.name + '</option>';
    }
    $('#officePicker_office').html(html);
}
OfficePicker.prototype.setHandlers = function() {
    var form = this;
    $("#officePicker_country").bind("change", function(event) {form.countryChangedHandle.call(form, event);});
    $("#officePicker_office").bind("change", function(event) {form.officeChangedHandle.call(form, event);});
}
OfficePicker.prototype.countryChangedHandle = function(event) {
    var htmlId = $("#officePicker_country").val();
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
OfficePicker.prototype.officeChangedHandle = function(event) {
    var htmlId = $("#officePicker_office").val();
    if(htmlId == null || htmlId == '') {
        this.selected.officeId = null;
    } else {
        this.selected.officeId = parseInt(htmlId);
    }
}
OfficePicker.prototype.show = function() {
    var title = 'Pick Office'
    var form = this;
    $("#" + this.containerHtmlId).html(this.getHtml());
    this.setHandlers();
    this.updateView();
    $("#" + this.containerHtmlId).dialog({
        title: title,
        modal: true,
        office: 'center',
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
OfficePicker.prototype.okClickHandle = function() {
    var office = null;
    if(this.selected.officeId != null) {
        for(var key in this.loaded.offices) {
            if(this.loaded.offices[key].id == this.selected.officeId) {
                office = this.loaded.offices[key];
            }
        }
    }
    this.okHandler.call(this.okHandlerContext, office);
}