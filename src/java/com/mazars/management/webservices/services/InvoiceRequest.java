/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mazars.management.webservices.services;

import com.mazars.management.db.domain.Country;
import com.mazars.management.db.domain.Currency;
import com.mazars.management.db.domain.Employee;
import com.mazars.management.db.domain.FeesAct;
import com.mazars.management.db.domain.FeesInvoice;
import com.mazars.management.db.domain.FeesItem;
import com.mazars.management.db.domain.FeesPayment;
import com.mazars.management.db.domain.InvoiceRequestPacket;
import com.mazars.management.db.domain.InvoiceRequestPacketHistoryItem;
import com.mazars.management.db.domain.Module;
import com.mazars.management.db.domain.OutOfPocketAct;
import com.mazars.management.db.domain.OutOfPocketInvoice;
import com.mazars.management.db.domain.OutOfPocketItem;
import com.mazars.management.db.domain.OutOfPocketPayment;
import com.mazars.management.db.domain.OutOfPocketRequest;
import com.mazars.management.db.domain.OutOfPocketRequestHistoryItem;
import com.mazars.management.db.domain.ProjectCode;
import com.mazars.management.db.domain.RightsItem;
import com.mazars.management.db.domain.Subdepartment;
import com.mazars.management.db.util.CalendarUtil;
import com.mazars.management.db.util.HibernateUtil;
import com.mazars.management.web.security.AccessChecker;
import com.mazars.management.webservices.vo.ActRequestVO;
import com.mazars.management.webservices.vo.InvoiceRequestPacketVO;
import com.mazars.management.webservices.vo.InvoiceRequestVO;
import com.mazars.management.webservices.vo.TaxInvoiceRequestVO;
import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.util.Calendar;
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
@WebService(serviceName = "InvoiceRequest", targetNamespace = "http://services.webservices.management.mazars.com/")
public class InvoiceRequest {
    //invoice request
    /**
     * This is a sample web service operation
     */

    @WebMethod(operationName = "getAvailableInvoiceRequests")
    @WebResult(name = "return", targetNamespace = "http://services.webservices.management.mazars.com/")
    public java.util.List<com.mazars.management.webservices.vo.InvoiceRequestVO> getAvailableInvoiceRequests(
            @WebParam(name = "userName", targetNamespace = "http://services.webservices.management.mazars.com/") String userName,
            @WebParam(name = "password", targetNamespace = "http://services.webservices.management.mazars.com/") String password,
            @WebParam(name = "lockAfterReading", targetNamespace = "http://services.webservices.management.mazars.com/") Boolean lockAfterReading
        ) throws Exception {
        List<com.mazars.management.webservices.vo.InvoiceRequestVO> invoiceRequestVOs = new LinkedList<com.mazars.management.webservices.vo.InvoiceRequestVO>();

        Date now = new Date();
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        try {
            hs.beginTransaction();
            
            AccessChecker accessChecker = new AccessChecker();
            Employee currentUser = accessChecker.authenticate(userName, password);
            Module module = Module.getByName("Financial Information Report");
            AccessChecker.Status status = accessChecker.check(currentUser, module);
            if(! AccessChecker.Status.VALID.equals(status)) {
                throw new Exception("Authorization status is " + status + ".");
            }
            
            List<com.mazars.management.db.domain.InvoiceRequest> invoiceRequests = new LinkedList<com.mazars.management.db.domain.InvoiceRequest>();
            if(Employee.Profile.COUNTRY_ADMINISTRATOR.equals(currentUser.getProfile())) {
                Country country = currentUser.getCountry();
                invoiceRequests = com.mazars.management.db.domain.InvoiceRequest.getList(country, com.mazars.management.db.domain.InvoiceRequestPacket.getAvailabilityStatuses());
            } else if(Employee.Profile.SUPER_USER.equals(currentUser.getProfile())) {
                invoiceRequests = com.mazars.management.db.domain.InvoiceRequest.getList(currentUser, module, com.mazars.management.db.domain.InvoiceRequestPacket.getAvailabilityStatuses());
            }

            for(com.mazars.management.db.domain.InvoiceRequest invoiceRequest : invoiceRequests) {
                InvoiceRequestVO invoiceRequestVO = new InvoiceRequestVO(invoiceRequest);
                invoiceRequestVOs.add(invoiceRequestVO);
                
                if(! Boolean.FALSE.equals(lockAfterReading)) {
                    InvoiceRequestPacket invoiceRequestPacket = invoiceRequest.getInvoiceRequestPacket();
                    if(com.mazars.management.db.domain.InvoiceRequestPacket.Status.ACTIVE.equals(invoiceRequestPacket.getStatus())) {
                        invoiceRequestPacket.setStatus(com.mazars.management.db.domain.InvoiceRequestPacket.Status.LOCKED);
                        hs.save(invoiceRequestPacket);
                        
                        InvoiceRequestPacketHistoryItem invoiceRequestPacketHistoryItem = new InvoiceRequestPacketHistoryItem();
                        invoiceRequestPacketHistoryItem.setEmployee(currentUser);
                        invoiceRequestPacketHistoryItem.setStatus(com.mazars.management.db.domain.InvoiceRequestPacket.Status.LOCKED);
                        invoiceRequestPacketHistoryItem.setTime(now);
                        invoiceRequestPacketHistoryItem.setComment("Invoice Request (" + invoiceRequest.getId() + ") locked in getAvailableInvoiceRequests");
                        invoiceRequestPacketHistoryItem.setInvoiceRequestPacket(invoiceRequestPacket);
                        hs.save(invoiceRequestPacketHistoryItem);                        
                    }
                }
            }
            hs.getTransaction().commit();
        } catch (Exception e) {
            hs.getTransaction().rollback();
            throw e;
        }    
        return invoiceRequestVOs;
    }

    /**
     * Операция веб-службы
     */
    
    @WebMethod(operationName = "getInvoiceRequest")
    @WebResult(name = "return", targetNamespace = "http://services.webservices.management.mazars.com/")
    public com.mazars.management.webservices.vo.InvoiceRequestVO getInvoiceRequest(
            @WebParam(name = "userName", targetNamespace = "http://services.webservices.management.mazars.com/") String userName,
            @WebParam(name = "password", targetNamespace = "http://services.webservices.management.mazars.com/") String password,
            @WebParam(name = "id", targetNamespace = "http://services.webservices.management.mazars.com/") Long id,
            @WebParam(name = "lockAfterReading", targetNamespace = "http://services.webservices.management.mazars.com/") Boolean lockAfterReading
            ) throws Exception {
        com.mazars.management.webservices.vo.InvoiceRequestVO invoiceRequestVO = new com.mazars.management.webservices.vo.InvoiceRequestVO();

        Date now = new Date();
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        try {
            hs.beginTransaction();
            
            AccessChecker accessChecker = new AccessChecker();
            Employee currentUser = accessChecker.authenticate(userName, password);
            Module module = Module.getByName("Financial Information Report");
            AccessChecker.Status status = accessChecker.check(currentUser, module);
            if(! AccessChecker.Status.VALID.equals(status)) {
                throw new Exception("Authorization status is " + status + ".");
            }
            
            com.mazars.management.db.domain.InvoiceRequest invoiceRequest = (com.mazars.management.db.domain.InvoiceRequest)hs.get(com.mazars.management.db.domain.InvoiceRequest.class, id);
            if(invoiceRequest == null) {
                throw new Exception("Invoice request not found");
            }
            InvoiceRequestPacket invoiceRequestPacket = invoiceRequest.getInvoiceRequestPacket();
            if(Employee.Profile.COUNTRY_ADMINISTRATOR.equals(currentUser.getProfile())) {
                Country country = currentUser.getCountry();
                Country invoiceRequestCountry = invoiceRequestPacket.getProjectCode().getSubdepartment().getDepartment().getOffice().getCountry();
                if(! country.getId().equals(invoiceRequestCountry.getId())) {
                    throw new Exception("Invoice request of other country");
                }
            } else if(Employee.Profile.SUPER_USER.equals(currentUser.getProfile())) {
                Subdepartment invoiceRequestSubdepartment = invoiceRequestPacket.getProjectCode().getSubdepartment();
                if(! RightsItem.isAvailable(invoiceRequestSubdepartment, currentUser, module)) {
                    throw new Exception("No rights to the subdepartment of this invoice request");
                }
            }
            
            if(com.mazars.management.db.domain.InvoiceRequestPacket.Status.SUSPENDED.equals(invoiceRequestPacket.getStatus())) {
                throw new Exception("Invoice request packet status is SUSPENDED");
            }
            invoiceRequestVO = new InvoiceRequestVO(invoiceRequest);
            
            if(! Boolean.FALSE.equals(lockAfterReading)) {
                if(com.mazars.management.db.domain.InvoiceRequestPacket.Status.ACTIVE.equals(invoiceRequestPacket.getStatus())) {
                    invoiceRequestPacket.setStatus(com.mazars.management.db.domain.InvoiceRequestPacket.Status.LOCKED);
                    hs.save(invoiceRequestPacket);
                    
                    InvoiceRequestPacketHistoryItem invoiceRequestPacketHistoryItem = new InvoiceRequestPacketHistoryItem();
                    invoiceRequestPacketHistoryItem.setEmployee(currentUser);
                    invoiceRequestPacketHistoryItem.setStatus(com.mazars.management.db.domain.InvoiceRequestPacket.Status.LOCKED);
                    invoiceRequestPacketHistoryItem.setTime(now);
                    invoiceRequestPacketHistoryItem.setComment("Invoice Request (" + invoiceRequest.getId() + ") locked in getInvoiceRequest");
                    invoiceRequestPacketHistoryItem.setInvoiceRequestPacket(invoiceRequestPacket);
                    hs.save(invoiceRequestPacketHistoryItem);
                }
            }
            
            hs.getTransaction().commit();
        } catch (Exception e) {
            hs.getTransaction().rollback();
            throw e;
        }    
        return invoiceRequestVO;
    }

    /**
     * Операция веб-службы
     */
    
