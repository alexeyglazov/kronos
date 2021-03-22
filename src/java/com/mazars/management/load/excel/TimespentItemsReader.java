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
public class TimespentItemsReader {
    public class Row {
        String userName;
        String firstName;
        String lastName;
        String firstNameRussian;
        String lastNameRussian;
        String patronymRussian;
        String code;
        Integer timeSpent;
        Date recordedByUserDate;
        Calendar recordDate;
        String description;
        String service;
        String serviceDepartmentName;
        String serviceSubdepartmentName;
        Long codeId;
        String taskTypeName;

        public String getCode() {
            return code;
        }

        public void setCode(String code) {
            this.code = code;
        }

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

        public String getFirstNameRussian() {
            return firstNameRussian;
        }

        public void setFirstNameRussian(String firstNameRussian) {
            this.firstNameRussian = firstNameRussian;
        }

        public String getLastName() {
            return lastName;
        }

        public void setLastName(String lastName) {
            this.lastName = lastName;
        }

        public String getLastNameRussian() {
            return lastNameRussian;
        }

        public void setLastNameRussian(String lastNameRussian) {
            this.lastNameRussian = lastNameRussian;
        }

        public String getPatronymRussian() {
            return patronymRussian;
        }

        public void setPatronymRussian(String patronymRussian) {
            this.patronymRussian = patronymRussian;
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

        public String getService() {
            return service;
        }

        public void setService(String service) {
            this.service = service;
        }

        public String getServiceDepartmentName() {
            return serviceDepartmentName;
        }

        public void setServiceDepartmentName(String serviceDepartmentName) {
            this.serviceDepartmentName = serviceDepartmentName;
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

        public String getServiceSubdepartmentName() {
            return serviceSubdepartmentName;
        }

        public void setServiceSubdepartmentName(String serviceSubdepartmentName) {
            this.serviceSubdepartmentName = serviceSubdepartmentName;
        }

        public Long getCodeId() {
            return codeId;
        }

        public void setCodeId(Long codeId) {
            this.codeId = codeId;
        }

        public String getTaskTypeName() {
            return taskTypeName;
        }

        public void setTaskTypeName(String taskTypeName) {
            this.taskTypeName = taskTypeName;
        }
    }

    private List<Employee> employees = new LinkedList<Employee>();
    private List<Task> tasks = new LinkedList<Task>();
    private List<Task> absentTasks = new LinkedList<Task>();
    private List<TaskType> taskTypes = new LinkedList<TaskType>();
    private List<ProjectCode> projectCodes = new LinkedList<ProjectCode>();
    private List<Department> departments = new LinkedList<Department>();
    private List<Subdepartment> subdepartments = new LinkedList<Subdepartment>();

    private List<String> errors = new LinkedList<String>();

    private List<TimeSpentItem> timeSpentItems = new LinkedList<TimeSpentItem>();

    public List<String> getErrors() {
        return errors;
    }

    public void setErrors(List<String> errors) {
        this.errors = errors;
    }

    public List<TaskType> getTaskTypes() {
        return taskTypes;
    }

    public void setTaskTypes(List<TaskType> taskTypes) {
        this.taskTypes = taskTypes;
    }

    public List<Task> getAbsentTasks() {
        return absentTasks;
    }

    public void setAbsentTasks(List<Task> absentTasks) {
        this.absentTasks = absentTasks;
    }

    public List<Subdepartment> getSubdepartments() {
        return subdepartments;
    }

    public void setSubdepartments(List<Subdepartment> subdepartments) {
        this.subdepartments = subdepartments;
    }

    public List<Department> getDepartments() {
        return departments;
    }

    public void setDepartments(List<Department> departments) {
        this.departments = departments;
    }

    public List<Employee> getEmployees() {
        return employees;
    }

    public void setEmployees(List<Employee> employees) {
        this.employees = employees;
    }

    public List<ProjectCode> getProjectCodes() {
        return projectCodes;
    }

    public void setProjectCodes(List<ProjectCode> projectCodes) {
        this.projectCodes = projectCodes;
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
                row.setUserName(rowData[0].getContents());
                row.setFirstName(rowData[1].getContents());
                row.setLastName(rowData[2].getContents());
                row.setFirstNameRussian(rowData[3].getContents());
                row.setLastNameRussian(rowData[4].getContents());
                row.setPatronymRussian(rowData[5].getContents());
                row.setCode(rowData[6].getContents());
                row.setTimeSpent((int)Math.round(Double.parseDouble(rowData[7].getContents())*60));
                row.setRecordedByUserDate(dateFormatter.parse(rowData[8].getContents()));
                Calendar day = new GregorianCalendar();
                day.setTime(dateFormatter.parse(rowData[9].getContents()));
                CalendarUtil.truncateTime(day);
                row.setRecordDate(day);
                row.setDescription(rowData[10].getContents());
                row.setService(rowData[11].getContents());
                if(rowData[12].getContents().equalsIgnoreCase("Tax and Legal")) {
                    row.setServiceDepartmentName("Tax & Legal");
                } else {
                    row.setServiceDepartmentName(rowData[12].getContents());
                }
                if(rowData[13].getContents()== null || rowData[13].getContents().equals("") || rowData[13].getContents().equalsIgnoreCase("NULL")) {
                    if(row.getServiceDepartmentName().equals("Tax & Legal")) {
                        row.setServiceSubdepartmentName("Tax & Legal (commun project)");
                    } else {
                        row.setServiceSubdepartmentName(row.getServiceDepartmentName());
                    }
                } else {
                    row.setServiceSubdepartmentName(rowData[13].getContents());
                }
                row.setCodeId(Long.parseLong(rowData[14].getContents()));
                if(row.getCodeId().equals(new Long(8027))) {
                    //M_BAS_OUT_GEWISS_2009_OTHER_4
                    continue;
                }
                if(row.getCodeId().equals(new Long(7315))) {
                    row.setCode("M_TLD_COMPLIANCE_ATOS INVESTISSEMENT (BRANCH)_2010_MIGR_1");
                }
                if(row.getCodeId().equals(new Long(7522))) {
                    row.setCode("M_TLD_COMPLIANCE_ATOS INVESTISSEMENT (BRANCH)_2010_MIGR_2");
                }

                row.setTaskTypeName(rowData[15].getContents());
                TimeSpentItem timeSpentItem = new TimeSpentItem();
                timeSpentItem.setDay(row.getRecordDate());
                timeSpentItem.setDescription(row.getDescription());
                timeSpentItem.setEmployee(getEmployee(row.getUserName()));
                timeSpentItem.setModifiedAt(row.getRecordedByUserDate());
                timeSpentItem.setProjectCode(getProjectCode(row.getCode()));
                timeSpentItem.setTask(getTask(row.getService(), row.getTaskTypeName(), row.getServiceSubdepartmentName(), row.getServiceDepartmentName()));
                timeSpentItem.setTimeSpent(row.getTimeSpent());

                timeSpentItems.add(timeSpentItem);
            } catch (Exception ex) {
                errors.add("Exception " + ex + " at row " + (count + 1));
            }
            count++;
        }
    }
    public void readEmployees(InputStream inputStream, String sheetName, int start, int end) throws IOException, ParseException, Exception {
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
        Set<String> employeeUsernames = new HashSet<String>();
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
                employeeUsernames.add(rowData[0].getContents());
            } catch (Exception ex) {
                errors.add("Exception " + ex + " at row " + (count + 1));
            }
            count++;
        }
        for(String employeeUsername : employeeUsernames) {
            Employee employee = Employee.getByUserName(employeeUsername);
            if(employee == null) {
                errors.add("Bad employee info " + employeeUsername);
            } else {
                employees.add(employee);
            }
        }
    }
    public void readTasks(InputStream inputStream, String sheetName, int start, int end) throws IOException, ParseException, Exception {
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
        Set<String> employeeUsernames = new HashSet<String>();
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
                row.setService(rowData[11].getContents());
                if(rowData[12].getContents().equalsIgnoreCase("Tax and Legal")) {
                    row.setServiceDepartmentName("Tax & Legal");
                } else {
                    row.setServiceDepartmentName(rowData[12].getContents());
                }
                if(rowData[13].getContents()== null || rowData[13].getContents().equals("") || rowData[13].getContents().equalsIgnoreCase("NULL")) {
                    if(row.getServiceDepartmentName().equals("Tax & Legal")) {
                        row.setServiceSubdepartmentName("Tax & Legal (commun project)");
                    } else {
                        row.setServiceSubdepartmentName(row.getServiceDepartmentName());
                    }
                } else {
                    row.setServiceSubdepartmentName(rowData[13].getContents());
                }
                row.setTaskTypeName(rowData[15].getContents());
                Task task = null;
                try {
                    task = getTask(row.getService(), row.getTaskTypeName(), row.getServiceSubdepartmentName(), row.getServiceDepartmentName());
                } catch(Exception e) {}
                if(task  == null) {
                    Task task2 = new Task();
                    task2.setIsActive(Boolean.TRUE);
                    task2.setIsIdle(Boolean.FALSE);
                    task2.setName(row.getService());
                    task2.setTaskType(getTaskType(row.getTaskTypeName(), row.getServiceSubdepartmentName(), row.getServiceDepartmentName()));
                    boolean added = false;
                    for(Task taskTmp : absentTasks) {
                        if(taskTmp.getName().equals(task2.getName())
                            && taskTmp.getTaskType().getName().equals(task2.getTaskType().getName())
                            && taskTmp.getTaskType().getSubdepartment().getName().equals(task2.getTaskType().getSubdepartment().getName())
                            && taskTmp.getTaskType().getSubdepartment().getDepartment().getName().equals(task2.getTaskType().getSubdepartment().getDepartment().getName())
                        ) {
                            added = true;
                            break;
                        }
                    }
                    if(! added) {
                        absentTasks.add(task2);
                    }
                } else {
                    tasks.add(task);
                }

            } catch (Exception ex) {
                errors.add("Exception " + ex + " at row " + (count + 1));
            }
            count++;
        }
    }
    public int getMaxLength(InputStream inputStream, String sheetName, int start, int end, int fieldNumber) throws IOException, ParseException, Exception {
        int maxLength = 0;

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
                String cell = rowData[fieldNumber].getContents();
                if(cell.length() > maxLength) {
                    maxLength = cell.length();
                }
            } catch (Exception ex) {
                errors.add("Exception " + ex + " at row " + (count + 1));
            }
        }
        return maxLength;
    }
    public Department getDepartment(String departmentName) throws Exception {
        Department department = null;
        for(Department departmentTmp : departments) {
            if(departmentTmp.getName().equals(departmentName)) {
                department = departmentTmp;
                break;
            }
        }
        if(department == null) {
            List<Department> departments2 = Department.getByName(departmentName);
            if(departments2.size() != 1) {
                throw new Exception("Bad department info (" + departments2.size() + ") " + departmentName);
            }
            department = departments2.get(0);
            departments.add(department);
        }
        return department;
    }
    public Subdepartment getSubdepartment(String subdepartmentName, String departmentName) throws Exception {
        Subdepartment subdepartment = null;
        for(Subdepartment subdepartmentTmp : subdepartments) {
            if(subdepartmentTmp.getName().equals(subdepartmentName) && subdepartmentTmp.getDepartment().getName().equals(departmentName)) {
                subdepartment = subdepartmentTmp;
                break;
            }
        }
        if(subdepartment == null) {
            List<Subdepartment> subdepartments2 = Subdepartment.getByName(subdepartmentName, getDepartment(departmentName));
            if(subdepartments2.size() != 1) {
                throw new Exception("Bad subdepartment info (" + subdepartments2.size() + ") " + subdepartmentName);
            }
            subdepartment = subdepartments2.get(0);
            subdepartments.add(subdepartment);
        }
        return subdepartment;
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
    public TaskType getTaskType(String taskTypeName, String subdepartmentName, String departmentName) throws Exception {
        TaskType taskType = null;
        for(TaskType taskTypeTmp : taskTypes) {
            if(taskTypeTmp.getName().equals(taskTypeName)
                     && taskTypeTmp.getSubdepartment().getName().equals(subdepartmentName)
                     && taskTypeTmp.getSubdepartment().getDepartment().getName().equals(departmentName)
                    ) {
                taskType = taskTypeTmp;
                break;
            }
        }
        if(taskType == null) {
            List<TaskType> taskTypes2 = TaskType.getByName(taskTypeName, getSubdepartment(subdepartmentName, departmentName));
            if(taskTypes2.size() != 1) {
                throw new Exception("Bad taskType info (" + taskTypes2.size() + ") " + taskTypeName + " of " + subdepartmentName + " - " + departmentName);
            }
            taskType = taskTypes2.get(0);
            taskTypes.add(taskType);
        }
        return taskType;
    }

    public Task getTask(String taskName, String taskTypeName, String subdepartmentName, String departmentName) throws Exception {
        Task task = null;
        for(Task taskTmp : tasks) {
            if(taskTmp.getName().equals(taskName)
                     && taskTmp.getTaskType().getName().equals(taskTypeName)
                     && taskTmp.getTaskType().getSubdepartment().getName().equals(subdepartmentName)
                     && taskTmp.getTaskType().getSubdepartment().getDepartment().getName().equals(departmentName)
                    ) {
                task = taskTmp;
                break;
            }
        }
        if(task == null) {
            List<Task> tasks2 = Task.getByName(taskName, getTaskType(taskTypeName, subdepartmentName, departmentName));
            if(tasks2.size() != 1) {
                throw new Exception("Bad task info (" + tasks2.size() + ") " + taskName + " of " + taskTypeName + " - " + subdepartmentName + " - " + departmentName);
            }
            task = tasks2.get(0);
            tasks.add(task);
        }
        return task;
    }
    public ProjectCode getProjectCode(String code) throws Exception {
        ProjectCode projectCode = null;
        for(ProjectCode projectCodeTmp : projectCodes) {
            if(projectCodeTmp.getCode().equals(code)) {
                projectCode = projectCodeTmp;
                break;
            }
        }
        if(projectCode == null) {
            projectCode = ProjectCode.getByCode(code);
            if(projectCode == null) {
                throw new Exception("Bad projectCode info " + code);
            }
            projectCodes.add(projectCode);
        }
        return projectCode;
    }

}
