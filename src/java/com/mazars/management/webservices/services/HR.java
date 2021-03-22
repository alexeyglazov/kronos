/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.webservices.services;

import com.mazars.management.db.comparators.LeavesItemComparator;
import com.mazars.management.db.domain.Employee;
import com.mazars.management.db.domain.LeavesItem;
import com.mazars.management.db.domain.Module;
import com.mazars.management.db.domain.RightsItem;
import com.mazars.management.db.util.HibernateUtil;
import com.mazars.management.db.vo.YearMonthDateRange;
import com.mazars.management.web.security.AccessChecker;
import com.mazars.management.webservices.vo.EmployeeVO;
import com.mazars.management.webservices.vo.LeavesItemVO;
import java.util.Collections;
import java.util.Date;
import java.util.LinkedList;
import java.util.List;
import javax.jws.WebMethod;
import javax.jws.WebParam;
import javax.jws.WebResult;
import javax.jws.WebService;
import org.hibernate.Session;

/**
 *
 * @author glazov
 */
@WebService(serviceName = "HR")
public class HR {

    @WebMethod(operationName = "getEmployeesByExternalIds")
    @WebResult(name = "return", targetNamespace = "http://services.webservices.management.mazars.com/")
    public List<EmployeeVO> getEmployeesByExternalIds(
            @WebParam(name = "userName", targetNamespace = "http://services.webservices.management.mazars.com/") String userName,
            @WebParam(name = "password", targetNamespace = "http://services.webservices.management.mazars.com/") String password,
            @WebParam(name = "externalIds", targetNamespace = "http://services.webservices.management.mazars.com/") List<String> externalIds            
    ) throws Exception {      
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        List<EmployeeVO> result = new LinkedList<EmployeeVO>();
        try {
            hs.beginTransaction();
            
            AccessChecker accessChecker = new AccessChecker();
            Employee currentUser = accessChecker.authenticate(userName, password);
            Module module = Module.getByName("HR");
            AccessChecker.Status status = accessChecker.check(currentUser, module);
            if(! AccessChecker.Status.VALID.equals(status)) {
                throw new Exception("Authorization status is " + status + ".");
            }
            
            int rowNumber = 0;
            for(String externalId : externalIds) {
                if(externalId.trim().equals("")) {
                    throw new Exception("Empty value at row " + rowNumber);
                }
                rowNumber++;
            }
            
            List<Employee> employees = new LinkedList<Employee>();
            if(Employee.Profile.COUNTRY_ADMINISTRATOR.equals(currentUser.getProfile())) {
                employees = currentUser.getCountry().getEmployeesByExternalIds(externalIds);
            } else if(Employee.Profile.SUPER_USER.equals(currentUser.getProfile())) {
                employees = RightsItem.getEmployees(currentUser, module, currentUser.getCountry(), externalIds);
            }
            for(Employee employee : employees) {
                result.add(new EmployeeVO(employee));
            }
            
            hs.getTransaction().commit();
        } catch (Exception e) {
            hs.getTransaction().rollback();
            throw e;
        }
        return result;
    }    
    