    @WebMethod(operationName = "putInvoiceRequestData")
    public void putInvoiceRequestData(
            @WebParam(name = "userName", targetNamespace = "http://services.webservices.management.mazars.com/") String userName,
            @WebParam(name = "password", targetNamespace = "http://services.webservices.management.mazars.com/") String password,
            @WebParam(name = "id", targetNamespace = "http://services.webservices.management.mazars.com/") Long id,
            @WebParam(name = "reference", targetNamespace = "http://services.webservices.management.mazars.com/") String reference,
            @WebParam(name = "date", targetNamespace = "http://services.webservices.management.mazars.com/") Calendar date,
            @WebParam(name = "vatIncludedAmount", targetNamespace = "http://services.webservices.management.mazars.com/") BigDecimal vatIncludedAmount,
            @WebParam(name = "amount", targetNamespace = "http://services.webservices.management.mazars.com/") BigDecimal amount
            ) throws Exception {

        Date now = new Date();
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        try {
            hs.beginTransaction();
            
            AccessChecker accessChecker = new AccessChecker();
            Employee currentUser = accessChecker.authenticate(userName, password);
            Module module = Module.getByName("Financial Information Report");
            AccessChecker.Status status = accessChecker.check(currentUser, module);
            if(! AccessChecker.Status.VALID.equals(status)) {
                throw new Exception("Authorization status is " + status + ".");
            }
            
            if(id == null) {
                throw new Exception("id is not set");
            }
            if(reference == null || "".equals(reference)) {
                throw new Exception("reference is not set");
            }
            if(date == null) {
                throw new Exception("date is not set");
            }
            if(amount == null) {
                throw new Exception("amount is not set");
            }           
            if(vatIncludedAmount == null) {
                throw new Exception("vatIncludedAmount is not set");
            }           
            if(vatIncludedAmount.compareTo(amount) < 0) {
                throw new Exception("vatIncludedAmount is less than amount");
            } 
            com.mazars.management.db.domain.InvoiceRequest invoiceRequest = (com.mazars.management.db.domain.InvoiceRequest)hs.get(com.mazars.management.db.domain.InvoiceRequest.class, id);
            if(invoiceRequest == null) {
                throw new Exception("Invoice request not found");
            }
            InvoiceRequestPacket invoiceRequestPacket = invoiceRequest.getInvoiceRequestPacket();
            if(Employee.Profile.COUNTRY_ADMINISTRATOR.equals(currentUser.getProfile())) {
                Country country = currentUser.getCountry();
                Country invoiceRequestCountry = invoiceRequestPacket.getProjectCode().getSubdepartment().getDepartment().getOffice().getCountry();
                if(! country.getId().equals(invoiceRequestCountry.getId())) {
                    throw new Exception("Invoice request of other country");
                }
            } else if(Employee.Profile.SUPER_USER.equals(currentUser.getProfile())) {
                Subdepartment invoiceRequestSubdepartment = invoiceRequestPacket.getProjectCode().getSubdepartment();
                if(! RightsItem.isAvailable(invoiceRequestSubdepartment, currentUser, module)) {
                    throw new Exception("No rights to the subdepartment of this invoice request");
                }
            }
            
            if(! com.mazars.management.db.domain.InvoiceRequestPacket.Status.LOCKED.equals(invoiceRequestPacket.getStatus())) {
                throw new Exception("Invoice request packet status is not LOCKED");
            }
            
            CalendarUtil.truncateTime(date);
            invoiceRequest.setReference(reference);
            invoiceRequest.setDate(date);
            if(Boolean.TRUE.equals(invoiceRequest.getIsCancelled())) {
                invoiceRequest.setIsExternallyCancelled(Boolean.TRUE);
            } else {
                invoiceRequest.setIsExternallyCancelled(Boolean.FALSE);
            }
            hs.save(invoiceRequest);
            
            FeesItem feesItem = invoiceRequestPacket.getProjectCode().getFeesItem();
            if(feesItem == null) {
                feesItem = new FeesItem();
                feesItem.setProjectCode(invoiceRequestPacket.getProjectCode());
                feesItem.setType(FeesItem.Type.FLAT_FEE);
                feesItem.setDate(date);
                feesItem.setComment("");
                feesItem.setFeesAdvanceCurrency(invoiceRequest.getInvoiceCurrency());
                feesItem.setFeesActCurrency(invoiceRequest.getInvoiceCurrency());
                feesItem.setVat(null);
            }
            feesItem.setFeesInvoiceCurrency(invoiceRequest.getInvoiceCurrency());
            feesItem.setFeesPaymentCurrency(invoiceRequest.getPaymentCurrency());
            hs.save(feesItem);
            
            FeesInvoice feesInvoice = null;
            for(FeesInvoice tmpFeesInvoice : feesItem.getFeesInvoices()) {
                if(tmpFeesInvoice.getReference() != null && tmpFeesInvoice.getReference().equals(reference)) {
                    feesInvoice = tmpFeesInvoice;
                    break;
                }
            }
            if(Boolean.TRUE.equals(invoiceRequest.getIsCancelled())) {
                if(feesInvoice != null) {
                    hs.delete(feesInvoice);
                }
            } else {
                if(feesInvoice == null) {
                    feesInvoice = new FeesInvoice();
                    feesInvoice.setFeesItem(feesItem);
                    feesInvoice.setIsAdvance(Boolean.FALSE);
                    feesInvoice.setReference(reference);
                }
                feesInvoice.setAmount(amount);
                feesInvoice.setVatIncludedAmount(vatIncludedAmount);
                feesInvoice.setDate(date);

                SimpleDateFormat longDateFormatter = new SimpleDateFormat("yyyyMMddHHmmss");
                String stamp = currentUser.getUserName() + "_" + longDateFormatter.format(new Date());
                feesInvoice.setStamp(stamp);
                hs.save(feesInvoice);            
            }

            
            InvoiceRequestPacketHistoryItem invoiceRequestPacketHistoryItem = new InvoiceRequestPacketHistoryItem();
            invoiceRequestPacketHistoryItem.setEmployee(currentUser);
            invoiceRequestPacketHistoryItem.setStatus(com.mazars.management.db.domain.InvoiceRequestPacket.Status.CLOSED);
            invoiceRequestPacketHistoryItem.setTime(now);
            invoiceRequestPacketHistoryItem.setComment("Invoice Request (" + invoiceRequest.getId() + ") updated in putInvoiceRequestData");
            invoiceRequestPacketHistoryItem.setInvoiceRequestPacket(invoiceRequestPacket);
            hs.save(invoiceRequestPacketHistoryItem);

            hs.getTransaction().commit();
        } catch (Exception e) {
            hs.getTransaction().rollback();
            throw e;
        }    
    }

    @WebMethod(operationName = "putPaymentData")
    public void putPaymentData(
            @WebParam(name = "userName", targetNamespace = "http://services.webservices.management.mazars.com/") String userName,
            @WebParam(name = "password", targetNamespace = "http://services.webservices.management.mazars.com/") String password,
            @WebParam(name = "projectCode", targetNamespace = "http://services.webservices.management.mazars.com/") String projectCode,
            @WebParam(name = "invoiceReference", targetNamespace = "http://services.webservices.management.mazars.com/") String invoiceReference,
            @WebParam(name = "reference", targetNamespace = "http://services.webservices.management.mazars.com/") String reference,
            @WebParam(name = "date", targetNamespace = "http://services.webservices.management.mazars.com/") Calendar date,
            @WebParam(name = "amount", targetNamespace = "http://services.webservices.management.mazars.com/") BigDecimal amount,
            @WebParam(name = "currencyCode", targetNamespace = "http://services.webservices.management.mazars.com/") String currencyCode,
            @WebParam(name = "cvAmount", targetNamespace = "http://services.webservices.management.mazars.com/") BigDecimal cvAmount
            ) throws Exception {

        Date now = new Date();
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        try {
            hs.beginTransaction();
            
            AccessChecker accessChecker = new AccessChecker();
            Employee currentUser = accessChecker.authenticate(userName, password);
            Module module = Module.getByName("Financial Information Report");
            AccessChecker.Status status = accessChecker.check(currentUser, module);
            if(! AccessChecker.Status.VALID.equals(status)) {
                throw new Exception("Authorization status is " + status + ".");
            }
            
            if(projectCode == null || "".equals(projectCode.trim())) {
                throw new Exception("projectCode is not set");
            }
            if(reference == null || "".equals(reference.trim())) {
                throw new Exception("reference is not set");
            }
            if(date == null) {
                throw new Exception("date is not set");
            }
            if(amount == null) {
                throw new Exception("amount is not set");
            }
            if(cvAmount == null) {
                throw new Exception("cvAmount is not set");
            }
            Currency currency = null;
            if(currencyCode == null || "".equals(currencyCode.trim())) {
                throw new Exception("currencyCode is not set");
            } else {
                currency = Currency.getByCode(currencyCode);
                if(currency == null) {
                    throw new Exception("currencyCode is not good. Use 3 digits currency code.");
                }
            }           
            ProjectCode project = ProjectCode.getByCode(projectCode);
            if(project == null) {
                throw new Exception("projectCode not found");
            }
            if(Employee.Profile.COUNTRY_ADMINISTRATOR.equals(currentUser.getProfile())) {
                Country country = currentUser.getCountry();
                Country projectCodeCountry = project.getSubdepartment().getDepartment().getOffice().getCountry();
                if(! country.getId().equals(projectCodeCountry.getId())) {
                    throw new Exception("projectCode of other country");
                }
            } else if(Employee.Profile.SUPER_USER.equals(currentUser.getProfile())) {
                Subdepartment projectCodeSubdepartment = project.getSubdepartment();
                if(! RightsItem.isAvailable(projectCodeSubdepartment, currentUser, module)) {
                    throw new Exception("No rights to the subdepartment of this projectCode");
                }
            }
            
            CalendarUtil.truncateTime(date);
            
            FeesItem feesItem = project.getFeesItem();
            if(feesItem == null) {
                feesItem = new FeesItem();
                feesItem.setProjectCode(project);
                feesItem.setType(FeesItem.Type.FLAT_FEE);
                feesItem.setDate(date);
                feesItem.setComment("");
                feesItem.setVat(null);
            }
            if(! feesItem.hasFeesInvoices()) {
                feesItem.setFeesAdvanceCurrency(currency);
            }
            if(! feesItem.hasFeesInvoices()) {
                feesItem.setFeesInvoiceCurrency(currency);
            }
            feesItem.setFeesPaymentCurrency(currency);
            if(! feesItem.hasFeesActs()) {
                feesItem.setFeesActCurrency(currency);
            }
            hs.save(feesItem);
            
            FeesPayment feesPayment = null;
            for(FeesPayment tmpFeesPayment : feesItem.getFeesPayments()) {
                if(tmpFeesPayment.getReference() != null && tmpFeesPayment.getReference().equals(reference)) {
                    feesPayment = tmpFeesPayment;
                    break;
                }
            }
            if(feesPayment == null) {
                feesPayment = new FeesPayment();
                feesPayment.setFeesItem(feesItem);
                feesPayment.setReference(reference);
            }
            feesPayment.setInvoiceReference(invoiceReference);
            feesPayment.setAmount(amount);
            feesPayment.setCvAmount(cvAmount);
            feesPayment.setDate(date);
            SimpleDateFormat longDateFormatter = new SimpleDateFormat("yyyyMMddHHmmss");
            String stamp = currentUser.getUserName() + "_" + longDateFormatter.format(new Date());
            feesPayment.setStamp(stamp);
            hs.save(feesPayment);

            hs.getTransaction().commit();
        } catch (Exception e) {
            hs.getTransaction().rollback();
            throw e;
        }
    }           
    
    // act request
    /**
     * This is a sample web service operation
     */
    
