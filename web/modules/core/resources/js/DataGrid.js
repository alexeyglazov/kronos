function DataGrid(id, items, columns, title, controls, extraColumns, itemIdName, extraRows) {
    this.id = id;
    this.items = items;
    this.columns = columns;
    this.title = title;
    this.controls = controls;
    this.extraColumns = extraColumns;
    this.itemIdName = itemIdName;
    this.extraRows = extraRows;
}
DataGrid.prototype.show = function(containerId) {
  if(this.columns == null) {
      this.columns = [];
  }
  if(this.extraColumns == null) {
      this.extraColumns = [];
  }
  var html = '';
  html += '<table class="datagrid">';
  html += '<tr class="dgHeader"><td colspan="' + (this.columns.length + this.extraColumns.length) + '">' + this.title + '</td></tr>';
  html += '<tr class="dgHeader">';
  for(var key in this.columns) {
      var column = this.columns[key];
      html += '<td>' + column.name + '</td>';
  }
  for(var key in this.extraColumns) {
      var extraColumn = this.extraColumns[key];
      html += '<td>' + extraColumn.name + '</td>';
  }
  html += '</tr>';
  if(this.items.length > 0) {
      for(var itemKey in this.items) {
          var item = this.items[itemKey];
          var itemId = itemKey;
          if(this.itemIdName != null) {
              itemId = item[this.itemIdName];
          }
          html += '<tr>';
          for(var columnKey in this.columns) {
            var column = this.columns[columnKey];
              if(column.click != null) {
                html += '<td><span class="link" id="' + this.id + '_'+ column.property +'_' + itemId + '">' + this.visualizeCell(item[column.property], column.visualizer) + '</span></td>';
              } else {
                html += '<td>' + this.visualizeCell(item[column.property], column.visualizer) + '</td>';
              }
          }
          for(var extraColumnKey in this.extraColumns) {
              var extraColumn = this.extraColumns[extraColumnKey];
              if(extraColumn.click != null) {
                html += '<td><span class="link" id="' + this.id + '_'+ extraColumn.property +'_' + itemId + '">' + extraColumn.text + '</span></td>';
              } else {
                html += '<td>' + extraColumn.text + '</td>';
              }
          }
          html += '</tr>'
      }
  } else {
    html += '<tr><td colspan="' + (this.columns.length + this.extraColumns.length) + '">No data</td></tr>';
  }
  
  if(this.items.length > 0 && this.extraRows != null && this.extraRows.length > 0) {
      for(var key in this.extraRows) {
        var extraRow = this.extraRows[key];
        html += '<tr class="dgHighlight">';
        for(var columnKey in this.columns) {
            var column = this.columns[columnKey];
            var extraRowCell = extraRow[column.property];
            var value = this.getExtraRowCellValue(extraRowCell, column);
            if(value != null) {
                html += '<td>' + value + '</td>';
            } else {
                html += '<td></td>';
            }
        }
        for(var extraColumnKey in this.extraColumns) {
            html += '<td></td>';
        }
        html += '</tr>';
      }
  }
  
  if(this.controls != null && this.controls.length > 0) {
      html += '<tr><td colspan="' + (this.columns.length + this.extraColumns.length) + '">';
      for(var key in this.controls) {
          var control = this.controls[key];
          html += '<span class="link" id="'+ this.id + '_' + control.id +'">';
          if(control.icon != null) {
              html += '<img src="' + control.icon + '">';
          }
          if(control.text != null) {
              html += control.text;
          }
          html += '</span>';
      }
      html += '</td></tr>';
  }
  
  
  
  html += '</table>';
  $('#' + containerId).html(html);
  for(var key in this.columns) {
      var column = this.columns[key];
      if(column.click != null) {
          this.setHandler(column);
      }
  }
  for(var key in this.extraColumns) {
      var extraColumn = this.extraColumns[key];
      if(extraColumn.click != null) {
          this.setHandler(extraColumn);
      }
  }
  if(this.controls != null) {
      for(var key in this.controls) {
          var control = this.controls[key];
          if(control.click != null) {
              this.setControlHandler(control);
          }
      }
  }
}
DataGrid.prototype.setHandler = function(column) {
    $('span[id^="' + this.id + '_' + column.property + '_"]').bind('click', function(event) {column.click.handler.call(column.click.context, event)});
}
DataGrid.prototype.setControlHandler = function(control) {
    $('#' + this.id + '_' + control.id).bind('click', function(event) {control.click.handler.call(control.click.context, event)});
}
DataGrid.prototype.visualizeCell = function(object, visualizer) {
    if(visualizer == null) {
        return object;
    } else {
        return visualizer.getHtml(object);
    }
}
DataGrid.prototype.calculateStandard = function(standard, columnKey) {
    if(standard == 'sum') {
        var sum = 0;
        for(var key in this.items) {
            var item = this.items[key];
            sum += item[columnKey];
        }
        return sum;
    } if(standard == 'avg') {
        var sum = 0;
        for(var key in this.items) {
            var item = this.items[key];
            sum += item[columnKey];
        }
        return (sum + 0.0) / this.items.length;
    }
}
DataGrid.prototype.calculateMethod = function(method, methodContext) {
    return method.call(methodContext, this.items);
}
DataGrid.prototype.getExtraRowCellValue = function(extraRowCell, column) {
    var value = null;
    if(extraRowCell == null) {
        value = null;
    } else if(extraRowCell.type == 'text') {
        value = extraRowCell.text;
    } else if(extraRowCell.type == 'standard') {
        value = this.calculateStandard(extraRowCell.standard, column.property);
    } else if(extraRowCell.type == 'function') {
        value = this.calculateMethod(extraRowCell.method, extraRowCell.methodContext);
    }
    if(extraRowCell != null && extraRowCell.visualizer != null) {
        return extraRowCell.visualizer.getHtml(value);
    } else {
        return value;
    }
}


