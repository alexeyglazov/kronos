/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mazars.management.webservices.services;

import com.mazars.management.db.domain.Employee;
import com.mazars.management.db.domain.Module;
import com.mazars.management.db.domain.RightsItem;
import com.mazars.management.db.util.HibernateUtil;
import com.mazars.management.web.security.AccessChecker;
import java.util.Date;
import java.util.LinkedList;
import java.util.List;
import javax.jws.WebMethod;
import javax.jws.WebParam;
import javax.jws.WebService;
import org.hibernate.Session;

/**
 *
 * @author glazov
 */
@WebService(serviceName = "ProjectCode")
public class ProjectCode {

    /**
     * Операция веб-службы
     */

    @WebMethod(operationName = "getAvailableProjectCodes")
    public java.util.List<com.mazars.management.webservices.vo.ProjectCodeVO> getAvailableProjectCodes(
            @WebParam(name = "userName") String userName,
            @WebParam(name = "password") String password,
            @WebParam(name = "createdAtFrom") Date createdAtFrom,
            @WebParam(name = "createdAtTo") Date createdAtTo,
            @WebParam(name = "modifiedAtFrom") Date modifiedAtFrom,
            @WebParam(name = "modifiedAtTo") Date modifiedAtTo,
            @WebParam(name = "closedAtFrom") Date closedAtFrom,
            @WebParam(name = "closedAtTo") Date closedAtTo
        ) throws Exception {
        List<com.mazars.management.webservices.vo.ProjectCodeVO> projectCodeVOs = new LinkedList<com.mazars.management.webservices.vo.ProjectCodeVO>();

        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        try {
            hs.beginTransaction();
            AccessChecker accessChecker = new AccessChecker();

            Employee currentUser = accessChecker.authenticate(userName, password);
            Module module = Module.getByName("Code Report");
            AccessChecker.Status status = accessChecker.check(currentUser, module);
            if(! AccessChecker.Status.VALID.equals(status)) {
                throw new Exception("Authorization status is " + status + ".");
            }
            List<com.mazars.management.db.domain.ProjectCode> projectCodes = new LinkedList<com.mazars.management.db.domain.ProjectCode>();
            if(Employee.Profile.COUNTRY_ADMINISTRATOR.equals(currentUser.getProfile())) {
                projectCodes = com.mazars.management.db.domain.ProjectCode.getProjectCodes(currentUser.getCountry(), createdAtFrom, createdAtTo, modifiedAtFrom, modifiedAtTo, closedAtFrom, closedAtTo);
            } else if(Employee.Profile.SUPER_USER.equals(currentUser.getProfile())) {
                projectCodes = RightsItem.getProjectCodes(currentUser, module, currentUser.getCountry(), createdAtFrom, createdAtTo, modifiedAtFrom, modifiedAtTo, closedAtFrom, closedAtTo);
            }
            for(com.mazars.management.db.domain.ProjectCode projectCode : projectCodes) {
                projectCodeVOs.add(new com.mazars.management.webservices.vo.ProjectCodeVO(projectCode));
            }
            hs.getTransaction().commit();
        } catch (Exception e) {
            hs.getTransaction().rollback();
            throw e;
        }    
        return projectCodeVOs;
    }
    @WebMethod(operationName = "getAvailableProjectCodesByCreationDateRange")
    public java.util.List<com.mazars.management.webservices.vo.ProjectCodeVO> getAvailableProjectCodesByCreationDateRange(
            @WebParam(name = "userName") String userName,
            @WebParam(name = "password") String password,
            @WebParam(name = "createdAtFrom") Date createdAtFrom,
            @WebParam(name = "createdAtTo") Date createdAtTo
        ) throws Exception {
        return getAvailableProjectCodes(userName, password, createdAtFrom, createdAtTo, null, null, null, null);
    }
    @WebMethod(operationName = "getAvailableProjectCodesByModificationDateRange")
    public java.util.List<com.mazars.management.webservices.vo.ProjectCodeVO> getAvailableProjectCodesByModificationDateRange(
            @WebParam(name = "userName") String userName,
            @WebParam(name = "password") String password,
            @WebParam(name = "modifiedAtFrom") Date modifiedAtFrom,
            @WebParam(name = "modifiedAtTo") Date modifiedAtTo
        ) throws Exception {
        return getAvailableProjectCodes(userName, password, null, null, modifiedAtFrom, modifiedAtTo, null, null);
    }
    @WebMethod(operationName = "getAvailableProjectCodesByCloseDateRange")
    public java.util.List<com.mazars.management.webservices.vo.ProjectCodeVO> getAvailableProjectCodesByCloseDateRange(
            @WebParam(name = "userName") String userName,
            @WebParam(name = "password") String password,
            @WebParam(name = "closedAtFrom") Date closedAtFrom,
            @WebParam(name = "closedAtTo") Date closedAtTo
        ) throws Exception {
        return getAvailableProjectCodes(userName, password, null, null, null, null, closedAtFrom, closedAtTo);
    }
    @WebMethod(operationName = "getAllAvailableProjectCodes")
    public java.util.List<com.mazars.management.webservices.vo.ProjectCodeVO> getAllAvailableProjectCodes(
            @WebParam(name = "userName") String userName,
            @WebParam(name = "password") String password
        ) throws Exception {
        return getAvailableProjectCodes(userName, password, null, null, null, null, null, null);
    }
    @WebMethod(operationName = "getProjectCodeInfo")
    public com.mazars.management.webservices.vo.ProjectCodeVO getProjectCodeInfo(
            @WebParam(name = "userName") String userName,
            @WebParam(name = "password") String password,
            @WebParam(name = "code") String code
        ) throws Exception {
        com.mazars.management.webservices.vo.ProjectCodeVO projectCodeVO = null;
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        try {
            hs.beginTransaction();
            AccessChecker accessChecker = new AccessChecker();
            
            Employee currentUser = accessChecker.authenticate(userName, password);
            Module module = Module.getByName("Code Report");
            AccessChecker.Status status = accessChecker.check(currentUser, module);
            if(! AccessChecker.Status.VALID.equals(status)) {
                throw new Exception("Authorization status is " + status + ".");
            }
            com.mazars.management.db.domain.ProjectCode projectCode = com.mazars.management.db.domain.ProjectCode.getByCode(code);
            if(projectCode != null) {
                boolean isAllowed = false;
                if(Employee.Profile.COUNTRY_ADMINISTRATOR.equals(currentUser.getProfile())) {
                    if(currentUser.getCountry().getId().equals(projectCode.getSubdepartment().getDepartment().getOffice().getCountry().getId())) {
                        isAllowed = true;
                    }
                } else if(Employee.Profile.SUPER_USER.equals(currentUser.getProfile())) {
                    isAllowed = RightsItem.isAvailable(projectCode.getSubdepartment(), currentUser, module);
               }
                if(isAllowed) {
                    projectCodeVO = new com.mazars.management.webservices.vo.ProjectCodeVO(projectCode);
                } else {
                    throw new Exception("Code info can not be presented " + AccessChecker.Status.NOT_AUTHORIZED);
                }
            }
            hs.getTransaction().commit();
        } catch (Exception e) {
            hs.getTransaction().rollback();
            throw e;
        }
        return projectCodeVO;
    }
}