    @WebMethod(operationName = "getAvailableActRequests")
    @WebResult(name = "return", targetNamespace = "http://services.webservices.management.mazars.com/")
    public java.util.List<com.mazars.management.webservices.vo.ActRequestVO> getAvailableActRequests(
            @WebParam(name = "userName", targetNamespace = "http://services.webservices.management.mazars.com/") String userName,
            @WebParam(name = "password", targetNamespace = "http://services.webservices.management.mazars.com/") String password,
            @WebParam(name = "lockAfterReading", targetNamespace = "http://services.webservices.management.mazars.com/") Boolean lockAfterReading
        ) throws Exception {
        List<com.mazars.management.webservices.vo.ActRequestVO> actRequestVOs = new LinkedList<com.mazars.management.webservices.vo.ActRequestVO>();

        Date now = new Date();
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        try {
            hs.beginTransaction();
            
            AccessChecker accessChecker = new AccessChecker();
            Employee currentUser = accessChecker.authenticate(userName, password);
            Module module = Module.getByName("Financial Information Report");
            AccessChecker.Status status = accessChecker.check(currentUser, module);
            if(! AccessChecker.Status.VALID.equals(status)) {
                throw new Exception("Authorization status is " + status + ".");
            }
            
            List<com.mazars.management.db.domain.ActRequest> actRequests = new LinkedList<com.mazars.management.db.domain.ActRequest>();
            if(Employee.Profile.COUNTRY_ADMINISTRATOR.equals(currentUser.getProfile())) {
                Country country = currentUser.getCountry();
                actRequests = com.mazars.management.db.domain.ActRequest.getList(country, com.mazars.management.db.domain.InvoiceRequestPacket.getAvailabilityStatuses());
            } else if(Employee.Profile.SUPER_USER.equals(currentUser.getProfile())) {
                actRequests = com.mazars.management.db.domain.ActRequest.getList(currentUser, module, com.mazars.management.db.domain.InvoiceRequestPacket.getAvailabilityStatuses());
            }

            for(com.mazars.management.db.domain.ActRequest actRequest : actRequests) {
                InvoiceRequestPacket invoiceRequestPacket = actRequest.getInvoiceRequestPacket();
                
                ActRequestVO actRequestVO = new ActRequestVO(actRequest);
                actRequestVOs.add(actRequestVO);
                
                if(! Boolean.FALSE.equals(lockAfterReading)) {
                    if(com.mazars.management.db.domain.InvoiceRequestPacket.Status.ACTIVE.equals(invoiceRequestPacket.getStatus())) {
                        invoiceRequestPacket.setStatus(com.mazars.management.db.domain.InvoiceRequestPacket.Status.LOCKED);
                        hs.save(invoiceRequestPacket);
                        
                        InvoiceRequestPacketHistoryItem invoiceRequestPacketHistoryItem = new InvoiceRequestPacketHistoryItem();
                        invoiceRequestPacketHistoryItem.setEmployee(currentUser);
                        invoiceRequestPacketHistoryItem.setStatus(com.mazars.management.db.domain.InvoiceRequestPacket.Status.LOCKED);
                        invoiceRequestPacketHistoryItem.setTime(now);
                        invoiceRequestPacketHistoryItem.setComment("Act Request (" + actRequest.getId() + ") locked in getAvailableInvoiceRequests");
                        invoiceRequestPacketHistoryItem.setInvoiceRequestPacket(invoiceRequestPacket);
                        hs.save(invoiceRequestPacketHistoryItem);                        
                    }
                }
            }
            hs.getTransaction().commit();
        } catch (Exception e) {
            hs.getTransaction().rollback();
            throw e;
        }    
        return actRequestVOs;
    }

    /**
     * Операция веб-службы
     */
    
    @WebMethod(operationName = "getActRequest")
    @WebResult(name = "return", targetNamespace = "http://services.webservices.management.mazars.com/")
    public com.mazars.management.webservices.vo.ActRequestVO getActRequest(
            @WebParam(name = "userName", targetNamespace = "http://services.webservices.management.mazars.com/") String userName,
            @WebParam(name = "password", targetNamespace = "http://services.webservices.management.mazars.com/") String password,
            @WebParam(name = "id", targetNamespace = "http://services.webservices.management.mazars.com/") Long id,
            @WebParam(name = "lockAfterReading", targetNamespace = "http://services.webservices.management.mazars.com/") Boolean lockAfterReading
            ) throws Exception {
        com.mazars.management.webservices.vo.ActRequestVO actRequestVO = new com.mazars.management.webservices.vo.ActRequestVO();

        Date now = new Date();
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        try {
            hs.beginTransaction();
            
            AccessChecker accessChecker = new AccessChecker();
            Employee currentUser = accessChecker.authenticate(userName, password);
            Module module = Module.getByName("Financial Information Report");
            AccessChecker.Status status = accessChecker.check(currentUser, module);
            if(! AccessChecker.Status.VALID.equals(status)) {
                throw new Exception("Authorization status is " + status + ".");
            }
            
            com.mazars.management.db.domain.ActRequest actRequest = (com.mazars.management.db.domain.ActRequest)hs.get(com.mazars.management.db.domain.ActRequest.class, id);
            if(actRequest == null) {
                throw new Exception("Act request not found");
            }
            InvoiceRequestPacket invoiceRequestPacket = actRequest.getInvoiceRequestPacket();
            if(Employee.Profile.COUNTRY_ADMINISTRATOR.equals(currentUser.getProfile())) {
                Country country = currentUser.getCountry();
                Country actRequestCountry = invoiceRequestPacket.getProjectCode().getSubdepartment().getDepartment().getOffice().getCountry();
                if(! country.getId().equals(actRequestCountry.getId())) {
                    throw new Exception("Act request of other country");
                }
            } else if(Employee.Profile.SUPER_USER.equals(currentUser.getProfile())) {
                Subdepartment actRequestSubdepartment = invoiceRequestPacket.getProjectCode().getSubdepartment();
                if(! RightsItem.isAvailable(actRequestSubdepartment, currentUser, module)) {
                    throw new Exception("No rights to the subdepartment of this act request");
                }
            }
            
            if(com.mazars.management.db.domain.InvoiceRequestPacket.Status.SUSPENDED.equals(invoiceRequestPacket.getStatus())) {
                throw new Exception("Act request status is SUSPENDED");
            }
            actRequestVO = new ActRequestVO(actRequest);
            
            if(! Boolean.FALSE.equals(lockAfterReading)) {
                if(com.mazars.management.db.domain.InvoiceRequestPacket.Status.ACTIVE.equals(invoiceRequestPacket.getStatus())) {
                    invoiceRequestPacket.setStatus(com.mazars.management.db.domain.InvoiceRequestPacket.Status.LOCKED);
                    hs.save(invoiceRequestPacket);
                    
                    InvoiceRequestPacketHistoryItem invoiceRequestPacketHistoryItem = new InvoiceRequestPacketHistoryItem();
                    invoiceRequestPacketHistoryItem.setEmployee(currentUser);
                    invoiceRequestPacketHistoryItem.setStatus(com.mazars.management.db.domain.InvoiceRequestPacket.Status.LOCKED);
                    invoiceRequestPacketHistoryItem.setTime(now);
                    invoiceRequestPacketHistoryItem.setComment("Act Request (" + actRequest.getId() + ") locked in getActRequest");
                    invoiceRequestPacketHistoryItem.setInvoiceRequestPacket(invoiceRequestPacket);
                    hs.save(invoiceRequestPacketHistoryItem);
                }
            }
            
            hs.getTransaction().commit();
        } catch (Exception e) {
            hs.getTransaction().rollback();
            throw e;
        }    
        return actRequestVO;
    }

    /**
     * Операция веб-службы
     */
    
    @WebMethod(operationName = "putActRequestData")
    public void putActRequestData(
            @WebParam(name = "userName", targetNamespace = "http://services.webservices.management.mazars.com/") String userName,
            @WebParam(name = "password", targetNamespace = "http://services.webservices.management.mazars.com/") String password,
            @WebParam(name = "id", targetNamespace = "http://services.webservices.management.mazars.com/") Long id,
            @WebParam(name = "reference", targetNamespace = "http://services.webservices.management.mazars.com/") String reference,
            @WebParam(name = "date", targetNamespace = "http://services.webservices.management.mazars.com/") Calendar date,
            @WebParam(name = "amount", targetNamespace = "http://services.webservices.management.mazars.com/") BigDecimal amount,            
            @WebParam(name = "cvAmount", targetNamespace = "http://services.webservices.management.mazars.com/") BigDecimal cvAmount
            ) throws Exception {
        Date now = new Date();
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        try {
            hs.beginTransaction();
            
            AccessChecker accessChecker = new AccessChecker();
            Employee currentUser = accessChecker.authenticate(userName, password);
            Module module = Module.getByName("Financial Information Report");
            AccessChecker.Status status = accessChecker.check(currentUser, module);
            if(! AccessChecker.Status.VALID.equals(status)) {
                throw new Exception("Authorization status is " + status + ".");
            }
            
            if(id == null) {
                throw new Exception("id is not set");
            }
            if(reference == null || "".equals(reference)) {
                throw new Exception("reference is not set");
            }
            if(date == null) {
                throw new Exception("date is not set");
            }
            if(amount == null) {
                throw new Exception("amount is not set");
            }
            if(cvAmount == null) {
                throw new Exception("cvAmount is not set");
            }
            
            com.mazars.management.db.domain.ActRequest actRequest = (com.mazars.management.db.domain.ActRequest)hs.get(com.mazars.management.db.domain.ActRequest.class, id);
            if(actRequest == null) {
                throw new Exception("Act request not found");
            }
            InvoiceRequestPacket invoiceRequestPacket = actRequest.getInvoiceRequestPacket();
            if(Employee.Profile.COUNTRY_ADMINISTRATOR.equals(currentUser.getProfile())) {
                Country country = currentUser.getCountry();
                Country actRequestCountry = invoiceRequestPacket.getProjectCode().getSubdepartment().getDepartment().getOffice().getCountry();
                if(! country.getId().equals(actRequestCountry.getId())) {
                    throw new Exception("Invoice request of other country");
                }
            } else if(Employee.Profile.SUPER_USER.equals(currentUser.getProfile())) {
                Subdepartment actRequestSubdepartment = invoiceRequestPacket.getProjectCode().getSubdepartment();
                if(! RightsItem.isAvailable(actRequestSubdepartment, currentUser, module)) {
                    throw new Exception("No rights to the subdepartment of this act request");
                }
            }
            
            if(! com.mazars.management.db.domain.InvoiceRequestPacket.Status.LOCKED.equals(invoiceRequestPacket.getStatus())) {
                throw new Exception("Act request status is not LOCKED");
            }
            
            CalendarUtil.truncateTime(date);
            actRequest.setReference(reference);
            actRequest.setDate(date);
            if(Boolean.TRUE.equals(actRequest.getIsCancelled())) {
                actRequest.setIsExternallyCancelled(Boolean.TRUE);
            } else {
                actRequest.setIsExternallyCancelled(Boolean.FALSE);
            }   
            hs.save(actRequest);

            FeesItem feesItem = invoiceRequestPacket.getProjectCode().getFeesItem();
            if(feesItem == null) {
                feesItem = new FeesItem();
                feesItem.setProjectCode(invoiceRequestPacket.getProjectCode());
                feesItem.setType(FeesItem.Type.FLAT_FEE);
                feesItem.setDate(date);
                feesItem.setComment("");
                feesItem.setFeesAdvanceCurrency(actRequest.getInvoiceCurrency());
                feesItem.setFeesInvoiceCurrency(actRequest.getInvoiceCurrency());                
                feesItem.setVat(null);
            }
            feesItem.setFeesActCurrency(actRequest.getInvoiceCurrency());
            feesItem.setFeesPaymentCurrency(actRequest.getPaymentCurrency());
            hs.save(feesItem);
            
            FeesAct feesAct = null;
            for(FeesAct tmpFeesAct : feesItem.getFeesActs()) {
                if(tmpFeesAct.getReference() != null && tmpFeesAct.getReference().equals(reference)) {
                    feesAct = tmpFeesAct;
                    break;
                }
            }
            if(feesAct == null) {
                feesAct = new FeesAct();
                feesAct.setFeesItem(feesItem);
                feesAct.setIsSigned(Boolean.FALSE);
                feesAct.setReference(reference);
            }
            feesAct.setAmount(amount);
            feesAct.setCvAmount(cvAmount);
            feesAct.setDate(date);
            SimpleDateFormat longDateFormatter = new SimpleDateFormat("yyyyMMddHHmmss");
            String stamp = currentUser.getUserName() + "_" + longDateFormatter.format(new Date());
            feesAct.setStamp(stamp);
            hs.save(feesAct);
            
            
            InvoiceRequestPacketHistoryItem invoiceRequestPacketHistoryItem = new InvoiceRequestPacketHistoryItem();
            invoiceRequestPacketHistoryItem.setEmployee(currentUser);
            invoiceRequestPacketHistoryItem.setStatus(com.mazars.management.db.domain.InvoiceRequestPacket.Status.CLOSED);
            invoiceRequestPacketHistoryItem.setTime(now);
            invoiceRequestPacketHistoryItem.setComment("Act Request (" + actRequest.getId() + ") updated in putActRequestData");
            invoiceRequestPacketHistoryItem.setInvoiceRequestPacket(invoiceRequestPacket);
            hs.save(invoiceRequestPacketHistoryItem);
            
            hs.getTransaction().commit();
        } catch (Exception e) {
            hs.getTransaction().rollback();
            throw e;
        }    
    }

