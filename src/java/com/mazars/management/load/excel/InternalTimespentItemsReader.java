/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.load.excel;
import com.mazars.management.db.util.CalendarUtil;
import java.util.*;
import java.io.*;
import java.text.DateFormat;
import java.text.ParseException;
import java.util.Locale;
import jxl.Cell;
import jxl.CellType;
import jxl.Sheet;
import jxl.Workbook;
import jxl.WorkbookSettings;
import jxl.read.biff.BiffException;
import jxl.DateCell;
import java.text.SimpleDateFormat;
import com.mazars.management.db.domain.*;

/**
 *
 * @author Glazov
 */
public class InternalTimespentItemsReader {
    public class Row {
        String firstName;
        String lastName;
        String userName;
        String internalActivities;
        String description;
        Calendar recordDate;
        Integer timeSpent;
        Date recordedByUserDate;

        public String getDescription() {
            return description;
        }

        public void setDescription(String description) {
            this.description = description;
        }

        public String getFirstName() {
            return firstName;
        }

        public void setFirstName(String firstName) {
            this.firstName = firstName;
        }

        public String getInternalActivities() {
            return internalActivities;
        }

        public void setInternalActivities(String internalActivities) {
            this.internalActivities = internalActivities;
        }

        public String getLastName() {
            return lastName;
        }

        public void setLastName(String lastName) {
            this.lastName = lastName;
        }

        public Calendar getRecordDate() {
            return recordDate;
        }

        public void setRecordDate(Calendar recordDate) {
            this.recordDate = recordDate;
        }

        public Date getRecordedByUserDate() {
            return recordedByUserDate;
        }

        public void setRecordedByUserDate(Date recordedByUserDate) {
            this.recordedByUserDate = recordedByUserDate;
        }

        public Integer getTimeSpent() {
            return timeSpent;
        }

        public void setTimeSpent(Integer timeSpent) {
            this.timeSpent = timeSpent;
        }

        public String getUserName() {
            return userName;
        }

        public void setUserName(String userName) {
            this.userName = userName;
        }

    }

    private List<Employee> employees = new LinkedList<Employee>();
    private List<Task> tasks = new LinkedList<Task>();

    private List<String> errors = new LinkedList<String>();

    private List<TimeSpentItem> timeSpentItems = new LinkedList<TimeSpentItem>();

    public List<String> getErrors() {
        return errors;
    }

    public void setErrors(List<String> errors) {
        this.errors = errors;
    }



    public List<Employee> getEmployees() {
        return employees;
    }

    public void setEmployees(List<Employee> employees) {
        this.employees = employees;
    }


    public List<Task> getTasks() {
        return tasks;
    }

    public void setTasks(List<Task> tasks) {
        this.tasks = tasks;
    }

    public List<TimeSpentItem> getTimeSpentItems() {
        return timeSpentItems;
    }

    public void setTimeSpentItems(List<TimeSpentItem> timeSpentItems) {
        this.timeSpentItems = timeSpentItems;
    }



    public void read(InputStream inputStream, String sheetName, int start, int end) throws IOException, ParseException, Exception {
        WorkbookSettings ws = null;
        Workbook workbook = null;
        Sheet sheet = null;
        Cell rowData[] = null;
        int rowCount = '0';

        ws = new WorkbookSettings();
        ws.setLocale(new Locale("ru", "RU"));
        workbook = Workbook.getWorkbook(inputStream, ws);
        sheet = workbook.getSheet(sheetName);
        rowCount = sheet.getRows();

        SimpleDateFormat dateFormatter = new SimpleDateFormat("MM/dd/yy HH:mm");
        int count = 0;
        for (int i = 0; i < rowCount; i++) {
            if(count < start) {
                count++;
                continue;
            }
            if(count > end) {
                break;
            }
            try {
                rowData = sheet.getRow(i);
                Row row = new Row();
                row.setFirstName(rowData[0].getContents());
                row.setLastName(rowData[1].getContents());
                String userName = rowData[2].getContents().trim();
                if(userName.equalsIgnoreCase("user")) {
                    row.setUserName("pierre");
                } else {
                    row.setUserName(userName);
                }
                String internalActivities = rowData[3].getContents().trim();
                if(internalActivities.equalsIgnoreCase("Public Freeday")) {
                    row.setInternalActivities("Public Freedays");
                } else {
                    row.setInternalActivities(rowData[3].getContents().trim());
                }
                row.setDescription(rowData[4].getContents().trim());
                Calendar day = new GregorianCalendar();
                day.setTime(dateFormatter.parse(rowData[5].getContents()));
                CalendarUtil.truncateTime(day);
                row.setRecordDate(day);
                row.setTimeSpent((int)Math.round(Double.parseDouble(rowData[6].getContents())*60));
                row.setRecordedByUserDate(dateFormatter.parse(rowData[7].getContents()));
                
                

                TimeSpentItem timeSpentItem = new TimeSpentItem();
                timeSpentItem.setDay(row.getRecordDate());
                timeSpentItem.setDescription(row.getDescription());
                timeSpentItem.setEmployee(getEmployee(row.getUserName()));
                timeSpentItem.setModifiedAt(row.getRecordedByUserDate());
                timeSpentItem.setProjectCode(null);
                timeSpentItem.setTask(getTask(row.getInternalActivities()));
                timeSpentItem.setTimeSpent(row.getTimeSpent());

                timeSpentItems.add(timeSpentItem);
            } catch (Exception ex) {
                errors.add("Exception " + ex + " at row " + (count + 1));
            }
            count++;
        }
    }
    public Employee getEmployee(String userName) throws Exception {
        Employee employee = null;
        for(Employee employeeTmp : employees) {
            if(employeeTmp.getUserName().equals(userName)) {
                employee = employeeTmp;
                break;
            }
        }
        if(employee == null) {
            employee = Employee.getByUserName(userName);
            if(employee == null) {
                throw new Exception("Bad employee info " + userName);
            }
            employees.add(employee);
        }
        return employee;
    }
    public Task getTask(String internalActivities) throws Exception {
        Task task = null;
        for(Task taskTmp : tasks) {
            if(taskTmp.getName().equals(internalActivities)) {
                task = taskTmp;
                break;
            }
        }
        if(task == null) {
            List<Task> tasks2 = null;
            tasks2 = Task.getCommonByName(internalActivities);
            
            if(tasks2.size() != 1) {
                throw new Exception("Bad task info (" + tasks2.size() + ") " + internalActivities);
            }
            task = tasks2.get(0);
            tasks.add(task);
        }
        return task;
    }
}