    @WebMethod(operationName = "putEmployeeLeavesItems")
    @WebResult(name = "return", targetNamespace = "http://services.webservices.management.mazars.com/")
    public void putEmployeeLeavesItems(
            @WebParam(name = "userName", targetNamespace = "http://services.webservices.management.mazars.com/") String userName,
            @WebParam(name = "password", targetNamespace = "http://services.webservices.management.mazars.com/") String password,
            @WebParam(name = "externalId", targetNamespace = "http://services.webservices.management.mazars.com/") String externalId,            
            @WebParam(name = "leavesItems", targetNamespace = "http://services.webservices.management.mazars.com/") List<LeavesItemVO> leavesItems            
    ) throws Exception {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        try {
            hs.beginTransaction();
            
            AccessChecker accessChecker = new AccessChecker();
            Employee currentUser = accessChecker.authenticate(userName, password);
            Module module = Module.getByName("HR");
            AccessChecker.Status status = accessChecker.check(currentUser, module);
            if(! AccessChecker.Status.VALID.equals(status)) {
                throw new Exception("Authorization status is " + status + ".");
            }
            
            List<String> errors = validateEmployee(externalId, currentUser, module);
            if(errors.isEmpty()) {
                errors = validateEmployeeLeavesItems(externalId, leavesItems);
            }
            if(! errors.isEmpty()) {
                String result = "";
                for(String error : errors) {
                    result += error + "\n";
                }
                throw new Exception(result);
            }
            Employee employee = Employee.getByExternalId(externalId);
            if(Employee.Profile.COUNTRY_ADMINISTRATOR.equals(currentUser.getProfile())) {
                if(! currentUser.getCountry().getId().equals(employee.getCountry().getId())) {
                    throw new Exception("Emloyee of different country");
                }
            } else if(Employee.Profile.SUPER_USER.equals(currentUser.getProfile())) {
                if(! RightsItem.isAvailable(employee, currentUser, module)) {
                    throw new Exception("No access to the subdepartment");
                }              
            }            
            List<LeavesItem> tmpLeavesItems = new LinkedList<LeavesItem>(employee.getLeavesItems());
            for(LeavesItemVO leavesItemVO : leavesItems) {
                YearMonthDateRange range2 = new YearMonthDateRange(leavesItemVO.getStartDate(), leavesItemVO.getEndDate());
                boolean isFound = false;
                for(LeavesItem tmpLeavesItem : tmpLeavesItems) {
                    YearMonthDateRange range1 = new YearMonthDateRange(tmpLeavesItem.getStart(), tmpLeavesItem.getEnd());
                    if(range1.isIntersected(range2)) {
                        isFound = true;
                        break;
                    }
                }
                if(! isFound) {
                    LeavesItem leavesItem = new LeavesItem();
                    leavesItem.setEmployee(employee);
                    leavesItem.setStart(leavesItemVO.getStartDate());
                    leavesItem.setEnd(leavesItemVO.getEndDate());
                    leavesItem.setType(leavesItemVO.getType());
                    hs.save(leavesItem);                
                }
            }
            hs.getTransaction().commit();
        } catch (Exception e) {
            hs.getTransaction().rollback();
            throw e;
        }
    }
    