    // tax invoice request
    /**
     * This is a sample web service operation
     */

    @WebMethod(operationName = "getAvailableTaxInvoiceRequests")
    @WebResult(name = "return", targetNamespace = "http://services.webservices.management.mazars.com/")
    public java.util.List<com.mazars.management.webservices.vo.TaxInvoiceRequestVO> getAvailableTaxInvoiceRequests(
            @WebParam(name = "userName", targetNamespace = "http://services.webservices.management.mazars.com/") String userName,
            @WebParam(name = "password", targetNamespace = "http://services.webservices.management.mazars.com/") String password,
            @WebParam(name = "lockAfterReading", targetNamespace = "http://services.webservices.management.mazars.com/") Boolean lockAfterReading
        ) throws Exception {
        List<com.mazars.management.webservices.vo.TaxInvoiceRequestVO> taxInvoiceRequestVOs = new LinkedList<com.mazars.management.webservices.vo.TaxInvoiceRequestVO>();

        Date now = new Date();
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        try {
            hs.beginTransaction();
            
            AccessChecker accessChecker = new AccessChecker();
            Employee currentUser = accessChecker.authenticate(userName, password);
            Module module = Module.getByName("Financial Information Report");
            AccessChecker.Status status = accessChecker.check(currentUser, module);
            if(! AccessChecker.Status.VALID.equals(status)) {
                throw new Exception("Authorization status is " + status + ".");
            }
            
            List<com.mazars.management.db.domain.TaxInvoiceRequest> taxInvoiceRequests = new LinkedList<com.mazars.management.db.domain.TaxInvoiceRequest>();
            if(Employee.Profile.COUNTRY_ADMINISTRATOR.equals(currentUser.getProfile())) {
                Country country = currentUser.getCountry();
                taxInvoiceRequests = com.mazars.management.db.domain.TaxInvoiceRequest.getList(country, com.mazars.management.db.domain.InvoiceRequestPacket.getAvailabilityStatuses());
            } else if(Employee.Profile.SUPER_USER.equals(currentUser.getProfile())) {
                taxInvoiceRequests = com.mazars.management.db.domain.TaxInvoiceRequest.getList(currentUser, module, com.mazars.management.db.domain.InvoiceRequestPacket.getAvailabilityStatuses());
            }

            for(com.mazars.management.db.domain.TaxInvoiceRequest taxInvoiceRequest : taxInvoiceRequests) {
                InvoiceRequestPacket invoiceRequestPacket = taxInvoiceRequest.getInvoiceRequestPacket();
                
                TaxInvoiceRequestVO taxInvoiceRequestVO = new TaxInvoiceRequestVO(taxInvoiceRequest);
                taxInvoiceRequestVOs.add(taxInvoiceRequestVO);
                
                if(! Boolean.FALSE.equals(lockAfterReading)) {
                    if(com.mazars.management.db.domain.InvoiceRequestPacket.Status.ACTIVE.equals(invoiceRequestPacket.getStatus())) {
                        invoiceRequestPacket.setStatus(com.mazars.management.db.domain.InvoiceRequestPacket.Status.LOCKED);
                        hs.save(invoiceRequestPacket);
                        
                        InvoiceRequestPacketHistoryItem invoiceRequestPacketHistoryItem = new InvoiceRequestPacketHistoryItem();
                        invoiceRequestPacketHistoryItem.setEmployee(currentUser);
                        invoiceRequestPacketHistoryItem.setStatus(com.mazars.management.db.domain.InvoiceRequestPacket.Status.LOCKED);
                        invoiceRequestPacketHistoryItem.setTime(now);
                        invoiceRequestPacketHistoryItem.setComment("Tax Invoice Request (" + taxInvoiceRequest.getId() + ") locked in getAvailableTaxInvoiceRequests");
                        invoiceRequestPacketHistoryItem.setInvoiceRequestPacket(invoiceRequestPacket);
                        hs.save(invoiceRequestPacketHistoryItem);                        
                    }
                }
            }
            hs.getTransaction().commit();
        } catch (Exception e) {
            hs.getTransaction().rollback();
            throw e;
        }    
        return taxInvoiceRequestVOs;
    }

    /**
     * Операция веб-службы
     */

    @WebMethod(operationName = "getTaxInvoiceRequest")
    @WebResult(name = "return", targetNamespace = "http://services.webservices.management.mazars.com/")
    public com.mazars.management.webservices.vo.TaxInvoiceRequestVO getTaxInvoiceRequest(
            @WebParam(name = "userName", targetNamespace = "http://services.webservices.management.mazars.com/") String userName,
            @WebParam(name = "password", targetNamespace = "http://services.webservices.management.mazars.com/") String password,
            @WebParam(name = "id", targetNamespace = "http://services.webservices.management.mazars.com/") Long id,
            @WebParam(name = "lockAfterReading", targetNamespace = "http://services.webservices.management.mazars.com/") Boolean lockAfterReading
            ) throws Exception {
        com.mazars.management.webservices.vo.TaxInvoiceRequestVO taxInvoiceRequestVO = new com.mazars.management.webservices.vo.TaxInvoiceRequestVO();

        Date now = new Date();
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        try {
            hs.beginTransaction();
            
            AccessChecker accessChecker = new AccessChecker();
            Employee currentUser = accessChecker.authenticate(userName, password);
            Module module = Module.getByName("Financial Information Report");
            AccessChecker.Status status = accessChecker.check(currentUser, module);
            if(! AccessChecker.Status.VALID.equals(status)) {
                throw new Exception("Authorization status is " + status + ".");
            }
            
            com.mazars.management.db.domain.TaxInvoiceRequest taxInvoiceRequest = (com.mazars.management.db.domain.TaxInvoiceRequest)hs.get(com.mazars.management.db.domain.TaxInvoiceRequest.class, id);
            if(taxInvoiceRequest == null) {
                throw new Exception("TaxInvoice request not found");
            }
            InvoiceRequestPacket invoiceRequestPacket = taxInvoiceRequest.getInvoiceRequestPacket();
            if(Employee.Profile.COUNTRY_ADMINISTRATOR.equals(currentUser.getProfile())) {
                Country country = currentUser.getCountry();
                Country taxInvoiceRequestCountry = invoiceRequestPacket.getProjectCode().getSubdepartment().getDepartment().getOffice().getCountry();
                if(! country.getId().equals(taxInvoiceRequestCountry.getId())) {
                    throw new Exception("TaxInvoice request of other country");
                }
            } else if(Employee.Profile.SUPER_USER.equals(currentUser.getProfile())) {
                Subdepartment taxInvoiceRequestSubdepartment = invoiceRequestPacket.getProjectCode().getSubdepartment();
                if(! RightsItem.isAvailable(taxInvoiceRequestSubdepartment, currentUser, module)) {
                    throw new Exception("No rights to the subdepartment of this taxInvoice request");
                }
            }
            
            if(com.mazars.management.db.domain.InvoiceRequestPacket.Status.SUSPENDED.equals(invoiceRequestPacket.getStatus())) {
                throw new Exception("TaxInvoice request status is SUSPENDED");
            }
            taxInvoiceRequestVO = new TaxInvoiceRequestVO(taxInvoiceRequest);
            
            if(! Boolean.FALSE.equals(lockAfterReading)) {
                if(com.mazars.management.db.domain.InvoiceRequestPacket.Status.ACTIVE.equals(invoiceRequestPacket.getStatus())) {
                    invoiceRequestPacket.setStatus(com.mazars.management.db.domain.InvoiceRequestPacket.Status.LOCKED);
                    hs.save(invoiceRequestPacket);
                    
                    InvoiceRequestPacketHistoryItem invoiceRequestPacketHistoryItem = new InvoiceRequestPacketHistoryItem();
                    invoiceRequestPacketHistoryItem.setEmployee(currentUser);
                    invoiceRequestPacketHistoryItem.setStatus(com.mazars.management.db.domain.InvoiceRequestPacket.Status.LOCKED);
                    invoiceRequestPacketHistoryItem.setTime(now);
                    invoiceRequestPacketHistoryItem.setComment("Tax Invoice Request (" + taxInvoiceRequest.getId() + ") locked in getTaxInvoiceRequest");
                    invoiceRequestPacketHistoryItem.setInvoiceRequestPacket(invoiceRequestPacket);
                    hs.save(invoiceRequestPacketHistoryItem);
                }
            }
            
            hs.getTransaction().commit();
        } catch (Exception e) {
            hs.getTransaction().rollback();
            throw e;
        }    
        return taxInvoiceRequestVO;
    }

    /**
     * Операция веб-службы
     */

