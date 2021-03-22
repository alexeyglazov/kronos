/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

ProjectCodeInfo = function(mainAdmin, htmlId, containerHtmlId, displayProperties) {
    this.mainAdmin = mainAdmin;
    this.htmlId = htmlId;
    this.containerHtmlId = containerHtmlId;
    this.displayProperties = displayProperties;
}
ProjectCodeInfo.prototype.refreshInfo = function() {
    this.showInfo(this.projectCode.id);
}

ProjectCodeInfo.prototype.showInfo = function(id) {
    var form = this;
    var data = {};
    data.command = "getProjectCodeInfo";
    data.id = id;
    $.ajax({
      url: this.mainAdmin.config.endpointUrl,
      data: data,
      cache: false,
      success: function(data){
        ajaxResultHandle(data, form, function(result) {
            form.projectCode = result.projectCode;
            form.path = result.path;
            form.updateProjectCodeView();
        })  
      },
      error: function(jqXHR, textStatus, errorThrown) {
          ajaxErrorHandle(jqXHR, textStatus, errorThrown, null, null);
      }
    });
}
ProjectCodeInfo.prototype.updateProjectCodeView = function() {
  var html = '';
  html += '<table><tr><td id="' + this.htmlId + '_layout_path"></td></tr><tr><td id="' + this.htmlId + '_layout_projectCode"></td></tr></table>';
  $('#' + this.containerHtmlId).html(html);

  if(this.displayProperties.projectCode != null) {
      var html = '';
      html += '<table class="datagrid">';
      html += '<tr><td>Code</td><td>' + this.projectCode.code + '</td></tr>';
      html += '<tr><td></td><td><a href="../../code/code_management/index.jsp?code=' + escape(this.projectCode.code) + '">Code management</a></td></tr>';
      html += '<tr><td></td><td><a href="../../financial_information/fees/index.jsp?code=' + escape(this.projectCode.code) + '">Budget management</a></td></tr>';
      html += '<tr><td></td><td><a href="../../reports/code/code_detail/index.jsp?code=' + escape(this.projectCode.code) + '">Code detail report</a></td></tr>';
      html += '</table>';
      $('#' + this.htmlId + "_layout_projectCode").html(html);
  }

  var navigation = new Navigation("path", this.htmlId + '_layout_path', this.path, this.mainAdmin.navigationClickHandle, this.mainAdmin);
  navigation.show();
}