// ========================================================



function PropertyGrid(id, object, rows, title, controls) {
    this.id = id;
    this.object = object;
    this.rows = rows;
    this.title = title;
    this.controls = controls;
}
PropertyGrid.prototype.show = function(containerId) {
  var html = '';
  html += '<table class="datagrid">';
  html += '<tr class="dgHeader"><td colspan="2">' + this.title + '</td></tr>';
  html += '<tr class="dgHeader">';
  html += '<td>Attribute</td>';
  html += '<td>Value</td>';
  html += '</tr>';
  for(var rowKey in this.rows) {
      var row = this.rows[rowKey];
      html += '<tr>';
      html += '<td>' + row.name + '</td>';
      html += '<td>' + this.visualizeCell(this.object[row.property], row.visualizer) + '</td>';
      html += '</tr>'
  }
  if(this.controls != null && this.controls.length > 0) {
      html += '<tr><td colspan="2">';
      for(var key in this.controls) {
          var control = this.controls[key];
          html += '<span class="link" id="'+ this.id + '_' + control.id +'">';
          if(control.icon != null) {
              html += '<img src="' + control.icon + '">';
          }
          if(control.text != null) {
              html += control.text;
          }
          html += '</span>';
      }
      html += '</td></tr>';
  }
  html += '</table>';
  $('#' + containerId).html(html);
  if(this.controls != null) {
      for(var key in this.controls) {
          var control = this.controls[key];
          if(control.click != null) {
              this.setControlHandler(control);
          }
      }
  }
}
PropertyGrid.prototype.setHandler = function(column) {
        $('span[id^="' + this.id + '_' + column.property + '_"]').bind('click', function(event) {column.click.handler.call(column.click.context, event)});
}
PropertyGrid.prototype.setControlHandler = function(control) {
        $('#' + this.id + '_' + control.id).bind('click', function(event) {control.click.handler.call(control.click.context, event)});
}
PropertyGrid.prototype.visualizeCell = function(object, visualizer) {
    if(visualizer == null) {
        return object;
    } else {
        return visualizer.getHtml(object);
    }
}




//=======================================

function Navigation(htmlId, containerHtmlId, items, itemClickHandler, itemClickHandlerContext) {
    this.htmlId = htmlId;
    this.containerHtmlId = containerHtmlId;
    this.items = items;
    this.itemClickHandler = itemClickHandler;
    this.itemClickHandlerContext = itemClickHandlerContext;
}
Navigation.prototype.show = function() {
    var html = '';
    for(var key in this.items) {
        var item = this.items[key];
        html += '<span class="link" id="' + this.htmlId + '_' + key + '_' + item.id + '">' + item.name + '</span>&raquo; ';
    }
    var form = this;
    $('#' + this.containerHtmlId).html(html);
    $('span[id^="' + this.htmlId + '_"]').bind('click', function(event) {form.itemClickInitialHandle.call(form, event)});
}
Navigation.prototype.itemClickInitialHandle = function(event) {
    var htmlId = $(event.currentTarget).attr("id");
    var tmp = htmlId.split("_");
    var type = tmp[tmp.length - 2];
    var id = tmp[tmp.length - 1];
    this.itemClickHandler.call(this.itemClickHandlerContext, type, id);
}