    @WebMethod(operationName = "putTaxInvoiceRequestData")
    public void putTaxInvoiceRequestData(
            @WebParam(name = "userName", targetNamespace = "http://services.webservices.management.mazars.com/") String userName,
            @WebParam(name = "password", targetNamespace = "http://services.webservices.management.mazars.com/") String password,
            @WebParam(name = "id", targetNamespace = "http://services.webservices.management.mazars.com/") Long id,
            @WebParam(name = "reference", targetNamespace = "http://services.webservices.management.mazars.com/") String reference
            ) throws Exception {
        Date now = new Date();
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        try {
            hs.beginTransaction();
            
            AccessChecker accessChecker = new AccessChecker();
            Employee currentUser = accessChecker.authenticate(userName, password);
            Module module = Module.getByName("Financial Information Report");
            AccessChecker.Status status = accessChecker.check(currentUser, module);
            if(! AccessChecker.Status.VALID.equals(status)) {
                throw new Exception("Authorization status is " + status + ".");
            }

            if(id == null) {
                throw new Exception("id is not set");
            }
            if(reference == null || "".equals(reference)) {
                throw new Exception("reference is not set");
            }
            
            com.mazars.management.db.domain.TaxInvoiceRequest taxInvoiceRequest = (com.mazars.management.db.domain.TaxInvoiceRequest)hs.get(com.mazars.management.db.domain.TaxInvoiceRequest.class, id);
            if(taxInvoiceRequest == null) {
                throw new Exception("TaxInvoice request not found");
            }
            InvoiceRequestPacket invoiceRequestPacket = taxInvoiceRequest.getInvoiceRequestPacket();
            if(Employee.Profile.COUNTRY_ADMINISTRATOR.equals(currentUser.getProfile())) {
                Country country = currentUser.getCountry();
                Country taxInvoiceRequestCountry = invoiceRequestPacket.getProjectCode().getSubdepartment().getDepartment().getOffice().getCountry();
                if(! country.getId().equals(taxInvoiceRequestCountry.getId())) {
                    throw new Exception("TaxInvoice request of other country");
                }
            } else if(Employee.Profile.SUPER_USER.equals(currentUser.getProfile())) {
                Subdepartment taxInvoiceRequestSubdepartment = invoiceRequestPacket.getProjectCode().getSubdepartment();
                if(! RightsItem.isAvailable(taxInvoiceRequestSubdepartment, currentUser, module)) {
                    throw new Exception("No rights to the subdepartment of this taxInvoice request");
                }
            }
            
            if(! com.mazars.management.db.domain.InvoiceRequestPacket.Status.LOCKED.equals(invoiceRequestPacket.getStatus())) {
                throw new Exception("TaxInvoice request status is not LOCKED");
            }
            taxInvoiceRequest.setReference(reference);
            if(Boolean.TRUE.equals(taxInvoiceRequest.getIsCancelled())) {
                taxInvoiceRequest.setIsExternallyCancelled(Boolean.TRUE);
            } else {
                taxInvoiceRequest.setIsExternallyCancelled(Boolean.FALSE);
            }
            hs.save(taxInvoiceRequest);

            InvoiceRequestPacketHistoryItem invoiceRequestPacketHistoryItem = new InvoiceRequestPacketHistoryItem();
            invoiceRequestPacketHistoryItem.setEmployee(currentUser);
            invoiceRequestPacketHistoryItem.setStatus(com.mazars.management.db.domain.InvoiceRequestPacket.Status.CLOSED);
            invoiceRequestPacketHistoryItem.setTime(now);
            invoiceRequestPacketHistoryItem.setComment("Tax Invoice Request (" + taxInvoiceRequest.getId() + ") updated in putTaxInvoiceRequestData");
            invoiceRequestPacketHistoryItem.setInvoiceRequestPacket(invoiceRequestPacket);
            hs.save(invoiceRequestPacketHistoryItem);
            
            hs.getTransaction().commit();
        } catch (Exception e) {
            hs.getTransaction().rollback();
            throw e;
        }    
    }

    
    
    
    @WebMethod(operationName = "getAvailableInvoiceRequestPackets")
    @WebResult(name = "return", targetNamespace = "http://services.webservices.management.mazars.com/")
    public java.util.List<com.mazars.management.webservices.vo.InvoiceRequestPacketVO> getAvailableInvoiceRequestPackets(
            @WebParam(name = "userName", targetNamespace = "http://services.webservices.management.mazars.com/") String userName,
            @WebParam(name = "password", targetNamespace = "http://services.webservices.management.mazars.com/") String password,
            @WebParam(name = "lockAfterReading", targetNamespace = "http://services.webservices.management.mazars.com/") Boolean lockAfterReading
        ) throws Exception {
        List<com.mazars.management.webservices.vo.InvoiceRequestPacketVO> invoiceRequestPacketVOs = new LinkedList<com.mazars.management.webservices.vo.InvoiceRequestPacketVO>();

        Date now = new Date();
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        try {
            hs.beginTransaction();
            
            AccessChecker accessChecker = new AccessChecker();
            Employee currentUser = accessChecker.authenticate(userName, password);
            Module module = Module.getByName("Financial Information Report");
            AccessChecker.Status status = accessChecker.check(currentUser, module);
            if(! AccessChecker.Status.VALID.equals(status)) {
                throw new Exception("Authorization status is " + status + ".");
            }
            
            List<com.mazars.management.db.domain.InvoiceRequestPacket> invoiceRequestPackets = new LinkedList<com.mazars.management.db.domain.InvoiceRequestPacket>();
            if(Employee.Profile.COUNTRY_ADMINISTRATOR.equals(currentUser.getProfile())) {
                Country country = currentUser.getCountry();
                invoiceRequestPackets = com.mazars.management.db.domain.InvoiceRequestPacket.getList(country, com.mazars.management.db.domain.InvoiceRequestPacket.getAvailabilityStatuses());
            } else if(Employee.Profile.SUPER_USER.equals(currentUser.getProfile())) {
                invoiceRequestPackets = com.mazars.management.db.domain.InvoiceRequestPacket.getList(currentUser, module, com.mazars.management.db.domain.InvoiceRequestPacket.getAvailabilityStatuses());
            }

            for(com.mazars.management.db.domain.InvoiceRequestPacket invoiceRequestPacket : invoiceRequestPackets) {
                InvoiceRequestPacketVO invoiceRequestPacketVO = new InvoiceRequestPacketVO(invoiceRequestPacket);
                invoiceRequestPacketVOs.add(invoiceRequestPacketVO);
                
                if(! Boolean.FALSE.equals(lockAfterReading)) {
                    if(com.mazars.management.db.domain.InvoiceRequestPacket.Status.ACTIVE.equals(invoiceRequestPacket.getStatus())) {
                        invoiceRequestPacket.setStatus(com.mazars.management.db.domain.InvoiceRequestPacket.Status.LOCKED);
                        hs.save(invoiceRequestPacket);
                        
                        InvoiceRequestPacketHistoryItem invoiceRequestPacketHistoryItem = new InvoiceRequestPacketHistoryItem();
                        invoiceRequestPacketHistoryItem.setEmployee(currentUser);
                        invoiceRequestPacketHistoryItem.setStatus(com.mazars.management.db.domain.InvoiceRequestPacket.Status.LOCKED);
                        invoiceRequestPacketHistoryItem.setTime(now);
                        invoiceRequestPacketHistoryItem.setComment("Invoice Request Packet (" + invoiceRequestPacket.getId() + ") locked in getAvailableInvoiceRequestPackets");
                        invoiceRequestPacketHistoryItem.setInvoiceRequestPacket(invoiceRequestPacket);
                        hs.save(invoiceRequestPacketHistoryItem);                        
                    }
                }
            }
            hs.getTransaction().commit();
        } catch (Exception e) {
            hs.getTransaction().rollback();
            throw e;
        }    
        return invoiceRequestPacketVOs;
    }

    /**
     * Операция веб-службы
     */
    
    @WebMethod(operationName = "getInvoiceRequestPacket")
    @WebResult(name = "return", targetNamespace = "http://services.webservices.management.mazars.com/")
    public com.mazars.management.webservices.vo.InvoiceRequestPacketVO getInvoiceRequestPacket(
            @WebParam(name = "userName", targetNamespace = "http://services.webservices.management.mazars.com/") String userName,
            @WebParam(name = "password", targetNamespace = "http://services.webservices.management.mazars.com/") String password,
            @WebParam(name = "id", targetNamespace = "http://services.webservices.management.mazars.com/") Long id,
            @WebParam(name = "lockAfterReading", targetNamespace = "http://services.webservices.management.mazars.com/") Boolean lockAfterReading
            ) throws Exception {
        com.mazars.management.webservices.vo.InvoiceRequestPacketVO invoiceRequestPacketVO = new com.mazars.management.webservices.vo.InvoiceRequestPacketVO();

        Date now = new Date();
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        try {
            hs.beginTransaction();
            
            AccessChecker accessChecker = new AccessChecker();
            Employee currentUser = accessChecker.authenticate(userName, password);
            Module module = Module.getByName("Financial Information Report");
            AccessChecker.Status status = accessChecker.check(currentUser, module);
            if(! AccessChecker.Status.VALID.equals(status)) {
                throw new Exception("Authorization status is " + status + ".");
            }
            
            com.mazars.management.db.domain.InvoiceRequestPacket invoiceRequestPacket = (com.mazars.management.db.domain.InvoiceRequestPacket)hs.get(com.mazars.management.db.domain.InvoiceRequestPacket.class, id);
            if(invoiceRequestPacket == null) {
                throw new Exception("Invoice Request Packet not found");
            }

            if(Employee.Profile.COUNTRY_ADMINISTRATOR.equals(currentUser.getProfile())) {
                Country country = currentUser.getCountry();
                Country invoiceRequestCountry = invoiceRequestPacket.getProjectCode().getSubdepartment().getDepartment().getOffice().getCountry();
                if(! country.getId().equals(invoiceRequestCountry.getId())) {
                    throw new Exception("Invoice request packet of other country");
                }
            } else if(Employee.Profile.SUPER_USER.equals(currentUser.getProfile())) {
                Subdepartment invoiceRequestSubdepartment = invoiceRequestPacket.getProjectCode().getSubdepartment();
                if(! RightsItem.isAvailable(invoiceRequestSubdepartment, currentUser, module)) {
                    throw new Exception("No rights to the subdepartment of this invoice request packet");
                }
            }
            
            if(com.mazars.management.db.domain.InvoiceRequestPacket.Status.SUSPENDED.equals(invoiceRequestPacket.getStatus())) {
                throw new Exception("Invoice request packet status is SUSPENDED");
            }
            invoiceRequestPacketVO = new InvoiceRequestPacketVO(invoiceRequestPacket);
            
            if(! Boolean.FALSE.equals(lockAfterReading)) {
                if(com.mazars.management.db.domain.InvoiceRequestPacket.Status.ACTIVE.equals(invoiceRequestPacket.getStatus())) {
                    invoiceRequestPacket.setStatus(com.mazars.management.db.domain.InvoiceRequestPacket.Status.LOCKED);
                    hs.save(invoiceRequestPacket);
                    
                    InvoiceRequestPacketHistoryItem invoiceRequestPacketHistoryItem = new InvoiceRequestPacketHistoryItem();
                    invoiceRequestPacketHistoryItem.setEmployee(currentUser);
                    invoiceRequestPacketHistoryItem.setStatus(com.mazars.management.db.domain.InvoiceRequestPacket.Status.LOCKED);
                    invoiceRequestPacketHistoryItem.setTime(now);
                    invoiceRequestPacketHistoryItem.setComment("Invoice Request Packet (" + invoiceRequestPacket.getId() + ") locked in getInvoiceRequestPacket");
                    invoiceRequestPacketHistoryItem.setInvoiceRequestPacket(invoiceRequestPacket);
                    hs.save(invoiceRequestPacketHistoryItem);
                }
            }
            
            hs.getTransaction().commit();
        } catch (Exception e) {
            hs.getTransaction().rollback();
            throw e;
        }    
        return invoiceRequestPacketVO;
    }
    