    @WebMethod(operationName = "getEmployeeLeavesItems")
    @WebResult(name = "return", targetNamespace = "http://services.webservices.management.mazars.com/")
    public List<LeavesItemVO> getEmployeeLeavesItems(
            @WebParam(name = "userName", targetNamespace = "http://services.webservices.management.mazars.com/") String userName,
            @WebParam(name = "password", targetNamespace = "http://services.webservices.management.mazars.com/") String password,
            @WebParam(name = "externalId", targetNamespace = "http://services.webservices.management.mazars.com/") String externalId           
    ) throws Exception {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        List<LeavesItemVO> leavesItemVOs = new LinkedList<LeavesItemVO>();
        try {
            hs.beginTransaction();
            
            AccessChecker accessChecker = new AccessChecker();
            Employee currentUser = accessChecker.authenticate(userName, password);
            Module module = Module.getByName("HR");
            AccessChecker.Status status = accessChecker.check(currentUser, module);
            if(! AccessChecker.Status.VALID.equals(status)) {
                throw new Exception("Authorization status is " + status + ".");
            }
            
            List<String> errors = validateEmployee(externalId, currentUser, module);
            if(! errors.isEmpty()) {
                String result = "";
                for(String error : errors) {
                    result += error + "\n";
                }
                throw new Exception(result);
            }
            Employee employee = Employee.getByExternalId(externalId);          
            List<LeavesItem> leavesItems = new LinkedList<LeavesItem>(employee.getLeavesItems());
            Collections.sort(leavesItems, new LeavesItemComparator());
            for(LeavesItem leavesItem : leavesItems) {
                leavesItemVOs.add(new LeavesItemVO(leavesItem));
            }
            hs.getTransaction().commit();
        } catch (Exception e) {
            hs.getTransaction().rollback();
            throw e;
        }
        return leavesItemVOs;
    }
    private static List<String> validateEmployee(String externalId, Employee currentUser, Module module) {
        List<String> errors = new LinkedList<String>();
        if(externalId == null || externalId.trim().equals("")) {
            errors.add("ExternalId is not set");
            return errors;
        }
        Employee employee = Employee.getByExternalId(externalId);
        if(employee == null) {
            errors.add("No employee found for given externalId " + externalId);
            return errors;
        }
        if(Employee.Profile.COUNTRY_ADMINISTRATOR.equals(currentUser.getProfile())) {
            if(! currentUser.getCountry().getId().equals(employee.getCountry().getId())) {
                errors.add("Emloyee of different country");
            }
        } else if(Employee.Profile.SUPER_USER.equals(currentUser.getProfile())) {
            if(! RightsItem.isAvailable(employee, currentUser, module)) {
                errors.add("No access to the employee's subdepartment ");
            }              
        }
        return errors;    
    }
    private static List<String> validateEmployeeLeavesItems(String externalId, List<LeavesItemVO> leavesItems) {
        List<String> errors = new LinkedList<String>();
        
        if(externalId == null || externalId.trim().equals("")) {
            errors.add("ExternalId is not set");
        }
        if(leavesItems.isEmpty()) {
            errors.add("LeavesItems list is empty");
        }
        int rowNumber = 0;
        List<YearMonthDateRange> range1List = new LinkedList<YearMonthDateRange>();
        List<YearMonthDateRange> range2List = new LinkedList<YearMonthDateRange>();
        for(LeavesItemVO leavesItemVO : leavesItems) {
            if(leavesItemVO.getStartDate() == null) {
                errors.add("Start date is not set at row " + rowNumber);
            }
            if(leavesItemVO.getEndDate() == null) {
                errors.add("End date is not set at row " + rowNumber);
            }
            if(leavesItemVO.getStartDate() != null && leavesItemVO.getEndDate() != null) {
                if(leavesItemVO.getStartDate().after(leavesItemVO.getEndDate())) {
                    errors.add("Start date is greater than End date at row " + rowNumber);
                }
            }
            if(leavesItemVO.getType() == null) {
                errors.add("Type is not set at row " + rowNumber);
            }
            range1List.add(new YearMonthDateRange(leavesItemVO.getStartDate(), leavesItemVO.getEndDate()));
            range2List.add(new YearMonthDateRange(leavesItemVO.getStartDate(), leavesItemVO.getEndDate()));
            rowNumber++;
        }
        int i = 0;
        for(YearMonthDateRange range1 : range1List) {
            int j = 0;
            for(YearMonthDateRange range2 : range2List) {
                if(range1.isIntersected(range2) && i != j) {
                    errors.add("Date intersection in input data between " + range1 + " and " + range2);
                }
                j++;
            }
            i++;
        }
        if(! errors.isEmpty()) {
            return errors;
        }
        
        //===========================
        
        Employee employee = Employee.getByExternalId(externalId);
        if(employee == null) {
            errors.add("No employee found for given externalId " + externalId);
            return errors;
        }
        List<LeavesItem> tmpLeavesItems = new LinkedList<LeavesItem>(employee.getLeavesItems());
        for(LeavesItemVO leavesItemVO : leavesItems) {
            YearMonthDateRange range2 = new YearMonthDateRange(leavesItemVO.getStartDate(), leavesItemVO.getEndDate());
            for(LeavesItem tmpLeavesItem : tmpLeavesItems) {
                YearMonthDateRange range1 = new YearMonthDateRange(tmpLeavesItem.getStart(), tmpLeavesItem.getEnd());
                if(range1.isIntersected(range2) && (! range1.getStart().equals(range2.getStart()) || ! range1.getEnd().equals(range2.getEnd()) || ! tmpLeavesItem.getType().equals(leavesItemVO.getType())) ) {
                    errors.add("New leaves item " + range2 +" is non-equally intersected with current one " + range1);
                    continue;
                }
            }
        }
        
        return errors;
    }
}