    @WebMethod(operationName = "closeInvoiceRequestPacket")
    public void closeInvoiceRequestPacket(
            @WebParam(name = "userName", targetNamespace = "http://services.webservices.management.mazars.com/") String userName,
            @WebParam(name = "password", targetNamespace = "http://services.webservices.management.mazars.com/") String password,
            @WebParam(name = "id", targetNamespace = "http://services.webservices.management.mazars.com/") Long id
            ) throws Exception {
        Date now = new Date();
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        try {
            hs.beginTransaction();
            
            AccessChecker accessChecker = new AccessChecker();
            Employee currentUser = accessChecker.authenticate(userName, password);
            Module module = Module.getByName("Financial Information Report");
            AccessChecker.Status status = accessChecker.check(currentUser, module);
            if(! AccessChecker.Status.VALID.equals(status)) {
                throw new Exception("Authorization status is " + status + ".");
            }

            if(id == null) {
                throw new Exception("id is not set");
            }
            
            com.mazars.management.db.domain.InvoiceRequestPacket invoiceRequestPacket = (com.mazars.management.db.domain.InvoiceRequestPacket)hs.get(com.mazars.management.db.domain.InvoiceRequestPacket.class, id);
            if(invoiceRequestPacket == null) {
                throw new Exception("Invoice Request Packet not found");
            }
            if(Employee.Profile.COUNTRY_ADMINISTRATOR.equals(currentUser.getProfile())) {
                Country country = currentUser.getCountry();
                Country invoiceRequestPacketCountry = invoiceRequestPacket.getProjectCode().getSubdepartment().getDepartment().getOffice().getCountry();
                if(! country.getId().equals(invoiceRequestPacketCountry.getId())) {
                    throw new Exception("Invoice Request Packet of other country");
                }
            } else if(Employee.Profile.SUPER_USER.equals(currentUser.getProfile())) {
                Subdepartment invoiceRequestSubdepartment = invoiceRequestPacket.getProjectCode().getSubdepartment();
                if(! RightsItem.isAvailable(invoiceRequestSubdepartment, currentUser, module)) {
                    throw new Exception("No rights to the subdepartment of this Invoice Request Packet");
                }
            }
            
            if(! com.mazars.management.db.domain.InvoiceRequestPacket.Status.LOCKED.equals(invoiceRequestPacket.getStatus())) {
                throw new Exception("Invoice Request Packet status is not LOCKED");
            }
            invoiceRequestPacket.setStatus(com.mazars.management.db.domain.InvoiceRequestPacket.Status.CLOSED);
            hs.save(invoiceRequestPacket);

            InvoiceRequestPacketHistoryItem invoiceRequestPacketHistoryItem = new InvoiceRequestPacketHistoryItem();
            invoiceRequestPacketHistoryItem.setEmployee(currentUser);
            invoiceRequestPacketHistoryItem.setStatus(com.mazars.management.db.domain.InvoiceRequestPacket.Status.CLOSED);
            invoiceRequestPacketHistoryItem.setTime(now);
            invoiceRequestPacketHistoryItem.setComment("Invoice Request Packet closed in closeInvoiceRequestPacket");
            invoiceRequestPacketHistoryItem.setInvoiceRequestPacket(invoiceRequestPacket);
            hs.save(invoiceRequestPacketHistoryItem);
            
            hs.getTransaction().commit();
        } catch (Exception e) {
            hs.getTransaction().rollback();
            throw e;
        }    
    }

    
    
    
    
    @WebMethod(operationName = "getAvailableOutOfPocketRequests")
    @WebResult(name = "return", targetNamespace = "http://services.webservices.management.mazars.com/")
    public java.util.List<com.mazars.management.webservices.vo.OutOfPocketRequestVO> getAvailableOutOfPocketRequests(
            @WebParam(name = "userName", targetNamespace = "http://services.webservices.management.mazars.com/") String userName,
            @WebParam(name = "password", targetNamespace = "http://services.webservices.management.mazars.com/") String password,
            @WebParam(name = "lockAfterReading", targetNamespace = "http://services.webservices.management.mazars.com/") Boolean lockAfterReading
        ) throws Exception {
        List<com.mazars.management.webservices.vo.OutOfPocketRequestVO> outOfPocketRequestVOs = new LinkedList<com.mazars.management.webservices.vo.OutOfPocketRequestVO>();

        Date now = new Date();
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        try {
            hs.beginTransaction();
            
            AccessChecker accessChecker = new AccessChecker();
            Employee currentUser = accessChecker.authenticate(userName, password);
            Module module = Module.getByName("Financial Information Report");
            AccessChecker.Status status = accessChecker.check(currentUser, module);
            if(! AccessChecker.Status.VALID.equals(status)) {
                throw new Exception("Authorization status is " + status + ".");
            }
            
            List<com.mazars.management.db.domain.OutOfPocketRequest> outOfPocketRequests = new LinkedList<com.mazars.management.db.domain.OutOfPocketRequest>();
            if(Employee.Profile.COUNTRY_ADMINISTRATOR.equals(currentUser.getProfile())) {
                Country country = currentUser.getCountry();
                outOfPocketRequests = com.mazars.management.db.domain.OutOfPocketRequest.getList(country, com.mazars.management.db.domain.InvoiceRequestPacket.getAvailabilityStatuses());
            } else if(Employee.Profile.SUPER_USER.equals(currentUser.getProfile())) {
                outOfPocketRequests = com.mazars.management.db.domain.OutOfPocketRequest.getList(currentUser, module, com.mazars.management.db.domain.InvoiceRequestPacket.getAvailabilityStatuses());
            }

            for(com.mazars.management.db.domain.OutOfPocketRequest outOfPocketRequest : outOfPocketRequests) {
                com.mazars.management.webservices.vo.OutOfPocketRequestVO outOfPocketRequestVO = new com.mazars.management.webservices.vo.OutOfPocketRequestVO(outOfPocketRequest);
                outOfPocketRequestVOs.add(outOfPocketRequestVO);
                
                if(! Boolean.FALSE.equals(lockAfterReading)) {
                    if(com.mazars.management.db.domain.InvoiceRequestPacket.Status.ACTIVE.equals(outOfPocketRequest.getStatus())) {
                        outOfPocketRequest.setStatus(com.mazars.management.db.domain.InvoiceRequestPacket.Status.LOCKED);
                        hs.save(outOfPocketRequest);
                        
                        OutOfPocketRequestHistoryItem outOfPocketRequestHistoryItem = new OutOfPocketRequestHistoryItem();
                        outOfPocketRequestHistoryItem.setEmployee(currentUser);
                        outOfPocketRequestHistoryItem.setStatus(com.mazars.management.db.domain.InvoiceRequestPacket.Status.LOCKED);
                        outOfPocketRequestHistoryItem.setTime(now);
                        outOfPocketRequestHistoryItem.setComment("Out of pocket request locked in getAvailableOutOfPocketRequests");
                        outOfPocketRequestHistoryItem.setOutOfPocketRequest(outOfPocketRequest);
                        hs.save(outOfPocketRequestHistoryItem);                        
                    }
                }
            }
            hs.getTransaction().commit();
        } catch (Exception e) {
            hs.getTransaction().rollback();
            throw e;
        }    
        return outOfPocketRequestVOs;
    }
    
    @WebMethod(operationName = "getOutOfPocketRequest")
    @WebResult(name = "return", targetNamespace = "http://services.webservices.management.mazars.com/")
    public com.mazars.management.webservices.vo.OutOfPocketRequestVO getOutOfPocketRequest(
            @WebParam(name = "userName", targetNamespace = "http://services.webservices.management.mazars.com/") String userName,
            @WebParam(name = "password", targetNamespace = "http://services.webservices.management.mazars.com/") String password,
            @WebParam(name = "id", targetNamespace = "http://services.webservices.management.mazars.com/") Long id,
            @WebParam(name = "lockAfterReading", targetNamespace = "http://services.webservices.management.mazars.com/") Boolean lockAfterReading
        ) throws Exception {

        com.mazars.management.webservices.vo.OutOfPocketRequestVO outOfPocketRequestVO = null;
        Date now = new Date();
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        try {
            hs.beginTransaction();
            
            AccessChecker accessChecker = new AccessChecker();
            Employee currentUser = accessChecker.authenticate(userName, password);
            Module module = Module.getByName("Financial Information Report");
            AccessChecker.Status status = accessChecker.check(currentUser, module);
            if(! AccessChecker.Status.VALID.equals(status)) {
                throw new Exception("Authorization status is " + status + ".");
            }
            
            com.mazars.management.db.domain.OutOfPocketRequest outOfPocketRequest = (com.mazars.management.db.domain.OutOfPocketRequest)hs.get(com.mazars.management.db.domain.OutOfPocketRequest.class, id);
            if(outOfPocketRequest == null) {
                throw new Exception("OutOfPocketRequest not found");
            }

            if(Employee.Profile.COUNTRY_ADMINISTRATOR.equals(currentUser.getProfile())) {
                Country country = currentUser.getCountry();
                Country outOfPocketRequestCountry = outOfPocketRequest.getProjectCode().getSubdepartment().getDepartment().getOffice().getCountry();
                if(! country.getId().equals(outOfPocketRequestCountry.getId())) {
                    throw new Exception("OutOfPocketRequest of other country");
                }
            } else if(Employee.Profile.SUPER_USER.equals(currentUser.getProfile())) {
                Subdepartment outOfPocketRequestSubdepartment = outOfPocketRequest.getProjectCode().getSubdepartment();
                if(! RightsItem.isAvailable(outOfPocketRequestSubdepartment, currentUser, module)) {
                    throw new Exception("No rights to the subdepartment of this OutOfPocketRequest");
                }
            }
            
            if(com.mazars.management.db.domain.InvoiceRequestPacket.Status.SUSPENDED.equals(outOfPocketRequest.getStatus())) {
                throw new Exception("OutOfPocketRequest status is SUSPENDED");
            }
            outOfPocketRequestVO = new com.mazars.management.webservices.vo.OutOfPocketRequestVO(outOfPocketRequest);

                
            if(! Boolean.FALSE.equals(lockAfterReading)) {
                if(com.mazars.management.db.domain.InvoiceRequestPacket.Status.ACTIVE.equals(outOfPocketRequest.getStatus())) {
                    outOfPocketRequest.setStatus(com.mazars.management.db.domain.InvoiceRequestPacket.Status.LOCKED);
                    hs.save(outOfPocketRequest);

                    OutOfPocketRequestHistoryItem outOfPocketRequestHistoryItem = new OutOfPocketRequestHistoryItem();
                    outOfPocketRequestHistoryItem.setEmployee(currentUser);
                    outOfPocketRequestHistoryItem.setStatus(com.mazars.management.db.domain.InvoiceRequestPacket.Status.LOCKED);
                    outOfPocketRequestHistoryItem.setTime(now);
                    outOfPocketRequestHistoryItem.setComment("Out of pocket request locked in getAvailableOutOfPocketRequests");
                    outOfPocketRequestHistoryItem.setOutOfPocketRequest(outOfPocketRequest);
                    hs.save(outOfPocketRequestHistoryItem);                        
                }
            }
            
            hs.getTransaction().commit();
        } catch (Exception e) {
            hs.getTransaction().rollback();
            throw e;
        }    
        return outOfPocketRequestVO;
    }
    
    
    @WebMethod(operationName = "closeOutOfPocketRequest")
    public void closeOutOfPocketRequest(
            @WebParam(name = "userName", targetNamespace = "http://services.webservices.management.mazars.com/") String userName,
            @WebParam(name = "password", targetNamespace = "http://services.webservices.management.mazars.com/") String password,
            @WebParam(name = "id", targetNamespace = "http://services.webservices.management.mazars.com/") Long id
            ) throws Exception {
        Date now = new Date();
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        try {
            hs.beginTransaction();
            
            AccessChecker accessChecker = new AccessChecker();
            Employee currentUser = accessChecker.authenticate(userName, password);
            Module module = Module.getByName("Financial Information Report");
            AccessChecker.Status status = accessChecker.check(currentUser, module);
            if(! AccessChecker.Status.VALID.equals(status)) {
                throw new Exception("Authorization status is " + status + ".");
            }

            if(id == null) {
                throw new Exception("id is not set");
            }
            
            com.mazars.management.db.domain.OutOfPocketRequest outOfPocketRequest = (com.mazars.management.db.domain.OutOfPocketRequest)hs.get(com.mazars.management.db.domain.OutOfPocketRequest.class, id);
            if(outOfPocketRequest == null) {
                throw new Exception("OutOfPocketRequest not found");
            }
            if(Employee.Profile.COUNTRY_ADMINISTRATOR.equals(currentUser.getProfile())) {
                Country country = currentUser.getCountry();
                Country outOfPocketRequestCountry = outOfPocketRequest.getProjectCode().getSubdepartment().getDepartment().getOffice().getCountry();
                if(! country.getId().equals(outOfPocketRequestCountry.getId())) {
                    throw new Exception("OutOfPocketRequest of other country");
                }
            } else if(Employee.Profile.SUPER_USER.equals(currentUser.getProfile())) {
                Subdepartment outOfPocketRequestSubdepartment = outOfPocketRequest.getProjectCode().getSubdepartment();
                if(! RightsItem.isAvailable(outOfPocketRequestSubdepartment, currentUser, module)) {
                    throw new Exception("No rights to the subdepartment of this OutOfPocketRequest");
                }
            }
            
            if(! com.mazars.management.db.domain.InvoiceRequestPacket.Status.LOCKED.equals(outOfPocketRequest.getStatus())) {
                throw new Exception("OutOfPocketRequest status is not LOCKED");
            }
            outOfPocketRequest.setStatus(com.mazars.management.db.domain.InvoiceRequestPacket.Status.CLOSED);
            hs.save(outOfPocketRequest);

            OutOfPocketRequestHistoryItem outOfPocketRequestHistoryItem = new OutOfPocketRequestHistoryItem();
            outOfPocketRequestHistoryItem.setEmployee(currentUser);
            outOfPocketRequestHistoryItem.setStatus(com.mazars.management.db.domain.InvoiceRequestPacket.Status.CLOSED);
            outOfPocketRequestHistoryItem.setTime(now);
            outOfPocketRequestHistoryItem.setComment("OutOfPocketRequest closed in closeOutOfPocketRequest");
            outOfPocketRequestHistoryItem.setOutOfPocketRequest(outOfPocketRequest);
            hs.save(outOfPocketRequestHistoryItem);
            
            hs.getTransaction().commit();
        } catch (Exception e) {
            hs.getTransaction().rollback();
            throw e;
        }    
    }
    
    @WebMethod(operationName = "putOutOfPocketInvoiceData")
    public void putOutOfPocketInvoiceData(
            @WebParam(name = "userName", targetNamespace = "http://services.webservices.management.mazars.com/") String userName,
            @WebParam(name = "password", targetNamespace = "http://services.webservices.management.mazars.com/") String password,
            @WebParam(name = "code", targetNamespace = "http://services.webservices.management.mazars.com/") String code,
            @WebParam(name = "reference", targetNamespace = "http://services.webservices.management.mazars.com/") String reference,
            @WebParam(name = "date", targetNamespace = "http://services.webservices.management.mazars.com/") Calendar date,
            @WebParam(name = "amount", targetNamespace = "http://services.webservices.management.mazars.com/") BigDecimal amount,
            @WebParam(name = "vatIncludedAmount", targetNamespace = "http://services.webservices.management.mazars.com/") BigDecimal vatIncludedAmount,
            @WebParam(name = "currencyCode", targetNamespace = "http://services.webservices.management.mazars.com/") String currencyCode
            ) throws Exception {

        Date now = new Date();
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        try {
            hs.beginTransaction();
            
            AccessChecker accessChecker = new AccessChecker();
            Employee currentUser = accessChecker.authenticate(userName, password);
            Module module = Module.getByName("Financial Information Report");
            AccessChecker.Status status = accessChecker.check(currentUser, module);
            if(! AccessChecker.Status.VALID.equals(status)) {
                throw new Exception("Authorization status is " + status + ".");
            }
            
            if(code == null) {
                throw new Exception("code is not set");
            }
            if(reference == null || "".equals(reference)) {
                throw new Exception("reference is not set");
            }
            if(date == null) {
                throw new Exception("date is not set");
            }
            if(amount == null) {
                throw new Exception("amount is not set");
            }
            if(vatIncludedAmount == null) {
                throw new Exception("vatIncludedAmount is not set");
            }
            Currency currency = null;
            if(currencyCode == null || "".equals(currencyCode)) {
                throw new Exception("currencyCode is not set");
            } else {
                currency = Currency.getByCode(currencyCode);
                if(currency == null) {
                    throw new Exception("currencyCode is not good");
                }
            }    
            
            ProjectCode projectCode = ProjectCode.getByCode(code);
            if(projectCode == null) {
                throw new Exception("projectCode not found");
            }
            com.mazars.management.db.domain.OutOfPocketRequest outOfPocketRequest = projectCode.getOutOfPocketRequest();

            if(Employee.Profile.COUNTRY_ADMINISTRATOR.equals(currentUser.getProfile())) {
                Country country = currentUser.getCountry();
                Country projectCodeCountry = projectCode.getSubdepartment().getDepartment().getOffice().getCountry();
                if(! country.getId().equals(projectCodeCountry.getId())) {
                    throw new Exception("projectCode of other country");
                }
            } else if(Employee.Profile.SUPER_USER.equals(currentUser.getProfile())) {
                Subdepartment projectCodeSubdepartment = projectCode.getSubdepartment();
                if(! RightsItem.isAvailable(projectCodeSubdepartment, currentUser, module)) {
                    throw new Exception("No rights to the subdepartment of this projectCode");
                }
            }
            
            if(outOfPocketRequest == null) {
                throw new Exception("OutOfPocketRequest not found");
            } else if(com.mazars.management.db.domain.InvoiceRequestPacket.Status.SUSPENDED.equals(outOfPocketRequest.getStatus())) {
                throw new Exception("OutOfPocketRequest status is SUSPENDED");
            } else if(com.mazars.management.db.domain.InvoiceRequestPacket.Status.ACTIVE.equals(outOfPocketRequest.getStatus())) {
                throw new Exception("OutOfPocketRequest status is neither LOCKED nor CLOSED");
            } else if(OutOfPocketItem.Type.NO.equals(outOfPocketRequest.getType())) {
                throw new Exception("OutOfPocketRequest type is NO");  
            }
            
            CalendarUtil.truncateTime(date);
            
            OutOfPocketItem outOfPocketItem = outOfPocketRequest.getProjectCode().getOutOfPocketItem();
            if(outOfPocketItem == null) {
                outOfPocketItem = new OutOfPocketItem();
                outOfPocketItem.setProjectCode(outOfPocketRequest.getProjectCode());
            }
            outOfPocketItem.setType(outOfPocketRequest.getType());
            if(OutOfPocketItem.Type.LIMITED.equals(outOfPocketItem.getType())) {
                outOfPocketItem.setAmount(outOfPocketRequest.getAmount());
                outOfPocketItem.setCurrency(outOfPocketRequest.getCurrency());            
            } else {
                outOfPocketItem.setAmount(null);
                outOfPocketItem.setCurrency(null);            
            }
            outOfPocketItem.setOutOfPocketInvoiceCurrency(currency);
            if(! outOfPocketItem.hasOutOfPocketPayments()) {
                outOfPocketItem.setOutOfPocketPaymentCurrency(currency);
            } 
            if(! outOfPocketItem.hasOutOfPocketActs()) {
                outOfPocketItem.setOutOfPocketActCurrency(currency);
            }           
            hs.save(outOfPocketItem);
            
            OutOfPocketInvoice outOfPocketInvoice = null;
            for(OutOfPocketInvoice tmpOutOfPocketInvoice : outOfPocketItem.getOutOfPocketInvoices()) {
                if(tmpOutOfPocketInvoice.getReference() != null && tmpOutOfPocketInvoice.getReference().equals(reference)) {
                    outOfPocketInvoice = tmpOutOfPocketInvoice;
                    break;
                }
            }
            if(outOfPocketInvoice == null) {
                outOfPocketInvoice = new OutOfPocketInvoice();
                outOfPocketInvoice.setOutOfPocketItem(outOfPocketItem);
                outOfPocketInvoice.setReference(reference);
            }
            outOfPocketInvoice.setAmount(amount);
            outOfPocketInvoice.setVatIncludedAmount(vatIncludedAmount);
            outOfPocketInvoice.setDate(date);
            SimpleDateFormat longDateFormatter = new SimpleDateFormat("yyyyMMddHHmmss");
            String stamp = currentUser.getUserName() + "_" + longDateFormatter.format(new Date());
            outOfPocketInvoice.setStamp(stamp);
            hs.save(outOfPocketInvoice);
            
            OutOfPocketRequestHistoryItem outOfPocketRequestHistoryItem = new OutOfPocketRequestHistoryItem();
            outOfPocketRequestHistoryItem.setEmployee(currentUser);
            outOfPocketRequestHistoryItem.setStatus(com.mazars.management.db.domain.InvoiceRequestPacket.Status.CLOSED);
            outOfPocketRequestHistoryItem.setTime(now);
            outOfPocketRequestHistoryItem.setComment("OutOfPocketRequest updated in putOutOfPocketRequestInvoiceData");
            outOfPocketRequestHistoryItem.setOutOfPocketRequest(outOfPocketRequest);
            hs.save(outOfPocketRequestHistoryItem);

            hs.getTransaction().commit();
        } catch (Exception e) {
            hs.getTransaction().rollback();
            throw e;
        }
        
    }
    
    @WebMethod(operationName = "putOutOfPocketActData")
    public void putOutOfPocketActData(
            @WebParam(name = "userName", targetNamespace = "http://services.webservices.management.mazars.com/") String userName,
            @WebParam(name = "password", targetNamespace = "http://services.webservices.management.mazars.com/") String password,
            @WebParam(name = "code", targetNamespace = "http://services.webservices.management.mazars.com/") String code,
            @WebParam(name = "reference", targetNamespace = "http://services.webservices.management.mazars.com/") String reference,
            @WebParam(name = "date", targetNamespace = "http://services.webservices.management.mazars.com/") Calendar date,
            @WebParam(name = "amount", targetNamespace = "http://services.webservices.management.mazars.com/") BigDecimal amount,
            @WebParam(name = "currencyCode", targetNamespace = "http://services.webservices.management.mazars.com/") String currencyCode,
            @WebParam(name = "cvAmount", targetNamespace = "http://services.webservices.management.mazars.com/") BigDecimal cvAmount
            ) throws Exception {

        Date now = new Date();
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        try {
            hs.beginTransaction();
            
            AccessChecker accessChecker = new AccessChecker();
            Employee currentUser = accessChecker.authenticate(userName, password);
            Module module = Module.getByName("Financial Information Report");
            AccessChecker.Status status = accessChecker.check(currentUser, module);
            if(! AccessChecker.Status.VALID.equals(status)) {
                throw new Exception("Authorization status is " + status + ".");
            }
            
            if(code == null) {
                throw new Exception("code is not set");
            }
            if(reference == null || "".equals(reference)) {
                throw new Exception("reference is not set");
            }
            if(date == null) {
                throw new Exception("date is not set");
            }
            if(amount == null) {
                throw new Exception("amount is not set");
            }
            if(cvAmount == null) {
                throw new Exception("cvAmount is not set");
            }
            Currency currency = null;
            if(currencyCode == null || "".equals(currencyCode)) {
                throw new Exception("currencyCode is not set");
            } else {
                currency = Currency.getByCode(currencyCode);
                if(currency == null) {
                    throw new Exception("currencyCode is not good");
                }
            }           
            ProjectCode projectCode = ProjectCode.getByCode(code);
            if(projectCode == null) {
                throw new Exception("projectCode not found");
            }
            com.mazars.management.db.domain.OutOfPocketRequest outOfPocketRequest = projectCode.getOutOfPocketRequest();

            if(Employee.Profile.COUNTRY_ADMINISTRATOR.equals(currentUser.getProfile())) {
                Country country = currentUser.getCountry();
                Country outOfPocketRequestCountry = outOfPocketRequest.getProjectCode().getSubdepartment().getDepartment().getOffice().getCountry();
                if(! country.getId().equals(outOfPocketRequestCountry.getId())) {
                    throw new Exception("OutOfPocket request of other country");
                }
            } else if(Employee.Profile.SUPER_USER.equals(currentUser.getProfile())) {
                Subdepartment outOfPocketRequestSubdepartment = outOfPocketRequest.getProjectCode().getSubdepartment();
                if(! RightsItem.isAvailable(outOfPocketRequestSubdepartment, currentUser, module)) {
                    throw new Exception("No rights to the subdepartment of this OutOfPocketRequest");
                }
            }
            
            
            if(outOfPocketRequest == null) {
                throw new Exception("OutOfPocketRequest not found");
            } else if(com.mazars.management.db.domain.InvoiceRequestPacket.Status.SUSPENDED.equals(outOfPocketRequest.getStatus())) {
                throw new Exception("OutOfPocketRequest status is SUSPENDED");
            } else if(com.mazars.management.db.domain.InvoiceRequestPacket.Status.ACTIVE.equals(outOfPocketRequest.getStatus())) {
                throw new Exception("OutOfPocketRequest status is neither LOCKED nor CLOSED");
            } else if(OutOfPocketItem.Type.NO.equals(outOfPocketRequest.getType())) {
                throw new Exception("OutOfPocketRequest type is NO");  
            }
            
            CalendarUtil.truncateTime(date);
            
            OutOfPocketItem outOfPocketItem = outOfPocketRequest.getProjectCode().getOutOfPocketItem();
            if(outOfPocketItem == null) {
                outOfPocketItem = new OutOfPocketItem();
                outOfPocketItem.setProjectCode(outOfPocketRequest.getProjectCode());
            }
            outOfPocketItem.setType(outOfPocketRequest.getType());
            if(OutOfPocketItem.Type.LIMITED.equals(outOfPocketItem.getType())) {
                outOfPocketItem.setAmount(outOfPocketRequest.getAmount());
                outOfPocketItem.setCurrency(outOfPocketRequest.getCurrency());            
            } else {
                outOfPocketItem.setAmount(null);
                outOfPocketItem.setCurrency(null);            
            }
            if(! outOfPocketItem.hasOutOfPocketInvoices()) {
                outOfPocketItem.setOutOfPocketInvoiceCurrency(currency);
            }
            if(! outOfPocketItem.hasOutOfPocketPayments()) {
                outOfPocketItem.setOutOfPocketPaymentCurrency(currency);
            }
            outOfPocketItem.setOutOfPocketActCurrency(currency);
            
            hs.save(outOfPocketItem);
            
            OutOfPocketAct outOfPocketAct = null;
            for(OutOfPocketAct tmpOutOfPocketAct : outOfPocketItem.getOutOfPocketActs()) {
                if(tmpOutOfPocketAct.getReference() != null && tmpOutOfPocketAct.getReference().equals(reference)) {
                    outOfPocketAct = tmpOutOfPocketAct;
                    break;
                }
            }
            if(outOfPocketAct == null) {
                outOfPocketAct = new OutOfPocketAct();
                outOfPocketAct.setOutOfPocketItem(outOfPocketItem);
                outOfPocketAct.setReference(reference);
                outOfPocketAct.setIsSigned(Boolean.FALSE);
            }
            outOfPocketAct.setAmount(amount);
            outOfPocketAct.setCvAmount(cvAmount);
            outOfPocketAct.setDate(date);
            SimpleDateFormat longDateFormatter = new SimpleDateFormat("yyyyMMddHHmmss");
            String stamp = currentUser.getUserName() + "_" + longDateFormatter.format(new Date());
            outOfPocketAct.setStamp(stamp);
            hs.save(outOfPocketAct);
            
            OutOfPocketRequestHistoryItem outOfPocketRequestHistoryItem = new OutOfPocketRequestHistoryItem();
            outOfPocketRequestHistoryItem.setEmployee(currentUser);
            outOfPocketRequestHistoryItem.setStatus(com.mazars.management.db.domain.InvoiceRequestPacket.Status.CLOSED);
            outOfPocketRequestHistoryItem.setTime(now);
            outOfPocketRequestHistoryItem.setComment("OutOfPocketRequest updated in putOutOfPocketRequestActData");
            outOfPocketRequestHistoryItem.setOutOfPocketRequest(outOfPocketRequest);
            hs.save(outOfPocketRequestHistoryItem);

            hs.getTransaction().commit();
        } catch (Exception e) {
            hs.getTransaction().rollback();
            throw e;
        }
    }    
    
    @WebMethod(operationName = "putOutOfPocketPaymentData")
    public void putOutOfPocketPaymentData(
            @WebParam(name = "userName", targetNamespace = "http://services.webservices.management.mazars.com/") String userName,
            @WebParam(name = "password", targetNamespace = "http://services.webservices.management.mazars.com/") String password,
            @WebParam(name = "projectCode", targetNamespace = "http://services.webservices.management.mazars.com/") String projectCode,
            @WebParam(name = "invoiceReference", targetNamespace = "http://services.webservices.management.mazars.com/") String invoiceReference,
            @WebParam(name = "reference", targetNamespace = "http://services.webservices.management.mazars.com/") String reference,
            @WebParam(name = "date", targetNamespace = "http://services.webservices.management.mazars.com/") Calendar date,
            @WebParam(name = "amount", targetNamespace = "http://services.webservices.management.mazars.com/") BigDecimal amount,
            @WebParam(name = "currencyCode", targetNamespace = "http://services.webservices.management.mazars.com/") String currencyCode,
            @WebParam(name = "cvAmount", targetNamespace = "http://services.webservices.management.mazars.com/") BigDecimal cvAmount
            ) throws Exception {

        Date now = new Date();
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        try {
            hs.beginTransaction();
            
            AccessChecker accessChecker = new AccessChecker();
            Employee currentUser = accessChecker.authenticate(userName, password);
            Module module = Module.getByName("Financial Information Report");
            AccessChecker.Status status = accessChecker.check(currentUser, module);
            if(! AccessChecker.Status.VALID.equals(status)) {
                throw new Exception("Authorization status is " + status + ".");
            }
            
            if(projectCode == null || "".equals(projectCode.trim())) {
                throw new Exception("projectCode is not set");
            }
            if(reference == null || "".equals(reference.trim())) {
                throw new Exception("reference is not set");
            }
            if(date == null) {
                throw new Exception("date is not set");
            }
            if(amount == null) {
                throw new Exception("amount is not set");
            }
            if(cvAmount == null) {
                throw new Exception("cvAmount is not set");
            }
            Currency currency = null;
            if(currencyCode == null || "".equals(currencyCode.trim())) {
                throw new Exception("currencyCode is not set");
            } else {
                currency = Currency.getByCode(currencyCode);
                if(currency == null) {
                    throw new Exception("currencyCode is not good. Use 3 digits currency code.");
                }
            }           
            ProjectCode project = ProjectCode.getByCode(projectCode);
            if(project == null) {
                throw new Exception("project not found");
            }
            if(Employee.Profile.COUNTRY_ADMINISTRATOR.equals(currentUser.getProfile())) {
                Country country = currentUser.getCountry();
                Country projectCodeCountry = project.getSubdepartment().getDepartment().getOffice().getCountry();
                if(! country.getId().equals(projectCodeCountry.getId())) {
                    throw new Exception("projectCode of other country");
                }
            } else if(Employee.Profile.SUPER_USER.equals(currentUser.getProfile())) {
                Subdepartment projectCodeSubdepartment = project.getSubdepartment();
                if(! RightsItem.isAvailable(projectCodeSubdepartment, currentUser, module)) {
                    throw new Exception("No rights to the subdepartment of this projectCode");
                }
            }
            
            CalendarUtil.truncateTime(date);
            
            OutOfPocketItem outOfPocketItem = project.getOutOfPocketItem();
            if(outOfPocketItem == null) {
                outOfPocketItem = new OutOfPocketItem();
                outOfPocketItem.setProjectCode(project);
            }
            outOfPocketItem.setType(OutOfPocketItem.Type.FULL);
            if(OutOfPocketItem.Type.LIMITED.equals(outOfPocketItem.getType())) {
                OutOfPocketRequest outOfPocketRequest = project.getOutOfPocketRequest();
                if(outOfPocketRequest != null) {
                    outOfPocketItem.setAmount(outOfPocketRequest.getAmount());
                    outOfPocketItem.setCurrency(outOfPocketRequest.getCurrency());
                }
            } else {
                outOfPocketItem.setAmount(null);
                outOfPocketItem.setCurrency(null);            
            }
            if(! outOfPocketItem.hasOutOfPocketInvoices()) {
                outOfPocketItem.setOutOfPocketInvoiceCurrency(currency);
            }
            if(! outOfPocketItem.hasOutOfPocketActs()) {
                outOfPocketItem.setOutOfPocketActCurrency(currency);
            }
            outOfPocketItem.setOutOfPocketPaymentCurrency(currency);
            
            hs.save(outOfPocketItem);
            
            OutOfPocketPayment outOfPocketPayment = null;
            for(OutOfPocketPayment tmpOutOfPocketPayment : outOfPocketItem.getOutOfPocketPayments()) {
                if(tmpOutOfPocketPayment.getReference() != null && tmpOutOfPocketPayment.getReference().equals(reference)) {
                    outOfPocketPayment = tmpOutOfPocketPayment;
                    break;
                }
            }
            if(outOfPocketPayment == null) {
                outOfPocketPayment = new OutOfPocketPayment();
                outOfPocketPayment.setOutOfPocketItem(outOfPocketItem);
                outOfPocketPayment.setReference(reference);
            }
            outOfPocketPayment.setInvoiceReference(invoiceReference);
            outOfPocketPayment.setAmount(amount);
            outOfPocketPayment.setCvAmount(cvAmount);
            outOfPocketPayment.setDate(date);
            SimpleDateFormat longDateFormatter = new SimpleDateFormat("yyyyMMddHHmmss");
            String stamp = currentUser.getUserName() + "_" + longDateFormatter.format(new Date());
            outOfPocketPayment.setStamp(stamp);
            hs.save(outOfPocketPayment);

            hs.getTransaction().commit();
        } catch (Exception e) {
            hs.getTransaction().rollback();
            throw e;
        }
    }       
}
